<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'
import type {
  LeadDetail,
  ResearchRun,
  PainPoint,
  DecisionMaker,
  OutreachDraft,
  SentEmail,
} from '@/types'
import { LEAD_STATUS_LABELS, LEAD_STATUS_ORDER } from '@/types'
import StatusBadge from '@/components/StatusBadge.vue'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const leadId = route.params.leadId as string

const lead = ref<LeadDetail | null>(null)
const expandedSummaries = ref(new Set<string>())

function toggleSummary(runId: string) {
  if (expandedSummaries.value.has(runId)) {
    expandedSummaries.value.delete(runId)
  } else {
    expandedSummaries.value.add(runId)
  }
}
const loading = ref(true)

// Pipeline sections
const activeSection = ref<'research' | 'pain-points' | 'decision-makers' | 'outreach' | 'send'>(
  'research',
)

// Research
const researchRuns = ref<ResearchRun[]>([])
const researchLoading = ref(false)
const resolvingResearch = ref(false)
const showResearchForm = ref(false)
const manualResearch = ref({ summary: '', website: '' })

// Pain Points
const painPoints = ref<PainPoint[]>([])
const painPointsLoading = ref(false)
const resolvingPainPoints = ref(false)
const showPainPointForm = ref(false)
const ourProduct = ref('')
const manualPainPoint = ref({
  title: '',
  description: '',
  evidence: '',
  urgency: 'medium' as const,
  relevantSignal: '',
})

// Decision Makers
const decisionMakers = ref<DecisionMaker[]>([])
const dmLoading = ref(false)
const resolvingDM = ref(false)
const showDMForm = ref(false)
const companyDomain = ref('')
const isPrimary = ref(true)
const manualDM = ref({ name: '', title: '', linkedInUrl: '', isPrimary: false })

// Outreach
const outreachDrafts = ref<OutreachDraft[]>([])
const outreachLoading = ref(false)
const resolvingOutreach = ref(false)
const showOutreachForm = ref(false)
const senderName = ref('')
const senderCompany = ref('')
const tone = ref('conversational')
const manualOutreach = ref({ emailBody: '', linkedinBody: '', emailSubject: '' })

// Send Outreach
const sentEmails = ref<SentEmail[]>([])
const sentEmailsLoading = ref(false)
const sending = ref(false)
const selectedDraftId = ref('')
const fromEmail = ref('')
const fromName = ref('')
const fromTitle = ref('')
const toEmail = ref('')

const statusIndex = computed(() => {
  if (!lead.value) return 0
  return LEAD_STATUS_ORDER.indexOf(lead.value.status)
})

const primaryDM = computed(() => {
  return decisionMakers.value.find((d) => d.isPrimary) || decisionMakers.value[0]
})

watch(decisionMakers, (dms) => {
  if (dms.length > 0 && !toEmail.value) {
    const dm = dms.find((d) => d.isPrimary) || dms[0]
    if (dm?.email) toEmail.value = dm.email
  }
}, { immediate: true })

async function fetchLead() {
  loading.value = true
  try {
    const res = await api.get(`/api/leads/${leadId}`)
    lead.value = res.data.data || res.data
    if (lead.value?.domain) companyDomain.value = lead.value.domain
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to load lead'))
    router.push('/app')
  } finally {
    loading.value = false
  }
}

async function fetchResearch() {
  researchLoading.value = true
  try {
    const res = await api.get(`/api/leads/${leadId}/research-runs`)
    researchRuns.value = res.data.data || res.data
  } catch {
    // ignore
  } finally {
    researchLoading.value = false
  }
}

async function fetchPainPoints() {
  painPointsLoading.value = true
  try {
    const res = await api.get(`/api/leads/${leadId}/pain-points`)
    painPoints.value = res.data.data || res.data
  } catch {
    // ignore
  } finally {
    painPointsLoading.value = false
  }
}

async function fetchDecisionMakers() {
  dmLoading.value = true
  try {
    const res = await api.get(`/api/leads/${leadId}/decision-makers`)
    decisionMakers.value = res.data.data || res.data
  } catch {
    // ignore
  } finally {
    dmLoading.value = false
  }
}

async function fetchOutreach() {
  outreachLoading.value = true
  try {
    const res = await api.get(`/api/leads/${leadId}/outreach-drafts`)
    outreachDrafts.value = res.data.data || res.data
  } catch {
    // ignore
  } finally {
    outreachLoading.value = false
  }
}

function loadSectionData(section: string) {
  if (section === 'research') fetchResearch()
  else if (section === 'pain-points') fetchPainPoints()
  else if (section === 'decision-makers') fetchDecisionMakers()
  else if (section === 'outreach') fetchOutreach()
  else if (section === 'send') fetchSentEmails()
}

