<template>
  <section id="stages" class="relative py-24 lg:py-32 overflow-hidden bg-white">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
      <div class="text-center max-w-[640px] mx-auto mb-16 md:mb-20">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-6">Pipeline stages</p>
        <h2 class="text-[clamp(2.25rem,4vw+1rem,3.5rem)] font-bold tracking-[-0.04em] leading-[1.08] text-gray-900 mb-5">
          From company name to<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-400">send-ready outreach</span>
        </h2>
        <p class="text-[1.125rem] text-gray-500 leading-relaxed font-medium">Four stages. One AI-powered workflow. Full pipeline access from day one.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <article v-for="(stage, i) in stages" :key="stage.id"
          class="relative group bg-white rounded-2xl border border-gray-100/80 p-8 md:p-10 hover:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-4 mb-6">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900 text-white text-[13px] font-semibold">{{ stage.number }}</span>
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">{{ stage.name }}</span>
          </div>

          <h3 class="text-xl font-bold tracking-[-0.02em] text-gray-900 mb-3">{{ stage.title }}</h3>
          <p class="text-[15px] text-gray-500 leading-relaxed font-medium mb-8">{{ stage.description }}</p>

          <div class="flex items-baseline gap-2 pt-6 border-t border-gray-100">
            <span class="text-3xl font-bold tracking-[-0.03em] text-gray-900">{{ stage.metric.value }}</span>
            <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.12em]">{{ stage.metric.label }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stages = [
  {
    id: 'research',
    number: '01',
    name: 'Research',
    title: 'Instant company intelligence',
    description: 'Enter a company name. Our AI researches web, news, job boards, funding, and tech stack to build a complete profile in 30 seconds.',
    metric: { value: '30s', label: 'vs 4h manual research' },
  },
  {
    id: 'pain-points',
    number: '02',
    name: 'Pain Points',
    title: 'Pain points with evidence, not guesses',
    description: 'AI maps company signals to problem categories, extracts evidence citations, and scores urgency so your outreach references something real.',
    metric: { value: '5–8', label: 'High-confidence pain points' },
  },
  {
    id: 'decision-makers',
    number: '03',
    name: 'Decision Makers',
    title: 'Verified contacts with confidence scores',
    description: 'Multi-source lookup (Hunter, Apollo, fallback) finds the right contacts with email verification, confidence scoring, and source attribution.',
    metric: { value: '92%', label: 'Email validity rate' },
  },
  {
    id: 'outreach',
    number: '04',
    name: 'Outreach',
    title: 'Outreach that sounds like you wrote it',
    description: 'Personalized email and LinkedIn sequences with validation scoring, tone matching, and one-click send — all generated from your pipeline context.',
    metric: { value: '3.2x', label: 'Reply rate vs generic' },
  },
]
</script>
