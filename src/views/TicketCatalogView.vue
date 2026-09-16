<script setup>
import { useRouter } from 'vue-router'
import { EVENT_PATH } from '../utils/eventRoute.js'

const router = useRouter()

const catalog = [
  {
    id: 'blind-ticket',
    badge: 'Blind Ticket',
    title: 'Blind Ticket JMMD 2026',
    date: '23 May 2026',
    price: 'Rp 150.000',
    org: 'Warriors',
    image: 'https://api.kolektix.com/storage/uploads/event/HoLrFyNj1A4GWyQD6g7d.jpg',
  },
  {
    id: 'early-bird',
    badge: 'Early Bird',
    title: 'Early Bird JMMD 2026',
    date: '23 May 2026',
    price: 'Rp 250.000',
    org: 'Warriors',
    image: 'https://api.kolektix.com/storage/uploads/event/HoLrFyNj1A4GWyQD6g7d.jpg',
  },
  {
    id: 'presale-1',
    badge: 'Presale 1',
    title: 'Presale 1 JMMD 2026',
    date: '23 May 2026',
    price: 'Rp 350.000',
    org: 'Warriors',
    image: 'https://api.kolektix.com/storage/uploads/event/HoLrFyNj1A4GWyQD6g7d.jpg',
  },
  {
    id: 'presale-2',
    badge: 'Presale 2',
    title: 'Presale 2 JMMD 2026',
    date: '23 May 2026',
    price: 'Rp 420.000',
    org: 'Warriors',
    image: 'https://api.kolektix.com/storage/uploads/event/HoLrFyNj1A4GWyQD6g7d.jpg',
  },
]

function openDetail() {
  router.push(EVENT_PATH)
}
</script>

<template>
  <div class="tix-catalog-page">
    <section class="tix-catalog-hero">
      <div class="container tix-wide">
        <h1 class="tix-catalog-title">Tiket</h1>
      </div>
    </section>

    <section class="tix-catalog-section">
      <div class="container tix-wide">
        <div class="tix-catalog-grid">
          <article
            v-for="t in catalog"
            :key="t.id"
            class="tix-catalog-card"
            @click="openDetail"
          >
            <div class="tix-catalog-media">
              <img :src="t.image" :alt="t.title" class="tix-catalog-img" loading="lazy" />
            </div>
            <span class="tix-catalog-badge">{{ t.badge }}</span>
            <div class="tix-catalog-body">
              <h3 class="tix-catalog-name">{{ t.title }}</h3>
              <p class="tix-catalog-date">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {{ t.date }}
              </p>
              <p class="tix-catalog-price">{{ t.price }}</p>
              <div class="tix-catalog-org">
                <span class="tix-catalog-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <span class="tix-catalog-org-name">{{ t.org }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tix-catalog-page {
  background: var(--color-black);
  color: var(--color-white);
  min-height: 100vh;
  padding-bottom: 4rem;
}
.tix-catalog-hero {
  padding: 9rem 0 2rem;
  background: var(--color-black);
}
.container.tix-wide {
  max-width: 1360px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.tix-catalog-title {
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 6vw, 4rem);
  line-height: 1;
  font-weight: 500;
  text-transform: none;
  color: var(--color-white);
  margin: 0 0 0.5rem;
  text-align: center;
}
.tix-catalog-section {
  padding: 1rem 0 3rem;
  background: var(--color-black);
}
.tix-catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.4rem, 1vw, 0.8rem);
}
.tix-catalog-card {
  background: transparent;
  border: none;
  border-radius: 10px;
  overflow: visible;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
}
.tix-catalog-media {
  position: relative;
  aspect-ratio: auto;
  background: #111;
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.3s ease;
}
.tix-catalog-card:hover .tix-catalog-media {
  transform: scale(1.03);
}
.tix-catalog-media::after {
  content: "";
  position: absolute;
  top: 0;
  left: -80%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent);
  transform: skewX(-20deg);
  transition: left 0.7s ease;
  pointer-events: none;
}
.tix-catalog-card:hover .tix-catalog-media::after {
  left: 130%;
}
.tix-catalog-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 8px 8px 6px 6px;
  transition: transform 0.5s ease;
}
.tix-catalog-card:hover .tix-catalog-img {
  transform: none;
}
.tix-catalog-badge {
  position: absolute;
  top: 10px;
  left: -6px;
  background: var(--color-primary);
  color: #111;
  font-size: clamp(0.55rem, 0.9vw, 0.68rem);
  font-weight: 400;
  text-transform: none;
  letter-spacing: normal;
  line-height: 1;
  padding: 0.32rem 0.9rem 0.32rem 0.6rem;
  border-radius: 0 999px 999px 0;
  max-width: calc(100% + 10px);
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
  z-index: 2;
}
.tix-catalog-badge::after {
  content: "";
  position: absolute;
  left: 0;
  top: 100%;
  width: 0;
  height: 0;
  border-top: 5px solid #8a7600;
  border-left: 5px solid transparent;
}
.tix-catalog-body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.85rem 0.9rem 1rem;
  flex: 1;
}
.tix-catalog-name {
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 1.4vw, 1.02rem);
  font-weight: 400;
  text-transform: none;
  color: var(--color-white);
  margin: 0;
  line-height: 1.3;
}
.tix-catalog-date {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: clamp(0.7rem, 1.1vw, 0.85rem);
  font-weight: 400;
  color: rgba(245, 245, 240, 0.55);
  margin: 0;
}
.tix-catalog-price {
  font-size: clamp(0.88rem, 1.6vw, 1.1rem);
  font-weight: 400;
  text-transform: none;
  color: var(--color-primary);
  margin: 0.15rem 0 0.4rem;
}
.tix-catalog-org {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  border-top: 1px solid rgba(245, 245, 240, 0.1);
  padding-top: 0.6rem;
}
.tix-catalog-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-black);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tix-catalog-org-name {
  font-size: clamp(0.65rem, 1vw, 0.78rem);
  font-weight: 400;
  letter-spacing: normal;
  text-transform: none;
  color: rgba(245, 245, 240, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 1024px) {
  .tix-catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .tix-catalog-hero {
    padding: 5.5rem 0 1.25rem;
  }
  .container.tix-wide {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .tix-catalog-grid {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 0.5rem;
  }
  .tix-catalog-card {
    width: 100%;
    max-width: 300px;
  }
  .tix-catalog-body {
    padding: 0.6rem 0.65rem 0.75rem;
    gap: 0.22rem;
  }
  .tix-catalog-avatar {
    width: 22px;
    height: 22px;
  }
}
</style>