async function handleResolveResearch() {
  resolvingResearch.value = true
  try {
    await api.post(`/api/leads/${leadId}/resolve-research`)
    toast.success('Research Complete', 'Company research has been completed')
    await Promise.all([fetchResearch(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to resolve research'))
  } finally {
    resolvingResearch.value = false
  }
}

async function handleSaveResearch() {
  if (!manualResearch.value.summary) {
    toast.warn('Validation', 'Summary is required')
    return
  }
  try {
    await api.post(`/api/leads/${leadId}/research-runs`, {
      summary: manualResearch.value.summary,
      website: manualResearch.value.website || undefined,
    })
    toast.success('Saved', 'Research saved')
    showResearchForm.value = false
    manualResearch.value = { summary: '', website: '' }
    await Promise.all([fetchResearch(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to save'))
  }
}

async function handleResolvePainPoints() {
  if (!ourProduct.value) {
    toast.warn('Missing', 'Please provide your product context')
    return
  }
  resolvingPainPoints.value = true
  try {
    await api.post(`/api/leads/${leadId}/resolve-pain-points`, {
      ourProduct: ourProduct.value,
    })
    toast.success('Pain Points Resolved', 'Pain points analyzed')
    await Promise.all([fetchPainPoints(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to resolve pain points'))
  } finally {
    resolvingPainPoints.value = false
  }
}

async function handleSavePainPoint() {
  if (!manualPainPoint.value.title || !manualPainPoint.value.description) {
    toast.warn('Validation', 'Title and description are required')
    return
  }
  try {
    await api.post(`/api/leads/${leadId}/pain-points`, {
      items: [manualPainPoint.value],
    })
    toast.success('Saved', 'Pain point saved')
    showPainPointForm.value = false
    manualPainPoint.value = {
      title: '',
      description: '',
      evidence: '',
      urgency: 'medium',
      relevantSignal: '',
    }
    await Promise.all([fetchPainPoints(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to save'))
  }
}

async function handleResolveDM() {
  if (!lead.value?.domain) {
    toast.warn('Missing', 'Lead is missing a domain')
    return
  }
  resolvingDM.value = true
  try {
    await api.post(`/api/leads/${leadId}/resolve-decision-maker`, {
      companyDomain: lead.value.domain,
      targetRole: lead.value?.targetRole || undefined,
      isPrimary: isPrimary.value,
    })
    toast.success('Decision Maker Found', 'Contact information retrieved')
    await Promise.all([fetchDecisionMakers(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to find decision maker'))
  } finally {
    resolvingDM.value = false
  }
}

async function handleSaveDM() {
  if (!manualDM.value.name && !manualDM.value.linkedInUrl) {
    toast.warn('Validation', 'Name or LinkedIn URL is required')
    return
  }
  const payload: Record<string, unknown> = {
    name: manualDM.value.name,
    title: manualDM.value.title || undefined,
    isPrimary: manualDM.value.isPrimary,
    source: 'fallback',
    emailConfidence: null,
  }
  let url = manualDM.value.linkedInUrl.trim()
  if (!url) {
    toast.warn('Validation', 'LinkedIn URL is required')
    return
  }
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }
  payload.linkedInUrl = url
  try {
    await api.post(`/api/leads/${leadId}/decision-makers`, payload)
    toast.success('Saved', 'Decision maker saved')
    showDMForm.value = false
    manualDM.value = { name: '', title: '', linkedInUrl: '', isPrimary: false }
    await Promise.all([fetchDecisionMakers(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to save'))
  }
}

async function handleResolveOutreach() {
  if (!senderName.value || !senderCompany.value || !ourProduct.value) {
    toast.warn('Missing', 'Please fill in sender name, company, and product context')
    return
  }
  const primaryDM = decisionMakers.value.find((d) => d.isPrimary) || decisionMakers.value[0]
  resolvingOutreach.value = true
  try {
    await api.post(`/api/leads/${leadId}/resolve-outreach`, {
      decisionMakerId: primaryDM?.id || undefined,
      senderName: senderName.value,
      senderCompany: senderCompany.value,
      ourProduct: ourProduct.value,
      tone: tone.value,
    })
    toast.success('Outreach Generated', 'Email and LinkedIn drafts ready')
    await Promise.all([fetchOutreach(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to generate outreach'))
  } finally {
    resolvingOutreach.value = false
  }
}

async function handleSaveOutreach() {
  if (!manualOutreach.value.emailBody && !manualOutreach.value.linkedinBody) {
    toast.warn('Validation', 'Email or LinkedIn body is required')
    return
  }
  try {
    await api.post(`/api/leads/${leadId}/outreach-drafts`, manualOutreach.value)
    toast.success('Saved', 'Outreach draft saved')
    showOutreachForm.value = false
    manualOutreach.value = { emailBody: '', linkedinBody: '', emailSubject: '' }
    await Promise.all([fetchOutreach(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to save'))
  }
}

async function fetchSentEmails() {
  sentEmailsLoading.value = true
  try {
    const res = await api.get(`/api/leads/${leadId}/sent-emails`)
    sentEmails.value = res.data.data || res.data
  } catch {
    // ignore
  } finally {
    sentEmailsLoading.value = false
  }
}

async function handleSendOutreach() {
  if (!selectedDraftId.value) {
    toast.warn('Validation', 'Please select an outreach draft to send')
    return
  }
  if (!fromEmail.value) {
    toast.warn('Validation', 'Please enter a from email address')
    return
  }
  if (!fromName.value) {
    toast.warn('Validation', 'Please enter your name')
    return
  }
  if (!fromTitle.value) {
    toast.warn('Validation', 'Please enter your title')
    return
  }
  if (!toEmail.value) {
    toast.warn('Validation', 'Please enter the recipient email')
    return
  }
  sending.value = true
  try {
    await api.post(`/api/leads/${leadId}/send-outreach`, {
      outreachDraftId: selectedDraftId.value,
      from: fromEmail.value,
      to: toEmail.value,
      fromName: fromName.value,
      fromTitle: fromTitle.value,
    })
    toast.success('Email Sent', 'Outreach email has been sent via SendByte')
    await Promise.all([fetchSentEmails(), fetchLead()])
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to send email'))
  } finally {
    sending.value = false
  }
}

function getStepStatus(stepIndex: number): 'completed' | 'current' | 'pending' {
  const current = statusIndex.value
  if (stepIndex < current) return 'completed'
  if (stepIndex === current) return 'current'
  return 'pending'
}

function selectSection(
  section: 'research' | 'pain-points' | 'decision-makers' | 'outreach' | 'send',
) {
  activeSection.value = section
  loadSectionData(section)
}

onMounted(async () => {
  await fetchLead()
  await fetchDecisionMakers()
  if (authStore.user?.name) {
    senderName.value = authStore.user.name
    fromName.value = authStore.user.name
  }
  if (authStore.user?.company_name) senderCompany.value = authStore.user.company_name
  if (authStore.user?.email) fromEmail.value = authStore.user.email
  if (authStore.user?.title) fromTitle.value = authStore.user.title
  loadSectionData('research')
})
</script>

<template>
  <div v-if="lead" class="lead-detail-page max-w-6xl w-full min-w-0 mx-auto overflow-x-hidden">
    <!-- Lead header -->
    <div class="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 mb-4 sm:mb-6 shadow-sm">
      <div class="flex items-start justify-between gap-3 min-w-0">
        <div class="min-w-0 max-w-full flex-1">
          <div class="flex items-center gap-2.5 flex-wrap">
            <h1 class="text-[22px] sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight break-words">
              {{ lead.company }}
            </h1>
            <StatusBadge :status="lead.status" />
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-2">
            <span v-if="lead.domain" class="text-sm text-gray-500 break-all">{{ lead.domain }}</span>
            <span v-if="lead.domain && lead.targetRole" class="hidden sm:inline text-gray-300">·</span>
            <span v-if="lead.targetRole" class="text-sm text-gray-500">{{ lead.targetRole }}</span>
            <span class="text-sm text-gray-400">{{ new Date(lead.createdAt).toLocaleDateString() }}</span>
          </div>
          <p v-if="lead.notes"
            class="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3.5 leading-relaxed break-words">
            {{ lead.notes }}
          </p>
        </div>
      </div>

      <!-- Status progress -->
      <div class="mt-5 sm:mt-6">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <template v-for="(s, i) in LEAD_STATUS_ORDER.filter((st) => st !== 'ARCHIVED')" :key="s">
            <div class="flex items-center gap-1.5">
              <div v-if="getStepStatus(i) === 'completed'"
                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div v-else-if="getStepStatus(i) === 'current'"
                class="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                <span class="text-[9px] font-semibold text-white">{{ i + 1 }}</span>
              </div>
              <div v-else class="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0" />
              <span class="text-xs font-medium transition-colors duration-200"
                :class="{
                  'text-green-700': getStepStatus(i) === 'completed',
                  'text-gray-900': getStepStatus(i) === 'current',
                  'text-gray-400': getStepStatus(i) === 'pending',
                }">
                {{ LEAD_STATUS_LABELS[s] }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Pipeline tabs -->
    <div class="mb-5 sm:mb-6 max-w-full overflow-hidden border-b border-gray-200">
      <div class="grid max-w-full min-w-0 grid-cols-2 min-[420px]:grid-cols-3 sm:flex sm:flex-wrap gap-1">
        <button v-for="tab in [
          { key: 'research', label: 'Research', short: 'Research', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { key: 'pain-points', label: 'Pain Points', short: 'Pain Pts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
          { key: 'decision-makers', label: 'Decision Makers', short: 'DMs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
          { key: 'outreach', label: 'Outreach', short: 'Outreach', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { key: 'send', label: 'Send', short: 'Send', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        ] as const" :key="tab.key" @click="selectSection(tab.key)"
          class="relative flex min-w-0 items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-3 text-[13px] sm:text-sm font-medium transition-colors"
          :class="activeSection === tab.key
            ? 'text-gray-900'
            : 'text-gray-400 hover:text-gray-600'
            ">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
          </svg>
          <span class="min-w-0 truncate sm:hidden">{{ tab.short }}</span>
          <span class="hidden min-w-0 sm:inline">{{ tab.label }}</span>
          <div v-if="activeSection === tab.key"
            class="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-4 h-0.5 bg-gray-900 rounded-full" />
        </button>
      </div>
    </div>

    <!-- Section: Research -->
    <div v-if="activeSection === 'research'" class="space-y-3 sm:space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Research History</h2>
        <div class="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
          <button @click="showResearchForm = !showResearchForm"
            class="h-10 sm:h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            Manual Entry
          </button>
          <button @click="handleResolveResearch" :disabled="resolvingResearch"
            class="h-10 sm:h-9 px-3 sm:px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <svg v-if="resolvingResearch" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="hidden sm:inline">{{ resolvingResearch ? 'Researching...' : 'Resolve Research' }}</span>
            <span class="sm:hidden">{{ resolvingResearch ? 'Resolving...' : 'Resolve' }}</span>
          </button>
        </div>
      </div>

      <!-- Manual research form -->
      <div v-if="showResearchForm" class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4 space-y-3">
        <input v-model="manualResearch.summary" type="text" placeholder="Research summary"
          class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        <input v-model="manualResearch.website" type="text" placeholder="Website URL"
          class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        <button @click="handleSaveResearch"
          class="h-11 px-5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors w-full sm:w-auto">
          Save
        </button>
      </div>

      <!-- Research list -->
      <div v-if="researchLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="bg-white rounded-2xl border border-gray-200/80 p-5 animate-pulse shadow-sm">
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-3" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div v-else-if="researchRuns.length === 0"
        class="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-10 text-center shadow-sm">
        <div class="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-sm text-gray-500">No research runs yet</p>
        <p class="text-xs text-gray-400 mt-1">Click "Resolve Research" to auto-research or add manually.</p>
      </div>
      <div v-else class="space-y-3 min-w-0 max-w-full">
        <div v-for="run in researchRuns" :key="run.id"
          class="min-w-0 max-w-full overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm">
          <div
            class="flex flex-col min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between gap-2 mb-3">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ run.rawResearch?.company || lead.company }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">{{ new Date(run.createdAt).toLocaleString() }}</p>
            </div>
            <span v-if="run.industry"
              class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium self-start break-words">{{
                run.industry
              }}</span>
          </div>

          <!-- Links -->
          <div v-if="run.website || run.linkedInUrl" class="flex flex-wrap items-center gap-3 mb-3">
            <a v-if="run.website" :href="run.website" target="_blank"
              class="inline-flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Website
            </a>
            <a v-if="run.linkedInUrl" :href="run.linkedInUrl" target="_blank"
              class="inline-flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              LinkedIn
            </a>
          </div>

          <div v-if="run.summary" class="min-w-0 max-w-full">
            <p class="text-sm text-gray-600 leading-relaxed wrap-anywhere"
              :class="{ 'line-clamp-3': !expandedSummaries.has(run.id) }">
              {{ run.summary }}
            </p>
            <button @click="toggleSummary(run.id)" class="text-xs text-blue-600 font-medium hover:underline mt-1">
              {{ expandedSummaries.has(run.id) ? 'Show less' : 'Show more' }}
            </button>
          </div>

          <!-- Funding info -->
          <div v-if="run.fundingInfo?.lastRound || run.fundingInfo?.amount"
            class="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs text-gray-600">
            <span v-if="run.fundingInfo?.lastRound"
              class="px-2 py-0.5 bg-green-50 text-green-700 rounded-md font-medium wrap-anywhere">{{
                run.fundingInfo.lastRound }}</span>
            <span v-if="run.fundingInfo?.amount" class="wrap-anywhere">{{ run.fundingInfo.amount }}</span>
          </div>

          <!-- Tech stack -->
          <div v-if="run.techStack && run.techStack.length" class="flex flex-wrap gap-1.5 mt-3">
            <span v-for="tech in run.techStack" :key="tech"
              class="min-w-0 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs wrap-anywhere">{{ tech }}</span>
          </div>

          <!-- Job postings -->
          <div v-if="run.jobPostings && run.jobPostings.length" class="mt-4">
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Active Job Postings ({{ run.jobPostings.length }})
            </p>
            <div class="space-y-1.5 max-h-48 overflow-y-auto apple-scroll">
              <div v-for="job in run.jobPostings.slice(0, 10)" :key="job.title + job.location"
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between p-2.5 bg-gray-50 rounded-xl text-xs gap-2">
                <div class="min-w-0 max-w-full">
                  <p class="font-medium text-gray-900 wrap-anywhere">{{ job.title }}</p>
                  <p class="text-gray-500 mt-0.5 wrap-anywhere">
                    {{ [job.department, job.location].filter(Boolean).join(' · ') }}
                  </p>
                </div>
                <div v-if="job.signals?.length" class="flex flex-wrap gap-1 sm:shrink-0">
                  <span v-for="sig in job.signals.slice(0, 2)" :key="sig"
                    class="min-w-0 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded wrap-anywhere">{{ sig }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent news -->
          <div v-if="run.recentNews && run.recentNews.length" class="mt-4">
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent News</p>
            <div class="space-y-2">
              <a v-for="news in run.recentNews.slice(0, 3)" :key="news.url" :href="news.url" target="_blank"
                class="block p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <p class="text-sm font-medium text-gray-900 leading-snug wrap-anywhere">{{ news.title }}</p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-2 wrap-anywhere">{{ news.snippet }}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Pain Points -->
    <div v-if="activeSection === 'pain-points'" class="space-y-3 sm:space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Pain Points</h2>
        <div class="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
          <button @click="showPainPointForm = !showPainPointForm"
            class="h-10 sm:h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            Manual Entry
          </button>
          <button @click="handleResolvePainPoints" :disabled="resolvingPainPoints"
            class="h-10 sm:h-9 px-3 sm:px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <svg v-if="resolvingPainPoints" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="hidden sm:inline">{{ resolvingPainPoints ? 'Analyzing...' : 'Resolve Pain Points' }}</span>
            <span class="sm:hidden">{{ resolvingPainPoints ? 'Resolving...' : 'Resolve' }}</span>
          </button>
        </div>
      </div>

      <!-- Product context input -->
      <div class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4">
        <label class="block text-xs font-semibold text-gray-500 mb-2">Your Product Context <span
            class="text-red-500">*</span></label>
        <input v-model="ourProduct" type="text" placeholder="e.g., AI-powered sales automation platform"
          class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        <p class="text-xs text-gray-400 mt-1.5">
          Required for AI to identify relevant pain points
        </p>
      </div>

      <div v-if="showPainPointForm" class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input v-model="manualPainPoint.title" type="text" placeholder="Pain point title"
            class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
          <select v-model="manualPainPoint.urgency"
            class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 bg-white transition-all">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <textarea v-model="manualPainPoint.description" rows="2" placeholder="Description"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 resize-none transition-all" />
        <input v-model="manualPainPoint.relevantSignal" type="text" placeholder="Relevant signal"
          class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        <button @click="handleSavePainPoint"
          class="h-11 px-5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors w-full sm:w-auto">
          Save Pain Point
        </button>
      </div>

      <div v-if="painPointsLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="bg-white rounded-2xl border border-gray-200/80 p-5 animate-pulse shadow-sm">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div class="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div v-else-if="painPoints.length === 0"
        class="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-10 text-center shadow-sm">
        <p class="text-sm text-gray-500">No pain points identified yet.</p>
      </div>
      <div v-else class="space-y-3 min-w-0 max-w-full">
        <div v-for="pp in painPoints" :key="pp.id"
          class="min-w-0 max-w-full overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm">
          <div class="flex flex-col min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between gap-2">
            <h3 class="text-sm font-semibold text-gray-900 wrap-anywhere">{{ pp.title }}</h3>
            <span class="px-2 py-0.5 rounded-md text-xs font-medium shrink-0" :class="pp.urgency === 'high'
              ? 'bg-red-50 text-red-700'
              : pp.urgency === 'medium'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-green-50 text-green-700'
              ">{{ pp.urgency }}</span>
          </div>
          <p class="text-sm text-gray-600 mt-2 leading-relaxed wrap-anywhere">{{ pp.description }}</p>
          <p v-if="pp.relevantSignal" class="text-xs text-gray-400 mt-2 italic wrap-anywhere">
            Signal: {{ pp.relevantSignal }}
          </p>
        </div>
      </div>
    </div>

    <!-- Section: Decision Makers -->
    <div v-if="activeSection === 'decision-makers'" class="space-y-3 sm:space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Decision Makers</h2>
        <div class="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
          <button @click="showDMForm = !showDMForm"
            class="h-10 sm:h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            Manual Entry
          </button>
          <button @click="handleResolveDM" :disabled="resolvingDM"
            class="h-10 sm:h-9 px-3 sm:px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <svg v-if="resolvingDM" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="hidden sm:inline">{{ resolvingDM ? 'Searching...' : 'Find Decision Maker' }}</span>
            <span class="sm:hidden">{{ resolvingDM ? 'Searching...' : 'Find DM' }}</span>
          </button>
        </div>
      </div>

      <!-- Company domain -->
      <div class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4">
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span class="text-gray-500">Domain:</span>
          <code class="min-w-0 max-w-full bg-white px-2 py-0.5 rounded-md text-gray-900 font-mono text-xs break-all">{{
            lead?.domain || '—' }}</code>
          <span v-if="lead?.domain" class="text-green-600 text-xs font-medium">Auto-filled</span>
        </div>
      </div>

      <div v-if="showDMForm" class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input v-model="manualDM.name" type="text" placeholder="Name"
            class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
          <input v-model="manualDM.title" type="text" placeholder="Title"
            class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        </div>
        <input v-model="manualDM.linkedInUrl" type="url" placeholder="LinkedIn URL"
          class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        <label class="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" v-model="manualDM.isPrimary" class="w-4 h-4 rounded border-gray-300" />
          Primary contact
        </label>
        <button @click="handleSaveDM"
          class="h-11 px-5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors w-full sm:w-auto">
          Save
        </button>
      </div>

      <div v-if="dmLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="bg-white rounded-2xl border border-gray-200/80 p-5 animate-pulse shadow-sm">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div class="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div v-else-if="decisionMakers.length === 0"
        class="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-10 text-center shadow-sm">
        <p class="text-sm text-gray-500">No decision makers found yet.</p>
      </div>
      <div v-else class="space-y-3 min-w-0 max-w-full">
        <div v-for="dm in decisionMakers" :key="dm.id"
          class="min-w-0 max-w-full overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm"
          :class="{ 'border-green-200/80 bg-green-50/20': dm.isPrimary }">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <span class="text-sm font-semibold text-gray-500">{{ dm.name?.charAt(0) || '?' }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div class="min-w-0 max-w-full">
                  <h3 class="text-sm font-semibold text-gray-900 wrap-anywhere">{{ dm.name || 'Unknown' }}</h3>
                  <p class="text-xs text-gray-400 mt-0.5 wrap-anywhere">{{ dm.title || '—' }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <span v-if="dm.isPrimary"
                    class="px-2 py-0.5 bg-green-50 text-green-700 rounded-md text-xs font-medium">Primary</span>
                  <span class="text-xs text-gray-400 wrap-anywhere">{{ dm.source }}</span>
                </div>
              </div>
              <div v-if="dm.email" class="mt-2.5 flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
                <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                </svg>
                <span class="break-all">{{ dm.email }}</span>
                <span v-if="dm.emailConfidence" class="text-xs text-gray-400 shrink-0">({{ Math.round(dm.emailConfidence
                  *
                  100) }}%)</span>
              </div>
              <a v-if="dm.linkedInUrl" :href="dm.linkedInUrl" target="_blank"
                class="mt-2 inline-flex max-w-full items-center gap-1 text-sm text-blue-600 font-medium hover:underline wrap-anywhere">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Send Outreach -->
    <div v-if="activeSection === 'send'" class="space-y-3 sm:space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Send Outreach</h2>

      <!-- Send form -->
      <div class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4 space-y-3">
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-2">Select Outreach Draft <span
              class="text-red-500">*</span></label>
          <select v-model="selectedDraftId"
            class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 bg-white transition-all">
            <option value="">-- Select a draft --</option>
            <option v-for="draft in outreachDrafts" :key="draft.id" :value="draft.id">
              {{ draft.emailSubject || `Draft from ${new Date(draft.createdAt).toLocaleDateString()}` }}
            </option>
          </select>
          <p v-if="outreachDrafts.length === 0" class="text-xs text-amber-600 mt-1.5">
            No drafts available. Go to the Outreach tab first.
          </p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-2">To <span
              class="text-red-500">*</span></label>
          <input v-model="toEmail" type="email" placeholder="primary@decisionmaker.com"
            class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
          <p v-if="primaryDM?.email && primaryDM.email !== toEmail" class="text-xs text-gray-400 mt-1">
            Primary: {{ primaryDM.email }}
          </p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 mb-2">From Email <span
              class="text-red-500">*</span></label>
          <input v-model="fromEmail" type="email" placeholder="your@email.com"
            class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-2">Your Name <span
                class="text-red-500">*</span></label>
            <input v-model="fromName" type="text" placeholder="Jane Smith"
              class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-2">Your Title <span
                class="text-red-500">*</span></label>
            <input v-model="fromTitle" type="text" placeholder="VP of Sales"
              class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
          </div>
        </div>
        <button @click="handleSendOutreach" :disabled="sending"
          class="h-11 px-5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto">
          <svg v-if="sending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ sending ? 'Sending...' : 'Send Email' }}
        </button>
      </div>

      <!-- Sent email history -->
      <h3 class="text-sm font-semibold text-gray-900 mt-4 sm:mt-6">Sent Email History</h3>
      <div v-if="sentEmailsLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="bg-white rounded-2xl border border-gray-200/80 p-5 animate-pulse shadow-sm">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div class="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div v-else-if="sentEmails.length === 0"
        class="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-10 text-center shadow-sm">
        <p class="text-sm text-gray-500">No emails sent yet.</p>
      </div>
      <div v-else class="space-y-3 min-w-0 max-w-full">
        <div v-for="email in sentEmails" :key="email.id"
          class="min-w-0 max-w-full overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm"
          :class="email.success ? 'border-green-200/80' : 'border-red-200/80'">
          <div class="flex flex-col min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full shrink-0" :class="email.success ? 'bg-green-500' : 'bg-red-500'" />
                <p class="text-sm font-semibold text-gray-900 min-w-0 wrap-anywhere">{{ email.subject }}</p>
              </div>
              <p class="text-xs text-gray-400 mt-1.5 break-all">
                To: {{ email.to }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5 wrap-anywhere">
                {{ new Date(email.sentAt).toLocaleString() }}
              </p>
            </div>
            <span class="px-2 py-0.5 rounded-md text-xs font-medium self-start shrink-0"
              :class="email.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
              {{ email.success ? 'Sent' : 'Failed' }}
            </span>
          </div>
          <div v-if="email.error" class="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
            <p class="text-xs font-medium text-red-800 wrap-anywhere">{{ email.error.code }}</p>
            <p class="text-xs text-red-600 mt-0.5 break-all">{{ email.error.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Outreach -->
    <div v-if="activeSection === 'outreach'" class="space-y-3 sm:space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Outreach Drafts</h2>
        <div class="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:items-center">
          <button @click="showOutreachForm = !showOutreachForm"
            class="h-10 sm:h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            Manual Entry
          </button>
          <button @click="handleResolveOutreach" :disabled="resolvingOutreach"
            class="h-10 sm:h-9 px-3 sm:px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <svg v-if="resolvingOutreach" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="hidden sm:inline">{{ resolvingOutreach ? 'Generating...' : 'Generate Outreach' }}</span>
            <span class="sm:hidden">{{ resolvingOutreach ? 'Generating...' : 'Generate' }}</span>
          </button>
        </div>
      </div>

      <!-- Product context -->
      <div class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4">
        <label class="block text-xs font-semibold text-gray-500 mb-2">Your Product Context <span
            class="text-red-500">*</span></label>
        <input v-model="ourProduct" type="text" placeholder="e.g., AI-powered sales automation platform"
          class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        <p class="text-xs text-gray-400 mt-1.5">
          Shared with Pain Points section
        </p>
      </div>

      <!-- Sender info -->
      <div class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Your Name <span
                class="text-red-500">*</span></label>
            <input v-model="senderName" type="text" placeholder="Your name"
              class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5">Your Company <span
                class="text-red-500">*</span></label>
            <input v-model="senderCompany" type="text" placeholder="Your company"
              class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
          </div>
        </div>
      </div>

      <!-- Selected decision maker -->
      <div v-if="decisionMakers.length > 0" class="bg-green-50 rounded-2xl border border-green-200/80 p-4">
        <div class="flex items-center gap-2 text-sm text-green-800 font-medium">
          <svg class="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Primary Decision Maker
        </div>
        <div class="mt-3 flex items-center gap-3">
          <div class="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
            <span class="text-xs font-semibold text-green-700">{{ primaryDM?.name?.charAt(0) || '?' }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ primaryDM?.name || 'Unknown' }}</p>
            <p class="text-xs text-gray-500">{{ primaryDM?.title || '—' }}</p>
          </div>
        </div>
        <p v-if="primaryDM?.email"
          class="mt-2 text-xs text-green-700 bg-green-100/80 px-2.5 py-1 rounded-md inline-block font-medium break-all">
          {{ primaryDM.email }}
        </p>
      </div>
      <div v-else class="bg-amber-50 rounded-2xl border border-amber-200/80 p-4">
        <div class="flex items-start gap-2.5 text-sm text-amber-800">
          <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 3 1.732 3z" />
          </svg>
          <span>No decision makers yet. Go to the DMs tab first.</span>
        </div>
      </div>

      <!-- Tone selector -->
      <div class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4">
        <label class="block text-xs font-semibold text-gray-500 mb-2.5">Tone</label>
        <div class="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2">
          <button v-for="t in ['professional', 'conversational', 'direct'] as const" :key="t" @click="tone = t"
            class="flex-1 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all capitalize text-center"
            :class="tone === t
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 active:bg-gray-100'
              ">
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Manual form -->
      <div v-if="showOutreachForm" class="bg-gray-50 rounded-2xl border border-gray-200/80 p-4 space-y-3">
        <input v-model="manualOutreach.emailSubject" type="text" placeholder="Email subject"
          class="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all" />
        <textarea v-model="manualOutreach.emailBody" rows="4" placeholder="Email body"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 resize-none transition-all" />
        <textarea v-model="manualOutreach.linkedinBody" rows="3" placeholder="LinkedIn message"
          class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 resize-none transition-all" />
        <button @click="handleSaveOutreach"
          class="h-11 px-5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors w-full sm:w-auto">
          Save Draft
        </button>
      </div>

      <div v-if="outreachLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="bg-white rounded-2xl border border-gray-200/80 p-5 animate-pulse shadow-sm">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div class="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div v-else-if="outreachDrafts.length === 0"
        class="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-10 text-center shadow-sm">
        <p class="text-sm text-gray-500">No outreach drafts yet.</p>
        <p class="text-xs text-gray-400 mt-1">Fill in the context fields and generate one.</p>
      </div>
      <div v-else class="space-y-4 min-w-0 max-w-full">
        <div v-for="draft in outreachDrafts" :key="draft.id"
          class="min-w-0 max-w-full bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
          <!-- Email preview -->
          <div class="bg-gray-900 text-white px-4 sm:px-5 py-3 flex items-center justify-between">
            <span class="text-sm font-semibold">Email</span>
            <span class="text-xs bg-white/10 px-2.5 py-0.5 rounded-full shrink-0">{{ draft.emailWordCount }}
              words</span>
          </div>
          <div class="px-4 sm:px-5 py-3 border-b border-gray-100">
            <p class="text-sm wrap-anywhere">
              <span class="text-gray-400">Subject:</span>
              <span class="font-medium ml-1 wrap-anywhere">{{ draft.emailSubject || '(no subject)' }}</span>
            </p>
          </div>
          <div class="px-4 sm:px-5 py-4 bg-gray-50/30">
            <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed wrap-anywhere">
              {{ draft.emailBody }}
            </p>
          </div>

          <!-- LinkedIn preview -->
          <div class="bg-blue-600 text-white px-4 sm:px-5 py-3 flex items-center justify-between">
            <span class="text-sm font-semibold">LinkedIn</span>
            <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full shrink-0">{{ draft.linkedinWordCount }}
              words</span>
          </div>
          <div class="px-4 sm:px-5 py-4">
            <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed wrap-anywhere">
              {{ draft.linkedinBody }}
            </p>
          </div>

          <!-- Validation -->
          <div v-if="draft.validationNotes" class="px-4 sm:px-5 py-3 bg-amber-50 border-t border-amber-100">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-semibold text-amber-800">Score: {{ draft.validationScore }}/10</span>
            </div>
            <p class="text-xs text-amber-700 leading-relaxed wrap-anywhere">{{ draft.validationNotes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lead-detail-page,
.lead-detail-page * {
  min-width: 0;
}

.lead-detail-page {
  max-width: 100%;
}

.lead-detail-page > *,
.lead-detail-page section,
.lead-detail-page form,
.lead-detail-page input,
.lead-detail-page select,
.lead-detail-page textarea,
.lead-detail-page button {
  max-width: 100%;
}

.lead-detail-page p,
.lead-detail-page h1,
.lead-detail-page h2,
.lead-detail-page h3,
.lead-detail-page span,
.lead-detail-page code,
.lead-detail-page a {
  max-width: 100%;
}

.wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: break-word;
}
</style>
