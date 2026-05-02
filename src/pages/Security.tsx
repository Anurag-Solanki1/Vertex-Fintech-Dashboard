import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Smartphone, Key, Mail, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { GlassCard } from '@/components/effects/BorderBeam'
import { SectionHeader, StaggerList, StaggerItem, SkeletonBlock } from '@/components/shared'
import { useSecurityScore, useAuditLog } from '@/hooks/useAuraData'

function HealthGauge({ score }: { score: number }) {
  const R = 80
  const circumference = 2 * Math.PI * R
  const offset = circumference * (1 - score / 100)
  const color = score >= 80 ? '#00F0FF' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx="100" cy="100" r={R} stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
          {/* Animated glow pulse on arc */}
          <motion.circle
            cx="100" cy="100" r={R}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: offset,
              filter: [`drop-shadow(0 0 4px ${color}40)`, `drop-shadow(0 0 12px ${color}80)`, `drop-shadow(0 0 4px ${color}40)`],
            }}
            transition={{
              strokeDashoffset: { duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 },
              filter: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 },
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-5xl font-black text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.4 }}>
            {score}
          </motion.span>
          <span className="text-xs text-white/40 tracking-wider mt-1">/ 100</span>
          <span className="text-[10px] font-bold mt-1 tracking-widest" style={{ color }}>
            {score >= 80 ? 'SECURE' : score >= 60 ? 'MODERATE' : 'AT RISK'}
          </span>
        </div>
      </div>
    </div>
  )
}

