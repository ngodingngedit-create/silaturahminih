<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute()
const isScrolled = ref(false);
const menuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
function closeMenu() {
  menuOpen.value = false;
}

// Logo fade cycle in navbar
const logos = ['/silaturahmi.png', '/logo pbb.png', '/lantai bawah.png']
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
  window.addEventListener('scroll', handleScroll);
  logoTimer = setInterval(cycleLogo, 2500)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  clearInterval(logoTimer)
});

const navLinks = [
  { to: '/', label: 'BERANDA' },
  { to: '/lineup', label: 'LINEUP' },
  { to: '/merch', label: 'MERCH' },
  { to: '/tickets', label: 'TIKET' },
  { to: '/info', label: 'INFO' },
  { to: '/gallery', label: 'GALERI' },
]
</script>

<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-container">
      <!-- Left: Logo -->
      <div class="nav-left">
        <RouterLink to="/" class="logo-link" @click="closeMenu">
          <img src="/silaturahmi.png" alt="Silaturahmi Festival" class="logo-img">
        </RouterLink>
      </div>

      <!-- Center: Desktop Nav -->
      <div class="nav-center">
        <div class="nav-links-wrapper">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ active: route.path === link.to }"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>

      <!-- Right: Desktop Actions -->
      <div class="nav-right">
        <RouterLink to="/tickets" class="btn btn-yellow nav-cta">
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
        
        <!-- Hamburger (Mobile & Tablet) -->
        <button class="hamburger-btn" @click="toggleMenu" :class="{ active: menuOpen }" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Overlay -->
  <Transition name="slide-menu">
    <div class="mobile-menu" v-if="menuOpen">
      <div class="mm-inner">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="mm-link"
          :class="{ active: route.path === link.to }"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink
          to="/tickets"
          class="btn btn-yellow mm-cta"
          @click="closeMenu"
        >
          🎟️ BELI TIKET
        </RouterLink>
      </div>
    </div>
  </Transition>

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
  transition: var(--transition-normal);
  background: var(--color-black);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
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
  height: 40px;
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
  left: auto;
  width: 100%;
  max-width: 300px;
  background: var(--color-black);
  z-index: 999;
  padding: 100px 2rem 2rem;
  border-left: 1px solid rgba(255,255,255,0.1);
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
.slide-menu-enter-active, .slide-menu-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-menu-enter-from, .slide-menu-leave-to { transform: translateX(100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 1024px) {
  .nav-center { display: none; }
  .hamburger-btn { display: flex; }
  .navbar { width: calc(100% - 2rem); }
}

@media (max-width: 600px) {
  .nav-right .nav-cta { display: none; }
  .navbar-container { padding: 0 1rem; }
  .logo-img { height: 32px; }
  .navbar { height: 60px; top: 1rem; width: calc(100% - 2rem); }
}
</style>
