<script setup lang="ts">
defineEmits<{
  ctaClick: []
}>()
</script>

<template>
  <header class="max-w-7xl mx-auto pt-12 md:pt-20">
    <div class="text-center max-w-[900px] mx-auto">
      <h1
        class="hero-fade font-display text-[clamp(2.25rem,5vw+1rem,4rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-gray-900 mb-6 md:mb-8"
        style="animation-delay: 0ms"
      >
        Research target accounts.<br />
        Find decision makers.<br />
        Write and send outreach.
      </h1>

      <p
        class="hero-fade text-[clamp(1.125rem,1.5vw+0.75rem,1.375rem)] leading-relaxed text-gray-500 max-w-[60ch] mx-auto mb-8 md:mb-10"
        style="animation-delay: 150ms"
      >
        AI pipeline that turns a company name into researched, personalized outreach — sent in 5
        steps. No credit card. 100 leads/month free.
      </p>

      <div
        class="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        style="animation-delay: 300ms"
      >
        <button
          class="inline-flex items-center justify-center gap-2 font-medium rounded-lg border cursor-pointer no-underline whitespace-nowrap px-8 py-4 text-base min-h-[48px] bg-black text-white border-black hover:bg-gray-900 hover:border-gray-900 hover:-translate-y-px hover:shadow-md transition-all active:scale-[0.97]"
          @click="$emit('ctaClick')"
        >
          <span>Start free — no credit card required</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 10h10M10 5v10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <a
          href="/login"
          class="inline-flex items-center justify-center gap-2 font-medium rounded-lg border cursor-pointer no-underline whitespace-nowrap px-8 py-4 text-base min-h-[48px] bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.97]"
          >Sign in to your workspace</a
        >
      </div>

      <div
        class="hero-fade flex items-center justify-center gap-3 p-4 bg-white border-x border-t border-gray-200 rounded-t-xl mt-10 flex-wrap"
        style="animation-delay: 450ms"
        role="img"
        aria-label="Pipeline preview: Research → Pain Points → Decision Makers → Outreach → Send"
      >
        <div
          class="hero-step flex flex-col items-center gap-1 shrink-0 min-w-[80px] p-2"
          style="animation-delay: 550ms"
        >
          <div class="w-9 h-9 flex items-center justify-center bg-gray-100 text-black rounded-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-500 text-center whitespace-nowrap"
            >Research</span
          >
        </div>
        <span
          class="hero-arrow shrink-0 text-gray-200 text-lg"
          style="animation-delay: 590ms"
          aria-hidden="true"
          >→</span
        >
        <div
          class="hero-step flex flex-col items-center gap-1 shrink-0 min-w-[80px] p-2"
          style="animation-delay: 630ms"
        >
          <div class="w-9 h-9 flex items-center justify-center bg-gray-100 text-black rounded-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-500 text-center whitespace-nowrap"
            >Pain Points</span
          >
        </div>
        <span
          class="hero-arrow shrink-0 text-gray-200 text-lg"
          style="animation-delay: 670ms"
          aria-hidden="true"
          >→</span
        >
        <div
          class="hero-step flex flex-col items-center gap-1 shrink-0 min-w-[80px] p-2"
          style="animation-delay: 710ms"
        >
          <div class="w-9 h-9 flex items-center justify-center bg-gray-100 text-black rounded-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-500 text-center whitespace-nowrap"
            >Decision Makers</span
          >
        </div>
        <span
          class="hero-arrow shrink-0 text-gray-200 text-lg"
          style="animation-delay: 750ms"
          aria-hidden="true"
          >→</span
        >
        <div
          class="hero-step flex flex-col items-center gap-1 shrink-0 min-w-[80px] p-2"
          style="animation-delay: 790ms"
        >
          <div class="w-9 h-9 flex items-center justify-center bg-gray-100 text-black rounded-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-500 text-center whitespace-nowrap"
            >Outreach</span
          >
        </div>
        <span
          class="hero-arrow shrink-0 text-gray-200 text-lg"
          style="animation-delay: 830ms"
          aria-hidden="true"
          >→</span
        >
        <div
          class="hero-step flex flex-col items-center gap-1 shrink-0 min-w-[80px] p-2"
          style="animation-delay: 870ms"
        >
          <div class="w-9 h-9 flex items-center justify-center bg-gray-100 text-black rounded-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-500 text-center whitespace-nowrap">Send</span>
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
