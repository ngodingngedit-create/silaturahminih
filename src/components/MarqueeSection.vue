<script setup>
defineProps({
  text: {
    type: String,
    default: 'SILATURAHMI (VOL 3 - 10 APRIL 2027)'
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
  font-size: 1rem;
  letter-spacing: 0.1em;
  line-height: 1.4;
  display: block;
  width: 100%;
  position: relative;
  z-index: 1;
}

.marquee-content {
  display: inline-flex;
  align-items: center;
  animation: scroll 30s linear infinite;
  padding-left: 0;
  will-change: transform;
}

.marquee-content span {
  display: inline-block;
  padding-right: 1.5rem;
  line-height: 1.4;
  flex-shrink: 0;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@media (max-width: 768px) {
  .marquee-container {
    padding: 0.6rem 0;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    line-height: 1.4;
    overflow: hidden;
  }
  .marquee-content span {
    padding-right: 1rem;
  }
}
</style>
