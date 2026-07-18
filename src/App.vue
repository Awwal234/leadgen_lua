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


<style>
/* Firefox */
html {
  scrollbar-width: thin;
  scrollbar-color: #b8b8b8 transparent;
}

body {
  font-family: "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Chrome, Edge, Safari */
html::-webkit-scrollbar {
  width: 12px;
}

html::-webkit-scrollbar-track {
  background: transparent;
}

html::-webkit-scrollbar-thumb {
  background: #c8c8c8;
  border-radius: 999px;
  border: 3px solid #fff;
}

html::-webkit-scrollbar-thumb:hover {
  background: #9a9a9a;
}

html::-webkit-scrollbar-thumb:active {
  background: #7a7a7a;
}

button {
  cursor: pointer;
  border-radius: 6px;
  padding: 6px 16px;
}

/*  */
@font-face {
  font-family: "Helvetica Neue";
  src: url("./fonts/HelveticaNeueLight.otf") format("opentype");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("./fonts/HelveticaNeueRegular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("./fonts/HelveticaNeueMedium.otf") format("opentype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("./fonts/HelveticaNeueBold.otf") format("opentype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Helvetica Neue";
  src: url("./fonts/HelveticaNeueBlack.otf") format("opentype");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

/*  */
</style>
