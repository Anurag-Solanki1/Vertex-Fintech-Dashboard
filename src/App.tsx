import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Overview from '@/pages/Overview'
import OverviewV2 from '@/pages/OverviewV2'
import Analytics from '@/pages/Analytics'
import Wallets from '@/pages/Wallets'
import Trading from '@/pages/Trading'
import Security from '@/pages/Security'
import Terminal from '@/pages/Terminal'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { Login } from '@/pages/auth/Login'
import { Signup } from '@/pages/auth/Signup'
import { ConnectWallet } from '@/pages/auth/ConnectWallet'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/connect-wallet" element={<ConnectWallet />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/v2" element={<OverviewV2 />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/security" element={<Security />} />
            <Route path="/terminal" element={<Terminal />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
