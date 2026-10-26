/**
 * Browser half of the usage bundle.
 *
 * Adds one compact action beside Settings at the sidebar foot and one floating
 * card in the frame-wide overlay slot. The card reads its numbers from the Host
 * half's read-only snapshot route.
 */
window.__ModuleLoader__.load({
  id: 'dsh-usage-cost',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const ENDPOINT = '/api-dsh-usage/snapshot'
    const CARD_WIDTH = 344
    const POLL_OPEN_MS = 4000
    const POLL_CLOSED_MS = 120000

    const TEXT = {
      zh: {
        button: 'API 用量',
        title: 'API 用量与费用',
        today: '今日',
        week: '近 7 天',
        total: '总计',
        requests: '次调用',
        tokens: 'tokens',
        input: '输入',
        output: '输出',
        cacheRead: '缓存命中',
        cacheWrite: '缓存写入',
        reasoning: '推理',
        models: '按模型（总计）',
        balance: '账户余额',
        bonus: '赠送额度',
        signedOut: '未登录 DeepSeek 账户',
        signInHint: '在 设置 → 账户 登录后显示余额',
        openUsage: '打开用量中心',
        refresh: '刷新',
        close: '关闭',
        loading: '正在读取用量…',
        scanning: '正在读取历史会话',
        updated: '更新于',
        empty: '暂无用量记录',
        failed: '读取失败',
        sessions: '个会话',
        pending: '余额读取中…',
        peak: '高峰期',
        offPeak: '低峰期',
        billing: '计费时段',
        peakHint: '高峰时段：北京时间 09:00–12:00、14:00–18:00（周一至周五）；其余时段与周末按低峰半价。不含法定节假日。',
        switchIn: '距切换',
        costLabel: '费用估算',
        costNote: '费用按 DeepSeek 官方峰谷价估算',
        unpriced: '未计价模型',
        unpricedHint: '未在 pricing.json 配置价格的模型不计入费用',
        bonusShort: '赠',
      },
      en: {
        button: 'API usage',
        title: 'API usage & cost',
        today: 'Today',
        week: 'Last 7 days',
        total: 'All time',
        requests: 'calls',
        tokens: 'tokens',
        input: 'Input',
        output: 'Output',
        cacheRead: 'Cache hit',
        cacheWrite: 'Cache write',
        reasoning: 'Reasoning',
        models: 'By model (all time)',
        balance: 'Account balance',
        bonus: 'Bonus credit',
        signedOut: 'DeepSeek account not signed in',
        signInHint: 'Sign in under Settings → Account to show the balance',
        openUsage: 'Open usage center',
        refresh: 'Refresh',
        close: 'Close',
        loading: 'Reading usage…',
        scanning: 'Reading session history',
        updated: 'Updated',
        empty: 'No usage recorded yet',
        failed: 'Load failed',
        sessions: 'sessions',
        pending: 'Reading balance…',
        peak: 'Peak rate',
        offPeak: 'Off-peak',
        billing: 'Billing window',
        peakHint: 'Peak: 01:00–04:00 and 06:00–10:00 UTC, Mon–Fri. Everything else, including weekends, bills at half price. Chinese public holidays are not modelled.',
        switchIn: 'switch in',
        costLabel: 'Cost estimate',
        costNote: 'Estimated from the official DeepSeek peak/off-peak rates',
        unpriced: 'Unpriced models',
        unpricedHint: 'Models without a price in pricing.json are excluded from cost',
        bonusShort: 'Bonus',
      },
    }

    const store = {
      open: false,
      anchor: null,
      buttonEl: null,
      data: null,
      error: null,
      loading: false,
      fetchedAt: 0,
    }
    const listeners = new Set()

    function emit() {
      for (const listener of listeners) {
        try {
          listener()
        } catch {
          /* one broken subscriber must not stop the rest */
        }
      }
    }

    function subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }

    function useStore() {
      const [, force] = React.useState(0)
      React.useEffect(() => subscribe(() => force((value) => value + 1)), [])
      return store
    }

    let localeService = null

    function localeId() {
      try {
        const snapshot = localeService && localeService.getSnapshot ? localeService.getSnapshot() : null
        if (snapshot && snapshot.id) return snapshot.id
        const locale = localeService && localeService.getLocale ? localeService.getLocale() : null
        if (locale && locale.id) return locale.id
      } catch {
        /* fall through to navigator */
      }
      const navigatorLocale = typeof navigator === 'object' && navigator && navigator.language ? navigator.language : 'en'
      return /^zh/i.test(navigatorLocale) ? 'zh' : 'en'
    }

    function fallbackText(locale) {
      return /^zh/i.test(locale) ? TEXT.zh : TEXT.en
    }

    let translate = null

    function t(key) {
      if (translate) {
        try {
          const value = translate(key)
          if (typeof value === 'string' && value !== key) return value
        } catch {
          /* fall through */
        }
      }
      const dictionary = fallbackText(localeId())
      const value = dictionary[key]
      return typeof value === 'string' ? value : key
    }

    let inFlight = null

    function refresh() {
      if (inFlight) return inFlight
      store.loading = true
      emit()
      const params = new URLSearchParams({ locale: localeId() })
      inFlight = fetch(`${ENDPOINT}?${params.toString()}`, {
        headers: { accept: 'application/json' },
        credentials: 'same-origin',
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return response.json()
        })
        .then((data) => {
          store.data = data
          store.error = null
          store.fetchedAt = Date.now()
        })
        .catch((error) => {
          store.error = String((error && error.message) || error)
        })
        .finally(() => {
          store.loading = false
          inFlight = null
          emit()
        })
      return inFlight
    }

    function formatTokens(value) {
      const number = typeof value === 'number' && Number.isFinite(value) ? value : 0
      if (number >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(2)}B`
      if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(2)}M`
      if (number >= 1_000) return `${(number / 1_000).toFixed(1)}K`
      return String(Math.round(number))
    }

    function formatCount(value) {
      const number = typeof value === 'number' && Number.isFinite(value) ? value : 0
      try {
        return new Intl.NumberFormat(localeId()).format(Math.round(number))
      } catch {
        return String(Math.round(number))
      }
    }

    function currencySymbol(currency) {
      return currency === 'CNY' ? '¥' : '$'
    }

    function formatCost(value) {
      if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
      const currency = (store.data && store.data.cost && store.data.cost.currency) || 'USD'
      const symbol = currencySymbol(currency)
      if (value === 0) return `${symbol}0`
      if (value >= 1000) return `${symbol}${(value / 1000).toFixed(2)}K`
      if (value >= 10) return `${symbol}${value.toFixed(1)}`
      if (value >= 1) return `${symbol}${value.toFixed(2)}`
      if (value >= 0.01) return `${symbol}${value.toFixed(3)}`
      return `${symbol}${value.toFixed(4)}`
    }

    function formatTime(ms) {
      if (!ms) return ''
      try {
        return new Intl.DateTimeFormat(localeId(), { hour: '2-digit', minute: '2-digit' }).format(new Date(ms))
      } catch {
        return new Date(ms).toLocaleTimeString()
      }
    }

    function formatDuration(ms) {
      if (!(ms > 0)) return ''
      const totalMinutes = Math.max(1, Math.round(ms / 60_000))
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      if (hours <= 0) return `${minutes}m`
      if (minutes === 0) return `${hours}h`
      return `${hours}h ${minutes}m`
    }

    /**
     * Platform returns raw decimal strings, sometimes with long tails or
     * exponent notation (e.g. "0E-16"). Mirror the account UI formatting:
     * digit grouping, two decimals, positive amounts truncated to cents,
     * positive sub-cent amounts shown as "<0.01".
     */
    function formatBalanceAmount(value) {
      const text = typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : ''
      if (!text) return '—'
      const numeric = Number(text)
      if (!Number.isFinite(numeric)) return text
      const abs = Math.abs(numeric)
      if (abs === 0) return '0.00'
      if (numeric > 0 && abs < 0.01) return '<0.01'
      if (numeric < 0 && abs < 0.01) return '-0.01'
      const amount = numeric > 0 ? Math.trunc(numeric * 100) / 100 : Math.round(numeric * 100) / 100
      try {
        return new Intl.NumberFormat(localeId(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
      } catch {
        return amount.toFixed(2)
      }
    }

    function formatMoney(wallet) {
      if (!wallet) return ''
      return `${currencySymbol(wallet.currency)}${formatBalanceAmount(wallet.balance)}`
    }

    function primaryBalance(balance) {
      if (!balance || !balance.available) return ''
      const wallets = Array.isArray(balance.wallets) ? balance.wallets : []
      const funded = wallets.filter((wallet) => Number(wallet && wallet.balance) > 0)
      const pick = (funded.length > 0 ? funded : wallets)[0]
      if (pick) return formatMoney(pick)
      const bonus = Array.isArray(balance.bonusWallets) ? balance.bonusWallets : []
      return bonus.length > 0 ? formatMoney(bonus[0]) : ''
    }

    function bonusBalance(balance) {
      if (!balance || !balance.available) return ''
      const bonus = Array.isArray(balance.bonusWallets) ? balance.bonusWallets : []
      if (bonus.length === 0) return ''
      const funded = bonus.filter((wallet) => Number(wallet && wallet.balance) > 0)
      return formatMoney(funded[0] || bonus[0])
    }

    const CSS = `
.dsh-au-btn{display:inline-flex;align-items:center;gap:8px;padding:3px 8px;min-height:30px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;text-align:left;cursor:pointer;transition:background .12s ease,color .12s ease}
.dsh-au-btn:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);color:var(--dsw-alias-label-primary)}
.dsh-au-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dsh-au-btn-icon{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;flex:none}
.dsh-au-btn-body{display:flex;flex-direction:column;gap:1px;min-width:0}
.dsh-au-btn-line1{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;line-height:1.2;color:var(--dsw-alias-label-primary);white-space:nowrap}
.dsh-au-btn-line2{display:flex;align-items:center;gap:5px;font-size:10.5px;line-height:1.2;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;white-space:nowrap}
.dsh-au-btn-cost{color:var(--dsw-alias-label-primary);font-weight:600}
.dsh-au-btn-balance{color:var(--dsw-alias-label-primary);font-weight:600}
.dsh-au-btn-bonus{display:inline-flex;align-items:center;gap:3px;padding:0 4px;border-radius:999px;font-size:9.5px;font-weight:600;line-height:1.5;color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);white-space:nowrap}
.dsh-au-btn-sep{opacity:.45}
.dsh-au-btn-rail{justify-content:center;padding:0;width:30px;position:relative}
.dsh-au-rail-dot{position:absolute;right:3px;top:4px;width:6px;height:6px;border-radius:50%}
.dsh-au-rail-dot[data-peak='true']{background:var(--dsw-alias-state-warn-primary)}
.dsh-au-rail-dot[data-peak='false']{background:var(--dsw-alias-state-success-primary)}
.dsh-au-badge-sm{font-size:9.5px;padding:0 4px;line-height:1.5}
.dsh-au-card{position:fixed;pointer-events:auto;display:flex;flex-direction:column;gap:9px;box-sizing:border-box;padding:12px 14px 10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;box-shadow:0 14px 36px rgba(0,0,0,.22),0 2px 8px rgba(0,0,0,.12);font-size:12px;line-height:1.45}
.dsh-au-head{display:flex;align-items:center;gap:8px}
.dsh-au-title{font-size:13px;font-weight:600;flex:1}
.dsh-au-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit}
.dsh-au-iconbtn:hover{background:color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);color:var(--dsw-alias-label-primary)}
.dsh-au-tabs{display:flex;gap:4px;padding:2px;background:var(--dsw-alias-bg-layer-2);border-radius:8px}
.dsh-au-tab{flex:1;border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;padding:4px 0;border-radius:6px;cursor:pointer}
.dsh-au-tab[data-active='true']{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.dsh-au-hero{display:flex;align-items:baseline;gap:6px}
.dsh-au-hero-value{font-size:22px;font-weight:650;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.dsh-au-hero-unit{color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-au-hero-cost{margin-left:auto;font-size:14px;font-weight:650;font-variant-numeric:tabular-nums}
.dsh-au-hero-cost[data-muted='true']{color:var(--dsw-alias-label-secondary);font-weight:500}
.dsh-au-sub{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums}
.dsh-au-badge{display:inline-flex;align-items:center;gap:4px;padding:1px 6px;border-radius:999px;font-size:10px;font-weight:600;line-height:1.6;white-space:nowrap}
.dsh-au-badge[data-peak='true']{color:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 14%, transparent)}
.dsh-au-badge[data-peak='false']{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 14%, transparent)}
.dsh-au-rows{display:grid;grid-template-columns:1fr auto;gap:3px 12px}
.dsh-au-row-label{color:var(--dsw-alias-label-secondary)}
.dsh-au-row-value{text-align:right;font-variant-numeric:tabular-nums}
.dsh-au-section{padding-top:8px;border-top:1px solid var(--dsw-alias-border-l1);display:flex;flex-direction:column;gap:5px}
.dsh-au-section-title{font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);letter-spacing:.02em}
.dsh-au-model{display:flex;gap:10px;align-items:baseline}
.dsh-au-model-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-au-model-value{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap}
.dsh-au-model-cost{font-variant-numeric:tabular-nums;font-size:11px;min-width:52px;text-align:right}
.dsh-au-wallet{display:flex;align-items:baseline;gap:8px}
.dsh-au-wallet-value{font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.dsh-au-wallet-note{color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-au-link{color:var(--dsw-alias-brand-primary);text-decoration:none;font-size:11px}
.dsh-au-link:hover{text-decoration:underline}
.dsh-au-status{color:var(--dsw-alias-label-secondary);font-size:11px;display:flex;align-items:center;gap:6px}
.dsh-au-status[data-error='true']{color:var(--dsw-alias-state-error-primary)}
.dsh-au-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-brand-primary);animation:dsh-au-pulse 1.2s ease-in-out infinite;flex:none}
@keyframes dsh-au-pulse{0%,100%{opacity:.35}50%{opacity:1}}
.dsh-au-foot{display:flex;align-items:center;gap:8px;padding-top:8px;border-top:1px solid var(--dsw-alias-border-l1)}
.dsh-au-foot-note{flex:1;color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-au-textbtn{border:none;background:transparent;color:var(--dsw-alias-brand-primary);font:inherit;font-size:11px;cursor:pointer;padding:2px 4px;border-radius:4px}
.dsh-au-textbtn:hover{background:color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent)}
`

    function UsageIcon() {
      return h(
        'svg',
        { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': true, focusable: 'false' },
        h('rect', { x: 2, y: 9, width: 3, height: 5, rx: 1, fill: 'currentColor', opacity: 0.55 }),
        h('rect', { x: 6.5, y: 5, width: 3, height: 9, rx: 1, fill: 'currentColor', opacity: 0.8 }),
        h('rect', { x: 11, y: 2, width: 3, height: 12, rx: 1, fill: 'currentColor' }),
      )
    }

    function UsageButton(props) {
      const state = useStore()
      const wide = !props || props.wide !== false
      const ref = React.useRef(null)
      const data = state.data
      const today = data && data.buckets ? data.buckets.today : null
      const value = today && today.requests > 0 ? formatTokens(today.total) : ''

      React.useEffect(() => {
        store.buttonEl = ref.current
        if (!store.data && !inFlight) refresh()
        const timer = setInterval(() => {
          if (!store.open && !inFlight) refresh()
        }, POLL_CLOSED_MS)
        return () => {
          clearInterval(timer)
          if (store.buttonEl === ref.current) store.buttonEl = null
        }
      }, [])

      const label = t('button')
      const peak = data && data.billing ? Boolean(data.billing.peak) : null
      const billingText = peak === null ? '' : peak ? t('peak') : t('offPeak')
      const todayCost = data && data.cost ? data.cost.today : undefined
      const balanceText = primaryBalance(data && data.balance)
      const bonusText = bonusBalance(data && data.balance)
      const titleParts = [label]
      if (value) titleParts.push(`${t('today')} ${value}`)
      if (typeof todayCost === 'number') titleParts.push(`≈ ${formatCost(todayCost)}`)
      if (balanceText) titleParts.push(`${t('balance')} ${balanceText}`)
      if (bonusText) titleParts.push(`${t('bonus')} ${bonusText}`)
      if (billingText) titleParts.push(billingText)
      const title = titleParts.join(' · ')

      const body = wide
        ? h(
            'span',
            { className: 'dsh-au-btn-body' },
            h(
              'span',
              { className: 'dsh-au-btn-line1' },
              h('span', null, label),
              peak === null
                ? null
                : h(
                    'span',
                    { className: 'dsh-au-badge dsh-au-badge-sm', 'data-peak': peak ? 'true' : 'false' },
                    billingText,
                  ),
              bonusText
                ? h('span', { className: 'dsh-au-btn-bonus' }, `${t('bonusShort')}${bonusText}`)
                : null,
            ),
            h(
              'span',
              { className: 'dsh-au-btn-line2' },
              h('span', null, value || '—'),
              typeof todayCost === 'number' ? h('span', { className: 'dsh-au-btn-cost' }, `≈${formatCost(todayCost)}`) : null,
              balanceText ? h('span', { className: 'dsh-au-btn-sep' }, '·') : null,
              balanceText ? h('span', { className: 'dsh-au-btn-balance' }, balanceText) : null,
            ),
          )
        : null

      return h(
        React.Fragment,
        null,
        h('style', { key: 'style' }, CSS),
        h(
          'button',
          {
            ref,
            type: 'button',
            className: wide ? 'dsh-au-btn' : 'dsh-au-btn dsh-au-btn-rail',
            title,
            'aria-label': title,
            'aria-expanded': state.open ? 'true' : 'false',
            onClick: () => {
              if (!store.open) {
                try {
                  store.anchor = ref.current ? ref.current.getBoundingClientRect() : null
                } catch {
                  store.anchor = null
                }
                refresh()
              }
              store.open = !store.open
              emit()
            },
          },
          h('span', { className: 'dsh-au-btn-icon' }, h(UsageIcon, null)),
          wide
            ? body
            : peak === null
              ? null
              : h('span', { className: 'dsh-au-rail-dot', 'data-peak': peak ? 'true' : 'false' }),
        ),
      )
    }

    function panelGeometry() {
      const width = Math.min(CARD_WIDTH, Math.max(240, window.innerWidth - 24))
      let left = 12
      let bottom = 76
      const element = store.buttonEl
      if (element) {
        try {
          const rect = element.getBoundingClientRect()
          left = Math.round(rect.left)
          bottom = Math.round(window.innerHeight - rect.top + 8)
        } catch {
          /* keep the fallback rectangle */
        }
      }
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8))
      return { left, bottom, width }
    }

    function UsagePanel() {
      const state = useStore()
      const [scope, setScope] = React.useState('today')
      const cardRef = React.useRef(null)
      const open = state.open

      React.useEffect(() => {
        if (!open) return undefined
        refresh()
        const timer = setInterval(refresh, POLL_OPEN_MS)
        const onPointerDown = (event) => {
          const card = cardRef.current
          const button = store.buttonEl
          const target = event.target
          if (card && target instanceof Node && card.contains(target)) return
          if (button && target instanceof Node && button.contains(target)) return
          store.open = false
          emit()
        }
        const onKeyDown = (event) => {
          if (event.key === 'Escape') {
            store.open = false
            emit()
          }
        }
        const onResize = () => {
          try {
            store.anchor = store.buttonEl ? store.buttonEl.getBoundingClientRect() : null
          } catch {
            store.anchor = null
          }
          emit()
        }
        document.addEventListener('mousedown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown, true)
        window.addEventListener('resize', onResize)
        return () => {
          clearInterval(timer)
          document.removeEventListener('mousedown', onPointerDown, true)
          document.removeEventListener('keydown', onKeyDown, true)
          window.removeEventListener('resize', onResize)
        }
      }, [open])

      if (!open) return null

      const data = state.data
      const geometry = panelGeometry()
      const bucketKey = scope === 'week' ? 'last7' : scope
      const costKey = scope === 'week' ? 'last7' : scope
      const bucket = data && data.buckets ? data.buckets[bucketKey] : null
      const cost = data && data.cost ? data.cost[costKey] : undefined
      const scan = (data && data.scan) || null
      const billing = (data && data.billing) || null
      const balance = (data && data.balance) || null
      const models = (data && data.models) || []
      const unpriced = (data && data.cost && data.cost.unpricedModels) || []
      const tabs = [
        { id: 'today', label: t('today') },
        { id: 'week', label: t('week') },
        { id: 'total', label: t('total') },
      ]

      const children = [
        h('style', { key: 'style' }, CSS),
        h(
          'div',
          { className: 'dsh-au-head', key: 'head' },
          h('span', { className: 'dsh-au-title' }, t('title')),
          billing
            ? h(
                'span',
                {
                  className: 'dsh-au-badge',
                  'data-peak': billing.peak ? 'true' : 'false',
                  title: t('peakHint'),
                },
                billing.peak ? t('peak') : t('offPeak'),
              )
            : null,
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-au-iconbtn',
              title: t('refresh'),
              'aria-label': t('refresh'),
              onClick: () => refresh(),
            },
            h(
              'svg',
              { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': true },
              h('path', {
                d: 'M13 8a5 5 0 1 1-1.6-3.7M13 2.8V6h-3.2',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: 1.4,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }),
            ),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-au-iconbtn',
              title: t('close'),
              'aria-label': t('close'),
              onClick: () => {
                store.open = false
                emit()
              },
            },
            '✕',
          ),
        ),
        h(
          'div',
          { className: 'dsh-au-tabs', key: 'tabs', role: 'tablist' },
          tabs.map((tab) =>
            h(
              'button',
              {
                key: tab.id,
                type: 'button',
                role: 'tab',
                className: 'dsh-au-tab',
                'data-active': scope === tab.id ? 'true' : 'false',
                'aria-selected': scope === tab.id ? 'true' : 'false',
                onClick: () => setScope(tab.id),
              },
              tab.label,
            ),
          ),
        ),
      ]

      if (!data) {
        children.push(
          h(
            'div',
            { className: 'dsh-au-status', key: 'loading', 'data-error': state.error ? 'true' : 'false' },
            state.error ? `${t('failed')} · ${state.error}` : t('loading'),
          ),
        )
        if (state.error) {
          children.push(
            h('button', { key: 'retry', type: 'button', className: 'dsh-au-textbtn', onClick: () => refresh() }, t('refresh')),
          )
        }
      } else {
        const usage = bucket || { requests: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, reasoning: 0, total: 0 }
        children.push(
          h(
            'div',
            { className: 'dsh-au-hero', key: 'hero' },
            h('span', { className: 'dsh-au-hero-value' }, formatTokens(usage.total)),
            h('span', { className: 'dsh-au-hero-unit' }, t('tokens')),
            h(
              'span',
              { className: 'dsh-au-hero-cost', title: t('costNote'), 'data-muted': typeof cost === 'number' ? 'false' : 'true' },
              `≈ ${formatCost(cost)}`,
            ),
          ),
        )
        children.push(
          h(
            'div',
            { className: 'dsh-au-sub', key: 'sub' },
            h('span', null, `${formatCount(usage.requests)} ${t('requests')}`),
            h(
              'span',
              { style: { marginLeft: 'auto' } },
              billing && billing.nextChangeAt
                ? `${t('switchIn')} ${formatDuration(billing.nextChangeAt - Date.now())} (${formatTime(billing.nextChangeAt)})`
                : t('costLabel'),
            ),
          ),
        )
        children.push(
          h(
            'div',
            { className: 'dsh-au-section', key: 'balance' },
            h('div', { className: 'dsh-au-section-title' }, t('balance')),
            ...renderBalance(balance),
          ),
        )
        const rows = [
          [t('input'), usage.input],
          [t('output'), usage.output],
          [t('cacheRead'), usage.cacheRead],
          [t('cacheWrite'), usage.cacheWrite],
        ]
        if (usage.reasoning) rows.push([t('reasoning'), usage.reasoning])
        children.push(
          h(
            'div',
            { className: 'dsh-au-rows', key: 'rows' },
            rows.flatMap(([label, value]) => [
              h('span', { className: 'dsh-au-row-label', key: `${label}-label` }, label),
              h('span', { className: 'dsh-au-row-value', key: `${label}-value` }, formatCount(value)),
            ]),
          ),
        )
        if (usage.requests === 0) {
          children.push(h('div', { className: 'dsh-au-status', key: 'empty' }, t('empty')))
        }
        if (models.length > 0) {
          children.push(
            h(
              'div',
              { className: 'dsh-au-section', key: 'models' },
              h('div', { className: 'dsh-au-section-title' }, t('models')),
              ...models.slice(0, 4).map((row) =>
                h(
                  'div',
                  { className: 'dsh-au-model', key: row.model },
                  h('span', { className: 'dsh-au-model-name', title: row.model }, row.model),
                  h('span', { className: 'dsh-au-model-value' }, `${formatTokens(row.total)} · ${formatCount(row.requests)}`),
                  h('span', { className: 'dsh-au-model-cost' }, row.cost === null ? '—' : formatCost(row.cost)),
                ),
              ),
            ),
          )
        }
        if (unpriced.length > 0) {
          children.push(
            h(
              'div',
              { className: 'dsh-au-status', key: 'unpriced', title: t('unpricedHint') },
              `${t('unpriced')}: ${unpriced.map((row) => row.model).join(', ')}`,
            ),
          )
        }
        if (scan && scan.running) {
          children.push(
            h(
              'div',
              { className: 'dsh-au-status', key: 'scan' },
              h('span', { className: 'dsh-au-dot' }),
              t('scanning') + ' ' + formatCount(scan.done) + '/' + formatCount(scan.total),
            ),
          )
        } else if (scan && scan.error) {
          children.push(
            h('div', { className: 'dsh-au-status', key: 'scan-error', 'data-error': 'true' }, `${t('failed')} · ${scan.error}`),
          )
        }
        children.push(
          h(
            'div',
            { className: 'dsh-au-foot', key: 'foot' },
            h(
              'span',
              { className: 'dsh-au-foot-note', title: t('costNote') },
              `${t('updated')} ${formatTime(state.fetchedAt)} · ${formatCount(data.sessions)} ${t('sessions')}`,
            ),
            balance && balance.links && balance.links.usageUrl
              ? h('a', { className: 'dsh-au-link', href: balance.links.usageUrl, target: '_blank', rel: 'noreferrer' }, t('openUsage'))
              : null,
          ),
        )
      }

      return h(
        'div',
        {
          ref: cardRef,
          className: 'dsh-au-card',
          role: 'dialog',
          'aria-label': t('title'),
          style: { left: `${geometry.left}px`, bottom: `${geometry.bottom}px`, width: `${geometry.width}px` },
        },
        ...children,
      )
    }

    function renderBalance(balance) {
      if (!balance) return [h('div', { className: 'dsh-au-status', key: 'balance-loading' }, t('loading'))]
      if (balance.pending) return [h('div', { className: 'dsh-au-status', key: 'balance-pending' }, t('pending'))]
      if (balance.available) {
        const nodes = []
        const wallets = Array.isArray(balance.wallets) ? balance.wallets : []
        const bonus = Array.isArray(balance.bonusWallets) ? balance.bonusWallets : []
        for (const wallet of wallets) {
          nodes.push(
            h(
              'div',
              { className: 'dsh-au-wallet', key: `wallet-${wallet.currency}` },
              h('span', { className: 'dsh-au-wallet-value' }, formatMoney(wallet)),
              h('span', { className: 'dsh-au-wallet-note' }, wallet.currency),
            ),
          )
        }
        for (const wallet of bonus) {
          nodes.push(
            h(
              'div',
              { className: 'dsh-au-wallet', key: `bonus-${wallet.currency}` },
              h('span', { className: 'dsh-au-wallet-value' }, formatMoney(wallet)),
              h('span', { className: 'dsh-au-wallet-note' }, `${t('bonus')} · ${wallet.currency}`),
            ),
          )
        }
        if (nodes.length === 0) nodes.push(h('div', { className: 'dsh-au-status', key: 'empty' }, t('signedOut')))
        return nodes
      }
      return [
        h('div', { className: 'dsh-au-status', key: 'signed-out' }, t('signedOut')),
        h('div', { className: 'dsh-au-status', key: 'hint' }, t('signInHint')),
      ]
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        localeService = ctx.get('locale') || null
        if (localeService && typeof localeService.register === 'function') {
          ctx.effect(
            () => localeService.register('usage', { zh: TEXT.zh, en: TEXT.en }),
            'usage: locale',
          )
          if (typeof localeService.bind === 'function') {
            try {
              translate = localeService.bind('usage')
            } catch {
              translate = null
            }
          }
          if (typeof localeService.subscribe === 'function') {
            ctx.effect(() => localeService.subscribe(() => emit()), 'usage: locale changes')
          }
        }

        ctx.effect(
          () =>
            ctx.slots.inject('sidebar.footer.action', () =>
              ctx.slots.register(
                { name: 'sidebar.footer.action', id: 'usage', order: -10, label: () => t('button') },
                UsageButton,
              ),
            ),
          'usage: sidebar action',
        )

        ctx.effect(
          () =>
            ctx.slots.inject('shell.overlay', () =>
              ctx.slots.register({ name: 'shell.overlay', id: 'usage-card', order: 1000 }, UsagePanel),
            ),
          'usage: overlay card',
        )
      },
    }
  },
})
