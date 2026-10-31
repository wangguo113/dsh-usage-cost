/**
 * Host half of the usage bundle.
 *
 * Folds durable session logs into token and cost buckets (today / last 7 days /
 * all time), and serves one read-only JSON route the browser half reads.
 *
 * Each session keeps the number of persisted events already folded, so a warm
 * cache only reads each log's new tail. Usage is stored per local day and model,
 * split into peak and off-peak counters, so cost is priced at read time.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'
import {
  DEFAULT_PRICING,
  addCounters,
  billingInfo,
  costOfSlot,
  dayKey,
  emptyUsage,
  foldEvents,
  isFreeUsage,
  mergePricing,
} from './core.js'

const ROUTE_PATH = '/api-dsh-usage/snapshot'
const CACHE_VERSION = 3
const HOST_REVISION = 4
const READ_BATCH = 6000
const BALANCE_TTL_MS = 60_000
const PASS_MIN_INTERVAL_MS = 15_000

/** @param {unknown} error */
function messageOf(error) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'unknown-error'
}

/** @returns {Promise<void>} */
function yieldToLoop() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

function stateRoot() {
  const base = process.env.DSH_HOME || (process.env.DSH_PROFILE_DIR && dirname(process.env.DSH_PROFILE_DIR)) || join(homedir(), '.dsh')
  return join(base, 'cache', 'dsh-usage')
}

function cachePath() {
  return join(stateRoot(), 'usage-cache.json')
}

function pricingPath() {
  return join(stateRoot(), 'pricing.json')
}

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {Record<string, unknown>} [pluginConfig]
 */
