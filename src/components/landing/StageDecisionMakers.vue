<script setup lang="ts">
import StageDeepDive from '@/components/landing/StageDeepDive.vue'

const stage = {
  id: 'decision-makers',
  number: '03',
  name: 'Decision Makers',
  title: 'Verified contacts with confidence scores',
  description:
    'Using the target role and company domain, the system queries Hunter, Apollo, and fallback sources to find the right people. Each contact includes email verification status, confidence score, and source attribution so you know exactly how reliable the data is.',
  input: 'Company domain + target role (e.g., "VP Engineering")',
  process: 'Multi-source lookup (Hunter, Apollo, fallback) with email verification and confidence scoring',
  output: 'Primary + secondary contacts: name, title, verified email, confidence % (0–100), LinkedIn URL, source',
  features: [
    'Multi-provider lookup with automatic fallback',
    'Email verification with confidence scoring',
    'Primary contact auto-identified',
    'LinkedIn profile links included',
    'Source transparency (Hunter/Apollo/fallback)',
  ],
  metric: { value: '92%', label: 'Email validity rate' },
  visualBg: 'oklch(0.9 0.015 30)',
  visualImage: '/images/preview-decision-makers.svg',
  visualAlt: 'Contact card showing name, title, email with 94% confidence badge, LinkedIn icon, source tag "Hunter", and primary indicator',
}
</script>

<template>
  <StageDeepDive :stage="stage" />
</template>