<template>
  <div class="flex flex-col gap-3 w-full">
    <div v-for="i in count" :key="i" class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm w-full flex flex-col gap-3 relative overflow-hidden shimmer-container">
      <div class="shimmer-overlay"></div>
      
      <div class="flex items-center gap-3 relative z-0">
        <div class="w-10 h-10 rounded-full bg-gray-200/60"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-200/60 rounded w-1/3"></div>
          <div class="h-2 bg-gray-200/60 rounded w-1/4"></div>
        </div>
      </div>
      <div class="space-y-2 pt-2 relative z-0">
        <div class="h-2 bg-gray-200/60 rounded w-full"></div>
        <div class="h-2 bg-gray-200/60 rounded w-5/6"></div>
        <div class="h-2 bg-gray-200/60 rounded w-4/6"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 1
  }
})
</script>

<style scoped>
.shimmer-container {
  background-color: #fcfcfc;
}

.shimmer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
  z-index: 10;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
