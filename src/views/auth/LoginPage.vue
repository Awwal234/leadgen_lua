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
  <div class="bg-white rounded-2xl shadow-stripe-card border border-[#e6ebf1] p-8 sm:p-10">
    <h2 class="text-[24px] font-bold tracking-tight text-[#32325D] mb-8">Sign in to your account</h2>
    <form @submit.prevent="handleLogin" class="space-y-5">
      <FormField label="Email" :error="errors.email">
        <input v-model="email" @input="onInput('email')" type="email" placeholder="you@company.com"
          class="w-full h-[44px] px-3 rounded-lg border text-[15px] text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus"
          :class="errors.email ? 'border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:shadow-[0_0_0_1px_#f87171,0_1px_3px_0_rgba(50,50,93,0.15)]' : 'border-[#e6ebf1] bg-white hover:border-gray-300'" />
      </FormField>
      <FormField label="Password" :error="errors.password">
        <PasswordInput v-model="password" @update:model-value="onInput('password')" placeholder="Enter your password"
          :error="errors.password" />
      </FormField>
      <button type="submit" :disabled="auth.loading"
        class="w-full h-[44px] mt-4 bg-[#635BFF] text-white text-[15px] font-medium rounded-lg hover:bg-[#5455E2] shadow-stripe-btn hover:-translate-y-[1px] hover:shadow-stripe-btn-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        {{ auth.loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
    <div class="mt-8 pt-6 border-t border-[#e6ebf1] flex flex-col items-center gap-3">
      <router-link to="/register" class="text-[14px] text-[#635BFF] hover:text-[#5455E2] font-medium transition-colors">
        Don't have an account? Sign up
      </router-link>
      <router-link to="/forgot-password" class="text-[14px] text-[#8898AA] hover:text-[#32325D] transition-colors">
        Forgot password?
      </router-link>
    </div>
  </div>
</template>
