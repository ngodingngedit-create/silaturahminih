<script setup>
import { ref, computed } from 'vue'

// -------------------------------------------------------
// 🎵 KONFIGURASI PLAYLIST — ganti ID dengan playlist asli
// Ambil ID dari URL: open.spotify.com/playlist/[ID]
// -------------------------------------------------------
const PLAYLISTS = [
  { vol: 'Vol. 1', label: 'VOL 1', id: '3vrNwMNse3qA0O6EEmy594', year: '2025' },
  { vol: 'Vol. 2', label: 'VOL 2', id: '4eUG8axJCXmomo7278r4wS', year: '2026' },
  { vol: 'Vol. 3', label: 'VOL 3', id: '37i9dQZF1DXcBWIGoYBM5M', year: 'TBA' },
]

const activeIndex = ref(0)
const active = computed(() => PLAYLISTS[activeIndex.value])
const embedSrc = computed(() =>
  `https://open.spotify.com/embed/playlist/${active.value.id}?utm_source=generator&theme=0`
)
</script>

<template>
  <section class="sp-section">
    <!-- Background Accents -->
    <div class="sp-bg-grid"></div>
    <div class="sp-bg-glow"></div>

    <!-- Header Area -->
    <div class="container sp-header">
      <div class="deck-status">
        <span class="status-led pulsed"></span>
        <span class="status-text">DECK SYSTEM ONLINE</span>
      </div>

      <h2 class="sp-title">
        <span class="sp-pre">OFFICIAL</span>
        PLAYLIST
      </h2>
      
      <p class="sp-desc">
        Pilih volume di bawah untuk memuat playlist ke dalam console.
      </p>
    </div>

    <!-- Cassette Tape Collection (Navigation) -->
    <div class="container tape-deck-wrap">
      <div class="cassette-grid">
        <button
          v-for="(pl, i) in PLAYLISTS"
          :key="pl.id"
          class="cassette-tape"
          :class="{ active: i === activeIndex }"
          @click="activeIndex = i"
        >
          <div class="tape-body">
            <div class="tape-label">
              <span class="volume-id">{{ pl.vol }}</span>
              <span class="tape-year">{{ pl.year }}</span>
            </div>
            <div class="tape-screws">
              <span class="screw"></span><span class="screw"></span>
              <span class="screw"></span><span class="screw"></span>
            </div>
            <div class="tape-window">
              <div class="tape-spools">
                <span class="spool"></span>
                <span class="spool"></span>
              </div>
            </div>
          </div>
          <div class="tape-shadow"></div>
        </button>
      </div>
    </div>

    <!-- Industrial Player Console -->
    <div class="container console-wrap">
      <div class="console-box">
        <!-- Physical Details -->
        <div class="console-vents">
          <span></span><span></span><span></span>
        </div>
        
        <div class="console-screen-area">
          <div class="screen-header">
            <div class="scr-info">
              <span class="scr-label">LOADING...</span>
              <span class="scr-val">VOLUME {{ activeIndex + 1 }}</span>
            </div>
            <div class="scr-meters">
              <div class="meter-bar"><div class="fill" style="width: 70%"></div></div>
              <div class="meter-bar"><div class="fill" style="width: 45%"></div></div>
            </div>
          </div>

          <div class="player-monitor">
            <!-- Decorative Scanlines -->
            <div class="scanlines"></div>
            
            <Transition name="tape-insert" mode="out-in">
              <div :key="active.id" class="monitor-content">
                <iframe
                  :src="embedSrc"
                  width="100%"
                  height="700"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  class="sp-iframe"
                ></iframe>
              </div>
            </Transition>
          </div>

          <div class="screen-footer">
            <div class="sf-item">
              <span class="sf-lab">SOURCE</span>
              <span class="sf-val">SPOTIFY_CLOUD</span>
            </div>
            <div class="sf-item">
              <span class="sf-lab">BITRATE</span>
              <span class="sf-val">320 KBPS</span>
            </div>
          </div>
        </div>

        <!-- Console Buttons -->
        <div class="console-controls">
          <div class="control-group">
            <button class="c-btn stop"><span class="icon">■</span> EJECT</button>
            <button class="c-btn play active"><span class="icon">▶</span> PLAYING</button>
          </div>
          
          <div class="vu-meter-wrap">
            <div class="vu-bars">
              <span v-for="n in 12" :key="n" class="vu-bar" :style="{ animationDelay: n * 0.1 + 's' }"></span>
            </div>
            <div class="vu-label">OUTPUT LEVEL</div>
          </div>

          <a
            :href="`https://open.spotify.com/playlist/${active.id}`"
            target="_blank"
            class="open-spotify-btn"
          >
            OPEN IN APP
          </a>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* ===== Core Layout ===== */
.sp-section {
  background: #0a0a0a;
  padding: 8rem 0;
  position: relative;
  overflow: hidden;
  border-top: 2px solid rgba(255, 221, 0, 0.1);
}

.sp-bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,221,0,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,221,0,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.sp-bg-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(255,0,128,0.05) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* ===== Header & Status ===== */
.sp-header {
  text-align: center;
  margin-bottom: 5rem;
}

.deck-status {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255,255,255,0.03);
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 2rem;
}

.status-led {
  width: 8px;
  height: 8px;
  background: #1DB954;
  border-radius: 50%;
  box-shadow: 0 0 10px #1DB954;
}

.status-led.pulsed {
  animation: led-pulse 2s infinite ease-in-out;
}

@keyframes led-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.status-text {
  font-size: 0.7rem;
  font-weight: 800;
  color: #1DB954;
  letter-spacing: 0.15em;
}

.sp-title {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 10vw, 6.5rem);
  line-height: 0.85;
  color: var(--color-white);
  text-transform: uppercase;
}

