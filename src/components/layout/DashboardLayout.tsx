import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { BackgroundBeams } from '@/components/effects/BackgroundBeams'
import { Menu, Bell, Search } from 'lucide-react'
import { useState } from 'react'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
}

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/analytics': 'Market Analytics',
  '/wallets': 'Wallets',
  '/trading': 'Trading',
  '/security': 'Security Center',
  '/terminal': 'System Terminal',
}

export function DashboardLayout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const title = pageTitles[location.pathname] || 'Vertex'

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e2e1] overflow-x-hidden relative">
      <BackgroundBeams className="fixed inset-0" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3 glass-panel-dark border-b border-white/[0.06]">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white/50 hover:text-white p-1 cursor-pointer">
          <Menu size={18} />
        </button>
        <h2 className="text-sm font-semibold text-white flex-1">{title}</h2>
        <button className="text-white/50 hover:text-white p-1 cursor-pointer">
          <Bell size={16} />
        </button>
      </header>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen relative z-10">
        {/* Desktop top bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/[0.04]">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">{title}</h2>
            <p className="text-[10px] text-white/30 tracking-wider mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/30 text-xs hover:border-white/15 transition-all cursor-text">
              <Search size={12} />
              <span>Search markets...</span>
              <kbd className="ml-4 text-[9px] text-white/20 px-1 py-0.5 rounded bg-white/5 border border-white/10">⌘K</kbd>
            </div>
            {/* Live dot */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#00F0FF]/5 border border-[#00F0FF]/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span className="text-[10px] text-[#00F0FF] tracking-wider">LIVE</span>
            </div>
          </div>
        </div>

        {/* Page content with transitions */}
        <div className="px-6 md:px-8 py-6 mt-14 md:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
