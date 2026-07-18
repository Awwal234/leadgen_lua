<script setup lang="ts">
defineProps<{
  label: string
  error?: string
}>()
</script>

<template>
  <div>
    <label class="block text-[13px] font-semibold text-[#32325D] mb-1.5 ml-0.5 tracking-wide">{{ label }}</label>
    <slot />
    <p v-if="error" class="text-[13px] text-red-500 mt-1.5 ml-0.5">{{ error }}</p>
  </div>
</template>
