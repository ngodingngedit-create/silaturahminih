<script setup>
import { ref, computed } from 'vue';
import MarqueeSection from '../components/MarqueeSection.vue';

const searchQuery = ref('');
const selectedBand = ref('Semua');
const selectedVol = ref('Semua');

const volumes = ['Semua', 'Vol. 1', 'Vol. 2', 'Vol. 3', 'Vol. 4'];

const merchItems = ref([
  {
    id: 1,
    name: 'Subculture Not For Sale',
    band: 'subculturemerch',
    vol: 'Vol. 1',
    price: 1000,
    image: '/konser1.jpg',
    isNew: true,
    creator: 'subculturemerch',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=subculture',
    description: 'Bahan cotton combed 24s. Screen printing high quality. Oversized fit.',
    link: 'https://kolektix.com/merch/subculture-not-for-sale'
  },
  {
    id: 2,
    name: 'MENTARI NOVEL TSHIRT TOUR',
    band: 'Mentari Novel',
    vol: 'Vol. 2',
    price: 175000,
    image: '/konser2.jpg',
    isNew: false,
    creator: 'Mentari Novel',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mentari',
    description: 'Official tour merchandise for Mentari Novel.',
    link: 'https://kolektix.com/merch/mentari-novel-tshirt'
  },
  {
    id: 3,
    name: 'BUT FIRST KC T SHIRT WHITE',
    band: 'Karina Christy',
    vol: 'Vol. 2',
    price: 230000,
    image: '/konser3.jpg',
    isNew: false,
    creator: 'Karina Christy',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karina',
    description: 'Limited edition white t-shirt by Karina Christy.',
    link: 'https://kolektix.com/merch/kc-tshirt-white'
  },
  {
    id: 4,
    name: 'New Feeling Black Long Sleeves',
    band: 'MCL',
    vol: 'Vol. 3',
    price: 310000,
    image: '/konser1.jpg',
    isNew: false,
    creator: 'MCL',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mcl',
    description: 'Modern black long sleeve shirt with unique prints.',
    link: 'https://kolektix.com/merch/new-feeling-ls'
  },
  {
    id: 5,
    name: 'Monolog Tshirt',
    band: 'MCL',
    vol: 'Vol. 4',
    price: 275000,
    image: '/konser2.jpg',
    isNew: false,
    creator: 'MCL',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mcl2',
    description: 'Clean and simple Monolog t-shirt.',
    link: 'https://kolektix.com/merch/monolog-tshirt'
  },
]);

const bands = computed(() => {
  const uniqBands = [...new Set(merchItems.value.map(item => item.creator))];
  return ['Semua', ...uniqBands];
});

const filteredMerch = computed(() => {
  return merchItems.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         item.creator.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesBand = selectedBand.value === 'Semua' || item.creator === selectedBand.value;
    const matchesVol = selectedVol.value === 'Semua' || item.vol === selectedVol.value;
    return matchesSearch && matchesBand && matchesVol;
  });
});

const selectedProduct = ref(null);
const isModalOpen = ref(false);

function openDetail(product) {
  selectedProduct.value = product;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedProduct.value = null;
  }, 300);
}

function formatPrice(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value).replace(/\s/, '');
}
</script>

