<script setup>
import HeroSection from '../components/HeroSection.vue'
import MarqueeSection from '../components/MarqueeSection.vue'
import VideoRecap from '../components/VideoRecap.vue'
import PhotoScroll from '../components/PhotoScroll.vue'
import SpotifySection from '../components/SpotifySection.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { lineupVols } from '../data/lineup.js'

const router = useRouter()

const featuredArtists = (lineupVols.find(v => v.id === 'vol2')?.artists || []).map(a => ({
  ...a,
  description: a.about,
}))

const displayArtists = [...featuredArtists, ...featuredArtists]

const trackRef = ref(null)
const isHovered = ref(false)
let animationId = null
let speed = 0.6 // Slower loop speed

const startLoop = () => {
  const loop = () => {
    if (!isHovered.value && trackRef.value) {
      trackRef.value.scrollLeft += speed
      if (trackRef.value.scrollLeft >= trackRef.value.scrollWidth / 2) {
        trackRef.value.scrollLeft = 0
      }
    }
    animationId = requestAnimationFrame(loop)
  }
  animationId = requestAnimationFrame(loop)
}

onMounted(() => {
  startLoop()
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
})

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

const scrollLeft = () => {
  if (!trackRef.value) return
  trackRef.value.scrollBy({ left: -350, behavior: 'smooth' })
}

const scrollRight = () => {
  if (!trackRef.value) return
  trackRef.value.scrollBy({ left: 350, behavior: 'smooth' })
}

// Modal handling
const selectedArtist = ref(null)
const homeTab = ref('about')
const homeDragY = ref(0)
const homeDragging = ref(false)
let homeDragStartY = 0

function onHomeGrabStart(e) {
  homeDragging.value = true
  homeDragStartY = e.touches ? e.touches[0].clientY : e.clientY
}
function onHomeGrabMove(e) {
  if (!homeDragging.value) return
  const y = e.touches ? e.touches[0].clientY : e.clientY
  homeDragY.value = Math.max(0, y - homeDragStartY)
}
function onHomeGrabEnd() {
  if (!homeDragging.value) return
  homeDragging.value = false
  if (homeDragY.value > 110) closeModal()
  homeDragY.value = 0
}

const openModal = (artist) => {
  selectedArtist.value = artist
  homeTab.value = 'about'
  homeDragY.value = 0
  homeDragging.value = false
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedArtist.value = null
  homeDragY.value = 0
  homeDragging.value = false
  document.body.style.overflow = ''
}

const getSpotifySrc = (url) => {
  if (!url) return ''
  const base = url.split('?')[0]
  return `${base}?utm_source=generator&theme=0`
}
</script>

