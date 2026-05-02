import React, { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: string
  intensity?: number
  tilt?: boolean
  onClick?: () => void
}

export function MagicCard({
  children,
  className,
  style,
  glowColor = 'rgba(0,240,255,0.15)',
  intensity = 15,
  tilt = true,
  onClick,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)  // RAF handle for mousemove throttle
  
  // High-performance motion values — updated via RAF, not raw mousemove
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(50)
  
  // Spring config for smooth rotation
  const springConfig = { damping: 30, stiffness: 300 }
  const rotateX = useSpring(useMotionValue(0), springConfig)
  const rotateY = useSpring(useMotionValue(0), springConfig)

  const [isHovered, setIsHovered] = useState(false)

  // Glow template string directly mapping motion values
  const background = useMotionTemplate`radial-gradient(circle at ${mouseX}% ${mouseY}%, ${glowColor} 0%, transparent 60%)`

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // RAF throttle — ensures we compute at most once per 16ms frame
    if (rafRef.current) return
    const clientX = e.clientX
    const clientY = e.clientY
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const cx = clientX - rect.left
      const cy = clientY - rect.top
      const hw = rect.width / 2
      const hh = rect.height / 2
      
      if (tilt) {
        rotateX.set(((cy - hh) / hh) * -intensity)
        rotateY.set(((cx - hw) / hw) * intensity)
      }
      mouseX.set((cx / rect.width) * 100)
      mouseY.set((cy / rect.height) * 100)
    })
  }, [intensity, rotateX, rotateY, mouseX, mouseY, tilt])

  const handleMouseLeave = useCallback(() => {
    if (tilt) {
      rotateX.set(0)
      rotateY.set(0)
    }
    setIsHovered(false)
  }, [rotateX, rotateY, tilt])

  return (
    <motion.div
      ref={cardRef}
      className={cn('relative overflow-hidden', className)}
      style={{ 
        ...(tilt && { transformStyle: 'preserve-3d', perspective: 1000, rotateX, rotateY }),
        ...style 
      }}
      animate={{
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Moving glow spot, completely GPU-accelerated without React renders */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  )
}
