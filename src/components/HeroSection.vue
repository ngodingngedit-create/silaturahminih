<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const slides = [
  '/foot looping beranda/HRS00841.jpg',
  '/foot looping beranda/HRS01545.jpg',
  '/foot looping beranda/HRS01879.jpg',
  '/foot looping beranda/HRS02450.jpg',
  '/foot looping beranda/HRS00699.jpg',
  '/foot looping beranda/HRS05245.jpg',
  '/foot looping beranda/HRS07279.jpg',
  '/foot looping beranda/HRS02460.jpg',
]

const currentSlide = ref(0)
let intervalId = null

function goToSlide(index) {
  currentSlide.value = index
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function startAutoplay() {
  intervalId = setInterval(nextSlide, 4000)
}

function stopAutoplay() {
  clearInterval(intervalId)
}

onMounted(() => startAutoplay())
onUnmounted(() => stopAutoplay())
</script>

<template>
  <section class="hero">
    <!-- Background Texture/Color -->
    <div class="hero-bg">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="slide"
        :class="{ active: index === currentSlide }"
        :style="{ backgroundImage: `url('${slide}')` }"
      ></div>
      <div class="hero-bg-pattern"></div>
    </div>

    <!-- Poster Content (Simplified Layout) -->
    <div class="hero-content">
      <div class="content-inner">
        <div class="logo-wrapper">
          <img src="/silaturahmi.png" alt="Silaturahmi Festival 2027" class="hero-logo" />
        </div>
        
        <div class="info-block">
          <h2 class="hero-date">COMING SOON VOL 3</h2>
          <span class="event-year">2027</span>
          <p class="hero-venue">TO BE ANNOUNCED</p>
          <div class="hero-slogan">"TAGLINE TBA"</div>
        </div>

        <div class="hero-actions">
          <button class="btn btn-yellow" @click="router.push('/tickets')">BELI TIKET</button>
          <button class="btn btn-white" @click="router.push('/lineup')">LIHAT LINEUP</button>
        </div>
      </div>
    </div>

    <!-- Slide Indicators removed as requested -->
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 2rem 60px;
  overflow: hidden;
  background: var(--color-black);
}

/* Background */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.slide.active { opacity: 0.4; }

.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--color-primary) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.1;
  z-index: 1;
}

/* Poster Layout */
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
  text-align: center;
  animation: posterIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.content-inner {
  position: relative;
  padding: 2rem;
}

.logo-wrapper {
  margin-bottom: 2rem;
  display: block;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}

.hero-logo {
  max-width: min(550px, 90vw);
  height: auto;
  filter: drop-shadow(0 0 30px rgba(255, 230, 0, 0.2));
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
}

.info-block {
  margin-bottom: 3rem;
}

.hero-date {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  color: var(--color-white);
  line-height: 1;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.hero-venue {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: var(--color-white);
  opacity: 0.8;
  margin-bottom: 2.5rem;
  text-transform: uppercase;
}

.hero-slogan {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-black);
  padding: 0.6rem 1.5rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  border-radius: 100px;
  text-transform: uppercase;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-white {
  background: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
}
.btn-white:hover {
  background: transparent;
  color: var(--color-white);
}

/* Indicators */
.slide-labels {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.label-btn {
  background: var(--color-white);
  border: 2px solid var(--color-black);
  padding: 0.3rem 0.8rem;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.label-btn.active {
  background: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 2px 2px 0 var(--color-black);
}

@keyframes posterIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 768px) {
  .hero-content { width: 100%; }
  .logo-wrapper { margin-bottom: 1.5rem; }
  .hero-logo { 
    max-width: 85vw; 
    margin: 0 auto; 
    animation: float-mobile 6s ease-in-out infinite;
  }
  .hero-actions { flex-direction: column; gap: 1rem; }
  .btn { width: 100%; }
}

@keyframes float-mobile {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
