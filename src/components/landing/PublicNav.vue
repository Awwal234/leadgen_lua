<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-6 pointer-events-none">
    <nav
      class="pointer-events-auto w-full max-w-5xl bg-white/60 backdrop-blur-[32px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[2rem] transition-all duration-500 ease-out"
      aria-label="Main navigation">
      <div class="flex items-center justify-between gap-6 px-5 py-3 lg:px-6">
        <a href="/"
          class="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-900 no-underline whitespace-nowrap hover:opacity-70 transition-opacity"
          aria-label="Lead Gen home">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true" class="text-black">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2.5" stroke-linecap="round" />
          </svg>
          <span class="mt-[2px]">Lead Gen</span>
        </a>

        <div class="hidden lg:flex items-center gap-7">
          <a href="/#how-it-works"
            class="text-[14px] font-medium text-gray-500 hover:text-black no-underline transition-colors tracking-wide">How
            it works</a>
          <a href="/#research"
            class="text-[14px] font-medium text-gray-500 hover:text-black no-underline transition-colors tracking-wide">Research</a>
          <a href="/#pain-points"
            class="text-[14px] font-medium text-gray-500 hover:text-black no-underline transition-colors tracking-wide">Pain
            Points</a>
          <a href="/#decision-makers"
            class="text-[14px] font-medium text-gray-500 hover:text-black no-underline transition-colors tracking-wide">Contacts</a>
          <a href="/#outreach"
            class="text-[14px] font-medium text-gray-500 hover:text-black no-underline transition-colors tracking-wide">Outreach</a>
        </div>
        <!--  -->
        <div class="flex items-center gap-2">
          <!-- Secondary -->
          <button
            class="hidden sm:inline-flex items-center justify-center font-medium rounded-full cursor-pointer whitespace-nowrap px-5 py-2.5 text-[14px] min-h-[36px] bg-transparent text-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
            @click="$router.push('/login')">
            Sign in
          </button>

          <!-- Primary -->
          <button
            class="inline-flex items-center justify-center gap-2 font-medium rounded-full cursor-pointer whitespace-nowrap px-5 py-2.5 text-[14px] min-h-[36px] bg-black text-white hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            @click="goToRegister">
            Start free
          </button>
        </div>
        <!--  -->
      </div>
    </nav>
  </div>
</template>
