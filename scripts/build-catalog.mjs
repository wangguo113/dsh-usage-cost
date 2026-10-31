#!/usr/bin/env node
/**
 * Regenerate `pricing-catalog.js` from a provider price catalog.
 *
 * Source: the `dsh-cost-meter` package's `docs/provider-pricing.json` (USD per
 * 1M tokens, flat pricing; generated 2026-09-01 from OpenCode Zen/Go list
 * prices). Pass a different path as the first argument.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
const source =
  process.argv[2] || join(dshHome, 'profiles', 'web', 'node_modules', 'dsh-cost-meter', 'docs', 'provider-pricing.json')
const target = join(here, '..', 'pricing-catalog.js')

const document = JSON.parse(readFileSync(source, 'utf8'))
const provider = {}
const candidates = new Map()

for (const [providerId, entry] of Object.entries(document.providers || {})) {
  for (const [modelId, price] of Object.entries(entry.models || {})) {
    if (!price || typeof price.input !== 'number' || typeof price.output !== 'number') continue
    const side = (value) => ({ peak: value, offPeak: value })
    const value = {
      input: side(price.input),
      cacheHit: side(typeof price.cachedInput === 'number' ? price.cachedInput : price.input),
      output: side(price.output),
    }
    provider[`${providerId}:${modelId}`] = value
    if (!candidates.has(modelId)) candidates.set(modelId, [])
    candidates.get(modelId).push(value)
  }
}

// A model-only entry is useful only when every provider agrees (or only one lists it).
const model = {}
for (const [modelId, values] of candidates) {
  const unique = new Set(values.map((value) => JSON.stringify(value)))
  if (values.length === 1 || unique.size === 1) model[modelId] = values[0]
}

const header = `/**
 * Generated provider price catalog (USD per 1M tokens).
 *
 * Derived from the \`dsh-cost-meter\` catalog (\`docs/provider-pricing.json\`,
 * generated 2026-09-01 from OpenCode Zen/Go list prices). Prices are flat, so the
 * peak and off-peak sides are identical. Regenerate with
 * \`node scripts/build-catalog.mjs\`.
 */
`
const body = `\nexport const PROVIDER_PRICES = ${JSON.stringify(provider, null, 2)}\n\nexport const MODEL_PRICES = ${JSON.stringify(model, null, 2)}\n`
writeFileSync(target, header + body)
console.log(`wrote ${target}: ${Object.keys(provider).length} provider entries, ${Object.keys(model).length} model entries`)
