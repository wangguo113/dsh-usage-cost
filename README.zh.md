# dsh-usage-cost

[English](README.md) | 中文

DeepSeek Harness 插件：在 Web UI 侧栏底部展示 API 用量、费用估算、当前高峰/低峰计费时段和 DeepSeek 账户余额。

## 界面

- **侧栏入口**（展开时）直接显示两行：
  - 第一行：`API 用量` + 高峰/低峰徽标 + 赠送额度徽标（`赠$X`）；
  - 第二行：今日 tokens · ≈今日费用 · 钱包余额。
- **窄栏**：图标 + 峰/谷小色点（绿=低峰，橙=高峰）。
- **点开的浮动卡片**：
  - 今日 / 近 7 天 / 总计三档，每档 tokens 用量与 `≈$费用`；
  - 高峰/低峰徽标在标题旁，调用次数一行显示距下次切换的倒计时；
  - 输入 / 输出 / 缓存命中 / 缓存写入、按模型（总计）的 tokens/调用/费用 Top 4；
  - 账户余额与赠送额度（逐钱包，含未计价模型提示）、跳转「用量中心」的链接；
  - 首次扫描历史会话日志的进度。

## 安装

```sh
dsh plugin --profile <profile> add dsh-usage-cost
```

或在 Harness 的插件管理界面里安装。要求 Node.js ≥ 22、DSH `>=0.2.0 <0.3.0`。

npm 包发布前，可以从 GitHub Release 的 tarball 或直接从 Git 安装：

```sh
# Release tarball，直接按 URL 安装
dsh plugin --profile <profile> add https://github.com/wangguo113/dsh-usage-cost/releases/download/v1.3.0/dsh-usage-cost-1.3.0.tgz

# 或下载资产后本地安装
dsh plugin --profile <profile> add ./dsh-usage-cost-1.3.0.tgz

# 或直接从 Git 安装（建议锁 commit；这个 bundle 没有构建步骤）
dsh plugin --profile <profile> add github:wangguo113/dsh-usage-cost#<commit>
```

安装后插件自带一个 `usage` 行，无需额外配置。

## 数据来源

- **token 用量**：Host 侧读取 `sessionPersistence`，把每个会话 `assistant/message` 事件里 provider 上报的 `usage` 折叠成「本地日期 × 模型 × 峰/谷」计数；按 `inheritedEventCount` 跳过 fork/seed 继承来的事件，避免重复计数。
- **费用**：同一份计数按模型价格分别乘峰价 / 谷价。默认价格是 DeepSeek 官方列表价（USD / 百万 tokens）：`deepseek-flash`（含 `deepseek-v4-flash`、`deepseek-v4-flash-vision-exp` 旧名）与 `deepseek-v4-pro`。
- **峰谷规则**：官方高峰时段为 UTC 01:00–04:00、06:00–10:00（周一至周五），折算北京时间 09:00–12:00、14:00–18:00；其余时段与周末半价。中国法定节假日未纳入判定。
- **余额**：`deepseekAccount` 的账户状态与钱包余额；未登录时卡片显示提示。
- **增量与缓存**：每个会话记录已折叠的事件数，缓存写到 `$DSH_HOME/cache/dsh-usage/usage-cache.json`；之后每次只读新增的尾部事件。

## 自定义价格

新建 `$DSH_HOME/cache/dsh-usage/pricing.json`（`$DSH_HOME` 默认 `~/.dsh`）：

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

- 每个价格项可写成数字（峰谷同价）或 `{ "peak": n, "offPeak": n }`；
- 只写想覆盖的模型，其余沿用内置官方价；
- 改完刷新页面即可生效，不需要重扫日志。

## 结构

| 文件 | 作用 |
|---|---|
| `index.js` | Host 半：折叠会话日志、峰谷分桶、成本计算、`/api-dsh-usage/snapshot` 只读 JSON 路由（沿用 Connection 的鉴权检查） |
| `core.js` | 纯函数：日期/峰谷判定、计数折叠、价格合并与费用计算（可单测） |
| `client.js` | Client 半：`sidebar.footer.action` 入口 + `shell.overlay` 浮动卡片 |
| `cordis.patch.yml` | Bundle patch，插入 `usage` 行 |
| `locale/*.json` | 插件清单标题与描述 |
| `icon.svg` | 插件图标 |
| `test/*.test.mjs` | 纯函数单测 + Host 路由集成测试（`npm test`） |

## 已知限制

- 首次冷启动（或缓存版本升级）需要扫描本机会话日志，300MB+ 的历史会有一次几十秒的后台扫描，期间卡片显示进度。
- 只统计 provider 上报了 usage 的模型回复，重试中的失败请求不计入调用次数。
- 费用是按官方列表价估算，不是账单金额。
- 余额需要已登录 DeepSeek 账户；只配 API Key 的部署会显示未登录提示。

## 发布

通过 GitHub Actions 携带 provenance 发布到 npm（`.github/workflows/publish.yml`）：

1. 在仓库设置里加 secret `NPM_TOKEN`（npm 的 automation token）。
2. 改 `package.json` 的 `version` 并提交，然后推 tag：

   ```sh
   git tag v1.3.0 && git push origin v1.3.0
   ```

工作流会先跑 `npm test` 再执行 `npm publish --provenance`。也可以在有 npm 登录态的机器上手动发布：

```sh
git clone https://github.com/wangguo113/dsh-usage-cost.git
cd dsh-usage-cost && npm publish
```

## 关于上游化

把这份实现变成官方第一方包的讨论稿在 [docs/upstream-official-package.md](docs/upstream-official-package.md)：包含与官方惯例的差距分析、建议的包拆分和待 maintainer 决策的问题。

## License

MIT
