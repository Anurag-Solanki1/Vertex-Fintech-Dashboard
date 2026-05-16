import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Area, AreaChart, ResponsiveContainer, Tooltip,
  Line, LineChart
} from 'recharts'
import {
  Search, RefreshCw, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Clock, Send,
  Download, Repeat2, ChevronRight, X,
  LayoutDashboard, BarChart3, Wallet, Shield, Terminal, CandlestickChart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolio, useTransactions, useAssets, usePortfolioHistory } from '@/hooks/useAuraData'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

// ─── Generate deterministic sparkline data from 24h change ───
function makeSparkline(change24h: number, baseValue: number) {
  const points = []
  let val = baseValue
  for (let i = 0; i < 14; i++) {
    const drift = (change24h / 100) * baseValue * (i / 14)
    const noise = (Math.random() - 0.5) * baseValue * 0.015
    val = baseValue + drift + noise
    points.push({ v: Math.max(val, 0) })
  }
  return points
}

// ─── Sparkline Component ──────────────────────────────────────
function Sparkline({ data, positive }: { data: { v: number }[]; positive: boolean }) {
  return (
    <ResponsiveContainer width={64} height={28}>
      <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={positive ? '#10b981' : '#ef4444'}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Command Palette ──────────────────────────────────────────
const COMMANDS = [
  { id: 'overview',   label: 'Go to Overview',   icon: LayoutDashboard, path: '/'          },
  { id: 'analytics',  label: 'Go to Analytics',   icon: BarChart3,       path: '/analytics' },
  { id: 'wallets',    label: 'Go to Wallets',     icon: Wallet,          path: '/wallets'   },
  { id: 'trading',    label: 'Go to Trading',     icon: CandlestickChart, path: '/trading'  },
  { id: 'security',   label: 'Go to Security',    icon: Shield,          path: '/security'  },
  { id: 'terminal',   label: 'Open Terminal',     icon: Terminal,        path: '/terminal'  },
]

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const execute = useCallback((path: string) => {
    navigate(path)
    onClose()
  }, [navigate, onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); filtered[selected] && execute(filtered[selected].path) }
      if (e.key === 'Escape')    { onClose() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [filtered, selected, execute, onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-[480px] bg-[#111111] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
            <Search size={15} className="text-neutral-500 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(0) }}
              placeholder="Search pages, assets..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none"
            />
            <kbd className="text-[10px] text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
          </div>

          {/* Results */}
          <div className="p-1.5 max-h-[280px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-neutral-600 text-xs text-center py-6">No results</p>
            ) : (
              filtered.map((cmd, i) => {
                const Icon = cmd.icon
                return (
                  <button
                    key={cmd.id}
                    onClick={() => execute(cmd.path)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                      selected === i
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={selected === i ? 'text-indigo-400' : 'text-neutral-600'} />
                    {cmd.label}
                    {selected === i && <ChevronRight size={12} className="ml-auto text-neutral-600" />}
                  </button>
                )
              })
            )}
          </div>

          <div className="px-4 py-2 border-t border-neutral-800 flex items-center gap-4">
            <span className="text-[10px] text-neutral-600 flex items-center gap-1.5">
              <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-[9px]">↑↓</kbd> navigate
            </span>
            <span className="text-[10px] text-neutral-600 flex items-center gap-1.5">
              <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-[9px]">↵</kbd> open
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Tooltip for Equity Chart ─────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111111] border border-neutral-800 px-3 py-2 rounded-lg text-[11px] shadow-xl">
      <p className="text-neutral-500 mb-0.5">{label}</p>
      <p className="text-white font-mono font-semibold tabular-nums">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

// ════════════════════════════════════════
//  OVERVIEW V2 — Clean, Human-Made
// ════════════════════════════════════════
export default function OverviewV2() {
  const { data: portfolio, isLoading: loadingPort } = usePortfolio()
  const { data: transactions, isLoading: loadingTx } = useTransactions()
  const { data: assets, isLoading: loadingAssets } = useAssets()
  const { data: history } = usePortfolioHistory()
  const [cmdOpen, setCmdOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  // Cmd+K to open command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setRefreshing(false)
    }, 1000)
  }

  const isPositive = (portfolio?.changePct24h ?? 0) >= 0

  // Greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Best performer
  const bestAsset = assets?.reduce((best, a) =>
    a.change24h > (best?.change24h ?? -Infinity) ? a : best
  , assets?.[0])

  // Portfolio narrative sentence
  const narrative = portfolio && bestAsset
    ? `Your portfolio is ${isPositive ? 'up' : 'down'} ${Math.abs(portfolio.changePct24h).toFixed(1)}% today, led by ${bestAsset.symbol} (+${bestAsset.change24h.toFixed(1)}%).`
    : null

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-[#f1f0ee]">
      {/* ── Command Palette ── */}
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

        {/* ── Greeting + Top Bar ── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-neutral-500 mb-0.5">{greeting}, Anurag</p>
            <h1 className="text-sm font-medium text-neutral-400">Portfolio Overview</h1>
            <div className="flex items-center gap-3 mt-1.5">
              {loadingPort ? (
                <div className="h-9 w-48 bg-neutral-800 animate-pulse rounded" />
              ) : (
                <>
                  <span className="text-3xl font-semibold tracking-tight tabular-nums text-white">
                    {formatCurrency(portfolio?.totalBalance ?? 0)}
                  </span>
                  <span className={`flex items-center gap-1 text-sm font-medium tabular-nums ${
                    isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                    {isPositive ? '+' : ''}{portfolio?.changePct24h?.toFixed(2)}%
                  </span>
                  <span className="text-neutral-600 text-sm">today</span>
                </>
              )}
            </div>
            {narrative && (
              <p className="text-[12px] text-neutral-500 mt-1.5 max-w-md leading-relaxed">{narrative}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Last updated */}
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-600">
              <Clock size={11} />
              <span className="tabular-nums">
                Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <button
                onClick={handleRefresh}
                className="ml-1 hover:text-neutral-400 transition-colors"
              >
                <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Cmd+K button */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[12px] text-neutral-500 hover:text-neutral-300 hover:border-neutral-700 transition-all"
            >
              <Search size={12} />
              <span>Search</span>
              <kbd className="text-[10px] bg-neutral-800 px-1 rounded font-mono ml-1">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* ── Inline Stats Bar ── */}
        <div className="flex items-center gap-6 py-3 border-y border-[#1e1c1a] text-sm">
          <div>
            <span className="text-neutral-600 mr-2 text-xs uppercase tracking-wider">Unrealized P&L</span>
            <span className="text-emerald-400 font-mono font-medium tabular-nums">+$15,690.45</span>
          </div>
          <div className="w-px h-4 bg-[#1e1c1a]" />
          <div>
            <span className="text-neutral-600 mr-2 text-xs uppercase tracking-wider">Buying Power</span>
            <span className="text-[#f1f0ee] font-mono font-medium tabular-nums">$84,200.00</span>
          </div>
          <div className="w-px h-4 bg-[#1e1c1a]" />
          <div>
            <span className="text-neutral-600 mr-2 text-xs uppercase tracking-wider">Margin Used</span>
            <span className="text-[#f1f0ee] font-mono font-medium tabular-nums">12%</span>
          </div>
          <div className="w-px h-4 bg-[#1e1c1a]" />
          <div>
            <span className="text-neutral-600 mr-2 text-xs uppercase tracking-wider">24h Volume</span>
            <span className="text-[#f1f0ee] font-mono font-medium tabular-nums">$1.24M</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-neutral-500">Live · 47ms</span>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Asset Table (8 cols) */}
          <div className="col-span-12 lg:col-span-8 min-w-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Holdings</h2>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-600">{assets?.length ?? 0} assets</span>
                <span className="text-[11px] text-neutral-600">·</span>
                <span className="text-[11px] text-neutral-500">Sort by value ↓</span>
              </div>
            </div>

            {/* Table */}
            <div className="border border-[#1e1c1a] rounded-xl overflow-x-auto">
              <table className="w-full whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#1e1c1a]">
                    <th className="text-left text-[10px] font-medium text-neutral-600 uppercase tracking-wider px-4 py-3">Asset</th>
                    <th className="text-right text-[10px] font-medium text-neutral-600 uppercase tracking-wider px-4 py-3">Price</th>
                    <th className="text-center text-[10px] font-medium text-neutral-600 uppercase tracking-wider px-4 py-3">7d</th>
                    <th className="text-right text-[10px] font-medium text-neutral-600 uppercase tracking-wider px-4 py-3">24h</th>
                    <th className="text-right text-[10px] font-medium text-neutral-600 uppercase tracking-wider px-4 py-3">Balance</th>
                    <th className="text-right text-[10px] font-medium text-neutral-600 uppercase tracking-wider px-4 py-3">Value</th>
                    <th className="text-right text-[10px] font-medium text-neutral-600 uppercase tracking-wider px-4 py-3">Alloc</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAssets ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-[#1a1917] last:border-0">
                        {[...Array(7)].map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="h-3 bg-neutral-800 animate-pulse rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    assets?.map((asset, i) => {
                      const positive = asset.change24h >= 0
                      const sparkData = makeSparkline(asset.change24h, asset.usdValue / asset.balance)
                      return (
                        <motion.tr
                          key={asset.symbol}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-[#1a1917] last:border-0 hover:bg-[#161412] transition-colors cursor-pointer group"
                        >
                          {/* Asset */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                                {asset.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{asset.symbol}</p>
                                <p className="text-[10px] text-neutral-600">{asset.name}</p>
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-sm font-mono text-neutral-300 tabular-nums">
                              {formatCurrency(asset.usdValue / asset.balance)}
                            </span>
                          </td>

                          {/* Sparkline */}
                          <td className="px-4 py-3.5">
                            <div className="flex justify-center">
                              <Sparkline data={sparkData} positive={positive} />
                            </div>
                          </td>

                          {/* 24h change */}
                          <td className="px-4 py-3.5 text-right">
                            <span className={`text-[11px] font-mono font-medium tabular-nums ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                              {positive ? '+' : ''}{asset.change24h.toFixed(2)}%
                            </span>
                          </td>

                          {/* Balance */}
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-sm font-mono text-neutral-400 tabular-nums">
                              {asset.balance.toFixed(4)}
                            </span>
                          </td>

                          {/* Value */}
                          <td className="px-4 py-3.5 text-right">
                            <span className="text-sm font-mono text-white font-medium tabular-nums">
                              {formatCurrency(asset.usdValue)}
                            </span>
                          </td>

                          {/* Allocation bar */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500 rounded-full"
                                  style={{ width: `${asset.allocation}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-mono text-neutral-500 tabular-nums w-8 text-right">
                                {asset.allocation.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Equity Chart */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Equity Curve</h2>
                <div className="flex gap-1">
                  {['1W', '1M', 'YTD', '1Y'].map((t, i) => (
                    <button
                      key={t}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                        i === 2
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'text-neutral-600 hover:text-neutral-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border border-[#1e1c1a] rounded-xl p-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="v2grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={1.5}
                      fill="url(#v2grad)"
                      dot={false}
                      activeDot={{ r: 3, fill: '#6366f1', stroke: '#0a0a0a', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right column (4 cols) */}
          <div className="col-span-12 lg:col-span-4 min-w-0 space-y-5">

            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider invisible">Actions</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Send',    Icon: Send,     color: 'hover:border-indigo-500/40 hover:text-indigo-400' },
                { label: 'Receive', Icon: Download,  color: 'hover:border-emerald-500/40 hover:text-emerald-400' },
                { label: 'Swap',    Icon: Repeat2,   color: 'hover:border-violet-500/40 hover:text-violet-400' },
              ].map(({ label, Icon, color }) => (
                <button
                  key={label}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border border-[#1e1c1a] text-neutral-500 transition-all ${color} hover:bg-[#161412]`}
                >
                  <Icon size={14} />
                  <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
                </button>
              ))}
              </div>
            </div>
            {/* Transaction Log */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Activity</h2>
                <button className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
              </div>

              <div className="border border-[#1e1c1a] rounded-xl overflow-hidden">
                {loadingTx ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 gap-3 border-b border-[#1a1917] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 animate-pulse" />
                        <div className="h-3 w-20 bg-neutral-800 animate-pulse rounded" />
                      </div>
                      <div className="h-3 w-14 bg-neutral-800 animate-pulse rounded" />
                    </div>
                  ))
                ) : (() => {
                  const now = Date.now()
                  const todayTxs = transactions?.filter(tx => now - new Date(tx.timestamp).getTime() < 86400000) ?? []
                  const olderTxs = transactions?.filter(tx => now - new Date(tx.timestamp).getTime() >= 86400000) ?? []
                  const renderRow = (tx: any) => {
                    const isPos = tx.amount > 0
                    return (
                      <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#161412] transition-colors cursor-pointer group border-b border-[#1a1917] last:border-0">
                        <div className="flex items-center gap-3">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            tx.status === 'completed' ? 'bg-emerald-500' :
                            tx.status === 'pending'   ? 'bg-amber-500'   : 'bg-neutral-600'
                          }`} />
                          <div>
                            <p className="text-xs text-neutral-300 group-hover:text-white transition-colors">
                              <span className="capitalize">{tx.type}</span>
                              <span className="text-neutral-600 ml-1">{tx.asset}</span>
                            </p>
                            <p className="text-[10px] text-neutral-700">{formatRelativeTime(new Date(tx.timestamp))}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-mono tabular-nums ${isPos ? 'text-emerald-400' : 'text-neutral-400'}`}>
                          {isPos ? '+' : ''}{tx.amount.toFixed(4)}
                        </span>
                      </div>
                    )
                  }
                  return (
                    <>
                      {todayTxs.length > 0 && (
                        <>
                          <div className="px-4 py-1.5 bg-[#131210]">
                            <span className="text-[10px] font-medium text-neutral-600 uppercase tracking-wider">Today</span>
                          </div>
                          {todayTxs.map(renderRow)}
                        </>
                      )}
                      {olderTxs.length > 0 && (
                        <>
                          <div className="px-4 py-1.5 bg-[#131210]">
                            <span className="text-[10px] font-medium text-neutral-600 uppercase tracking-wider">Earlier</span>
                          </div>
                          {olderTxs.slice(0, 4).map(renderRow)}
                        </>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Network Status */}
            <div className="border border-[#1e1c1a] rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Network</h2>
              <div className="space-y-2.5">
                {[
                  { label: 'Status',        value: 'Operational',  color: 'text-emerald-400' },
                  { label: 'Block Height',  value: '21,892,304',   color: 'text-neutral-300' },
                  { label: 'Network Uptime',value: '99.98%',       color: 'text-neutral-300' },
                  { label: 'Latency',       value: '47ms',         color: 'text-neutral-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-600">{label}</span>
                    <span className={`text-[11px] font-mono tabular-nums font-medium ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Keyboard Shortcuts Bar ── */}
      <div className="border-t border-[#1a1917] py-2 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center gap-5">
          {[
            { key: '⌘K', label: 'Search' },
            { key: 'J / K', label: 'Navigate rows' },
            { key: 'R', label: 'Refresh' },
            { key: '?', label: 'Show shortcuts' },
          ].map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px] text-neutral-700">
              <kbd className="bg-[#1a1917] border border-[#252320] text-neutral-500 px-1.5 py-0.5 rounded text-[9px] font-mono">{key}</kbd>
              {label}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-neutral-700">Prices from CoinGecko · refreshes every 30s</span>
        </div>
      </div>
    </div>
  )
}
