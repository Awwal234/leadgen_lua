<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const otp = ref('')
const userId = ref((route.query.user_id as string) || '')
const error = ref('')

async function handleVerify() {
  error.value = ''
  if (!userId.value || otp.value.length !== 6) {
    error.value = 'Please enter the 6-digit code'
    return
  }
  try {
    await auth.verifyEmail(userId.value, otp.value)
    toast.success('Email Verified', 'Your account is ready')
    router.push('/app')
  } catch (err: unknown) {
    error.value = getErrorMessage(err, 'Invalid or expired code')
  }
}

async function handleResend() {
  if (!userId.value) return
  try {
    const email = auth.user?.email || ''
    await auth.resendOtp(email, 'email_verification')
    toast.success('Code Sent', 'Check your email for a new code')
  } catch (err: unknown) {
    toast.error('Failed', getErrorMessage(err, 'Could not resend code'))
  }
}
</script>

<template>
  <AuthCard title="Verify your email" subtitle="We sent a 6-digit code to your email. Enter it below to activate your account.">
    <!-- Mail icon -->
    <div class="flex justify-center mb-2">
      <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-200">
        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <form @submit.prevent="handleVerify" class="space-y-4">
      <AuthInput v-model="otp" label="Verification code" type="text"
        icon="mail" :error="error" maxlength="6"
        class="tracking-[0.35em] text-center text-lg font-mono" />

      <AuthButton :loading="auth.loading">
        <template v-if="auth.loading">Verifying...</template>
        <template v-else>Verify email</template>
      </AuthButton>
    </form>

    <template #footer>
      <div class="flex flex-col items-center gap-3">
        <p class="text-sm text-gray-500">
          Didn't receive the code?
          <button @click="handleResend"
            class="font-medium text-gray-900 hover:text-gray-600 transition-colors ml-1">
            Resend
          </button>
        </p>
      </div>
    </template>
  </AuthCard>
</template>
