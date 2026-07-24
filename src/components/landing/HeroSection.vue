<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{
  ctaClick: []
}>()

const showVideo = ref(false)
</script>

<template>
  <header class="relative bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-36 md:pt-25 pb-24 md:pb-32">
      <div class="max-w-[820px] mx-auto text-center">
        <h1
          class="text-[clamp(2.6rem,5.5vw+1rem,5rem)] font-extrabold tracking-[-0.05em] leading-[1.15] md:leading-[1.08] text-gray-900 mb-6">
          <span class="highlight">Research</span> accounts.<br>
          Find <span class="highlight">decision makers</span>.<br>
          <span class="highlight">Send</span> outreach.
        </h1>

        <p
          class="text-[1.125rem] md:text-[1.25rem] text-gray-500 max-w-[480px] mx-auto leading-relaxed font-medium mb-12">
          AI-powered pipeline that converts a company name into researched, personalized outreach. No credit card.
        </p>

        <div class="flex items-center justify-center gap-6">
          <button
            class="inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl cursor-pointer whitespace-nowrap px-8 py-3.5 text-[15px] bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.97] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            @click="$emit('ctaClick')">
            Start free
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" class="opacity-60">
              <path d="M5 10h10M10 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <button
            class="group inline-flex items-center gap-3 text-[15px] font-semibold text-gray-500 hover:text-gray-900 transition-all duration-300 cursor-pointer bg-transparent border-none p-0"
            @click="showVideo = true">
            <span
              class="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 group-hover:bg-gray-700 group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="text-white ml-0.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span
                class="absolute inset-0 rounded-full animate-ping-slow opacity-20 bg-gray-900 group-hover:opacity-30" />
            </span>
            <span class="group-hover:translate-x-0.5 transition-transform duration-300">Watch demo</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="demo">
      <div v-if="showVideo" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 md:p-12"
        @click="showVideo = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <div class="relative w-full max-w-[900px] bg-black rounded-none overflow-hidden shadow-2xl" @click.stop>
          <button @click="showVideo = false"
            class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <iframe
            src="https://player.cloudinary.com/embed/?cloud_name=drxgewgtj&public_id=untitled_xkja0n&profile=cld-default"
            style="height: auto; width: 100%; aspect-ratio: 640 / 360; display: block;"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen frameborder="0" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.highlight {
  background: linear-gradient(to top, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.25) 30%, transparent 30%, transparent 100%);
  padding: 0 4px;
  margin: 0 -4px;
}

.demo-enter-active,
.demo-leave-active {
  transition: opacity 0.3s ease;
}

.demo-enter-active>div:last-child,
.demo-leave-active>div:last-child {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.demo-enter-from,
.demo-leave-to {
  opacity: 0;
}

.demo-enter-from>div:last-child {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}

.demo-leave-to>div:last-child {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
