<script setup lang="ts">
defineProps<{
  loading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="submit"
    :disabled="disabled || loading"
    class="clip-btn relative w-full h-[46px] inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold text-white
      bg-gradient-to-br from-[#292524] to-[#1c1917]
      transition-[transform,opacity] duration-300 ease-out
      hover:-translate-y-[1px]
      active:scale-[0.97]
      disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#292524] focus-visible:ring-offset-2"
  >
    <span v-if="loading" class="flex items-center gap-1.5">
      <span class="w-[5px] h-[5px] rounded-full bg-white/70 animate-bounce" style="animation-delay: 0s" />
      <span class="w-[5px] h-[5px] rounded-full bg-white/70 animate-bounce" style="animation-delay: 0.15s" />
      <span class="w-[5px] h-[5px] rounded-full bg-white/70 animate-bounce" style="animation-delay: 0.3s" />
    </span>
    <span v-else class="relative"><slot /></span>
  </button>
</template>

<style scoped>
.clip-btn {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
  filter: drop-shadow(0 2px 8px rgba(28,25,23,0.12));
}
.clip-btn:hover:not(:disabled) {
  filter: drop-shadow(0 4px 20px rgba(28,25,23,0.25));
}
.clip-btn:active:not(:disabled) {
  filter: drop-shadow(0 1px 4px rgba(28,25,23,0.15));
}
</style>
