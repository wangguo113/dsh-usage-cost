import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_PRICING,
  addUsage,
  billingInfo,
  costOfSlot,
  dayKey,
  emptyUsage,
  foldEvents,
  isFreeUsage,
  isPeak,
  mergePricing,
} from '../core.js'

test('dayKey uses the local calendar day', () => {
  const local = new Date(2026, 9, 26, 23, 30, 0)
  assert.equal(dayKey(local.getTime()), '2026-10-26')
  const nextDay = new Date(2026, 9, 27, 0, 30, 0)
  assert.equal(dayKey(nextDay.getTime()), '2026-10-27')
})

test('isPeak follows the two weekday UTC windows', () => {
  // 2026-10-26 is a Monday.
  const utc = (hour, minute = 0, dayOffset = 0) => Date.UTC(2026, 9, 26 + dayOffset, hour, minute)
  assert.equal(isPeak(utc(0, 59)), false)
  assert.equal(isPeak(utc(1, 0)), true)
  assert.equal(isPeak(utc(3, 59)), true)
  assert.equal(isPeak(utc(4, 0)), false)
  assert.equal(isPeak(utc(5, 30)), false)
  assert.equal(isPeak(utc(6, 0)), true)
  assert.equal(isPeak(utc(9, 59)), true)
  assert.equal(isPeak(utc(10, 0)), false)
  // Saturday and Sunday are off-peak all day.
  assert.equal(isPeak(utc(2, 0, 5)), false)
  assert.equal(isPeak(utc(7, 0, 6)), false)
})

test('billingInfo reports the next transition inside a weekday', () => {
  const offPeak = billingInfo(Date.UTC(2026, 9, 26, 4, 30))
  assert.equal(offPeak.peak, false)
  assert.equal(offPeak.nextChangeAt, Date.UTC(2026, 9, 26, 6, 0))

  const peak = billingInfo(Date.UTC(2026, 9, 26, 2, 15))
  assert.equal(peak.peak, true)
  assert.equal(peak.nextChangeAt, Date.UTC(2026, 9, 26, 4, 0))
})

test('billingInfo keeps the weekend off-peak until Monday', () => {
  const fridayEvening = billingInfo(Date.UTC(2026, 9, 30, 12, 0))
  assert.equal(fridayEvening.peak, false)
  assert.equal(fridayEvening.nextChangeAt, Date.UTC(2026, 10, 2, 1, 0))
})

test('addUsage counts requests and falls back to input plus output', () => {
  const bucket = emptyUsage()
  addUsage(bucket, { inputTokens: 10, outputTokens: 5, cacheReadTokens: 7, cacheWriteTokens: 1, totalTokens: 15 })
  addUsage(bucket, { inputTokens: 2, outputTokens: 3 })
  assert.deepEqual(bucket, { requests: 2, input: 12, output: 8, cacheRead: 7, cacheWrite: 1, reasoning: 0, total: 20 })
})

test('foldEvent records the provider on the day/model slot', () => {
  const entry = { days: {} }
  foldEvents(entry, [{ seq: 0, type: 'assistant/message', time: Date.UTC(2026, 9, 26, 5, 0), data: { message: { source: { provider: 'ollama', model: 'qwen3:8b' } }, usage: { inputTokens: 10 } } }], 0)
  const day = entry.days[dayKey(Date.UTC(2026, 9, 26, 5, 0))]
  assert.equal(day['qwen3:8b'].provider, 'ollama')
  assert.equal(day['qwen3:8b'].off.requests, 1)
})

test('foldEvents splits peak and off-peak counters and skips inherited events', () => {
  const entry = { days: {} }
  const events = [
    { seq: 0, type: 'assistant/message', time: Date.UTC(2026, 9, 26, 2, 0), data: { message: { source: { model: 'deepseek-flash' } }, usage: { inputTokens: 999, totalTokens: 999 } } },
    { seq: 1, type: 'assistant/message', time: Date.UTC(2026, 9, 26, 2, 0), data: { message: { source: { model: 'deepseek-flash' } }, usage: { inputTokens: 100, totalTokens: 100 } } },
    { seq: 2, type: 'turn/start', time: Date.UTC(2026, 9, 26, 5, 0), data: {} },
    { seq: 3, type: 'assistant/message', time: Date.UTC(2026, 9, 26, 5, 0), data: { message: { source: { model: 'deepseek-v4-pro' } }, usage: { outputTokens: 40, totalTokens: 40 } } },
  ]
  assert.equal(foldEvents(entry, events, 1), 2)
  const day = entry.days[dayKey(Date.UTC(2026, 9, 26, 2, 0))]
  assert.equal(day['deepseek-flash'].peak.requests, 1)
  assert.equal(day['deepseek-flash'].off.requests, 0)
  assert.equal(day['deepseek-v4-pro'].off.requests, 1)
  assert.equal(day['deepseek-v4-pro'].peak.requests, 0)
  assert.equal(day['deepseek-flash'].peak.total, 100)
})

test('isFreeUsage treats local providers and globs as free', () => {
  assert.equal(isFreeUsage(DEFAULT_PRICING, 'ollama', 'qwen3:8b-nothink-16k'), true)
  assert.equal(isFreeUsage(DEFAULT_PRICING, 'deepseek-official', 'deepseek-v4-pro'), false)
  assert.equal(isFreeUsage({ ...DEFAULT_PRICING, freeModels: ['qwen3:*'] }, 'openai-codex', 'qwen3:14b'), true)
  assert.equal(isFreeUsage({ ...DEFAULT_PRICING, freeModels: ['gpt-5.5'] }, 'openai-codex', 'gpt-5.6-luna'), false)
})

test('mergePricing accepts a number shorthand and keeps unspecified models', () => {
  const merged = mergePricing(
    {
      currency: 'CNY',
      models: {
        'gpt-5.5': { input: 1.25, output: 10, cacheHit: 0.125 },
        broken: { input: {} },
      },
    },
    DEFAULT_PRICING,
  )
  assert.equal(merged.currency, 'CNY')
  assert.deepEqual(merged.models['gpt-5.5'], {
    input: { peak: 1.25, offPeak: 1.25 },
    output: { peak: 10, offPeak: 10 },
    cacheHit: { peak: 0.125, offPeak: 0.125 },
  })
  assert.equal(merged.models.broken, undefined)
  assert.deepEqual(merged.models['deepseek-v4-pro'], DEFAULT_PRICING.models['deepseek-v4-pro'])
  assert.deepEqual(merged.freeProviders, DEFAULT_PRICING.freeProviders)
  assert.deepEqual(merged.freeModels, DEFAULT_PRICING.freeModels)
})

test('costOfSlot prices peak and off-peak counters separately', () => {
  const peak = { ...emptyUsage(), input: 1_000_000, output: 1_000_000 }
  const off = { ...emptyUsage(), input: 1_000_000, output: 1_000_000 }
  const flash = DEFAULT_PRICING.models['deepseek-flash']
  assert.equal(costOfSlot(peak, off, flash), 1.5 + 0.75)
  const pro = DEFAULT_PRICING.models['deepseek-v4-pro']
  assert.equal(costOfSlot(peak, off, pro), 1.32 + 3.96 + 0.66 + 1.98)
})
