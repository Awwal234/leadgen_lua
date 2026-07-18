<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'
import { useFormErrors } from '@/composables/useFormErrors'
import FormField from '@/components/FormField.vue'
import PasswordInput from '@/components/PasswordInput.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { errors, setFromApi, clear } = useFormErrors()

const email = ref((route.query.email as string) || '')
const otp = ref('')
const newPassword = ref('')

function onInput(field: string) {
  clear(field)
}

async function handleReset() {
  clear()
  if (!email.value || otp.value.length !== 6 || !newPassword.value) {
    toast.warn('Validation', 'Please fill in all fields')
    return
  }
  try {
    await auth.resetPassword(email.value, otp.value, newPassword.value)
    toast.success('Password Reset', 'You can now sign in with your new password')
    router.push('/login')
  } catch (err: unknown) {
    const parsed = setFromApi(err)
    toast.error('Reset Failed', parsed.message)
  }
}

async function handleResend() {
  try {
    await auth.resendOtp(email.value, 'password_reset')
    toast.success('OTP Sent', 'Check your email for a new code')
  } catch (err: unknown) {
    toast.error('Failed', getErrorMessage(err, 'Could not resend OTP'))
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-stripe-card border border-[#e6ebf1] p-8 sm:p-10">
    <h2 class="text-[24px] font-bold tracking-tight text-[#32325D] mb-8">Reset your password</h2>
    <form @submit.prevent="handleReset" class="space-y-5">
      <FormField label="Email" :error="errors.email">
        <input v-model="email" type="email" readonly
          class="w-full h-[44px] px-3 rounded-lg border border-[#e6ebf1] text-[15px] bg-[#f6f9fc] text-[#8898AA] focus:outline-none cursor-not-allowed" />
      </FormField>
      <FormField label="OTP Code" :error="errors.otp">
        <input v-model="otp" @input="onInput('otp')" type="text" maxlength="6" placeholder="000000"
          class="w-full h-[44px] px-3 rounded-lg border text-xl font-mono tracking-[0.5em] text-center text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus"
          :class="errors.otp ? 'border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:shadow-[0_0_0_1px_#f87171,0_1px_3px_0_rgba(50,50,93,0.15)]' : 'border-[#e6ebf1] bg-white hover:border-gray-300'" />
      </FormField>
      <FormField label="New Password" :error="errors.new_password">
        <PasswordInput v-model="newPassword" @update:model-value="onInput('new_password')"
          placeholder="Enter new password" :error="errors.new_password" />
      </FormField>
      <button type="submit" :disabled="auth.loading"
        class="w-full h-[44px] mt-4 bg-black text-white text-[15px] font-medium rounded-lg hover:bg-gray-900 shadow-stripe-btn hover:-translate-y-[1px] hover:shadow-stripe-btn-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        {{ auth.loading ? 'Resetting...' : 'Reset password' }}
      </button>
    </form>

    <div class="mt-8 pt-6 border-t border-[#e6ebf1] flex flex-col items-center gap-3">
      <button @click="handleResend"
        class="w-full text-[14px] text-[#635BFF] hover:text-[#5455E2] font-medium transition-colors">
        Resend code
      </button>
      <router-link to="/login" class="text-[14px] text-[#8898AA] hover:text-[#32325D] transition-colors">
        Return to sign in
      </router-link>
    </div>
  </div>
</template>
