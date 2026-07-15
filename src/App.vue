<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import { setToastListener } from '@/utils/toast'

const primeToast = useToast()

setToastListener((msg) => {
  primeToast.add(msg)
})
</script>

<template>
  <Toast />
  <RouterView />
</template>

<style scoped>
</style>
