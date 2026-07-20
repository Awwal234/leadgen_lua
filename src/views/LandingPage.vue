<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroSection from '@/components/landing/HeroSection.vue'
import PipelineOverview from '@/components/landing/PipelineOverview.vue'
import StageResearch from '@/components/landing/StageResearch.vue'
import StagePainPoints from '@/components/landing/StagePainPoints.vue'
import StageDecisionMakers from '@/components/landing/StageDecisionMakers.vue'
import StageOutreach from '@/components/landing/StageOutreach.vue'
import FAQSection from '@/components/landing/FAQSection.vue'
import FooterCTA from '@/components/landing/FooterCTA.vue'
import PublicFooter from '@/components/landing/PublicFooter.vue'
import StickyCTABar from '@/components/landing/StickyCTABar.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const router = useRouter()
const showStickyCTA = ref(false)

useScrollReveal()

function handleScroll() {
  const scrollY = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0

  if (scrollPercent > 0.3 && scrollPercent < 0.95) {
    showStickyCTA.value = true
  } else {
    showStickyCTA.value = false
  }
}

function scrollToRegister() {
  router.push('/register')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <main class="landing-page">
    <HeroSection @cta-click="scrollToRegister" />

    <PipelineOverview />

    <StageResearch />

    <StagePainPoints />

    <StageDecisionMakers />

    <StageOutreach />

    <FAQSection />

    <FooterCTA @cta-click="scrollToRegister" />

    <PublicFooter />

    <StickyCTABar :class="{ 'is-visible': showStickyCTA }" @cta-click="scrollToRegister" />
  </main>
</template>

<style>
.landing-page {
  min-height: 100vh;
}
</style>
