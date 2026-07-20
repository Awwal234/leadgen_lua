<script setup lang="ts">
import StageDeepDive from '@/components/landing/StageDeepDive.vue'

const stage = {
  id: 'pain-points',
  number: '02',
  name: 'Pain Points',
  title: 'Pain points with evidence, not guesses',
  description:
    'The AI analyzes research output against your product context to identify specific challenges the target company faces. Each pain point includes supporting evidence — a news snippet, job posting requirement, or tech gap — so your outreach references something real.',
  tags: ['Urgency scoring', 'Evidence-backed'],
  features: [
    'Evidence-backed pain points with source citations',
    'Urgency scoring for prioritization',
    'Product-aware analysis (you provide context)',
    'Categorized by problem type',
  ],
  metric: { value: '5–8', label: 'High-confidence pain points per account' },
  visualImage: '/images/preview-pain-points.svg',
  visualAlt: 'Pain point cards showing title, urgency badge, description, evidence snippet with source link, and relevance signal',
}
</script>

<template>
  <StageDeepDive :stage="stage" reverse />
</template>