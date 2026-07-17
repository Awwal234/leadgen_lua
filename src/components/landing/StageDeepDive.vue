<template>
  <section
    :id="stage.id"
    class="py-24 lg:py-32 reveal"
    :class="{ 'is-reverse': reverse }"
    aria-labelledby="stage-heading"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start stage-grid">
      <div>
        <div class="inline-flex items-center gap-2 mb-4">
          <span class="font-display text-2xl font-bold text-black">{{ stage.number }}</span>
          <span class="text-sm font-medium uppercase tracking-wider text-gray-500">{{ stage.name }}</span>
        </div>

        <h2 id="stage-heading" class="font-display text-[clamp(1.75rem,3vw+1rem,2.5rem)] font-semibold leading-tight text-gray-900 mb-4">{{ stage.title }}</h2>

        <p class="text-lg text-gray-500 mb-8 max-w-[55ch] leading-relaxed">{{ stage.description }}</p>

        <div class="flex flex-col sm:flex-row gap-5 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex-1">
            <span class="block text-xs font-semibold uppercase tracking-wider text-black mb-1">Input</span>
            <p class="text-sm text-gray-700 leading-relaxed m-0">{{ stage.input }}</p>
          </div>
          <div class="flex-1">
            <span class="block text-xs font-semibold uppercase tracking-wider text-black mb-1">Process</span>
            <p class="text-sm text-gray-700 leading-relaxed m-0">{{ stage.process }}</p>
          </div>
          <div class="flex-1">
            <span class="block text-xs font-semibold uppercase tracking-wider text-black mb-1">Output</span>
            <p class="text-sm text-gray-700 leading-relaxed m-0">{{ stage.output }}</p>
          </div>
        </div>

        <ul class="list-none p-0 m-0 mb-8 flex flex-col gap-3" aria-label="Key capabilities">
          <li v-for="feature in stage.features" :key="feature" class="flex items-start gap-3 text-base text-gray-700 leading-relaxed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-[2px] text-black" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ feature }}
          </li>
        </ul>

        <div class="flex items-baseline gap-3 pt-6 border-t border-gray-200">
          <span class="font-display text-4xl font-bold leading-tight text-gray-900">{{ stage.metric.value }}</span>
          <span class="text-xs text-gray-500 uppercase tracking-wider">{{ stage.metric.label }}</span>
        </div>
      </div>

      <div aria-hidden="true">
        <div class="aspect-[4/3] rounded-2xl border border-gray-200 overflow-hidden shadow-lg" :style="{ background: stage.visualBg }">
          <img
            :src="stage.visualImage"
            :alt="stage.visualAlt"
            class="w-full h-full object-cover"
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
