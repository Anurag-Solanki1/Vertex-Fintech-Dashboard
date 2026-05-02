import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  className?: string
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div className={cn('fixed inset-0 pointer-events-none overflow-hidden z-0', className)}>
      {/* Primary cyan orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '-10%',
          left: '15%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(0,240,255,0.04) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Purple orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: '5%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(119,1,208,0.15) 0%, rgba(119,1,208,0.05) 50%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Soft middle glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          top: '40%',
          left: '45%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
    </div>
  )
}
