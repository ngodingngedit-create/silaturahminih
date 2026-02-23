<script setup>
import { ref } from 'vue'
import MarqueeSection from '../components/MarqueeSection.vue';

const openFaq = ref(null)

function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

const faqs = [
  {
    q: 'Parkir ada nggak di Pamulang Square?',
    a: 'Ada, Pamulang Square punya area parkir yang cukup luas. Tapi lebih disarankan naik kendaraan umum atau ojol karena diperkirakan bakal rame banget.',
  },
  {
    q: 'Boleh bawa makanan dari luar?',
    a: 'Tidak boleh. Di dalam area festival sudah tersedia banyak booth makanan dan minuman.',
  },
  {
    q: 'Gimana kondisi venue-nya?',
    a: 'Pamulang Square adalah area outdoor. Disarankan pakai baju yang nyaman dan siapkan jas hujan jika cuaca tidak menentu.',
  },
  {
    q: 'Ada fasilitas apa aja di venue?',
    a: 'Toilet umum, area istirahat, booth merchandise, booth makanan & minuman, dan area foto.',
  },
  {
    q: 'Apakah boleh keluar-masuk venue?',
    a: 'Tidak. Tiket hanya berlaku untuk satu kali masuk. Keluar berarti tiket hangus.',
  },
]

const schedule = [
  { time: '13:00', event: 'Gate Dibuka', stage: '' },
  { time: '14:00', event: 'SUKSES LANCAR REJEKI', stage: 'Main Stage' },
  { time: '14:00', event: 'BAXLAX BOY', stage: 'Side Stage' },
  { time: '15:00', event: 'TABRAK LARI', stage: 'Main Stage' },
  { time: '15:00', event: 'DAT BUNNY', stage: 'Side Stage' },
  { time: '16:00', event: 'LIPS', stage: 'Side Stage' },
  { time: '17:00', event: 'THE JANSEN', stage: 'Main Stage' },
  { time: '17:30', event: 'SUKATANI', stage: 'Side Stage' },
  { time: '18:30', event: 'MARJINAL', stage: 'Main Stage' },
  { time: '19:00', event: 'THE BRANDALS', stage: 'Side Stage' },
  { time: '20:00', event: 'DONGKER — CLOSING', stage: 'Main Stage' },
  { time: '22:00', event: 'Festival Berakhir', stage: '' },
]
</script>

