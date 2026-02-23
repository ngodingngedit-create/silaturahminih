<script setup>
import HeroSection from '../components/HeroSection.vue'
import MarqueeSection from '../components/MarqueeSection.vue'
import VideoRecap from '../components/VideoRecap.vue'
import PhotoScroll from '../components/PhotoScroll.vue'
import SpotifySection from '../components/SpotifySection.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const featuredArtists = [
  { name: 'DONGKER', genre: 'Punk', stage: 'Main Stage', image: '/konser1.jpg' },
  { name: 'MARJINAL', genre: 'Punk Rock', stage: 'Main Stage', image: '/konser2.jpg' },
  { name: 'THE JANSEN', genre: 'Indie Rock', stage: 'Main Stage', image: '/konser3.jpg' },
  { name: 'THE BRANDALS', genre: 'Garage Rock', stage: 'Side Stage', image: '/konser1.jpg' },
  { name: 'SUKATANI', genre: 'Folk Punk', stage: 'Side Stage', image: '/konser2.jpg' },
]
</script>

<template>
  <!-- Hero -->
  <HeroSection />

  <!-- Marquee -->
  <MarqueeSection />

  <!-- Lineup Teaser -->
  <section class="teaser-lineup">
    <div class="container">
      <div class="section-label">SIAPA AJA YANG MAIN?</div>
      <h2 class="teaser-title">LINEUP <span class="accent">2027</span></h2>
      <p class="teaser-sub">Band lokal terbaik, satu panggung. 15 Juni 2027.</p>

      <div class="artist-grid">
        <div
          v-for="(artist, i) in featuredArtists"
          :key="i"
          class="artist-card"
          @click="router.push('/lineup')"
        >
          <div class="artist-img-wrapper">
            <img :src="artist.image" :alt="artist.name" class="artist-img" />
            <div class="artist-overlay"></div>
          </div>
          <div class="artist-info">
            <span class="artist-genre">{{ artist.genre }}</span>
            <h3 class="artist-name">{{ artist.name }}</h3>
            <span class="artist-stage">{{ artist.stage }}</span>
          </div>
        </div>
      </div>

      <div class="teaser-cta">
        <button class="btn btn-yellow" @click="router.push('/lineup')">
          LIHAT SEMUA LINEUP →
        </button>
      </div>
    </div>
  </section>

  <!-- Video Recap -->
  <VideoRecap />

  <!-- Ticket Teaser -->
  <section class="teaser-ticket">
    <div class="container">
      <div class="ticket-container">
        <div class="tt-content">
          <div class="section-label">DAPETIN TIKETNYA</div>
          <h2 class="teaser-title">TIKET <span class="accent">TERSEDIA</span></h2>
          <p class="teaser-sub">
            Presale masih ada. Jangan sampe nyesel beli harga normal.
          </p>
          
          <div class="tt-prices">
            <div class="price-box upcoming">
              <span class="pb-label">EARLY BIRD</span>
              <span class="pb-value">SOON</span>
            </div>
            <div class="price-box featured">
              <div class="popular-badge">LIMITED</div>
              <span class="pb-label">PRESALE</span>
              <span class="pb-value">SOON <span class="hot-icon">✨</span></span>
            </div>
            <div class="price-box upcoming">
              <span class="pb-label">ON THE SPOT</span>
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
            <div class="big-date-hype">STAY<br>TUNED</div>
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
          <h2 class="vibe-quote">"SEMUA AKAN PUNK PADA WAKTUNYA"</h2>
          <div class="stencil-shadow">"SEMUA AKAN PUNK PADA WAKTUNYA"</div>
        </div>
        
        <div class="vibe-actions">
          <button class="btn vibe-btn btn-sticker-black" @click="router.push('/info')">
            <span class="btn-text">INFO VENUE</span>
            <span class="sticker-tail"></span>
          </button>
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
  padding: var(--spacing-xl) 0;
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

/* ---- Lineup Teaser (Sticker Style) ---- */
.teaser-lineup {
  background: var(--color-black);
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: var(--spacing-lg);
}

.artist-card {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 0; /* Removing padding to let the image be the hero */
}

.artist-card::before {
  content: "";
  position: absolute;
  top: 15px;
  right: 15px;
  width: 12px;
  height: 12px;
  background: var(--color-primary);
  border-radius: 50%;
  z-index: 1;
}

.artist-card:nth-child(even)::before { background: var(--color-secondary); }
.artist-card:nth-child(3n)::before { background: var(--color-tertiary); }

.artist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  border-color: var(--color-primary);
}

.artist-img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  overflow: hidden;
}

.artist-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.2);
  transition: var(--transition-normal);
}

.artist-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-black) 0%, transparent 70%);
  opacity: 0.8;
}

.artist-card:hover .artist-img {
  transform: scale(1.05);
  filter: grayscale(0) contrast(1.1);
}

.artist-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.artist-name {
  font-family: var(--font-heading);
  font-size: 2.2rem; /* Increased size back */
  color: var(--color-white);
  line-height: 0.9;
  margin: 0.4rem 0 0.8rem;
  text-shadow: 2px 2px 0 var(--color-black);
}

.artist-genre {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 0.15em;
}

.artist-stage {
  align-self: flex-start;
  background: var(--color-black);
  color: var(--color-white);
  padding: 0.3rem 0.8rem;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}


/* ---- Ticket Teaser (Innovated Coupon Layout) ---- */
.teaser-ticket {
  background: var(--color-primary);
  background-image: 
    radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0);
  background-size: 24px 24px;
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
  padding: 4rem;
  border-right: 2px dashed rgba(255,255,255,0.1);
  position: relative;
}

.tt-prices {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 3rem 0;
}

.price-box {
  background: rgba(255,255,255,0.03);
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  flex: 1;
  min-width: 180px;
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
  background: var(--color-tertiary);
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
  font-size: clamp(3rem, 10vw, 7rem);
  color: var(--color-black);
  line-height: 0.85;
  margin: 0;
  position: relative;
  z-index: 2;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  -webkit-text-stroke: 1px var(--color-black);
}

.stencil-shadow {
  position: absolute;
  top: 8px;
  left: 8px;
  font-family: var(--font-heading);
  font-size: clamp(3rem, 10vw, 7rem);
  color: transparent;
  -webkit-text-stroke: 1px rgba(0,0,0,0.2);
  line-height: 0.85;
  width: 100%;
  z-index: 1;
  user-select: none;
  letter-spacing: -0.05em;
  text-transform: uppercase;
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

@media (max-width: 768px) {
  .vibe-section { padding: 5rem 1rem; }
  .vibe-actions { flex-direction: column; gap: 1.5rem; }
  .vibe-btn { width: 100%; transform: rotate(0); text-align: center; }
  .stencil-wrap { margin-bottom: 3rem; }
  .tape { width: 80px; height: 30px; opacity: 0.4; }
}
</style>


