<script setup>
import { ref } from 'vue'
import { lineupVols } from '../data/lineup.js'

const vols = ref(lineupVols)

const selected = ref(null)
const activeTab = ref('about')
const dragY = ref(0)
const dragging = ref(false)
let dragStartY = 0

function toggleVol(v) { v.open = !v.open }
function onGrabStart(e) {
  dragging.value = true
  dragStartY = e.touches ? e.touches[0].clientY : e.clientY
}
function onGrabMove(e) {
  if (!dragging.value) return
  const y = e.touches ? e.touches[0].clientY : e.clientY
  dragY.value = Math.max(0, y - dragStartY)
}
function onGrabEnd() {
  if (!dragging.value) return
  dragging.value = false
  if (dragY.value > 110) closeArtist()
  dragY.value = 0
}
function openArtist(a) {
  selected.value = a
  activeTab.value = 'about'
  dragY.value = 0
  dragging.value = false
  document.body.style.overflow = 'hidden'
}
function closeArtist() {
  selected.value = null
  dragY.value = 0
  dragging.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <section class="lineup-content">
    <div class="container lu-wrap">
      <h1 class="lu-title">LINEUP</h1>

      <div v-for="v in vols" :key="v.id" class="lu-vol">
        <button class="lu-vol-head" @click="toggleVol(v)" :aria-expanded="v.open">
          <span class="lu-vol-label">{{ v.label }}</span>
          <span class="lu-vol-meta">
            <span v-if="v.coming" class="lu-coming">COMING SOON</span>
            <span v-else class="lu-count">{{ v.artists.length }} ARTIS</span>
            <span class="lu-chev" :class="{ open: v.open }">›</span>
          </span>
        </button>

        <div v-show="v.open" class="lu-body">
          <div v-if="v.coming" class="lu-soon">COMING SOON</div>
          <div v-else class="lu-grid">
            <article v-for="(a, i) in v.artists" :key="i" class="lu-card" @click="openArtist(a)">
              <div class="lu-img-wrap">
                <img :src="a.image" :alt="a.name" loading="lazy" />
                <div class="lu-overlay">
                  <div class="lu-name" :title="a.name">{{ a.name }}</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Transition name="sheet">
    <div v-if="selected" class="lu-modal" @click.self="closeArtist">
      <div
        class="lu-modal-card"
        :style="dragY ? { transform: `translateY(${dragY}px)` } : null"
        :class="{ dragging }"
      >
        <button class="lu-close" @click="closeArtist">✕</button>
        <div
          class="lu-grab"
          @mousedown="onGrabStart"
          @mousemove="onGrabMove"
          @mouseup="onGrabEnd"
          @mouseleave="onGrabEnd"
          @touchstart.passive="onGrabStart"
          @touchmove.passive="onGrabMove"
          @touchend="onGrabEnd"
        ><span></span></div>
        <div class="lu-modal-media">
          <img :src="selected.image" :alt="selected.name" />
        </div>
        <div class="lu-modal-info">
          <h3 class="lu-modal-name">{{ selected.name }}</h3>
          <div class="lu-tabs">
            <button :class="{ active: activeTab === 'about' }" @click="activeTab = 'about'">Deskripsi</button>
            <button :class="{ active: activeTab === 'playlist' }" @click="activeTab = 'playlist'">Playlist</button>
          </div>
          <div v-if="activeTab === 'about'" class="lu-about">
            <p class="lu-about-title">About</p>
            <p class="lu-about-text">{{ selected.about }}</p>
            <div class="lu-socmed">
              <a :href="`https://instagram.com/${selected.social.ig}`" target="_blank" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a :href="`https://youtube.com/c/${selected.social.youtube}`" target="_blank" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a :href="`https://tiktok.com/@${selected.social.tiktok}`" target="_blank" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>
          <div v-else class="lu-playlist">
            <iframe v-if="selected.spotify" :src="selected.spotify" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            <p v-else class="lu-about-text">Playlist Spotify segera hadir.</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.sheet-enter-active .lu-modal-card { transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-leave-active .lu-modal-card { transition: transform 0.35s ease-in; }
.sheet-enter-from .lu-modal-card { transform: translateY(100%); }
.sheet-leave-to .lu-modal-card { transform: translateY(100%); }
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.3s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.lineup-content { padding: 7rem 0 5rem; background: var(--color-black); min-height: 100vh; }
.lu-wrap { max-width: 1400px; }
.lu-title { font-size: clamp(2.5rem, 7vw, 5rem); color: var(--color-white); text-align: center; margin-bottom: 2.5rem; }
.lu-vol { margin-bottom: 2.5rem; background: none; border: none; }
.lu-vol-head { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: none; border: none; border-bottom: 1px solid rgba(255,255,255,0.12); padding: 1rem 0.25rem; cursor: pointer; color: var(--color-white); font-family: var(--font-heading); font-size: clamp(1.2rem, 3vw, 1.8rem); letter-spacing: 0.05em; }
.lu-vol-meta { display: flex; align-items: center; gap: 0.8rem; font-family: var(--font-body); }
.lu-count { font-size: 0.75rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); }
.lu-coming { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.15em; background: var(--color-primary); color: var(--color-black); padding: 0.3rem 0.8rem; border-radius: 999px; }
.lu-chev { display: inline-block; color: var(--color-primary); font-size: 1.6rem; transform: rotate(-90deg); transition: transform 0.25s ease; }
.lu-chev.open { transform: rotate(90deg); }
.lu-body { padding: 1.5rem 0 0; overflow: hidden; }
.lu-grid { display: flex; gap: 1.2rem; overflow-x: auto; padding-bottom: 1rem; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: var(--color-primary) rgba(255,255,255,0.08); }
.lu-grid::-webkit-scrollbar { height: 8px; }
.lu-grid::-webkit-scrollbar-track { background: rgba(255,255,255,0.08); border-radius: 999px; }
.lu-grid::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 999px; border: 2px solid var(--color-black); }
.lu-grid::-webkit-scrollbar-thumb:hover { filter: brightness(1.1); }
.lu-card { flex: 0 0 200px; scroll-snap-align: start; background: none; border: none; cursor: pointer; }
.lu-img-wrap { position: relative; aspect-ratio: 2/3; overflow: hidden; border-radius: 6px; background: #111; }
.lu-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.lu-card:hover .lu-img-wrap img { transform: scale(1.05); }
.lu-overlay { position: absolute; left: 0; right: 0; bottom: 0; padding: 1.6rem 0.9rem 0.9rem; background: linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.25) 65%, transparent); text-align: left; }
.lu-name { font-family: var(--font-heading); color: #fff; font-size: clamp(0.85rem, 1.1vw, 1rem); line-height: 0.95; text-transform: uppercase; text-shadow: 2px 2px 0 rgba(0,0,0,0.7); white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.lu-soon { text-align: center; font-family: var(--font-heading); font-size: clamp(1.5rem, 5vw, 3rem); color: var(--color-primary); letter-spacing: 0.1em; padding: 3rem 1rem; }
.lu-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; }
.lu-modal-card { background: var(--color-dark-surface); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; width: min(460px, 100%); max-height: 90vh; overflow: auto; display: flex; flex-direction: column; position: relative; touch-action: pan-y; }
.lu-modal-card.dragging { transition: none; }
.lu-grab { display: none; position: absolute; top: 0; left: 0; right: 0; z-index: 3; padding: 0.6rem; cursor: grab; touch-action: none; background: transparent; pointer-events: auto; }
.lu-grab span { display: block; width: 44px; height: 5px; margin: 0 auto; border-radius: 999px; background: rgba(255,255,255,0.7); box-shadow: 0 1px 6px rgba(0,0,0,0.5); }
.lu-close { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; z-index: 2; }
.lu-close:hover { background: var(--color-primary); color: var(--color-black); border-color: var(--color-primary); }
.lu-modal-media { background: #111; margin: 0; padding: 0; line-height: 0; overflow: hidden; border-radius: 8px 8px 0 0; }
.lu-modal-media img { width: 100%; height: 300px; object-fit: cover; display: block; margin: 0; }
.lu-modal-info { padding: 1.5rem; min-width: 0; }
.lu-modal-name { font-size: clamp(1.6rem, 4vw, 2.4rem); color: var(--color-white); margin-bottom: 1rem; }
.lu-tabs { display: flex; gap: 1.5rem; margin-bottom: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.12); }
.lu-tabs button { flex: 0 0 auto; padding: 0.7rem 0.2rem; border: none; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: rgba(255,255,255,0.55); font-family: var(--font-body); font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.78rem; cursor: pointer; margin-bottom: -1px; }
.lu-tabs button.active { background: transparent; border-bottom-color: var(--color-primary); color: var(--color-primary); }
.lu-about-title { font-family: var(--font-body); font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.75rem; color: var(--color-primary); margin-bottom: 0.5rem; }
.lu-about-text { color: rgba(255,255,255,0.75); line-height: 1.6; font-size: 0.95rem; margin-bottom: 1.2rem; }
.lu-socmed { display: flex; gap: 0.7rem; }
.lu-socmed a { width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.15); color: var(--color-white); }
.lu-socmed a:hover { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-black); }
.lu-playlist iframe { border-radius: 6px; border: none; }

@media (max-width: 1024px) {
  .lu-card { flex-basis: 180px; }
  .lu-body { padding: 1.2rem 0 0; }
}
@media (max-width: 640px) {
  .lineup-content { padding: 6rem 0 3rem; }
  .lu-grid { gap: 0.9rem; }
  .lu-card { flex-basis: 150px; }
  .lu-vol-head { padding: 1rem 0.25rem; }
  .lu-body { padding: 1rem 0 0; }
  .lu-count { display: none; }
  .lu-modal { padding: 0; align-items: flex-end; }
  .lu-modal-card { width: 100%; max-height: 88vh; border-radius: 18px 18px 0 0; border-bottom: none; }
  .lu-grab { display: block; }
  .lu-modal-media img { aspect-ratio: 16/10; height: auto; }
  .lu-modal-info { padding: 0.5rem 1.1rem 1.5rem; }
  .lu-playlist iframe { height: 280px; }
}
</style>
