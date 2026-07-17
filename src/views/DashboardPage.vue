<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import type { LeadSummary, LeadStatus } from '@/types'
import { LEAD_STATUS_LABELS } from '@/types'
import StatusBadge from '@/components/StatusBadge.vue'
import CreateLeadModal from '@/components/CreateLeadModal.vue'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/error'

const router = useRouter()
const leads = ref<LeadSummary[]>([])
const loading = ref(true)
const showCreateModal = ref(false)

const statusFilter = ref<LeadStatus | 'ALL'>('ALL')

const filteredLeads = ref<LeadSummary[]>([])

async function fetchLeads() {
  loading.value = true
  try {
    const res = await api.get('/api/leads')
    leads.value = res.data.data || res.data
    applyFilter()
  } catch (err: unknown) {
    toast.error('Error', getErrorMessage(err, 'Failed to load leads'))
  } finally {
    loading.value = false
  }
}

function applyFilter() {
  if (statusFilter.value === 'ALL') {
    filteredLeads.value = leads.value
  } else {
    filteredLeads.value = leads.value.filter((l) => l.status === statusFilter.value)
  }
}

function onStatusFilterChange() {
  applyFilter()
}

function handleLeadCreated(lead: LeadSummary) {
  showCreateModal.value = false
  router.push(`/app/leads/${lead.id}`)
}

function handleDeleteLead(leadId: string, e: Event) {
  e.stopPropagation()
  if (!confirm('Are you sure you want to delete this lead?')) return
  api
    .delete(`/api/leads/${leadId}`)
    .then(() => {
      leads.value = leads.value.filter((l) => l.id !== leadId)
      applyFilter()
      toast.success('Deleted', 'Lead removed')
    })
    .catch((err: unknown) => {
      toast.error('Error', getErrorMessage(err, 'Failed to delete'))
    })
}

onMounted(fetchLeads)
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Leads</h1>
        <p class="text-sm text-gray-500 mt-1">{{ leads.length }} total leads</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="h-10 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Lead
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 mb-4 flex-wrap overflow-x-auto pb-2 -mx-2 px-2" role="group" aria-label="Status filters">
      <button
        @click="statusFilter = 'ALL'; onStatusFilterChange()"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0"
        :class="statusFilter === 'ALL' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        All
      </button>
      <button
        v-for="status in (['NEW', 'RESEARCHED', 'CONTACT_FOUND', 'OUTREACH_READY', 'ARCHIVED'] as LeadStatus[])"
        :key="status"
        @click="statusFilter = status; onStatusFilterChange()"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0"
        :class="statusFilter === status ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ LEAD_STATUS_LABELS[status] }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-1/3 mb-3" />
        <div class="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="leads.length === 0"
      class="bg-white rounded-xl border border-gray-200 p-12 text-center"
    >
      <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">No leads yet</h3>
      <p class="text-sm text-gray-500 mb-4">Create your first lead to start researching</p>
      <button
        @click="showCreateModal = true"
        class="h-10 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
      >
        Create Lead
      </button>
    </div>

    <!-- Lead table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px]">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50/50">
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Domain</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Target Role</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="lead in filteredLeads"
              :key="lead.id"
              @click="router.push(`/app/leads/${lead.id}`)"
              class="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td class="px-5 py-4">
                <p class="text-sm font-medium text-gray-900">{{ lead.company }}</p>
                <p class="text-xs text-gray-500">{{ new Date(lead.createdAt).toLocaleDateString() }}</p>
              </td>
              <td class="px-5 py-4 text-sm text-gray-600 hidden sm:table-cell">{{ lead.domain || '—' }}</td>
              <td class="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">{{ lead.targetRole || '—' }}</td>
              <td class="px-5 py-4 hidden lg:table-cell">
                <StatusBadge :status="lead.status" />
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <span :class="(lead._count?.researchRuns ?? 0) > 0 ? 'text-green-600' : 'text-gray-400'">R</span>
                    {{ lead._count?.researchRuns ?? 0 }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span :class="(lead._count?.painPoints ?? 0) > 0 ? 'text-green-600' : 'text-gray-400'">P</span>
                    {{ lead._count?.painPoints ?? 0 }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span :class="(lead._count?.decisionMakers ?? 0) > 0 ? 'text-green-600' : 'text-gray-400'">D</span>
                    {{ lead._count?.decisionMakers ?? 0 }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span :class="(lead._count?.outreachDrafts ?? 0) > 0 ? 'text-green-600' : 'text-gray-400'">O</span>
                    {{ lead._count?.outreachDrafts ?? 0 }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-4 text-right">
                <button
                  @click="handleDeleteLead(lead.id, $event)"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors touch-target"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredLeads.length === 0 && leads.length > 0" class="p-8 text-center text-sm text-gray-500">
        No leads match the selected filter.
      </div>
    </div>

    <CreateLeadModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleLeadCreated"
    />
  </div>
</template>
