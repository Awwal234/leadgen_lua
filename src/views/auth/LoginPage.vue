<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { useFormErrors } from '@/composables/useFormErrors'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthInput from '@/components/auth/AuthInput.vue'
import AuthButton from '@/components/auth/AuthButton.vue'

const auth = useAuthStore()
const router = useRouter()
const { errors, setFromApi, clear } = useFormErrors()

const email = ref('')
const password = ref('')
const remember = ref(false)

function onInput(field: string) {
  clear(field)
}

async function handleLogin() {
  clear()
  if (!email.value || !password.value) {
    toast.warn('Validation', 'Please fill in all fields')
    return
  }
  try {
    await auth.login(email.value, password.value)
    toast.success('Welcome', 'Logged in successfully')
    router.push('/app')
  } catch (err: unknown) {
    const parsed = setFromApi(err)
    toast.error('Login Failed', parsed.message)
  }
}
</script>

<template>
  <AuthCard title="Sign in" subtitle="Welcome back. Enter your credentials to access your account.">
    <form @submit.prevent="handleLogin" class="space-y-4">
      <AuthInput
        v-model="email"
        label="Email"
        type="email"
        icon="mail"
        autocomplete="email"
        :error="errors.email"
        @update:model-value="onInput('email')"
      />
      <AuthInput
        v-model="password"
        label="Password"
        type="password"
        icon="lock"
        autocomplete="current-password"
        :error="errors.password"
        @update:model-value="onInput('password')"
      />

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2.5 cursor-pointer group">
          <div class="relative flex items-center justify-center">
            <input type="checkbox" v-model="remember"
              class="peer sr-only" />
            <div class="w-[18px] h-[18px] rounded-[5px] border border-gray-300 transition-all duration-150
              peer-checked:bg-gray-900 peer-checked:border-gray-900
              peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900/20 peer-focus-visible:ring-offset-1
              group-hover:border-gray-400" />
            <svg v-if="remember" class="absolute w-[11px] h-[11px] text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span class="text-sm text-gray-500 group-hover:text-gray-700 transition-colors select-none">Remember me</span>
        </label>
        <router-link to="/forgot-password"
          class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Forgot password?
        </router-link>
      </div>

      <AuthButton :loading="auth.loading">
        <template v-if="auth.loading">Signing in...</template>
        <template v-else>Sign in</template>
      </AuthButton>
    </form>

    <template #footer>
      <p class="text-sm text-center text-gray-500">
        Don't have an account?
        <router-link to="/register" class="font-medium text-gray-900 hover:text-gray-600 transition-colors">Sign up</router-link>
      </p>
    </template>
  </AuthCard>
</template>
