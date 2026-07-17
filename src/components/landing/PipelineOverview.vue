<template>
  <section id="how-it-works" class="bg-gray-50 py-20 md:py-24 lg:py-32 reveal" aria-labelledby="pipeline-heading">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
      <header class="text-center max-w-[720px] mx-auto mb-16">
        <h2 id="pipeline-heading" class="font-display text-[clamp(2rem,3vw+1rem,3rem)] font-semibold leading-tight text-gray-900 mb-4">How it works</h2>
        <p class="text-lg text-gray-500">Four stages. One workflow. From company name to send-ready outreach.</p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 reveal-stagger" role="list" aria-label="Pipeline stages">
        <template v-for="(stage, index) in stages" :key="stage.id">
          <article class="reveal bg-white border border-gray-200 rounded-2xl p-6 text-center flex flex-col hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 transition-all duration-250" role="listitem">
            <div class="w-10 h-10 mx-auto mb-4 flex items-center justify-center font-display text-xl font-bold text-black bg-gray-100 rounded-full" aria-hidden="true">{{ index + 1 }}</div>
            <h3 class="font-display text-xl font-semibold text-gray-900 mb-2">{{ stage.name }}</h3>
            <p class="text-sm text-gray-500 mb-6 leading-relaxed">{{ stage.description }}</p>

            <div class="aspect-[4/3] rounded-lg overflow-hidden mb-6 border border-gray-200" :style="{ background: stage.previewBg }">
              <img
                :src="stage.previewImage"
                :alt="stage.previewAlt"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <ul class="list-none p-0 m-0 mb-6 text-left" :aria-label="`${stage.name} outputs`">
              <li v-for="output in stage.outputs" :key="output" class="flex items-start gap-3 py-2 text-sm text-gray-700 leading-relaxed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-[2px] text-black" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ output }}
              </li>
            </ul>

            <div class="flex flex-col items-center gap-1 pt-4 border-t border-gray-200 mt-auto">
              <span class="font-display text-3xl font-bold leading-tight text-gray-900">{{ stage.metric.value }}</span>
              <span class="text-xs text-gray-500 uppercase tracking-wider">{{ stage.metric.label }}</span>
            </div>
          </article>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stages = [
  {
    id: 'research',
    name: 'Research',
    description: 'Give us a company name. We research web, news, job postings, funding, and tech stack.',
    previewBg: 'oklch(0.95 0 0)',
    previewImage: '/images/preview-research.svg',
    previewAlt: 'Research output showing company summary, industry, tech stack, recent news, and job signals',
    outputs: [
      'Company summary & industry',
      'Tech stack & employee count',
      'Recent news & funding',
      'Job posting signals',
    ],
    metric: { value: '30 sec', label: 'vs 4 hrs manual' },
  },
  {
    id: 'pain-points',
    name: 'Pain Points',
    description: 'AI analyzes research to identify urgent challenges with evidence from real sources.',
    previewBg: 'oklch(0.95 0 0)',
    previewImage: '/images/preview-pain-points.svg',
    previewAlt: 'Pain point cards with title, urgency badge, description, and supporting evidence',
    outputs: [
      'Ranked pain points by urgency',
      'Evidence-backed descriptions',
      'Relevant signals mapped',
      'Priority scoring',
    ],
    metric: { value: '87%', label: 'Precision on signals' },
  },
  {
    id: 'decision-makers',
    name: 'Decision Makers',
    description: 'Find the right contacts with verified emails, LinkedIn, and confidence scores.',
    previewBg: 'oklch(0.95 0 0)',
    previewImage: '/images/preview-decision-makers.svg',
    previewAlt: 'Contact card with name, title, email with confidence score, LinkedIn, and source',
    outputs: [
      'Verified email addresses',
      'LinkedIn profiles',
      'Confidence scores (0–100%)',
      'Source attribution',
    ],
    metric: { value: '92%', label: 'Email validity' },
  },
  {
    id: 'outreach',
    name: 'Outreach',
    description: 'Generate personalized email sequences and LinkedIn messages ready to send.',
    previewBg: 'oklch(0.95 0 0)',
    previewImage: '/images/preview-outreach.svg',
    previewAlt: 'Email draft with subject line, body, personalization tokens, and LinkedIn message variant',
    outputs: [
      'Email subject + body',
      'LinkedIn connection note',
      'Follow-up sequence',
      'Validation score',
    ],
    metric: { value: '3.2x', label: 'Reply rate lift' },
  },
  {
    id: 'send',
    name: 'Send',
    description: 'Deliver your outreach directly from the platform with one click. Track opens, replies, and follow up automatically.',
    previewBg: 'oklch(0.95 0 0)',
    previewImage: '/images/preview-send.svg',
    previewAlt: 'Send interface showing email compose, send button, delivery status indicators, and open/reply tracking',
    outputs: [
      'One-click send to inbox',
      'Delivery & open tracking',
      'Auto follow-up sequences',
      'Reply detection & alerts',
    ],
    metric: { value: '2.5x', label: 'Meetings booked' },
  },
]
</script>
