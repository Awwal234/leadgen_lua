<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePaymentsStore } from '@/stores/payments'
import { CREDIT_PACKS, type PackId } from '@/types'
import { toast } from '@/utils/toast'

const store = usePaymentsStore()
const selectedPack = ref<PackId | null>(null)
const showBuyFlow = ref(false)
const activeTab = ref<'payments' | 'activity'>('payments')
const deleteTarget = ref<string | null>(null)
const deleting = ref(false)
const txnPage = ref(1)
const ledgerPage = ref(1)
const perPage = 4

function switchTab(tab: 'payments' | 'activity') {
  activeTab.value = tab
  txnPage.value = 1
  ledgerPage.value = 1
}

const creditsToBuy = computed(() => CREDIT_PACKS.find((p) => p.id === selectedPack.value))

const paginatedTxns = computed(() => {
  const start = (txnPage.value - 1) * perPage
  return store.transactions.slice(start, start + perPage)
})

const txnTotalPages = computed(() => Math.max(1, Math.ceil(store.transactions.length / perPage)))

const paginatedLedger = computed(() => {
  const start = (ledgerPage.value - 1) * perPage
  return store.ledger.slice(start, start + perPage)
})

const ledgerTotalPages = computed(() => Math.max(1, Math.ceil(store.ledger.length / perPage)))

onMounted(async () => {
  await Promise.all([store.fetchCredits(), store.fetchTransactions(), store.fetchLedger()])
})

