import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ChevronRight, Wifi, AlertCircle, X } from 'lucide-react'

// Wallet definitions with inline SVG icons
const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'The most popular Ethereum wallet',
    popular: true,
    color: '#E2761B',
    glowColor: 'rgba(226, 118, 27, 0.3)',
    icon: (
      <svg viewBox="0 0 318.6 318.6" className="w-full h-full">
        <polygon fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round" points="274.1,35.5 174.6,109.4 193,65.8" />
        <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="44.4,35.5 143.1,110.1 125.6,65.8" />
        <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7" />
        <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8" />
        <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1" />
        <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="214.9,138.2 175.9,103.4 174.6,164.6 230.8,162.1" />
        <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="106.8,247.4 140.6,230.9 111.4,208.1" />
        <polygon fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round" points="177.9,230.9 211.8,247.4 207.1,208.1" />
      </svg>
    ),
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connect any mobile wallet via QR',
    popular: false,
    color: '#3B99FC',
    glowColor: 'rgba(59, 153, 252, 0.3)',
    icon: (
      <svg viewBox="0 0 300 185" className="w-full h-full">
        <path d="M61.4385 36.2562C113.074 -12.0854 196.326 -12.0854 247.961 36.2562L254.053 42.1479C256.679 44.6479 256.679 48.7104 254.053 51.2104L234.699 70.0229C233.386 71.2729 231.261 71.2729 229.949 70.0229L221.642 62.0229C186.038 27.8354 114.262 27.8354 78.6572 62.0229L69.8072 70.4354C68.4947 71.6854 66.3697 71.6854 65.0572 70.4354L45.7031 51.6229C43.0781 49.1229 43.0781 45.0604 45.7031 42.5604L61.4385 36.2562ZM291.84 77.9604L309.069 94.7104C311.694 97.2104 311.694 101.273 309.069 103.773L228.699 181.648C226.074 184.148 221.824 184.148 219.199 181.648L160.761 125.273C160.105 124.648 159.042 124.648 158.386 125.273L99.9479 181.648C97.3229 184.148 93.0729 184.148 90.4479 181.648L9.93086 103.648C7.30586 101.148 7.30586 97.0854 9.93086 94.5854L27.1603 77.8354C29.7853 75.3354 34.0353 75.3354 36.6603 77.8354L95.0979 133.023C95.7541 133.648 96.8166 133.648 97.4729 133.023L155.911 77.8354C158.536 75.3354 162.786 75.3354 165.411 77.8354L223.849 133.023C224.505 133.648 225.568 133.648 226.224 133.023L284.661 77.9604C287.424 75.3354 291.215 75.3354 291.84 77.9604Z" fill="#3B99FC"/>
      </svg>
    ),
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Official wallet from Coinbase',
    popular: false,
    color: '#0052FF',
    glowColor: 'rgba(0, 82, 255, 0.3)',
    icon: (
      <svg viewBox="0 0 1024 1024" className="w-full h-full">
        <circle cx="512" cy="512" r="512" fill="#0052FF"/>
        <circle cx="512" cy="512" r="330" fill="white"/>
        <circle cx="512" cy="512" r="170" fill="#0052FF"/>
      </svg>
    ),
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    description: 'Multi-chain self-custody wallet',
    popular: false,
    color: '#3375BB',
    glowColor: 'rgba(51, 117, 187, 0.3)',
    icon: (
      <svg viewBox="0 0 512 512" className="w-full h-full">
        <path d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256S397.385 0 256 0z" fill="#3375BB"/>
        <path d="M358.7 148.6L256 122l-102.7 26.6C120.4 156.8 96 185.1 96 218.1v54.7c0 82.5 70.1 156.7 160 183.2 89.9-26.5 160-100.7 160-183.2v-54.7c0-33-24.4-61.3-57.3-69.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Hardware wallet — maximum security',
    popular: false,
    color: '#000000',
    glowColor: 'rgba(255,255,255,0.15)',
    icon: (
      <svg viewBox="0 0 108 108" className="w-full h-full" fill="white">
        <path d="M0 0h45.7v12.8H12.8v32.9H0V0zm62.4 0H108v45.7H95.2V12.8H62.4V0zM0 62.4h12.8v32.8h32.9V108H0V62.4zm95.2 32.8H62.3V108H108V62.4H95.2v32.8z"/>
      </svg>
    ),
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Best wallet for Solana ecosystem',
    popular: false,
    color: '#AB9FF2',
    glowColor: 'rgba(171, 159, 242, 0.3)',
    icon: (
      <svg viewBox="0 0 128 128" className="w-full h-full">
        <rect width="128" height="128" rx="24" fill="#AB9FF2"/>
        <path d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.7133 23 15 41.3894 15 64.0858C15 86.6349 33.0461 104.952 56.7724 104.952C74.5514 104.952 90.0742 95.3758 97.1626 80.5H110.584C103.153 103.132 81.2628 120 56.7724 120C24.5 120 0 95.7 0 63.9C0 32.2 24.5 8 56.7724 8C89.0948 8 110.584 31.5 110.584 64.9142Z" fill="#FFFCE8"/>
        <circle cx="75" cy="58" r="6" fill="#AB9FF2"/>
        <circle cx="94" cy="58" r="6" fill="#AB9FF2"/>
      </svg>
    ),
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 25 } },
}

