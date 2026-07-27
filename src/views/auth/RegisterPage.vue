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
  <AuthCard title="Create your account" subtitle="Start your 14-day free trial. No credit card required.">
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthInput v-model="name" label="Full Name" type="text" icon="user"
          :error="errors.name" @update:model-value="onInput('name')" />
        <AuthInput v-model="company_name" label="Company" type="text" icon="building"
          :error="errors.company_name" @update:model-value="onInput('company_name')" />
      </div>
      <AuthInput v-model="email" label="Email" type="email" icon="mail"
        autocomplete="email" :error="errors.email" @update:model-value="onInput('email')" />
      <AuthInput v-model="password" label="Password" type="password" icon="lock"
        autocomplete="new-password" show-strength
        :error="errors.password" @update:model-value="onInput('password')" />

      <p class="text-xs text-gray-400 leading-relaxed">
        By creating an account, you agree to our
        <a href="#" class="text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors">Terms of Service</a>
        and
        <a href="#" class="text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors">Privacy Policy</a>.
      </p>

      <AuthButton :loading="auth.loading">
        <template v-if="auth.loading">Creating account...</template>
        <template v-else>Create account</template>
      </AuthButton>
    </form>

    <template #footer>
      <p class="text-sm text-center text-gray-500">
        Already have an account?
        <router-link to="/login" class="font-medium text-gray-900 hover:text-gray-600 transition-colors">Sign in</router-link>
      </p>
    </template>
  </AuthCard>
</template>
