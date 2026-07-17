<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200 transition-colors duration-300" aria-label="Main navigation">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-3 lg:px-10 lg:py-4">
      <a href="/" class="flex items-center gap-3 text-lg font-semibold text-gray-900 no-underline whitespace-nowrap hover:opacity-80 transition-opacity" aria-label="Lead Gen home">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="var(--color-brand)" />
          <path
            d="M8 12h16M8 16h12M8 20h8"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
        <span>Lead Gen</span>
      </a>

      <div class="hidden lg:flex items-center gap-6">
        <a href="/#how-it-works" class="text-sm font-medium text-gray-500 hover:text-black no-underline transition-colors">How it works</a>
        <a href="/#research" class="text-sm font-medium text-gray-500 hover:text-black no-underline transition-colors">Research</a>
        <a href="/#pain-points" class="text-sm font-medium text-gray-500 hover:text-black no-underline transition-colors">Pain Points</a>
        <a href="/#decision-makers" class="text-sm font-medium text-gray-500 hover:text-black no-underline transition-colors">Contacts</a>
        <a href="/#outreach" class="text-sm font-medium text-gray-500 hover:text-black no-underline transition-colors">Outreach</a>
        <a href="/#faq" class="text-sm font-medium text-gray-500 hover:text-black no-underline transition-colors">FAQ</a>
      </div>

      <div class="flex items-center gap-3">
        <a href="/login" class="inline-flex items-center justify-center gap-2 font-medium rounded-lg border cursor-pointer no-underline whitespace-nowrap px-4 py-2 text-sm min-h-[36px] bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900 transition-all">Sign in</a>
        <button class="inline-flex items-center justify-center gap-2 font-medium rounded-lg border cursor-pointer no-underline whitespace-nowrap px-4 py-2 text-sm min-h-[36px] bg-black text-white border-black hover:bg-gray-900 hover:border-gray-900 hover:-translate-y-px hover:shadow-md transition-all active:scale-[0.97]" @click="goToRegister">Start free</button>
      </div>
    </div>
  </nav>
</template>
