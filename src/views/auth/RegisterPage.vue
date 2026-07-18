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

const name = ref('')
const company_name = ref('')
const email = ref('')
const password = ref('')

function onInput(field: string) {
  clear(field)
}

async function handleRegister() {
  clear()
  if (!name.value || !company_name.value || !email.value || !password.value) {
    toast.warn('Validation', 'Please fill in all fields')
    return
  }
  try {
    const res = await auth.register({
      name: name.value,
      company_name: company_name.value,
      email: email.value,
      password: password.value,
    })
    toast.success('Account Created', 'Please verify your email')
    router.push(`/verify-email?user_id=${res.user_id}`)
  } catch (err: unknown) {
    const parsed = setFromApi(err)
    toast.error('Registration Failed', parsed.message)
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-stripe-card border border-[#e6ebf1] p-8 sm:p-10">
    <h2 class="text-[24px] font-bold tracking-tight text-[#32325D] mb-8">Create your account</h2>
    <form @submit.prevent="handleRegister" class="space-y-5">
      <FormField label="Full Name" :error="errors.name">
        <input v-model="name" @input="onInput('name')" type="text" placeholder="Jane Doe"
          class="w-full h-[44px] px-3 rounded-lg border text-[15px] text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus"
          :class="errors.name ? 'border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:shadow-[0_0_0_1px_#f87171,0_1px_3px_0_rgba(50,50,93,0.15)]' : 'border-[#e6ebf1] bg-white hover:border-gray-300'" />
      </FormField>
      <FormField label="Company Name" :error="errors.company_name">
        <input v-model="company_name" @input="onInput('company_name')" type="text" placeholder="Acme Inc."
          class="w-full h-[44px] px-3 rounded-lg border text-[15px] text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus"
          :class="errors.company_name ? 'border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:shadow-[0_0_0_1px_#f87171,0_1px_3px_0_rgba(50,50,93,0.15)]' : 'border-[#e6ebf1] bg-white hover:border-gray-300'" />
      </FormField>
      <FormField label="Email" :error="errors.email">
        <input v-model="email" @input="onInput('email')" type="email" placeholder="you@company.com"
          class="w-full h-[44px] px-3 rounded-lg border text-[15px] text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus"
          :class="errors.email ? 'border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:shadow-[0_0_0_1px_#f87171,0_1px_3px_0_rgba(50,50,93,0.15)]' : 'border-[#e6ebf1] bg-white hover:border-gray-300'" />
      </FormField>
      <FormField label="Password" :error="errors.password">
        <PasswordInput v-model="password" @update:model-value="onInput('password')" placeholder="Create a password"
          :error="errors.password" />
      </FormField>
      <button type="submit" :disabled="auth.loading"
        class="w-full h-[44px] mt-4 bg-black text-white text-[15px] font-medium rounded-lg hover:bg-gray-900 shadow-stripe-btn hover:-translate-y-[1px] hover:shadow-stripe-btn-hover active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        {{ auth.loading ? 'Creating account...' : 'Sign up' }}
      </button>
    </form>
    <div class="mt-8 pt-6 border-t border-[#e6ebf1] flex flex-col items-center gap-3">
      <router-link to="/login" class="text-[14px] text-[#635BFF] hover:text-[#5455E2] font-medium transition-colors">
        Already have an account? Sign in
      </router-link>
    </div>
  </div>
</template>
