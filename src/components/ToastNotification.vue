<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { setToastListener, type ToastMessage } from '@/utils/toast'

const toasts = ref<(ToastMessage & { id: number })[]>([])
let nextId = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function remove(id: number) {
  clearTimeout(timers.get(id))
  timers.delete(id)
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

const icons: Record<string, string> = {
  success: 'M20 6L9 17l-5-5',
  error: 'M18 6L6 18M6 6l12 12',
  warn: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const circle: Record<string, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warn: 'bg-amber-500',
  info: 'bg-blue-500',
}

const labels: Record<string, string> = {
  success: 'Success',
  error: 'Error',
  warn: 'Warning',
  info: 'Info',
}

onMounted(() => {
  setToastListener((msg: ToastMessage) => {
    const id = nextId++
    toasts.value.push({ ...msg, id })
    const timer = setTimeout(() => remove(id), msg.life ?? 3000)
    timers.set(id, timer)
  })
})

onUnmounted(() => {
  timers.forEach((t) => clearTimeout(t))
  timers.clear()
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <div
        class="absolute top-0 right-0 p-3 sm:p-5 w-full sm:w-auto sm:max-w-[420px] flex flex-col gap-2 pointer-events-auto">
        <TransitionGroup name="toast">
          <div v-for="t in toasts" :key="t.id"
            class="relative w-full bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.04)] border border-gray-100/60 p-4 pl-[52px] overflow-hidden group">
            <div
              class="absolute left-3 top-4 w-7 h-7 rounded-full flex items-center justify-center"
              :class="circle[t.severity] || 'bg-gray-500'">
              <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path :d="icons[t.severity] || icons.info" />
              </svg>
            </div>
            <div class="flex-1 min-w-0 pr-6">
              <p class="text-sm font-semibold text-gray-900 leading-snug">{{ t.summary || labels[t.severity] }}</p>
              <p v-if="t.detail" class="text-sm text-gray-500 leading-snug mt-0.5">{{ t.detail }}</p>
            </div>
            <button @click="remove(t.id)"
              class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 hover:opacity-100 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(32px) scale(0.94);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(32px) scale(0.94);
}
.toast-move {
  transition: all 0.3s ease;
}
</style>
