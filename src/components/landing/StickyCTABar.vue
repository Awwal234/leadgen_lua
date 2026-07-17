<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 px-6 py-3 bg-white border-t border-gray-200 shadow-xl translate-y-full opacity-0 pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
      <p class="text-sm text-gray-500 m-0">Your first researched lead is 30 seconds away</p>
      <button class="inline-flex items-center justify-center gap-2 font-medium rounded-lg border cursor-pointer no-underline whitespace-nowrap px-4 py-2 text-sm min-h-[36px] bg-black text-white border-black hover:bg-gray-900 hover:border-gray-900 hover:-translate-y-px hover:shadow-md transition-all active:scale-[0.97]" @click="$emit('ctaClick')">
        <span>Start free</span>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 10h10M10 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.is-visible {
  transform: translateY(0) !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
</style>
