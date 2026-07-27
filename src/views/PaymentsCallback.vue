<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaymentsStore } from '@/stores/payments'
import { toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const store = usePaymentsStore()

const status = ref<'checking' | 'paid' | 'failed' | 'timeout'>('checking')
const errorMsg = ref('')

onMounted(async () => {
  const ref = route.query.reference as string
  if (!ref) {
    status.value = 'failed'
    errorMsg.value = 'No payment reference was provided.'
    return
  }
  try {
    const result = await store.pollPaymentStatus(ref)
    await store.fetchCredits()
    if (result.status === 'PAID') {
      status.value = 'paid'
      toast.success('Payment Successful', `You now have ${result.creditBalance} credits`)
    } else {
      status.value = 'failed'
      errorMsg.value = result.status === 'FAILED' ? 'Your payment was declined by the bank.' : 'Payment could not be completed.'
      toast.error('Payment Failed', result.status)
    }
  } catch {
    status.value = 'timeout'
    errorMsg.value = 'The payment confirmation took too long. Your credits may still be added—check your billing page.'
    toast.error('Timeout', 'Payment confirmation took too long')
  }
})

function goToBilling() {
  router.push('/app/billing')
}
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
    <div class="w-full max-w-[500px] mx-auto">
      <!-- Checking state -->
      <div v-if="status === 'checking'"
        class="bg-white rounded-[8px] shadow-sm border border-gray-100/80 p-8 sm:p-10 text-center">
        <div
          class="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 tracking-tight">Confirming Payment</h2>
        <p class="text-sm text-gray-500 mt-1.5 leading-relaxed">Please wait while we verify your payment with your bank.
        </p>
      </div>

      <!-- Paid state -->
      <div v-else-if="status === 'paid'"
        class="bg-white rounded-[8px] shadow-sm border border-gray-100/80 p-8 sm:p-10 text-center">
        <div
          class="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 tracking-tight">Payment Successful</h2>
        <p class="text-sm text-gray-500 mt-1.5 leading-relaxed">Your credits have been added and are ready to use.</p>
        <button @click="goToBilling"
          class="mt-5 h-11 px-8 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-all w-full sm:w-auto sm:min-w-[200px]">
          View Billing
        </button>
      </div>

      <!-- Failed / Timeout state -->
      <div v-else class="bg-white rounded-[8px] shadow-sm border border-gray-100/80 p-8 sm:p-10 text-center">
        <!-- Card illustration with decline mark -->
        <div class="relative w-[200px] h-[132px] mx-auto mb-4">
          <!-- Card background -->
          <svg width="200" height="132" viewBox="0 0 200 132" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="196" height="128" rx="14" fill="white" stroke="#E5E7EB" stroke-width="2" />
            <rect x="24" y="24" width="72" height="8" rx="4" fill="#F3F4F6" />
            <rect x="24" y="44" width="100" height="6" rx="3" fill="#F3F4F6" />
            <rect x="24" y="58" width="80" height="6" rx="3" fill="#F3F4F6" />
            <rect x="24" y="90" width="40" height="24" rx="4" fill="#F3F4F6" />
            <circle cx="144" cy="84" r="20" fill="#FEF2F2" stroke="#FEE2E2" stroke-width="1.5" />
            <path d="M144 76v8m0 4v.01" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>

        <h2 class="text-lg font-semibold text-gray-900 tracking-tight">
          {{ status === 'timeout' ? 'Confirmation Timed Out' : 'Payment Failed' }}
        </h2>
        <p class="text-sm text-gray-500 mt-1.5 leading-relaxed max-w-sm mx-auto">{{ errorMsg }}</p>

        <div class="mt-5 space-y-2.5">
          <button @click="goToBilling"
            class="h-11 px-8 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-all w-full sm:w-auto sm:min-w-[200px]">
            Back to Billing
          </button>
          <p class="text-xs text-gray-400">Need help? <a href="mailto:support@leadgen.com"
              class="text-gray-500 underline hover:text-gray-700">Contact support</a></p>
        </div>
      </div>
    </div>
  </div>
</template>
