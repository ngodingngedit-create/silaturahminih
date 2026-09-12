<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ticketCategories as fallbackTickets } from '../data/tickets.js'
import { fetchEventBySlug, mapEventPayload } from '../services/eventApi.js'
import { EVENT_SLUG } from '../utils/eventRoute.js'

const router = useRouter()
const route = useRoute()

const titleRef = ref(null)
const titleOverflow = ref(false)

function checkTitleOverflow() {
  nextTick(() => {
    const el = titleRef.value
    if (!el) return
    titleOverflow.value = el.scrollWidth > el.clientWidth + 4
  })
}

const eventSlug = computed(() => route.params.slug || EVENT_SLUG)
const eventData = ref(null)
const eventLoading = ref(true)
const eventError = ref('')

const ticketList = computed(() => {
  if (eventData.value?.tickets?.length) return eventData.value.tickets
  return fallbackTickets.filter((t) => !['presale-1', 'presale-2', 'presale-3', 'reguler'].includes(t.id))
})
const eventName = computed(() => eventData.value?.name || 'Blind Ticket SILATURAHMI 2027')
const eventImage = computed(() => eventData.value?.imageUrl || '/konser1.jpg')
const eventDateLabel = computed(() => '10 APRIL 2027')
const eventTimeLabel = computed(() => {
  if (!eventData.value?.startTime) return '15:00 - 23:30 WIB'
  const end = eventData.value.endTime ? ` - ${eventData.value.endTime}` : ''
  return `${eventData.value.startTime}${end} ${eventData.value.zoneTime || 'WIB'}`
})
const eventVenueLabel = computed(() => 'SEGERA DIUMUMKAN')
const eventMapUrl = computed(() => eventData.value?.locationMap || 'https://maps.google.com/?q=Gambir+Expo+Jakarta')
const eventLocVenue = computed(() => 'SEGERA DIUMUMKAN')
const eventLocCity = computed(() => 'SEGERA DIUMUMKAN')
const organizerName = computed(() => (eventData.value?.organizer || 'SILATURAHMI PRESENTS').toUpperCase())
const organizerImage = computed(() => '/logobarengbareng.webp')
const maxBuyTicket = computed(() => eventData.value?.maxBuyTicket || 10)

// Countdown timer to event start
const countdown = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let timer = null

function countdownTarget() {
  if (eventData.value?.startDate) {
    const t = eventData.value.startTime || '00:00'
    return new Date(`${eventData.value.startDate}T${t.length === 5 ? t + ':00' : t}+07:00`).getTime()
  }
  return new Date('2027-05-23T15:00:00+07:00').getTime()
}

function updateCountdown() {
  const targetDate = countdownTarget()
  const now = new Date().getTime()
  const difference = targetDate - now

  if (difference > 0) {
    const d = Math.floor(difference / (1000 * 60 * 60 * 24))
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const s = Math.floor((difference % (1000 * 60)) / 1000)

    countdown.value = {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0')
    }
  }
}

async function loadEvent() {
  eventLoading.value = true
  eventError.value = ''
  try {
    const payload = await fetchEventBySlug(eventSlug.value)
    eventData.value = mapEventPayload(payload)
    if (eventData.value.tickets.length > 0) {
      selectedTicket.value = eventData.value.tickets[0]
    }
  } catch (e) {
    eventError.value = 'Gagal memuat data event, menampilkan data cadangan.'
    eventData.value = null
  } finally {
    eventLoading.value = false
    checkTitleOverflow()
  }
}

watch(eventName, () => checkTitleOverflow())

// Active Tab navigation: description (description+location+terms) vs tickets
const activeTab = ref('description')
const activeNav = ref('description')
const tabsListRef = ref(null)
const indicatorStyle = ref({ left: '0px', width: '0px' })

function updateIndicator() {
  nextTick(() => {
    const list = tabsListRef.value
    if (!list) return
    const item = list.querySelector(`[data-tab="${activeNav.value}"]`)
    if (!item) return
    const listRect = list.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    const left = itemRect.left - listRect.left + list.scrollLeft
    indicatorStyle.value = { left: left + 'px', width: itemRect.width + 'px' }
    list.scrollTo({
      left: left - list.clientWidth / 2 + itemRect.width / 2,
      behavior: 'smooth'
    })
  })
}

function scrollToEl(el) {
  if (!el) return
  const offset = 170
  const bodyRect = document.body.getBoundingClientRect().top
  const elementRect = el.getBoundingClientRect().top
  const elementPosition = elementRect - bodyRect
  const offsetPosition = elementPosition - offset
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
}

function scrollToSection(tabId) {
  activeNav.value = tabId
  updateIndicator()
  if (tabId === 'tickets' || tabId === 'description') {
    activeTab.value = tabId
    nextTick(() => scrollToEl(document.querySelector('.event-body-content')))
    return
  }
  if (activeTab.value !== 'description') {
    activeTab.value = 'description'
    nextTick(() => scrollToEl(document.getElementById(tabId)))
    return
  }
  scrollToEl(document.getElementById(tabId))
}

// Read more description state
const isDescriptionExpanded = ref(false)
function toggleDescription() {
  isDescriptionExpanded.value = !isDescriptionExpanded.value
}

const selectedTicket = ref(fallbackTickets[0])
const cart = ref({})
const expandedTicket = ref(null)
const isEditingCart = ref(false)
const showCartSheet = ref(false)
const sheetDragY = ref(0)
const sheetDragging = ref(false)
let sheetDragStartY = 0

function onSheetGrabStart(e) {
  sheetDragging.value = true
  sheetDragStartY = e.touches ? e.touches[0].clientY : e.clientY
}
function onSheetGrabMove(e) {
  if (!sheetDragging.value) return
  const y = e.touches ? e.touches[0].clientY : e.clientY
  sheetDragY.value = Math.max(0, y - sheetDragStartY)
}
function onSheetGrabEnd() {
  if (!sheetDragging.value) return
  sheetDragging.value = false
  if (sheetDragY.value > 110) showCartSheet.value = false
  sheetDragY.value = 0
}