<template>
  <!-- Info Hero -->
  <section class="info-hero">
    <div class="ih-bg-text">INFO</div>
    <div class="container ih-inner">
      <div class="section-label">SEMUA YANG LO PERLU TAU</div>
      <h1 class="ih-title">INFO<br><span class="accent">FESTIVAL</span></h1>
      <p class="hi-sub">Silaturahmi Festival 2027 siap kembali menggebrak. Cek info selengkapnya di bawah.</p>
    </div>
  </section>

  <MarqueeSection text="INFO SILATURAHMI" />

  <!-- Venue Section -->
  <section class="venue-section">
    <div class="container">
      <div class="venue-grid">
        <div class="venue-text">
          <div class="section-label">LOKASI ACARA</div>
          <h2 class="venue-title">PAMULANG SQUARE</h2>
          <p class="venue-address">
            Jl. Surya Kencana No.29, Pamulang Bar.,<br>
            Kec. Pamulang, Kota Tangerang Selatan,<br>
            Banten 15417
          </p>

          <div class="venue-meta-list">
            <div class="vm-item">
              <span class="vm-icon">📅</span>
              <div>
                <span class="vm-label">Tanggal</span>
                <span class="vm-val">Minggu, 15 Juni 2027</span>
              </div>
            </div>
            <div class="vm-item">
              <span class="vm-icon">🕐</span>
              <div>
                <span class="vm-label">Jam Buka</span>
                <span class="vm-val">13.00 WIB — Selesai</span>
              </div>
            </div>
            <div class="vm-item">
              <span class="vm-icon">🚇</span>
              <div>
                <span class="vm-label">Transportasi</span>
                <span class="vm-val">Ojol / KRL + Angkot</span>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Pamulang+Square"
            target="_blank"
            class="btn btn-yellow"
          >
            BUKA DI GOOGLE MAPS →
          </a>
        </div>

        <div class="venue-map-box">
          <div class="map-placeholder">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.5!2d106.732!3d-6.343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ef8b3!2sPamulang+Square!5e0!3m2!1sen!2sid!4v1"
              width="100%"
              height="300"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Pamulang Square Map"
            ></iframe>
          </div>
          <div class="map-label">📍 Pamulang Square, Tangerang Selatan</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Schedule Section -->
  <section class="schedule-section">
    <div class="container">
      <div class="section-label">RUNDOWN ACARA</div>
      <h2 class="schedule-title">JADWAL <span class="accent">PENAMPILAN</span></h2>

      <div class="schedule-table">
        <div class="st-header">
          <span>WAKTU</span>
          <span>PENAMPIL</span>
          <span>STAGE</span>
        </div>
        <div
          v-for="(row, i) in schedule"
          :key="i"
          class="st-row"
          :class="{
            'closing': row.event.includes('CLOSING'),
            'gate': row.stage === '',
          }"
        >
          <span class="st-time">{{ row.time }}</span>
          <span class="st-event">{{ row.event }}</span>
          <span class="st-stage" v-if="row.stage">
            <span class="stage-pill" :class="row.stage === 'Main Stage' ? 'main' : 'side'">
              {{ row.stage }}
            </span>
          </span>
          <span class="st-stage" v-else></span>
        </div>
      </div>

      <p class="schedule-note">* Rundown dapat berubah sewaktu-waktu. Follow IG kami untuk update terbaru.</p>
    </div>
  </section>

  <!-- How to Get There -->
  <section class="transport-section">
    <div class="container">
      <div class="section-label">CARA KE SANA</div>
      <h2 class="transport-title">RUTE <span class="accent">MENUJU VENUE</span></h2>

      <div class="transport-grid">
        <div class="transport-card">
          <div class="tc-icon">🚆</div>
          <h3 class="tc-title">KRL + Angkot</h3>
          <p class="hi-date">15 JUNI 2027, JKT</p>
          <p class="tc-desc">
            Turun di Stasiun Sudimara (KRL Commuter Line Rangkasbitung).
            Lanjut angkot T02 arah Pamulang. Turun di depan Pamulang Square.
          </p>
        </div>
        <div class="transport-card">
          <div class="tc-icon">🛵</div>
          <h3 class="tc-title">Ojol / Taksi Online</h3>
          <p class="tc-desc">
            Search "Pamulang Square" di Gojek/Grab. Opsi paling gampang dan recommended buat yang dari jauh.
          </p>
        </div>
        <div class="transport-card">
          <div class="tc-icon">🚗</div>
          <h3 class="tc-title">Kendaraan Pribadi</h3>
          <p class="tc-desc">
            Pamulang Square tersedia area parkir. Dari Tol BSD keluar pintu Pamulang, lurus menuju Jl. Surya Kencana.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq-section">
    <div class="container">
      <div class="section-label">PERTANYAAN UMUM</div>
      <h2 class="faq-title">FAQ</h2>

      <div class="faq-list">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="faq-item"
          :class="{ open: openFaq === i }"
          @click="toggleFaq(i)"
        >
          <div class="faq-q">
            <span>{{ faq.q }}</span>
            <span class="faq-icon">{{ openFaq === i ? '−' : '+' }}</span>
          </div>
          <div class="faq-a" v-show="openFaq === i">{{ faq.a }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---- Hero ---- */
.info-hero {
  min-height: 45vh;
  background: var(--color-black);
  display: flex;
  align-items: center;
  padding: 8rem 1rem 4rem;
  overflow: hidden;
}

.ih-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-heading);
  font-size: clamp(8rem, 20vw, 20rem);
  color: transparent;
  -webkit-text-stroke: 2px rgba(255,221,0,0.07);
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
}

.ih-inner { position: relative; z-index: 1; }

.section-label {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 0.8rem;
}

