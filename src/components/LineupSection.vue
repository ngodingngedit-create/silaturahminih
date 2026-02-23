<script setup>
const artists = [
  'DONGKER', 'MARJINAL', 'THE JANSEN', 
  'THE BRANDALS', 'SUKATANI', 'LIPS',
  'DAT BUNNY', 'BAXLAX BOY', 'TABRAK LARI',
  'SUKSES LANCAR REJEKI'
];
</script>

<template>
  <section id="lineup" class="lineup-section">
    <div class="container">
      <h2 class="section-title">LINEUP FASE 1</h2>
      
      <div class="lineup-grid">
        <div v-for="(artist, index) in artists" :key="index" class="artist-card">
          <span class="artist-name">{{ artist }}</span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 3rem;">
        <button class="btn btn-pink">Lihat Semua Artis</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lineup-section {
  padding: 5rem 0;
  background-color: var(--color-dark-surface);
  background-image: radial-gradient(rgba(255, 221, 0, 0.15) 2px, transparent 2px);
  background-size: 30px 30px;
}

.section-title {
  color: var(--color-primary);
  -webkit-text-stroke: 0;
  text-shadow: 4px 4px 0 var(--color-secondary);
}

.lineup-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.artist-card {
  background: rgba(255, 221, 0, 0.12);
  border: var(--border-width) solid var(--color-primary);
  padding: 2rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-primary);
  cursor: default;
  color: var(--color-white);
}

.artist-card:nth-child(2n) {
  background: rgba(0, 204, 68, 0.15);
  border-color: var(--color-tertiary);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-tertiary);
}

.artist-card:nth-child(3n) {
  background: rgba(255, 0, 128, 0.15);
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-secondary);
  color: var(--color-white);
}

.artist-card:hover {
  transform: translate(-4px, -4px) rotate(-1deg);
  box-shadow: 8px 8px 0 var(--color-primary);
  z-index: 10;
}

.artist-name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  text-transform: uppercase;
}
</style>
