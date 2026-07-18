<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const emailError = ref('')

async function handleForgotPassword() {
  emailError.value = ''
  if (!email.value) {
    emailError.value = 'Please enter your email'
    return
  }
  try {
    await auth.forgotPassword(email.value)
    toast.success('Email Sent', 'Check your email for the reset link')
    router.push(`/reset-password?email=${encodeURIComponent(email.value)}`)
  } catch (err: unknown) {
    emailError.value = getErrorMessage(err, 'Could not send reset email')
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-stripe-card border border-[#e6ebf1] p-8 sm:p-10">
    <h2 class="text-[24px] font-bold tracking-tight text-[#32325D] mb-2">Reset your password</h2>
    <p class="text-[14px] text-[#8898AA] mb-8 leading-relaxed">
      Enter your email address and we'll send you a link to reset your password.
    </p>

    <form @submit.prevent="handleForgotPassword" class="space-y-5">
      <div>
        <label class="block text-[13px] font-semibold text-[#32325D] mb-1.5 tracking-wide">Email</label>
        <input v-model="email" @input="emailError = ''" type="email" placeholder="you@company.com"
          class="w-full h-[44px] px-3 rounded-lg border text-[15px] text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus"
          :class="emailError ? 'border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:shadow-[0_0_0_1px_#f87171,0_1px_3px_0_rgba(50,50,93,0.15)]' : 'border-[#e6ebf1] bg-white hover:border-gray-300'" />
        <p v-if="emailError" class="text-[13px] text-red-500 mt-1.5">{{ emailError }}</p>
      </div>
      <button type="submit" :disabled="auth.loading"
        class="w-full h-[44px] mt-4 bg-black text-white text-[15px] font-medium rounded-lg hover:bg-gray-900 shadow-stripe-btn hover:-translate-y-[1px] hover:shadow-stripe-btn-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        {{ auth.loading ? 'Sending link...' : 'Send reset link' }}
      </button>
    </form>

    <div class="mt-8 pt-6 border-t border-[#e6ebf1] flex flex-col items-center">
      <router-link to="/login" class="text-[14px] text-[#635BFF] hover:text-[#5455E2] font-medium transition-colors">
        Return to sign in
      </router-link>
    </div>
  </div>
</template>
