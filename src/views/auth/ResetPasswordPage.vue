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
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Reset password</h2>
    <form @submit.prevent="handleReset" class="space-y-4">
      <FormField label="Email" :error="errors.email">
        <input
          v-model="email"
          type="email"
          readonly
          class="w-full h-11 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500"
        />
      </FormField>
      <FormField label="OTP code" :error="errors.otp">
        <input
          v-model="otp"
          @input="onInput('otp')"
          type="text"
          maxlength="6"
          placeholder="000000"
          class="w-full h-11 px-3 rounded-lg border text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          :class="errors.otp ? 'border-red-400 bg-red-50' : 'border-gray-300'"
        />
      </FormField>
      <FormField label="New password" :error="errors.new_password">
        <PasswordInput
          v-model="newPassword"
          @update:model-value="onInput('new_password')"
          placeholder="Enter new password"
          :error="errors.new_password"
        />
      </FormField>
      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full h-11 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ auth.loading ? 'Resetting...' : 'Reset password' }}
      </button>
    </form>

    <div class="mt-4 text-center space-y-2">
      <button @click="handleResend" class="text-sm text-gray-600 hover:text-black transition-colors">
        Resend code
      </button>
      <div>
        <router-link to="/login" class="text-sm text-gray-600 hover:text-black transition-colors">
          Back to sign in
        </router-link>
      </div>
    </div>
  </div>
</template>
