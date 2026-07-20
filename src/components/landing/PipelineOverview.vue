<template>
  <section id="how-it-works" ref="sectionRef" class="relative bg-[#fafafa]" style="height: 500vh;"
    aria-labelledby="pipeline-heading">
    <div ref="stickyRef" class="sticky top-0 h-screen w-full flex flex-col justify-center">
      <header class="text-center w-full max-w-[580px] mx-auto mb-6 px-6 shrink-0 mt-12">
        <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">Pipeline</p>
        <h2 id="pipeline-heading"
          class="text-[clamp(1.5rem,2.5vw+0.75rem,2rem)] font-bold tracking-[-0.04em] leading-tight text-gray-900 mb-2">
          From company name to send-ready outreach</h2>
        <p class="text-[14px] md:text-[15px] text-gray-500 font-medium tracking-[-0.01em] leading-snug">
          Five integrated stages. One AI-powered workflow.</p>
      </header>

      <div class="w-full overflow-hidden pb-8 md:pb-12 flex-1 flex">
        <div ref="trackRef" class="flex gap-5 md:gap-8 px-[8vw] md:px-[12vw] w-max will-change-transform my-auto" role="list"
          aria-label="Pipeline stages">
          <article v-for="(stage, index) in stages" :key="stage.id"
            class="w-[82vw] sm:w-[360px] lg:w-[400px] bg-white rounded-2xl p-5 md:p-6 text-center flex flex-col shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.02)]"
            role="listitem">
            <div
              class="w-8 h-8 mx-auto mb-3 flex items-center justify-center text-[11px] font-bold bg-amber-50 border border-amber-200/50 rounded-xl">
              <span class="tracking-[-0.02em] text-amber-700">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="flex flex-wrap gap-1.5 justify-center mb-3">
              <span v-for="tag in stage.tags" :key="tag"
                class="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/30 text-[9px] font-semibold text-amber-600/70 uppercase tracking-[0.12em] leading-none">
                {{ tag }}
              </span>
            </div>
            <h3 class="text-[16px] font-bold tracking-[-0.02em] text-gray-900 mb-2">{{ stage.name }}</h3>
            <p class="text-[13px] text-gray-500 mb-4 leading-snug font-medium">{{ stage.description }}</p>

            <img :src="stage.previewImage" :alt="stage.previewAlt" class="w-full max-h-32 object-cover rounded-lg mb-4 border border-gray-100/60" loading="lazy" />

            <ul class="list-none p-0 m-0 text-left space-y-1.5">
              <li v-for="output in stage.outputs" :key="output"
                class="flex items-start gap-2 text-[12px] text-gray-500 leading-snug font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  class="shrink-0 mt-0.5 text-amber-400" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ output }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const stickyRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

let ticking = false

function updateScroll() {
  if (!sectionRef.value || !trackRef.value || !stickyRef.value) return

  const section = sectionRef.value
  const track = trackRef.value
  const sticky = stickyRef.value

  const rect = section.getBoundingClientRect()
  const sectionTop = rect.top
  const sectionHeight = rect.height
  const viewportHeight = window.innerHeight

  const scrollable = sectionHeight - viewportHeight
  if (scrollable <= 0) return

  const progress = Math.max(0, Math.min(1, -sectionTop / scrollable))
  const trackWidth = track.scrollWidth
  const viewportWidth = sticky.offsetWidth
  const maxTranslate = Math.max(0, trackWidth - viewportWidth)

  const translate = -progress * maxTranslate

  track.style.transform = `translate3d(${translate}px, 0, 0)`

  ticking = false
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateScroll)
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const stages = [
  {
    id: 'research',
    name: 'Research',
    description: 'Give us a company name. We research web, news, job postings, funding, and tech stack.',
    tags: ['Instant', 'AI-powered'],
    previewImage: '/images/preview-research.svg',
    previewAlt: 'Research output showing company summary, industry, tech stack, recent news, and job signals',
    outputs: [
      'Company summary & industry',
      'Tech stack & employee count',
      'Recent news & funding',
      'Job posting signals',
    ],
  },
  {
    id: 'pain-points',
    name: 'Pain Points',
    description: 'AI analyzes research to identify urgent challenges with evidence from real sources.',
    tags: ['Urgency', 'Evidence'],
    previewImage: '/images/preview-pain-points.svg',
    previewAlt: 'Pain point cards with title, urgency badge, description, and supporting evidence',
    outputs: [
      'Ranked pain points by urgency',
      'Evidence-backed descriptions',
      'Relevant signals mapped',
      'Priority scoring',
    ],
  },
  {
    id: 'decision-makers',
    name: 'Decision Makers',
    description: 'Find the right contacts with verified emails, LinkedIn, and confidence scores.',
    tags: ['Verified', '92% accuracy'],
    previewImage: '/images/preview-decision-makers.svg',
    previewAlt: 'Contact card with title, email with confidence score, LinkedIn, and source',
    outputs: [
      'Verified email addresses',
      'LinkedIn profiles',
      'Confidence scores (0–100%)',
      'Source attribution',
    ],
  },
  {
    id: 'outreach',
    name: 'Outreach',
    description: 'Generate personalized email sequences and LinkedIn messages ready to send.',
    tags: ['Personalized', 'Multi-channel'],
    previewImage: '/images/preview-outreach.svg',
    previewAlt: 'Email draft with subject line, body, personalization tokens, and LinkedIn message variant',
    outputs: [
      'Email subject + body',
      'LinkedIn connection note',
      'Follow-up sequence',
      'Validation score',
    ],
  },
  {
    id: 'send',
    name: 'Send',
    description: 'Deliver your outreach directly from the platform with one click. Track opens, replies, and follow up automatically.',
    tags: ['One-click', 'Tracked'],
    previewImage: '/images/preview-send.svg',
    previewAlt: 'Send interface showing email compose, send button, delivery status indicators, and open/reply tracking',
    outputs: [
      'One-click send to inbox',
      'Delivery & open tracking',
      'Auto follow-up sequences',
      'Reply detection & alerts',
    ],
  },
]
</script>