async function handleBuy() {
  if (!selectedPack.value) return
  try {
    const data = await store.initiatePurchase(selectedPack.value)
    if (data?.checkoutUrl) {
      window.open(data.checkoutUrl, '_blank')
    } else {
      toast.error('Error', 'No checkout URL returned')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    toast.error('Error', 'Failed to initiate purchase')
  }
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`
}

function statusMeta(status: string) {
  switch (status) {
    case 'PAID': return { dot: 'bg-green-500', label: 'Paid', text: 'text-green-700' }
    case 'FAILED': return { dot: 'bg-red-500', label: 'Failed', text: 'text-red-700' }
    default: return { dot: 'bg-amber-400', label: 'Pending', text: 'text-amber-700' }
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function confirmDelete(ref: string) {
  deleteTarget.value = ref
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.deleteTransaction(deleteTarget.value)
    toast.success('Deleted', 'Transaction has been removed')
    deleteTarget.value = null
  } catch {
    toast.error('Error', 'Failed to delete transaction')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-[28px] font-bold text-gray-900 tracking-tight">Billing</h1>
      <p class="text-sm text-gray-500 mt-1">Manage your credits and payment history</p>
    </div>

    <!-- Credit balance card -->
    <div class="bg-white rounded-2xl border border-gray-200/70 shadow-sm mb-8 overflow-hidden">
      <div class="p-6 sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v2m0 4v6m-2-4h4" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Credit Balance</p>
              <p v-if="store.creditsLoading"
                class="text-[40px] font-bold text-gray-200 tracking-tight leading-none mt-1">—</p>
              <p v-else class="text-[40px] font-bold text-gray-900 tracking-tight leading-none mt-1">{{ store.credits }}
              </p>
              <p class="text-sm text-gray-400 mt-1.5">credits available</p>
            </div>
          </div>
          <button @click="showBuyFlow = !showBuyFlow"
            class="h-10 px-5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-all shadow-sm">
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {{ showBuyFlow ? 'Cancel' : 'Add credits' }}
            </span>
          </button>
        </div>

        <!-- Buy credits panel -->
        <div v-if="showBuyFlow" class="mt-8 pt-8 border-t border-gray-100">
          <p class="text-sm font-semibold text-gray-900 mb-5">Choose a credit pack</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button v-for="(pack, idx) in CREDIT_PACKS" :key="pack.id" @click="selectedPack = pack.id"
              class="relative text-left p-5 rounded-xl border-2 transition-all duration-200" :class="selectedPack === pack.id
                ? 'border-gray-900 bg-gray-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'">
              <div v-if="idx === 1"
                class="absolute -top-2.5 left-4 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-semibold rounded-full">
                Best value
              </div>
              <p class="text-[28px] font-bold text-gray-900 tracking-tight">{{ pack.credits }}</p>
              <p class="text-xs text-gray-500 mt-0.5">credits</p>
              <p class="text-sm font-semibold text-gray-900 mt-4">{{ formatNaira(pack.price) }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatNaira(Math.round(pack.price / pack.credits)) }}/credit
              </p>
            </button>
          </div>
          <button @click="handleBuy" :disabled="!selectedPack || store.initiating"
            class="mt-5 h-11 px-6 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
            <span v-if="store.initiating" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Redirecting...
            </span>
            <span v-else>Purchase {{ creditsToBuy?.credits || '' }} credits</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs: Payments / Activity -->
    <div class="flex gap-6 border-b border-gray-200 mb-6">
      <button @click="switchTab('payments')" class="pb-3 text-sm font-medium transition-colors relative"
        :class="activeTab === 'payments' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'">
        Payment History
        <div v-if="activeTab === 'payments'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
      </button>
      <button @click="switchTab('activity')" class="pb-3 text-sm font-medium transition-colors relative"
        :class="activeTab === 'activity' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'">
        Credit Activity
        <div v-if="activeTab === 'activity'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
      </button>
    </div>

    <!-- Payment History -->
    <div v-show="activeTab === 'payments'">
      <div v-if="store.transactions.length"
        class="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
        <div class="overflow-x-auto apple-scroll">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Reference</th>
                <th class="text-left px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Pack
                </th>
                <th class="text-left px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Amount</th>
                <th class="text-left px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Status</th>
                <th class="text-left px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Date
                </th>
                <th class="px-5 sm:px-6 py-4 w-12" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="txn in paginatedTxns" :key="txn.paymentReference"
                class="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group">
                <td class="px-5 sm:px-6 py-4">
                  <span class="font-mono text-xs text-gray-500">{{ txn.paymentReference.slice(0, 12) }}...</span>
                </td>
                <td class="px-5 sm:px-6 py-4 text-sm text-gray-900 capitalize font-medium">{{ txn.packId }}</td>
                <td class="px-5 sm:px-6 py-4 text-sm text-gray-900 font-medium tabular-nums">{{ formatNaira(txn.amount)
                  }}</td>
                <td class="px-5 sm:px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 text-sm" :class="statusMeta(txn.status).text">
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusMeta(txn.status).dot" />
                    {{ statusMeta(txn.status).label }}
                  </span>
                </td>
                <td class="px-5 sm:px-6 py-4 text-sm text-gray-400 tabular-nums">{{ formatDate(txn.createdAt) }}</td>
                <td class="px-5 sm:px-6 py-4 text-right">
                  <button @click="confirmDelete(txn.paymentReference)"
                    class="delete-btn w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M6 7.5h12m-9 0V6a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 6v1.5m-7.5 0v10.125A2.625 2.625 0 0010.125 20.25h3.75A2.625 2.625 0 0016.5 17.625V7.5M10.5 10.5v6m3-6v6" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Payment pagination -->
        <div v-if="txnTotalPages > 1"
          class="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-gray-100">
          <p class="text-xs text-gray-400 tabular-nums">{{ store.transactions.length }} total</p>
          <div class="flex items-center gap-1.5">
            <button @click="txnPage = Math.max(1, txnPage - 1)" :disabled="txnPage <= 1"
              class="page-btn w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span class="text-xs font-medium text-gray-600 tabular-nums px-1">{{ txnPage }} / {{ txnTotalPages }}</span>
            <button @click="txnPage = Math.min(txnTotalPages, txnPage + 1)" :disabled="txnPage >= txnTotalPages"
              class="page-btn w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-10 sm:p-12 text-center">
        <div
          class="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M12 9v6m-3-3h6" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900">No payments yet</p>
        <p class="text-sm text-gray-400 mt-1">Your transaction history will appear here.</p>
      </div>
    </div>

    <!-- Credit Activity -->
    <div v-show="activeTab === 'activity'">
      <div v-if="store.ledger.length" class="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
        <div class="overflow-x-auto apple-scroll">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Reason</th>
                <th class="text-right px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">
                  Credits</th>
                <th class="text-right px-5 sm:px-6 py-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in paginatedLedger" :key="entry.id"
                class="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                <td class="px-5 sm:px-6 py-4 text-sm text-gray-900">{{ entry.reason }}</td>
                <td class="px-5 sm:px-6 py-4 text-right text-sm font-medium tabular-nums"
                  :class="entry.delta > 0 ? 'text-green-600' : 'text-gray-900'">
                  {{ entry.delta > 0 ? '+' : '' }}{{ entry.delta }}
                </td>
                <td class="px-5 sm:px-6 py-4 text-right text-sm text-gray-400 tabular-nums">{{
                  formatDate(entry.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Ledger pagination -->
        <div v-if="ledgerTotalPages > 1"
          class="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-gray-100">
          <p class="text-xs text-gray-400 tabular-nums">{{ store.ledger.length }} total</p>
          <div class="flex items-center gap-1.5">
            <button @click="ledgerPage = Math.max(1, ledgerPage - 1)" :disabled="ledgerPage <= 1"
              class="page-btn w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span class="text-xs font-medium text-gray-600 tabular-nums px-1">{{ ledgerPage }} / {{ ledgerTotalPages
              }}</span>
            <button @click="ledgerPage = Math.min(ledgerTotalPages, ledgerPage + 1)"
              :disabled="ledgerPage >= ledgerTotalPages"
              class="page-btn w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-2xl border border-gray-200/70 shadow-sm p-10 sm:p-12 text-center">
        <div
          class="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-900">No activity yet</p>
        <p class="text-sm text-gray-400 mt-1">Credit purchases and usage will show up here.</p>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="deleteTarget = null" />
        <div
          class="relative bg-white rounded-2xl md:rounded-[8px] shadow-xl w-full max-w-sm md:w-[500px] p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Transaction</h3>
          <p class="text-sm text-gray-500 mt-2 leading-relaxed">
            This will permanently remove this transaction record. Your actual credit balance won't be affected.
          </p>
          <div class="flex gap-2.5 mt-6">
            <button @click="deleteTarget = null"
              class="flex-1 h-11 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button @click="handleDelete" :disabled="deleting"
              class="flex-1 h-11 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.delete-btn svg,
.page-btn svg {
  display: block !important;
  width: 20px !important;
  height: 20px !important;
  overflow: visible !important;
  opacity: 1 !important;
  visibility: visible !important;
  color: #6b7280 !important;
  stroke: currentColor !important;
  fill: none !important;
  flex-shrink: 0;
}

.delete-btn:hover svg {
  color: #ef4444 !important;
}

.page-btn:hover svg {
  color: #374151 !important;
}
</style>
