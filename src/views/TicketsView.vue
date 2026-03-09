<script setup>
import MarqueeSection from '../components/MarqueeSection.vue';
const tickets = [
  {
    name: 'EARLY BIRD',
    price: 'TBA',
    status: 'upcoming',
    statusLabel: 'TBA',
    color: 'yellow',
    features: ['Tiket Masuk', 'Sticker Pack Eksklusif'],
    link: null,
  },
  {
    name: 'PRESALE 1',
    price: 'TBA',
    status: 'upcoming',
    statusLabel: 'TBA',
    color: 'pink',
    features: ['Tiket Masuk', 'Sticker Pack', 'Priority Queue'],
    link: null,
  },
  {
    name: 'PRESALE 2',
    price: 'TBA',
    status: 'upcoming',
    statusLabel: 'TBA',
    color: 'green',
    features: ['Tiket Masuk'],
    link: null,
  },
  {
    name: 'REGULER',
    price: 'TBA',
    status: 'upcoming',
    statusLabel: 'TBA',
    color: 'yellow',
    features: ['Tiket Masuk'],
    link: null,
  },
]
</script>

<template>
  <!-- Ticket Hero -->
  <section class="ticket-hero">
    <div class="th-bg-text">TIKET</div>
    <div class="container th-inner">
      <div class="section-label">SILATURAHMI RELOADED</div>
      <h1 class="th-title">TIKET<br><span class="accent">2027 EDITION</span></h1>
      <p class="th-sub">Bersiap untuk reuni punk terbesar. Stay tuned untuk update tiket.</p>
    </div>
  </section>

  <MarqueeSection text="BUY TIKET AT KOLEKTIX.COM" />

  <!-- Ticket Cards -->
  <section class="tickets-section">
    <div class="container">
      <div class="tickets-grid">
        <div
          v-for="(ticket, i) in tickets"
          :key="i"
          class="ticket-card"
          :class="[`card-${ticket.color}`, ticket.status === 'hot' && 'featured']"
        >
          <!-- Top Badge -->
          <div class="ticket-top" :class="`top-${ticket.color}`">
            <h2 class="ticket-name">{{ ticket.name }}</h2>
            <span class="ticket-status-badge" :class="`badge-${ticket.status}`">
              {{ ticket.statusLabel }}
            </span>
          </div>

          <!-- Price -->
          <div class="ticket-price-area">
            <span class="ticket-price">{{ ticket.price }}</span>
            <span class="ticket-price-note">/ orang</span>
          </div>

          <!-- Divider -->
          <div class="ticket-divider">
            <div class="notch-left"></div>
            <div class="dashed-line"></div>
            <div class="notch-right"></div>
          </div>

          <!-- Features -->
          <ul class="ticket-features">
            <li v-for="(f, j) in ticket.features" :key="j">
              <span class="check">✓</span> {{ f }}
            </li>
          </ul>

          <!-- CTA -->
          <div class="ticket-footer">
            <a
              v-if="ticket.link"
              :href="ticket.link"
              target="_blank"
              class="btn btn-yellow"
            >
              BELI SEKARANG →
            </a>
            <button v-else-if="ticket.status === 'sold'" class="btn" disabled>
              HABIS
            </button>
            <button v-else class="btn btn-outline-dark">
              BUY TICKET
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Info Technical Strip -->
  <section class="ticket-info-section">
    <div class="container">
      <div class="info-strip">
        <div class="info-item">
          <span class="info-label">TANGGAL</span>
          <span class="info-value">TBA</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">LOKASI</span>
          <span class="info-value">TBA</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <span class="info-label">TIKET VIA</span>
          <span class="info-value">KOLEKTIX.COM</span>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Short -->
  <section class="ticket-faq">
    <div class="container">
      <h2 class="faq-title">PERTANYAAN UMUM</h2>
      <div class="faq-list">
        <div class="faq-item">
          <div class="faq-q">Apakah tiket bisa refund?</div>
          <div class="faq-a">TBA</div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Apa yang perlu dibawa saat masuk?</div>
          <div class="faq-a">TBA</div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Ada batas usia?</div>
          <div class="faq-a">TBA</div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Gate dibuka jam berapa?</div>
          <div class="faq-a">TBA</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---- Hero ---- */
.ticket-hero {
  min-height: 45vh;
  background: var(--color-black);
  display: flex;
  align-items: center;
  padding: 8rem 1rem 4rem;
  overflow: hidden;
}

