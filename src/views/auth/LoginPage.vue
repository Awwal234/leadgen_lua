<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { useFormErrors } from '@/composables/useFormErrors'
import FormField from '@/components/FormField.vue'
import PasswordInput from '@/components/PasswordInput.vue'

const auth = useAuthStore()
const router = useRouter()
const { errors, setFromApi, clear } = useFormErrors()

const email = ref('')
const password = ref('')

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
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Sign in</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <FormField label="Email" :error="errors.email">
        <input
          v-model="email"
          @input="onInput('email')"
          type="email"
          placeholder="you@company.com"
          class="w-full h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          :class="errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'"
        />
      </FormField>
      <FormField label="Password" :error="errors.password">
        <PasswordInput
          v-model="password"
          @update:model-value="onInput('password')"
          placeholder="Enter your password"
          :error="errors.password"
        />
      </FormField>
      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full h-11 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ auth.loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
    <div class="mt-6 text-center space-y-2">
      <router-link to="/register" class="block text-sm text-gray-600 hover:text-black transition-colors">
        Don't have an account? Sign up
      </router-link>
      <router-link to="/forgot-password" class="block text-sm text-gray-600 hover:text-black transition-colors">
        Forgot password?
      </router-link>
    </div>
  </div>
</template>