<template>
  <div class="merch-view">
    <!-- Merch Hero -->
    <section class="merch-hero">
      <div class="mh-bg-text">MERCH</div>
      <div class="container mh-inner">
        <div class="section-label">SILATURAHMI RELOADED</div>
        <h1 class="mh-title">OFFICIAL<br><span class="accent">MERCH 2027</span></h1>
        <p class="mh-sub">Koleksi eksklusif band-band favorit di Silaturahmi Festival.</p>
      </div>
    </section>

    <MarqueeSection text="OFFICIAL MERCHANDAISE SILATURAHMI" />

    <div class="container catalog-container">
      <!-- Search & Filters -->
      <div class="catalog-controls">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari produk..." 
            class="pill-input"
          >
        </div>

        <div class="filter-area">
          <div class="filter-label">BERDASARKAN VOLUME:</div>
          <div class="filter-chips vol-chips">
            <button 
              v-for="vol in volumes" 
              :key="vol"
              class="chip-btn"
              :class="{ active: selectedVol === vol }"
              @click="selectedVol = vol"
            >
              {{ vol }}
            </button>
          </div>

          <div class="filter-label">BERDASARKAN BAND:</div>
          <div class="filter-chips band-chips">
            <button 
              v-for="band in bands" 
              :key="band"
              class="chip-btn"
              :class="{ active: selectedBand === band }"
              @click="selectedBand = band"
            >
              {{ band }}
            </button>
          </div>
        </div>
      </div>

      <!-- Merch Grid -->
      <div class="merch-grid">
        <div 
          v-for="item in filteredMerch" 
          :key="item.id" 
          class="merch-card"
          @click="openDetail(item)"
        >
          <div class="card-image">
            <span v-if="item.isNew" class="card-badge">NEW</span>
            <img :src="item.image" :alt="item.name">
            <div class="card-hover">
              <span class="view-btn">LIHAT DETAIL</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="name">{{ item.name }}</h3>
            <div class="card-footer">
              <div class="creator-info">
                <img :src="item.creatorAvatar" :alt="item.creator" class="creator-avatar">
                <span class="creator">{{ item.creator }}</span>
              </div>
              <p class="price">{{ formatPrice(item.price) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="filteredMerch.length === 0" class="empty-state">
        <p>Produk tidak ditemukan.</p>
      </div>
    </div>
    
    <!-- Visual Divider -->
    <div class="catalog-footer-divider">
      <div class="container">
        <div class="line"></div>
      </div>
    </div>
  </div>

  <!-- Detail Modal -->
  <Transition name="fade-modal">
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-card" @click.stop>
        <button class="close-icon" @click="closeModal">&times;</button>
        
        <div class="modal-layout" v-if="selectedProduct">
          <div class="modal-visual">
            <img :src="selectedProduct.image" :alt="selectedProduct.name">
          </div>
          <div class="modal-details">
            <div class="m-label">OFFICIAL MERCHANDISE</div>
            <h2 class="m-title">{{ selectedProduct.name }}</h2>
            <div class="m-meta">
              <span class="m-author">oleh {{ selectedProduct.creator }}</span>
              <span class="m-price">{{ formatPrice(selectedProduct.price) }}</span>
            </div>
            <div class="m-sep"></div>
            <p class="m-description">{{ selectedProduct.description }}</p>
            
            <a 
              :href="selectedProduct.link" 
              target="_blank" 
              class="btn btn-yellow m-action"
            >
              BELI DI KOLEKTIX →
            </a>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.merch-view {
  min-height: 100vh;
  background: var(--color-black);
}

/* ---- Hero ---- */
.merch-hero {
  min-height: 45vh;
  background: var(--color-black);
  display: flex;
  align-items: center;
  padding: 8rem 1rem 4rem;
  overflow: hidden;
  position: relative;
}

.mh-bg-text {
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

.mh-inner {
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

.mh-title {
  font-size: clamp(3rem, 9vw, 7rem);
  line-height: 0.9;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.mh-title .accent {
  color: var(--color-primary);
}

.mh-sub {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.6);
}

/* ---- Catalog ---- */
.catalog-container {
  padding: 4rem 1rem;
}

.catalog-controls {
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-box {
  position: relative;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
}

.pill-input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  padding: 0.8rem 1rem 0.8rem 3rem;
  color: white;
  font-family: var(--font-body);
  transition: all 0.3s ease;
}

.pill-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(255,255,255,0.1);
}

.filter-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.1em;
}

.filter-chips {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.filter-chips::-webkit-scrollbar { display: none; }

.chip-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.6);
  padding: 0.5rem 1.4rem;
  border-radius: 100px;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip-btn:hover { border-color: #fff; color: #fff; }

.chip-btn.active {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

/* ---- Grid ---- */
.merch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2.5rem;
  margin-bottom: 5rem;
}

.merch-card {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-normal);
  display: flex;
  flex-direction: column;
}

.merch-card:hover {
  transform: translateY(-10px);
  border-color: var(--color-primary);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.card-image {
  position: relative;
  aspect-ratio: 1;
}

.card-image img { width: 100%; height: 100%; object-fit: cover; }

.card-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: var(--color-secondary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 3px;
  z-index: 10;
}

.card-hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.merch-card:hover .card-hover { opacity: 1; }

.view-btn {
  background: #fff;
  color: #000;
  font-family: var(--font-heading);
  font-size: 0.7rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}

.name {
  font-size: 1.1rem;
  font-family: var(--font-heading);
  color: #fff;
  line-height: 1.2;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.creator-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
}

.creator-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
}

.creator {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-primary);
  white-space: nowrap;
}

/* ---- Footer Divider ---- */
.catalog-footer-divider { padding-top: 2rem; }
.line { height: 1px; background: rgba(255,255,255,0.05); }

/* ---- Modal ---- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-card {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  position: relative;
  overflow: hidden;
}

.close-icon {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
}

.modal-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal-visual img { width: 100%; height: 100%; object-fit: cover; }

.modal-details {
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--color-secondary);
  margin-bottom: 0.8rem;
}

.m-title {
  font-size: 2.5rem;
  font-family: var(--font-heading);
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.m-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.m-author { opacity: 0.4; font-size: 0.9rem; font-weight: 700; }
.m-price { font-size: 1.6rem; font-weight: 800; color: var(--color-primary); }

.m-sep { height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 2rem; }
.m-description { opacity: 0.6; line-height: 1.6; margin-bottom: 3rem; }

@media (max-width: 800px) {
  .modal-layout { grid-template-columns: 1fr; }
  .modal-details { padding: 2rem; }
  .merch-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .mh-title { font-size: 3.5rem; }
  
  .card-body {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .name {
    font-size: 0.9rem;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: auto;
  }
  
  .price {
    font-size: 0.95rem;
  }
  
  .creator-avatar {
    width: 20px;
    height: 20px;
  }
  
  .creator {
    font-size: 0.65rem;
  }
}
</style>
