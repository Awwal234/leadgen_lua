<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  type?: string
  icon?: string
  error?: string
  helper?: string
  disabled?: boolean
  readonly?: boolean
  showStrength?: boolean
}>()

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const focused = ref(false)
const showPassword = ref(false)

const isPassword = () => props.type === 'password'

const inputType = computed(() => {
  if (isPassword()) return showPassword.value ? 'text' : 'password'
  return props.type || 'text'
})

const strength = computed(() => {
  if (!props.showStrength || !props.modelValue) return null
  const v = props.modelValue
  let score = 0
  if (v.length >= 6) score++
  if (v.length >= 10) score++
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++
  if (/\d/.test(v)) score++
  if (/[^a-zA-Z0-9]/.test(v)) score++
  if (score <= 1) return { level: 'weak', label: 'Weak', pct: 20 }
  if (score <= 3) return { level: 'medium', label: 'Fair', pct: 50 }
  return { level: 'strong', label: 'Strong', pct: 85 }
})

const iconPath = computed(() => {
  switch (props.icon) {
    case 'mail':
      return 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    case 'lock':
      return 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    case 'user':
      return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    case 'building':
      return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    default:
      return null
  }
})
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1.5 ml-0.5">{{ label }}</label>
    <div class="relative">
      <input
        :type="inputType"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="focused = true"
        @blur="focused = false"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="attrs"
        class="block w-full h-[48px] rounded-[10px] text-[15px] text-gray-900 bg-white
          transition-all duration-200
          focus:outline-none
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          readonly:bg-gray-50 readonly:text-gray-500 readonly:cursor-default"
        :class="[
          iconPath ? 'pl-[44px]' : 'pl-3.5',
          isPassword() ? 'pr-11' : 'pr-3.5',
          error
            ? 'border-red-300'
            : focused
              ? 'border-gray-900'
              : 'border-gray-200 hover:border-gray-300',
        ]"
        :style="{
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: error
            ? '0 0 0 1px rgba(239,68,68,0.3), 0 0 0 3px rgba(239,68,68,0.06)'
            : focused
              ? '0 0 0 1px #111827, 0 0 0 3px rgba(17,24,39,0.06)'
              : 'none',
        }"
      />

      <!-- Icon -->
      <div v-if="iconPath"
        class="absolute left-0 top-0 bottom-0 w-[44px] flex items-center justify-center pointer-events-none transition-colors duration-200"
        :class="focused || modelValue ? 'text-gray-600' : 'text-gray-300'">
        <svg class="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="iconPath" />
        </svg>
      </div>

      <!-- Password toggle -->
      <button
        v-if="isPassword()"
        type="button"
        @click="showPassword = !showPassword"
        :tabindex="-1"
        class="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <svg v-if="showPassword" class="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <svg v-else class="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      </button>
    </div>

    <!-- Password strength -->
    <div v-if="showStrength && strength" class="mt-2.5">
      <div class="h-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          :style="{
            width: strength.pct + '%',
            background: strength.level === 'weak' ? '#ef4444' : strength.level === 'medium' ? '#f59e0b' : '#22c55e',
          }" />
      </div>
      <p class="mt-1 text-[12px] text-gray-400">{{ strength.label }} password</p>
    </div>

    <p v-if="error" class="mt-1.5 text-sm text-red-600 ml-0.5">{{ error }}</p>
    <p v-else-if="helper" class="mt-1.5 text-sm text-gray-400 ml-0.5">{{ helper }}</p>
  </div>
</template>
