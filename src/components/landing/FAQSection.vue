<template>
  <section id="faq" class="py-20 md:py-24 lg:py-32 reveal" aria-labelledby="faq-heading">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
      <header class="text-center max-w-[720px] mx-auto mb-16">
        <h2 id="faq-heading" class="font-display text-[clamp(1.75rem,3vw+1rem,2.5rem)] font-semibold leading-tight text-gray-900 mb-3">Questions?</h2>
        <p class="text-lg text-gray-500">Straight answers to common questions</p>
      </header>

      <div class="grid gap-3 md:gap-4 max-w-[800px] mx-auto reveal-stagger">
        <details class="reveal border border-gray-200 rounded-lg overflow-hidden bg-white" v-for="faq in faqs" :key="faq.question">
          <summary class="w-full flex items-center justify-between gap-4 px-6 py-5 text-base font-medium text-gray-900 text-left bg-transparent border-none cursor-pointer hover:bg-gray-50 transition-colors">
            {{ faq.question }}
            <svg class="faq-icon shrink-0 w-6 h-6 text-gray-500 transition-transform duration-250" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div class="px-6 pb-5 text-gray-700 leading-relaxed">
            <p class="m-0">{{ faq.answer }}</p>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
    answer: 'CSV/JSON export is available on all plans. Native CRM integrations (HubSpot, Salesforce, Pipedrive) are on the roadmap for Q1 2025. Webhooks for real-time sync available on Team plan.',
  },
  {
    question: "What's the free tier limit?",
    answer: '100 leads/month, full pipeline access, 500 outreach generations/month. No credit card required. No time limit on free tier.',
  },
  {
    question: 'Do you support non-English markets?',
    answer: 'Research works globally (sources support 20+ languages). Outreach generation currently optimized for English; other languages in beta. Contact us for specific market needs.',
  },
  {
    question: 'Can I export the research data?',
    answer: 'Yes. Every pipeline stage (research, pain points, contacts, outreach) exports as JSON or CSV. Raw API responses also available for custom parsing.',
  },
  {
    question: 'How does the AI avoid hallucinations?',
    answer: 'Grounded generation: every claim cites a source document. Low-confidence extractions are flagged. You can toggle "strict mode" to only return verified fields.',
  },
]
</script>

<style scoped>
details[open] .faq-icon {
  transform: rotate(180deg);
}

details summary::-webkit-details-marker {
  display: none;
}
</style>
