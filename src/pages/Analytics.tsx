import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { MagicCard } from '@/components/effects/MagicCard'
import { GlassCard } from '@/components/effects/BorderBeam'
import { SectionHeader, AssetIcon, ChangeBadge, StaggerList, StaggerItem, SkeletonBlock } from '@/components/shared'
import { usePortfolioHistory, useMarketAssets, useAssets } from '@/hooks/useAuraData'
import { formatCurrency } from '@/lib/utils'

const PERIODS = ['1D', '1W', '1M', '3M', '1Y', 'ALL']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-panel rounded-lg px-3 py-2 border border-white/10 text-xs backdrop-blur-xl">
      <p className="text-white/40 mb-1 text-[9px] uppercase tracking-wider">{label}</p>
      <p className="text-[#00F0FF] font-semibold font-mono">{formatCurrency(payload[0]?.value)}</p>
    </div>
  )
}

const Sparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <LineChart width={60} height={28} data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
      <Line type="monotone" dataKey="v" stroke={positive ? '#26A69A' : '#EF5350'} strokeWidth={1.5} dot={false} />
    </LineChart>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('1M')
  const { data: history, isLoading: loadingHist } = usePortfolioHistory()
  const { data: marketAssets, isLoading: loadingMkt } = useMarketAssets()
  const { data: assets } = useAssets()

  const ringData = assets?.map((a) => ({ name: a.symbol, value: a.allocation, color: a.color })) || []
  const totalValue = 142500

  return (
    <StaggerList className="space-y-5">
      <StaggerItem>
        <GlassCard className="rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="text-[9px] text-white/30 tracking-[0.18em] uppercase font-semibold mb-2">Portfolio Performance</p>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-black text-white tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {formatCurrency(totalValue, 'USD', true)}
                </p>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-sm font-bold" style={{ color: '#26A69A' }}>+12.4%</span>
                  <TrendingUp size={14} style={{ color: '#26A69A' }} />
                </div>
              </div>
              <p className="text-[10px] text-white/30 mt-1">All time high: <span className="text-white/60">$158,230</span></p>
            </div>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/[0.05]">
              {PERIODS.map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${period === p ? 'bg-white/10 text-white border border-white/10' : 'text-white/30 hover:text-white/60 border border-transparent'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            {loadingHist ? <SkeletonBlock className="h-full rounded-xl" /> : (
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={history} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.25} />
                      <stop offset="80%" stopColor="#00F0FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9D4EDD" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#9D4EDD" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#00F0FF" strokeWidth={2} fill="url(#totalGrad)" dot={false} />
                  <Area type="monotone" dataKey="btc" stroke="#9D4EDD" strokeWidth={1.5} fill="url(#btcGrad)" dot={false} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </StaggerItem>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StaggerItem className="md:col-span-1">
          <GlassCard className="rounded-2xl p-6 h-full">
            <SectionHeader label="Asset Allocation" />
            <div className="flex flex-col items-center">
              <div className="relative">
                <PieChart width={200} height={200}>
                  <Pie data={ringData} cx={100} cy={100} innerRadius={62} outerRadius={88} paddingAngle={3} dataKey="value" strokeWidth={0} animationBegin={200} animationDuration={900}>
                    {ringData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 4px ${entry.color}50)` }} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[9px] text-white/30 tracking-widest uppercase font-semibold mb-0.5">Total</p>
                  <p className="text-base font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>{formatCurrency(totalValue, 'USD', true)}</p>
                  <p className="text-[9px] font-bold mt-0.5" style={{ color: '#26A69A' }}>+12.4%</p>
                </div>
              </div>
              <div className="space-y-2 w-full mt-3">
                {ringData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color, boxShadow: `0 0 5px ${d.color}` }} />
                      <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{d.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 rounded-full bg-white/[0.05] overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: d.color }} initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
                      </div>
                      <span className="text-xs font-semibold text-white/70 w-10 text-right">{d.value.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </StaggerItem>

        <StaggerItem className="md:col-span-2">
          <GlassCard className="rounded-2xl p-6 h-full">
            <SectionHeader label="Market Overview" />
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 px-2 pb-2 text-[9px] text-white/25 tracking-widest uppercase border-b border-white/[0.04] font-bold">
                <span className="col-span-4">Asset</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">24h</span>
                <span className="col-span-2 text-center">7d</span>
                <span className="col-span-2 text-right">Volume</span>
              </div>
              {loadingMkt ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 px-2 py-3">
                    <SkeletonBlock className="col-span-4 h-4" /><SkeletonBlock className="col-span-2 h-4" /><SkeletonBlock className="col-span-2 h-4" /><SkeletonBlock className="col-span-2 h-4" /><SkeletonBlock className="col-span-2 h-4" />
                  </div>
                ))
              ) : (
                marketAssets?.map((asset) => {
                  const isPositive = asset.change24h >= 0
                  const sparkData = Array.from({ length: 7 }, (_, i) =>
                    asset.price * (1 + Math.sin(i * 1.3 + asset.price % 5) * 0.03 * (isPositive ? 1 : -1))
                  )
                  return (
                    <MagicCard key={asset.symbol} tilt={false} className="grid grid-cols-12 gap-2 px-2 py-2.5 rounded-lg items-center cursor-pointer" intensity={5}>
                      <div className="col-span-4 flex items-center gap-2">
                        <AssetIcon symbol={asset.symbol} size="sm" />
                        <div>
                          <p className="text-xs font-bold text-white/80">{asset.symbol}</p>
                          <p className="text-[9px] text-white/30">{asset.name}</p>
                        </div>
                      </div>
                      <p className="col-span-2 text-right text-[11px] font-mono text-white/70">{formatCurrency(asset.price)}</p>
                      <div className="col-span-2 flex justify-end"><ChangeBadge value={asset.change24h} /></div>
                      <div className="col-span-2 flex justify-center"><Sparkline data={sparkData} positive={isPositive} /></div>
                      <p className="col-span-2 text-right text-[10px] text-white/40 font-mono">{formatCurrency(asset.volume24h, 'USD', true)}</p>
                    </MagicCard>
                  )
                })
              )}
            </div>
          </GlassCard>
        </StaggerItem>
      </div>
    </StaggerList>
  )
}
