<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(false)
const showLogoutConfirm = ref(false)

async function handleLogout() {
  showLogoutConfirm.value = false
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/30 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:top-0 lg:z-auto lg:h-screen lg:sticky flex flex-col"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center gap-2 px-6 h-16 border-b border-gray-200">
          <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">L</span>
          </div>
          <span class="font-semibold text-gray-900">Lead Gen</span>
        </div>

        <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <router-link
            to="/app"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target"
            :class="[
              $route.path === '/app'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </router-link>
          <router-link
            to="/app/settings"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors touch-target"
            :class="[
              $route.path === '/app/settings'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            ]"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </router-link>
        </nav>

        <div class="px-4 py-4 border-t border-gray-200">
          <div class="flex items-center gap-3 px-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-medium text-gray-600">{{ auth.user?.name?.charAt(0) || 'U' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ auth.user?.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
            </div>
            <button
              @click="showLogoutConfirm = true"
              class="shrink-0 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors touch-target"
              title="Logout"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-h-screen lg:pl-0">
      <!-- Top bar (mobile only) -->
      <header class="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
        <div class="flex items-center justify-between px-4 h-16">
          <button
            @click="sidebarOpen = true"
            class="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 touch-target"
            aria-label="Open menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="font-semibold text-gray-900 truncate">Lead Gen</span>
          <div class="w-10" />
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>

    <!-- Logout confirmation modal -->
    <div v-if="showLogoutConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showLogoutConfirm = false" />
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Logout</h3>
          <button
            @click="showLogoutConfirm = false"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-600 mb-6">Are you sure you want to logout?</p>
        <div class="flex gap-3">
          <button
            @click="showLogoutConfirm = false"
            class="flex-1 h-11 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleLogout"
            class="flex-1 h-11 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Logout
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