const qtyOf = (id) => cart.value[id] || 0
const cartItems = computed(() => ticketList.value.filter(t => qtyOf(t.id) > 0).map(t => ({ ...t, qty: qtyOf(t.id), subtotal: t.price * qtyOf(t.id) })))
const cartCount = computed(() => Object.values(cart.value).reduce((a, b) => a + b, 0))
const cartTotal = computed(() => cartItems.value.reduce((a, b) => a + b.subtotal, 0))
const cartTotalFormatted = computed(() => 'Rp ' + cartTotal.value.toLocaleString('id-ID'))

function selectTicketCategory(ticket) {
  if (!ticket.available || ticket.soldout) return
  selectedTicket.value = ticket
  if (!qtyOf(ticket.id)) cart.value = { ...cart.value, [ticket.id]: 1 }
}
function toggleExpand(id) {
  expandedTicket.value = expandedTicket.value === id ? null : id
}
function addTicket(ticket) {
  if (!ticket.available) return
  selectedTicket.value = ticket
  cart.value = { ...cart.value, [ticket.id]: 1 }
}
function incQty(id) {
  const t = ticketList.value.find((x) => x.id === id)
  const cap = t?.maxBuy ?? maxBuyTicket.value ?? 10
  if (qtyOf(id) >= cap) return
  cart.value = { ...cart.value, [id]: qtyOf(id) + 1 }
}
function decQty(id) {
  const q = qtyOf(id) - 1
  const next = { ...cart.value }
  if (q <= 0) delete next[id]
  else next[id] = q
  cart.value = next
  if (cartItems.value.length === 0) isEditingCart.value = false
}
function removeCartItem(id) {
  const next = { ...cart.value }
  delete next[id]
  cart.value = next
  if (cartItems.value.length === 0) isEditingCart.value = false
}
function clearCart() {
  cart.value = {}
  isEditingCart.value = false
}
function handleBottomAction() {
  if (activeTab.value !== 'tickets') {
    scrollToSection('tickets')
    return
  }
  if (cartCount.value === 0) return
  try {
    sessionStorage.setItem('silaturahmi_cart', JSON.stringify(cart.value))
    sessionStorage.setItem('silaturahmi_catalog', JSON.stringify(ticketList.value))
    sessionStorage.setItem('silaturahmi_event_id', String(eventData.value?.id || ''))
  } catch { /* ponytail: cart still in memory for same-session back nav */ }
  router.push('/personal-info')
}

// Share: direct copy link
const isCopied = ref(false)

async function copyEventLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch { /* ponytail: clipboard may be blocked, still show feedback */ }
  isCopied.value = true
  setTimeout(() => { isCopied.value = false }, 2000)
}

onMounted(() => {
  loadEvent()
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
  updateIndicator()
  checkTitleOverflow()
  window.addEventListener('resize', updateIndicator)
  window.addEventListener('resize', checkTitleOverflow)
  document.body.classList.toggle('cart-sheet-open', showCartSheet.value)
  if (showCartSheet.value) document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('resize', checkTitleOverflow)
  window.removeEventListener('resize', updateIndicator)
  document.body.classList.remove('cart-sheet-open')
  document.body.style.overflow = ''
})