<template>
  <!-- Hero -->
  <HeroSection />

  <!-- Marquee -->
  <MarqueeSection />

  <!-- Lineup Teaser -->
  <section class="teaser-lineup">
    <!-- Vol 2 -->
    <div class="container">
      <h2 class="teaser-title">LINEUP <span class="accent">VOL 2</span></h2>
      <p class="teaser-sub">Klik card buat lihat detailnya. Untuk Lineup Vol 1 kamu bisa liat di page Lineup.</p>
    </div>

    <div class="container full-bleed">
      <div class="artist-scroller-container" 
           @mouseenter="handleMouseEnter" 
           @mouseleave="handleMouseLeave"
           @touchstart="handleMouseEnter"
           @touchend="handleMouseLeave">
        
        <div class="scroll-area left" :class="{ visible: isHovered }" @click.stop="scrollLeft">
          <button class="scroll-btn">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="artist-track" ref="trackRef">
          <div
            v-for="(artist, i) in displayArtists"
            :key="i"
            class="artist-card"
            @click="openModal(artist)"
          >
            <div class="artist-img-wrapper">
              <img :src="artist.image" :alt="artist.name" class="artist-img" />
              <div class="artist-overlay">
                <h3 class="artist-name" :title="artist.name">{{ artist.name }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="scroll-area right" :class="{ visible: isHovered }" @click.stop="scrollRight">
          <button class="scroll-btn">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="container" style="text-align: center;">
      <button class="btn btn-yellow" @click="router.push('/lineup')">
        LIHAT SEMUA LINEUP
      </button>
    </div>

    <!-- Vol 3 TBA -->
    <!-- <div class="container" style="margin-top: 4rem;">
      <h2 class="teaser-title">LINEUP <span class="accent">VOL 3</span></h2>
      <p class="teaser-sub" style="margin-bottom: 2rem;">TBA</p>

      <div class="teaser-cta">
        <button class="btn btn-yellow" @click="router.push('/lineup')">
          LIHAT LINEUP VOL 1 →
        </button>
      </div>
    </div> -->
  </section>

  <!-- Modal Artist Detail outside the section -->
  <Transition name="home-sheet">
    <div v-if="selectedArtist" class="home-modal" @click.self="closeModal">
      <div
        class="home-modal-card"
        :style="homeDragY ? { transform: `translateY(${homeDragY}px)` } : null"
        :class="{ dragging: homeDragging }"
      >
        <button class="home-close" @click="closeModal">✕</button>
        <div
          class="home-grab"
          @mousedown="onHomeGrabStart"
          @mousemove="onHomeGrabMove"
          @mouseup="onHomeGrabEnd"
          @mouseleave="onHomeGrabEnd"
          @touchstart.passive="onHomeGrabStart"
          @touchmove.passive="onHomeGrabMove"
          @touchend="onHomeGrabEnd"
        ><span></span></div>
        <div class="home-modal-media">
          <img :src="selectedArtist.image" :alt="selectedArtist.name" />
        </div>
        <div class="home-modal-info">
          <h3 class="home-modal-name">{{ selectedArtist.name }}</h3>
          <div class="home-tabs">
            <button :class="{ active: homeTab === 'about' }" @click="homeTab = 'about'">Deskripsi</button>
            <button :class="{ active: homeTab === 'playlist' }" @click="homeTab = 'playlist'">Playlist</button>
          </div>
          <div v-if="homeTab === 'about'" class="home-about">
            <p class="home-about-title">About</p>
            <p class="home-about-text">{{ selectedArtist.description || selectedArtist.about }}</p>
            <div class="home-socmed">
              <a :href="`https://instagram.com/${selectedArtist.social.ig}`" target="_blank" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a :href="`https://youtube.com/c/${selectedArtist.social.youtube}`" target="_blank" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a :href="`https://tiktok.com/@${selectedArtist.social.tiktok}`" target="_blank" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>
          <div v-else class="home-playlist">
            <iframe :src="getSpotifySrc(selectedArtist.spotify)" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <MarqueeSection text="LINEUP VOL 2 • SILATURAHMI FESTIVAL" />

  <!-- Video Recap -->
  <VideoRecap />

  <!-- Ticket Teaser -->
  <section class="teaser-ticket raised">
    <div class="container">
      <div class="ticket-container">
        <div class="tt-content">
          <div class="section-label">DAPETIN TIKETNYA</div>
          <h2 class="teaser-title custom-hardcore-font">TIKET <span class="accent">TERSEDIA</span></h2>
          <p class="teaser-sub">
            Mempererat tali kasih & persaudaraan
          </p>
          
          <div class="tt-prices">
            <div class="price-box featured">
              <span class="pb-label">EARLY BIRD</span>
              <span class="pb-value">50.000</span>
            </div>
            <div class="price-box upcoming">
              <span class="pb-label">PRESALE 1</span>
              <span class="pb-value">SOON</span>
            </div>
            <div class="price-box upcoming">
              <span class="pb-label">PRESALE 2</span>
              <span class="pb-value">SOON</span>
            </div>
            <div class="price-box upcoming">
              <span class="pb-label">PRESALE 3</span>
              <span class="pb-value">SOON</span>
            </div>
            <div class="price-box upcoming-accent">
              <span class="pb-label">REGULER</span>
              <span class="pb-value">SOON</span>
            </div>
          </div>

          <div class="tt-actions">
            <button class="btn btn-pink btn-glitch" @click="router.push('/tickets')">
              LIHAT INFO TIKET 
              <span class="arrow">→</span>
            </button>
          </div>
        </div>
        
        <div class="tt-visual">
          <div class="date-card coming-soon-mode">
            <div class="big-date-hype custom-hardcore-font">STAY<br>TUNED</div>
            <div class="venue-tag hype-tag">
              <span class="loc-icon">✨</span> ANNOUNCING 2027
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Spotify Playlists -->
  <SpotifySection />

  <MarqueeSection text="GALERI KENANGAN • SILATURAHMI FESTIVAL" />

  <!-- Photo Scroll -->
  <PhotoScroll />

  <!-- Vibe / CTA Bottom -->
  <section class="vibe-section">
    <!-- Grunge Overlay -->
    <div class="vibe-noise"></div>
    
    <!-- Decorative Tapes -->
    <div class="tape tape-tl"></div>
    <div class="tape tape-tr"></div>
    <div class="tape tape-bl"></div>
    <div class="tape tape-br"></div>

    <div class="container vibe-container">
      <div class="vibe-poster">
        <div class="stencil-wrap">
          <h2 class="vibe-quote">"MEMPERERAT TALI KASIH & PERSAUDARAAN"</h2>
          <div class="stencil-shadow">"MEMPERERAT TALI KASIH & PERSAUDARAAN"</div>
        </div>
        
        <div class="vibe-actions">
          <button class="btn vibe-btn btn-sticker-white" @click="router.push('/lineup')">
            <span class="btn-text">LIHAT LINEUP</span>
            <span class="sticker-tail"></span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>
/* ---- Common Section Styles ---- */
section {
  padding: 2rem 0;
  border-bottom: 2px solid var(--color-black);
}

.section-label {
  display: inline-block;
  background: var(--color-black);
  color: var(--color-white);
  padding: 0.4rem 1.2rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.teaser-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 1;
  margin-bottom: var(--spacing-sm);
  color: var(--color-white);
  font-family: var(--font-heading);
}

.teaser-title .accent {
  color: var(--color-primary);
  text-shadow: 2px 2px 0 rgba(0,0,0,0.05);
}

.teaser-sub {
  color: rgba(255,255,255,0.4);
  font-size: 1.1rem;
  margin-bottom: var(--spacing-lg);
  max-width: 500px;
}

.teaser-lineup .teaser-title,
.teaser-lineup .teaser-sub {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

/* ---- Lineup Teaser (Sticker Style) ---- */
.teaser-lineup {
  background: var(--color-black);
}

.full-bleed {
  margin: 0;
  max-width: 100%;
}

.artist-scroller-container {
  position: relative;
  width: 100%;
  margin: 1rem 0 3rem;
}

.artist-track {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  scroll-behavior: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 1rem; /* Allows hover zoom without cropping */
}

.artist-track::-webkit-scrollbar {
  display: none;
}

.scroll-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 180px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.scroll-area.left {
  left: 0;
  /* #18181B is rgb(24, 24, 27) */
  background: linear-gradient(to right, rgba(24,24,27,1) 15%, rgba(24,24,27,0) 100%);
  justify-content: flex-start;
  padding-left: 1.5rem;
}

.scroll-area.right {
  right: 0;
  background: linear-gradient(to left, rgba(24,24,27,1) 15%, rgba(24,24,27,0) 100%);
  justify-content: flex-end;
  padding-right: 1.5rem;
}

.scroll-area.visible {
  opacity: 1;
}

.scroll-btn {
  background: var(--color-primary);
  color: var(--color-black);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none; /* Let the scroll-area handle the click entirely */
  transform: scale(0.8);
  opacity: 0.8;
}

.btn-yellow {
  font-family: var(--font-body);
  background: var(--color-primary);
  color: var(--color-black);
  border-color: var(--color-primary);
}

.scroll-area.visible .scroll-btn {
  transform: scale(1);
  opacity: 1;
}

.scroll-area:hover .scroll-btn {
  transform: scale(1.15);
  box-shadow: 0 8px 25px rgba(255, 221, 0, 0.4);
}

.artist-card {
  flex: 0 0 200px;
  background: none;
  border: none;
  cursor: pointer;
  scroll-snap-align: start;
}

.artist-img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: 6px;
  background: #111;
}

.artist-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.artist-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.6rem 0.9rem 0.9rem;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.25) 65%, transparent);
  text-align: left;
  opacity: 1;
}

