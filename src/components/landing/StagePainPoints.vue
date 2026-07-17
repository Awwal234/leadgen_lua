<script setup lang="ts">
import StageDeepDive from '@/components/landing/StageDeepDive.vue'

const stage = {
  id: 'pain-points',
  number: '02',
  name: 'Pain Points',
  title: 'Pain points with evidence, not guesses',
  description:
    'The AI analyzes research output against your product context to identify specific challenges the target company faces. Each pain point includes supporting evidence — a news snippet, job posting requirement, or tech gap — so your outreach references something real.',
  input: 'Research output + your product description',
  process: 'LLM maps company signals to problem categories, scores urgency, extracts verbatim evidence citations',
  output: 'Ranked pain points with title, description, urgency (high/med/low), evidence quote, and source link',
  features: [
    'Evidence-backed pain points with source citations',
    'Urgency scoring for prioritization',
    'Product-aware analysis (you provide context)',
    'Categorized by problem type (growth, ops, tech, etc.)',
    'Exportable for sales enablement',
  ],
  metric: { value: '5–8', label: 'High-confidence pain points per account' },
  visualBg: 'oklch(0.93 0.015 150)',
  visualImage: '/images/preview-pain-points.svg',
  visualAlt: 'Pain point cards showing title, urgency badge, description, evidence snippet with source link, and relevance signal',
}
</script>

<template>
  <StageDeepDive :stage="stage" reverse />
</template>