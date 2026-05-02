import React from 'react'
import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
}

// Pure CSS border beam — no Framer Motion, runs on compositor thread (no JS overhead)
export function BorderBeam({
  className,
  duration = 4,
  colorFrom = '#00F0FF',
  colorTo = '#7701D0',
}: BorderBeamProps) {
  return (
    <div 
      className={cn('absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden', className)}
      style={{
        padding: '1px',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 3000,
          height: 3000,
          background: `conic-gradient(from 0deg, transparent 0deg, ${colorFrom} 60deg, ${colorTo} 120deg, transparent 180deg)`,
          top: '50%',
          left: '50%',
          marginLeft: -1500,
          marginTop: -1500,
          animation: `border-beam-spin ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      />
    </div>
  )
}

// GlassCard — Combines glass panel + optional BorderBeam
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  active?: boolean
  beam?: boolean
}

export function GlassCard({ children, className, active, beam = false, onClick, ...rest }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-panel rounded-xl relative overflow-hidden transition-all duration-300',
        active && 'border-[#00F0FF]/30 glow-cyan-sm',
        onClick && 'cursor-pointer',
        className
      )}
      {...rest}
    >
      {beam && <BorderBeam />}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