function SecToggle({ label, icon: Icon, enabled, accent = 'cyan' }: { label: string; icon: any; enabled: boolean; accent?: 'cyan' | 'purple' }) {
  const [on, setOn] = useState(enabled)
  const color = accent === 'cyan' ? '#00F0FF' : '#9D4EDD'
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-3">
        {/* Colored icon bg when enabled — per UI/UX Pro Max toggle guidelines */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
          style={{
            background: on ? `${color}18` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${on ? color + '30' : 'transparent'}`,
          }}
        >
          <Icon size={14} style={{ color: on ? color : 'rgba(255,255,255,0.3)', transition: 'color 0.3s' }} />
        </div>
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <button
        onClick={() => setOn(!on)}
        className="relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer"
        style={{ background: on ? `${color}30` : 'rgba(255,255,255,0.08)', border: `1px solid ${on ? color : 'rgba(255,255,255,0.1)'}` }}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full"
          animate={{ left: on ? '1.25rem' : '0.125rem' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ background: on ? color : 'rgba(255,255,255,0.3)', boxShadow: on ? `0 0 6px ${color}` : 'none' }}
        />
      </button>
    </div>
  )
}

const statusIcon: Record<string, React.ReactNode> = {
  success: <CheckCircle size={12} className="text-[#00F0FF]" />,
  warning: <AlertTriangle size={12} className="text-yellow-400" />,
  failed: <XCircle size={12} className="text-red-400" />,
}
const statusText: Record<string, string> = {
  success: 'text-[#00F0FF]',
  warning: 'text-yellow-400',
  failed: 'text-red-400',
}
// Row background tints for audit log — per skill colored row highlights
const rowBg: Record<string, string> = {
  success: 'hover:bg-[#00F0FF]/[0.03]',
  warning: 'hover:bg-yellow-400/[0.03]',
  failed: 'bg-red-500/[0.04] hover:bg-red-500/[0.07]',
}

export default function Security() {
  const { data: secScore, isLoading: loadingScore } = useSecurityScore()
  const { data: auditLog, isLoading: loadingLog } = useAuditLog()

  return (
    <StaggerList className="grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* ══ Health Score ══ */}
      <StaggerItem className="col-span-1 md:col-span-4">
        <GlassCard className="rounded-2xl p-6 h-full flex flex-col items-center">
          <SectionHeader label="Security Health Score" className="w-full" />
          {loadingScore ? <SkeletonBlock className="w-48 h-48 rounded-full" /> : <HealthGauge score={secScore?.overall ?? 0} />}
          <div className="w-full mt-6 space-y-3">
            {secScore?.factors.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-white/50">{f.label}</span>
                  <span className="font-bold" style={{ color: f.score === 100 ? '#00F0FF' : f.score === 0 ? '#ef4444' : '#f59e0b' }}>{f.score}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-1 rounded-full"
                    style={{
                      background: f.score === 100 ? '#00F0FF' : f.score === 0 ? '#ef4444' : '#f59e0b',
                      boxShadow: `0 0 5px ${f.score === 100 ? '#00F0FF' : f.score === 0 ? '#ef4444' : '#f59e0b'}60`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${f.score}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </StaggerItem>

      {/* ══ Authentication Toggles ══ */}
      <StaggerItem className="col-span-1 md:col-span-4">
        <GlassCard className="rounded-2xl p-6 h-full">
          <SectionHeader label="Authentication" />
          <div className="space-y-0">
            <SecToggle label="Two-Factor Auth (TOTP)" icon={Shield} enabled={true} accent="cyan" />
            <SecToggle label="Biometric Lock" icon={Smartphone} enabled={true} accent="cyan" />
            <SecToggle label="Hardware Security Key" icon={Key} enabled={false} accent="purple" />
            <SecToggle label="Email Verification" icon={Mail} enabled={true} accent="cyan" />
            <SecToggle label="Auto-Lock (5 min)" icon={Clock} enabled={true} accent="cyan" />
          </div>
          <div className="mt-6 p-3 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/15">
            <div className="flex items-start gap-2">
              <Shield size={13} className="text-[#00F0FF] mt-0.5 shrink-0" />
              <p className="text-[10px] text-white/50 leading-relaxed">
                Add a hardware security key to boost your score by <span className="text-[#00F0FF] font-semibold">13 points</span> and enable Level-4 vault access.
              </p>
            </div>
          </div>
        </GlassCard>
      </StaggerItem>

      {/* ══ Security Overview Stats ══ */}
      <StaggerItem className="col-span-1 md:col-span-4">
        <GlassCard className="rounded-2xl p-6 h-full">
          <SectionHeader label="Security Overview" />
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Active Sessions', value: '1', sub: 'MacBook Pro', ok: true, trend: '↓' },
              { label: 'API Keys', value: '2', sub: 'Active', ok: true, trend: '—' },
              { label: 'Failed Logins', value: '3', sub: 'Last 30 days', ok: false, trend: '↑' },
              { label: 'Last Scan', value: '2m', sub: 'All clear', ok: true, trend: '✓' },
            ].map((s) => (
              <div key={s.label} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.10] transition-colors">
                <p className="text-[9px] text-white/30 tracking-widest uppercase mb-2 font-semibold">{s.label}</p>
                <div className="flex items-end justify-between">
                  <p className={`text-2xl font-black ${s.ok ? 'text-white' : 'text-[#EF5350]'}`}>{s.value}</p>
                  <span className={`text-xs font-bold ${s.ok ? 'text-[#26A69A]' : 'text-[#EF5350]'}`}>{s.trend}</span>
                </div>
                <p className={`text-[10px] mt-1 ${s.ok ? 'text-white/30' : 'text-[#EF5350]/70'}`}>{s.sub}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5 transition-all text-xs text-white/40 hover:text-[#00F0FF] flex items-center justify-center gap-2 cursor-pointer">
            <RefreshCw size={11} /> Run Full Security Scan
          </button>
        </GlassCard>
      </StaggerItem>

      {/* ══ Audit Log ══ */}
      <StaggerItem className="col-span-12">
        <GlassCard className="rounded-2xl p-6">
          <SectionHeader label="Audit Log" action={
            <button className="text-[10px] text-white/30 hover:text-[#00F0FF] transition-colors cursor-pointer border border-white/10 hover:border-[#00F0FF]/30 px-3 py-1 rounded-lg">Export CSV</button>
          } />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[9px] text-white/25 tracking-widest uppercase border-b border-white/[0.05] font-bold">
                  {['Time', 'Action', 'IP Address', 'Location', 'Device', 'Status'].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingLog ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="py-2"><SkeletonBlock className="h-4" /></td></tr>
                  ))
                ) : (
                  auditLog?.map((entry) => (
                    <tr key={entry.id} className={`border-b border-white/[0.03] transition-colors group cursor-pointer ${rowBg[entry.status]}`}>
                      <td className="py-3 pr-4 font-mono text-white/30 text-[10px]">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                      </td>
                      <td className="py-3 pr-4 text-white/70 group-hover:text-white transition-colors">{entry.action}</td>
                      <td className="py-3 pr-4 font-mono text-white/40 text-[10px]">{entry.ip}</td>
                      <td className="py-3 pr-4 text-white/40">{entry.location}</td>
                      <td className="py-3 pr-4 text-white/40">{entry.device}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          {statusIcon[entry.status]}
                          <span className={`capitalize text-[10px] font-bold ${statusText[entry.status]}`}>{entry.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </StaggerItem>
    </StaggerList>
  )
}
