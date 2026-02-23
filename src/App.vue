<script setup>
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <div class="app-wrapper">
    <TheNavbar />
    <main>
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
</style>
