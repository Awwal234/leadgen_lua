<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')

async function handleForgotPassword() {
  if (!email.value) {
    toast.warn('Validation', 'Please enter your email')
    return
  }
  try {
    await auth.forgotPassword(email.value)
    toast.success('Email Sent', 'Check your email for the reset code')
    router.push(`/reset-password?email=${encodeURIComponent(email.value)}`)
  } catch (err: unknown) {
    toast.error('Failed', getErrorMessage(err, 'Could not send reset email'))
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-2">Forgot password</h2>
    <p class="text-sm text-gray-500 mb-6">Enter your email and we'll send you a reset code</p>

    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@company.com"
          class="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
        />
      </div>
      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full h-11 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ auth.loading ? 'Sending...' : 'Send reset code' }}
      </button>
    </form>

    <div class="mt-6 text-center">
      <router-link to="/login" class="text-sm text-gray-600 hover:text-black transition-colors">
        Back to sign in
      </router-link>
    </div>
  </div>
</template>
