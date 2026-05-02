import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight, ArrowDownLeft, Repeat2, Send, Download,
  ArrowUpDown, Cpu, Globe, TrendingUp, TrendingDown, ChevronRight
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { NumberTicker, PctBadge } from '@/components/effects/NumberTicker'
import { MagicCard } from '@/components/effects/MagicCard'
import { AuraVisaCard } from '@/components/effects/AuraVisaCard'
import { GlassCard, BorderBeam } from '@/components/effects/BorderBeam'
import { StatusDot, SectionHeader, AssetIcon, ChangeBadge, StaggerList, StaggerItem, SkeletonBlock } from '@/components/shared'
import { usePortfolio, useTransactions, useAssets, usePortfolioHistory } from '@/hooks/useAuraData'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

// ─── Sparkline Tooltip ────────────────────────────────────────
const SparkTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-panel px-2 py-1 rounded text-xs text-[#00F0FF]">
      {formatCurrency(payload[0].value)}
    </div>
  )
}

// ─── Quick Action Button ─────────────────────────────────────
interface QuickActionProps {
  icon: React.ReactNode
  label: string
  accent?: 'cyan' | 'purple'
}
function QuickAction({ icon, label, accent = 'cyan' }: QuickActionProps) {
  const hoverClass = accent === 'cyan'
    ? 'hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/5 group-hover:text-[#00F0FF]'
    : 'hover:border-[#9D4EDD]/40 hover:bg-[#9D4EDD]/5 group-hover:text-[#9D4EDD]'
  return (
    <button className={`group flex-1 glass-panel rounded-xl p-4 flex items-center justify-between transition-all duration-250 cursor-pointer ${hoverClass}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/40 transition-colors duration-200 ${accent === 'cyan' ? 'group-hover:bg-[#00F0FF]/15 group-hover:text-[#00F0FF]' : 'group-hover:bg-[#9D4EDD]/15 group-hover:text-[#9D4EDD]'}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{label}</span>
      </div>
      <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
    </button>
  )
}

// ─── Spline Loader Fallback ───────────────────────────────────
function SplineLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Animated wireframe grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-full border border-[#00F0FF]/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.15)] relative"
      >
        <div className="absolute inset-0 rounded-full border-t border-[#00F0FF] animate-spin" style={{ animationDuration: '2s' }} />
        <div className="w-12 h-12 rounded-full bg-[#00F0FF]/10 blur-md" />
        <span className="absolute text-[8px] font-mono text-[#00F0FF] tracking-widest uppercase">Loading</span>
      </motion.div>
    </div>
  )
}

// ─── Transaction Row ─────────────────────────────────────────
function TxRow({ tx }: { tx: any }) {
  const isPos = tx.amount > 0
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] px-2 -mx-2 rounded-lg transition-colors group cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <StatusDot status={tx.status} />
        <div>
          <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
            {tx.type === 'deposit' && 'Deposit'}
            {tx.type === 'withdrawal' && 'Withdrawal'}
            {tx.type === 'swap' && 'Swap'}
            {tx.type === 'contract' && 'Smart Contract'}
            {' '}<span className="text-white/40">{tx.asset}</span>
          </p>
          <p className="text-[10px] text-white/30 mt-0.5 tracking-wide">
            {formatRelativeTime(new Date(tx.timestamp))}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${isPos ? 'text-[#00F0FF]' : 'text-white/70'}`}>
          {isPos ? '+' : ''}{tx.amount.toFixed(4)} {tx.asset}
        </p>
        <p className={`text-[10px] capitalize ${tx.status === 'pending' ? 'text-yellow-400' : tx.status === 'failed' ? 'text-red-400' : 'text-white/30'}`}>
          {tx.status}
        </p>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════
//  OVERVIEW PAGE
// ════════════════════════════════════════
export default function Overview() {
  const { data: portfolio, isLoading: loadingPort } = usePortfolio()
  const { data: transactions, isLoading: loadingTx } = useTransactions()
  const { data: assets, isLoading: loadingAssets } = useAssets()
  const { data: history, isLoading: loadingHist } = usePortfolioHistory()

  return (
    <StaggerList className="grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* ══ Hero Balance Card (8 cols) ══ */}
      <StaggerItem className="col-span-1 md:col-span-8">
        <MagicCard tilt={false} className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/[0.08] hover:border-[#00F0FF]/20 transition-all duration-500">
          <BorderBeam />
          <div className="relative z-10">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-white/35 uppercase mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  Total Portfolio Balance
                </p>
                <div className="flex items-end gap-3">
                  {loadingPort ? (
                    <SkeletonBlock className="h-16 w-64" />
                  ) : (
                    <>
                      <span className="text-[64px] font-black leading-none tracking-[-0.04em] text-white">
                        $<NumberTicker value={portfolio?.totalBalance ?? 0} decimals={0} duration={2000} />
                      </span>
                      <span className="text-3xl font-light text-white/20 mb-1">.00</span>
                    </>
                  )}
                </div>
              </div>
              <PctBadge value={portfolio?.changePct24h ?? 0} />
            </div>

            {/* Portfolio area sparkline */}
            <div className="h-28 w-full -mx-1">
              {loadingHist ? (
                <SkeletonBlock className="h-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#00F0FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<SparkTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#00F0FF" strokeWidth={1.5} fill="url(#balGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Asset breakdown row */}
            {!loadingAssets && assets && (
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.05]">
                {assets.map((a) => (
                  <div key={a.symbol} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-[10px] text-white/40">{a.symbol}</span>
                    <span className="text-[10px] font-semibold text-white/60">{a.allocation.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </MagicCard>
      </StaggerItem>

      {/* ══ Quick Actions (4 cols) ══ */}
      <StaggerItem className="col-span-1 md:col-span-4 flex flex-col gap-2.5">
        <QuickAction icon={<Send size={15} />} label="Transfer" accent="cyan" />
        <QuickAction icon={<Download size={15} />} label="Receive" accent="cyan" />
        <QuickAction icon={<Repeat2 size={15} />} label="Swap" accent="purple" />
        {/* Mini stats card */}
        <div className="glass-panel rounded-xl p-4 mt-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] text-white/30 tracking-wider mb-1">24h PnL</p>
              <p className="text-sm font-bold text-[#00F0FF]">+$15,690</p>
            </div>
            <div>
              <p className="text-[9px] text-white/30 tracking-wider mb-1">Positions</p>
              <p className="text-sm font-bold text-white/80">4 Active</p>
            </div>
            <div>
              <p className="text-[9px] text-white/30 tracking-wider mb-1">Gas Fee</p>
              <p className="text-sm font-bold text-yellow-400">45 gwei</p>
            </div>
            <div>
              <p className="text-[9px] text-white/30 tracking-wider mb-1">Security</p>
              <p className="text-sm font-bold text-[#00F0FF]">87/100</p>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* ══ 3D Active Node (WebGL) (6 cols) ══ */}
      <StaggerItem className="col-span-1 md:col-span-6">
        <MagicCard
          className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#00F0FF]/15 transition-all duration-500 flex flex-col relative"
          style={{ minHeight: 340 }}
          intensity={8}
        >
          <BorderBeam size={200} duration={12} />
          {/* Header */}
          <div className="p-5 pb-0 z-20 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Cpu size={11} className="text-[#00F0FF]" />
              <span className="text-[9px] font-semibold tracking-[0.18em] text-white/40 uppercase">Active Node</span>
            </div>
            <p className="text-[10px] text-[#00F0FF] mt-1 font-mono">AURA-X • Node #4291</p>
          </div>

          {/* WebGL 3D VISA Card */}
          <div className="flex-1 w-full relative z-10 -mt-4 mb-16">
            <AuraVisaCard />
          </div>

          {/* Bottom stats overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="flex items-center justify-between backdrop-blur-md p-3 rounded-xl border border-white/10 bg-black/40 shadow-xl">
              <div>
                <p className="text-[9px] text-white/30 tracking-wider">Node Status</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                  <span className="text-xs text-[#00F0FF] font-semibold">Online • Synced</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/30 tracking-wider">Block Height</p>
                <p className="text-xs font-mono text-white/70">#21,892,304</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/30 tracking-wider">Uptime</p>
                <p className="text-xs font-semibold text-[#00F0FF]">99.98%</p>
              </div>
            </div>
          </div>
        </MagicCard>
      </StaggerItem>

      {/* ══ Network Log / Transactions (6 cols) ══ */}
      <StaggerItem className="col-span-1 md:col-span-6">
        <GlassCard className="rounded-2xl p-5 h-full relative overflow-hidden" style={{ minHeight: 340 }}>
          <SectionHeader
            label="Network Log"
            action={
              <button className="text-[10px] text-white/30 hover:text-[#00F0FF] transition-colors cursor-pointer flex items-center gap-1">
                View All <ChevronRight size={10} />
              </button>
            }
          />
          <div className="space-y-0">
            {loadingTx ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3 border-b border-white/[0.04] flex gap-3">
                  <SkeletonBlock className="w-2 h-2 rounded-full mt-1.5" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-3.5 w-3/4" />
                    <SkeletonBlock className="h-2.5 w-1/3" />
                  </div>
                  <SkeletonBlock className="h-3.5 w-20" />
                </div>
              ))
            ) : (
              transactions?.slice(0, 5).map((tx) => <TxRow key={tx.id} tx={tx} />)
            )}
          </div>
        </GlassCard>
      </StaggerItem>

      {/* ══ Asset Holdings (12 cols) ══ */}
      <StaggerItem className="col-span-1 md:col-span-12">
        <GlassCard className="rounded-2xl p-5 relative overflow-hidden">
          <SectionHeader label="Asset Holdings" action={
            <button className="text-[10px] text-white/30 hover:text-[#00F0FF] transition-colors cursor-pointer">Manage</button>
          } />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loadingAssets ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-24 rounded-xl" />)
            ) : (
              assets?.map((asset) => (
                <MagicCard
                  key={asset.symbol}
                  className="glass-panel-bright rounded-xl p-4 border border-white/[0.06] hover:border-white/15 transition-all duration-300 cursor-pointer"
                  intensity={10}
                >
                  <div className="flex items-center justify-between mb-3">
                    <AssetIcon symbol={asset.symbol} size="sm" />
                    <ChangeBadge value={asset.change24h} />
                  </div>
                  <p className="text-xs text-white/40 mb-0.5">{asset.name}</p>
                  <p className="text-lg font-bold text-white tracking-tight">
                    {formatCurrency(asset.usdValue, 'USD', true)}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {asset.balance.toFixed(4)} {asset.symbol}
                  </p>
                  {/* Allocation bar */}
                  <div className="mt-3 h-0.5 rounded-full bg-white/[0.06]">
                    <div
                      className="h-0.5 rounded-full transition-all duration-1000"
                      style={{ width: `${asset.allocation}%`, backgroundColor: asset.color, boxShadow: `0 0 6px ${asset.color}50` }}
                    />
                  </div>
                  <p className="text-[9px] text-white/25 mt-1">{asset.allocation.toFixed(1)}% allocation</p>
                </MagicCard>
              ))
            )}
          </div>
        </GlassCard>
      </StaggerItem>
    </StaggerList>
  )
}
