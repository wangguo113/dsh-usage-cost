# Upstream proposal: a first-party usage & cost surface

Status: draft for discussion. Nothing here is filed upstream yet.

- Reference implementation (third-party bundle): <https://github.com/wangguo113/dsh-usage-cost>
- Related upstream docs: [publish & install a bundle](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.zh.md), [plugin market index format](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-10-02-plugin-market-index-format.md)

## Why

Harness users who run on the DeepSeek API have no built-in way to see what they are spending: nothing in the Web UI shows today's or this month's token usage, the estimated cost, whether the current moment bills at the peak or off-peak rate, or the account balance. The data already exists in the session log (`assistant/message` carries provider `usage`), and the account balance is already exposed by `deepseekAccount`, so this is mostly a matter of choosing the right extension points.

A third-party bundle can cover the need today (the reference implementation below does), but a first-party surface would avoid every third-party author re-deriving the same rules incorrectly: peak/off-peak windows, legacy model-name → price mapping, cache-hit vs cache-miss pricing, and inherited fork/seed events.

## What the reference bundle does today

- Host half reads `sessionPersistence`, folds `assistant/message` usage into per-local-day, per-model, peak/off-peak counters, skips events below `inheritedEventCount`, caches the fold keyed by each session's persisted event count, and serves one read-only JSON route.
- Client half registers a `sidebar.footer.action` entry and a `shell.overlay` card through the slot system, renders with theme tokens, and localizes through `ctx.locale`.
- Cost uses the official USD list prices for `deepseek-flash` (plus legacy `deepseek-v4-flash` / `deepseek-v4-flash-vision-exp`) and `deepseek-v4-pro`, with peak/off-peak rates, overridable through a `pricing.json` file.
- Balance comes from `deepseekAccount.getBalance` / `getState`.

## Gap analysis: current approach vs. upstream conventions

| Area | Reference bundle | Upstream convention | Why it matters |
|---|---|---|---|
| Deriving per-session usage | Scans `sessionPersistence` and keeps its own on-disk cache | `ctx.sessionProjections` unit: pure `apply(state, event)`, same reference for ignored events, checkpointed by the projection cache | A cold start currently scans ~350 MB of logs in the background (tens of seconds). A projection unit makes the fold incremental and reusable by any client. |
| Cross-session aggregation ("today", "last 7 days", "all time") | Host keeps a global fold, rewritten per session tail | No upstream unit spans sessions; needs a decision (a Host-level aggregate service vs. client-side sum of per-session views) | Determines where the cheap incremental boundary sits. |
| Host → Client data | Ad-hoc `webServer` route that reuses `connection.requestRejection` for auth | Generated Remote / typert namespace, or `wire.view` on the projection | A generated contract gets typing, permission review, and one data path shared with agent tools. |
| Pricing | Constant table in `core.js` + optional `pricing.json` | Config/settings surface and a versioned price catalog | Prices change (and peak/off-peak already did); a stale table silently misreports cost. |
| Peak/off-peak windows | Two UTC windows, Monday–Friday; Chinese public holidays **not** modelled | Upstream can ship a holiday calendar | Billing is wrong on holidays, and only the platform knows the official calendar. |
| Model → price mapping | Exact-name match with legacy aliases; unknown models are reported as "unpriced" | Needs an authoritative mapping, ideally from the platform | New/retired model names are the most likely drift. |
| Balance | Host call to `deepseekAccount` plus a wallet formatter copied from the account page's rules | `ui-settings-account` already shows balances | Either reuse the account surface or accept a second presentation of the same data; product should decide. |
| Tests | 11 Node tests: pure fold/price/window units plus an HTTP-route integration test with a fake Cordis context | Per-package contract suites | Fine as a starting point, but upstream would want the projection contract suite too. |

## Proposed shape (for discussion, not a commitment)

1. **Host package** `@deepseek-ai/dsh-session-usage`
   - A `sessionProjections` unit that folds `assistant/message` usage into `{ day → model → { peak, off } }`, skipping inherited events;
   - `wire.view` so the client receives the fold without re-deriving it;
   - a Host-level aggregate that adds session views for "today / 7 days / all time" (or lets the client sum them).
2. **Client package** `@deepseek-ai/dsh-client-ui-usage`
   - Sidebar-footer entry plus a `shell.overlay` card (as today), or a settings section if maintainers prefer a deeper entry;
   - no hard-coded prices: read cost from the Host view.
3. **Pricing data** either
   - a small versioned catalog package maintained by DSH, with model aliases and peak/off-peak windows; or
   - a Config/settings field with the catalog shipped as a default and updated alongside releases.
4. **Balance**: decide between reusing the account settings surface (link out) or showing wallets in the usage card.

## Questions for maintainers

1. Is a usage/cost surface wanted as a first-party feature? If yes, is the sidebar the right home, or would Settings → Usage be preferred?
2. Should pricing live in a shipped data file, in Config, or be fetched from the platform?
3. Is excluding inherited (fork/seed) events the intended counting rule for "my usage"?
4. Should the aggregate span sessions on the Host, or should each session expose its own view and clients sum them?
5. Is there an official holiday calendar source for peak/off-peak, or is it explicitly out of scope?
6. Would you accept a PR for such a package, or should this stay a third-party bundle and be listed in a market index?

## Chinese summary

第三方 bundle（链接见顶部）已经能展示今日/近 7 天/总计的 tokens、按官方峰谷价估算的费用、当前计费时段和账户余额。但它的实现方式与官方惯例有差距：直接扫描 `sessionPersistence` 而不是用 `sessionProjections` 单元、自建 HTTP 路由而不是生成的 Remote 接口、价格与峰谷规则硬编码在包里（且未建模法定节假日）、跨会话聚合没有官方归属。这里把差距和可选的落地方案列出来，想先和 maintainer 确认产品方向，再决定是提 PR 还是留在第三方生态。
