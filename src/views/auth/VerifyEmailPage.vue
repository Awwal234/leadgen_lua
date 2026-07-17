<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const otp = ref('')
const userId = ref((route.query.user_id as string) || '')

async function handleVerify() {
  if (!userId.value || otp.value.length !== 6) {
    toast.warn('Validation', 'Please enter the 6-digit OTP')
    return
  }
  try {
    await auth.verifyEmail(userId.value, otp.value)
    toast.success('Email Verified', 'Your account is ready')
    router.push('/app')
  } catch (err: unknown) {
    toast.error('Verification Failed', getErrorMessage(err, 'Invalid OTP'))
  }
}

async function handleResend() {
  if (!userId.value) return
  try {
    const email = auth.user?.email || ''
    await auth.resendOtp(email, 'email_verification')
    toast.success('OTP Sent', 'Check your email for a new code')
  } catch (err: unknown) {
    toast.error('Failed', getErrorMessage(err, 'Could not resend OTP'))
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
    <div class="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    <h2 class="text-xl font-semibold text-gray-900 mb-2">Verify your email</h2>
    <p class="text-sm text-gray-500 mb-6">Enter the 6-digit code sent to your email</p>

    <form @submit.prevent="handleVerify" class="space-y-4">
      <input
        v-model="otp"
        type="text"
        maxlength="6"
        placeholder="000000"
        class="w-full h-12 px-3 rounded-lg border border-gray-300 text-2xl font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
      />
      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full h-11 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ auth.loading ? 'Verifying...' : 'Verify email' }}
      </button>
    </form>

    <button
      @click="handleResend"
      class="mt-4 text-sm text-gray-600 hover:text-black transition-colors"
    >
      Resend code
    </button>
  </div>
</template>
