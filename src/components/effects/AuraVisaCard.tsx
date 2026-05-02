import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Wifi } from 'lucide-react'

export const AuraVisaCard = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 perspective-[1200px]">
      <motion.div
        className="relative w-full max-w-[320px] aspect-[1.586/1] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,240,255,0.15)]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: [-10, 10, -10],
          rotateX: [5, -5, 5],
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Deep space / metal background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#050505] to-[#0a1118]" />
        
        {/* Diagonal noise/texture for premium realism */}
        <div className="absolute inset-0 opacity-[0.15] bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />

        {/* Card Border that also glows continuously */}
        <motion.div 
          className="absolute inset-0 rounded-2xl border"
          animate={{
            borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,240,255,0.5)', 'rgba(119,1,208,0.3)', 'rgba(255,255,255,0.1)']
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Card Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
          {/* Top Row: Chip, Contactless & Logo */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <motion.div 
                className="w-10 h-7 rounded bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#aa8000] flex items-center justify-center opacity-90 shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] border border-yellow-600/50"
              >
                <Cpu size={16} className="text-black/60" />
              </motion.div>
              <Wifi size={20} className="text-white/40 rotate-90" />
            </div>
            <div className="text-right">
              <span className="text-xl font-bold tracking-widest text-white italic drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ fontFamily: 'Inter' }}>
                VISA
              </span>
            </div>
          </div>

          {/* Middle Row: Card Number */}
          <div className="mt-6">
            <p className="font-mono text-xl tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              4291 •••• •••• 8832
            </p>
          </div>

          {/* Bottom Row: Name & Expiry */}
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-[8px] text-[#00F0FF]/60 uppercase tracking-widest mb-0.5 font-semibold">Cardholder</p>
              <p className="text-xs font-semibold tracking-widest text-white uppercase drop-shadow-md">Aura Node System</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-[#00F0FF]/60 uppercase tracking-widest mb-0.5 font-semibold">Valid Thru</p>
              <p className="text-xs font-mono tracking-wider text-white drop-shadow-md">12/28</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
