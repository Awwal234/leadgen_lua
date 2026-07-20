<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <header class="relative bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-36 md:pt-25 pb-24 md:pb-32">
      <div class="max-w-[820px] mx-auto text-center">
        <h1
          class="text-[clamp(2.6rem,5.5vw+1rem,5rem)] font-extrabold tracking-[-0.05em] leading-[1.15] md:leading-[1.08] text-gray-900 mb-6">
          <span class="highlight">Research</span> accounts.<br>
          Find <span class="highlight">decision makers</span>.<br>
          <span class="highlight">Send</span> outreach.
        </h1>

        <p
          class="text-[1.125rem] md:text-[1.25rem] text-gray-500 max-w-[480px] mx-auto leading-relaxed font-medium mb-12">
          AI-powered pipeline that converts a company name into researched, personalized outreach. No credit card.
        </p>

        <div class="flex items-center justify-center gap-6">
          <button
            class="inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl cursor-pointer whitespace-nowrap px-8 py-3.5 text-[15px] bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.97] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            @click="$emit('ctaClick')">
            Start free
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" class="opacity-60">
              <path d="M5 10h10M10 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <button
            class="inline-flex items-center gap-2 text-[15px] font-semibold text-gray-400 hover:text-gray-700 transition-colors duration-300 cursor-pointer bg-transparent border-none p-0"
            @click="$emit('ctaClick')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" class="opacity-40">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Watch demo
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.highlight {
  background: linear-gradient(to top, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.25) 30%, transparent 30%, transparent 100%);
  padding: 0 4px;
  margin: 0 -4px;
}
</style>
