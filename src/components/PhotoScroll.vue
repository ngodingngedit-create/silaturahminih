<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { defaultGalleryPhotos } from '../data/gallery.js'

const STORAGE_KEY = 'silaturahmi_gallery'

function loadPhotos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

const allPhotos = ref(loadPhotos())

function onStorage() { allPhotos.value = loadPhotos() }
onMounted(() => window.addEventListener('storage', onStorage))
onUnmounted(() => window.removeEventListener('storage', onStorage))

const placeholders = defaultGalleryPhotos

const scrollItems = computed(() => {
  const base = allPhotos.value.length > 0 ? allPhotos.value : placeholders
  const repeated = base.length < 5 ? [...base, ...base, ...base] : [...base, ...base]
  return repeated
})

function getRotation(id) {
  const seed = typeof id === 'number' ? id : [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)
  return ((seed % 13) - 6)
}

function getTapePos(id) {
  const seed = typeof id === 'number' ? id : [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)
  const positions = ['ps-tape-left', 'ps-tape-center', 'ps-tape-right']
  return positions[seed % 3]
}
</script>

<template>
  <section class="ps-section">
    <div class="ps-head container">
      <div>
        
        <h2 class="ps-title">GALERI KENANGAN</h2>
      </div>
      <RouterLink to="/gallery" class="ps-cta">
        LIHAT SEMUA →
      </RouterLink>
    </div>

    <div class="ps-strip-wrap">
      <div class="ps-strip">
        <div
          v-for="(photo, i) in scrollItems"
          :key="`${photo.id}-${i}`"
          class="ps-polaroid"
          :class="getTapePos(photo.id)"
          :style="{ '--rot': getRotation(photo.id) + 'deg' }"
        >
          <div class="ps-tape"></div>
          <div class="ps-img-wrap">
            <img :src="photo.src" :alt="photo.caption" class="ps-img" loading="lazy" />
          </div>
          <div class="ps-body">
            <p class="ps-caption">{{ photo.caption }}</p>
            <span v-if="photo.ig" class="ps-ig">@{{ photo.ig }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ps-section {
  background: var(--color-black);
  padding: 5rem 0 6rem;
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.ps-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.ps-eyebrow {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.ps-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--color-white);
  margin: 0;
}

.ps-cta {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--color-black);
  background: var(--color-primary);
  padding: 0.6rem 1.5rem;
  text-decoration: none;
  transition: var(--transition-normal);
  white-space: nowrap;
  border-radius: var(--radius-sm);
}
.ps-cta:hover { transform: translateY(-2px); opacity: 0.9; }

/* Strip */
.ps-strip-wrap {
  width: 100%;
  overflow: hidden;
}

.ps-strip {
  display: flex;
  gap: 2.5rem;
  padding: 2rem 1rem 3rem;
  animation: scroll-left 50s linear infinite;
}

.ps-strip:hover { animation-play-state: paused; }

/* Polaroid mini card */
.ps-polaroid {
  --rot: 0deg;
  flex-shrink: 0;
  width: 220px;
  background: var(--color-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.6rem 0.6rem 1.5rem;
  position: relative;
  transform: rotate(var(--rot));
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
  cursor: default;
}

.ps-polaroid:hover {
  transform: rotate(0deg) translateY(-12px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.ps-tape {
  position: absolute;
  top: -10px;
  width: 45px; height: 14px;
  background: rgba(255,221,0,0.55);
  transform: rotate(-2deg);
  left: 50%; translate: -50% 0;
  border-radius: 1px;
}

.ps-tape-left .ps-tape  { left: 20%;  transform: rotate(-5deg); }
.ps-tape-center .ps-tape { left: 50%; transform: rotate(1deg); }
.ps-tape-right .ps-tape  { left: 70%; transform: rotate(4deg); }

.ps-img-wrap {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-black);
}

.ps-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.3s;
}
.ps-polaroid:hover .ps-img { filter: grayscale(0.2); }

.ps-body {
  padding: 0.75rem 0 0;
}

.ps-caption {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ps-ig {
  font-size: 0.7rem;
  color: var(--color-primary);
  font-weight: 700;
  margin-top: 0.4rem;
  display: block;
}

@keyframes scroll-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@media (max-width: 768px) {
  .ps-section { padding: 3rem 0 3rem; margin-top: 0; }
  .ps-head { margin-bottom: 1.5rem; gap: 0.75rem; }
  .ps-strip { padding-top: 1rem; }
}
</style>
