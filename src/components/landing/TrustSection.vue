<template>
  <section class="trust-section section reveal" aria-labelledby="trust-heading">
    <div class="container">
      <header class="section-header">
        <h2 id="trust-heading" class="section-title">Used by growing teams</h2>
        <p class="section-subtitle">SDRs, founders, and growth teams at B2B companies</p>
      </header>

      <div class="trust-logos reveal-stagger" aria-hidden="true">
        <img v-for="logo in logos" :key="logo.name" :src="logo.src" :alt="logo.alt" class="trust-logo reveal" loading="lazy" />
      </div>

      <div class="trust-metrics reveal-stagger" aria-label="Key metrics">
        <div class="trust-metric reveal" v-for="metric in metrics" :key="metric.label">
          <span class="metric">{{ metric.value }}</span>
          <span class="metric-label">{{ metric.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const logos = [
  { name: 'Acme', src: '/logos/acme.svg', alt: 'Acme Corporation' },
  { name: 'Globex', src: '/logos/globex.svg', alt: 'Globex Corporation' },
  { name: 'Initech', src: '/logos/initech.svg', alt: 'Initech' },
  { name: 'Wayne', src: '/logos/wayne.svg', alt: 'Wayne Enterprises' },
  { name: 'Stark', src: '/logos/stark.svg', alt: 'Stark Industries' },
]

const metrics = [
  { value: '2,400+', label: 'Leads researched this month' },
  { value: '15K+', label: 'Pain points identified' },
  { value: '8.2K', label: 'Decision makers found' },
  { value: '3.2x', label: 'Average reply rate lift' },
]
</script>

<style scoped>
.trust-section {
  padding-top: var(--space-20);
  padding-bottom: var(--space-20);
}

.section-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto var(--space-16);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw + 1rem, 2.5rem);
  font-weight: 600;
  line-height: var(--leading-tight);
  color: var(--color-heading);
  margin: 0 0 var(--space-3);
}

.section-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  margin: 0;
  max-width: none;
}

.trust-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-12);
  margin-bottom: var(--space-20);
  opacity: 0.5;
  filter: grayscale(1);
  transition: opacity var(--duration-normal) var(--ease-out), filter var(--duration-normal) var(--ease-out);
}

.trust-logos:hover {
  opacity: 0.8;
  filter: grayscale(0);
}

.trust-logo {
  height: 32px;
  width: auto;
  max-width: 140px;
}

.trust-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
  max-width: 800px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .trust-metrics {
    grid-template-columns: repeat(4, 1fr);
  }
}

.trust-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
}
</style>