export function apply(ctx, pluginConfig) {
  const config = pluginConfig || {}
  const state = {
    loaded: false,
    changed: false,
    lastPassAt: 0,
    pricing: /** @type {any} */ (DEFAULT_PRICING),
    sessions: /** @type {Map<string, { count: number, inherited: number, days: Record<string, Record<string, { peak: Record<string, number>, off: Record<string, number> }>> }>} */ (new Map()),
    scan: { running: false, done: 0, total: 0, startedAt: 0, finishedAt: 0, error: null },
    balance: { at: 0, value: /** @type {unknown} */ (null), fetching: false },
  }
  const readBatch = Number.isFinite(config.readBatch) && config.readBatch > 0 ? Math.floor(config.readBatch) : READ_BATCH
  const passIntervalMs =
    Number.isFinite(config.passIntervalMs) && config.passIntervalMs >= 0 ? Math.floor(config.passIntervalMs) : PASS_MIN_INTERVAL_MS
  const maxModels = Number.isFinite(config.maxModels) && config.maxModels > 0 ? Math.floor(config.maxModels) : 8

  function persistence() {
    return ctx.get('sessionPersistence')
  }

  async function loadPricing() {
    state.pricing = DEFAULT_PRICING
    try {
      const raw = JSON.parse(await readFile(pricingPath(), 'utf8'))
      state.pricing = mergePricing(raw, DEFAULT_PRICING)
    } catch {
      /* no user override: official list prices */
    }
  }

  function priceFor(model) {
    return state.pricing.models[model]
  }

  function costOf(model, peak, off) {
    const price = priceFor(model)
    if (!price) return undefined
    return costOfSlot(peak, off, price, state.pricing.unitTokens || 1_000_000)
  }

  async function loadCache() {
    if (state.loaded) return
    state.loaded = true
    try {
      const raw = await readFile(cachePath(), 'utf8')
      const parsed = JSON.parse(raw)
      if (!parsed || parsed.version !== CACHE_VERSION || typeof parsed.sessions !== 'object') return
      if (parsed.revision !== HOST_REVISION) state.changed = true
      for (const [id, entry] of Object.entries(parsed.sessions)) {
        if (!entry || typeof entry !== 'object') continue
        const count = typeof entry.count === 'number' ? entry.count : 0
        if (count <= 0) continue
        state.sessions.set(id, {
          count,
          inherited: typeof entry.inherited === 'number' ? entry.inherited : 0,
          days: entry.days && typeof entry.days === 'object' ? entry.days : {},
        })
      }
    } catch {
      /* first run, or an unreadable cache: a full fold rebuilds it */
    }
  }

  let saving = /** @type {Promise<void> | null} */ (null)
  async function saveCache() {
    if (saving) return saving
    saving = (async () => {
      try {
        const sessions = {}
        for (const [id, entry] of state.sessions) {
          sessions[id] = { count: entry.count, inherited: entry.inherited, days: entry.days }
        }
        const file = cachePath()
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, JSON.stringify({ version: CACHE_VERSION, revision: HOST_REVISION, updatedAt: Date.now(), sessions }))
      } catch {
        /* a cache that cannot be written only costs a rescan next start */
      } finally {
        saving = null
      }
    })()
    return saving
  }

  function resetEntry(entry) {
    entry.count = 0
    entry.days = {}
    state.changed = true
  }

  async function foldSession(record) {
    const service = persistence()
    const id = record && record.header && record.header.id
    if (!service || !id) return
    const expected = typeof record.eventCount === 'number' ? record.eventCount : undefined
    let entry = state.sessions.get(id)
    if (!entry) {
      entry = { count: 0, inherited: 0, days: {} }
      state.sessions.set(id, entry)
    }
    if (expected !== undefined && entry.count > expected) resetEntry(entry)
    if (expected !== undefined && entry.count === expected) return
    const handle = await service.open(id, 'read')
    try {
      const inherited = typeof handle.inheritedEventCount === 'number' ? handle.inheritedEventCount : 0
      if (entry.count > 0 && inherited !== entry.inherited) resetEntry(entry)
      entry.inherited = inherited
      const startedAt = entry.count
      let offset = entry.count
      for (;;) {
        const result = await handle.read(offset, readBatch)
        const events = (result && result.events) || []
        if (events.length === 0) break
        foldEvents(entry, events, inherited)
        offset += events.length
        entry.count = offset
        if (events.length < readBatch) break
        await yieldToLoop()
      }
      if (entry.count !== startedAt) state.changed = true
    } finally {
      try {
        await handle.close()
      } catch {
        /* closing a read handle is best-effort */
      }
    }
  }

  async function runPass() {
    if (state.scan.running) return
    state.scan.running = true
    state.scan.done = 0
    state.scan.total = 0
    state.scan.startedAt = Date.now()
    state.scan.finishedAt = 0
    state.scan.error = null
    state.changed = false
    try {
      await loadCache()
      await loadPricing()
      const service = persistence()
      if (!service) {
        state.scan.error = 'session-persistence-unavailable'
        return
      }
      const records = await service.list()
      state.scan.total = records.length
      const seen = new Set()
      for (const record of records) {
        const id = record && record.header && record.header.id
        if (!id) continue
        seen.add(id)
        try {
          await foldSession(record)
        } catch (error) {
          state.scan.error = messageOf(error)
        }
        state.scan.done += 1
        if (state.scan.done % 25 === 0 && state.changed) await saveCache()
        await yieldToLoop()
      }
      for (const id of [...state.sessions.keys()]) {
        if (!seen.has(id)) {
          state.sessions.delete(id)
          state.changed = true
        }
      }
      if (state.changed) await saveCache()
    } catch (error) {
      state.scan.error = messageOf(error)
    } finally {
      state.scan.finishedAt = Date.now()
      state.scan.running = false
      state.lastPassAt = Date.now()
    }
  }

  let pass = /** @type {Promise<void> | null} */ (null)
  function ensurePass() {
    if (pass) return pass
    if (state.scan.running) return Promise.resolve()
    if (state.lastPassAt && Date.now() - state.lastPassAt < passIntervalMs) return Promise.resolve()
    pass = runPass().finally(() => {
      pass = null
    })
    return pass
  }

  function buildSnapshot(now) {
    const today = dayKey(now)
    const weekDays = new Set()
    for (let index = 0; index < 7; index += 1) weekDays.add(dayKey(now - index * 86_400_000))
    const scopes = {
      today: { usage: emptyUsage(), cost: 0 },
      last7: { usage: emptyUsage(), cost: 0 },
      total: { usage: emptyUsage(), cost: 0 },
    }
    const modelRows = new Map()
    const unpriced = new Map()
    let sessionCount = 0

    const accumulate = (scope, model, provider, slot) => {
      addCounters(scope.usage, slot.peak)
      addCounters(scope.usage, slot.off)
      if (isFreeUsage(state.pricing, provider, model)) return
      const cost = costOf(model, slot.peak, slot.off)
      if (cost === undefined) {
        const entry = unpriced.get(model) || { model, provider, requests: 0, total: 0 }
        entry.requests += (slot.peak.requests || 0) + (slot.off.requests || 0)
        entry.total += (slot.peak.total || 0) + (slot.off.total || 0)
        unpriced.set(model, entry)
        return
      }
      scope.cost += cost
    }

    for (const entry of state.sessions.values()) {
      sessionCount += 1
      for (const [day, dayModels] of Object.entries(entry.days)) {
        for (const [model, slot] of Object.entries(dayModels)) {
          const provider = typeof slot.provider === 'string' ? slot.provider : ''
          accumulate(scopes.total, model, provider, slot)
          if (day === today) accumulate(scopes.today, model, provider, slot)
          if (weekDays.has(day)) accumulate(scopes.last7, model, provider, slot)
          const row = modelRows.get(model) || {
            model,
            provider,
            usage: emptyUsage(),
            cost: 0,
            free: isFreeUsage(state.pricing, provider, model),
            priced: false,
          }
          if (!row.provider && provider) row.provider = provider
          row.free = row.free || isFreeUsage(state.pricing, row.provider, model)
          addCounters(row.usage, slot.peak)
          addCounters(row.usage, slot.off)
          const cost = row.free ? 0 : costOf(model, slot.peak, slot.off)
          if (cost !== undefined) row.cost += cost
          if (cost !== undefined) row.priced = true
          modelRows.set(model, row)
        }
      }
    }

    const models = [...modelRows.values()]
      .map((row) => ({
        model: row.model,
        provider: row.provider,
        free: row.free,
        cost: row.free ? 0 : row.priced ? Number(row.cost.toFixed(6)) : null,
        ...row.usage,
      }))
      .sort((left, right) => right.total - left.total)
      .slice(0, maxModels)

    return {
      ok: true,
      generatedAt: now,
      day: today,
      sessions: sessionCount,
      scan: {
        running: state.scan.running,
        done: state.scan.done,
        total: state.scan.total,
        startedAt: state.scan.startedAt,
        finishedAt: state.scan.finishedAt,
        error: state.scan.error,
      },
      buckets: {
        today: scopes.today.usage,
        last7: scopes.last7.usage,
        total: scopes.total.usage,
      },
      cost: {
        currency: state.pricing.currency || 'USD',
        estimated: true,
        unitTokens: state.pricing.unitTokens || 1_000_000,
        today: Number(scopes.today.cost.toFixed(6)),
        last7: Number(scopes.last7.cost.toFixed(6)),
        total: Number(scopes.total.cost.toFixed(6)),
        unpricedModels: [...unpriced.values()],
      },
      billing: billingInfo(now),
      models,
    }
  }

  async function fetchBalance(locale) {
    const account = ctx.get('deepseekAccount')
    if (!account) {
      return { available: false, signedIn: false, reason: 'account-service-unavailable' }
    }
    const client = {
      version: process.env.DSH_VERSION || '0.0.0',
      locale: typeof locale === 'string' && locale ? locale : 'zh',
      timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
    }
    try {
      const view = await account.getState()
      const links = view && view.links ? view.links : {}
      const value = {
        available: false,
        signedIn: Boolean(view && view.status === 'credential-stored'),
        links: { usageUrl: links.usageUrl, topUpUrl: links.topUpUrl },
        wallets: [],
        bonusWallets: [],
        reason: /** @type {string | undefined} */ (undefined),
      }
      if (!value.signedIn) {
        value.reason = 'signed-out'
        return value
      }
      const balance = await account.getBalance(client)
      if (balance && balance.status === 'ready') {
        value.available = true
        value.wallets = balance.value || []
        value.bonusWallets = balance.bonusWallets || []
      } else {
        value.reason = balance && balance.status === 'failed' ? 'balance-request-failed' : 'balance-unavailable'
      }
      return value
    } catch (error) {
      return { available: false, signedIn: false, reason: messageOf(error) }
    }
  }

  function balanceSnapshot(locale) {
    const fresh = state.balance.value && Date.now() - state.balance.at < BALANCE_TTL_MS
    if (!fresh && !state.balance.fetching) {
      state.balance.fetching = true
      fetchBalance(locale)
        .then((value) => {
          state.balance.value = value
          state.balance.at = Date.now()
        })
        .catch(() => {
          state.balance.value = { available: false, signedIn: false, reason: 'balance-unavailable' }
          state.balance.at = Date.now()
        })
        .finally(() => {
          state.balance.fetching = false
        })
    }
    return state.balance.value || { available: false, signedIn: false, pending: true }
  }

  function rejectRequest(req) {
    const connection = ctx.get('connection')
    if (!connection || typeof connection.requestRejection !== 'function') return undefined
    try {
      return connection.requestRejection({ headers: req.headers })
    } catch {
      return undefined
    }
  }

  function respond(res, status, body) {
    const payload = JSON.stringify(body)
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'content-length': String(Buffer.byteLength(payload)),
    })
    res.end(payload)
  }

  async function handleSnapshot(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return respond(res, 405, { ok: false, error: 'method-not-allowed' })
    }
    const rejection = rejectRequest(req)
    if (rejection) return respond(res, rejection, { ok: false, error: 'unauthorized' })
    let url
    try {
      url = new URL(req.url || '/', 'http://127.0.0.1')
    } catch {
      return respond(res, 400, { ok: false, error: 'bad-request' })
    }
    if (url.pathname !== ROUTE_PATH) return respond(res, 404, { ok: false, error: 'not-found' })
    const locale = url.searchParams.get('locale')
    ensurePass().catch(() => {})
    const snapshot = buildSnapshot(Date.now())
    const balance = balanceSnapshot(locale)
    if (req.method === 'HEAD') {
      res.writeHead(200, { 'cache-control': 'no-store' })
      return res.end()
    }
    respond(res, 200, { ...snapshot, balance })
  }

  ctx.effect(
    () => ctx.webServer.register({ kind: 'exact', path: ROUTE_PATH, handler: handleSnapshot }),
    'usage: snapshot route',
  )
}

export const inject = ['webServer']
