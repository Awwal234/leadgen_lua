<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-2xl border-t border-gray-200/50 shadow-[0_-10px_40px_rgb(0,0,0,0.06)] translate-y-full opacity-0 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] md:hidden">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
      <p class="text-[13px] font-medium text-gray-500 tracking-wide m-0">Your first lead is 30s away</p>
      <button class="inline-flex items-center justify-center gap-2 font-medium rounded-full cursor-pointer no-underline whitespace-nowrap px-5 py-2.5 text-[14px] min-h-[40px] bg-gray-900 text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm" @click="$emit('ctaClick')">
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