watch(showCartSheet, (v) => {
  document.body.classList.toggle('cart-sheet-open', v)
  document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <div class="event-detail-page">
    <!-- TOP EVENT BANNER HEADER SECTION -->
    <section class="event-hero-header">
      <div class="event-hero-bg" aria-hidden="true"></div>
      <div class="container event-wide">
        <!-- Title & Countdown Header Row -->
        <div class="hero-top-bar">
          <h1 ref="titleRef" class="event-title" :class="{ marquee: titleOverflow }">
            <span class="title-track">
              <span>{{ eventName }}</span><span v-if="titleOverflow" aria-hidden="true">{{ eventName }}</span>
            </span>
          </h1>
          
          <div class="countdown-wrapper">
            <span class="countdown-label">Event starts in</span>
            <div class="countdown-boxes">
              <div class="cd-box">
                <span class="cd-num">{{ countdown.days }}</span>
                <span class="cd-txt">Days</span>
              </div>
              <div class="cd-box">
                <span class="cd-num">{{ countdown.hours }}</span>
                <span class="cd-txt">Hours</span>
              </div>
              <div class="cd-box">
                <span class="cd-num">{{ countdown.minutes }}</span>
                <span class="cd-txt">Minutes</span>
              </div>
              <div class="cd-box">
                <span class="cd-num">{{ countdown.seconds }}</span>
                <span class="cd-txt">Seconds</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner Image & Meta Card Grid -->
        <div class="hero-main-grid">
          <!-- Banner Image Container -->
          <div class="banner-image-container">
            <img
              :src="eventImage"
              :alt="eventName"
              class="banner-img"
            />
          </div>

          <!-- Event Information Meta Card (Right Side Desktop / Bottom Mobile) -->
          <div class="event-meta-card">
            <div class="meta-item">
              <div class="meta-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div class="meta-content">
                <span class="meta-value">{{ eventDateLabel }}</span>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="meta-content">
                <span class="meta-value">{{ eventTimeLabel }}</span>
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="meta-content">
                <span class="meta-value">{{ eventVenueLabel }}</span>
              </div>
            </div>

            <div class="organizer-row">
              <div class="organizer-box">
                <div class="org-avatar">
                  <img :src="organizerImage" alt="Organizer Logo" />
                </div>
                <div class="org-info">
                  <span class="org-sub">Organized by</span>
                  <span class="org-name">{{ organizerName }}</span>
                </div>
              </div>
              <div class="more-wrap">
                <button class="more-btn" @click.stop="copyEventLink" :aria-label="isCopied ? 'Link tersalin' : 'Salin link event'" :title="isCopied ? 'Link tersalin!' : 'Salin link'">
                  <svg v-if="!isCopied" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                </button>
                <span v-if="isCopied" class="share-toast">Link tersalin!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STICKY TAB NAVIGATION BAR -->
    <nav class="sticky-tabs-nav">
      <div class="container event-wide">
        <ul class="tabs-list" ref="tabsListRef">
          <li :class="{ active: activeNav === 'description' }">
            <button data-tab="description" @click="scrollToSection('description')">Deskripsi</button>
          </li>
          <li :class="{ active: activeNav === 'tickets' }">
            <button data-tab="tickets" @click="scrollToSection('tickets')">Tiket</button>
          </li>
          <li :class="{ active: activeNav === 'location' }">
            <button data-tab="location" @click="scrollToSection('location')">Lokasi</button>
          </li>
          <li :class="{ active: activeNav === 'terms' }">
            <button data-tab="terms" @click="scrollToSection('terms')">Syarat & Ketentuan</button>
          </li>
          <span class="tabs-indicator" :style="indicatorStyle"></span>
        </ul>
      </div>
    </nav>

    <!-- MAIN BODY CONTENT AREA -->
    <div class="event-body-content container event-wide">
      <!-- SECTION 1: DESCRIPTION -->
      <section v-if="activeTab === 'description'" id="description" class="content-section">
        <div class="section-header">
          <svg class="section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h2 class="section-heading">DESKRIPSI</h2>
        </div>

        <div v-if="eventData?.description" class="description-text-box api-html" v-html="eventData.description"></div>
        <div v-else class="description-text-box" :class="{ collapsed: !isDescriptionExpanded }">
          <p>
            3rd Edition <strong>SILATURAHMI FESTIVAL 2027</strong> is back as Indonesia's biggest street punk, garage rock, & underground music celebration! Prepare for a day of roaring distortion, raw energy, local punk anthems lining up the venue, and an unforgettable reunion of camaraderie.
          </p>
          <p v-if="isDescriptionExpanded" class="extra-desc">
            Silaturahmi Festival menghadirkan pengalaman konser yang intim dan membara dengan puluhan performer papan atas underground Indonesia, tenant merchandise independen, serta berbagai aktivitas komunitaspunk & rock nasional.
          </p>
        </div>
        <button class="read-more-btn" @click="toggleDescription">
          {{ isDescriptionExpanded ? 'Read Less ^' : 'Read More v' }}
        </button>
      </section>

      <!-- SECTION 2: TICKETS SELECTION LIST -->
      <section v-if="activeTab === 'tickets'" id="tickets" class="content-section">
        <div class="section-header">
          <svg class="section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
          </svg>
          <h2 class="section-heading">TIKET</h2>
        </div>

        <div v-if="eventLoading" class="tickets-loading">Memuat tiket...</div>
        <p v-else-if="eventError" class="tickets-error">{{ eventError }}</p>
        <div class="tickets-layout">
          <div class="tickets-selection-grid">
            <div
              v-for="ticket in ticketList"
              :key="ticket.id"
              class="ticket-option-card"
              :class="{ selected: selectedTicket.id === ticket.id, 'is-soldout': ticket.soldout, 'is-upcoming': ticket.upcoming }"
              @click="(ticket.upcoming || ticket.infoOnly) ? toggleExpand(ticket.id) : selectTicketCategory(ticket)"
            >
              <div class="toc-main">
                <div class="toc-top">
                  <div class="toc-title-wrap">
                    <h3 class="toc-name">{{ ticket.name }}</h3>
                   
                    <span class="toc-badge" :class="ticket.badgeClass">
                      <span class="toc-dot"></span>{{ ticket.status }}
                    </span>
                  </div>
                  <div class="toc-price-wrap">
                    <span class="toc-price-label">Harga</span>
                    <span class="toc-price-row">
                      <span class="toc-price-col">
                        <span v-if="ticket.originalPriceFormatted" class="toc-price-strike">{{ ticket.originalPriceFormatted }}</span>
                        <span class="toc-price" :class="{ 'is-discount': ticket.originalPriceFormatted }">{{ ticket.priceFormatted }}</span>
                      </span>
                      <button
                        class="toc-expand"
                        :class="{ open: expandedTicket === ticket.id }"
                        @click.stop="toggleExpand(ticket.id)"
                        aria-label="Detail harga"
                      >‹</button>
                    </span>
                  </div>
                </div>
                <div v-if="expandedTicket === ticket.id" class="toc-desc-row">
                  <span class="toc-desc-title">Informasi Tiket</span>
                  <p class="toc-desc">{{ ticket.desc }}</p>
                </div>
                <div class="toc-bottom">
                  <span v-if="ticket.available" class="toc-ends">Berakhir pada: <strong>{{ ticket.saleEndLabel || ticket.endsAt }}</strong></span>
                  <span v-else class="toc-starts"><span class="toc-starts-label">Dimulai Pada:</span><strong>{{ ticket.saleStartLabel || ticket.startsAt }}</strong></span>
                  <div class="toc-action">
                    <div v-if="qtyOf(ticket.id) > 0 && !ticket.soldout" class="qty-control">
                      <button class="qty-btn" @click.stop="decQty(ticket.id)" aria-label="Kurangi">−</button>
                      <span class="qty-num">{{ qtyOf(ticket.id) }}</span>
                      <button class="qty-btn" @click.stop="incQty(ticket.id)" aria-label="Tambah">+</button>
                    </div>
                    <button
                      v-else-if="ticket.soldout"
                      class="toc-add is-soldout-btn"
                      disabled
                      aria-disabled="true"
                      tabindex="-1"
                      @click.stop
                    >+ Tambah</button>
                    <button
                      v-else
                      class="toc-add"
                      :disabled="!ticket.available"
                      @click.stop="addTicket(ticket)"
                    >+ Tambah</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="cart-summary" aria-label="Tiket dipilih">
            <div class="cart-head">
              <div>
                <h3 class="cart-title">Tiket Dipilih</h3>
                <p class="cart-sub">{{ cartCount }} tiket</p>
              </div>
              <button class="cart-edit" @click="isEditingCart = !isEditingCart" :disabled="cartItems.length === 0">
                {{ isEditingCart ? 'Selesai' : 'Edit' }}
              </button>
            </div>
            <div v-if="cartItems.length === 0" class="cart-empty">
              Belum ada tiket dipilih. Klik <strong>+ Tambah</strong> pada kategori.
            </div>
            <ul v-else class="cart-list">
              <li v-for="item in cartItems" :key="item.id" class="cart-item">
                <span class="cart-item-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
                    <path d="M13 5v2"></path>
                    <path d="M13 17v2"></path>
                    <path d="M13 11v2"></path>
                  </svg>
                </span>
                <div class="cart-item-info">
                  <span class="cart-item-name">{{ item.name }}</span>
                  <span class="cart-item-meta">{{ item.qty }} × {{ item.priceFormatted }}</span>
                </div>
                <div class="cart-item-right">
                  <span class="cart-item-price">Rp {{ item.subtotal.toLocaleString('id-ID') }}</span>
                  <div v-if="isEditingCart" class="cart-item-actions">
                    <button class="cart-remove" @click="removeCartItem(item.id)">Hapus</button>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="cartItems.length > 0" class="cart-foot">
              <div class="cart-total-row">
                <span>Total</span>
                <strong>{{ cartTotalFormatted }}</strong>
              </div>
              <button v-if="isEditingCart" class="cart-clear" @click="clearCart">Hapus Semua</button>
            </div>
          </aside>
        </div>
      </section>

      <!-- SECTION 3: LOCATION MAP CARD -->
      <section v-if="activeTab === 'description'" id="location" class="content-section">
        <div class="section-header">
          <svg class="section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h2 class="section-heading">LOKASI</h2>
        </div>

        <div class="location-box">
          <div class="loc-details">
            <h3 class="loc-venue">{{ eventLocVenue }}</h3>
            <p class="loc-city">{{ eventLocCity }}</p>
          </div>
          <a
            :href="eventMapUrl"
            target="_blank"
            class="open-map-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="map-btn-text">BUKA GOOGLE MAPS</span>
          </a>
        </div>
      </section>

      <!-- SECTION 4: TERMS & CONDITIONS -->
      <section v-if="activeTab === 'description'" id="terms" class="content-section">
        <div class="section-header">
          <svg class="section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h2 class="section-heading">SYARAT & KETENTUAN</h2>
        </div>

        <div v-if="eventData?.termCondition" class="description-text-box api-html" v-html="eventData.termCondition"></div>
        <div v-else class="terms-container">
          <div class="terms-group">
            <h3 class="terms-subheading">General Rules</h3>
            <ul class="terms-list">
              <li>All ticket and service purchases at Silaturahmi are final. Successful transactions cannot be refunded or exchanged.</li>
              <li>By purchasing tickets via the platform, visitors agree to have read, understood, and accepted the Terms & Conditions of Silaturahmi Festival.</li>
              <li>By attending the event, visitors consent that event documentation featuring visitors may be published on social media for promotional purposes.</li>
              <li>If you experience ticketing issues, please contact Silaturahmi Customer Service via Official Instagram / WhatsApp.</li>
            </ul>
          </div>

          <div class="terms-group">
            <h3 class="terms-subheading">Event Guidelines & Code of Conduct</h3>
            <ul class="terms-list">
              <li>Upon successful registration, visitors will receive an official e-ticket via email / Silaturahmi.live.</li>
              <li>Setiap tiket hanya berlaku untuk satu orang dan hanya bisa digunakan satu kali scan ketika acara.</li>
              <li>Ticket confirmation containing payment details and e-tickets will be sent directly to your registered email upon payment.</li>
              <li>Dilarang membawa senjata tajam, obat-obatan terlarang, alkohol luar, dan senjata api ke dalam area festival.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- BOTTOM FIXED CHECKOUT BAR -->
    <div class="bottom-checkout-bar">
      <div class="container event-wide bcb-container">
        <div class="bcb-top-row">
          <div class="price-summary">
            <span class="starting-label">{{ cartCount > 0 ? `${cartCount} tiket dipilih` : `Selected Category: ${selectedTicket.name}` }}</span>
            <span class="price-value">{{ cartCount > 0 ? cartTotalFormatted : selectedTicket.priceFormatted }}</span>
          </div>
          <button class="bcb-detail-btn" @click="showCartSheet = !showCartSheet">Detail</button>
        </div>
        <button
          class="view-tickets-btn"
          :class="{ 'is-buy': activeNav === 'tickets' }"
          :disabled="activeNav === 'tickets' && cartCount === 0"
          @click="handleBottomAction"
        >
          {{ activeNav === 'tickets' ? 'BELI TIKET' : 'LIHAT TIKET' }}
        </button>
      </div>
    </div>

    <!-- CART SHEET (mobile detail) -->
    <Transition name="sheet-fade">
      <div v-if="showCartSheet" class="cart-sheet-backdrop" @click.self="showCartSheet = false">
        <section
          class="cart-sheet-card"
          :style="sheetDragY ? { transform: `translateY(${sheetDragY}px)` } : null"
          :class="{ dragging: sheetDragging }"
        >
          <div
            class="sheet-grab"
            @mousedown="onSheetGrabStart"
            @mousemove="onSheetGrabMove"
            @mouseup="onSheetGrabEnd"
            @mouseleave="onSheetGrabEnd"
            @touchstart.passive="onSheetGrabStart"
            @touchmove.passive="onSheetGrabMove"
            @touchend="onSheetGrabEnd"
          ><span></span></div>
          <div class="sheet-head">
            <div>
              <h3 class="sheet-title">Tiket Dipilih</h3>
              <p class="sheet-sub">{{ cartCount }} tiket</p>
            </div>
            <button class="sheet-edit" @click="isEditingCart = !isEditingCart" :disabled="cartItems.length === 0">
              {{ isEditingCart ? 'Selesai' : 'Edit' }}
            </button>
          </div>
          <div v-if="cartItems.length === 0" class="sheet-empty">Belum ada tiket dipilih.</div>
          <ul v-else class="sheet-list">
            <li v-for="item in cartItems" :key="item.id" class="sheet-item">
              <span class="sheet-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
                  <path d="M13 5v2"></path><path d="M13 11v2"></path><path d="M13 17v2"></path>
                </svg>
              </span>
              <div class="sheet-item-info">
                <span class="sheet-item-name">{{ item.name }}</span>
                <span class="sheet-item-meta">{{ item.qty }} × {{ item.priceFormatted }}</span>
              </div>
              <div class="sheet-item-right">
                <span class="sheet-item-price">Rp {{ item.subtotal.toLocaleString('id-ID') }}</span>
                <button v-if="isEditingCart" class="sheet-remove" @click="removeCartItem(item.id)">Hapus</button>
              </div>
            </li>
          </ul>
          <div v-if="cartItems.length > 0" class="sheet-total">
            <span>Total</span>
            <strong>{{ cartTotalFormatted }}</strong>
          </div>
          <button v-if="cartItems.length > 0 && isEditingCart" class="sheet-clear" @click="clearCart">Hapus Semua</button>
        </section>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* GENERAL LAYOUT & VARIABLES */
.event-detail-page {
  background-color: var(--color-black);
  color: var(--color-white);
  min-height: 100vh;
  padding-bottom: 76px; /* Space for bottom checkout bar */
}

/* TOP EVENT BANNER HEADER SECTION */
.event-hero-header {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background: var(--color-black);
  padding: 9rem 0 2rem 0;
  border-bottom: 1px solid var(--color-dark-border);
}

.event-hero-bg {
  position: absolute;
  inset: -24px;
  z-index: -2;
  background-image: url('/konser1.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(14px) brightness(0.45);
  transform: scale(1.05);
}

.event-hero-header::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(36, 36, 39, 0.55) 0%, rgba(24, 24, 27, 0.9) 100%);
}

.event-detail-page .container.event-wide {
  max-width: 1360px;
}

.hero-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.event-title {
  flex: 1 1 280px;
  min-width: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 2.8vw, 2.2rem);
  line-height: 1.05;
  color: var(--color-white);
  letter-spacing: -0.02em;
  margin: 0;
}
.title-track {
  display: inline;
  white-space: normal;
}
.title-track span { white-space: normal; }
@keyframes title-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* COUNTDOWN STYLING */
.countdown-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.countdown-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.countdown-boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cd-box {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 8px;
  min-width: 54px;
  padding: 0.4rem 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.cd-num {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}

.cd-txt {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.2rem;
}

/* HERO MAIN GRID: BANNER & META CARD */
.hero-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 1.5rem;
  align-items: stretch;
}

