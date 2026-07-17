<script setup lang="ts">
import PublicNav from '@/components/landing/PublicNav.vue'
</script>

<template>
  <div class="public-layout">
    <PublicNav />
    <main class="public-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.public-main {
  flex: 1;
}


</style>