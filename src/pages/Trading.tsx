import { useState } from 'react'
import { ChevronDown, Settings2, TrendingUp, TrendingDown, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'
import { GlassCard } from '@/components/effects/BorderBeam'
import { MagicCard } from '@/components/effects/MagicCard'
import { NumberTicker, PctBadge } from '@/components/effects/NumberTicker'
import { StaggerList, StaggerItem, SkeletonBlock } from '@/components/shared'
import { useOrderBook, useRecentTrades } from '@/hooks/useAuraData'

const PAIRS = ['BTC/USDC', 'ETH/USDC', 'SOL/USDC', 'AVAX/USDC']
const TIMEFRAMES = ['5M', '15M', '1H', '4H', '1D']

// TradingView-standard candlestick colors per UI/UX Pro Max chart guidelines
const BULL_COLOR = '#26A69A'
const BEAR_COLOR = '#EF5350'

// Inline CSS for the range input thumb (required since Tailwind can't style ::-webkit-slider-thumb)
const sliderCSS = `
  input[type='range'].leverage-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #00F0FF;
    box-shadow: 0 0 8px rgba(0,240,255,0.7);
    cursor: pointer;
    border: 2px solid rgba(0,240,255,0.3);
    transition: transform 0.15s ease;
  }
  input[type='range'].leverage-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  input[type='range'].leverage-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #00F0FF;
    box-shadow: 0 0 8px rgba(0,240,255,0.7);
    cursor: pointer;
    border: none;
  }
`

// Helper to map our pair format to TradingView symbol format
const getTVSymbol = (pair: string) => {
  const base = pair.split('/')[0]
  return `BINANCE:${base}USDT`
}

export default function Trading() {
  const [pair, setPair] = useState('BTC/USDC')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [leverage, setLeverage] = useState(10)
  const [timeframe, setTimeframe] = useState('15M')
  const [rightTab, setRightTab] = useState<'book' | 'trades'>('book')
  const { data: orderBook } = useOrderBook(pair)
  const { data: trades } = useRecentTrades(pair)

  // Map our UI timeframe to TradingView interval format
  const getTVInterval = (tf: string): any => {
    switch (tf) {
      case '5M': return '5'
      case '15M': return '15'
      case '1H': return '60'
      case '4H': return '240'
      case '1D': return 'D'
      default: return '15'
    }
  }

  const livePrice = 60012.50

  // Bid/ask depth ratio for the depth bar
  const totalBid = orderBook?.bids.reduce((s, b) => s + b.size, 0) ?? 1
  const totalAsk = orderBook?.asks.reduce((s, a) => s + a.size, 0) ?? 1
  const bidRatio = Math.round((totalBid / (totalBid + totalAsk)) * 100)

  const isBuy = side === 'buy'
  const execBorderColor = isBuy ? 'rgba(0,240,255,0.35)' : 'rgba(239,68,68,0.35)'
  const execGlowColor = isBuy ? 'rgba(0,240,255,0.08)' : 'rgba(239,68,68,0.08)'

  return (
    <>
      {/* Inject slider thumb CSS */}
      <style>{sliderCSS}</style>

      <StaggerList className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* ═══ LEFT: Metrics Bar + Chart ═══ */}
        <StaggerItem className="col-span-1 xl:col-span-8 flex flex-col gap-5">

          {/* Metrics Header */}
          <GlassCard className="rounded-2xl p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Pair selector */}
                <div className="flex bg-black/50 p-1 rounded-xl border border-white/[0.06]">
                  {PAIRS.map((p) => (
                    <button key={p} onClick={() => setPair(p)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all cursor-pointer ${pair === p
                        ? 'bg-white/10 text-white border border-white/15 shadow-inner'
                        : 'text-white/40 hover:text-white/70 border border-transparent'}`}>
                      {p}
                    </button>
                  ))}
                </div>

                <div className="h-8 w-px bg-white/10 hidden md:block" />

                {/* Live price */}
                <div className="flex flex-col">
                  <div className="flex items-end gap-2.5">
                    <span className="text-3xl font-black text-white tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      $<NumberTicker value={livePrice} decimals={2} duration={1800} />
                    </span>
                    <div className="mb-1"><PctBadge value={1.84} /></div>
                  </div>
                  <span className="text-[9px] text-[#00F0FF]/50 font-mono tracking-[0.15em] uppercase">Mark Price</span>
                </div>
              </div>

              {/* Sub stats */}
              <div className="flex gap-5 text-xs bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                {[
                  { label: '24h High', val: '$61,240', icon: <TrendingUp size={10} className="text-[#26A69A]" /> },
                  { label: '24h Low', val: '$58,800', icon: <TrendingDown size={10} className="text-[#EF5350]" /> },
                  { label: 'Volume', val: '$28.4B', icon: null },
                ].map(({ label, val, icon }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      {icon}
                      <span className="text-[9px] text-white/30 tracking-widest uppercase font-semibold">{label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-white/80">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Chart */}
          <GlassCard className="rounded-2xl p-5 flex-1 relative overflow-hidden min-h-[480px]">
            {/* Chart header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00F0FF]/10 border border-[#00F0FF]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
                  <span className="text-[9px] font-bold text-[#00F0FF] tracking-[0.15em] uppercase">Live</span>
                </div>
                <span className="text-xs font-semibold text-white/40">{pair}</span>
              </div>

              {/* Timeframe tabs */}
              <div className="flex bg-black/50 p-1 rounded-xl border border-white/[0.05]">
                {TIMEFRAMES.map((tf) => (
                  <button key={tf} onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest transition-all cursor-pointer ${timeframe === tf
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-white/30 hover:text-white/60 border border-transparent'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Bid/Ask Depth Ratio Bar */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[9px] font-mono text-[#26A69A] w-8">{bidRatio}%</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#EF5350]/30">
                <motion.div
                  className="h-full rounded-full bg-[#26A69A]"
                  initial={{ width: '50%' }}
                  animate={{ width: `${bidRatio}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ boxShadow: '0 0 8px rgba(38,166,154,0.5)' }}
                />
              </div>
              <span className="text-[9px] font-mono text-[#EF5350] w-8 text-right">{100 - bidRatio}%</span>
            </div>

            {/* Chart canvas */}
            <div className="w-full h-[calc(100%-110px)] relative">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] opacity-60 pointer-events-none" />

              <div className="w-full h-full overflow-hidden rounded-xl border border-white/[0.05]">
                <AdvancedRealTimeChart
                  symbol={getTVSymbol(pair)}
                  theme="dark"
                  interval={getTVInterval(timeframe)}
                  timezone="Etc/UTC"
                  style="1"
                  locale="en"
                  backgroundColor="#050508" // OLED dark mode sync
                  hide_top_toolbar={false}
                  hide_legend={false}
                  save_image={false}
                  container_id="tv_chart_main"
                  autosize
                />
              </div>

            </div>
          </GlassCard>
        </StaggerItem>

        {/* ═══ RIGHT: Execution + Order Book ═══ */}
        <StaggerItem className="col-span-1 xl:col-span-4 flex flex-col gap-5">

          {/* Premium Execution Panel — dynamic border follows buy/sell */}
          <motion.div
            className="glass-panel rounded-2xl p-5 relative overflow-hidden"
            animate={{
              borderColor: execBorderColor,
              boxShadow: `0 0 30px ${execGlowColor}, inset 0 0 30px ${execGlowColor}`,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ border: '1px solid', borderColor: execBorderColor }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase">Execute Order</h2>
              <Settings2 size={14} className="text-white/30 hover:text-[#00F0FF] transition-colors cursor-pointer" />
            </div>

            {/* Buy/Sell animated toggle */}
            <div className="flex gap-1 bg-black/60 p-1 rounded-xl mb-5 border border-white/[0.05] relative overflow-hidden">
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg z-0"
                animate={{
                  left: isBuy ? '4px' : 'calc(50%)',
                  background: isBuy
                    ? 'linear-gradient(135deg,rgba(0,240,255,0.15),rgba(0,160,255,0.1))'
                    : 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(200,30,30,0.1))',
                  borderColor: isBuy ? 'rgba(0,240,255,0.3)' : 'rgba(239,68,68,0.3)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ border: '1px solid' }}
              />
              {(['buy', 'sell'] as const).map((s) => (
                <button key={s} onClick={() => setSide(s)}
                  className={`flex-1 py-2.5 relative z-10 text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${side === s ? (s === 'buy' ? 'text-[#00F0FF]' : 'text-[#EF5350]') : 'text-white/30 hover:text-white/60'}`}>
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Price input */}
              <div className="group">
                <label className="text-[9px] text-white/40 tracking-widest font-bold uppercase block mb-1.5 ml-1">Limit Price</label>
                <div className="relative flex items-center">
                  <input type="number" defaultValue="60012.50"
                    className="w-full bg-black/50 border border-white/[0.08] group-hover:border-white/20 focus:border-[#00F0FF]/60 focus:bg-[#00F0FF]/[0.03] transition-all rounded-xl py-3 px-4 text-white font-mono text-sm focus:outline-none"
                  />
                  <span className="absolute right-4 text-[10px] text-white/25 font-bold uppercase tracking-wider">USDC</span>
                </div>
              </div>

              {/* Amount input */}
              <div className="group">
                <div className="flex justify-between items-end mb-1.5 px-1">
                  <label className="text-[9px] text-white/40 tracking-widest font-bold uppercase">Amount</label>
                  <span className="text-[9px] text-[#00F0FF]/60 cursor-pointer hover:text-[#00F0FF] transition-colors font-mono">Max: 2.45 BTC</span>
                </div>
                <div className="relative flex items-center">
                  <input type="number" defaultValue="0.1500"
                    className="w-full bg-black/50 border border-white/[0.08] group-hover:border-white/20 focus:border-[#00F0FF]/60 focus:bg-[#00F0FF]/[0.03] transition-all rounded-xl py-3 px-4 text-white font-mono text-sm focus:outline-none"
                  />
                  <span className="absolute right-4 text-[10px] text-white/25 font-bold uppercase tracking-wider">BTC</span>
                </div>
              </div>

              {/* Leverage slider — CSS injected above makes thumb visible */}
              <div className="pt-2 pb-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3 px-1">
                  <span className="text-white/40">Leverage</span>
                  <span className="text-[#00F0FF] font-mono tabular-nums">{leverage}x</span>
                </div>
                <div className="px-1">
                  <input
                    type="range" min="1" max="100" value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className="leverage-slider w-full h-1 rounded-full appearance-none cursor-pointer outline-none"
                    style={{
                      background: `linear-gradient(to right, #00F0FF 0%, #00F0FF ${leverage}%, rgba(255,255,255,0.08) ${leverage}%, rgba(255,255,255,0.08) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-[8px] font-mono text-white/20 mt-2">
                    {['1x', '25x', '50x', '75x', '100x'].map(v => <span key={v}>{v}</span>)}
                  </div>
                </div>
              </div>

              {/* Summary + Fee Estimate */}
              <div className="pt-3 mt-1 border-t border-white/[0.05] space-y-2">
                <div className="flex justify-between text-[10px] px-1">
                  <span className="text-white/30 uppercase tracking-widest font-bold">Total Value</span>
                  <span className="font-mono text-white/70">~9,001.87 USDC</span>
                </div>
                <div className="flex justify-between text-[10px] px-1">
                  <span className="flex items-center gap-1 text-white/30 uppercase tracking-widest font-bold">
                    Est. Fee <Info size={9} className="text-white/20" />
                  </span>
                  <span className="font-mono text-yellow-400/70">~2.25 USDC (0.025%)</span>
                </div>
              </div>

              {/* Execute button */}
              <button
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-xl relative overflow-hidden group cursor-pointer
                  ${isBuy
                    ? 'bg-gradient-to-r from-[#00F0FF]/80 to-[#00A0FF]/80 text-black shadow-[0_4px_20px_rgba(0,240,255,0.2)] hover:shadow-[0_4px_30px_rgba(0,240,255,0.4)]'
                    : 'bg-gradient-to-r from-[#EF5350]/80 to-[#C62828]/80 text-white shadow-[0_4px_20px_rgba(239,83,80,0.2)] hover:shadow-[0_4px_30px_rgba(239,83,80,0.4)]'}`}
              >
                <span className="relative z-10 drop-shadow">{isBuy ? '▲ Execute Long' : '▼ Execute Short'}</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Order Book / Trades Panel */}
          <GlassCard className="rounded-2xl p-5 flex-1 min-h-[320px] flex flex-col">
            {/* Tabs */}
            <div className="flex gap-5 mb-4 border-b border-white/[0.05] pb-3">
              {(['book', 'trades'] as const).map((tab) => (
                <button key={tab} onClick={() => setRightTab(tab)}
                  className={`text-[10px] font-bold tracking-widest uppercase transition-colors relative cursor-pointer ${rightTab === tab ? 'text-[#00F0FF]' : 'text-white/30 hover:text-white/60'}`}>
                  {tab === 'book' ? 'Order Book' : 'Recent Trades'}
                  {rightTab === tab && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-[#00F0FF] rounded-t-full shadow-[0_0_8px_#00F0FF]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {rightTab === 'book' ? (
                <div className="font-mono text-[10px]">
                  <div className="grid grid-cols-3 text-[9px] text-white/25 tracking-widest font-bold uppercase pb-2 mb-1">
                    <span>Price</span><span className="text-center">Size</span><span className="text-right">Total</span>
                  </div>

                  {/* Asks — reversed so lowest ask is closest to spread */}
                  <div className="flex flex-col-reverse space-y-[1px]">
                    {orderBook?.asks.slice(0, 8).map((ask, i) => (
                      <div key={i} className="relative grid grid-cols-3 py-[3px] items-center cursor-pointer group">
                        <div className="absolute inset-y-0 right-0 rounded-sm transition-opacity opacity-15 group-hover:opacity-30" style={{ width: `${ask.depth * 100}%`, backgroundColor: BEAR_COLOR }} />
                        <span className="relative font-semibold" style={{ color: BEAR_COLOR }}>{ask.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className="relative text-center text-white/50">{ask.size.toFixed(3)}</span>
                        <span className="relative text-right text-white/30">{ask.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spread */}
                  <div className="py-2.5 my-1 flex items-center justify-between px-1 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider">Spread</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-[11px]">{(orderBook?.spread ?? 0).toFixed(2)}</span>
                      <span className="text-[8px] text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded">0.01%</span>
                    </div>
                  </div>

                  {/* Bids */}
                  <div className="space-y-[1px]">
                    {orderBook?.bids.slice(0, 8).map((bid, i) => (
                      <div key={i} className="relative grid grid-cols-3 py-[3px] items-center cursor-pointer group">
                        <div className="absolute inset-y-0 right-0 rounded-sm transition-opacity opacity-15 group-hover:opacity-30" style={{ width: `${bid.depth * 100}%`, backgroundColor: BULL_COLOR }} />
                        <span className="relative font-semibold" style={{ color: BULL_COLOR }}>{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        <span className="relative text-center text-white/50">{bid.size.toFixed(3)}</span>
                        <span className="relative text-right text-white/30">{bid.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="font-mono text-[10px] space-y-1">
                  {trades?.map((t) => {
                    const isBuy = t.side === 'buy'
                    return (
                      <div key={t.id} className="grid grid-cols-3 py-1.5 items-center hover:bg-white/[0.02] rounded px-1 transition-colors cursor-pointer">
                        <span className="font-semibold" style={{ color: isBuy ? BULL_COLOR : BEAR_COLOR }}>
                          ${t.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-center text-white/50">{t.size.toFixed(4)}</span>
                        <span className="text-right text-white/25">{new Date(t.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </GlassCard>
        </StaggerItem>
      </StaggerList>
    </>
  )
}
