<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'

const soundOn = ref(true)
const bgmAudio = ref(null)

function unlockBgm() {
  if (!soundOn.value) return
  bgmAudio.value?.play().catch(() => {})
}

function toggleBgm() {
  soundOn.value = !soundOn.value
  if (!bgmAudio.value) return
  if (soundOn.value) {
    bgmAudio.value.muted = false
    bgmAudio.value.play().catch(() => {})
  } else {
    bgmAudio.value.pause()
  }
}

onMounted(() => {
  if (bgmAudio.value) {
    bgmAudio.value.volume = 1
    bgmAudio.value.play().catch(() => {})
  }
  window.addEventListener('pointerdown', unlockBgm)
  window.addEventListener('keydown', unlockBgm)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', unlockBgm)
  window.removeEventListener('keydown', unlockBgm)
})
</script>

<template>
  <div class="app-wrapper">
    <audio
      ref="bgmAudio"
      src="/BARENG-BARENG-SILATURAHMI.mp3"
      autoplay
      loop
      preload="auto"
    ></audio>
    <button class="bgm-btn" @click="toggleBgm" :aria-label="soundOn ? 'Matikan backsound' : 'Nyalakan backsound'">
      <svg v-if="soundOn" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
      <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
    </button>
    <TheNavbar />
    <main>
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.bgm-btn {
  position: fixed;
  right: 1rem;
  bottom: 3rem;
  z-index: 800;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(4px);
}
.bgm-btn:hover { background: var(--color-primary); border-color: var(--color-primary); color: #000; }
@media (max-width: 600px) {
  .bgm-btn { bottom: 7rem; }
}
</style>
<style>
body.cart-sheet-open .bgm-btn {
  opacity: 0;
  pointer-events: none;
}
</style>