.banner-image-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-dark-border);
  min-height: 380px;
  height: 100%;
  background: var(--color-dark-surface);
}

.banner-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* EVENT META CARD */
.event-meta-card {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  min-height: 380px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meta-icon {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.meta-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-white);
}

/* ORGANIZER BOX */
.organizer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.organizer-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}

.org-avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 999px;
  overflow: hidden;
  background: var(--color-black);
}

.org-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 999px;
  display: block;
}

.org-info {
  display: flex;
  flex-direction: column;
}

.org-sub {
  font-size: 0.75rem;
  color: rgba(245, 245, 240, 0.55);
}

.org-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-white);
}

/* SHARE BUTTON */
.more-wrap { position: relative; flex-shrink: 0; }
.more-btn {
  background: none;
  border: none;
  padding: 0.35rem;
  color: #fbda01;
  cursor: pointer;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.more-btn:hover { color: var(--color-primary); background: rgba(255, 255, 255, 0.06); }
.share-toast {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  white-space: nowrap;
  background: var(--color-primary);
  color: var(--color-black);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
}

/* STICKY TAB NAVIGATION BAR */
.sticky-tabs-nav {
  position: sticky;
  top: 89px;
  z-index: 90;
  background: #18181B;
  border-bottom: 1px solid var(--color-dark-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.35);
  margin-top: -1px;
  padding-top: 1px;
  isolation: isolate;
}

.tabs-list {
  position: relative;
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 2rem;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  background: #18181B;
}

.tabs-list::-webkit-scrollbar {
  display: none;
}

.tabs-list li button {
  background: none;
  border: none;
  padding: 1.1rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(245, 245, 240, 0.55);
  cursor: pointer;
  position: relative;
  transition: color 0.25s ease, transform 0.25s ease;
}

.tabs-list li button:hover {
  color: var(--color-white);
}

.tabs-list li.active button {
  color: var(--color-white);
  transform: translateY(-1px);
}

.tabs-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: var(--color-primary);
  border-radius: 3px 3px 0 0;
  transition: left 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px rgba(251, 218, 1, 0.6);
}

