import type { LogLevel } from '../components/effects/TypewriterTerminal'

// ─── Overview ───────────────────────────────────────────────
export interface PortfolioSnapshot {
  totalBalance: number
  change24h: number
  changePct24h: number
  updatedAt: string
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'swap' | 'contract'
  asset: string
  amount: number
  usdValue: number
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  txHash: string
}

export interface Asset {
  symbol: string
  name: string
  balance: number
  usdValue: number
  change24h: number
  allocation: number
  color: string
}

// ─── Analytics ──────────────────────────────────────────────
export interface PricePoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface MarketAsset {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  sparkline: number[]
}

// ─── Trading ────────────────────────────────────────────────
export interface OrderBookEntry {
  price: number
  size: number
  total: number
  depth: number // 0-1 percentage of max
}

export interface Trade {
  id: string
  side: 'buy' | 'sell'
  price: number
  size: number
  timestamp: string
}

// ─── Security ───────────────────────────────────────────────
export interface SecurityScore {
  overall: number
  factors: { label: string; score: number; weight: number }[]
}

export interface AuditEntry {
  id: string
  timestamp: string
  action: string
  ip: string
  location: string
  device: string
  status: 'success' | 'warning' | 'failed'
}

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════

export const mockPortfolio: PortfolioSnapshot = {
  totalBalance: 142_500.00,
  change24h: 15_690.00,
  changePct24h: 12.4,
  updatedAt: new Date().toISOString(),
}

export const mockTransactions: Transaction[] = [
  { id: 'tx1', type: 'deposit', asset: 'ETH', amount: 4.5, usdValue: 13_725, status: 'completed', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), txHash: '0xab34...f219' },
  { id: 'tx2', type: 'contract', asset: 'ETH', amount: -0.05, usdValue: -152.5, status: 'pending', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), txHash: '0xc8d1...a004' },
  { id: 'tx3', type: 'withdrawal', asset: 'USDC', amount: -1200, usdValue: -1200, status: 'completed', timestamp: new Date(Date.now() - 28 * 3600000).toISOString(), txHash: '0x77e2...b31a' },
  { id: 'tx4', type: 'swap', asset: 'BTC', amount: 0.012, usdValue: 720, status: 'completed', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), txHash: '0xd91f...cc78' },
  { id: 'tx5', type: 'deposit', asset: 'SOL', amount: 45, usdValue: 6300, status: 'completed', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), txHash: '0x3f88...11bc' },
]

export const mockAssets: Asset[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 18.42, usdValue: 56_201, change24h: 3.2, allocation: 39.4, color: '#00F0FF' },
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.94, usdValue: 56_400, change24h: 1.8, allocation: 39.6, color: '#9D4EDD' },
  { symbol: 'SOL', name: 'Solana', balance: 210, usdValue: 29_400, change24h: -2.1, allocation: 20.6, color: '#22c55e' },
  { symbol: 'USDC', name: 'USD Coin', balance: 499, usdValue: 499, change24h: 0, allocation: 0.4, color: '#f59e0b' },
]

// Generate 30 days of portfolio sparkline data
export const generateSparkline = (base: number, count = 60, volatility = 0.02): number[] => {
  const data: number[] = [base]
  for (let i = 1; i < count; i++) {
    const prev = data[i - 1]
    const change = prev * (Math.random() - 0.45) * volatility
    data.push(Math.max(0, prev + change))
  }
  return data
}

