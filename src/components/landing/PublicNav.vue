<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
    <nav class="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 md:px-10 lg:px-12 h-14" aria-label="Main navigation">
      <a href="/"
        class="flex items-center gap-2.5 font-semibold tracking-tight text-gray-900 no-underline whitespace-nowrap hover:opacity-70 transition-opacity text-[15px]"
        aria-label="Lead Gen home">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true" class="text-black">
          <rect width="32" height="32" rx="7" fill="currentColor" />
          <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        Lead Gen
      </a>

      <div class="hidden lg:flex items-center gap-8">
        <a href="/#how-it-works"
          class="text-[13px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors">How it works</a>
        <a href="/#research"
          class="text-[13px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors">Research</a>
        <a href="/#pain-points"
          class="text-[13px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors">Pain Points</a>
        <a href="/#decision-makers"
          class="text-[13px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors">Contacts</a>
        <a href="/#outreach"
          class="text-[13px] font-medium text-gray-500 hover:text-gray-900 no-underline transition-colors">Outreach</a>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-none px-2 py-1"
          @click="$router.push('/login')">
          Sign in
        </button>

        <button
          class="inline-flex items-center justify-center font-semibold rounded-xl cursor-pointer whitespace-nowrap px-5 py-2 text-[13px] bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.97] transition-all duration-300"
          @click="goToRegister">
          Start free
        </button>
      </div>
    </nav>
  </header>
</template>
