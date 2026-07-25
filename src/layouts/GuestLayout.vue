<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen relative overflow-hidden font-body selection:bg-gray-900/10 selection:text-gray-900"
    :style="{ background: 'linear-gradient(145deg, #f8f7f5 0%, #f5f4f2 30%, #f0efed 60%, #f8f7f5 100%)' }">

    <!-- Background texture -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute inset-0 opacity-[0.35]"
        :style="{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)',
        }" />
    </div>

    <!-- Left: Fixed abstract art panel -->
    <div class="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-1/2 xl:w-[55%] lg:items-center lg:justify-center overflow-hidden bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30">
      <!-- Abstract composition -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full animate-float-slow"
          :style="{ background: 'radial-gradient(circle at 40% 40%, rgba(251,191,36,0.12) 0%, rgba(217,119,6,0.04) 50%, transparent 70%)' }" />
        <div class="absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full animate-float-slower"
          :style="{ background: 'radial-gradient(circle at 60% 60%, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 65%)' }" />
        <div class="absolute top-1/4 -right-20 w-[300px] h-[300px] rounded-full animate-glow"
          :style="{ background: 'radial-gradient(circle at center, rgba(251,191,36,0.08) 0%, transparent 60%)' }" />
        <div class="absolute top-[15%] left-[20%] w-16 h-16 rounded-full animate-float"
          :style="{ background: 'radial-gradient(circle at center, rgba(251,191,36,0.15) 0%, transparent 70%)' }" />
        <div class="absolute bottom-[25%] right-[15%] w-24 h-24 rounded-full animate-float-slow"
          :style="{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, transparent 70%)' }" />
        <div class="absolute top-[60%] left-[10%] w-12 h-12 rounded-full animate-float-slower"
          :style="{ background: 'radial-gradient(circle at center, rgba(217,119,6,0.1) 0%, transparent 70%)' }" />
        <div class="absolute top-[28%] right-[25%] w-[200px] h-[200px] rounded-full animate-rotate"
          :style="{ border: '1px solid rgba(251,191,36,0.08)' }" />
        <div class="absolute bottom-[35%] left-[18%] w-[140px] h-[140px] rounded-full animate-rotate"
          :style="{ border: '1px solid rgba(99,102,241,0.05)', animationDirection: 'reverse', animationDuration: '30s' }" />
        <div class="absolute top-[45%] left-[35%] w-[80px] h-[80px] rounded-full animate-rotate"
          :style="{ border: '1px solid rgba(217,119,6,0.06)', animationDuration: '15s' }" />
        <div class="absolute bottom-[15%] right-[30%] w-32 h-32 rotate-45 opacity-[0.04] rounded-3xl"
          :style="{ background: 'linear-gradient(135deg, rgba(251,191,36,0.3) 0%, transparent 100%)' }" />
      </div>

      <!-- Logo + tagline -->
      <div class="relative z-10 flex flex-col items-center text-center px-12">
        <router-link to="/" class="inline-flex items-center gap-2.5 text-gray-900 no-underline mb-8 group">
          <div class="w-9 h-9 rounded-[10px] flex items-center justify-center bg-white/60 backdrop-blur-sm border border-gray-200/50 group-hover:bg-white/90 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" class="text-gray-900">
              <rect width="32" height="32" rx="6" fill="currentColor" />
              <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </div>
        </router-link>
        <h2 class="text-[28px] xl:text-[32px] font-bold tracking-[-0.03em] leading-tight text-gray-900 max-w-xs">
          Turn companies into conversations.
        </h2>
        <p class="mt-3 text-sm text-gray-400 max-w-[260px]">AI-powered pipeline from research to outreach.</p>
      </div>
    </div>

    <!-- Right: Form panel -->
    <div class="relative z-10 min-h-screen lg:ml-[50%] xl:ml-[55%] flex items-center justify-center p-6 sm:p-8 lg:p-12" style="zoom: 0.85">
      <div class="w-full max-w-[416px]">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center mb-8 pt-2">
          <router-link to="/" class="inline-flex items-center gap-2.5 text-gray-900 no-underline">
            <div class="w-9 h-9 rounded-[10px] flex items-center justify-center"
              :style="{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none" class="text-gray-900">
                <rect width="32" height="32" rx="6" fill="currentColor" />
                <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </div>
            <span class="text-[18px] font-bold tracking-tight">Lead Gen</span>
          </router-link>
        </div>

        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.99);
}
</style>
