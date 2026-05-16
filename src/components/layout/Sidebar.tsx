import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BarChart3, Wallet, CandlestickChart,
  Shield, Terminal, Zap, Bell, Settings, ChevronRight, Activity, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/wallets', icon: Wallet, label: 'Wallets' },
  { path: '/trading', icon: CandlestickChart, label: 'Trading' },
  { path: '/security', icon: Shield, label: 'Security' },
  { path: '/terminal', icon: Terminal, label: 'Terminal' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 glass-panel-dark border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center overflow-hidden">
              <img src="/vertex-logo.png" alt="Vertex" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-black tracking-[-0.04em] uppercase text-white">
              Vertex
            </h1>
          </div>
        </motion.div>
      </div>

      {/* Live status bar */}
      <div className="px-6 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-[#00F0FF] animate-pulse" />
          <span className="text-[10px] text-white/30 tracking-wider">NETWORK LIVE</span>
          <span className="ml-auto text-[10px] text-[#00F0FF]">47ms</span>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] text-white/20 tracking-[0.15em] uppercase px-3 mb-3">Main Menu</p>
        {navItems.map(({ path, icon: Icon, label }, i) => {
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)

          return (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
            >
              <NavLink to={path} className="block">
                <div
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer group',
                    isActive
                      ? 'bg-[#00F0FF]/8 text-[#00F0FF] border border-[#00F0FF]/20'
                      : 'text-white/40 hover:bg-white/[0.04] hover:text-white/80 border border-transparent'
                  )}
                >
                  {/* Active left beam */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBeam"
                      className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"
                    />
                  )}
                  <Icon size={15} className={isActive ? 'text-[#00F0FF]' : 'text-white/30 group-hover:text-white/60'} />
                  <span className={cn('font-medium tracking-tight', isActive && 'text-glow-soft')}>{label}</span>
                  {isActive && (
                    <ChevronRight size={12} className="ml-auto text-[#00F0FF]/60" />
                  )}
                </div>
              </NavLink>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom section */}
      <div className="px-3 pb-6 border-t border-white/[0.06] pt-4 space-y-1">
        {/* Notification & Settings */}
        <div className="flex gap-1 mb-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/70 transition-all duration-200 text-sm cursor-pointer">
            <Bell size={13} />
            <span className="text-xs">Alerts</span>
            <span className="ml-auto w-4 h-4 rounded-full bg-[#00F0FF] text-[8px] font-bold text-black flex items-center justify-center">3</span>
          </button>
          <button className="px-3 py-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/70 transition-all duration-200 cursor-pointer">
            <Settings size={13} />
          </button>
        </div>

        {/* Connect Wallet CTA */}
        <NavLink to="/connect-wallet" className="block">
          <div className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold border border-white/10 bg-white/[0.03] hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/5 hover:text-[#00F0FF] text-white/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
            <Zap size={12} />
            Connect Wallet
          </div>
        </NavLink>

        {/* User profile / Logout */}
        <NavLink to="/login" className="flex items-center gap-3 px-2 py-2 mt-2 rounded-lg hover:bg-[#EF5350]/10 border border-transparent hover:border-[#EF5350]/20 transition-all cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F0FF]/40 to-[#7701D0]/40 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white group-hover:border-[#EF5350]/40 transition-colors">
            AS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white/70 truncate group-hover:text-[#EF5350] transition-colors">Sign Out</p>
            <p className="text-[9px] text-white/30 tracking-wider">VERTEX-X Node</p>
          </div>
          <LogOut size={13} className="text-white/20 group-hover:text-[#EF5350] transition-colors" />
        </NavLink>
      </div>
    </nav>
  )
}
