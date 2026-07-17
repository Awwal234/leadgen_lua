<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import { toast } from '@/utils/toast'
import { useFormErrors } from '@/composables/useFormErrors'
import FormField from '@/components/FormField.vue'
import type { LeadSummary } from '@/types'

const emit = defineEmits<{
  close: []
  created: [lead: LeadSummary]
}>()

const { errors, setFromApi, clear } = useFormErrors()

const company = ref('Coinbase')
const domain = ref('coinbase.com')
const targetRole = ref('VP of Engineering')
const notes = ref('Leading cryptocurrency exchange platform. Recently expanding into new markets.')
const loading = ref(false)

function onInput(field: string) {
  clear(field)
}

async function handleSubmit() {
  clear()
  if (!company.value) {
    toast.warn('Validation', 'Company name is required')
    return
  }
  loading.value = true
  try {
    const res = await api.post('/api/leads', {
      company: company.value,
      domain: domain.value || undefined,
      targetRole: targetRole.value || undefined,
      notes: notes.value || undefined,
    })
    toast.success('Lead Created', `${company.value} added successfully`)
    emit('created', res.data.data)
  } catch (err: unknown) {
    const parsed = setFromApi(err)
    toast.error('Error', parsed.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')" />
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h3 class="text-lg font-semibold text-gray-900">New Lead</h3>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors touch-target"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <FormField label="Company *" :error="errors.company">
          <input
            v-model="company"
            @input="onInput('company')"
            type="text"
            placeholder="Acme Inc."
            class="w-full h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black touch-target"
            :class="errors.company ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
        </FormField>
        <FormField label="Domain" :error="errors.domain">
          <input
            v-model="domain"
            @input="onInput('domain')"
            type="text"
            placeholder="acme.com"
            class="w-full h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black touch-target"
            :class="errors.domain ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
        </FormField>
        <FormField label="Target role" :error="errors.targetRole">
          <input
            v-model="targetRole"
            @input="onInput('targetRole')"
            type="text"
            placeholder="CTO, VP of Engineering, ..."
            class="w-full h-11 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black touch-target"
            :class="errors.targetRole ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
          <div class="flex flex-wrap gap-1.5 mt-2">
            <button
              v-for="role in ['CTO', 'VP of Engineering', 'Head of Product', 'CEO', 'CMO', 'Director of Sales']"
              :key="role"
              type="button"
              @click="targetRole = role; onInput('targetRole')"
              class="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors touch-target"
              :class="targetRole === role
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800'"
            >
              {{ role }}
            </button>
          </div>
        </FormField>
        <FormField label="Notes" :error="errors.notes">
          <textarea
            v-model="notes"
            @input="onInput('notes')"
            rows="3"
            placeholder="Any context about this lead..."
            class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black resize-none"
            :class="errors.notes ? 'border-red-400 bg-red-50' : 'border-gray-300'"
          />
        </FormField>
        <button
          type="submit"
          :disabled="loading"
          class="w-full h-11 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-target"
        >
          {{ loading ? 'Creating...' : 'Create lead' }}
        </button>
      </form>
    </div>
  </div>
</template>
