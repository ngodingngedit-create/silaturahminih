<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { EVENT_PATH, isTicketPagePath } from '../utils/eventRoute.js';

const route = useRoute()
const isScrolled = ref(false);
const menuOpen = ref(false);
const isTicketPage = computed(() => isTicketPagePath(route.path));
const isEventActive = computed(() => route.path === EVENT_PATH || route.path.startsWith('/event/'));

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50 || isTicketPage.value;
};

watch(() => route.path, () => {
  menuOpen.value = false;
  handleScroll();
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
function closeMenu() {
  menuOpen.value = false;
}

// Logo fade cycle in navbar
const logos = ['/silaturahmi.webp', '/barengbareng.webp']
const currentLogoIndex = ref(0)
const showLogo = ref(true)
let logoTimer = null

function cycleLogo() {
  showLogo.value = false
  setTimeout(() => {
    currentLogoIndex.value = (currentLogoIndex.value + 1) % logos.length
    showLogo.value = true
  }, 500)
}

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll);
  logoTimer = setInterval(cycleLogo, 2500)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  clearInterval(logoTimer)
});

const MERCH_URL = 'https://pasarbarengbareng.com/'
const navLinks = [
  { to: '/', label: 'BERANDA' },
  { to: '/lineup', label: 'PENAMPIL' },
  { href: MERCH_URL, label: 'MERCH' },
  { to: EVENT_PATH, label: 'TIKET' },
  { to: '/gallery', label: 'GALERI' },
]
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled || isTicketPage, hidden: menuOpen }">
    <div class="navbar-container">
      <!-- Left: Hamburger + Logo -->
      <div class="nav-left">
        <!-- Hamburger (Mobile & Tablet) -->
        <button class="hamburger-btn" @click="toggleMenu" :class="{ active: menuOpen }" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <RouterLink to="/" class="logo-link" @click="closeMenu">
          <img src="/silaturahmi.webp" alt="Silaturahmi Festival" class="logo-img">
        </RouterLink>
      </div>

      <!-- Center: Desktop Nav -->
      <div class="nav-center">
        <div class="nav-links-wrapper">
          <template v-for="link in navLinks" :key="link.label">
            <a
              v-if="link.href"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="nav-link"
              @click="closeMenu"
            >
              {{ link.label }}
            </a>
            <RouterLink
              v-else
              :to="link.to"
              class="nav-link"
              :class="{ active: route.path === link.to }"
            >
              {{ link.label }}
            </RouterLink>
          </template>
        </div>
      </div>

      <!-- Right: Desktop Actions -->
      <div class="nav-right">
        <RouterLink :to="EVENT_PATH" class="btn btn-yellow nav-cta">
          BELI TIKET
        </RouterLink>

        <!-- Looping Logo -->
        <div class="nav-loop-logo">
          <Transition name="fade" mode="out-in">
            <img 
              v-if="showLogo"
              :key="currentLogoIndex"
              :src="logos[currentLogoIndex]" 
              alt="Festival Logo" 
              class="loop-img"
            >
          </Transition>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Overlay -->
  <Transition name="slide-menu">
    <div class="mobile-menu" v-if="menuOpen">
      <div class="mm-inner">
        <template v-for="link in navLinks" :key="link.label">
          <a
            v-if="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="mm-link"
            @click="closeMenu"
          >
            {{ link.label }}
          </a>
          <RouterLink
            v-else
            :to="link.to"
            class="mm-link"
            :class="{ active: route.path === link.to }"
            @click="closeMenu"
          >
            {{ link.label }}
          </RouterLink>
        </template>
        <RouterLink
          :to="EVENT_PATH"
          class="btn btn-yellow mm-cta"
          @click="closeMenu"
        >
          BELI TIKET
        </RouterLink>
      </div>
    </div>
  </Transition>

  <!-- Mobile bottom navbar -->
  <nav v-if="!isTicketPage" class="mobile-bottomnav" :class="{ hidden: menuOpen }">
    <RouterLink to="/" class="mb-item" :class="{ active: route.path === '/' }" aria-label="Beranda">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
      <span>Home</span>
    </RouterLink>
    <RouterLink to="/lineup" class="mb-item" :class="{ active: route.path === '/lineup' }" aria-label="Lineup">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l12-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      <span>Lineup</span>
    </RouterLink>
    <RouterLink :to="EVENT_PATH" class="mb-item mb-ticket" :class="{ active: isEventActive }" aria-label="Tiket">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><path d="M13 5v2M13 11v2M13 17v2"/></svg>
      <span>Tiket</span>
    </RouterLink>
    <RouterLink to="/gallery" class="mb-item" :class="{ active: route.path === '/gallery' }" aria-label="Galeri">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
      <span>Galeri</span>
    </RouterLink>
    <a href="https://pasarbarengbareng.com/" target="_blank" rel="noopener" class="mb-item" aria-label="Merch">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h15l-1.5 9h-12z"/><path d="M6 7 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
      <span>Merch</span>
    </a>
  </nav>

  <!-- Backdrop -->
  <Transition name="fade">
    <div class="menu-backdrop" v-if="menuOpen" @click="closeMenu"></div>
  </Transition>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 3rem);
  max-width: 1000px;
  z-index: 1000;
  height: 90px; /* Increased from 70px to fit larger logo */
  display: flex;
  align-items: center;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, top 0.35s ease, width 0.35s ease, border-radius 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease;
  will-change: transform, opacity;
  background: var(--color-black);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.navbar.hidden {
  transform: translateX(-50%) translateY(-140%);
  opacity: 0;
  pointer-events: none;
}

