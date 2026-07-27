import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

const AUTH_REQUIRED_PATHS = ['/api/', '/auth/me', '/auth/logout']

function isAuthRequired(url: string | undefined): boolean {
  if (!url) return false
  return AUTH_REQUIRED_PATHS.some((p) => url.startsWith(p))
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!isAuthRequired(config.url)) return config

  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null): void {
  pendingQueue.forEach((p) => {
    if (token) {
      p.resolve(token)
    } else {
      p.reject(error)
    }
  })
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      isAuthRequired(originalRequest.url)
    ) {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post(`${API_BASE}/auth/refresh-token`, {
          refresh_token: refreshToken,
        })
        const { access_token, refresh_token } = res.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        processQueue(null, access_token)
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Insufficient credits — dispatch event for BuyCreditsModal
    if (error.response?.status === 403) {
      const data = error.response.data as Record<string, unknown>
      if (data && typeof data === 'object' && 'balance' in data && 'needed' in data) {
        window.dispatchEvent(new CustomEvent('insufficient-credits', {
          detail: { balance: data.balance, needed: data.needed },
        }))
      }
    }

    return Promise.reject(error)
  },
)

export default api
export { API_BASE }
