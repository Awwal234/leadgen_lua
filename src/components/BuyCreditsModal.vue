<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePaymentsStore } from '@/stores/payments'
import { CREDIT_PACKS, type PackId } from '@/types'
import { toast } from '@/utils/toast'

const props = defineProps<{
  balance?: number
  needed?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const store = usePaymentsStore()
const selectedPack = ref<PackId | null>(null)

const recommended = computed(() => {
  const need = props.needed || 1
  return CREDIT_PACKS.find((p) => p.credits >= need) || CREDIT_PACKS[0]
})

selectedPack.value = recommended.value?.id || null

const creditsToBuy = computed(() => CREDIT_PACKS.find((p) => p.id === selectedPack.value))

async function handleBuy() {
  if (!selectedPack.value) return
  try {
    const data = await store.initiatePurchase(selectedPack.value)
    if (data?.checkoutUrl) {
      window.open(data.checkoutUrl, '_blank')
    } else {
      toast.error('Error', 'No checkout URL returned')
    }
  } catch (err: unknown) {
    toast.error('Error', 'Failed to initiate purchase')
  }
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Insufficient Credits</h3>
        <button @click="emit('close')" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p v-if="needed" class="text-sm text-gray-600 mb-4">
        You need <strong>{{ needed }} credits</strong> for this action.
        <span v-if="balance !== undefined">You have <strong>{{ balance }} credits</strong>.</span>
      </p>
      <p v-else class="text-sm text-gray-600 mb-4">
        You don't have enough credits to perform this action.
      </p>

      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select a credit pack</p>
      <div class="space-y-2 mb-4">
        <button v-for="pack in CREDIT_PACKS" :key="pack.id" @click="selectedPack = pack.id"
          class="w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center justify-between"
          :class="selectedPack === pack.id
            ? 'border-gray-900 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300'">
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ pack.label }}</p>
            <p class="text-xs text-gray-500">{{ pack.credits }} credits</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">{{ formatNaira(pack.price) }}</p>
            <p v-if="pack.id === recommended?.id" class="text-[11px] text-green-600 font-medium">Recommended</p>
          </div>
        </button>
      </div>

      <button @click="handleBuy" :disabled="!selectedPack || store.initiating"
        class="w-full h-11 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {{ store.initiating ? 'Redirecting...' : `Buy ${creditsToBuy?.credits || ''} credits — ${creditsToBuy ? formatNaira(creditsToBuy.price) : ''}` }}
      </button>
      <button @click="emit('close')"
        class="w-full h-10 mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        Cancel
      </button>
    </div>
  </div>
</template>
