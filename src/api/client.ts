import axios from 'axios'

// ── Base API client ───────────────────────────────────────────
// Set VITE_API_BASE_URL in .env to point to your Spring Boot backend.
// Falls back to the mock-data layer when undefined.
const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — standardised error handling
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aura_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
