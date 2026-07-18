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
  <div class="bg-white rounded-2xl shadow-stripe-card border border-[#e6ebf1] p-8 sm:p-10 text-center">
    <!-- Icon -->
    <div class="w-14 h-14 bg-[#f6f9fc] border border-[#e6ebf1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
      <svg class="w-7 h-7 text-[#635BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>

    <h2 class="text-[24px] font-bold tracking-tight text-[#32325D] mb-2">Verify your email</h2>
    <p class="text-[14px] text-[#8898AA] mb-8 leading-relaxed">We sent a 6-digit code to your email. Enter it below to verify your account.</p>

    <form @submit.prevent="handleVerify" class="space-y-5">
      <input
        v-model="otp"
        type="text"
        maxlength="6"
        placeholder="000000"
        class="w-full h-16 px-4 rounded-lg border border-[#e6ebf1] text-3xl font-mono text-center tracking-[0.6em] text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus bg-white hover:border-gray-300"
      />
      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full h-[44px] bg-[#635BFF] text-white text-[15px] font-medium rounded-lg hover:bg-[#5455E2] shadow-stripe-btn hover:-translate-y-[1px] hover:shadow-stripe-btn-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {{ auth.loading ? 'Verifying...' : 'Verify email' }}
      </button>
    </form>

    <div class="mt-8 pt-6 border-t border-[#e6ebf1] flex flex-col items-center gap-3">
      <button
        @click="handleResend"
        class="text-[14px] text-[#635BFF] hover:text-[#5455E2] font-medium transition-colors"
      >
        Resend code
      </button>
    </div>
  </div>
</template>