.th-bg-text {
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

.th-inner {
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

.th-title {
  font-size: clamp(3rem, 9vw, 7rem);
  line-height: 0.9;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.th-title .accent {
  color: var(--color-primary);
}

.th-sub {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.6);
}

/* ---- Tickets Section ---- */
.tickets-section {
  padding: 5rem 0 2rem;
  background: var(--color-black);
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

.ticket-card {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: var(--transition-normal);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.ticket-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  border-color: var(--color-primary);
}

.ticket-card.featured {
  transform: scale(1.05);
  box-shadow: 0 0 50px rgba(255,0,128,0.2);
  border: none;
  background: linear-gradient(135deg, var(--color-dark-surface) 0%, #1a1a1a 100%);
  position: relative;
  z-index: 2;
  animation: cardFloat 4s ease-in-out infinite;
}

@keyframes cardFloat {
  0%, 100% { transform: scale(1.05) translateY(0); }
  50% { transform: scale(1.05) translateY(-10px); }
}

.ticket-card.featured:hover {
  animation-play-state: paused;
  transform: scale(1.08) translateY(-15px);
}

.card-yellow { border-color: var(--color-black); }
.card-pink   { border-color: var(--color-black); }
.card-green  { border-color: var(--color-black); }

/* Ticket Top */
.ticket-top {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.top-yellow { background: rgba(255,221,0,0.05); border-bottom: 2px solid var(--color-primary); }
.top-pink   { 
  background: linear-gradient(to bottom, rgba(255,0,128,0.2), rgba(255,0,128,0.05)); 
  border-bottom: 2px solid var(--color-secondary); 
}
.top-green  { background: rgba(0,204,68,0.05);  border-bottom: 2px solid var(--color-tertiary); }

.ticket-name {
  font-family: var(--font-heading);
  font-size: 1rem;
  margin: 0;
  color: var(--color-white);
  letter-spacing: 0.1em;
}

.ticket-status-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 3px 10px;
  border-radius: 3px;
  width: fit-content;
}

.badge-sold     { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
.badge-hot      { background: var(--color-secondary); color: #fff; }
.badge-upcoming { background: rgba(0,204,68,0.2); color: var(--color-tertiary); }

/* Price */
.ticket-price-area {
  padding: 1.5rem 1.5rem 1rem;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.ticket-price {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: var(--color-white);
}

.ticket-price-note {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
}

/* Ticket Divider (tear effect) */
.ticket-divider {
  display: flex;
  align-items: center;
  position: relative;
  margin: 0.5rem 0;
}

.notch-left,
.notch-right {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-dark-surface);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  margin: 0 -8px;
}

.dashed-line {
  flex: 1;
  border-top: 1px dashed rgba(255,255,255,0.1);
}

/* Features */
.ticket-features {
  padding: 1rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ticket-features li {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.check {
  color: var(--color-tertiary);
  font-weight: bold;
}

/* Footer */
.ticket-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.ticket-footer .btn,
.ticket-footer a.btn {
  width: 100%;
  justify-content: center;
}

.btn-outline-dark {
  background: transparent;
  color: rgba(255,255,255,0.4);
  border: 2px solid rgba(255,255,255,0.15);
  box-shadow: none;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem;
  width: 100%;
  cursor: default;
}

/* ---- Info Technical Strip ---- */
.ticket-info-section {
  background: var(--color-black);
  padding: 2rem 0;
  border-top: 1px solid rgba(255, 221, 0, 0.15);
  border-bottom: 1px solid rgba(255, 221, 0, 0.15);
}

.info-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-label {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 800;
  text-transform: uppercase;
}

.info-value {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--color-primary);
  line-height: 1;
}

.info-divider {
  width: 1px;
  height: 50px;
  background: rgba(255, 221, 0, 0.1);
}

@media (max-width: 1024px) {
  .tickets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .tickets-grid {
    grid-template-columns: 1fr;
  }
  .ticket-info-section {
    padding: 3rem 0;
  }
  .info-strip {
    flex-direction: column;
    align-items: flex-start;
    gap: 2.5rem;
  }
  .info-divider {
    display: none;
  }
  .info-value {
    font-size: 1.5rem;
  }
}

/* ---- FAQ ---- */
.ticket-faq {
  padding: 5rem 0;
  background: var(--color-black);
}

.faq-title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: var(--color-primary);
  margin-bottom: 2rem;
  -webkit-text-stroke: 0;
  text-shadow: 3px 3px 0 var(--color-secondary);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 700px;
}

.faq-item {
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 1.5rem 0;
}

.faq-q {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--color-white);
  margin-bottom: 0.5rem;
}

.faq-a {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.6;
}
</style>