.artist-card:hover .artist-img {
  transform: scale(1.05);
}

.artist-name {
  font-family: var(--font-heading);
  color: #fff;
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  line-height: 0.95;
  text-transform: uppercase;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.7);
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


/* ---- Ticket Teaser (Innovated Coupon Layout) ---- */
.teaser-ticket {
  background: var(--color-primary);
  background-image:
    radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0);
  background-size: 24px 24px;
}

.teaser-ticket.raised {
  margin-top: -1rem;
  padding-top: 1rem;
}

.ticket-container {
  display: flex;
  align-items: stretch;
  gap: 0;
  background: var(--color-dark-surface);
  padding: 0;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  box-shadow: 
    0 30px 60px rgba(0,0,0,0.5),
    inset 0 0 40px rgba(255,255,255,0.02);
  position: relative;
  overflow: hidden;
}

/* Punch holes improved */
.ticket-container::after,
.ticket-container::before {
  content: "";
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  background: var(--color-primary);
  border-radius: 50%;
  transform: translateY(-50%);
  z-index: 5;
  box-shadow: 
    0 0 0 4px var(--color-dark-surface),
    inset 0 0 10px rgba(0,0,0,0.3);
}

.ticket-container::after { left: -15px; }
.ticket-container::before { right: -15px; }

