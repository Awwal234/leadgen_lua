<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <header class="relative max-w-7xl mx-auto pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
    <!-- Intense Background Glows -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-30 pointer-events-none blur-[100px] z-[-1]">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse-slow">
      </div>
    </div>

    <div class="text-center max-w-[1000px] mx-auto px-4 relative z-10">
      <h1
        class="hero-fade mx-auto text-[clamp(3rem,5vw+1rem,5.75rem)] text-[clamp(2.75rem,9vw,4rem)] md:text-[clamp(3rem,5vw+1rem,5.75rem)] font-extrabold leading-[1.02] tracking-tighter mb-8"
        style="animation-delay: 0ms">
        <span class="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500">
          Research accounts.<br />
          Find decisions makers.<br />
          Send outreach.
        </span>
      </h1>

      <p class="hero-fade text-[clamp(1.25rem,2vw+0.75rem,1.5rem)] leading-relaxed text-gray-500 max-w-[48ch] mx-auto mb-12 md:mb-14 font-medium tracking-tight"
        style="animation-delay: 150ms">
        AI pipeline that turns a company name into researched, personalized outreach — sent in 5
        steps. No credit card. 100 leads/month free.
      </p>

      <!--  -->
      <div class="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        style="animation-delay: 300ms">

        <!-- Primary Button -->
        <button
          class="inline-flex w-full md:w-fit items-center justify-center gap-2 font-semibold rounded-full cursor-pointer whitespace-nowrap px-10 py-5 text-[16px] min-h-[60px] bg-black text-white hover:bg-gray-900 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_12px_30px_rgba(0,0,0,0.15)] ring-1 ring-black/10"
          @click="$emit('ctaClick')">
          <span>Start free — no credit card required</span>

          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" class="opacity-80">
            <path d="M5 10h10M10 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>


        <!-- Secondary Button -->
        <button
          class="inline-flex w-full md:w-fit items-center justify-center gap-2 font-semibold rounded-full cursor-pointer whitespace-nowrap px-10 py-5 text-[16px] min-h-[60px] bg-transparent text-gray-900 border border-black/10 hover:bg-black/[0.03] hover:border-black/20 hover:scale-[1.03] active:scale-[0.98] transition-all"
          @click="$router.push('/login')">
          Sign in to your workspace
        </button>

      </div>
      <!--  -->

      <div
        class="hero-fade flex items-center justify-center gap-4 p-6 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] mt-12 flex-wrap shadow-[0_20px_60px_rgba(0,0,0,0.06)] max-w-4xl mx-auto"
        style="animation-delay: 450ms" role="img"
        aria-label="Pipeline preview: Research → Pain Points → Decision Makers → Outreach → Send">
        <div class="hero-step flex flex-col items-center gap-3 shrink-0 min-w-[90px] p-2"
          style="animation-delay: 550ms">
          <div
            class="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-gray-900 rounded-[1.25rem]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <span
            class="text-[13px] font-semibold text-gray-500 text-center whitespace-nowrap tracking-wide">Research</span>
        </div>
        <span class="hero-arrow shrink-0 text-gray-300 text-2xl font-light opacity-50" style="animation-delay: 590ms"
          aria-hidden="true">→</span>
        <div class="hero-step flex flex-col items-center gap-3 shrink-0 min-w-[90px] p-2"
          style="animation-delay: 630ms">
          <div
            class="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-gray-900 rounded-[1.25rem]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <span class="text-[13px] font-semibold text-gray-500 text-center whitespace-nowrap tracking-wide">Pain
            Points</span>
        </div>
        <span class="hero-arrow shrink-0 text-gray-300 text-2xl font-light opacity-50" style="animation-delay: 670ms"
          aria-hidden="true">→</span>
        <div class="hero-step flex flex-col items-center gap-3 shrink-0 min-w-[90px] p-2"
          style="animation-delay: 710ms">
          <div
            class="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-gray-900 rounded-[1.25rem]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span class="text-[13px] font-semibold text-gray-500 text-center whitespace-nowrap tracking-wide">Decision
            Makers</span>
        </div>
        <span class="hero-arrow shrink-0 text-gray-300 text-2xl font-light opacity-50" style="animation-delay: 750ms"
          aria-hidden="true">→</span>
        <div class="hero-step flex flex-col items-center gap-3 shrink-0 min-w-[90px] p-2"
          style="animation-delay: 790ms">
          <div
            class="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-gray-900 rounded-[1.25rem]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <span
            class="text-[13px] font-semibold text-gray-500 text-center whitespace-nowrap tracking-wide">Outreach</span>
        </div>
        <span class="hero-arrow shrink-0 text-gray-300 text-2xl font-light opacity-50" style="animation-delay: 830ms"
          aria-hidden="true">→</span>
        <div class="hero-step flex flex-col items-center gap-3 shrink-0 min-w-[90px] p-2"
          style="animation-delay: 870ms">
          <div
            class="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-gray-900 rounded-[1.25rem]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              aria-hidden="true">
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-[13px] font-semibold text-gray-500 text-center whitespace-nowrap tracking-wide">Send</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-fade {
  opacity: 0;
  transform: translateY(20px);
  animation: hero-fade-in 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-step {
  opacity: 0;
  transform: translateY(12px);
  animation: hero-fade-in 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-arrow {
  opacity: 0;
  animation: hero-fade-in 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes hero-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {

  .hero-fade,
  .hero-step,
  .hero-arrow {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>
