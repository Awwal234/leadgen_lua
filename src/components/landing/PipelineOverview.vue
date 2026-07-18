<template>
  <section id="how-it-works" ref="sectionRef" class="relative bg-[#fafafa]" style="height: 400vh;"
    aria-labelledby="pipeline-heading">
    <div class="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
      <header class="text-center w-full max-w-[720px] mx-auto mb-10 md:mb-16 px-6 shrink-0 mt-20">
        <h2 id="pipeline-heading"
          class="text-[clamp(2.5rem,4vw+1rem,3.5rem)] font-semibold tracking-tight leading-tight text-gray-900 mb-4">How
          it works</h2>
        <p class="text-[1.125rem] md:text-[1.25rem] text-gray-500 font-medium tracking-wide leading-relaxed">Four
          stages. One workflow. From company name to send-ready outreach.</p>
      </header>

      <div class="w-full overflow-hidden pb-20">
        <div ref="trackRef" class="flex gap-6 md:gap-10 px-[10vw] md:px-[15vw] w-max will-change-transform" role="list"
          aria-label="Pipeline stages">
          <template v-for="(stage, index) in stages" :key="stage.id">
            <article
              class="w-[85vw] sm:w-[380px] lg:w-[420px] bg-white border border-gray-200/60 rounded-[2rem] p-8 text-center flex flex-col hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 shrink-0"
              role="listitem">
              <div
                class="w-12 h-12 mx-auto mb-6 flex items-center justify-center text-lg font-semibold text-gray-900 bg-gray-50 border border-gray-100 shadow-sm rounded-2xl"
                aria-hidden="true">{{ index + 1 }}</div>
              <h3 class="text-xl font-semibold tracking-tight text-gray-900 mb-3">{{ stage.name }}</h3>
              <p class="text-[15px] text-gray-500 mb-8 leading-relaxed font-medium min-h-[44px]">{{ stage.description }}
              </p>

              <div class="aspect-[4/3] rounded-xl overflow-hidden mb-8 border border-gray-100 shadow-sm relative group"
                :style="{ background: stage.previewBg }">
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10 pointer-events-none">
                </div>
                <img :src="stage.previewImage" :alt="stage.previewAlt"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                  loading="lazy" />
              </div>

              <ul class="list-none p-0 m-0 mb-8 text-left space-y-3" :aria-label="`${stage.name} outputs`">
                <li v-for="output in stage.outputs" :key="output"
                  class="flex items-start gap-3 py-1 text-[15px] text-gray-600 leading-relaxed font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    class="shrink-0 mt-[3px] text-gray-400" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ output }}
                </li>
              </ul>

              <div class="flex flex-col items-center gap-2 pt-6 border-t border-gray-100 mt-auto">
                <span class="text-4xl font-semibold tracking-tight leading-tight text-gray-900">{{ stage.metric.value
                  }}</span>
                <span class="text-[13px] text-gray-500 font-medium tracking-wide uppercase">{{ stage.metric.label
                  }}</span>
              </div>
            </article>
          </template>
        </div>
      </div>

      <!-- Progress Bar Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-black rounded-full" :style="{ width: `${progress * 100}%` }"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const progress = ref(0)

function handleScroll() {
  if (!sectionRef.value || !trackRef.value) return

  const rect = sectionRef.value.getBoundingClientRect()
  const sectionTop = rect.top
  const sectionHeight = rect.height
  const windowHeight = window.innerHeight

  // If section hasn't reached the top, we are at 0% progress
  if (sectionTop > 0) {
    progress.value = 0
    trackRef.value.style.transform = `translateX(0px)`
    return
  }

  // Calculate how far we've scrolled inside the section
  const scrollDistance = -sectionTop
  const scrollableDistance = sectionHeight - windowHeight

  if (scrollDistance > scrollableDistance) {
    progress.value = 1
  } else {
    progress.value = scrollDistance / scrollableDistance
  }

  // Translate track based on progress
  const trackWidth = trackRef.value.scrollWidth
  const maxTranslate = trackWidth - window.innerWidth + (window.innerWidth * 0.15) // Leave a bit of padding at end

  const translateX = -(maxTranslate * progress.value)

  // Apply a smooth spring-like transform using CSS or just direct apply (since we're scrolling, direct apply is fine but with a tiny transition for smoothing)
  trackRef.value.style.transform = `translate3d(${translateX}px, 0, 0)`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // Initial calculation
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

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
