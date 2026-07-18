<template>
  <section
    :id="stage.id"
    class="py-24 lg:py-32 reveal"
    :class="{ 'is-reverse': reverse }"
    aria-labelledby="stage-heading"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-center stage-grid">
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full shadow-sm">
          <span class="text-sm font-semibold text-gray-900">{{ stage.number }}</span>
          <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span class="text-[13px] font-medium uppercase tracking-widest text-gray-500">{{ stage.name }}</span>
        </div>

        <h2 id="stage-heading" class="text-[clamp(2rem,4vw+1rem,3rem)] font-semibold tracking-tight leading-[1.15] text-gray-900 mb-6">{{ stage.title }}</h2>

        <p class="text-[1.125rem] text-gray-500 mb-10 leading-relaxed font-medium tracking-wide">{{ stage.description }}</p>

        <div class="flex flex-col sm:flex-row gap-6 mb-10 p-8 bg-[#fafafa] rounded-[1.5rem] border border-gray-100 shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)]">
          <div class="flex-1">
            <span class="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Input</span>
            <p class="text-[14px] text-gray-700 leading-relaxed m-0 font-medium">{{ stage.input }}</p>
          </div>
          <div class="hidden sm:block w-px bg-gray-200/60"></div>
          <div class="flex-1">
            <span class="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Process</span>
            <p class="text-[14px] text-gray-700 leading-relaxed m-0 font-medium">{{ stage.process }}</p>
          </div>
          <div class="hidden sm:block w-px bg-gray-200/60"></div>
          <div class="flex-1">
            <span class="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Output</span>
            <p class="text-[14px] text-gray-700 leading-relaxed m-0 font-medium">{{ stage.output }}</p>
          </div>
        </div>

        <ul class="list-none p-0 m-0 mb-10 flex flex-col gap-4" aria-label="Key capabilities">
          <li v-for="feature in stage.features" :key="feature" class="flex items-start gap-4 text-[15px] font-medium text-gray-700 leading-relaxed">
            <div class="shrink-0 mt-1 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-gray-900" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            {{ feature }}
          </li>
        </ul>

        <div class="flex items-baseline gap-3 pt-8 border-t border-gray-100">
          <span class="text-5xl font-semibold tracking-tight leading-none text-gray-900">{{ stage.metric.value }}</span>
          <span class="text-[13px] font-medium text-gray-500 uppercase tracking-widest">{{ stage.metric.label }}</span>
        </div>
      </div>

      <div aria-hidden="true" class="relative group">
        <div class="absolute -inset-4 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
        <div class="relative aspect-[4/3] lg:aspect-[4/3.5] rounded-[2rem] border border-gray-100/50 overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.08)] bg-white transform transition-transform duration-700 group-hover:-translate-y-2">
          <div class="absolute inset-0 opacity-[0.03]" :style="{ background: stage.visualBg }"></div>
          <img
            :src="stage.visualImage"
            :alt="stage.visualAlt"
            class="relative w-full h-full object-cover mix-blend-multiply"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Stage {
  id: string
  number: string
  name: string
  title: string
  description: string
  input: string
  process: string
  output: string
  features: string[]
  metric: { value: string; label: string }
  visualBg: string
  visualImage: string
  visualAlt: string
}

interface Props {
  stage: Stage
  reverse?: boolean
}

defineProps<Props>()
</script>

<style scoped>
@media (min-width: 1024px) {
  .is-reverse .stage-grid > div:first-child {
    order: 2;
  }
  .is-reverse .stage-grid > div:last-child {
    order: 1;
  }
}
</style>
