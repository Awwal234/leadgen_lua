<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="animate-enter">
    <div class="bg-white rounded-[16px] p-6 sm:p-8 shadow-card border border-gray-100/70">
      <div v-if="title">
        <h1 class="text-[22px] font-bold tracking-tight text-gray-900">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1.5 text-sm leading-relaxed text-gray-500">{{ subtitle }}</p>
      </div>
      <div :class="[title ? 'mt-6' : '']">
        <slot />
      </div>
      <div v-if="$slots.footer" class="mt-6 pt-5 border-t border-gray-100">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-enter {
  animation: enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes enter {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
