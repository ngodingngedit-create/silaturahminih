<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const sectionRef = ref(null);
const scale = ref(0.85);
const borderRadius = ref(24);
const isMuted = ref(true);
const desktopFrame = ref(null);
const mobileFrame = ref(null);

function postMute(frame, mute) {
  try {
    frame?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: mute ? 'mute' : 'unMute', args: [] }),
      '*'
    );
  } catch { /* ponytail: ignore cross-origin post errors */ }
}

function postPlay(frame) {
  try {
    frame?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*'
    );
  } catch { /* ponytail: ignore cross-origin post errors */ }
}

function tryAutoplay() {
  postMute(desktopFrame.value, true);
  postMute(mobileFrame.value, true);
  postPlay(desktopFrame.value);
  postPlay(mobileFrame.value);
}
function toggleMute() {
  const next = !isMuted.value;
  isMuted.value = next;
  postMute(desktopFrame.value, next);
  postMute(mobileFrame.value, next);
}

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
  window.addEventListener('scroll', updateScale, { passive: true });
  updateScale();
  tryAutoplay();
  window.addEventListener('pointerdown', tryAutoplay);
  window.addEventListener('touchstart', tryAutoplay, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScale);
  window.removeEventListener('pointerdown', tryAutoplay);
  window.removeEventListener('touchstart', tryAutoplay);
});
</script>

<template>
  <section ref="sectionRef" class="video-recap-wrapper">
    <div class="recap-header">
      <div class="container header-content">
        <h2 class="recap-title">REKAP <span class="accent">2026</span></h2>
        <p class="recap-desc">MOMEN GILA DI SILATURAHMI VOL.2. KITA ULANG LAGI DI 2027!</p>
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
        <iframe
          ref="desktopFrame"
          class="recap-video recap-desktop"
          src="https://www.youtube.com/embed/U-BK5xf04yg?autoplay=1&mute=1&loop=1&playlist=U-BK5xf04yg&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <iframe
          ref="mobileFrame"
          class="recap-video recap-mobile"
          src="https://www.youtube.com/embed/qx04Iu0GE-E?autoplay=1&mute=1&loop=1&playlist=qx04Iu0GE-E&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          title="YouTube Shorts player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <!-- <button class="recap-mute" :class="{ off: isMuted }" @click="toggleMute" :aria-label="isMuted ? 'Nyalakan suara' : 'Matikan suara'">
          <svg v-if="isMuted" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </button> -->
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
  background: #000;
  transition: transform 0.1s ease-out, border-radius 0.1s ease-out;
  will-change: transform, border-radius;
  border: none;
  box-shadow: none;
}
.recap-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 56.25vw; /* 16:9 aspect ratio */
  min-height: 100vh;
  min-width: 177.77vh; /* 16:9 aspect ratio */
  transform: translate(-50%, -50%) scale(1.35); /* Scale up to crop black bars embedded in source video */
  border: none;
  pointer-events: none;
}
.recap-mobile { display: none; }
.recap-mute {
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 3;
  width: 42px;
  height: 42px;
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
.recap-mute:hover { background: var(--color-primary); border-color: var(--color-primary); color: #000; }

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
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  max-width: 600px;
  margin: 0 auto;
}
@media (max-width: 768px) {
  .video-recap-wrapper {
    height: 250vh;
    padding-bottom: 0;
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
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .video-container {
    width: 100%;
    height: 100%;
    aspect-ratio: auto;
    max-width: none;
    margin: 0;
    transform-origin: center;
    border-radius: 0 !important;
    border: none;
    box-shadow: none;
  }
  .recap-desktop { display: none; }
  .recap-mobile {
    display: block;
    top: 50%;
    left: 50%;
    width: 177.78vh;
    height: 100vh;
    min-height: 100vh;
    min-width: 177.78vh;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .recap-chrome-mask { display: none; }
}
</style>
