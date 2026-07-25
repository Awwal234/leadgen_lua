<script setup lang="ts">
import { ref } from 'vue'

defineEmits<{
  ctaClick: []
}>()

const showVideo = ref(false)
</script>

<template>
  <header class="relative bg-white overflow-hidden">
    <div
      class="min-h-[90vh] md:min-h-screen w-full flex items-center px-6 md:px-10 lg:px-12 pt-28 md:pt-32 pb-24 md:pb-32">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.015]"
          style="background: radial-gradient(circle at center, #000 0%, transparent 70%)" />
        <div
          class="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.015]"
          style="background: radial-gradient(circle at center, #000 0%, transparent 70%)" />
        <div
          class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.02]"
          style="background: radial-gradient(ellipse at center, #000 0%, transparent 60%)" />
      </div>

      <div class="max-w-[780px] mx-auto text-center relative">
        <h1
          class="text-[clamp(2.6rem,5.5vw+1rem,4.5rem)] font-bold tracking-[-0.04em] leading-[1.08] text-gray-900 mb-6 md:mb-8">
          Research accounts.<br>
          Find decision makers.<br>
          Send outreach.
        </h1>

        <p
          class="text-[18px] md:text-[20px] text-gray-400 max-w-[580px] mx-auto leading-relaxed font-normal mb-10 md:mb-12">
          AI-powered pipeline that converts a company name into researched, personalized outreach. No credit card.
        </p>

        <div class="flex items-center justify-center gap-3 md:gap-5">
          <button
            class="btn-clip-desktop inline-flex items-center justify-center gap-2 font-semibold rounded-[10px] cursor-pointer whitespace-nowrap px-5 md:px-8 py-3.5 text-[15px] bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.97] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            @click="$emit('ctaClick')">
            Start free
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" class="opacity-60">
              <path d="M5 10h10M10 5v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <button
            class="group inline-flex items-center gap-3.5 text-[15px] font-medium text-gray-400 hover:text-gray-900 transition-all duration-300 cursor-pointer bg-transparent border-none p-0"
            @click="showVideo = true">
            <span
              class="relative flex items-center justify-center w-[46px] h-[46px] rounded-full border border-gray-200 group-hover:border-gray-900 transition-all duration-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="text-gray-900 ml-0.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            <span>Watch the demo</span>
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
.demo-enter-active,
.demo-leave-active {
  transition: opacity 0.3s ease;
}
.demo-enter-active > div:last-child,
.demo-leave-active > div:last-child {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.demo-enter-from,
.demo-leave-to {
  opacity: 0;
}
.demo-enter-from > div:last-child {
  transform: scale(0.92) translateY(12px);
  opacity: 0;
}
.demo-leave-to > div:last-child {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