/* MAIN BODY CONTENT AREA */
.event-body-content {
  background: transparent;
  color: var(--color-white);
  padding-top: 2.5rem;
  padding-bottom: 3rem;
  min-height: 60vh;
}

.content-section {
  margin-bottom: 1.25rem;
  scroll-margin-top: 170px;
}

.content-section:last-child {
  margin-bottom: 0.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.section-icon {
  color: var(--color-primary);
}

.section-heading {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-white);
  margin: 0;
}

/* DESCRIPTION STYLING */
.description-text-box {
  color: rgba(245, 245, 240, 0.75);
  font-size: 1.05rem;
  line-height: 1.7;
  font-family: var(--font-body);
}

.api-html p { margin: 0 0 0.75rem; }
.api-html ol, .api-html ul { padding-left: 1.25rem; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }

.desc-highlight {
  font-size: 1.15em;
  font-weight: 800;
  color: var(--color-white);
}

@media (min-width: 1024px) {
  .desc-highlight {
    font-size: 1.5em;
    line-height: 1.4;
  }
}

.tickets-loading {
  color: rgba(255, 255, 255, 0.6);
  padding: 1rem 0;
}

.tickets-error {
  color: var(--color-secondary);
  font-size: 0.85rem;
  padding: 0.5rem 0;
}


