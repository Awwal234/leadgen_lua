<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <section
    class="reveal bg-black text-white py-16 md:py-20 lg:py-24"
    aria-labelledby="footer-cta-heading"
  >
    <div
      class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left"
    >
      <div class="max-w-[560px]">
        <h2
          id="footer-cta-heading"
          class="font-display text-[clamp(1.5rem,3vw+0.5rem,2.5rem)] font-semibold leading-tight text-white mb-2"
        >
          Your first researched lead is 30 seconds away
        </h2>
        <p class="text-base text-gray-400 m-0">
          No credit card · Cancel anytime · 100 leads/mo free
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 font-medium rounded-lg border cursor-pointer no-underline whitespace-nowrap px-8 py-4 text-base min-h-[48px] bg-white text-gray-900 border-white hover:bg-gray-100 hover:border-gray-100 hover:-translate-y-px transition-all active:scale-[0.97] shrink-0"
        @click="$emit('ctaClick')"
      >
        <span>Start free</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M5 10h10M10 5v10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </section>
</template>
