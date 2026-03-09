<script setup>
import { ref, computed } from 'vue'
import MarqueeSection from '../components/MarqueeSection.vue'

const activeVol = ref('vol2')

const artistsData = [
  // Vol 1 Add some dummy artists to signify that things are changing
  { name: 'THE ADAMS', genre: 'Power Pop', stage: 'Main Stage', time: '20:00', vol: 'vol1', image: '/konser1.jpg', description: 'Energetic power pop legends.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm', social: { ig: 'theadams', youtube: 'theadams', tiktok: 'theadams' } },
  { name: 'EFEK RUMAH KACA', genre: 'Indie', stage: 'Main Stage', time: '18:30', vol: 'vol1', image: '/konser2.jpg', description: 'Critical and political indie pop band.', spotify: 'https://open.spotify.com/embed/artist/3IOhBSi8QpYo4rR6oQKZP6', social: { ig: 'erk', youtube: 'erk', tiktok: 'erk' } },
  { name: 'SORE', genre: 'Indie Pop', stage: 'Main Stage', time: '17:00', vol: 'vol1', image: '/konser3.jpg', description: 'Beautiful melodies and lush instrumentation.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm', social: { ig: 'sore', youtube: 'sore', tiktok: 'sore' } },
  { name: 'WHITE SHOES', genre: 'Pop', stage: 'Side Stage', time: '19:00', vol: 'vol1', image: '/konser1.jpg', description: 'Retro 70s pop from Jakarta.', spotify: 'https://open.spotify.com/embed/artist/3IOhBSi8QpYo4rR6oQKZP6', social: { ig: 'whiteshoes', youtube: 'wsatcc', tiktok: 'wsatcc' } },
  { name: 'GOODNIGHT ELECTRIC', genre: 'Synth Pop', stage: 'Side Stage', time: '17:30', vol: 'vol1', image: '/konser2.jpg', description: 'Iconic synth pop act.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm', social: { ig: 'ge', youtube: 'ge', tiktok: 'ge' } },
  
  // Vol 2
  { name: 'DONGKER', genre: 'Punk', stage: 'Main Stage', time: '20:00', vol: 'vol2', image: '/konser1.jpg', description: 'Dongker is an Indonesian punk band making massive waves in the underground scene with their infectious fast-paced anthems.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm?utm_source=generator', social: { ig: 'dongker', youtube: 'Dongker', tiktok: 'dongkerofficial' } },
  { name: 'MARJINAL', genre: 'Punk Rock', stage: 'Main Stage', time: '18:30', vol: 'vol2', image: '/konser2.jpg', description: 'An iconic street punk band hailing from Jakarta. Marjinal is not just a band, but a movement that resonates deeply with the Indonesian working class.', spotify: 'https://open.spotify.com/embed/artist/3IOhBSi8QpYo4rR6oQKZP6?utm_source=generator', social: { ig: 'taringbabi', youtube: 'MarjinalTV', tiktok: 'marjinalpunk' } },
  { name: 'THE JANSEN', genre: 'Indie Rock', stage: 'Main Stage', time: '17:00', vol: 'vol2', image: '/konser3.jpg', description: 'The Jansen brings a perfect blend of modern indie rock and classic punk. Their energetic performances have captured the hearts of many youths.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm?utm_source=generator', social: { ig: 'thejansen_id', youtube: 'TheJansen', tiktok: 'thejansen' } },
  { name: 'THE BRANDALS', genre: 'Garage Rock', stage: 'Side Stage', time: '19:00', vol: 'vol2', image: '/konser1.jpg', description: 'The Garage Rock revival originators in Indonesia. The Brandals are known for their reckless, dirty, and chaotic live shows.', spotify: 'https://open.spotify.com/embed/artist/3IOhBSi8QpYo4rR6oQKZP6?utm_source=generator', social: { ig: 'thebrandals', youtube: 'TheBrandalsTv', tiktok: 'thebrandals_id' } },
  { name: 'SUKATANI', genre: 'Folk Punk', stage: 'Side Stage', time: '17:30', vol: 'vol2', image: '/konser2.jpg', description: 'Folk Punk with a local twist. Sukatani combines traditional rhythms with an unapologetic punk attitude, creating an unforgettable sonic experience.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm?utm_source=generator', social: { ig: 'sukatani', youtube: 'SukataniPunk', tiktok: 'sukatani' } },
  { name: 'LIPS', genre: 'Punk Pop', stage: 'Side Stage', time: '16:00', vol: 'vol2', image: '/konser3.jpg', description: 'Bringing melodic structures into heavy punk riffs, LIPS delivers singalong choruses that stick in your head for days.', spotify: 'https://open.spotify.com/embed/artist/3IOhBSi8QpYo4rR6oQKZP6?utm_source=generator', social: { ig: 'lipsband', youtube: 'LIPSOfficial', tiktok: 'lipspop' } },
  { name: 'DAT BUNNY', genre: 'Noise Rock', stage: 'Side Stage', time: '15:00', vol: 'vol2', image: '/konser1.jpg', description: 'Experimental noise rock with absolutely chaotic yet highly coordinated performances. Dat Bunny pushes the boundaries of underground music.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm?utm_source=generator', social: { ig: 'datbunny', youtube: 'DatBunnyNoise', tiktok: 'datbunny' } },
  { name: 'BAXLAX BOY', genre: 'Hardcore', stage: 'Side Stage', time: '14:00', vol: 'vol2', image: '/konser2.jpg', description: 'A heavyweight in the hardcore scene. Baxlax Boy brings devastating breakdowns and aggressive grooves that incite wild moshpits.', spotify: 'https://open.spotify.com/embed/artist/3IOhBSi8QpYo4rR6oQKZP6?utm_source=generator', social: { ig: 'baxlaxboy', youtube: 'BaxlaxBoyHC', tiktok: 'baxlaxboy' } },
  { name: 'TABRAK LARI', genre: 'Ska Punk', stage: 'Main Stage', time: '15:30', vol: 'vol2', image: '/konser3.jpg', description: 'Combining upbeat rhythms with screaming punk vocals. Tabrak Lari guarantees a skanking riot at every corner of the venue.', spotify: 'https://open.spotify.com/embed/artist/6sf1OnuDZM48bgFQvPkbYm?utm_source=generator', social: { ig: 'tabraklari', youtube: 'TabrakLari', tiktok: 'tabraklari' } },
  { name: 'SUKSES LANCAR REJEKI', genre: 'Punk', stage: 'Main Stage', time: '14:00', vol: 'vol2', image: '/konser1.jpg', description: 'Born in the underground clubs, Sukses Lancar Rejeki represents the purest and rawest form of modern punk rock expression.', spotify: 'https://open.spotify.com/embed/artist/3IOhBSi8QpYo4rR6oQKZP6?utm_source=generator', social: { ig: 'slr_punk', youtube: 'SLRPunk', tiktok: 'slr.punk' } },
]