.sp-pre {
  display: block;
  font-size: 1.2rem;
  color: var(--color-primary);
  letter-spacing: 0.4em;
  margin-bottom: 0.5rem;
}

.sp-edition {
  display: block;
  font-size: 1.5rem;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.3);
  letter-spacing: 0.2em;
  margin-top: 1rem;
}

.sp-desc {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.4);
  max-width: 500px;
  margin: 2rem auto 0;
}

/* ===== Cassette Tapes (Nav) ===== */
.tape-deck-wrap {
  margin-bottom: 4rem;
}

.cassette-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.cassette-tape {
  background: none;
  border: none;
  cursor: pointer;
  width: 200px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tape-body {
  background: #1a1a1a;
  height: 120px;
  border-radius: 6px;
  padding: 10px;
  position: relative;
  z-index: 2;
  border: 4px solid #111;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 15px rgba(255,255,255,0.05);
}

.tape-label {
  background: #eee;
  flex: 1;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 10px solid var(--color-primary);
}

.volume-id {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: #333;
}

.tape-year {
  font-size: 0.8rem;
  font-weight: 900;
  color: #666;
}

.tape-window {
  height: 35px;
  background: rgba(0,0,0,0.8);
  margin-top: 8px;
  border-radius: 4px;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.spool {
  width: 20px;
  height: 20px;
  background: #333;
  border-radius: 50%;
  border: 3px dashed #444;
}

.screw {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #222;
  border-radius: 50%;
  border: 1px solid #333;
}

.screw:nth-child(1) { top: 4px; left: 4px; }
.screw:nth-child(2) { top: 4px; right: 4px; }
.screw:nth-child(3) { bottom: 4px; left: 4px; }
.screw:nth-child(4) { bottom: 4px; right: 4px; }

.tape-shadow {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 20px;
  background: rgba(0,0,0,0.5);
  filter: blur(10px);
  z-index: 1;
  transition: opacity 0.3s;
}

/* Hover & Active Tape */
.cassette-tape:hover {
  transform: translateY(-8px) rotate(-3deg);
}

.cassette-tape.active {
  transform: translateY(-12px) rotate(-5deg);
}

.cassette-tape.active .tape-body {
  border-color: var(--color-primary);
}

.cassette-tape.active .tape-label {
  background: var(--color-primary);
  color: var(--color-black);
  border-left-color: var(--color-secondary);
}

/* ===== Console Box ===== */
.console-wrap {
  perspective: 1000px;
}

.console-box {
  background: #1a1a1a;
  border: 8px solid #000;
  border-radius: 20px;
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 
    0 30px 60px rgba(0,0,0,0.5),
    inset 0 0 20px rgba(255,255,255,0.05);
}

.console-vents {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
}

.console-vents span {
  width: 60px;
  height: 6px;
  background: #000;
  border-radius: 10px;
}

.console-screen-area {
  background: #111;
  border: 4px solid #333;
  border-radius: 10px;
  padding: 20px;
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.scr-info { display: flex; flex-direction: column; }
.scr-label { font-size: 0.6rem; color: #666; font-weight: 800; }
.scr-val { font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-primary); }

.scr-meters { display: flex; flex-direction: column; gap: 4px; width: 100px; }
.meter-bar { height: 4px; background: #222; border-radius: 2px; overflow: hidden; }
.meter-bar .fill { height: 100%; background: var(--color-secondary); }

.player-monitor {
  position: relative;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid #222;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.3) 50%
  );
  background-size: 100% 4px;
  z-index: 10;
  pointer-events: none;
}

/* Console Controls */
.console-controls {
  margin-top: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.control-group {
  display: flex;
  gap: 1rem;
}

.c-btn {
  background: #252525;
  border: none;
  border-bottom: 4px solid #000;
  padding: 0.8rem 1.5rem;
  color: #666;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.c-btn.active {
  background: #333;
  color: #1DB954;
  border-bottom-color: #1DB954;
}

.icon { font-size: 1rem; }

.vu-meter-wrap {
  flex: 1;
  text-align: center;
}

.vu-bars {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  height: 30px;
  margin-bottom: 8px;
}

.vu-bar {
  width: 6px;
  height: 10%;
  background: #333;
  border-radius: 1px;
}

.cassette-tape.active ~ .console-wrap .vu-bar {
  background: var(--color-secondary);
  animation: vu-dance 0.5s infinite alternate ease-in-out;
}

@keyframes vu-dance {
  from { height: 10%; }
  to { height: 90%; }
}

.vu-label { font-size: 0.6rem; color: #444; font-weight: 800; letter-spacing: 0.1em; }

.open-spotify-btn {
  background: #1DB954;
  color: #000;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  font-weight: 800;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.3s;
}

.open-spotify-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);
}

.screen-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.sf-item { display: flex; flex-direction: column; }
.sf-lab { font-size: 0.55rem; color: #444; font-weight: 800; }
.sf-val { font-size: 0.7rem; color: #888; letter-spacing: 0.05em; }

/* Transitions */
.tape-insert-enter-active {
  animation: tape-in 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
.tape-insert-leave-active {
  animation: tape-out 0.4s ease-in;
}

@keyframes tape-in {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes tape-out {
  to { transform: scale(0.9); opacity: 0; }
}

@media (max-width: 768px) {
  .console-box { padding: 1.5rem; }
  .console-controls { flex-direction: column; align-items: stretch; }
  .vu-meter-wrap { order: -1; }
  .cassette-grid { gap: 1rem; }
  .cassette-tape { width: 140px; }
  .tape-body { height: 90px; }
  .volume-id { font-size: 0.9rem; }
  .sp-iframe { height: 450px; }
}
</style>
