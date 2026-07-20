<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <section class="relative overflow-hidden" aria-labelledby="footer-cta-heading">
    <div class="w-full">
      <div
        class="relative rounded-t-[2rem] md:rounded-t-[3rem] bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-white/[0.06] overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
          <div
            class="absolute top-[-30%] right-[-10%] w-[60%] h-[80%] rounded-full bg-gradient-to-bl from-blue-500/[0.04] via-purple-500/[0.03] to-transparent blur-[120px]">
          </div>
          <div
            class="absolute bottom-[-20%] left-[-5%] w-[40%] h-[50%] rounded-full bg-gradient-to-tr from-emerald-500/[0.03] to-transparent blur-[100px]">
          </div>
        </div>

        <div class="relative px-8 py-14 md:px-16 md:py-20 lg:px-20 lg:py-24 text-center">
          <p
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
            Get started in seconds
          </p>

          <h2 id="footer-cta-heading"
            class="text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-4">
            Turn companies into<br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">conversations.</span>
          </h2>

          <p class="text-[15px] text-white/30 font-medium tracking-[-0.01em] mb-10 max-w-[420px] mx-auto">
            No credit card required. 5 free credits on signup. Full pipeline access.
          </p>

          <div class="inline-flex items-center">
            <div class="flex flex-col items-center gap-0">
              <div class="w-5 h-3 border-l-2 border-t-2 border-white/10 rounded-tl-md"></div>
              <div class="flex-1 border-l-2 border-white/10 min-h-[26px]"></div>
              <div class="w-5 h-3 border-l-2 border-b-2 border-white/10 rounded-bl-md"></div>
            </div>
            <button
              class="relative inline-flex items-center justify-center gap-3 font-semibold cursor-pointer whitespace-nowrap px-10 py-4 text-[15px] min-h-[52px] bg-white text-gray-900 hover:bg-gray-100 active:scale-[0.97] transition-all duration-300 rounded-xl shadow-[0_8px_28px_rgba(255,255,255,0.06)] hover:shadow-[0_12px_36px_rgba(255,255,255,0.1)]"
              @click="$emit('ctaClick')">
              <span>Start free</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" class="opacity-60">
                <path d="M5 10h10M10 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
            <div class="flex flex-col items-center gap-0">
              <div class="w-5 h-3 border-r-2 border-t-2 border-white/10 rounded-tr-md"></div>
              <div class="flex-1 border-r-2 border-white/10 min-h-[26px]"></div>
              <div class="w-5 h-3 border-r-2 border-b-2 border-white/10 rounded-br-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
