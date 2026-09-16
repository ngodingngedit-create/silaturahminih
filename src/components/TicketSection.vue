<script setup>
import { useRouter } from 'vue-router'
import { TICKET_CATALOG_PATH } from '../utils/eventRoute.js'
const router = useRouter()
</script>

<template>
  <section id="tickets" class="ticket-section">
    <div class="container">
      <h2 class="section-title">TIKET</h2>
      
      <div class="ticket-grid">
        <!-- Card 1 -->
        <div class="ticket-card">
          <div class="card-header">
            <h3>EARLY BIRD</h3>
          </div>
          <div class="card-body">
            <p class="price">TBA</p>
            <ul class="features">
            </ul>
          </div>
          <button class="btn btn-yellow" @click="router.push(TICKET_CATALOG_PATH)">Lihat Detail Tiket</button>
        </div>

        <!-- Card 2 -->
        <div class="ticket-card">
          <div class="card-header bg-pink">
            <h3>PRESALE 1</h3>
          </div>
          <div class="card-body">
            <p class="price">TBA</p>
            <ul class="features">
            </ul>
          </div>
          <button class="btn btn-yellow" @click="router.push(TICKET_CATALOG_PATH)">Lihat Detail Tiket</button>
        </div>

        <!-- Card 3 -->
        <div class="ticket-card">
          <div class="card-header bg-green">
            <h3>PRESALE 2</h3>
          </div>
          <div class="card-body">
            <p class="price">TBA</p>
            <ul class="features">
            </ul>
          </div>
          <button class="btn btn-yellow" @click="router.push(TICKET_CATALOG_PATH)">Lihat Detail Tiket</button>
        </div>

        <!-- Card 4 -->
        <div class="ticket-card">
          <div class="card-header bg-pink">
            <h3>REGULER</h3>
          </div>
          <div class="card-body">
            <p class="price">TBA</p>
            <ul class="features">
            </ul>
          </div>
          <button class="btn btn-yellow" @click="router.push(TICKET_CATALOG_PATH)">Lihat Detail Tiket</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticket-section {
  padding: 5rem 0;
  background-color: var(--color-primary); /* Yellow */
}

.section-title {
   text-shadow: 4px 4px 0 var(--color-black);
}

.ticket-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.ticket-card {
  background: var(--color-white);
  border: var(--border-width) solid var(--color-black);
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 8px 8px 0 var(--color-black);
}

.ticket-card.featured {
  transform: scale(1.05); /* Slightly bigger */
  z-index: 2;
}

.card-header {
  border-bottom: var(--border-width) solid var(--color-black);
  padding: 1.5rem;
  text-align: center;
  background: var(--color-black);
  color: var(--color-white);
}

.card-header.bg-pink { background: var(--color-secondary); color: var(--color-white); }
.card-header.bg-green { background: var(--color-tertiary); color: var(--color-white); }

.card-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.status {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: bold;
  background: var(--color-white);
  color: var(--color-black);
  padding: 2px 6px;
  border-radius: 4px;
}

.card-body {
  padding: 2rem;
  text-align: center;
  flex-grow: 1;
}

.price {
  font-family: var(--font-heading);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.features li {
  margin-bottom: 0.5rem;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 0.5rem;
}

.ticket-card button {
  width: 100%;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
  box-shadow: none;
}

.sold-out {
  opacity: 0.7;
  filter: grayscale(1);
}
</style>
