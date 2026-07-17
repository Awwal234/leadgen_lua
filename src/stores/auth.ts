import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  async function fetchUser() {
    try {
      const res = await api.get('/auth/me')
      user.value = res.data
      return res.data
    } catch {
      clearTokens()
      user.value = null
      return null
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const res = await api.post('/auth/login', { email, password })
      setTokens(res.data.access_token, res.data.refresh_token)
      user.value = res.data.user
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function register(params: {
    name: string
    company_name: string
    email: string
    password: string
  }) {
    loading.value = true
    try {
      const res = await api.post('/auth/register', params)
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function verifyEmail(userId: string, otp: string) {
    loading.value = true
    try {
      const res = await api.post('/auth/verify-email', {
        user_id: userId,
        otp,
      })
      setTokens(res.data.access_token, res.data.refresh_token)
      user.value = res.data.user
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function resendOtp(email: string, type: 'email_verification' | 'password_reset') {
    loading.value = true
    try {
      const res = await api.post('/auth/resend-otp', { email, type })
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function forgotPassword(email: string) {
    loading.value = true
    try {
      const res = await api.post('/auth/forgot-password', { email })
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(email: string, otp: string, newPassword: string) {
    loading.value = true
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        otp,
        new_password: newPassword,
      })
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: { name?: string; company_name?: string }) {
    loading.value = true
    try {
      const res = await api.patch('/auth/me', data)
      user.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout', {
        refresh_token: refreshToken.value,
      })
    } catch {
      // ignore
    } finally {
      clearTokens()
      user.value = null
    }
  }

  async function init() {
    if (accessToken.value) {
      await fetchUser()
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    resendOtp,
    forgotPassword,
    resetPassword,
    updateProfile,
    logout,
    fetchUser,
    init,
    clearTokens,
  }
})
