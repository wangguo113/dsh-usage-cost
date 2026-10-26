# Changelog

## 1.3.0

- Packaging release: unscoped public package name `dsh-usage-cost`, MIT license, `engines.node`/`engines.dsh`, README (English + Chinese), CHANGELOG.
- Split the pure fold/price helpers into `core.js` and added tests: unit tests for the day/peak rules, counter fold and cost math, plus a Host route integration test using a fake Cordis context (`npm test`).
- Host plugin accepts optional `readBatch` and `passIntervalMs` config values.

## 1.2.0

- Estimated cost from DeepSeek's official peak/off-peak list prices, with per-model costs and unpriced-model reporting.
- Current billing window (peak / off-peak) with a countdown to the next switch, shown in the card and directly in the sidebar entry.
- Account balance and bonus credit in the sidebar entry; platform balance strings are formatted like the account page (two decimals, grouping, `<0.01`).
- Cache format v2 stores usage per day, per model, split into peak and off-peak counters.

## 1.0.0

- Initial release: token usage (today / last 7 days / all time), per-model rows, account balance, incremental session-log cache, sidebar entry plus floating card.
