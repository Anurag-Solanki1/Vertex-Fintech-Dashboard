import { useQuery } from '@tanstack/react-query'
import {
  mockPortfolio,
  mockTransactions,
  mockAssets,
  mockPortfolioHistory,
  mockMarketAssets,
  mockCandleData,
  mockOrderBook,
  mockRecentTrades,
  mockSecurityScore,
  mockAuditLog,
} from '@/lib/mockData'

// Simulates async network call with optional delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const fakeFetch = async <T>(data: T, ms = 600): Promise<T> => {
  await delay(ms)
  return data
}

// ── Overview ─────────────────────────────────────────────────
export const usePortfolio = () =>
  useQuery({ queryKey: ['portfolio'], queryFn: () => fakeFetch(mockPortfolio), staleTime: 30_000 })

export const useTransactions = () =>
  useQuery({ queryKey: ['transactions'], queryFn: () => fakeFetch(mockTransactions), staleTime: 60_000 })

export const useAssets = () =>
  useQuery({ queryKey: ['assets'], queryFn: () => fakeFetch(mockAssets), staleTime: 30_000 })

export const usePortfolioHistory = () =>
  useQuery({ queryKey: ['portfolio-history'], queryFn: () => fakeFetch(mockPortfolioHistory, 800), staleTime: 300_000 })

// ── Analytics ────────────────────────────────────────────────
export const useMarketAssets = () =>
  useQuery({ queryKey: ['market-assets'], queryFn: () => fakeFetch(mockMarketAssets), staleTime: 30_000 })

// ── Trading ──────────────────────────────────────────────────
export const useCandleData = (symbol = 'BTC/USDC') =>
  useQuery({ queryKey: ['candles', symbol], queryFn: () => fakeFetch(mockCandleData, 700), staleTime: 15_000 })

export const useOrderBook = (symbol = 'BTC/USDC') =>
  useQuery({ queryKey: ['orderbook', symbol], queryFn: () => fakeFetch(mockOrderBook, 300), staleTime: 5_000, refetchInterval: 5_000 })

export const useRecentTrades = (symbol = 'BTC/USDC') =>
  useQuery({ queryKey: ['trades', symbol], queryFn: () => fakeFetch(mockRecentTrades, 400), staleTime: 5_000, refetchInterval: 5_000 })

// ── Security ─────────────────────────────────────────────────
export const useSecurityScore = () =>
  useQuery({ queryKey: ['security-score'], queryFn: () => fakeFetch(mockSecurityScore), staleTime: 120_000 })

export const useAuditLog = () =>
  useQuery({ queryKey: ['audit-log'], queryFn: () => fakeFetch(mockAuditLog), staleTime: 60_000 })