.read-more-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

/* TICKETS SELECTION LIST */
.tickets-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 1.5rem;
  align-items: start;
}

.tickets-selection-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.ticket-option-card {
  border: 1.5px solid var(--color-dark-border);
  border-radius: 12px;
  background: var(--color-dark-surface);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-white);
}

.ticket-option-card:hover {
  border-color: rgba(245, 245, 240, 0.35);
}

.ticket-option-card.selected {
  border-color: var(--color-primary);
  border-width: 2px;
  background: var(--color-dark-surface);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

.toc-main {
  display: flex;
  flex-direction: column;
}

.toc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px dashed var(--color-dark-border);
}

.toc-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.toc-name {
  font-size: 1.05rem;
  font-weight: 800;
  font-family: var(--font-body);
  color: var(--color-white);
  margin: 0;
  line-height: 1.2;
}

.toc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  width: fit-content;
}

.toc-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
}

.toc-dot::after {
  content: 'i';
  font-weight: 800;
  font-size: 9px;
}

.badge-available {
  background: #dcfce7;
  color: #15803d;
}

.badge-soldout {
  background: rgba(239, 68, 68, 0.18);
  color: #ef4444;
}

.badge-soon {
  background: rgba(245, 245, 240, 0.1);
  color: rgba(245, 245, 240, 0.65);
}

.ticket-option-card.is-soldout {
  background: rgba(255, 255, 255, 0.02);
  opacity: 0.7;
  cursor: pointer;
}

.ticket-option-card.is-upcoming {
  background: rgba(255, 255, 255, 0.02);
  opacity: 0.85;
  cursor: default;
}

.ticket-option-card.is-upcoming .toc-add {
  display: none;
}

.toc-add.is-soldout-btn {
  background: rgba(245, 245, 240, 0.15);
  color: rgba(245, 245, 240, 0.4);
  cursor: not-allowed;
  opacity: 1;
  pointer-events: none;
}

.toc-add.is-soldout-btn:disabled {
  background: rgba(245, 245, 240, 0.15);
  color: rgba(245, 245, 240, 0.4);
  opacity: 1;
}

.toc-price-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.toc-price-strike {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(245, 245, 240, 0.55);
  text-decoration: line-through;
  text-decoration-color: rgba(239, 68, 68, 0.9);
  line-height: 1;
}

.toc-price.is-discount {
  color: #ef4444;
  font-size: 1.35rem;
}

.toc-price-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  flex-shrink: 0;
}

.toc-price-label {
  font-size: 0.72rem;
  color: rgba(245, 245, 240, 0.55);
}

.toc-price-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.toc-price {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-white);
  white-space: nowrap;
}

.toc-expand {
  background: none;
  border: none;
  color: var(--color-white);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem;
  transform: rotate(-90deg);
  transition: transform 0.2s ease;
}

.toc-expand.open {
  transform: rotate(90deg);
}

.toc-desc-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-dark-border);
  border-radius: 8px;
  margin: 0.7rem 1.25rem 0.75rem;
  padding: 0.65rem 0.75rem;
}

.toc-desc-title {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(245, 245, 240, 0.55);
  margin: 0;
}

.toc-desc {
  font-size: 0.82rem;
  color: rgba(245, 245, 240, 0.75);
  margin: 0;
  line-height: 1.6;
}

.toc-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid var(--color-dark-border);
  padding: 0.75rem 1.25rem;
}

.toc-ends {
  font-size: 0.82rem;
  color: rgba(245, 245, 240, 0.55);
}

.toc-ends strong {
  color: var(--color-white);
}

.toc-starts {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: rgba(245, 245, 240, 0.55);
}

.toc-starts-label {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: rgba(245, 245, 240, 0.55);
  border-radius: 999px;
}

.toc-starts strong {
  color: var(--color-white);
}

.toc-action {
  flex-shrink: 0;
}

.toc-add {
  background: var(--color-primary);
  color: var(--color-black);
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.1rem;
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toc-add:disabled {
  background: rgba(245, 245, 240, 0.15);
  color: rgba(245, 245, 240, 0.4);
  cursor: not-allowed;
}

.toc-add:not(:disabled):hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-primary);
  color: var(--color-black);
  border-radius: 8px;
  padding: 0.3rem 0.4rem;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(24, 24, 27, 0.12);
  color: var(--color-black);
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  line-height: 1;
}

.qty-btn:hover {
  background: rgba(24, 24, 27, 0.22);
}

.qty-num {
  min-width: 20px;
  text-align: center;
  font-weight: 800;
}