export const mockPortfolioHistory = (() => {
  const points = []
  const now = Date.now()
  let val = 120_000
  for (let i = 29; i >= 0; i--) {
    val = val + (Math.random() - 0.4) * 2000
    points.push({
      date: new Date(now - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(val),
      btc: val * 0.396,
      eth: val * 0.394,
      sol: val * 0.206,
    })
  }
  // End near 142500
  points[points.length - 1].value = 142_500
  return points
})()

export const mockMarketAssets: MarketAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 60_000, change24h: 1.8, marketCap: 1_180_000_000_000, volume24h: 28_000_000_000, sparkline: generateSparkline(58000, 20, 0.015) },
  { symbol: 'ETH', name: 'Ethereum', price: 3050, change24h: 3.2, marketCap: 367_000_000_000, volume24h: 15_000_000_000, sparkline: generateSparkline(2900, 20, 0.02) },
  { symbol: 'SOL', name: 'Solana', price: 140, change24h: -2.1, marketCap: 64_000_000_000, volume24h: 3_200_000_000, sparkline: generateSparkline(145, 20, 0.025) },
  { symbol: 'AVAX', name: 'Avalanche', price: 38.5, change24h: 5.4, marketCap: 16_000_000_000, volume24h: 580_000_000, sparkline: generateSparkline(36, 20, 0.03) },
  { symbol: 'LINK', name: 'Chainlink', price: 17.2, change24h: -0.8, marketCap: 10_500_000_000, volume24h: 420_000_000, sparkline: generateSparkline(17.5, 20, 0.02) },
]

// OHLCV candle data for BTC/USDC
export const mockCandleData: PricePoint[] = (() => {
  const candles: PricePoint[] = []
  const now = Date.now()
  let price = 59_000
  for (let i = 49; i >= 0; i--) {
    const open = price
    const move = (Math.random() - 0.48) * 800
    const close = open + move
    const high = Math.max(open, close) + Math.random() * 400
    const low = Math.min(open, close) - Math.random() * 400
    price = close
    candles.push({
      timestamp: new Date(now - i * 3600000).toISOString(),
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume: Math.round(100 + Math.random() * 500),
    })
  }
  return candles
})()

const generateOrderBook = (basePrice: number, side: 'buy' | 'sell', count = 12) => {
  const entries: OrderBookEntry[] = []
  let total = 0
  for (let i = 0; i < count; i++) {
    const offset = side === 'sell' ? (i + 0.5) * 8 : -(i + 0.5) * 8
    const price = basePrice + offset
    const size = parseFloat((0.1 + Math.random() * 2.5).toFixed(4))
    total += size
    entries.push({ price: Math.round(price * 100) / 100, size, total: parseFloat(total.toFixed(4)), depth: 0 })
  }
  const maxTotal = entries[entries.length - 1].total
  entries.forEach((e) => { e.depth = e.total / maxTotal })
  return side === 'sell' ? entries.reverse() : entries
}

export const mockOrderBook = {
  asks: generateOrderBook(60_000, 'sell'),
  bids: generateOrderBook(60_000, 'buy'),
  spread: 12.5,
  spreadPct: 0.021,
}

export const mockRecentTrades: Trade[] = Array.from({ length: 20 }, (_, i) => ({
  id: `t${i}`,
  side: Math.random() > 0.5 ? 'buy' : 'sell',
  price: 60_000 + (Math.random() - 0.5) * 80,
  size: parseFloat((0.01 + Math.random() * 0.5).toFixed(4)),
  timestamp: new Date(Date.now() - i * 45000).toISOString(),
}))

export const mockSecurityScore: SecurityScore = {
  overall: 87,
  factors: [
    { label: '2FA Authentication', score: 100, weight: 0.3 },
    { label: 'Biometric Lock', score: 100, weight: 0.2 },
    { label: 'Hardware Key', score: 0, weight: 0.25 },
    { label: 'Recovery Phrase', score: 100, weight: 0.15 },
    { label: 'Email Verified', score: 100, weight: 0.1 },
  ],
}

