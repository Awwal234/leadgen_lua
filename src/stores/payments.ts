import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'
import type {
  PackId,
  PaymentTransaction,
  CreditLedgerEntry,
  PaymentInitiateResponse,
  PaymentStatusResponse,
  CreditsResponse,
} from '@/types'

export const usePaymentsStore = defineStore('payments', () => {
  const credits = ref(0)
  const creditsLoading = ref(false)
  const transactions = ref<PaymentTransaction[]>([])
  const ledger = ref<CreditLedgerEntry[]>([])
  const initiating = ref(false)

  async function fetchCredits() {
    creditsLoading.value = true
    try {
      const res = await api.get('/api/payments/credits')
      const body = res.data?.data ?? res.data
      credits.value = typeof body === 'number' ? body : (body?.credits ?? 0)
    } catch {
      // ignore
    } finally {
      creditsLoading.value = false
    }
  }

  async function initiatePurchase(packId: PackId): Promise<PaymentInitiateResponse> {
    initiating.value = true
    try {
      const redirectUrl = `${window.location.origin}/payments/callback`
      const res = await api.post('/api/payments/initiate', {
        packId,
        redirectUrl,
      })
      const body = res.data?.data ?? res.data
      return body
    } finally {
      initiating.value = false
    }
  }

  async function checkPaymentStatus(ref: string): Promise<PaymentStatusResponse> {
    const res = await api.get<PaymentStatusResponse>(`/api/payments/status/${ref}`)
    return res.data
  }

  async function pollPaymentStatus(ref: string, maxAttempts = 60): Promise<PaymentStatusResponse> {
    for (let i = 0; i < maxAttempts; i++) {
      const data = await checkPaymentStatus(ref)
      if (data.status !== 'PENDING') return data
      await new Promise((r) => setTimeout(r, 2000))
    }
    throw new Error('Payment confirmation timed out')
  }

  async function fetchTransactions() {
    try {
      const res = await api.get('/api/payments/transactions')
      const body = res.data?.data ?? res.data
      transactions.value = Array.isArray(body) ? body : []
    } catch {
      // ignore
    }
  }

  async function fetchLedger() {
    try {
      const res = await api.get('/api/payments/transactions/ledger')
      const body = res.data?.data ?? res.data
      ledger.value = Array.isArray(body) ? body : []
    } catch {
      // ignore
    }
  }

  async function deleteTransaction(paymentReference: string) {
    await api.delete(`/api/payments/transactions/${paymentReference}`)
    transactions.value = transactions.value.filter((t) => t.paymentReference !== paymentReference)
  }

  return {
    credits,
    creditsLoading,
    transactions,
    ledger,
    initiating,
    fetchCredits,
    initiatePurchase,
    checkPaymentStatus,
    pollPaymentStatus,
    fetchTransactions,
    fetchLedger,
    deleteTransaction,
  }
})