/* CART SUMMARY (right) */
.cart-summary {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 16px;
  padding: 1.25rem;
  position: sticky;
  top: 170px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.cart-title {
  font-size: 1.1rem;
  color: var(--color-white);
  margin: 0;
}

.cart-sub {
  font-size: 0.82rem;
  color: rgba(245,245,240,0.55);
  margin: 0.25rem 0 0;
}

.cart-edit {
  background: transparent;
  border: 1px solid var(--color-dark-border);
  color: var(--color-primary);
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
}

.cart-edit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cart-empty {
  font-size: 0.88rem;
  color: rgba(245,245,240,0.55);
  line-height: 1.6;
  background: rgba(255,255,255,0.03);
  border: 1px dashed var(--color-dark-border);
  border-radius: 10px;
  padding: 1rem;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 0.9rem;
}

.cart-item-icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  margin-left: -4px;
  color: var(--color-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.cart-item-name {
  font-size: 0.88rem;
  font-family: var(--font-body);
  font-weight: 800;
  color: var(--color-white);
}

.cart-item-meta {
  font-size: 0.78rem;
  color: rgba(245,245,240,0.55);
}

.cart-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-right: -4px;
}

.cart-item-price {
  font-weight: 800;
  color: var(--color-white);
  font-size: 0.9rem;
  white-space: nowrap;
  transform: translateX(2px);
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cart-mini {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid var(--color-dark-border);
  background: transparent;
  color: var(--color-white);
  cursor: pointer;
  font-weight: 800;
}

.cart-remove {
  background: transparent;
  border: none;
  color: #ff6b6b;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.cart-foot {
  border-top: 1px solid var(--color-dark-border);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-white);
}

.cart-clear {
  background: transparent;
  border: 1px solid rgba(255,107,107,0.4);
  color: #ff6b6b;
  border-radius: 8px;
  padding: 0.55rem;
  font-weight: 700;
  cursor: pointer;
}

/* LOCATION BOX */
.location-box {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0;
}

.loc-venue {
  font-size: 1.15rem;
  font-family: var(--font-body);
  font-weight: 800;
  color: var(--color-white);
  margin: 0 0 0.25rem 0;
}

.loc-city {
  font-size: 0.9rem;
  color: rgba(245, 245, 240, 0.6);
  margin: 0;
}

.open-map-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1.5px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.open-map-btn:hover {
  background: var(--color-primary);
  color: var(--color-black);
}

/* TERMS & CONDITIONS */
.terms-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.terms-group{
  font-family: var(--font-body);
}

.terms-subheading {
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-white);
  margin: 0 0 0.75rem 0;
}

.terms-list {
  padding-left: 1.25rem;
  margin: 0;
  color: rgba(245, 245, 240, 0.7);
  font-size: 0.92rem;
  line-height: 1.75;
}

/* BOTTOM FIXED CHECKOUT BAR */
.bottom-checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #18181B;
  border-top: 1px solid var(--color-dark-border);
  margin-bottom: -1px;
  padding: 0.6rem 0 calc(0.6rem + env(safe-area-inset-bottom) + 1px);
  box-shadow: 0 -8px 24px rgba(0,0,0,0.4);
  isolation: isolate;
}

.bcb-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.bcb-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.bcb-detail-btn {
  display: none;
  background: none;
  border: none;
  color: #fbda01;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 0.25rem 0;
  flex-shrink: 0;
}

.bcb-detail-btn:hover {
  color: #fbda01;
}

.price-summary {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.starting-label {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-value {
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--color-white);
}

.view-tickets-btn {
  background: var(--color-primary);
  color: var(--color-black);
  border: none;
  padding: 0.6rem 1.6rem;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.view-tickets-btn:hover:not(:disabled) {
  background: var(--color-primary);
  transform: translateY(-2px);
}

.view-tickets-btn.is-buy {
  background: var(--color-primary);
}

.view-tickets-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* CART SHEET (mobile detail panel) */
.cart-sheet-backdrop {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.65);
  align-items: flex-end;
  overscroll-behavior: contain;
}

.cart-sheet-card {
  width: 100%;
  max-height: calc(75vh + env(safe-area-inset-bottom));
  overflow: auto;
  overscroll-behavior: contain;
  background: var(--color-dark-surface);
  background-clip: padding-box;
  border: 1px solid var(--color-dark-border);
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  margin-bottom: -1px;
  padding: 0 0 calc(1.5rem + env(safe-area-inset-bottom) + 1px);
  touch-action: pan-y;
  isolation: isolate;
}

.cart-sheet-card.dragging { transition: none; }

.sheet-grab {
  display: block;
  padding: 0.6rem;
  cursor: grab;
  touch-action: none;
}

.sheet-grab span {
  display: block;
  width: 44px;
  height: 5px;
  margin: 0 auto;
  border-radius: 999px;
  background: rgba(255,255,255,0.3);
}

.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 0 1.25rem;
  margin: 0 0 0.75rem;
}
.sheet-title {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-white);
  padding: 0;
  margin: 0;
}
.sheet-sub {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.5);
  margin: 0.2rem 0 0;
}
.sheet-edit {
  background: transparent;
  border: 1px solid var(--color-dark-border);
  color: var(--color-primary);
  border-radius: 8px;
  padding: 0.35rem 0.8rem;
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  flex-shrink: 0;
}
.sheet-edit:disabled { opacity: 0.4; cursor: not-allowed; }

.sheet-empty {
  color: rgba(255,255,255,0.45);
  font-size: 0.88rem;
  padding: 0 1.25rem;
}

.sheet-list {
  list-style: none;
  margin: 0;
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sheet-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.sheet-item-icon {
  flex-shrink: 0;
  color: var(--color-primary);
}

.sheet-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.sheet-item-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-white);
}

.sheet-item-meta {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}

.sheet-item-price {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-white);
  flex-shrink: 0;
  white-space: nowrap;
}
.sheet-item-right {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
}
.sheet-remove {
  background: transparent;
  border: none;
  color: #ff6b6b;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}
.sheet-clear {
  display: block;
  width: calc(100% - 2.5rem);
  margin: 0.9rem 1.25rem 0;
  background: transparent;
  border: 1px solid rgba(255, 107, 107, 0.4);
  color: #ff6b6b;
  border-radius: 8px;
  padding: 0.55rem;
  font-weight: 700;
  cursor: pointer;
}

.sheet-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin-top: 1rem;
  padding: 1rem 1.25rem 0;
  font-size: 0.92rem;
  color: var(--color-white);
}

.sheet-total strong {
  font-size: 1rem;
  color: var(--color-primary);
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}

