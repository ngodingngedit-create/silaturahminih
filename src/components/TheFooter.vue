<template>
  <footer class="site-footer">
    <!-- Primary Partners Section (Joined Section) -->
    <div v-if="!isTicketPage" class="primary-partners-section">
      <div class="container lg-container">
        <div class="partners-bar">
          <div v-for="category in primaryPartners" :key="category.title" class="partner-group">
            <h4 class="partner-group-title">{{ category.title }}</h4>
            <div class="partner-logos">
              <div 
                v-for="logo in category.logos" 
                :key="logo" 
                class="sponsor-box primary-box"
              >
                <img :src="logo" alt="Partner" class="sponsor-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sponsorship Section (Grid with White Squares) -->
    <div class="sponsorship-section" v-show="false">
      <div class="container lg-container">
        <div class="sponsorship-content">
          <div class="sponsorship-info">
            <span class="eyebrow">PARTNERSHIP & SPONSOR</span>
            <h2 class="sponsorship-title">TERIMA KASIH</h2>
          </div>
          
          <div class="sponsorship-grid">
            <div 
              v-for="logo in sponsorsLogos" 
              :key="logo" 
              class="sponsor-box"
            >
              <img :src="logo" alt="Sponsor" class="sponsor-img" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <div v-if="!isTicketPage" class="footer-main">
      <div class="container lg-container">
        <div class="footer-grid">
          <!-- Column 1: Brand -->
          <div class="footer-col brand-col">
            <img src="/silaturahmi.webp" alt="Silaturahmi Festival" class="footer-logo" />
            <p class="footer-tagline">mempererat tali kasih dan persaudaraan</p>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-col">
            <h3 class="footer-heading">NAVIGASI</h3>
            <nav class="footer-nav">
              <template v-for="link in navLinks" :key="link.label">
                <a
                  v-if="link.href"
                  :href="link.href"
                  target="_blank"
                  rel="noopener"
                  class="footer-link"
                >
                  {{ link.label }}
                </a>
                <RouterLink v-else :to="link.to" class="footer-link">
                  {{ link.label }}
                </RouterLink>
              </template>
            </nav>
          </div>

          <!-- Column 3: Event Info -->
          <div class="footer-col">
            <h3 class="footer-heading">INFO EVENT</h3>
            <div class="footer-info">
              <p>Silaturahmi Vol 3 kembali hadir pada 10 April 2027. </p>
            </div>
          </div>

          <!-- Column 4: Contact/Social -->
          <div class="footer-col">
            <h3 class="footer-heading">IKUTI KAMI</h3>
            <div class="footer-social">
              <a href="https://instagram.com/silaturahmifestival" target="_blank" class="social-link">
                <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@silaturahminih</span>
              </a>
              <a href="mailto:barengbarengnih@gmail.com" class="social-link">
                <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>barengbarengnih@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div v-if="!isTicketPage" class="footer-bottom">
      <div class="container">
        <p class="copyright">© 2027 Silaturahmi Festival. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { TICKET_CATALOG_PATH, isTicketPagePath } from '../utils/eventRoute.js'

const route = useRoute()
const isTicketPage = computed(() => isTicketPagePath(route.path))

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/lineup', label: 'Penampil' },
  { href: 'https://pasarbarengbareng.com/', label: 'Merch' },
  { to: TICKET_CATALOG_PATH, label: 'Tiket' },
  { to: '/gallery', label: 'Galeri' },
]

const primaryPartners = [
   {
    title: 'PROMOTED BY',
    logos: ['/barengbareng.webp']
  },
  {
    title: 'SUPPORTED BY',
    logos: ['/logo pbb.webp', '/lantai bawah.webp']
  },
  {
    title: 'OFFICIAL TICKETING',
    logos: ['/offcial tiketing/DECK - KOLEKTIX 2025 (5).png']
  }
  /*
  ,
  {
    title: 'STRATEGIC PARTNER',
    logos: [
      '/strategic partner/the jeblogs-silaturahmi (1).png',
      '/strategic partner/the jeblogs-silaturahmi (2).png',
      '/strategic partner/the jeblogs-silaturahmi (3).png'
    ]
  },
  {
    title: 'OFFICIAL PRODUCTION PARTNER',
    logos: [
      '/official production partner/the jeblogs-silaturahmi (4).png',
      '/official production partner/the jeblogs-silaturahmi (5).png',
      '/official production partner/the jeblogs-silaturahmi (6).png',
      '/official production partner/the jeblogs-silaturahmi (7).png'
    ]
  }
  */
]