.ih-title {
  font-size: clamp(3rem, 9vw, 7rem);
  line-height: 0.9;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.ih-title .accent { color: var(--color-primary); }

.ih-sub {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.6);
}

/* ---- Venue ---- */
.venue-section {
  padding: 5rem 0;
  background: var(--color-black);
}

.venue-grid {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.venue-text {
  flex: 1;
  min-width: 300px;
}

.venue-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--color-white);
  line-height: 1;
  margin-bottom: 0.8rem;
}

.venue-address {
  color: rgba(255,255,255,0.55);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.venue-meta-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.vm-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vm-icon { font-size: 1.5rem; }

.vm-item div {
  display: flex;
  flex-direction: column;
}

.vm-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.vm-val {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--color-white);
}

.venue-map-box {
  flex: 1;
  min-width: 300px;
}

.map-placeholder {
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  border-radius: var(--radius-md);
}

.map-label {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  margin-top: 0.5rem;
  text-align: center;
}

/* ---- Schedule ---- */
.schedule-section {
  padding: 5rem 0;
  background: var(--color-black);
  border-top: 1px solid rgba(255,255,255,0.05);
}

.schedule-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--color-white);
  margin-bottom: 3rem;
  text-align: center;
}

.schedule-title .accent { color: var(--color-primary); }

.schedule-table {
  border: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 2rem;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.st-header {
  display: grid;
  grid-template-columns: 80px 1fr 140px;
  padding: 1rem 1.5rem;
  background: var(--color-dark-surface);
  color: var(--color-white);
  font-family: var(--font-heading);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.st-row {
  display: grid;
  grid-template-columns: 80px 1fr 140px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  align-items: center;
  transition: background 0.2s;
}

.st-row:last-child { border-bottom: none; }
.st-row:hover { background: rgba(255,221,0,0.04); }

.st-row.gate {
  opacity: 0.5;
  font-style: italic;
}

.st-row.closing {
  background: rgba(255,221,0,0.08);
}

.st-time {
  font-family: var(--font-heading);
  color: var(--color-primary);
  font-size: 1rem;
}

.st-event {
  font-family: var(--font-heading);
  color: var(--color-white);
  font-size: 1.1rem;
}

.stage-pill {
  font-size: 0.7rem;
  padding: 3px 10px;
  border-radius: 3px;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.stage-pill.main {
  background: rgba(255,221,0,0.15);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.stage-pill.side {
  background: rgba(255,0,128,0.15);
  color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
}

.schedule-note {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.35);
  font-style: italic;
}

/* ---- Transport ---- */
.transport-section {
  padding: 5rem 0;
  background: var(--color-black);
  border-top: 1px solid rgba(255,255,255,0.05);
}

.transport-title {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--color-white);
  margin-bottom: 2rem;
}

.transport-title .accent { color: var(--color-primary); }

.transport-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.transport-card {
  padding: 2rem;
  background: rgba(255,221,0,0.05);
  border: 2px solid rgba(255,221,0,0.2);
  border-radius: 0;
  transition: border-color 0.2s;
}

.transport-card:hover {
  border-color: var(--color-primary);
}

.tc-icon { font-size: 2rem; margin-bottom: 1rem; }

.tc-title {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: 0.8rem;
  -webkit-text-stroke: 0;
}

.tc-desc {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
}

/* ---- FAQ ---- */
.faq-section {
  padding: 5rem 0;
  background: var(--color-black);
  border-top: 3px solid rgba(255,221,0,0.2);
}

.faq-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-shadow: 3px 3px 0 var(--color-secondary);
  -webkit-text-stroke: 0;
}

.faq-list {
  max-width: 750px;
}

.faq-item {
  border-bottom: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  user-select: none;
}

.faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  color: var(--color-white);
  transition: color 0.2s;
}

.faq-item:hover .faq-q,
.faq-item.open .faq-q {
  color: var(--color-primary);
}

.faq-icon {
  font-size: 1.5rem;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq-a {
  padding-bottom: 1.4rem;
  color: rgba(255,255,255,0.55);
  font-size: 0.95rem;
  line-height: 1.7;
}
</style>