.tt-content { 
  flex: 1; 
  min-width: 0;
  overflow: hidden;
  padding: 4rem;
  border-right: 2px dashed rgba(255,255,255,0.1);
  position: relative;
}

.custom-hardcore-font {
  font-family: 'HARDCORE ATTITUDE', var(--font-heading), sans-serif !important;
}

.tt-prices {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1.25rem;
  margin: 2.5rem 0;
  padding-bottom: 0.8rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.tt-prices::-webkit-scrollbar {
  height: 4px;
}

.tt-prices::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.tt-prices::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 4px;
}

.price-box {
  background: rgba(255,255,255,0.03);
  padding: 1.25rem 1rem;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  flex: 0 0 160px;
  min-width: 160px;
  position: relative;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
  cursor: pointer;
}

/* Shimmer Light Sweep Effect */
.price-box::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: skewX(-25deg);
  transition: 0.7s;
}

.price-box:hover::after {
  left: 150%;
}

/* Featured Price (Presale) */
.price-box.featured {
  background: linear-gradient(135deg, var(--color-secondary) 0%, #e84c3d 100%);
  border: none;
  box-shadow: 0 15px 35px rgba(232, 76, 61, 0.2);
  transform: scale(1.05);
  z-index: 2;
}

.price-box.featured::after {
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
}

.popular-badge {
  position: absolute;
  top: 10px;
  right: -25px;
  background: var(--color-primary);
  color: var(--color-black);
  font-size: 0.5rem;
  font-weight: 800;
  padding: 4px 30px;
  transform: rotate(45deg);
  letter-spacing: 0.1em;
  z-index: 10;
}

.price-box:hover {
  transform: translateY(-12px) scale(1.03);
  border-color: var(--color-primary);
  background: rgba(255,255,255,0.08);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.price-box.featured:hover {
  transform: translateY(-15px) scale(1.1);
  box-shadow: 0 25px 50px rgba(232, 76, 61, 0.4);
}

.price-box.ot-spot {
  border-left: 4px solid var(--color-tertiary);
}

.price-box.upcoming {
  border: 1px dashed rgba(255,255,255,0.15);
}

.price-box.upcoming-accent {
  border: 1px dashed rgba(255,255,255,0.15);
  border-left: 4px solid var(--color-primary);
}

.pb-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 0.5rem;
  opacity: 0.4;
  letter-spacing: 0.1em;
}

.pb-value {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  display: block;
  line-height: 1;
}

.featured .pb-label { color: var(--color-white); opacity: 0.8; }
.featured .pb-value { text-shadow: 2px 2px 0 rgba(0,0,0,0.1); }

.hot-icon {
  display: inline-block;
  animation: flicker 1s infinite alternate;
}

@keyframes flicker {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 1; }
}

/* Actions Area */
.tt-actions { margin-top: 1rem; }

.btn-glitch {
  position: relative;
  overflow: hidden;
  padding-right: 3.5rem;
}

.btn-glitch .arrow {
  position: absolute;
  right: 1.5rem;
  transition: transform 0.3s ease;
}

.btn-glitch:hover .arrow {
  transform: translateX(5px) scale(1.2);
}

