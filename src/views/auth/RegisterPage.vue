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
const companyName = ref('')
const email = ref('')
const password = ref('')

function onInput(field: string) {
  clear(field)
}

async function handleRegister() {
  clear()
  if (!name.value || !companyName.value || !email.value || !password.value) {
    toast.warn('Validation', 'Please fill in all fields')
    return
  }
  try {
    const res = await auth.register({
      name: name.value,
      company_name: companyName.value,
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
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Create account</h2>
    <form @submit.prevent="handleRegister" class="space-y-4">
      <FormField label="Full name" :error="errors.name">
        <input
          v-model="name"
          @input="onInput('name')"
          type="text"
          placeholder="John Doe"
          class="w-full h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          :class="errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'"
        />
      </FormField>
      <FormField label="Company name" :error="errors.company_name">
        <input
          v-model="companyName"
          @input="onInput('company_name')"
          type="text"
          placeholder="Acme Inc."
          class="w-full h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
          :class="errors.company_name ? 'border-red-400 bg-red-50' : 'border-gray-300'"
        />
      </FormField>
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
          placeholder="Create a password"
          :error="errors.password"
        />
      </FormField>
      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full h-11 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ auth.loading ? 'Creating account...' : 'Create account' }}
      </button>
    </form>
    <div class="mt-6 text-center">
      <router-link to="/login" class="text-sm text-gray-600 hover:text-black transition-colors">
        Already have an account? Sign in
      </router-link>
    </div>
  </div>
</template>
