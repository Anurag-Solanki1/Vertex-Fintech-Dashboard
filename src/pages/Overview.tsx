import React from 'react'
import { motion } from 'framer-motion'
import {
  Send, Download, Repeat2, ChevronRight, Cpu, 
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { NumberTicker, PctBadge } from '@/components/effects/NumberTicker'
import { BorderBeam } from '@/components/effects/BorderBeam'
import { AuraVisaCard } from '@/components/effects/AuraVisaCard'
import { StatusDot, SectionHeader, AssetIcon, StaggerList, StaggerItem, SkeletonBlock } from '@/components/shared'
import { usePortfolio, useTransactions, useAssets, usePortfolioHistory } from '@/hooks/useAuraData'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

// ─── Sparkline Tooltip ────────────────────────────────────────
const SparkTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#050508] border border-white/10 px-2 py-1 rounded text-[10px] text-[#00F0FF] shadow-xl">
      {formatCurrency(payload[0].value)}
    </div>
  )
}

// ─── Transaction Row (Dense) ──────────────────────────────────
function TxRow({ tx }: { tx: any }) {
  const isPos = tx.amount > 0
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] px-2 -mx-2 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <StatusDot status={tx.status} />
        <div>
          <p className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
            {tx.type === 'deposit' && 'Deposit'}
            {tx.type === 'withdrawal' && 'Withdraw'}
            {tx.type === 'swap' && 'Swap'}
            {tx.type === 'contract' && 'Contract'}
            {' '}<span className="text-white/40">{tx.asset}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className={`text-xs font-mono ${isPos ? 'text-[#00F0FF]' : 'text-white/70'}`}>
          {isPos ? '+' : ''}{tx.amount.toFixed(4)}
        </p>
        <p className="text-[9px] text-white/30 uppercase tracking-wider">
          {formatRelativeTime(new Date(tx.timestamp))}
        </p>
      </div>
    </div>
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
    <StaggerList className="flex flex-col gap-4 max-w-[1600px] mx-auto">
      
      {/* ══ Top KPI Strip (Dense) ══ */}
      <StaggerItem className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Balance */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col justify-between min-h-[90px]">
          <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Total Equity</p>
          <div className="flex items-center justify-between h-8 mt-auto gap-3">
            {loadingPort ? <SkeletonBlock className="h-8 w-32" /> : (
              <span className="text-2xl font-bold tracking-tight text-white flex items-baseline">
                $ <NumberTicker value={portfolio?.totalBalance ?? 0} decimals={2} duration={1000} />
              </span>
            )}
            <PctBadge value={portfolio?.changePct24h ?? 0} />
          </div>
        </div>

        {/* KPI 2: Daily PnL */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col justify-between min-h-[90px]">
          <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Unrealized PnL</p>
          <div className="flex items-center justify-between h-8 mt-auto gap-3">
            <span className="text-2xl font-bold tracking-tight text-[#00F0FF] flex items-center gap-1">
              <ArrowUpRight size={18} /> $15,690.45
            </span>
          </div>
        </div>

        {/* KPI 3: Buying Power */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col justify-between min-h-[90px]">
          <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Buying Power</p>
          <div className="flex items-center justify-between h-8 mt-auto gap-3">
            <span className="text-2xl font-bold tracking-tight text-white/90">
              $84,200.00
            </span>
            <span className="text-[10px] text-white/30">Margin: 12%</span>
          </div>
        </div>

        {/* KPI 4: 24h Volume */}
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col justify-between min-h-[90px]">
          <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">24h Volume</p>
          <div className="flex items-center justify-between h-8 mt-auto">
            <span className="text-2xl font-bold tracking-tight text-white/90">
              $1.24M
            </span>
            <Activity size={16} className="text-white/20" />
          </div>
        </div>
      </StaggerItem>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ══ Main Chart Panel (8 cols) ══ */}
        <StaggerItem className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 relative overflow-hidden flex flex-col h-[320px]">
          <BorderBeam size={200} duration={12} />
          <div className="flex justify-between items-center mb-4 z-10">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider">Equity Curve</h3>
              <span className="text-[10px] text-white/30 px-1.5 py-0.5 bg-white/5 rounded">1D</span>
            </div>
            <div className="flex gap-2">
              <button className="text-[10px] px-2 py-1 bg-white/[0.05] hover:bg-white/10 rounded text-white/60 transition-colors">1W</button>
              <button className="text-[10px] px-2 py-1 bg-white/[0.05] hover:bg-white/10 rounded text-white/60 transition-colors">1M</button>
              <button className="text-[10px] px-2 py-1 bg-[#00F0FF]/10 text-[#00F0FF] rounded border border-[#00F0FF]/20">YTD</button>
            </div>
          </div>
          
          <div className="flex-1 w-full -mx-2 z-10 relative">
            {loadingHist ? (
              <SkeletonBlock className="h-full w-full opacity-50" />
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#00F0FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<SparkTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="value" stroke="#00F0FF" strokeWidth={1.5} fill="url(#balGrad)" dot={false} activeDot={{ r: 4, fill: '#00F0FF', stroke: '#050508', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {/* Grid overlay for institutional feel */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent)' }} />
          </div>
        </StaggerItem>

        {/* ══ Network Log / Transactions (4 cols) ══ */}
        <StaggerItem className="lg:col-span-4 bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col h-[320px]">
          <SectionHeader
            label="Transaction Log"
            action={
              <button className="text-[10px] text-[#00F0FF] hover:underline cursor-pointer">
                View All
              </button>
            }
          />
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loadingTx ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="py-2 border-b border-white/[0.04] flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <SkeletonBlock className="w-1.5 h-1.5 rounded-full" />
                    <SkeletonBlock className="w-16 h-3" />
                  </div>
                  <SkeletonBlock className="w-12 h-3" />
                </div>
              ))
            ) : (
              <div className="space-y-0">
                {transactions?.slice(0, 8).map((tx) => <TxRow key={tx.id} tx={tx} />)}
              </div>
            )}
          </div>
        </StaggerItem>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ══ Assets Data Table (8 cols) ══ */}
        <StaggerItem className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col h-full">
          <SectionHeader label="Asset Holdings" />
          
          <div className="overflow-x-auto flex-1 mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-[10px] uppercase tracking-wider text-white/40">
                  <th className="pb-2 font-medium pl-2">Asset</th>
                  <th className="pb-2 font-medium text-right">Price</th>
                  <th className="pb-2 font-medium text-right">24h Change</th>
                  <th className="pb-2 font-medium text-right">Balance</th>
                  <th className="pb-2 font-medium text-right pr-2">Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {loadingAssets ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.02]">
                      <td className="py-3"><SkeletonBlock className="h-4 w-24" /></td>
                      <td className="py-3"><SkeletonBlock className="h-4 w-16 ml-auto" /></td>
                      <td className="py-3"><SkeletonBlock className="h-4 w-12 ml-auto" /></td>
                      <td className="py-3"><SkeletonBlock className="h-4 w-20 ml-auto" /></td>
                      <td className="py-3"><SkeletonBlock className="h-4 w-24 ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  assets?.map((asset) => (
                    <tr key={asset.symbol} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="py-2.5 pl-2 flex items-center gap-3">
                        <AssetIcon symbol={asset.symbol} size="sm" />
                        <div>
                          <p className="text-xs font-semibold text-white/90">{asset.symbol}</p>
                          <p className="text-[10px] text-white/40">{asset.name}</p>
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-xs font-mono text-white/80">
                        {formatCurrency(asset.usdValue / asset.balance)}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${asset.change24h >= 0 ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-[#EF5350] bg-[#EF5350]/10'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <p className="text-xs font-mono text-white/80">{asset.balance.toFixed(4)}</p>
                        <p className="text-[9px] text-white/30">{asset.allocation.toFixed(1)}%</p>
                      </td>
                      <td className="py-2.5 pr-2 text-right text-xs font-mono font-medium text-white">
                        {formatCurrency(asset.usdValue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </StaggerItem>

        {/* ══ Active Node & Quick Actions (4 cols) ══ */}
        <StaggerItem className="lg:col-span-4 flex flex-col gap-4 h-full">
          
          {/* Quick Action Buttons Row */}
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-white/[0.03] hover:bg-[#00F0FF]/10 border border-white/[0.05] hover:border-[#00F0FF]/30 transition-all rounded-lg p-3 flex flex-col items-center justify-center gap-2 group cursor-pointer">
              <Send size={16} className="text-white/40 group-hover:text-[#00F0FF]" />
              <span className="text-[10px] uppercase tracking-wider text-white/60 group-hover:text-[#00F0FF]">Send</span>
            </button>
            <button className="bg-white/[0.03] hover:bg-[#00F0FF]/10 border border-white/[0.05] hover:border-[#00F0FF]/30 transition-all rounded-lg p-3 flex flex-col items-center justify-center gap-2 group cursor-pointer">
              <Download size={16} className="text-white/40 group-hover:text-[#00F0FF]" />
              <span className="text-[10px] uppercase tracking-wider text-white/60 group-hover:text-[#00F0FF]">Receive</span>
            </button>
            <button className="bg-white/[0.03] hover:bg-[#9D4EDD]/10 border border-white/[0.05] hover:border-[#9D4EDD]/30 transition-all rounded-lg p-3 flex flex-col items-center justify-center gap-2 group cursor-pointer">
              <Repeat2 size={16} className="text-white/40 group-hover:text-[#9D4EDD]" />
              <span className="text-[10px] uppercase tracking-wider text-white/60 group-hover:text-[#9D4EDD]">Swap</span>
            </button>
          </div>

          {/* Visa Card / Node Info */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-5 flex-1 relative flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-[#00F0FF]" />
                <span className="text-[10px] font-semibold tracking-[0.1em] text-white/40 uppercase">Active Node</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                <span className="text-[10px] text-[#00F0FF] font-mono">Synced</span>
              </div>
            </div>
            
            <div className="w-full max-w-[260px] mx-auto flex-1 flex items-center">
              <AuraVisaCard />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="bg-black/40 border border-white/[0.05] rounded p-3 text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Block Height</p>
                <p className="text-xs font-mono text-white/70">21,892,304</p>
              </div>
              <div className="bg-black/40 border border-white/[0.05] rounded p-3 text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Network Uptime</p>
                <p className="text-xs font-mono text-[#00F0FF]">99.98%</p>
              </div>
            </div>
          </div>

        </StaggerItem>
      </div>

    </StaggerList>
  )
}