type Status = 'idle' | 'connecting' | 'success' | 'error'

export function ConnectWallet() {
  const navigate = useNavigate()
  const [activeWallet, setActiveWallet] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  const handleConnect = async (id: string) => {
    setActiveWallet(id)
    setStatus('connecting')
    // Simulate async wallet handshake
    await new Promise((r) => setTimeout(r, 1800))
    // 90% success rate mock
    if (Math.random() > 0.1) {
      setStatus('success')
      await new Promise((r) => setTimeout(r, 900))
      navigate('/')
    } else {
      setStatus('error')
      await new Promise((r) => setTimeout(r, 2000))
      setStatus('idle')
      setActiveWallet(null)
    }
  }

  const handleDismissError = () => {
    setStatus('idle')
    setActiveWallet(null)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Connect a Wallet</h2>
        <p className="text-sm text-white/40 max-w-xs mx-auto">
          Choose your wallet provider to access the Vertex OS. Your keys, your assets.
        </p>
      </motion.div>

      {/* Status Banner */}
      <AnimatePresence>
        {status === 'connecting' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30"
          >
            <Wifi className="w-4 h-4 text-[#00F0FF] animate-pulse" />
            <span className="text-sm text-[#00F0FF] font-mono">Initiating handshake with {wallets.find(w => w.id === activeWallet)?.name}…</span>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-sm text-red-300 flex-1">Connection rejected. Make sure your wallet is unlocked.</span>
            <button onClick={handleDismissError} className="text-white/30 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2.5"
      >
        {wallets.map((wallet) => {
          const isConnecting = activeWallet === wallet.id && status === 'connecting'
          const isSuccess = activeWallet === wallet.id && status === 'success'
          const isDisabled = status === 'connecting' || status === 'success'

          return (
            <motion.button
              key={wallet.id}
              variants={itemVariants}
              onClick={() => !isDisabled && handleConnect(wallet.id)}
              disabled={isDisabled}
              className="w-full group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: isConnecting || isSuccess
                  ? `${wallet.glowColor}`
                  : 'rgba(255,255,255,0.03)',
                borderColor: isConnecting || isSuccess
                  ? wallet.color
                  : 'rgba(255,255,255,0.07)',
                boxShadow: isConnecting || isSuccess
                  ? `0 0 20px ${wallet.glowColor}, 0 0 40px ${wallet.glowColor}`
                  : 'none',
              }}
            >
              {/* Hover glow layer */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at left center, ${wallet.glowColor} 0%, transparent 70%)` }}
              />

              {/* Wallet Icon */}
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center p-2 shrink-0 border"
                style={{
                  backgroundColor: `${wallet.color}20`,
                  borderColor: `${wallet.color}40`,
                }}
              >
                {wallet.icon}
              </div>

              {/* Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{wallet.name}</span>
                  {wallet.popular && (
                    <span className="text-[9px] font-bold tracking-wider text-black bg-[#00F0FF] px-1.5 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/35 mt-0.5 truncate">{wallet.description}</p>
              </div>

              {/* Right indicator */}
              <div className="shrink-0">
                {isConnecting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#00F0FF]/40 border-t-[#00F0FF] animate-spin" />
                ) : isSuccess ? (
                  <ShieldCheck className="w-5 h-5 text-[#00F0FF]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all duration-200" />
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex items-start gap-2.5 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
      >
        <ShieldCheck className="w-4 h-4 text-[#26A69A] shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/35 leading-relaxed">
          Vertex OS never stores your private keys or seed phrases. You maintain full custody of your assets at all times.
        </p>
      </motion.div>

      {/* Footer link */}
      <p className="mt-5 text-center text-xs text-white/25">
        Don't have a wallet?{' '}
        <a
          href="https://metamask.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00F0FF] hover:underline transition-all cursor-pointer"
        >
          Get MetaMask
        </a>
      </p>
    </div>
  )
}
