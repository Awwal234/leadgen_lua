<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import { toast } from '@/utils/toast'

const open = ref(false)
const rating = ref(0)
const hoverRating = ref(0)
const message = ref('')
const submitting = ref(false)

function close() {
  open.value = false
  setTimeout(() => {
    rating.value = 0
    hoverRating.value = 0
    message.value = ''
  }, 200)
}

async function submit() {
  if (rating.value === 0) return
  submitting.value = true
  try {
    await api.post('/feedback', {
      rating: rating.value,
      message: message.value.trim() || null,
    })
    toast.success('Thank you!', 'Your feedback helps us improve.')
    close()
  } catch {
    toast.error('Failed to send', 'Please try again later.')
  } finally {
    submitting.value = false
  }
}

function starClass(star: number) {
  const filled = star <= (hoverRating.value || rating.value)
  return filled ? 'text-amber-400' : 'text-gray-200'
}
</script>

<template>
  <!-- Floating button -->
  <button @click="open = true"
    class="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200"
    aria-label="Feedback">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  </button>

  <!-- Overlay -->
  <Transition name="feedback">
    <div v-if="open" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="close" />

      <div class="absolute inset-y-0 right-0 w-full sm:max-w-[400px] bg-white shadow-2xl flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 h-16 border-b border-gray-100 shrink-0">
          <h2 class="text-[17px] font-semibold text-gray-900">Feedback</h2>
          <button @click="close"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          <!-- Star rating -->
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-3">How would you rate your experience?</p>
            <div class="flex gap-1.5">
              <button v-for="star in 5" :key="star" @click="rating = star" @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                class="p-1 -m-1 transition-transform duration-150 hover:scale-110 active:scale-90"
                :class="star <= (hoverRating || rating) ? 'scale-105' : ''"
                :aria-label="`${star} star${star > 1 ? 's' : ''}`">
                <svg width="28" height="28" viewBox="0 0 24 24" :class="starClass(star)" fill="currentColor"
                  stroke="none">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Message -->
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-3">Tell us more</p>
            <textarea v-model="message" rows="5" placeholder="What's working well? What could be better?"
              class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all" />
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 border-t border-gray-100 shrink-0">
          <button @click="submit" :disabled="rating === 0 || submitting"
            class="w-full h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
            <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ submitting ? 'Sending...' : 'Send feedback' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.feedback-enter-active,
.feedback-leave-active {
  transition: opacity 0.25s ease;
}

.feedback-enter-active>div:last-child,
.feedback-leave-active>div:last-child {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.feedback-enter-from,
.feedback-leave-to {
  opacity: 0;
}

.feedback-enter-from>div:last-child {
  transform: translateX(100%);
}

.feedback-leave-to>div:last-child {
  transform: translateX(100%);
}
</style>
