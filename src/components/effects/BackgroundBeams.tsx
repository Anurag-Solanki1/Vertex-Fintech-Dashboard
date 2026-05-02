import React from 'react'
import { cn } from '@/lib/utils'

// Pure CSS background beams — no Framer Motion on SVG elements.
// SVG + feGaussianBlur filter + JS-driven motion was the primary GPU bottleneck.
// Replaced with CSS keyframe animations on the compositor thread.
export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none w-full h-full',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 to-[#050505] z-10" />
      <svg
        className="absolute w-[200vw] h-[200vh] -top-[50%] -left-[50%] stroke-white/5 opacity-40 mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="beam-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {/* Reduced blur stdDeviation from 8 to 4 — halves GPU cost of this filter */}
          <filter id="beam-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Static grid pattern — no animation, cheap */}
        <pattern id="beam-pattern" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 120V0H120" fill="none" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#beam-pattern)" />

        {/* CSS-animated circles — compositor thread, no JS per frame */}
        <circle r="150" fill="url(#beam-glow)" filter="url(#beam-blur)"
          style={{ animation: 'beam-drift-1 25s linear infinite', transformOrigin: '10% 20%' }} />
        <circle r="200" fill="url(#beam-glow)" filter="url(#beam-blur)"
          style={{ animation: 'beam-drift-2 35s linear infinite', transformOrigin: '80% 80%' }} />
        <circle r="100" fill="url(#beam-glow)" filter="url(#beam-blur)"
          style={{ animation: 'beam-drift-3 20s linear infinite', transformOrigin: '50% 50%' }} />
      </svg>
    </div>
  )
}
