import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export type LogLevel = 'INFO' | 'WARN' | 'EXEC' | 'ERROR' | 'SYS'

export interface TerminalLog {
  level: LogLevel
  time: string
  message: string
  module: string
}

interface TypewriterTerminalProps {
  logs: TerminalLog[]
  typingSpeed?: number  // ms per character
  logDelay?: number     // ms between logs
  autoScroll?: boolean
}

const levelColor: Record<LogLevel, string> = {
  INFO: 'text-[#b9cacb]',
  WARN: 'text-yellow-400',
  EXEC: 'text-[#00F0FF]',
  ERROR: 'text-red-400',
  SYS: 'text-[#9D4EDD]',
}

const levelBg: Record<LogLevel, string> = {
  INFO: 'bg-white/5 text-[#b9cacb]',
  WARN: 'bg-yellow-400/10 text-yellow-400',
  EXEC: 'bg-[#00F0FF]/10 text-[#00F0FF]',
  ERROR: 'bg-red-400/10 text-red-400',
  SYS: 'bg-[#9D4EDD]/10 text-[#9D4EDD]',
}

export function TypewriterTerminal({
  logs,
  typingSpeed = 18,
  logDelay = 600,
  autoScroll = true,
}: TypewriterTerminalProps) {
  const [visibleLogs, setVisibleLogs] = useState<(TerminalLog & { typed: string; done: boolean })[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined as any)

  useEffect(() => {
    let logIndex = 0
    let charIndex = 0
    let currentTyped = ''

    const showNextLog = () => {
      if (logIndex >= logs.length) {
        // Loop back
        setTimeout(() => {
          setVisibleLogs([])
          logIndex = 0
          charIndex = 0
          currentTyped = ''
          setTimeout(typeChar, logDelay)
        }, 3000)
        return
      }

      const log = logs[logIndex]
      setVisibleLogs((prev) => [...prev, { ...log, typed: '', done: false }])
      typeChar()
    }

    const typeChar = () => {
      if (logIndex >= logs.length) return
      const log = logs[logIndex]
      if (charIndex < log.message.length) {
        currentTyped += log.message[charIndex]
        charIndex++
        setVisibleLogs((prev) =>
          prev.map((l, i) =>
            i === prev.length - 1 ? { ...l, typed: currentTyped } : l
          )
        )
        timerRef.current = setTimeout(typeChar, typingSpeed + Math.random() * 10)
      } else {
        // Mark done, move to next log
        setVisibleLogs((prev) =>
          prev.map((l, i) => (i === prev.length - 1 ? { ...l, done: true } : l))
        )
        logIndex++
        charIndex = 0
        currentTyped = ''
        timerRef.current = setTimeout(showNextLog, logDelay)
      }
    }

    timerRef.current = setTimeout(showNextLog, 400)
    return () => clearTimeout(timerRef.current)
  }, [logs, typingSpeed, logDelay])

  // Auto scroll
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLogs, autoScroll])

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto font-mono text-xs leading-relaxed p-1 space-y-1"
      style={{ fontFamily: "'Space Grotesk', monospace" }}
    >
      {visibleLogs.map((log, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-start gap-3 group"
        >
          {/* Time */}
          <span className="text-white/25 shrink-0 pt-0.5">{log.time}</span>
          {/* Level badge */}
          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider ${levelBg[log.level]}`}>
            {log.level}
          </span>
          {/* Module */}
          <span className="text-white/30 shrink-0 w-12 truncate pt-0.5">[{log.module}]</span>
          {/* Message */}
          <span className={`flex-1 ${levelColor[log.level]}`}>
            {log.typed}
            {!log.done && <span className="terminal-cursor ml-0.5" />}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
