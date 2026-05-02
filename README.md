# Vertex Terminal — Institutional FinTech OS

> A premium, institutional-grade FinTech dashboard UI built with React, TypeScript, and TradingView. OLED-dark, glassmorphism design system with real-time crypto data, full auth suite, and Web3 wallet connection flow.

![Vertex Terminal](./public/vertex-logo.png)

---

## ✨ Features

### 📊 Trading Terminal
- **Live TradingView Advanced Chart** — real-time Binance streaming data (BTC, ETH, BNB, SOL, ADA, AVAX)
- Pair selector with instant chart symbol switching
- Professional execution panel (Market/Limit/Stop orders UI)
- Order book, recent trades, and position management panels

### 🔐 Authentication Suite
- **Login** — glassmorphism card with email/password, Google & GitHub OAuth buttons
- **Signup** — Full Name, email, password with animated entrance
- **Connect Wallet** — 6 wallet providers: MetaMask, WalletConnect, Coinbase, Trust Wallet, Ledger, Phantom
  - Animated connection states (connecting → success → error)
  - Brand-accurate SVG icons with per-wallet glow effects
  - Self-custody security notice

### 🏠 Dashboard Pages
| Page | Description |
|---|---|
| **Overview** | Portfolio balance, P&L chart (Recharts), asset allocation, quick stats |
| **Analytics** | Market charts, volume trends, historical performance |
| **Wallets** | Multi-chain wallet management, Aura Visa card component |
| **Trading** | Full TradingView terminal with execution panel |
| **Security** | 2FA, session management, security audit panel |
| **Terminal** | Typewriter-style command terminal interface |

### 🎨 Design System
- **OLED-first dark mode** (`#050508` base)
- **Glassmorphism** cards with `backdrop-blur` and gradient borders
- **Animated background beams** (full-screen SVG animation)
- **Framer Motion** page transitions and staggered card entrances
- **Cyan/Teal accent** (`#00F0FF` / `#26A69A`) — institutional palette
- **Vertex logo** (AI-generated, 3D glassmorphism "V" mark)
- Google Font: **Inter** (Outfit, JetBrains Mono for terminal)

### 🧩 Effects Components
- `BackgroundBeams` — animated SVG beam background
- `BorderBeam` / `GlassCard` — glassmorphism card wrappers
- `MagicCard` — interactive hover card effect
- `MeteorCard` — animated meteor shower card
- `NumberTicker` — animated number counter
- `TypewriterTerminal` — terminal-style typewriter
- `AuraVisaCard` — premium card component

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI Framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool & dev server |
| TailwindCSS | 3 | Utility-first styling |
| Framer Motion | 11 | Animations & transitions |
| TradingView Widget | latest | Live market charts |
| React Router DOM | 6 | Client-side routing |
| TanStack Query | 5 | Async state management |
| Recharts | 2 | Overview/Analytics charts |
| Lucide React | latest | Icon system |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Anurag-Solanki1/Vertex-Fintech-Dashboard.git
cd Vertex-Fintech-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── effects/          # Visual effect components
│   │   ├── BackgroundBeams.tsx
│   │   ├── BorderBeam.tsx
│   │   ├── MagicCard.tsx
│   │   └── ...
│   └── layout/
│       ├── DashboardLayout.tsx
│       └── Sidebar.tsx
├── pages/
│   ├── auth/
│   │   ├── AuthLayout.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── ConnectWallet.tsx
│   ├── Overview.tsx
│   ├── Analytics.tsx
│   ├── Trading.tsx
│   ├── Wallets.tsx
│   ├── Security.tsx
│   └── Terminal.tsx
├── hooks/
│   └── useAuraData.ts    # Mock data hooks
├── lib/
│   ├── mockData.ts
│   └── utils.ts
└── App.tsx               # Routes
```

---

## 🔌 Connecting a Real Backend

This project is a **production-ready UI template**. To connect real services:

- **Auth** → Replace login/signup handlers with Auth0, Firebase, or Supabase
- **Wallet** → Replace mock `handleConnect` with `wagmi` + `viem` hooks
- **Market Data** → Replace `mockData.ts` with Binance/CoinGecko REST API calls
- **Orders** → Wire execution panel to your trading API endpoint

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

*Built with ❤️ using React + Vite + TailwindCSS*
