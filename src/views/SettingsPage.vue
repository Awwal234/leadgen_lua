<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
import { useFormErrors } from '@/composables/useFormErrors'
import FormField from '@/components/FormField.vue'

const auth = useAuthStore()
const { errors, setFromApi, clear } = useFormErrors()

const name = ref(auth.user?.name || '')
const companyName = ref(auth.user?.company_name || '')

function onInput(field: string) {
  clear(field)
}

async function handleUpdate() {
  clear()
  try {
    await auth.updateProfile({
      name: name.value,
      company_name: companyName.value,
    })
    toast.success('Profile Updated', 'Your information has been saved')
  } catch (err: unknown) {
    const parsed = setFromApi(err)
    toast.error('Error', parsed.message)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

    <div class="bg-white lg:w-[753px] lg:rounded-none rounded-xl border border-[#E6E6E6] p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile</h2>

      <div class="space-y-4">
        <FormField label="Email">
          <input :value="auth.user?.email" type="email" disabled
            class="w-full h-11 lg:h-[32px] lg:rounded-[3px] lg:bg-[#F6F8FA] px-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-500" />
        </FormField>
        <FormField label="Name" :error="errors.name">
          <input v-model="name" @input="onInput('name')" type="text"
            class="w-full h-11 lg:h-[32px] lg:rounded-[3px] lg:bg-[#F6F8FA] px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
            :class="errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'" />
        </FormField>
        <FormField label="Company name" :error="errors.company_name">
          <input v-model="companyName" @input="onInput('company_name')" type="text"
            class="w-full h-11 lg:h-[32px] lg:rounded-[3px] lg:bg-[#F6F8FA] px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
            :class="errors.company_name ? 'border-red-400 bg-red-50' : 'border-gray-300'" />
        </FormField>

        <div class="pt-2">
          <button @click="handleUpdate" :disabled="auth.loading"
            class="h-10 px-6 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ auth.loading ? 'Saving...' : 'Save changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
