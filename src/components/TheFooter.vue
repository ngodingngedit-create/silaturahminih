<template>
  <footer class="site-footer">
    <!-- Primary Partners Section (Joined Section) -->
    <div class="primary-partners-section">
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
    <div class="footer-main">
      <div class="container lg-container">
        <div class="footer-grid">
          <!-- Column 1: Brand -->
          <div class="footer-col brand-col">
            <img src="/silaturahmi.png" alt="Silaturahmi Festival" class="footer-logo" />
            <p class="footer-tagline">"TAGLINE TBA"</p>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-col">
            <h3 class="footer-heading">NAVIGASI</h3>
            <nav class="footer-nav">
              <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="footer-link">
                {{ link.label }}
              </RouterLink>
            </nav>
          </div>

          <!-- Column 3: Event Info -->
          <div class="footer-col">
            <h3 class="footer-heading">INFO EVENT</h3>
            <div class="footer-info">
              <p class="hi-sub">TBA</p>
              <p>TBA</p>
              <p class="ih-sub">TBA</p>
            </div>
          </div>

          <!-- Column 4: Contact/Social -->
          <div class="footer-col">
            <h3 class="footer-heading">IKUTI KAMI</h3>
            <div class="footer-social">
              <a href="https://instagram.com/silaturahmifestival" target="_blank" class="social-link">
                @silaturahminih
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      <div class="container">
        <p class="copyright">© 2027 Silaturahmi Festival. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/lineup', label: 'Lineup' },
  { to: '/merch', label: 'Merch' },
  { to: '/tickets', label: 'Tiket' },
  { to: '/info', label: 'Info' },
  { to: '/gallery', label: 'Galeri' },
]

const primaryPartners = [
  {
    title: 'PROMOTED BY',
    logos: ['/logo pbb.png', '/lantai bawah.png']
  },
  {
    title: 'OFFICIAL TICKETING',
    logos: ['/offcial tiketing/DECK - KOLEKTIX 2027 (5).png']
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
  padding: 5rem 0 1rem;
}

.partners-bar {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
}

.partner-group {
  text-align: center;
}

.partner-group-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.partner-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.primary-box {
  width: 90px;
  height: 90px;
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
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-md);
}

.footer-logo {
  height: 60px;
  margin-bottom: 1.5rem;
}

.footer-tagline {
  font-family: var(--font-heading);
  font-size: 0.7rem;
  opacity: 0.3;
  max-width: 250px;
}

.footer-heading {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-link {
  font-size: 0.9rem;
  opacity: 0.6;
  transition: var(--transition-fast);
}

.footer-link:hover { opacity: 1; color: var(--color-primary); }

.footer-info p {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  opacity: 0.8;
}

.footer-info .muted { opacity: 0.4; }

.footer-social .social-link {
  font-size: 0.9rem;
  opacity: 0.6;
  text-decoration: none;
  color: inherit;
  transition: var(--transition-fast);
}

.footer-social .social-link:hover {
  opacity: 1;
  color: var(--color-primary);
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
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
}

@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; text-align: center; }
  .footer-logo { height: 45px; margin: 0 auto 1.5rem; }
  .footer-tagline { margin: 0 auto; }
  .sponsorship-title { font-size: 1.8rem; margin-bottom: 2rem; }
  
  .partners-bar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .primary-box {
    padding: 1rem;
  }

  .primary-img {
    max-height: 80px;
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
