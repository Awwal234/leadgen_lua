<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePaymentsStore } from '@/stores/payments'

const auth = useAuthStore()
const payments = usePaymentsStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)
const showLogoutConfirm = ref(false)

const navItems = [
  {
    label: 'Dashboard',
    path: '/app',
    icon: [
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    ],
  },
  {
    label: 'Billing',
    path: '/app/billing',
    icon: [
      'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    ],
  },
  {
    label: 'Settings',
    path: '/app/settings',
    icon: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
]

function isActive(path: string) {
  if (path === '/app') return route.path === '/app'
  return route.path.startsWith(path)
}

onMounted(() => {
  payments.fetchCredits()
})

async function handleLogout() {
  showLogoutConfirm.value = false
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex overflow-x-hidden lg:h-screen lg:overflow-hidden">
    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/30 z-40 lg:hidden" @click="sidebarOpen = false" />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-200/80 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:top-0 lg:z-auto lg:h-screen lg:sticky flex flex-col"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 h-[72px] border-b border-gray-100">
        <a href="/" class="flex items-center gap-3 no-underline" aria-label="Lead Gen home">
          <div class="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </div>
          <div>
            <p class="text-[15px] font-semibold text-gray-900 leading-tight">Lead Gen</p>
            <p class="text-[11px] text-gray-400 leading-tight">SDR Platform</p>
          </div>
        </a>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="isActive(item.path)
            ? 'text-gray-900 bg-gray-100'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
          <div class="flex items-center justify-center w-5 h-5 shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              :stroke-width="isActive(item.path) ? 2 : 1.5" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(d, i) in item.icon" :key="i" :d="d" />
            </svg>
          </div>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Credits + User -->
      <div class="border-t border-gray-100 px-4 py-4 space-y-3">
        <!-- Credits badge -->
        <div class="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v2m0 4v6m-2-4h4" />
            </svg>
            <span class="text-xs font-medium text-gray-500">Credits</span>
          </div>
          <span class="text-sm font-semibold text-gray-900 tabular-nums">{{ payments.credits }}</span>
        </div>

        <!-- User profile -->
        <div class="flex items-center gap-3 px-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0 shadow-inner">
            <span class="text-xs font-semibold text-gray-600">{{ auth.user?.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate leading-tight">{{ auth.user?.name }}</p>
            <p class="text-[11px] text-gray-400 truncate leading-tight">{{ auth.user?.email }}</p>
          </div>
          <button @click="showLogoutConfirm = true"
            class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200"
            title="Logout">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 min-w-0 flex flex-col lg:h-screen lg:overflow-y-auto main-scroll">
      <!-- Top bar (mobile only) -->
      <header class="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
        <div class="flex items-center justify-between px-4 h-16">
          <button @click="sidebarOpen = true"
            class="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 touch-target"
            aria-label="Open menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="font-semibold text-gray-900 truncate">Lead Gen</span>
          <div class="w-10" />
        </div>
      </header>

      <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>

    <!-- Logout confirmation modal -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showLogoutConfirm = false" />
      <div class="relative bg-white rounded-2xl shadow-xl w-full lg:w-[400px] max-w-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Leave?</h3>
          <button @click="showLogoutConfirm = false"
            class="p-2 text-gray-300 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div class="flex gap-3">
          <button @click="showLogoutConfirm = false"
            class="flex-1 h-11 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="handleLogout"
            class="flex-1 h-11 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            Log out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Touch target utility */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
</style>
