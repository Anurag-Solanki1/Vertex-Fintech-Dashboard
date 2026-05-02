import { Outlet } from 'react-router-dom'
import { BackgroundBeams } from '@/components/effects/BackgroundBeams'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-[#050508] flex items-center justify-center p-4 overflow-hidden selection:bg-[#00F0FF]/30">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#26A69A]/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Brand Logo Header */}
        <div className="relative z-20 mb-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.4)] overflow-hidden">
            <img src="/vertex-logo.png" alt="Vertex" className="w-full h-full object-cover relative z-30" />
          </div>
          <h1 className="text-3xl font-black tracking-widest text-white drop-shadow-2xl">VERTEX<span className="text-[#00F0FF]">OS</span></h1>
        </div>

        {/* Route Outlet (Login / Signup Forms) */}
        <div className="w-full">
          <Outlet />
        </div>

      </div>
    </div>
  )
}
