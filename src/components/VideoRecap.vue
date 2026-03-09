<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const sectionRef = ref(null);
const videoRef = ref(null);
const scale = ref(0.85);
const borderRadius = ref(24);

const updateScale = () => {
  if (!sectionRef.value) return;
  const rect = sectionRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  // Increase multiplier to 2.0 to make it reach full width twice as fast
  const scrollProgress = Math.max(0, Math.min(1, (-rect.top * 2.0) / (rect.height - viewportHeight)));
  scale.value = 0.85 + (scrollProgress * 0.15);
  borderRadius.value = 24 * (1 - scrollProgress);
};

onMounted(() => {
  window.addEventListener('scroll', updateScale);
  updateScale();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScale);
});
</script>

<template>
  <section ref="sectionRef" class="video-recap-wrapper">
    <div class="recap-header">
      <div class="container header-content">
        <h2 class="recap-title">REKAP <span class="accent">2026</span></h2>
        <p class="recap-desc">Momen gila di Silaturahmi Vol.2. Kita ulang lagi di 2027!</p>
      </div>
    </div>
    <div class="sticky-container">
      <div 
        class="video-container" 
        :style="{ 
          transform: `scale(${scale})`,
          borderRadius: `${borderRadius}px`
        }"
      >
        <video 
          ref="videoRef"
          autoplay 
          muted 
          loop 
          playsinline 
          class="recap-video"
          src="/recap/recap (1).mp4"
        >
        </video>
      </div>
    </div>
  </section>
</template>

<style scoped>
.video-recap-wrapper {
  height: 250vh;
  background: var(--color-black);
  position: relative;
}
.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center; /* Back to centered alignment */
  justify-content: center;
  overflow: hidden;
}
.recap-header {
  width: 100%;
  padding-top: 1rem; /* Reduced space to bring it closer to the button above */
  margin-bottom: 2rem;
  z-index: 2;
  position: relative;
}
.header-content {
  text-align: center;
}
.video-container {
  width: 100%;
  height: 100%; /* Restored to full height */
  overflow: hidden;
  position: relative;
  transition: transform 0.1s ease-out, border-radius 0.1s ease-out;
  will-change: transform, border-radius;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.recap-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recap-title {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 10vw, 8rem);
  color: var(--color-white);
  line-height: 1;
  margin-bottom: 1rem;
}
.recap-title .accent {
  color: var(--color-primary);
}
.recap-desc {
  color: rgba(255,255,255,0.7);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .video-recap-wrapper {
    height: auto;
    padding-bottom: 3rem;
  }
  .recap-header {
    padding-top: 0;
    margin-top: 0;
    border-top: none;
  }
  .recap-title {
    font-size: 3rem;
  }
  .sticky-container {
    position: relative;
    height: auto;
    display: block;
  }
  .video-container {
    height: auto;
    aspect-ratio: 16 / 9;
    width: calc(100% - 2rem);
    margin: 0 auto;
    transform: none !important;
    border-radius: 16px !important;
  }
}
</style>
