<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <section
    class="reveal bg-[#0a0a0a] text-white py-20 md:py-28 lg:py-32"
    aria-labelledby="footer-cta-heading"
  >
    <div
      class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 text-center md:text-left"
    >
      <div class="max-w-[600px]">
        <h2
          id="footer-cta-heading"
          class="text-[clamp(2rem,4vw+1rem,3.5rem)] font-semibold tracking-tight leading-[1.1] text-white mb-4"
        >
          Your first researched lead is 30 seconds away.
        </h2>
        <p class="text-[1.125rem] text-gray-400 font-medium tracking-wide m-0">
          No credit card · Cancel anytime · 100 leads/mo free
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 font-medium rounded-full cursor-pointer no-underline whitespace-nowrap px-10 py-5 text-[15px] min-h-[56px] bg-white text-gray-900 border-white hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_8px_20px_rgb(255,255,255,0.1)] shrink-0"
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
