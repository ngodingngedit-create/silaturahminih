<script setup>
import MarqueeSection from '../components/MarqueeSection.vue'

const artists = [
  { name: 'DONGKER', genre: 'Punk', stage: 'Main Stage', time: '20:00' },
  { name: 'MARJINAL', genre: 'Punk Rock', stage: 'Main Stage', time: '18:30' },
  { name: 'THE JANSEN', genre: 'Indie Rock', stage: 'Main Stage', time: '17:00' },
  { name: 'THE BRANDALS', genre: 'Garage Rock', stage: 'Side Stage', time: '19:00' },
  { name: 'SUKATANI', genre: 'Folk Punk', stage: 'Side Stage', time: '17:30' },
  { name: 'LIPS', genre: 'Punk Pop', stage: 'Side Stage', time: '16:00' },
  { name: 'DAT BUNNY', genre: 'Noise Rock', stage: 'Side Stage', time: '15:00' },
  { name: 'BAXLAX BOY', genre: 'Hardcore', stage: 'Side Stage', time: '14:00' },
  { name: 'TABRAK LARI', genre: 'Ska Punk', stage: 'Main Stage', time: '15:30' },
  { name: 'SUKSES LANCAR REJEKI', genre: 'Punk', stage: 'Main Stage', time: '14:00' },
]

const mainStage = artists.filter(a => a.stage === 'Main Stage')
const sideStage = artists.filter(a => a.stage === 'Side Stage')
</script>

<template>
  <!-- Lineup Hero -->
  <section class="lineup-hero">
    <div class="lh-bg-text">LINEUP</div>
    <div class="container lh-inner">
      <div class="section-label">15 JUNI 2027 · PAMULANG SQUARE</div>
      <h1 class="lh-title">LINEUP<br><span class="accent">2027 EDITION</span></h1>
      <p class="lh-sub">Band lokal terbaik, satu panggung. 15 Juni 2027.</p>
    </div>
  </section>

  <MarqueeSection />

  <!-- Stage Tabs / Content -->
  <section class="lineup-content">
    <div class="container">

      <!-- Main Stage -->
      <div class="stage-block">
        <div class="stage-header main">
          <span class="stage-dot"></span>
          MAIN STAGE
        </div>
        <div class="artist-list">
          <div
            v-for="(artist, i) in mainStage"
            :key="i"
            class="artist-row"
          >
            <div class="ar-time">{{ artist.time }}</div>
            <div class="ar-divider"></div>
            <div class="ar-info">
              <span class="ar-name">{{ artist.name }}</span>
              <span class="ar-genre">{{ artist.genre }}</span>
            </div>
            <div class="ar-badge main-badge">MAIN STAGE</div>
          </div>
        </div>
      </div>

      <!-- Side Stage -->
      <div class="stage-block">
        <div class="stage-header side">
          <span class="stage-dot side-dot"></span>
          SIDE STAGE
        </div>
        <div class="artist-list">
          <div
            v-for="(artist, i) in sideStage"
            :key="i"
            class="artist-row"
          >
            <div class="ar-time">{{ artist.time }}</div>
            <div class="ar-divider"></div>
            <div class="ar-info">
              <span class="ar-name">{{ artist.name }}</span>
              <span class="ar-genre">{{ artist.genre }}</span>
            </div>
            <div class="ar-badge side-badge">SIDE STAGE</div>
          </div>
        </div>
      </div>

      <!-- All Artists Grid -->
      <div class="all-artists-section">
        <h2 class="section-title">SEMUA ARTIS</h2>
        <div class="artist-card-grid">
          <div
            v-for="(artist, i) in artists"
            :key="i"
            class="artist-card"
            :class="`card-col-${(i % 3) + 1}`"
          >
            <div class="card-number">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="card-name">{{ artist.name }}</div>
            <div class="card-meta">
              <span>{{ artist.genre }}</span>
              <span class="card-time">{{ artist.time }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="lineup-cta">
    <div class="container" style="text-align:center;">
      <p class="cta-label">LINEUP INI BELUM FINAL — STAY TUNED!</p>
      <a href="https://instagram.com/barengbarengnih" target="_blank" class="btn btn-yellow">
        FOLLOW IG KAMI →
      </a>
    </div>
  </section>
</template>

<style scoped>
/* ---- Hero ---- */
.lineup-hero {
  min-height: 50vh;
  background: var(--color-black);
  display: flex;
  align-items: center;
  padding: 8rem 1rem 4rem;
  overflow: hidden;
  border-bottom: 3px solid var(--color-primary);
}

.lh-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-heading);
  font-size: clamp(8rem, 20vw, 18rem);
  color: transparent;
  -webkit-text-stroke: 2px rgba(255,221,0,0.08);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.lh-inner {
  position: relative;
  z-index: 1;
}

.section-label {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.lh-title {
  font-size: clamp(3.5rem, 10vw, 8rem);
  line-height: 0.9;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.lh-title .accent {
  color: var(--color-primary);
}

.lh-sub {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.6);
}

/* ---- Lineup Content ---- */
.lineup-content {
  padding: 5rem 0;
  background: var(--color-black);
}

.tickets-section {
  padding: 5rem 0;
  background: var(--color-black);
}

.stage-block {
  margin-bottom: 4rem;
}

.stage-header {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0;
  border-bottom: 1px solid var(--color-black);
  color: var(--color-black);
  background: var(--color-primary);
}

.stage-header.side {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

.stage-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary);
}

.stage-dot.side-dot {
  background: var(--color-secondary);
  box-shadow: 0 0 10px var(--color-secondary);
}

/* Artist Row */
.artist-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: background 0.2s;
}

.artist-row:hover {
  background: rgba(255,221,0,0.04);
}

.ar-time {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-black);
  opacity: 0.4;
  flex: 0 0 60px;
}

.ar-divider {
  width: 1px;
  height: 30px;
  background: rgba(255,255,255,0.15);
}

.ar-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.ar-name {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--color-white);
  line-height: 1;
}

.ar-genre {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.ar-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 3px;
}

.main-badge {
  background: rgba(255,221,0,0.15);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.side-badge {
  background: rgba(255,0,128,0.15);
  color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
}

/* ---- All Artists Grid ---- */
.all-artists-section {
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 3px solid rgba(255,221,0,0.2);
}

.dashed-line {
  flex: 1;
  border-top: 1px dashed rgba(255,255,255,0.1);
}

.section-title {
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--color-primary);
  margin-bottom: 2rem;
  -webkit-text-stroke: 1px var(--color-primary);
  text-shadow: 4px 4px 0 var(--color-secondary);
}

.artist-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.artist-card {
  padding: 1.5rem;
  border: 1px solid var(--color-black);
  border-radius: var(--radius-md);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.ar.ticket-card {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  width: 280px;
  border-radius: var(--radius-md);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.card-col-1 {
  background: var(--color-dark-surface);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.card-col-2 {
  background: var(--color-dark-surface);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.card-col-3 {
  background: var(--color-dark-surface);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.artist-card:hover {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 rgba(0,0,0,0.05);
  border-color: var(--color-primary);
}

.ar.ticket-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.card-number {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: rgba(255,255,255,0.1);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.card-name {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--color-white);
  line-height: 1.1;
  margin-bottom: 0.8rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.card-time {
  color: var(--color-primary);
  font-weight: 700;
}

/* ---- CTA ---- */
.lineup-cta {
  padding: 4rem 0;
  background: var(--color-black);
  border-top: 3px solid var(--color-primary);
}

.cta-label {
  font-family: var(--font-body);
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
</style>