const sponsorsLogos = [
  '/partnership dan sponsor/Info Konser Musik.PNG',
  '/partnership dan sponsor/LOGO BENS RADIO BG WHITE.png',
  '/partnership dan sponsor/LOGO KOLONI GIGS.png',
  '/partnership dan sponsor/Local Pride Indonesia.PNG',
  '/partnership dan sponsor/Logo Concert Music.PNG',
  '/partnership dan sponsor/Logo INFO GIGS JABODETABEK.png',
  '/partnership dan sponsor/Logo Konser Feeds - BG Putih (1).png',
  '/partnership dan sponsor/Logo Ngekonser.png',
  '/partnership dan sponsor/Logo Paling Berisik.png',
  '/partnership dan sponsor/Logo Provoke Magazine.png',
  '/partnership dan sponsor/Logo inilah com.png',
  '/partnership dan sponsor/Super cluster 505.png',
  '/partnership dan sponsor/hai.jpg',
  '/partnership dan sponsor/infopensi.jpg'
]
</script>

<style scoped>
.site-footer {
  background: var(--color-black);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.lg-container {
  max-width: 1400px;
}

/* Unified Partners Area */
.primary-partners-section {
  padding: 4rem 0 2rem;
  text-align: center;
}

.partners-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.partner-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.partner-group-title {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: #fff;
  opacity: 0.5;
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}

.partner-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.partner-logos .sponsor-box.primary-box {
  width: 110px;
  height: 70px;
  aspect-ratio: auto;
  margin: 0;
  flex: 0 0 auto;
}

/* Sponsorship (Grid with White Squares) */
.sponsorship-section {
  padding: 3rem 0 5rem;
}

.sponsorship-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.sponsorship-info {
  text-align: center;
}

.eyebrow {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.sponsorship-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  margin: 0;
  line-height: 1;
}

.sponsorship-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  justify-content: center;
  gap: 0.75rem;
}

.sponsor-box {
  aspect-ratio: 1;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0.25rem;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.sponsor-box:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  z-index: 1;
}

.sponsor-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.4s ease;
}

.sponsor-box:hover .sponsor-img {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.1);
}

/* Main Footer */
.footer-main {
  padding: var(--spacing-lg) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 1.5rem;
}

.footer-logo {
  height: 60px;
  margin-bottom: 1rem;
}

.footer-tagline {
  font-family: var(--font-heading);
  font-size: 0.80rem;
  color: #ffffff;
  opacity: 0.9;
  max-width: 250px;
  line-height: 1;
  text-transform: uppercase;
}

.footer-heading {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  color: var(--color-primary);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.footer-link {
  font-size: 0.9rem;
  color: #ffffff;
  opacity: 0.85;
  transition: var(--transition-fast);
}

.footer-link:hover { opacity: 1; color: var(--color-primary); }

.footer-info p {
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 0.3rem;
  color: #ffffff;
  opacity: 0.85;
}

.footer-info .muted { opacity: 0.4; }

.footer-social {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.footer-social .social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #ffffff;
  opacity: 0.85;
  text-decoration: none;
  transition: var(--transition-fast);
}

.footer-social .social-icon {
  width: 16px;
  height: 16px;
  stroke: #ffffff;
  flex-shrink: 0;
}

.footer-social .social-link:hover {
  opacity: 1;
  color: var(--color-primary);
}

.footer-social .social-link:hover .social-icon {
  stroke: var(--color-primary);
}

/* Bottom */
.footer-bottom {
  padding: var(--spacing-sm) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.copyright {
  font-size: 0.75rem;
  opacity: 0.3;
}

@media (max-width: 1024px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .partners-bar {
    gap: 2rem;
  }
}

@media (max-width: 600px) {
  .site-footer { margin-top: -1rem; }
  .primary-partners-section { padding-top: 3rem; }
  .footer-grid { grid-template-columns: 1fr; text-align: center; }
  .footer-col { align-items: center; }
  .footer-nav { align-items: center; }
  .footer-logo { height: 45px; margin: 0 auto 1.5rem; }
  .footer-tagline { margin: 0 auto; }
  .sponsorship-title { font-size: 1.8rem; margin-bottom: 2rem; }
  .footer-social {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    max-width: 420px;
    margin: 0 auto;
  }
  .footer-social .social-link { justify-content: center; text-align: center; }
  .footer-bottom { padding-bottom: calc(var(--spacing-sm) + 84px); }
  
  .partners-bar {
    gap: 1.25rem;
  }

  .partner-group-title {
    font-size: 0.65rem;
    margin-bottom: 0.75rem;
  }

  .partner-logos {
    gap: 0.6rem;
  }

  .partner-logos .sponsor-box.primary-box,
  .primary-box {
    width: 84px;
    height: 54px;
  }
  
  .sponsorship-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .sponsor-box {
    padding: 0.8rem;
    height: 80px;
  }

  .sponsor-img {
    max-height: 50px;
  }
}
</style>
