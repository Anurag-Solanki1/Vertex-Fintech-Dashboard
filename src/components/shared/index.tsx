import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// ── Status dot ────────────────────────────────────────────────
type StatusType = 'completed' | 'pending' | 'failed' | 'active' | 'warning'

const statusStyles: Record<StatusType, string> = {
  completed: 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]',
  active: 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse',
  pending: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse',
  warning: 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.5)]',
  failed: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]',
}

export function StatusDot({ status, className }: { status: StatusType; className?: string }) {
  return (
    <span className={cn('inline-block w-2 h-2 rounded-full shrink-0', statusStyles[status], className)} />
  )
}

// ── Skeleton loader ───────────────────────────────────────────
export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('shimmer rounded bg-white/5', className)} />
}

// ── Section Header ────────────────────────────────────────────
interface SectionHeaderProps {
  label: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({ label, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-5', className)}>
      <span className="text-[10px] font-semibold tracking-[0.15em] text-white/40 uppercase" style={{ fontFamily: "'Space Grotesk', monospace" }}>
        {label}
      </span>
      {action}
    </div>
  )
}

// ── Asset Icon Badge ──────────────────────────────────────────
const assetColors: Record<string, { bg: string; text: string }> = {
  BTC: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  ETH: { bg: 'bg-[#00F0FF]/10', text: 'text-[#00F0FF]' },
  SOL: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  USDC: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  AVAX: { bg: 'bg-red-500/15', text: 'text-red-400' },
  LINK: { bg: 'bg-blue-400/15', text: 'text-blue-300' },
}

export function AssetIcon({ symbol, size = 'md' }: { symbol: string; size?: 'sm' | 'md' | 'lg' }) {
  const style = assetColors[symbol] || { bg: 'bg-white/10', text: 'text-white/60' }
  const sizeClasses = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-11 h-11 text-sm' }
  return (
    <div className={cn('rounded-lg flex items-center justify-center font-bold shrink-0', style.bg, style.text, sizeClasses[size])}>
      {symbol.slice(0, 3)}
    </div>
  )
}

// ── Change Badge ──────────────────────────────────────────────
export function ChangeBadge({ value, className }: { value: number; className?: string }) {
  const isPos = value >= 0
  return (
    <span
      className={cn(
        'text-xs font-semibold',
        isPos ? 'text-[#00F0FF]' : 'text-red-400',
        className
      )}
    >
      {isPos ? '+' : ''}{value.toFixed(2)}%
    </span>
  )
}

// ── Stagger container ─────────────────────────────────────────
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export function StaggerList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={cn(className)} variants={staggerContainer} initial="hidden" animate="show">
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}
