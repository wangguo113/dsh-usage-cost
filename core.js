/**
 * Pure usage/cost helpers shared by the Host half.
 *
 * Everything here is independent of Cordis and the filesystem so it can be unit
 * tested directly. Usage is kept per local day and model, split into DeepSeek's
 * peak and off-peak billing windows, and priced at read time from the list
 * prices in force.
 */

/** DeepSeek peak hours in UTC, Monday through Friday. */
export const PEAK_WINDOWS_UTC = [
  [1, 4],
  [6, 10],
]

/**
 * Official DeepSeek list prices in USD per 1M tokens, peak / off-peak.
 * Legacy model names are still accepted by the API and billed at the Flash price.
 * Override any model through `pricing.json`.
 */
export const DEFAULT_PRICING = {
  currency: 'USD',
  unitTokens: 1_000_000,
  models: {
    'deepseek-flash': {
      input: { peak: 0.3, offPeak: 0.15 },
      cacheHit: { peak: 0.006, offPeak: 0.003 },
      output: { peak: 1.2, offPeak: 0.6 },
    },
    'deepseek-v4-flash': {
      input: { peak: 0.3, offPeak: 0.15 },
      cacheHit: { peak: 0.006, offPeak: 0.003 },
      output: { peak: 1.2, offPeak: 0.6 },
    },
    'deepseek-v4-flash-vision-exp': {
      input: { peak: 0.3, offPeak: 0.15 },
      cacheHit: { peak: 0.006, offPeak: 0.003 },
      output: { peak: 1.2, offPeak: 0.6 },
    },
    'deepseek-v4-pro': {
      input: { peak: 1.32, offPeak: 0.66 },
      cacheHit: { peak: 0.044, offPeak: 0.022 },
      output: { peak: 3.96, offPeak: 1.98 },
    },
  },
}

/** Local calendar day key, `YYYY-MM-DD`. */
export function dayKey(ms) {
  const date = new Date(ms)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${date.getFullYear()}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
}

/** Whether one instant bills at the DeepSeek peak rate. Chinese public holidays are not modelled. */
export function isPeak(ms) {
  const date = new Date(ms)
  const weekday = date.getUTCDay()
  if (weekday === 0 || weekday === 6) return false
  const hour = date.getUTCHours()
  return (hour >= 1 && hour < 4) || (hour >= 6 && hour < 10)
}

/** The billing window in force at `now`, plus when it next changes. */
export function billingInfo(now) {
  const peak = isPeak(now)
  const step = 60_000
  const limit = now + 14 * 86_400_000
  let nextChangeAt = 0
  for (let cursor = Math.floor(now / step) * step + step; cursor < limit; cursor += step) {
    if (isPeak(cursor) !== peak) {
      nextChangeAt = cursor
      break
    }
  }
  return { peak, peakWindowsUtc: PEAK_WINDOWS_UTC, nextChangeAt }
}

/** @typedef {ReturnType<typeof emptyUsage>} UsageCounters */

export function emptyUsage() {
  return { requests: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, total: 0 }
}

/** @param {Record<string, number>} target @param {Record<string, number | undefined>} source */
export function addCounters(target, source) {
  target.requests += source.requests || 0
  target.input += source.input || 0
  target.output += source.output || 0
  target.cacheRead += source.cacheRead || 0
  target.cacheWrite += source.cacheWrite || 0
  target.reasoning += source.reasoning || 0
  target.total += source.total || 0
}

/** @param {Record<string, number>} bucket @param {Record<string, any>} usage */
export function addUsage(bucket, usage) {
  const input = typeof usage.inputTokens === 'number' ? usage.inputTokens : 0
  const output = typeof usage.outputTokens === 'number' ? usage.outputTokens : 0
  const reported = typeof usage.totalTokens === 'number' ? usage.totalTokens : 0
  bucket.requests += 1
  bucket.input += input
  bucket.output += output
  bucket.cacheRead += typeof usage.cacheReadTokens === 'number' ? usage.cacheReadTokens : 0
  bucket.cacheWrite += typeof usage.cacheWriteTokens === 'number' ? usage.cacheWriteTokens : 0
  bucket.reasoning += typeof usage.reasoningTokens === 'number' ? usage.reasoningTokens : 0
  bucket.total += reported > 0 ? reported : input + output
}

