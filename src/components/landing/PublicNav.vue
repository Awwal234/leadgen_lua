<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)

watch(isMenuOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <!-- Mobile hamburger (outside header so it stays above overlay) -->
  <button
    class="lg:hidden fixed top-[18px] right-6 z-[60] w-9 h-9 flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
    @click="isMenuOpen = !isMenuOpen"
    aria-label="Toggle menu">
    <div class="relative w-5 h-[14px]">
      <span
        class="absolute left-0 top-0 w-full h-[2px] bg-gray-900 rounded-full transition-all duration-300 origin-center"
        :class="{ 'top-1/2 -translate-y-1/2 rotate-45': isMenuOpen }" />
      <span
        class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-gray-900 rounded-full transition-all duration-300"
        :class="{ 'opacity-0 scale-0': isMenuOpen }" />
      <span
        class="absolute left-0 bottom-0 w-full h-[2px] bg-gray-900 rounded-full transition-all duration-300 origin-center"
        :class="{ 'bottom-1/2 translate-y-1/2 -rotate-45': isMenuOpen }" />
    </div>
  </button>

  <header
    class="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 h-[72px] lg:h-20">
    <nav class="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 lg:px-12 h-full" aria-label="Main navigation">
      <!-- Logo -->
      <a href="/"
        class="flex items-center gap-3 text-gray-900 no-underline group"
        aria-label="Lead Gen home">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true"
          class="text-gray-900 group-hover:opacity-70 transition-opacity duration-200">
          <rect width="32" height="32" rx="7" fill="currentColor" />
          <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <span class="text-[17px] font-bold tracking-tight">Lead Gen</span>
      </a>

      <!-- Desktop nav links -->
      <div class="hidden lg:flex items-center gap-10">
        <a href="/#how-it-works"
          class="text-[14px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-200">How it works</a>
        <a href="/#research"
          class="text-[14px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-200">Research</a>
        <a href="/#pain-points"
          class="text-[14px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-200">Pain Points</a>
        <a href="/#decision-makers"
          class="text-[14px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-200">Contacts</a>
        <a href="/#outreach"
          class="text-[14px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors duration-200">Outreach</a>
      </div>

      <!-- Desktop actions -->
      <div class="hidden lg:flex items-center gap-6">
        <button
          class="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer bg-transparent border-none"
          @click="$router.push('/login')">
          Sign in
        </button>
        <button
          class="inline-flex items-center justify-center font-semibold rounded-full cursor-pointer whitespace-nowrap px-5 py-[9px] text-[13px] bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.97] transition-all duration-300 shadow-sm"
          @click="goToRegister">
          Get started
        </button>
      </div>
    </nav>
  </header>

  <!-- Mobile slide-over -->
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm lg:hidden"
        @click="isMenuOpen = false" />
    </transition>
    <transition name="slide-panel">
      <div
        v-if="isMenuOpen"
        class="fixed top-0 right-0 bottom-0 z-[65] w-full max-w-sm bg-white shadow-2xl flex flex-col lg:hidden will-change-transform">
        <!-- Close button -->
        <div class="flex justify-end px-6 pt-6">
          <button
            class="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer border-none"
            @click="isMenuOpen = false"
            aria-label="Close menu">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" class="text-gray-500">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Nav links -->
        <div class="flex-1 flex flex-col justify-center px-10 pb-16">
          <div class="flex flex-col gap-9">
            <a href="/#how-it-works"
              class="text-[22px] font-semibold text-gray-900 no-underline hover:text-gray-400 transition-colors duration-200"
              @click="isMenuOpen = false">How it works</a>
            <a href="/#research"
              class="text-[22px] font-semibold text-gray-900 no-underline hover:text-gray-400 transition-colors duration-200"
              @click="isMenuOpen = false">Research</a>
            <a href="/#pain-points"
              class="text-[22px] font-semibold text-gray-900 no-underline hover:text-gray-400 transition-colors duration-200"
              @click="isMenuOpen = false">Pain Points</a>
            <a href="/#decision-makers"
              class="text-[22px] font-semibold text-gray-900 no-underline hover:text-gray-400 transition-colors duration-200"
              @click="isMenuOpen = false">Contacts</a>
            <a href="/#outreach"
              class="text-[22px] font-semibold text-gray-900 no-underline hover:text-gray-400 transition-colors duration-200"
              @click="isMenuOpen = false">Outreach</a>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="px-10 pb-12">
          <button
            class="w-full inline-flex items-center justify-center gap-2 font-semibold rounded-full cursor-pointer whitespace-nowrap px-6 py-[13px] text-[15px] bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.97] transition-all duration-300 shadow-sm"
            @click="goToRegister">
            Get started
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" class="opacity-60">
              <path d="M5 10h10M10 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <button
            class="w-full mt-3 inline-flex items-center justify-center font-medium rounded-full cursor-pointer whitespace-nowrap px-6 py-[11px] text-[15px] text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 bg-transparent transition-all duration-200"
            @click="$router.push('/login'); isMenuOpen = false">
            Sign in
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-panel-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-panel-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}
</style>