.sheet-fade-enter-active .cart-sheet-card {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sheet-fade-leave-active .cart-sheet-card {
  transition: transform 0.3s ease-in;
}

.sheet-fade-enter-from .cart-sheet-card {
  transform: translateY(100%);
}

.sheet-fade-leave-to .cart-sheet-card {
  transform: translateY(100%);
}

/* RESPONSIVE DESIGN - MOBILE & TABLET ADAPTATION */
@media (max-width: 992px) {
  .hero-main-grid {
    grid-template-columns: 1fr;
  }

  .banner-image-container,
  .event-meta-card {
    min-height: 0;
  }

  .banner-image-container {
    height: auto;
    min-height: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .banner-img {
    position: relative;
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .tickets-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary { display: none; }

}
@media (max-width: 640px) {
  .event-detail-page .container.event-wide {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .event-hero-header {
    padding: 5.25rem 0 1rem 0;
  }

  .event-hero-header .container.event-wide {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .hero-main-grid {
    display: contents;
  }

  .banner-image-container {
    order: 1;
    height: auto;
    min-height: 0;
    border-radius: 10px;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .banner-img {
    position: relative;
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }

  .hero-top-bar {
    order: 2;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    margin: 0.75rem 0 0.5rem;
  }

  .event-meta-card {
    order: 3;
    border: none;
    background: transparent;
    height: auto;
    min-height: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    gap: 0.4rem;
  }

  .event-title {
    flex: 1;
    min-width: 0;
    max-width: 100%;
    font-size: 1.1rem;
    line-height: 1.2;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }
  .event-title .title-track {
    display: inline-flex;
    white-space: nowrap;
    max-width: none;
    will-change: transform;
  }
  .event-title .title-track span { white-space: nowrap; }
  .event-title.marquee .title-track { animation: title-marquee 12s linear infinite; }
  .event-title.marquee .title-track span { padding-right: 2rem; }

  .countdown-wrapper { display: none; }

  .meta-item { gap: 0.6rem; }
  .meta-icon { width: 28px; height: 28px; }
  .organizer-row { gap: 0.5rem; padding-top: 0.6rem; }
  .organizer-box { gap: 0.6rem; }
  .more-btn { padding: 0.4rem; }

  .countdown-label,
  .countdown-boxes,
  .cd-box,
  .cd-num,
  .cd-txt { display: none; }

  .sticky-tabs-nav {
    top: 59px;
    margin-top: -1px;
    padding-top: 1px;
    background: #18181B;
  }

  .tabs-list {
    gap: 1.25rem;
    padding: 0 1rem;
    background: #18181B;
  }

  .tabs-list li button {
    padding: 0.9rem 0;
  }

  .content-section {
    scroll-margin-top: 130px;
  }

  .meta-icon {
    width: 28px;
    height: 28px;
  }

  .meta-value {
    font-size: 0.85rem;
  }

  .location-box {
    flex-direction: row;
    align-items: center;
    padding: 0.85rem 1rem;
    border-radius: 8px;
  }

  .open-map-btn {
    width: auto;
    padding: 0.5rem;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .open-map-btn svg { display: block; }
  .map-btn-text { display: none; }

  .toc-top {
    padding: 0.75rem 0.9rem 0.55rem;
    gap: 0.5rem;
  }

  .toc-title-wrap { gap: 0.3rem; }

  .toc-name {
    font-size: 0.85rem;
  }

  .toc-badge {
    font-size: 0.58rem;
    padding: 0.18rem 0.45rem;
    border-radius: 3px;
    gap: 0.25rem;
  }

  .toc-dot {
    width: 10px;
    height: 10px;
  }

  .toc-dot::after { font-size: 7px; }

  .toc-price-label { font-size: 0.65rem; }
  .toc-price { font-size: 0.9rem; }
  .toc-price.is-discount { font-size: 0.85rem; }
  .toc-price-strike { font-size: 0.7rem; }
  .toc-expand { font-size: 1rem; }

  .toc-desc-row {
    margin: 0.5rem 0.9rem 0.6rem;
    padding: 0.5rem 0.6rem;
  }

  .toc-desc-title {
    font-size: 0.55rem;
  }

  .toc-desc { font-size: 0.75rem; }

  .toc-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.9rem;
  }

  .toc-ends { font-size: 0.72rem; }
  .toc-starts { font-size: 0.72rem; }
  .toc-starts-label { font-size: 0.72rem; }

  .toc-action {
    flex-shrink: 0;
  }

  .toc-add {
    padding: 0.35rem 0.65rem;
    font-size: 0.7rem;
    border-radius: 5px;
    white-space: nowrap;
  }

  .qty-control {
    justify-content: space-between;
    padding: 0.25rem 0.4rem;
    border-radius: 6px;
    width: 100%;
  }

  .qty-control {
    justify-content: space-between;
    padding: 0.25rem 0.4rem;
    border-radius: 6px;
  }

  .qty-btn {
    width: 26px;
    height: 26px;
    font-size: 0.95rem;
  }

  .cart-item {
    flex-direction: column;
  }

  .cart-item-right {
    align-items: flex-start;
  }

  .bcb-container {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .bcb-top-row {
    width: 100%;
  }

  .starting-label {
    font-size: 0.65rem;
  }

  .price-value {
    font-size: 0.95rem;
  }

  .bcb-detail-btn {
    display: block;
    font-size: 0.68rem;
  }

  .bottom-checkout-bar {
    background: #18181B;
    margin-bottom: -1px;
    padding: 0.45rem 0 calc(0.45rem + env(safe-area-inset-bottom) + 1px);
  }

  .view-tickets-btn {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 0.82rem;
    white-space: nowrap;
  }

  .ticket-option-card {
    border-radius: 8px;
  }

  .section-header { gap: 0.5rem; margin-bottom: 0.9rem; }
  .section-icon { width: 18px; height: 18px; }
  .section-heading { font-size: 1.2rem; }

  .description-text-box { font-size: 0.88rem; line-height: 1.6; }
  .read-more-btn { font-size: 0.8rem; padding: 0.4rem 0; }

  .loc-venue { font-size: 1rem; }
  .loc-city { font-size: 0.8rem; }

  .terms-subheading { font-size: 0.9rem; margin-bottom: 0.5rem; }
  .terms-list { font-size: 0.82rem; line-height: 1.6; }
}
</style>
