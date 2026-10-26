# dsh-usage-cost

English | [中文](README.zh.md)

A DeepSeek Harness plugin that shows API usage, estimated cost, the live peak/off-peak billing window, and the DeepSeek account balance beside the Web UI sidebar footer.

## UI

- **Sidebar entry** (expanded sidebar) shows two lines:
  - `API usage` + peak/off-peak badge + bonus-credit badge (`Bonus $X`);
  - today's tokens · estimated cost · wallet balance.
- **Collapsed rail**: icon plus a peak/off-peak dot (green = off-peak, orange = peak).
- **Popup card**:
  - today / last 7 days / all time, each with tokens and `≈$cost`;
  - the billing badge next to the title and a countdown to the next switch;
  - input / output / cache hit / cache write, plus the top models with tokens, calls, and cost;
  - account balance and bonus wallets (with an unpriced-model note) and a link to the usage center;
  - first-run scan progress for historical session logs.

## Install

```sh
dsh plugin --profile <profile> add dsh-usage-cost
```

or install it from the Harness plugin manager. Requires Node.js ≥ 22 and DSH `>=0.2.0 <0.3.0`.

The bundle inserts its own `usage` row; no extra configuration is required.

## Where the numbers come from

- **Tokens**: the Host reads `sessionPersistence` and folds the provider-reported `usage` of every `assistant/message` event into per-local-day, per-model, peak/off-peak counters. Events below `inheritedEventCount` are skipped so forked/seed prefixes are not counted twice.
- **Cost**: the same counters are priced per model with the peak or off-peak list price. Defaults are DeepSeek's official USD prices per 1M tokens for `deepseek-flash` (including the legacy `deepseek-v4-flash` and `deepseek-v4-flash-vision-exp` names) and `deepseek-v4-pro`.
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

## License

MIT
