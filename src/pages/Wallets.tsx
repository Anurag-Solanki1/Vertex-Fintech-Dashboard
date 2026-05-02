import { motion } from 'framer-motion'
import { Copy, ExternalLink, ArrowUpRight, ArrowDownLeft, Plus, Flame, Snowflake } from 'lucide-react'
import { GlassCard } from '@/components/effects/BorderBeam'
import { MagicCard } from '@/components/effects/MagicCard'
import { StaggerList, StaggerItem, AssetIcon, ChangeBadge, SectionHeader } from '@/components/shared'
import { useAssets } from '@/hooks/useAuraData'
import { formatCurrency } from '@/lib/utils'

const wallets = [
  { name: 'Primary Vault', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', chain: 'Ethereum', balance: 98_250, type: 'hot' },
  { name: 'Cold Storage', address: '0x3a4b...9d1e', chain: 'Multi-chain', balance: 44_250, type: 'cold' },
]

export default function Wallets() {
  const { data: assets } = useAssets()
  return (
    <StaggerList className="space-y-5">
      <StaggerItem>
        <div className="grid md:grid-cols-2 gap-4">
          {wallets.map((w) => {
            const isCold = w.type === 'cold'
            const accent = isCold ? '#9D4EDD' : '#00F0FF'
            return (
              <MagicCard key={w.name}
                className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/[0.08] hover:border-[#00F0FF]/20 transition-all duration-300"
                intensity={10}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 pointer-events-none opacity-25"
                  style={{ background: `radial-gradient(circle at 80% 20%, ${accent}20 0%, transparent 60%)` }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      {/* SVG icon instead of emoji — per UI/UX Pro Max "No emoji icons" rule */}
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>
                        {isCold
                          ? <Snowflake size={14} style={{ color: accent }} />
                          : <Flame size={14} style={{ color: accent }} />
                        }
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[0.15em] uppercase font-semibold mb-0.5" style={{ color: `${accent}80` }}>
                          {isCold ? 'Cold Storage' : 'Hot Wallet'}
                        </p>
                        <h3 className="text-base font-bold text-white">{w.name}</h3>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wider" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
                      {w.chain.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-3xl font-black text-white tracking-tight mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {formatCurrency(w.balance, 'USD', true)}
                  </p>

                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/[0.06] mb-4">
                    <span className="text-[10px] font-mono text-white/40 flex-1 truncate">{w.address}</span>
                    <button className="text-white/30 hover:text-[#00F0FF] transition-colors cursor-pointer"><Copy size={11} /></button>
                    <button className="text-white/30 hover:text-[#00F0FF] transition-colors cursor-pointer"><ExternalLink size={11} /></button>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                      style={{ background: `${accent}12`, color: accent, borderColor: `${accent}30` }}
                      onMouseEnter={e => (e.currentTarget.style.background = `${accent}22`)}
                      onMouseLeave={e => (e.currentTarget.style.background = `${accent}12`)}>
                      <ArrowUpRight size={12} /> Send
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white text-xs font-bold border border-white/[0.08] transition-all cursor-pointer">
                      <ArrowDownLeft size={12} /> Receive
                    </button>
                  </div>
                </div>
              </MagicCard>
            )
          })}

          {/* Add wallet button */}
          <button className="glass-panel rounded-2xl p-6 border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5 transition-all cursor-pointer group min-h-[220px]">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] group-hover:bg-[#00F0FF]/10 border border-white/10 group-hover:border-[#00F0FF]/30 flex items-center justify-center transition-all">
              <Plus size={18} className="text-white/30 group-hover:text-[#00F0FF] transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/30 group-hover:text-[#00F0FF] transition-colors">Add Wallet</p>
              <p className="text-[10px] text-white/20 mt-1">Connect or import</p>
            </div>
          </button>
        </div>
      </StaggerItem>

      {/* Token Holdings */}
      <StaggerItem>
        <GlassCard className="rounded-2xl p-6">
          <SectionHeader label="Token Holdings" action={
            <p className="text-[9px] text-white/30 font-mono">
              Total: <span className="text-white/60">{formatCurrency(assets?.reduce((s, a) => s + a.usdValue, 0) ?? 0, 'USD', true)}</span>
            </p>
          } />

          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-3 pb-2 text-[9px] text-white/25 tracking-widest uppercase border-b border-white/[0.04] font-bold mb-1">
            <span className="col-span-5">Asset</span>
            <span className="col-span-3 text-right">Value</span>
            <span className="col-span-2 text-right">24h</span>
            <span className="col-span-2 text-right">Qty</span>
          </div>

          <div className="space-y-0.5">
            {assets?.map((asset) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-12 gap-2 items-center py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] px-3 -mx-0 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <AssetIcon symbol={asset.symbol} />
                  <div>
                    <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{asset.name}</p>
                    <p className="text-[9px] text-white/30 font-mono">{asset.symbol}</p>
                  </div>
                </div>
                <p className="col-span-3 text-right text-sm font-bold text-white font-mono">{formatCurrency(asset.usdValue, 'USD', true)}</p>
                <div className="col-span-2 flex justify-end"><ChangeBadge value={asset.change24h} /></div>
                <p className="col-span-2 text-right text-[10px] text-white/40 font-mono">{asset.balance.toFixed(4)}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </StaggerItem>
    </StaggerList>
  )
}