/* Visual Side (Sticker/Ticket stub) */
.tt-visual {
  flex: 0 0 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.2);
  padding: 3rem;
  position: relative;
}

/* Coming Soon Date Styles */
.coming-soon-mode {
  position: relative;
  z-index: 1;
  text-align: center;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.big-date-hype {
  font-family: var(--font-heading);
  font-size: clamp(4rem, 8vw, 6.5rem);
  line-height: 0.8;
  color: var(--color-white);
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  text-shadow: 
    5px 5px 0 rgba(0,0,0,0.3),
    0 0 20px rgba(255,255,255,0.1);
  animation: pulse-glow 3s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  from { opacity: 0.8; transform: scale(1); }
  to { opacity: 1; transform: scale(1.02); }
}

.hype-tag {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: var(--color-black);
  background: var(--color-primary);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 10px 20px rgba(255,221,0,0.2);
  display: inline-block;
}

/* ---- Vibe Section Redesign: Street Poster ---- */
.vibe-section {
  background: #fbda01;
  position: relative;
  overflow: hidden;
  padding: 8rem 0;
  border-bottom: none;
}

.vibe-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.15;
  pointer-events: none;
  mix-blend-mode: multiply;
}

.vibe-container {
  display: flex;
  justify-content: center;
}

.vibe-poster {
  position: relative;
  max-width: 900px;
  width: 100%;
  text-align: center;
}

/* Tapes */
.tape {
  position: absolute;
  width: 120px;
  height: 40px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(2px);
  z-index: 10;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
}

.tape::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 90%, rgba(0,0,0,0.05) 90%);
  background-size: 10px 100%;
}

.tape-tl { top: 20px; left: -30px; transform: rotate(-35deg); }
.tape-tr { top: 20px; right: -30px; transform: rotate(35deg); }
.tape-bl { bottom: 20px; left: -30px; transform: rotate(-145deg); }
.tape-br { bottom: 20px; right: -30px; transform: rotate(145deg); }

/* Typography */
.stencil-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 4rem;
  transform: rotate(-1deg);
}

.vibe-quote {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4.5vw, 2.5rem);
  color: var(--color-black);
  line-height: 1;
  margin: 0;
  position: relative;
  z-index: 2;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  -webkit-text-stroke: 1px var(--color-black);
  white-space: nowrap;
}

.stencil-shadow {
  position: absolute;
  top: 8px;
  left: 8px;
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4.5vw, 2.5rem);
  color: transparent;
  -webkit-text-stroke: 1px rgba(0,0,0,0.2);
  line-height: 1;
  width: 100%;
  z-index: 1;
  user-select: none;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Sticker Buttons */
.vibe-actions {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

.vibe-btn {
  position: relative;
  padding: 1.2rem 2.5rem;
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 0.1em;
  border-radius: 4px;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-sticker-black {
  background: var(--color-black);
  color: var(--color-white);
  transform: rotate(-2deg);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
}

.btn-sticker-white {
  background: var(--color-white);
  color: var(--color-black);
  transform: rotate(2deg);
  box-shadow: -4px 4px 0 rgba(0,0,0,0.1);
  border: 2px solid var(--color-black);
}

.vibe-btn:hover {
  transform: translateY(-5px) scale(1.05) rotate(0deg);
  z-index: 20;
}

.sticker-tail {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: inherit;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .ticket-container { flex-direction: column; text-align: center; padding: 2.5rem; }
  .tt-visual { 
    text-align: center; 
    flex: none; 
    border-left: none; 
    border-top: 2px dashed rgba(255,255,255,0.1); 
    padding: 3rem 1rem; 
    width: 100%; 
    justify-content: center;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.home-sheet-enter-active .home-modal-card { transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.home-sheet-leave-active .home-modal-card { transition: transform 0.35s ease-in; }
.home-sheet-enter-from .home-modal-card { transform: translateY(100%); }
.home-sheet-leave-to .home-modal-card { transform: translateY(100%); }
.home-sheet-enter-active, .home-sheet-leave-active { transition: opacity 0.3s ease; }
.home-sheet-enter-from, .home-sheet-leave-to { opacity: 0; }

.home-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.home-modal-card {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: min(460px, 100%);
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  touch-action: pan-y;
}

.home-modal-card.dragging { transition: none; }

.home-grab { display: none; position: absolute; top: 0; left: 0; right: 0; z-index: 3; padding: 0.6rem; cursor: grab; touch-action: none; background: transparent; pointer-events: auto; }
.home-grab span { display: block; width: 44px; height: 5px; margin: 0 auto; border-radius: 999px; background: rgba(255,255,255,0.7); box-shadow: 0 1px 6px rgba(0,0,0,0.5); }

.home-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
  z-index: 2;
}

.home-close:hover {
  background: var(--color-primary);
  color: var(--color-black);
  border-color: var(--color-primary);
}

.home-modal-media {
  background: #111;
  margin: 0;
  padding: 0;
  line-height: 0;
  overflow: hidden;
}

.home-modal-media img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
  margin: 0;
}

.home-modal-info {
  padding: 1.5rem;
  min-width: 0;
}

.home-modal-name {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  color: var(--color-white);
  margin-bottom: 1rem;
  line-height: 1;
  text-transform: uppercase;
}

.home-tabs {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}

.home-tabs button {
  padding: 0.7rem 0.2rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: rgba(255,255,255,0.55);
  font-family: var(--font-body);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.78rem;
  cursor: pointer;
  margin-bottom: -1px;
}

.home-tabs button.active {
  border-bottom-color: var(--color-primary);
  color: var(--color-primary);
}

.home-about-title {
  font-family: var(--font-body);
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.home-about-text {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
}

.home-socmed {
  display: flex;
  gap: 0.7rem;
}

.home-socmed a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--color-white);
}

.home-socmed a:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-black);
}

