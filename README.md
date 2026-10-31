# dsh-usage-cost

English | [中文](README.zh.md)

A DeepSeek Harness plugin that shows API usage, estimated cost, the live peak/off-peak billing window, and the DeepSeek account balance beside the Web UI sidebar footer.

## UI

- **Sidebar entry** (expanded sidebar) shows two lines; the peak/off-peak badge carries a live countdown to the next billing-window switch:
  - `API usage` + peak/off-peak badge + bonus-credit badge (`Bonus $X`);
  - today's tokens · estimated cost · wallet balance.
- **Collapsed rail**: icon plus a peak/off-peak dot (green = off-peak, orange = peak).
- **Popup card**:
  - today / last 7 days / all time, each with tokens and `≈$cost`;
  - the billing badge next to the title and a countdown to the next switch;
  - input / output / cache hit / cache write, plus the top models with tokens, calls, and cost;
  - account balance and bonus wallets (with an unpriced-model note), a **Top up** button that opens the platform top-up page, and a usage-center link;
  - first-run scan progress for historical session logs.

## Install

```sh
dsh plugin --profile <profile> add dsh-usage-cost
```

or install it from the Harness plugin manager. Requires Node.js ≥ 22 and DSH `>=0.2.0 <0.3.0`.

Until the npm package is published, install from a GitHub release tarball or straight from Git:

```sh
# release tarball, added by URL
dsh plugin --profile <profile> add https://github.com/wangguo113/dsh-usage-cost/releases/download/v1.3.0/dsh-usage-cost-1.3.0.tgz

# or download the asset first and add it locally
dsh plugin --profile <profile> add ./dsh-usage-cost-1.3.0.tgz

# or directly from Git (pin a commit; the bundle has no build step)
dsh plugin --profile <profile> add github:wangguo113/dsh-usage-cost#<commit>
```

The bundle inserts its own `usage` row; no extra configuration is required.

## Where the numbers come from

- **Tokens**: the Host reads `sessionPersistence` and folds the provider-reported `usage` of every `assistant/message` event into per-local-day, per-model, peak/off-peak counters. Events below `inheritedEventCount` are skipped so forked/seed prefixes are not counted twice.
- **Providers**: every model is counted, whatever provider served it, and each row shows its provider id (`deepseek-official`, `deepseek-account`, `openai-codex`, `ollama`, …). Local providers listed in `freeProviders` (default `["ollama"]`) and models matching `freeModels` cost 0 and are shown as *Free*; models without a price stay in the "unpriced" note and are excluded from cost.
- **Cost**: the same counters are priced per model with the peak or off-peak list price. The built-in catalog (`pricing-catalog.js`) lists DeepSeek's official peak/off-peak prices plus flat USD list prices for about 90 models across 16 providers (OpenAI, Anthropic, Google, Moonshot/Kimi, Z.ai, xAI, Alibaba, MiniMax, Tencent, xiaomi, Upstage, Meta, Meituan, NVIDIA, Mistral, OpenCode Go), matched through `providerAliases` such as `openai-codex → openai` or `zai-coding-cn → z-ai`.
- **Billing windows**: official peak hours are 01:00–04:00 and 06:00–10:00 UTC, Monday to Friday; everything else, including weekends, bills at half price. Chinese public holidays are not modelled.
- **Balance**: account state and wallets from `deepseekAccount`; signed-out deployments show a hint instead.
- **Incremental cache**: every session remembers how many persisted events were folded, so a warm cache only reads each log's new tail. The cache lives at `$DSH_HOME/cache/dsh-usage/usage-cache.json`.

## Custom prices

Create `$DSH_HOME/cache/dsh-usage/pricing.json` (`$DSH_HOME` defaults to `~/.dsh`):

```json
{
  "currency": "USD",
  "unitTokens": 1000000,
  "models": {
    "gpt-5.5": {
      "input": { "peak": 1.25, "offPeak": 1.25 },
      "cacheHit": { "peak": 0.125, "offPeak": 0.125 },
      "output": { "peak": 10, "offPeak": 10 }
    }
  }
}
```

- A price side may be a plain number (same rate peak and off-peak) or `{ "peak": n, "offPeak": n }`.
- `freeProviders` (default `["ollama"]`) and `freeModels` (globs such as `qwen3:*`) mark usage as free instead of unpriced.
- `providerAliases` maps a DSH provider id to a catalog provider id when the list price depends on the gateway.
- List only the models you want to override; everything else keeps the built-in list price.
- Refresh the page after editing; logs are not rescanned.

## Layout

| File | Purpose |
|---|---|
| `index.js` | Host half: session-log fold, peak/off-peak buckets, cost, `/api-dsh-usage/snapshot` read-only JSON route (keeps the Connection auth check) |
| `core.js` | Pure helpers: day/peak rules, counter fold, pricing merge and cost math (unit tested) |
| `client.js` | Client half: `sidebar.footer.action` entry and `shell.overlay` card |
| `cordis.patch.yml` | Bundle patch inserting the `usage` row |
| `locale/*.json` | Bundle title and description |
| `icon.svg` | Bundle icon |
| `test/*.test.mjs` | Unit tests plus a Host route integration test (`npm test`) |

## Known limits

- The first cold start (or a cache-version upgrade) scans local session logs in the background; a 300 MB+ history takes tens of seconds and the card shows progress meanwhile.
- Only model replies that carry provider usage are counted; failed retries do not add to the call count.
- Cost is an estimate from list prices, not a bill.
- The balance needs a signed-in DeepSeek account; API-key-only deployments show the signed-out hint.

## Publishing

Releases are published to npm with provenance from GitHub Actions (`.github/workflows/publish.yml`):

1. Add a repository secret `NPM_TOKEN` (an npm automation token for the `dsh-usage-cost` package or an account-level token).
2. Bump `version` in `package.json`, commit, then push a tag:

   ```sh
   git tag v1.3.0 && git push origin v1.3.0
   ```

The workflow runs `npm test` before `npm publish --provenance`. Alternatively, publish manually from an authenticated machine:

```sh
git clone https://github.com/wangguo113/dsh-usage-cost.git
cd dsh-usage-cost && npm publish
```

## Proposing this upstream

A discussion draft for making this a first-party Harness package (gap analysis against upstream conventions, proposed package split, and open questions) lives in [docs/upstream-official-package.md](docs/upstream-official-package.md).

## License

MIT
