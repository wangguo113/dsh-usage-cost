import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Point the plugin cache at a scratch directory before importing the Host half.
const home = mkdtempSync(join(tmpdir(), 'dsh-usage-test-'))
process.env.DSH_HOME = home

const { apply } = await import('../index.js')

function fakeRes() {
  const out = { status: 0, headers: {}, body: '' }
  return {
    out,
    writeHead(status, headers) {
      out.status = status
      out.headers = headers || {}
    },
    end(body) {
      if (typeof body === 'string') out.body += body
    },
  }
}

function frame(events, initialInherited = 1) {
  let inherited = initialInherited
  return {
    inheritedEventCount: inherited,
    async read(offset) {
      return { events: events.slice(offset), eventState: 'shared-frozen' }
    },
    async close() {},
  }
}

function mount({ records, events, inherited = 1, connection } = {}) {
  const routes = []
  const disposers = []
  const services = {
    sessionPersistence: {
      async list() {
        return records || [{ header: { id: 'session-test' }, eventCount: events.length }]
      },
      async open() {
        return frame(events, inherited)
      },
    },
  }
  if (connection) services.connection = connection
  const ctx = {
    effect(callback) {
      const dispose = callback()
      disposers.push(dispose)
      return dispose
    },
    get(name) {
      return services[name]
    },
    webServer: {
      register(route) {
        routes.push(route)
        return () => {}
      },
    },
  }
  apply(ctx, { passIntervalMs: 60000 })
  assert.equal(routes.length, 1)
  const handler = routes[0].handler
  return { handler, disposers }
}

async function readSnapshot(handler, url = '/api-dsh-usage/snapshot?locale=zh') {
  const res = fakeRes()
  await handler({ method: 'GET', url, headers: {} }, res)
  return { res, payload: res.out.body ? JSON.parse(res.out.body) : undefined }
}

async function waitForScan(handler) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const { payload } = await readSnapshot(handler)
    if (payload && payload.scan && !payload.scan.running && payload.scan.done >= payload.scan.total) return payload
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  throw new Error('scan did not finish')
}

const events = [
  // Inherited (fork/seed) usage: skipped.
  {
    seq: 0,
    type: 'assistant/message',
    time: Date.UTC(2026, 9, 26, 2, 0),
    data: { message: { source: { model: 'deepseek-flash' } }, usage: { inputTokens: 9_000_000, totalTokens: 9_000_000 } },
  },
  // Own usage at the Monday peak window.
  {
    seq: 1,
    type: 'assistant/message',
    time: Date.UTC(2026, 9, 26, 2, 30),
    data: { message: { source: { model: 'deepseek-flash' } }, usage: { inputTokens: 1_000_000, outputTokens: 1_000_000, totalTokens: 2_000_000 } },
  },
  // Own usage at the Monday off-peak window.
  {
    seq: 2,
    type: 'assistant/message',
    time: Date.UTC(2026, 9, 26, 5, 0),
    data: { message: { source: { model: 'deepseek-v4-pro' } }, usage: { inputTokens: 1_000_000, totalTokens: 1_000_000 } },
  },
]

test('serves folded usage, cost, and billing window over the snapshot route', async () => {
  const { handler } = mount({ events })
  const payload = await waitForScan(handler)

  assert.equal(payload.ok, true)
  assert.equal(payload.sessions, 1)
  assert.equal(payload.buckets.total.requests, 2)
  assert.equal(payload.buckets.total.total, 3_000_000)
  // flash peak 1M input + 1M output = 1.5, pro off-peak 1M input = 0.66
  assert.ok(Math.abs(payload.cost.total - 2.16) < 1e-9, `cost.total=${payload.cost.total}`)
  assert.equal(payload.billing.peak, false)
  assert.equal(typeof payload.billing.nextChangeAt, 'number')
  assert.ok(payload.models.some((row) => row.model === 'deepseek-v4-pro' && row.cost === 0.66))

  const cacheFile = join(home, 'cache', 'dsh-usage', 'usage-cache.json')
  assert.equal(existsSync(cacheFile), true)
  const cache = JSON.parse(readFileSync(cacheFile, 'utf8'))
  assert.equal(cache.version, 2)
  assert.equal(cache.sessions['session-test'].count, 3)
})

test('rejects requests refused by the connection service', async () => {
  const { handler } = mount({ events, connection: { requestRejection: () => 401 } })
  const { res, payload } = await readSnapshot(handler)
  assert.equal(res.out.status, 401)
  assert.equal(payload.error, 'unauthorized')
})

test('rejects unsupported methods and unknown paths', async () => {
  const { handler } = mount({ events })
  const post = fakeRes()
  await handler({ method: 'POST', url: '/api-dsh-usage/snapshot', headers: {} }, post)
  assert.equal(post.out.status, 405)

  const other = fakeRes()
  await handler({ method: 'GET', url: '/api-dsh-usage/other', headers: {} }, other)
  assert.equal(other.out.status, 404)
})
