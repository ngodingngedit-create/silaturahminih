<script setup>
defineProps({
  text: {
    type: String,
    default: 'SILATURAHMI VOL 3 IS COMING SOON 2027'
  }
})
</script>

<template>
  <div class="marquee-container">
    <div class="marquee-content">
      <span v-for="n in 6" :key="n">{{ text }} &bull; </span>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  background-color: var(--color-primary);
  color: var(--color-black);
  overflow: hidden;
  white-space: nowrap;
  padding: 1.2rem 0;
  border: none;
  font-family: var(--font-body);
  font-weight: normal;
  text-transform: uppercase;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
}

.marquee-content {
  display: inline-block;
  animation: scroll 30s linear infinite;
  padding-left: 0;
}

.marquee-content span {
  display: inline-block;
  padding-right: 0;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
