import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { GlassCard } from './BorderBeam'

interface MeteorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: number
  beam?: boolean
  active?: boolean
}

export const MeteorCard = ({
  number = 20,
  beam = false,
  active = false,
  className,
  children,
  ...rest
}: MeteorCardProps) => {
  const [meteors, setMeteors] = useState<
    { id: number; left: string; delay: string; duration: string }[]
  >([])

  useEffect(() => {
    const generatedMeteors = Array.from({ length: number }).map((_, idx) => ({
      id: idx,
      left: Math.floor(Math.random() * (400 - -400) + -400) + 'px',
      delay: Math.random() * (0.8 - 0.2) + 0.2 + 's',
      duration: Math.floor(Math.random() * (10 - 2) + 2) + 's',
    }))
    setMeteors(generatedMeteors)
  }, [number])

  return (
    <GlassCard
      active={active}
      beam={beam}
      className={cn('relative overflow-hidden', className)}
      {...rest}
    >
      <div className="absolute inset-0 pointer-events-none">
        {meteors.map((m) => (
          <span
            key={m.id}
            className={cn(
              'animate-meteor-effect absolute top-1/2 left-1/2 h-[0.1rem] w-[50px] rounded-[9999px] shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]',
              "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#00F0FF] before:to-transparent"
            )}
            style={{
              top: 0,
              left: m.left,
              animationDelay: m.delay,
              animationDuration: m.duration,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </GlassCard>
  )
}