/**
 * Fold one durable session event into `entry`.
 * @param {{ days: Record<string, Record<string, { peak: UsageCounters, off: UsageCounters }>> }} entry
 * @param {any} event
 * @returns {boolean} whether the event carried usage
 */
export function foldEvent(entry, event) {
  if (!event || event.type !== 'assistant/message') return false
  const data = event.data || {}
  const usage = data.usage
  if (!usage || typeof usage !== 'object') return false
  const time = typeof event.time === 'number' ? event.time : Date.now()
  const day = dayKey(time)
  const source = (data.message && data.message.source) || {}
  const model =
    typeof source.model === 'string' && source.model
      ? source.model
      : typeof source.provider === 'string' && source.provider
        ? source.provider
        : 'unknown'
  const dayModels = entry.days[day] || (entry.days[day] = {})
  const slot = dayModels[model] || (dayModels[model] = { peak: emptyUsage(), off: emptyUsage() })
  addUsage(isPeak(time) ? slot.peak : slot.off, usage)
  return true
}

/**
 * Fold a batch of stored events, skipping the inherited seed prefix.
 * @param {{ days: Record<string, any> }} entry
 * @param {readonly any[]} events
 * @param {number} inherited events with a lower seq belong to a forked/seed prefix
 * @returns {number} number of usage-bearing events folded
 */
export function foldEvents(entry, events, inherited) {
  let folded = 0
  for (const event of events) {
    if (typeof event.seq === 'number' && event.seq < inherited) continue
    if (foldEvent(entry, event)) folded += 1
  }
  return folded
}

/** Normalize a price side: a number means the same rate for peak and off-peak. */
export function normalizeSide(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return { peak: value, offPeak: value }
  if (value && typeof value === 'object') {
    const peak = typeof value.peak === 'number' ? value.peak : 0
    const offPeak = typeof value.offPeak === 'number' ? value.offPeak : peak
    return { peak, offPeak }
  }
  return undefined
}

/**
 * Merge a user price sheet over the built-in list prices.
 * Unknown models are kept, missing sides fall back, invalid entries are skipped.
 */
export function mergePricing(raw, base) {
  if (!raw || typeof raw !== 'object') return base
  const merged = {
    currency: typeof raw.currency === 'string' ? raw.currency : base.currency,
    unitTokens: typeof raw.unitTokens === 'number' ? raw.unitTokens : base.unitTokens,
    models: { ...base.models },
  }
  for (const [model, price] of Object.entries(raw.models || {})) {
    if (!price || typeof price !== 'object') continue
    const input = normalizeSide(price.input)
    const output = normalizeSide(price.output)
    const cacheHit = normalizeSide(price.cacheHit) || input
    if (!input || !cacheHit || !output) continue
    merged.models[model] = { input, cacheHit, output }
  }
  return merged
}

/**
 * Price one model's peak and off-peak counters.
 * @param {UsageCounters} peak
 * @param {UsageCounters} off
 * @param {{ input: { peak: number, offPeak: number }, cacheHit: { peak: number, offPeak: number }, output: { peak: number, offPeak: number } }} price
 * @param {number} unitTokens
 * @returns {number} cost in `currency` units
 */
export function costOfSlot(peak, off, price, unitTokens = 1_000_000) {
  const p = peak || emptyUsage()
  const o = off || emptyUsage()
  return (
    ((p.input + p.cacheWrite) / unitTokens) * price.input.peak +
    ((o.input + o.cacheWrite) / unitTokens) * price.input.offPeak +
    (p.cacheRead / unitTokens) * price.cacheHit.peak +
    (o.cacheRead / unitTokens) * price.cacheHit.offPeak +
    (p.output / unitTokens) * price.output.peak +
    (o.output / unitTokens) * price.output.offPeak
  )
}
