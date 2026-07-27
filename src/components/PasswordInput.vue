<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: string
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const show = ref(false)

function toggle() {
  show.value = !show.value
}
</script>

<template>
  <div class="relative">
    <input
      :type="show ? 'text' : 'password'"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder || 'Enter password'"
      class="w-full h-[44px] px-3 pr-12 rounded-lg border text-[15px] text-[#32325D] placeholder:text-[#8898AA] transition-all duration-200 focus:outline-none focus:border-[#635BFF] focus:shadow-stripe-focus"
      :class="error ? 'border-red-400 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:shadow-[0_0_0_1px_#f87171,0_1px_3px_0_rgba(50,50,93,0.15)]' : 'border-[#e6ebf1] bg-white hover:border-gray-300'"
    />
    <button
      type="button"
      @click="toggle"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100"
      tabindex="-1"
    >
      <svg v-if="show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    </button>
  </div>
</template>