export const mockAuditLog: AuditEntry[] = [
  { id: 'al1', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), action: 'User Login', ip: '192.168.1.1', location: 'Mumbai, IN', device: 'MacBook Pro', status: 'success' },
  { id: 'al2', timestamp: new Date(Date.now() - 23 * 60000).toISOString(), action: 'Transaction Signed', ip: '192.168.1.1', location: 'Mumbai, IN', device: 'MacBook Pro', status: 'success' },
  { id: 'al3', timestamp: new Date(Date.now() - 61 * 60000).toISOString(), action: 'API Key Created', ip: '10.0.0.42', location: 'Mumbai, IN', device: 'iPhone 16', status: 'warning' },
  { id: 'al4', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), action: 'Failed Login Attempt', ip: '185.220.101.5', location: 'Moscow, RU', device: 'Unknown', status: 'failed' },
  { id: 'al5', timestamp: new Date(Date.now() - 240 * 60000).toISOString(), action: 'Password Changed', ip: '192.168.1.1', location: 'Mumbai, IN', device: 'MacBook Pro', status: 'success' },
  { id: 'al6', timestamp: new Date(Date.now() - 360 * 60000).toISOString(), action: 'Smart Contract Executed', ip: '192.168.1.1', location: 'Mumbai, IN', device: 'MacBook Pro', status: 'success' },
  { id: 'al7', timestamp: new Date(Date.now() - 480 * 60000).toISOString(), action: 'Withdrawal Initiated', ip: '192.168.1.1', location: 'Mumbai, IN', device: 'MacBook Pro', status: 'success' },
  { id: 'al8', timestamp: new Date(Date.now() - 600 * 60000).toISOString(), action: 'Suspicious Activity', ip: '78.92.144.22', location: 'Berlin, DE', device: 'Chrome/Linux', status: 'failed' },
]

export const mockTerminalLogs: { level: LogLevel; time: string; message: string; module: string }[] = [
  { level: 'INFO', time: '03:15:01', message: 'Aura System v2.4.1 initialized successfully', module: 'CORE' },
  { level: 'INFO', time: '03:15:02', message: 'Connecting to blockchain node cluster...', module: 'NODE' },
  { level: 'EXEC', time: '03:15:02', message: 'Node handshake completed — 47ms latency', module: 'NODE' },
  { level: 'INFO', time: '03:15:03', message: 'Loading portfolio snapshot from vault...', module: 'VAULT' },
  { level: 'EXEC', time: '03:15:03', message: 'Portfolio loaded: $142,500.00 across 4 assets', module: 'VAULT' },
  { level: 'INFO', time: '03:15:04', message: 'Subscribing to market data feeds: BTC, ETH, SOL, AVAX', module: 'MARKET' },
  { level: 'EXEC', time: '03:15:04', message: 'WebSocket streams active — 4 feeds connected', module: 'MARKET' },
  { level: 'WARN', time: '03:15:05', message: 'Price oracle discrepancy detected on AVAX/USD (+0.12%)', module: 'ORACLE' },
  { level: 'INFO', time: '03:15:06', message: 'Smart contract monitor active — 3 tracked contracts', module: 'SC' },
  { level: 'EXEC', time: '03:15:07', message: 'Transaction confirmed: 0xab34...f219 — block #21,892,304', module: 'CHAIN' },
  { level: 'INFO', time: '03:15:08', message: 'Security audit running — scanning for anomalies...', module: 'SEC' },
  { level: 'EXEC', time: '03:15:09', message: 'Security score: 87/100 — 1 recommendation pending', module: 'SEC' },
  { level: 'WARN', time: '03:15:10', message: 'Gas price spike detected: 45 gwei (threshold: 40 gwei)', module: 'GAS' },
  { level: 'INFO', time: '03:15:11', message: 'Rebalancing engine — checking allocation drift...', module: 'REBAL' },
  { level: 'EXEC', time: '03:15:12', message: 'Allocation within bounds — no rebalance required', module: 'REBAL' },
  { level: 'INFO', time: '03:15:13', message: 'DeFi yield monitor — scanning 12 protocols...', module: 'DEFI' },
  { level: 'EXEC', time: '03:15:14', message: 'Best yield: Aave USDC 8.42% APY — Compound ETH 4.21% APY', module: 'DEFI' },
  { level: 'WARN', time: '03:15:15', message: 'MEV risk detected on pending TX 0xc8d1...a004', module: 'MEV' },
  { level: 'EXEC', time: '03:15:16', message: 'Flashbots protection enabled — routing via private mempool', module: 'MEV' },
  { level: 'INFO', time: '03:15:17', message: 'System health check complete — all services nominal', module: 'CORE' },
]
