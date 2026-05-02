import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/effects/BorderBeam'

export function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate signup
    navigate('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <GlassCard className="w-full rounded-2xl p-8 border border-white/[0.05] shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Request Access</h2>
          <p className="text-sm text-white/40">Create an account to access the Vertex OS</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 tracking-wider uppercase pl-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-white/30 group-focus-within:text-[#00F0FF] transition-colors" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20 transition-all font-mono text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 tracking-wider uppercase pl-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-white/30 group-focus-within:text-[#00F0FF] transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20 transition-all font-mono text-sm"
                placeholder="operator@vertex.os"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 tracking-wider uppercase pl-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-white/30 group-focus-within:text-[#00F0FF] transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20 transition-all font-mono text-sm tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            type="submit"
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#26A69A] p-[1px] mt-6"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors" />
            <div className="relative bg-[#050508] px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-[#00F0FF]/10 group-hover:to-[#26A69A]/10 transition-colors">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#26A69A] group-hover:text-white transition-colors duration-300">
                CREATE ACCOUNT
              </span>
              <ArrowRight className="w-4 h-4 text-[#26A69A] group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
            </div>
          </motion.button>
        </form>

        <p className="mt-8 text-center text-xs text-white/40">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00F0FF] hover:text-[#00F0FF]/80 hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </motion.div>
  )
}
