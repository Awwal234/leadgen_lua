<script setup lang="ts">
import type { LeadStatus } from '@/types'
import { LEAD_STATUS_LABELS } from '@/types'

const props = defineProps<{
  status: LeadStatus
}>()

const colors: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  RESEARCHED: 'bg-purple-100 text-purple-700',
  CONTACT_FOUND: 'bg-green-100 text-green-700',
  OUTREACH_READY: 'bg-orange-100 text-orange-700',
  SENT: 'bg-teal-100 text-teal-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
}
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
    :class="colors[props.status]"
  >
    {{ LEAD_STATUS_LABELS[props.status] }}
  </span>
</template>
