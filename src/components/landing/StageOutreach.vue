<script setup lang="ts">
import StageDeepDive from '@/components/landing/StageDeepDive.vue'

const stage = {
  id: 'outreach',
  number: '04',
  name: 'Outreach',
  title: 'Outreach that sounds like you wrote it',
  description:
    'Combining research, pain points, and decision maker context, the AI generates personalized email sequences and LinkedIn messages. Each draft includes a validation score checking for personalization, length, spam triggers, and reply-optimized structure. Edit, approve, regenerate, and send directly from the platform.',
  tags: ['Personalized', 'Multi-channel'],
  features: [
    'Email + LinkedIn variants in one generation',
    'Validation score with actionable feedback',
    'One-click send with delivery tracking',
    'Tone presets (direct, consultative, casual)',
  ],
  metric: { value: '3.2x', label: 'Reply rate vs generic templates' },
  visualImage: '/images/preview-outreach.svg',
  visualAlt: 'Email draft preview showing subject line, personalized body with company-specific references, validation score 87/100, and LinkedIn message variant tab',
}
</script>

<template>
  <StageDeepDive :stage="stage" reverse />
</template>