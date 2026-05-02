import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, RefreshCw, Download, Circle, Send } from 'lucide-react'
import { TypewriterTerminal } from '@/components/effects/TypewriterTerminal'
import { GlassCard } from '@/components/effects/BorderBeam'
import { StaggerList, StaggerItem } from '@/components/shared'
import { mockTerminalLogs } from '@/lib/mockData'

const PRESET_COMMANDS = ['status', 'help', 'logs --tail 20', 'node list', 'clear']

export default function Terminal() {
  const [key, setKey] = useState(0)
  const [cmdInput, setCmdInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Blinking cursor effect
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  const submitCmd = () => {
    if (!cmdInput.trim()) return
    setCmdHistory((h) => [cmdInput.trim(), ...h].slice(0, 50))
    setCmdInput('')
    setHistIdx(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { submitCmd(); return }
    if (e.key === 'ArrowUp') {
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(next)
      setCmdInput(cmdHistory[next] ?? '')
    }
    if (e.key === 'ArrowDown') {
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setCmdInput(next === -1 ? '' : cmdHistory[next])
    }
  }

  return (
    <StaggerList className="space-y-5">
      <StaggerItem>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-white">System Terminal</h3>
            <p className="text-[10px] text-white/30 mt-0.5">Aura Execution Engine v2.4.1 — Real-time log stream</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setKey((k) => k + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-white/40 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.03] transition-all cursor-pointer">
              <RefreshCw size={10} /> Restart
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-white/40 hover:text-[#00F0FF] border border-white/10 hover:border-[#00F0FF]/30 bg-white/[0.03] transition-all cursor-pointer">
              <Download size={10} /> Export Log
            </button>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <GlassCard className="rounded-2xl overflow-hidden border border-white/[0.08]">
          {/* macOS-style title bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-black/30">
            <div className="flex items-center gap-1.5">
              <Circle size={10} className="fill-red-500 text-red-500" />
              <Circle size={10} className="fill-yellow-500 text-yellow-500" />
              <Circle size={10} className="fill-green-500 text-green-500" />
            </div>
            <span className="text-[10px] text-white/25 font-mono mx-auto">aura-system — bash — 120×40</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span className="text-[9px] text-[#00F0FF] font-bold tracking-wider">LIVE</span>
            </div>
          </div>

          {/* Terminal canvas */}
          <div
            className="relative"
            style={{ height: '480px', background: 'linear-gradient(135deg, #040406 0%, #080810 100%)' }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.3) 2px, rgba(0,240,255,0.3) 4px)' }} />
            {/* Corner watermark */}
            <div className="absolute top-3 right-4 text-[9px] text-white/8 font-mono select-none">AURA-SYS:~ root$</div>
            {/* Prompt line */}
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <TerminalIcon size={11} className="text-[#00F0FF]/40" />
              <span className="text-[10px] font-mono text-[#00F0FF]/40">aura@node:~$</span>
            </div>
            <div className="pt-10 h-[calc(100%-52px)]">
              <TypewriterTerminal key={key} logs={mockTerminalLogs} typingSpeed={12} logDelay={500} />
            </div>

            {/* Command history entries */}
            {cmdHistory.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-1 space-y-0.5 max-h-16 overflow-hidden">
                {cmdHistory.slice(0, 2).reverse().map((cmd, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-mono opacity-30">
                    <span className="text-[#00F0FF]">›</span>
                    <span className="text-white/60">{cmd}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Command input bar */}
          <div className="border-t border-white/[0.06] bg-black/40 px-4 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-mono text-[#00F0FF]/60">aura@node:~$</span>
            </div>
            <div className="flex-1 flex items-center relative">
              <input
                ref={inputRef}
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter command..."
                className="flex-1 bg-transparent text-[11px] font-mono text-white/80 focus:outline-none placeholder:text-white/15 caret-transparent"
                autoComplete="off"
                spellCheck={false}
              />
              {/* Blinking block cursor */}
              <span
                className="inline-block w-[7px] h-[13px] ml-px"
                style={{
                  background: '#00F0FF',
                  opacity: cursorVisible ? 0.8 : 0,
                  boxShadow: cursorVisible ? '0 0 6px #00F0FF' : 'none',
                  transition: 'opacity 0.1s',
                }}
              />
            </div>
            <button
              onClick={submitCmd}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] text-[#00F0FF]/60 hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 border border-white/[0.06] hover:border-[#00F0FF]/30 transition-all cursor-pointer font-mono"
            >
              <Send size={10} /> Run
            </button>
          </div>

          {/* Preset commands */}
          <div className="flex items-center gap-2 px-4 py-2 border-t border-white/[0.03] bg-black/20 flex-wrap">
            <span className="text-[9px] text-white/20 uppercase tracking-widest font-semibold">Quick:</span>
            {PRESET_COMMANDS.map((cmd) => (
              <button key={cmd} onClick={() => setCmdInput(cmd)}
                className="text-[9px] font-mono text-white/30 hover:text-[#00F0FF] px-2 py-0.5 rounded bg-white/[0.03] hover:bg-[#00F0FF]/10 border border-white/[0.05] hover:border-[#00F0FF]/20 transition-all cursor-pointer">
                {cmd}
              </button>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04] bg-black/20">
            <div className="flex items-center gap-4 text-[9px] text-white/25 font-mono">
              <span>PID: 1042</span>
              <span>CPU: 0.3%</span>
              <span>MEM: 48MB</span>
              <span>↑ {cmdHistory.length} cmds</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A]" />
              <span className="text-[9px] text-white/25 font-mono">All systems nominal</span>
            </div>
          </div>
        </GlassCard>
      </StaggerItem>

      {/* Stats row */}
      <StaggerItem>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Log Entries', value: '1,247', color: '#00F0FF' },
            { label: 'Warnings', value: '3', color: '#f59e0b' },
            { label: 'Errors', value: '0', color: '#26A69A' },
            { label: 'Uptime', value: '14d 7h', color: 'rgba(255,255,255,0.7)' },
          ].map((s) => (
            <GlassCard key={s.label} className="rounded-xl p-4">
              <p className="text-[9px] text-white/30 tracking-widest uppercase mb-2 font-semibold">{s.label}</p>
              <p className="text-2xl font-black" style={{ color: s.color, textShadow: `0 0 12px ${s.color}50` }}>{s.value}</p>
            </GlassCard>
          ))}
        </div>
      </StaggerItem>
    </StaggerList>
  )
}
