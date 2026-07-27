<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import ToastNotification from '@/components/ToastNotification.vue'
import BuyCreditsModal from '@/components/BuyCreditsModal.vue'
import FeedbackWidget from '@/components/FeedbackWidget.vue'

const showBuyModal = ref(false)
const buyModalData = ref<{ balance: number; needed: number } | null>(null)

function onInsufficientCredits(e: Event) {
  const detail = (e as CustomEvent).detail as { balance: number; needed: number }
  buyModalData.value = detail
  showBuyModal.value = true
}

onMounted(() => {
  window.addEventListener('insufficient-credits', onInsufficientCredits)
})

onUnmounted(() => {
  window.removeEventListener('insufficient-credits', onInsufficientCredits)
})
</script>

<template>
  <ToastNotification />
  <RouterView />
  <BuyCreditsModal v-if="showBuyModal" :balance="buyModalData?.balance" :needed="buyModalData?.needed"
    @close="showBuyModal = false" />
  <FeedbackWidget />
</template>


<style>
body {
  font-family: "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d4 transparent;
}

.main-scroll::-webkit-scrollbar {
  width: 5px;
}

.main-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.main-scroll::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 999px;
}

.main-scroll::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

.main-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d4 transparent;
}

.apple-scroll::-webkit-scrollbar {
  width: 4px;
}

.apple-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.apple-scroll::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 999px;
}

.apple-scroll::-webkit-scrollbar-thumb:hover {
  background: #a3a3a3;
}

.apple-scroll::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

.apple-scroll {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d4 transparent;
}

button {
  cursor: pointer;
}

/*  */
@font-face {
  font-family: "Helvetica Neue";
  src: url("/fonts/HelveticaNeueLight.otf") format("opentype");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("/fonts/HelveticaNeueRegular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("/fonts/HelveticaNeueMedium.otf") format("opentype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("/fonts/HelveticaNeueBold.otf") format("opentype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("/fonts/HelveticaNeueBlack.otf") format("opentype");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/*  */
</style>
