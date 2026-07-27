<template>
  <section id="research" class="relative py-20 lg:py-24 overflow-hidden bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        <div class="max-w-xl">
          <div class="inline-flex items-center gap-4 mb-6">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900 text-white text-[13px] font-semibold">01</span>
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">Research</span>
          </div>

          <h2 class="text-[clamp(2rem,3.5vw+1rem,2.75rem)] font-bold tracking-[-0.03em] leading-[1.1] text-gray-900 mb-4">
            Instant company intelligence
          </h2>

          <p class="text-[15px] text-gray-500 leading-relaxed font-medium mb-8">
            Enter a company name or domain. Our AI agents research across web, news, job boards, funding databases, and tech fingerprinting to build a complete profile in 30 seconds.
          </p>

          <div class="flex flex-wrap gap-3 mb-8">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[12px] font-medium text-gray-600">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
              30s vs 4h manual
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[12px] font-medium text-gray-600">
              12+ data sources
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[12px] font-medium text-gray-600">
              95% coverage
            </span>
          </div>

          <ul class="space-y-3">
            <li v-for="item in features" :key="item" class="flex items-start gap-3 text-[14px] font-medium text-gray-600 leading-snug">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0 mt-0.5 text-amber-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="relative">
          <div class="rounded-xl overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] group hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-500">
            <div class="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <div class="flex gap-1">
                <div class="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                <div class="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
              </div>
              <span class="ml-2.5 text-[10px] text-gray-400 font-medium">research — company profile</span>
            </div>
            <div class="aspect-[4/3] overflow-hidden bg-white">
              <img src="/images/stage-research.svg" alt="Research output preview" class="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  'Web search & company page analysis',
  'News API: recent articles, funding, launches',
  'Tech fingerprinting: stack, analytics, infra',
]
</script>