const realtimeArtists = computed(() => artistsData.filter(a => a.vol === 'vol2'))

const filteredArtists = computed(() => {
  if (activeVol.value === 'vol3') return []
  return artistsData.filter(a => a.vol === activeVol.value)
})

const mainStage = computed(() => realtimeArtists.value.filter(a => a.stage === 'Main Stage'))
const sideStage = computed(() => realtimeArtists.value.filter(a => a.stage === 'Side Stage'))

// Modal handling
const selectedArtist = ref(null)

const openModal = (artist) => {
  selectedArtist.value = artist
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedArtist.value = null
  document.body.style.overflow = ''
}

const getSpotifySrc = (url) => {
  if (!url) return ''
  const base = url.split('?')[0]
  return `${base}?utm_source=generator&theme=0`
}
</script>

<template>
  <!-- Lineup Hero -->
  <section class="lineup-hero">
    <div class="lh-bg-text">LINEUP</div>
    <div class="container lh-inner">
      <div class="section-label">TBA</div>
      <h1 class="lh-title">LINEUP<br><span class="accent">TBA</span></h1>
      <p class="lh-sub">TBA</p>
    </div>
  </section>

  <MarqueeSection />

  <!-- Stage Tabs / Content -->
  <section class="lineup-content">
    <div class="container">

      <!-- Main Stage (Realtime Vol 2) -->
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

      <!-- Side Stage (Realtime Vol 2) -->
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

      <!-- All Artists Grid with Volume Filter -->
      <div class="all-artists-section">
        <h2 class="section-title">SEMUA BAND<span style="font-size: 1.5rem; color: white;">- {{ activeVol.toUpperCase() }}</span></h2>
        
        <!-- Vol Filter Buttons -->
        <div class="vol-tabs">
          <button class="vol-btn" :class="{ active: activeVol === 'vol1' }" @click="activeVol = 'vol1'">VOL 1</button>
          <button class="vol-btn" :class="{ active: activeVol === 'vol2' }" @click="activeVol = 'vol2'">VOL 2</button>
          <button class="vol-btn" :class="{ active: activeVol === 'vol3' }" @click="activeVol = 'vol3'">VOL 3</button>
        </div>

        <div v-if="activeVol === 'vol3'" class="tba-message">
          <p>TBA (To Be Announced)</p>
        </div>

        <div v-else class="artist-card-grid">
          <div
            v-for="(artist, i) in filteredArtists"
            :key="i"
            class="artist-card"
            @click="openModal(artist)"
          >
            <div class="artist-img-wrapper">
              <img :src="artist.image" :alt="artist.name" class="artist-img" />
              <div class="artist-overlay"></div>
            </div>
            <div class="artist-info-card">
              <span class="artist-genre">{{ artist.genre }}</span>
              <h3 class="artist-name">{{ artist.name }}</h3>
              <span class="artist-stage">{{ artist.stage }} | {{ artist.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal Artist Detail -->
  <Transition name="fade">
    <div v-if="selectedArtist" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">✕</button>
        
        <img :src="selectedArtist.image" :alt="selectedArtist.name" class="modal-img" />
        
        <div class="modal-body">
          <h3 class="modal-name">{{ selectedArtist.name }}</h3>
          <p class="modal-genre">{{ selectedArtist.genre }} | {{ selectedArtist.stage }} ({{ selectedArtist.time }})</p>
          
          <div class="modal-desc">{{ selectedArtist.description }}</div>
          
          <div class="modal-socials">
            <a :href="`https://instagram.com/${selectedArtist.social.ig}`" target="_blank" class="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              Instagram
            </a>
            <a :href="`https://youtube.com/c/${selectedArtist.social.youtube}`" target="_blank" class="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              YouTube
            </a>
            <a :href="`https://tiktok.com/@${selectedArtist.social.tiktok}`" target="_blank" class="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              TikTok
            </a>
          </div>

          <div class="modal-spotify">
            <div class="spotify-header">
              <span class="spotify-dot"></span> PLAYLIST
            </div>
            <iframe :src="getSpotifySrc(selectedArtist.spotify)" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="spotify-iframe"></iframe>
          </div>
        </div>
      </div>
    </div>
  </Transition>
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

.vol-tabs {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

.vol-btn {
  background: var(--color-dark-surface);
  color: var(--color-white);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.8rem 2.5rem;
  border-radius: 50px;
  font-weight: bold;
  font-family: var(--font-body);
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.vol-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.vol-btn.active {
  background: var(--color-primary);
  color: var(--color-black);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 221, 0, 0.3);
}

.tba-message {
  text-align: center;
  padding: 4rem 0 8rem;
  color: var(--color-white);
  font-size: 1.5rem;
  font-family: var(--font-heading);
  letter-spacing: 0.1em;
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
  color: var(--color-white); /* Ubah warnanya dari gelap ke terang */
  opacity: 0.8;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
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
  padding: 0;
  aspect-ratio: 4/5;
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
  z-index: 5;
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
  height: 100%;
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

.artist-info-card {
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
  font-size: 2.2rem;
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

/* ---- Modal Styles ---- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  scrollbar-width: thin;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--color-primary);
  color: var(--color-black);
  border-color: var(--color-primary);
  transform: scale(1.1) rotate(90deg);
}

.modal-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-bottom: 2px solid var(--color-primary);
}

.modal-body {
  padding: 2rem;
}

.modal-name {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--color-white);
  margin-bottom: 0.2rem;
  line-height: 1;
  text-transform: uppercase;
}

.modal-genre {
  font-size: 0.9rem;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.modal-desc {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.modal-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-link {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-white);
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-link:hover {
  background: var(--color-primary);
  color: var(--color-black);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.modal-spotify {
  margin-top: 2rem;
  background: #18181b;
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.spotify-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--color-white);
  letter-spacing: 0.1em;
  margin-bottom: 1.2rem;
  text-transform: uppercase;
}

.spotify-dot {
  width: 8px;
  height: 8px;
  background: #1DB954;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(29, 185, 84, 0.8);
}

.spotify-iframe {
  border-radius: 8px;
}
</style>
