<template>
  <section id="faq" class="py-24 lg:py-32 bg-white" aria-labelledby="faq-heading">
    <div class="max-w-[880px] mx-auto px-6 md:px-10 lg:px-12">
      <header class="text-center max-w-[600px] mx-auto mb-16">
        <h2 id="faq-heading"
          class="text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-bold tracking-[-0.03em] leading-tight text-gray-900 mb-3">
          Frequently asked questions</h2>
        <p class="text-[1rem] text-gray-400 font-medium tracking-[-0.01em]">Everything you need to know about the
          pipeline.</p>
      </header>

      <div class="divide-y divide-gray-100">
        <div v-for="(faq, idx) in faqs" :key="faq.question" class="faq-item">
          <button class="w-full flex items-center justify-between gap-6 py-5 text-left group cursor-pointer"
            @click="toggle(idx)">
            <span
              class="text-[15px] font-semibold text-gray-900 tracking-[-0.01em] group-hover:text-gray-600 transition-colors">{{
                faq.question }}</span>
            <span
              class="faq-chevron shrink-0 w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-all duration-300"
              :class="{ 'is-open': openIndex === idx }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
          </button>
          <div
            class="faq-answer mt-[3px] px-4 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            :class="{ 'is-visible': openIndex === idx }">
            <div class="text-[14px] text-gray-500 leading-relaxed pb-6 m-0">{{ faq.answer }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref<number | null>(null)

function toggle(idx: number) {
  openIndex.value = openIndex.value === idx ? null : idx
}

const faqs = [
  {
    question: 'Is my data used for training?',
    answer: 'No. Your lead data, research outputs, and outreach drafts are never used to train models. Data is processed per-request and stored only in your workspace.',
  },
  {
    question: 'What sources do you search?',
    answer: 'Web search (Bing/Serper), news APIs, job boards (Greenhouse, Lever), tech fingerprinting (BuiltWith/Wappalyzer), funding databases (Crunchbase), and contact providers (Hunter, Apollo). All sources cited in output.',
  },
  {
    question: 'How accurate are the emails?',
    answer: 'Email verification runs on every contact. We report a 92% validity rate on verified emails. Confidence scores (0–100%) are shown per contact so you can filter by threshold.',
  },
  {
    question: 'Can I integrate with my CRM?',
    answer: 'CSV/JSON export is available on all plans. Native CRM integrations (HubSpot, Salesforce, Pipedrive) are on the roadmap. Webhooks for real-time sync available on Team plan.',
  },
  {
    question: 'What\'s the free tier limit?',
    answer: '5 free credits on signup, full pipeline access, 500 outreach generations/month. No credit card required. No time limit on free tier.',
  },
  {
    question: 'Do you support non-English markets?',
    answer: 'Research works globally (sources support 20+ languages). Outreach generation currently optimized for English; other languages in beta. Contact us for specific market needs.',
  },
  {
    question: 'How does the AI avoid hallucinations?',
    answer: 'Grounded generation: every claim cites a source document. Low-confidence extractions are flagged. You can toggle "strict mode" to only return verified fields.',
  },
]
</script>

<style scoped>
.faq-chevron.is-open {
  transform: rotate(45deg);
}

.faq-answer {
  max-height: 0;
  opacity: 0;
  will-change: max-height, opacity;
}

.faq-answer.is-visible {
  max-height: 300px;
  opacity: 1;
}
</style>
