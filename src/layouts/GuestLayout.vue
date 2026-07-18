<script setup lang="ts"></script>

<template>
  <div
    class="min-h-[100vh] bg-[#f6f9fc] flex items-center justify-center p-4 sm:p-8 font-body selection:bg-[#635BFF]/20 selection:text-[#32325D]">
    <div class="w-full max-w-[420px] animate-stripe-fade-in-up">
      <div class="text-center mb-8">
        <h1 class="text-[28px] font-bold tracking-tight text-[#32325D]">
          <router-link to="/" class="hover:opacity-70 transition-opacity" style="color: inherit">Lead Gen</router-link>
        </h1>
      </div>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.animate-stripe-fade-in-up {
  animation: stripeFadeInUp 0.8s var(--ease-stripe-spring) both;
}

@keyframes stripeFadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