.home-playlist iframe {
  border-radius: 6px;
  border: none;
}

@media (max-width: 768px) {
  .scroll-area { display: none !important; }
  .artist-scroller-container { margin: 1rem -1rem; width: calc(100% + 2rem); }
  .artist-track { padding: 1rem 2rem; gap: 0.9rem; }
  .artist-card { flex: 0 0 150px; }
  .home-modal { padding: 0; align-items: flex-end; }
  .home-modal-card { width: 100%; max-height: 88vh; border-radius: 18px 18px 0 0; border-bottom: none; }
  .home-grab { display: block; }
  .home-modal-media img { height: 240px; }
  .home-modal-info { padding: 1.1rem; }
  .home-playlist iframe { height: 280px; }
  
  /* Reset to original values for other sections */
  .ticket-container { border-radius: 12px; padding: 0; overflow: hidden; text-align: center; }
  .ticket-container::after,
  .ticket-container::before { display: none; }
  .tt-content { padding: 1.75rem 1.25rem 1.5rem; border-right: none; border-bottom: 2px dashed rgba(255,255,255,0.1); }
  .teaser-ticket .teaser-sub { font-size: 0.95rem; margin-bottom: 0; }
  .tt-prices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin: 1.5rem 0; overflow: visible; padding-bottom: 0; }
  .price-box { flex: none; min-width: 0; width: auto; padding: 1rem 0.75rem; scroll-snap-align: unset; }
  .price-box.featured { grid-column: 1 / -1; transform: none; }
  .pb-value { font-size: 1.4rem; }
  .tt-actions { margin-top: 0.25rem; }
  .tt-actions .btn { width: 100%; justify-content: center; }
  .tt-visual { padding: 2rem 1rem; }
  .big-date-hype { font-size: clamp(2.5rem, 14vw, 3.5rem); margin-bottom: 1rem; }
  .hype-tag { font-size: 0.65rem; padding: 0.6rem 1rem; }
  .vibe-section { padding: 4rem 1rem; }
  .vibe-actions { flex-direction: row; gap: 1rem; }
  .vibe-btn { width: auto; transform: rotate(0); text-align: center; padding: 0.8rem 1.6rem; font-size: 0.78rem; }
  .stencil-wrap { margin-bottom: 2rem; max-width: 100%; }
  .vibe-quote,
  .stencil-shadow {
    white-space: normal;
    font-size: clamp(1.4rem, 8vw, 2rem);
    line-height: 1.05;
    max-width: 320px;
    margin: 0 auto;
  }
  .stencil-shadow { top: 5px; left: 50%; transform: translateX(calc(-50% + 5px)); width: 320px; }
  .tape { width: 80px; height: 30px; opacity: 0.4; }
}
</style>


