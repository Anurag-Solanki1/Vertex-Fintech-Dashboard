import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface NumberTickerProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function NumberTicker({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1800,
  className,
}: NumberTickerProps) {
  const [displayed, setDisplayed] = useState(0)
  const startRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const startVal = startRef.current
    const diff = value - startVal
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(startVal + diff * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      else startRef.current = value
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayed)

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

// Animated percentage badge
interface PctBadgeProps {
  value: number
  className?: string
}

export function PctBadge({ value, className }: PctBadgeProps) {
  const isPos = value >= 0
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
        isPos
          ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]'
          : 'bg-red-500/10 border border-red-500/30 text-red-400'
      } ${className}`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        {isPos ? (
          <path d="M5 2L9 7H1L5 2Z" fill="currentColor" />
        ) : (
          <path d="M5 8L1 3H9L5 8Z" fill="currentColor" />
        )}
      </svg>
      {isPos ? '+' : ''}{value.toFixed(2)}%
    </motion.div>
  )
}
