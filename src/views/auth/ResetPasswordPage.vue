<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'
import { useFormErrors } from '@/composables/useFormErrors'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

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
  <AuthCard title="Set new password" subtitle="Enter the code from your email and choose a new password.">
    <form @submit.prevent="handleReset" class="space-y-4">
      <AuthInput v-model="email" label="Email" type="email" icon="mail" readonly :error="errors.email" />

      <AuthInput v-model="otp" label="Verification code" type="text" icon="mail" 
        :error="errors.otp" @update:model-value="onInput('otp')" maxlength="6"
        class="tracking-[0.35em] text-center text-lg font-mono" />

      <AuthInput v-model="newPassword" label="New Password" type="password" icon="lock"
        autocomplete="new-password" show-strength
        :error="errors.new_password" @update:model-value="onInput('new_password')" />

      <AuthButton :loading="auth.loading">
        <template v-if="auth.loading">Resetting...</template>
        <template v-else>Reset password</template>
      </AuthButton>
    </form>

    <template #footer>
      <div class="flex flex-col items-center gap-3">
        <button @click="handleResend"
          class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Resend code
        </button>
        <router-link to="/login" class="text-sm text-gray-400 hover:text-gray-900 transition-colors">
          Return to sign in
        </router-link>
      </div>
    </template>
  </AuthCard>
</template>