.navbar.scrolled {
  top: 0;
  width: 100%;
  max-width: 100%;
  border-radius: 0;
  border-top: none;
  border-left: none;
  border-right: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.navbar-container {
  width: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left, .nav-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links-wrapper {
  display: flex;
  gap: 0.25rem;
  background: rgba(255,255,255,0.03);
  padding: 0.3rem;
  border-radius: var(--radius-md);
}

.nav-right {
  gap: 1rem;
}

/* Links */
.nav-link {
  font-family: var(--font-body);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.7rem;
  color: var(--color-white);
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  opacity: 0.4;
}

.nav-link:hover, .nav-link.active {
  opacity: 1;
  background: var(--color-primary);
  color: var(--color-black);
}

.logo-img {
  height: 60px;
  width: auto;
  transition: var(--transition-normal);
}

/* Hamburger */
.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 0.5rem;
  z-index: 1001;
}

.hamburger-btn span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-white);
  transition: var(--transition-normal);
}

.hamburger-btn.active span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.hamburger-btn.active span:nth-child(2) { opacity: 0; }
.hamburger-btn.active span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

.nav-cta {
  padding: 0.5rem 1.2rem;
  font-size: 0.7rem;
  font-family: var(--font-body);
  font-weight: 700;
  border-radius: var(--radius-sm);
}

.nav-loop-logo {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -0.25rem;
}

.loop-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}


/* Mobile Menu */
.mobile-menu {
  position: fixed;
  inset: 0;
  right: auto;
  left: 0;
  width: 100%;
  max-width: 300px;
  background: var(--color-black);
  z-index: 999;
  padding: 100px 2rem 2rem;
  border-right: 1px solid rgba(255,255,255,0.1);
}

.mm-inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mm-link {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-white);
  transition: var(--transition-fast);
}

.mm-link.active { color: var(--color-primary); }

.mm-cta {
  margin-top: 2rem;
}

/* Backdrop */
.menu-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 998;
  backdrop-filter: blur(2px);
}

/* Transitions */
.slide-menu-enter-active, .slide-menu-leave-active { transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease; }
.slide-menu-enter-from, .slide-menu-leave-to { transform: translateX(-100%); opacity: 0.4; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Mobile bottom navbar */
.mobile-bottomnav {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: calc(0.9rem + env(safe-area-inset-bottom, 0px));
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 0.15rem;
  background: rgba(38, 38, 42, 0.92);
  backdrop-filter: blur(6px);
  border-radius: 999px;
  padding: 0.4rem;
  box-shadow: 0 12px 30px rgba(25, 25, 25, 0.45);
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  will-change: transform, opacity;
}

.mobile-bottomnav.hidden {
  transform: translateY(140%);
  opacity: 0;
  pointer-events: none;
}

.mb-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  color: rgba(255,255,255,0.85);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0.6rem 0.3rem;
  border-radius: 999px;
  min-width: 0;
}

.mb-item svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.mb-item span {
  display: none;
  white-space: nowrap;
}

.mb-item.active {
  flex: 1.6;
  color: var(--color-black);
  background: var(--color-primary);
  padding: 0.45rem 0.75rem;
}

.mb-item.active span {
  display: block;
}

.mb-ticket {
  margin-top: 0;
  padding: 0.6rem 0.3rem;
  border-radius: 999px;
  box-shadow: none;
  color: rgba(255,255,255,0.85);
  background: transparent;
}

.mb-ticket.active {
  color: var(--color-black);
  background: var(--color-primary);
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-center { display: none; }
  .hamburger-btn { display: flex; }
  .navbar { width: calc(100% - 2rem); }
  .navbar.scrolled { width: 100%; }
}

@media (max-width: 600px) {
  .nav-right .nav-cta { display: none; }
  .nav-loop-logo { width: 44px; height: 44px; margin-left: 0; }
  .navbar-container { padding: 0 1rem; gap: 0.5rem; }
  .nav-left { gap: 0.1rem; }
  .logo-img { height: 44px; }
  .navbar { height: 60px; top: 1rem; width: calc(100% - 2rem); }
  .navbar.scrolled { top: 0; width: 100%; height: 60px; }
  .mobile-menu { max-width: 270px; padding-top: 90px; }
  .mobile-bottomnav { display: flex; }
}
</style>
