<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

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
  <AuthCard title="Reset your password" subtitle="Enter your email and we'll send you a link to reset your password.">
    <form @submit.prevent="handleForgotPassword" class="space-y-4">
      <AuthInput v-model="email" label="Email" type="email" icon="mail"
        autocomplete="email" :error="emailError" @update:model-value="emailError = ''" />

      <AuthButton :loading="auth.loading">
        Send reset link
      </AuthButton>
    </form>

    <template #footer>
      <p class="text-sm text-center">
        <router-link to="/login" class="font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Return to sign in
        </router-link>
      </p>
    </template>
  </AuthCard>
</template>
