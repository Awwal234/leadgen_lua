<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
const manualDM = ref({ name: '', title: '', email: '', linkedInUrl: '', isPrimary: false })

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

const statusIndex = computed(() => {
  if (!lead.value) return 0
  return LEAD_STATUS_ORDER.indexOf(lead.value.status)
})

const primaryDM = computed(() => {
  return decisionMakers.value.find((d) => d.isPrimary) || decisionMakers.value[0]
})

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
  if (!manualDM.value.name && !manualDM.value.email) {
    toast.warn('Validation', 'Name or email is required')
    return
  }
  try {
    await api.post(`/api/leads/${leadId}/decision-makers`, {
      ...manualDM.value,
      source: 'fallback',
      emailConfidence: null,
    })
    toast.success('Saved', 'Decision maker saved')
    showDMForm.value = false
    manualDM.value = { name: '', title: '', email: '', linkedInUrl: '', isPrimary: false }
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
  sending.value = true
  try {
    await api.post(`/api/leads/${leadId}/send-outreach`, {
      outreachDraftId: selectedDraftId.value,
      from: fromEmail.value,
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
  if (authStore.user?.name) senderName.value = authStore.user.name
  if (authStore.user?.company_name) senderCompany.value = authStore.user.company_name
  if (authStore.user?.email) fromEmail.value = authStore.user.email
  loadSectionData('research')
})
</script>

<template>
  <div class="max-w-5xl mx-auto" v-if="lead">
    <!-- Lead header -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ lead.company }}</h1>
            <StatusBadge :status="lead.status" />
          </div>
          <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span v-if="lead.domain">{{ lead.domain }}</span>
            <span v-if="lead.targetRole">Target: {{ lead.targetRole }}</span>
            <span>Created {{ new Date(lead.createdAt).toLocaleDateString() }}</span>
          </div>
          <p v-if="lead.notes" class="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {{ lead.notes }}
          </p>
        </div>
      </div>

      <!-- Status stepper -->
      <div class="mt-6 flex items-center gap-0">
        <template v-for="(s, i) in LEAD_STATUS_ORDER.filter((st) => st !== 'ARCHIVED')" :key="s">
          <div class="flex items-center">
            <div
              class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              :class="{
                'bg-green-100 text-green-700': getStepStatus(i) === 'completed',
                'bg-black text-white': getStepStatus(i) === 'current',
                'bg-gray-100 text-gray-400': getStepStatus(i) === 'pending',
              }"
            >
              <span
                v-if="getStepStatus(i) === 'completed'"
                class="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center"
              >
                <svg
                  class="w-2 h-2 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {{ LEAD_STATUS_LABELS[s] }}
            </div>
            <div
              v-if="i < 4"
              class="w-8 h-0.5 mx-1"
              :class="getStepStatus(i + 1) === 'completed' ? 'bg-green-300' : 'bg-gray-200'"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Pipeline tabs -->
    <div
      class="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide"
    >
      <button
        v-for="tab in [
          {
            key: 'research',
            label: 'Research',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          },
          {
            key: 'pain-points',
            label: 'Pain Points',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
          },
          {
            key: 'decision-makers',
            label: 'Decision Makers',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
          },
          {
            key: 'outreach',
            label: 'Outreach',
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          },
          {
            key: 'send',
            label: 'Send',
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          },
        ] as const"
        :key="tab.key"
        @click="selectSection(tab.key)"
        class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap shrink-0 touch-target"
        :class="
          activeSection === tab.key
            ? 'border-black text-black'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        "
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
        </svg>
        {{ tab.label }}
      </button>
    </div>

    <!-- Section: Research -->
    <div v-if="activeSection === 'research'" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Research History</h2>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            @click="showResearchForm = !showResearchForm"
            class="h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors touch-target"
          >
            Manual Entry
          </button>
          <button
            @click="handleResolveResearch"
            :disabled="resolvingResearch"
            class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target"
          >
            <svg
              v-if="resolvingResearch"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {{ resolvingResearch ? 'Researching...' : 'Resolve Research' }}
          </button>
        </div>
      </div>

      <!-- Manual research form -->
      <div
        v-if="showResearchForm"
        class="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3"
      >
        <input
          v-model="manualResearch.summary"
          type="text"
          placeholder="Research summary"
          class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <input
          v-model="manualResearch.website"
          type="text"
          placeholder="Website URL"
          class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <button
          @click="handleSaveResearch"
          class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save
        </button>
      </div>

      <!-- Research list -->
      <div v-if="researchLoading" class="space-y-3">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
        >
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div
        v-else-if="researchRuns.length === 0"
        class="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500"
      >
        No research runs yet. Click "Resolve Research" to auto-research or add manually.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="run in researchRuns"
          :key="run.id"
          class="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="text-sm font-semibold text-gray-900">
                {{ run.rawResearch?.company || lead.company }}
              </p>
              <p class="text-xs text-gray-500">{{ new Date(run.createdAt).toLocaleString() }}</p>
            </div>
            <span
              v-if="run.industry"
              class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium"
              >{{ run.industry }}</span
            >
          </div>

          <!-- Links -->
          <div v-if="run.website || run.linkedInUrl" class="flex items-center gap-3 mb-3">
            <a
              v-if="run.website"
              :href="run.website"
              target="_blank"
              class="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Website
            </a>
            <a
              v-if="run.linkedInUrl"
              :href="run.linkedInUrl"
              target="_blank"
              class="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              LinkedIn
            </a>
          </div>

          <div v-if="run.summary">
            <p
              class="text-sm text-gray-700 leading-relaxed"
              :class="{ 'line-clamp-3': !expandedSummaries.has(run.id) }"
            >
              {{ run.summary }}
            </p>
            <button
              @click="toggleSummary(run.id)"
              class="text-xs text-blue-600 hover:underline mt-1"
            >
              {{ expandedSummaries.has(run.id) ? 'Show less' : 'Show more' }}
            </button>
          </div>

          <!-- Funding info -->
          <div
            v-if="run.fundingInfo?.lastRound || run.fundingInfo?.amount"
            class="flex items-center gap-3 mt-3 text-xs text-gray-600"
          >
            <span
              v-if="run.fundingInfo?.lastRound"
              class="px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium"
              >{{ run.fundingInfo.lastRound }}</span
            >
            <span v-if="run.fundingInfo?.amount">{{ run.fundingInfo.amount }}</span>
          </div>

          <!-- Tech stack -->
          <div v-if="run.techStack && run.techStack.length" class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="tech in run.techStack"
              :key="tech"
              class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >{{ tech }}</span
            >
          </div>

          <!-- Job postings -->
          <div v-if="run.jobPostings && run.jobPostings.length" class="mt-3">
            <p class="text-xs font-semibold text-gray-500 uppercase mb-2">
              Active Job Postings ({{ run.jobPostings.length }})
            </p>
            <div class="space-y-1.5 max-h-48 overflow-y-auto">
              <div
                v-for="job in run.jobPostings.slice(0, 10)"
                :key="job.title + job.location"
                class="flex items-start justify-between p-2 bg-gray-50 rounded-lg text-xs"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ job.title }}</p>
                  <p class="text-gray-500 mt-0.5">
                    {{ [job.department, job.location].filter(Boolean).join(' · ') }}
                  </p>
                </div>
                <div v-if="job.signals?.length" class="flex flex-wrap gap-1 ml-2 shrink-0">
                  <span
                    v-for="sig in job.signals.slice(0, 2)"
                    :key="sig"
                    class="px-1 py-0.5 bg-blue-100 text-blue-600 rounded"
                    >{{ sig }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Recent news -->
          <div v-if="run.recentNews && run.recentNews.length" class="mt-3">
            <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Recent News</p>
            <div class="space-y-2">
              <a
                v-for="news in run.recentNews.slice(0, 3)"
                :key="news.url"
                :href="news.url"
                target="_blank"
                class="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p class="text-sm font-medium text-gray-900">{{ news.title }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ news.snippet }}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Pain Points -->
    <div v-if="activeSection === 'pain-points'" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Pain Points</h2>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            @click="showPainPointForm = !showPainPointForm"
            class="h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors touch-target"
          >
            Manual Entry
          </button>
          <button
            @click="handleResolvePainPoints"
            :disabled="resolvingPainPoints"
            class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target"
          >
            <svg
              v-if="resolvingPainPoints"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {{ resolvingPainPoints ? 'Analyzing...' : 'Resolve Pain Points' }}
          </button>
        </div>
      </div>

      <!-- Product context input (required for auto-resolve) -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <label class="block text-xs font-medium text-gray-500 mb-2"
          >Your Product Context <span class="text-red-500">*</span></label
        >
        <input
          v-model="ourProduct"
          type="text"
          placeholder="Describe your product (e.g., 'AI-powered sales automation platform for B2B teams')"
          class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <p class="text-xs text-gray-500 mt-1">
          Required for AI to identify relevant pain points for your product
        </p>
      </div>

      <div
        v-if="showPainPointForm"
        class="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3"
      >
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model="manualPainPoint.title"
            type="text"
            placeholder="Pain point title"
            class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <select
            v-model="manualPainPoint.urgency"
            class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <textarea
          v-model="manualPainPoint.description"
          rows="2"
          placeholder="Description"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
        />
        <input
          v-model="manualPainPoint.relevantSignal"
          type="text"
          placeholder="Relevant signal"
          class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <button
          @click="handleSavePainPoint"
          class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save Pain Point
        </button>
      </div>

      <div v-if="painPointsLoading" class="space-y-3">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
        >
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div
        v-else-if="painPoints.length === 0"
        class="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500"
      >
        No pain points identified yet.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="pp in painPoints"
          :key="pp.id"
          class="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div class="flex items-start justify-between">
            <h3 class="text-sm font-semibold text-gray-900">{{ pp.title }}</h3>
            <span
              class="px-2 py-0.5 rounded text-xs font-medium"
              :class="
                pp.urgency === 'high'
                  ? 'bg-red-100 text-red-700'
                  : pp.urgency === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
              "
              >{{ pp.urgency }}</span
            >
          </div>
          <p class="text-sm text-gray-600 mt-2">{{ pp.description }}</p>
          <p v-if="pp.relevantSignal" class="text-xs text-gray-400 mt-2 italic">
            Signal: {{ pp.relevantSignal }}
          </p>
        </div>
      </div>
    </div>

    <!-- Section: Decision Makers -->
    <div v-if="activeSection === 'decision-makers'" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Decision Makers</h2>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            @click="showDMForm = !showDMForm"
            class="h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors touch-target"
          >
            Manual Entry
          </button>
          <button
            @click="handleResolveDM"
            :disabled="resolvingDM"
            class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target"
          >
            <svg v-if="resolvingDM" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {{ resolvingDM ? 'Searching...' : 'Find Decision Maker' }}
          </button>
        </div>
      </div>

      <!-- Company domain (auto-populated from lead) -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div class="flex items-center gap-2 text-sm">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <span class="text-gray-500">Company Domain:</span>
          <code class="bg-white px-2 py-0.5 rounded text-gray-900 font-mono text-xs">{{
            lead?.domain || '—'
          }}</code>
          <span v-if="lead?.domain" class="text-green-600 text-xs font-medium"
            >Auto-populated from lead</span
          >
        </div>
      </div>

      <div v-if="showDMForm" class="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model="manualDM.name"
            type="text"
            placeholder="Name"
            class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            v-model="manualDM.title"
            type="text"
            placeholder="Title"
            class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
        <input
          v-model="manualDM.email"
          type="email"
          placeholder="Email"
          class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            v-model="manualDM.isPrimary"
            class="w-4 h-4 rounded border-gray-300"
          />
          Primary contact
        </label>
        <button
          @click="handleSaveDM"
          class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save
        </button>
      </div>

      <div v-if="dmLoading" class="space-y-3">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
        >
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div
        v-else-if="decisionMakers.length === 0"
        class="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500"
      >
        No decision makers found yet.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="dm in decisionMakers"
          :key="dm.id"
          class="bg-white rounded-xl border border-gray-200 p-5"
          :class="{ 'border-green-200 bg-green-50/30': dm.isPrimary }"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-sm font-semibold text-gray-600">{{
                  dm.name?.charAt(0) || '?'
                }}</span>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900">{{ dm.name || 'Unknown' }}</h3>
                <p class="text-xs text-gray-500">{{ dm.title || '—' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="dm.isPrimary"
                class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium"
                >Primary</span
              >
              <span class="text-xs text-gray-400">{{ dm.source }}</span>
            </div>
          </div>
          <div v-if="dm.email" class="mt-3 flex items-center gap-2 text-sm">
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
              />
            </svg>
            <span>{{ dm.email }}</span>
            <span v-if="dm.emailConfidence" class="text-xs text-gray-400"
              >({{ Math.round(dm.emailConfidence * 100) }}% confidence)</span
            >
          </div>
          <a
            v-if="dm.linkedInUrl"
            :href="dm.linkedInUrl"
            target="_blank"
            class="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            View LinkedIn
          </a>
        </div>
      </div>
    </div>

    <!-- Section: Send Outreach -->
    <div v-if="activeSection === 'send'" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Send Outreach</h2>
      </div>

      <!-- Send form -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-2"
            >Select Outreach Draft <span class="text-red-500">*</span></label
          >
          <select
            v-model="selectedDraftId"
            class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 bg-white"
          >
            <option value="">-- Select a draft --</option>
            <option v-for="draft in outreachDrafts" :key="draft.id" :value="draft.id">
              {{
                draft.emailSubject || `Draft from ${new Date(draft.createdAt).toLocaleDateString()}`
              }}
            </option>
          </select>
          <p v-if="outreachDrafts.length === 0" class="text-xs text-amber-600 mt-1">
            No outreach drafts available. Go to the Outreach tab to generate one first.
          </p>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-2"
            >From Email <span class="text-red-500">*</span></label
          >
          <input
            v-model="fromEmail"
            type="email"
            placeholder="your@email.com"
            class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
        <button
          @click="handleSendOutreach"
          :disabled="sending"
          class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target"
        >
          <svg v-if="sending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {{ sending ? 'Sending...' : 'Send Email' }}
        </button>
      </div>

      <!-- Sent email history -->
      <h3 class="text-sm font-semibold text-gray-900 mt-6">Sent Email History</h3>
      <div v-if="sentEmailsLoading" class="space-y-3">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
        >
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div
        v-else-if="sentEmails.length === 0"
        class="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500"
      >
        No emails sent yet. Fill in the fields above and click "Send Email".
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="email in sentEmails"
          :key="email.id"
          class="bg-white rounded-xl border border-gray-200 p-5"
          :class="email.success ? 'border-green-200' : 'border-red-200'"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="email.success ? 'bg-green-500' : 'bg-red-500'"
                />
                <p class="text-sm font-semibold text-gray-900 truncate">{{ email.subject }}</p>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                To: {{ email.to }} &middot; {{ new Date(email.sentAt).toLocaleString() }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">SendByte ID: {{ email.sendbyteEmailId }}</p>
            </div>
            <span
              class="px-2 py-0.5 rounded text-xs font-medium shrink-0"
              :class="email.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ email.success ? 'Sent' : 'Failed' }}
            </span>
          </div>
          <div v-if="email.error" class="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <p class="text-xs font-medium text-red-800">{{ email.error.code }}</p>
            <p class="text-xs text-red-600 mt-0.5">{{ email.error.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Outreach -->
    <div v-if="activeSection === 'outreach'" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 class="text-lg font-semibold text-gray-900">Outreach Drafts</h2>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            @click="showOutreachForm = !showOutreachForm"
            class="h-9 px-3 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors touch-target"
          >
            Manual Entry
          </button>
          <button
            @click="handleResolveOutreach"
            :disabled="resolvingOutreach"
            class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-target"
          >
            <svg
              v-if="resolvingOutreach"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {{ resolvingOutreach ? 'Generating...' : 'Generate Outreach' }}
          </button>
        </div>
      </div>

      <!-- Product context (shared with Pain Points) - always visible, required for auto-generate -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <label class="block text-xs font-medium text-gray-500 mb-2"
          >Your Product Context <span class="text-red-500">*</span></label
        >
        <input
          v-model="ourProduct"
          type="text"
          placeholder="Describe your product (e.g., 'AI-powered sales automation platform for B2B teams')"
          class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <p class="text-xs text-gray-500 mt-1">
          Required for AI to generate relevant outreach. Shared with Pain Points section.
        </p>
      </div>

      <!-- Sender info - always visible, required for auto-generate -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1"
              >Your Name <span class="text-red-500">*</span></label
            >
            <input
              v-model="senderName"
              type="text"
              placeholder="Your name"
              class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1"
              >Your Company <span class="text-red-500">*</span></label
            >
            <input
              v-model="senderCompany"
              type="text"
              placeholder="Your company"
              class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
        </div>
      </div>

      <!-- Selected decision maker -->
      <div
        v-if="decisionMakers.length > 0"
        class="bg-green-50 rounded-xl border border-green-200 p-4"
      >
        <div class="flex items-center gap-2 text-sm">
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span class="text-green-800 font-medium">Primary Decision Maker (auto-selected):</span>
        </div>
        <div class="mt-2 flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span class="text-xs font-semibold text-gray-600">{{
              primaryDM?.name?.charAt(0) || '?'
            }}</span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ primaryDM?.name || 'Unknown' }}</p>
            <p class="text-xs text-gray-500">{{ primaryDM?.title || '—' }}</p>
          </div>
          <span
            v-if="primaryDM?.email"
            class="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded"
            >{{ primaryDM.email }}</span
          >
        </div>
      </div>
      <div v-else class="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
        <div class="flex items-center gap-2 text-sm text-yellow-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 3 1.732 3z"
            />
          </svg>
          <span
            >No decision makers found. Go to "Decision Makers" tab and click "Find Decision Maker"
            first.</span
          >
        </div>
      </div>

      <!-- Tone selector -->
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <label class="block text-xs font-medium text-gray-500 mb-2">Tone</label>
        <div class="flex gap-2">
          <button
            v-for="t in ['professional', 'conversational', 'direct'] as const"
            :key="t"
            @click="tone = t"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize"
            :class="
              tone === t
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            "
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Manual form -->
      <div
        v-if="showOutreachForm"
        class="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3"
      >
        <input
          v-model="manualOutreach.emailSubject"
          type="text"
          placeholder="Email subject"
          class="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <textarea
          v-model="manualOutreach.emailBody"
          rows="4"
          placeholder="Email body"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
        />
        <textarea
          v-model="manualOutreach.linkedinBody"
          rows="3"
          placeholder="LinkedIn message"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
        />
        <button
          @click="handleSaveOutreach"
          class="h-9 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Save Draft
        </button>
      </div>

      <div v-if="outreachLoading" class="space-y-3">
        <div
          v-for="i in 2"
          :key="i"
          class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
        >
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div class="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div
        v-else-if="outreachDrafts.length === 0"
        class="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500"
      >
        No outreach drafts yet. Fill in the context fields above and click "Generate Outreach", or
        add one manually.
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="draft in outreachDrafts"
          :key="draft.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div class="bg-gray-800 text-white px-5 py-3 flex items-center justify-between">
            <span class="text-sm font-semibold">Email</span>
            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full"
              >{{ draft.emailWordCount }} words</span
            >
          </div>
          <div class="px-5 py-3 border-b border-gray-100">
            <p class="text-sm">
              <span class="text-gray-400">Subject:</span>
              <span class="font-medium">{{ draft.emailSubject || '(no subject)' }}</span>
            </p>
          </div>
          <div class="px-5 py-4 bg-gray-50/50">
            <p class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {{ draft.emailBody }}
            </p>
          </div>

          <div class="bg-blue-600 text-white px-5 py-3 flex items-center justify-between">
            <span class="text-sm font-semibold">LinkedIn</span>
            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full"
              >{{ draft.linkedinWordCount }} words</span
            >
          </div>
          <div class="px-5 py-4">
            <p class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {{ draft.linkedinBody }}
            </p>
          </div>

          <div
            v-if="draft.validationNotes"
            class="px-5 py-3 bg-orange-50 border-t border-orange-100"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-semibold text-orange-800"
                >Score: {{ draft.validationScore }}/10</span
              >
            </div>
            <p class="text-xs text-orange-700">{{ draft.validationNotes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
