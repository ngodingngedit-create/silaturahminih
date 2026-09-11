<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ticketCategories } from '../data/tickets.js'
import { EVENT_PATH } from '../utils/eventRoute.js'
import { createTransaction } from '../services/eventApi.js'

const PAY_SECONDS = 15 * 60
const remaining = ref(PAY_SECONDS)
let payTimer = null
const countdownText = computed(() => {
  const s = Math.max(0, remaining.value)
  const m = String(Math.floor(s / 60)).padStart(2, '0')
  const r = String(s % 60).padStart(2, '0')
  return `${m}:${r}`
})

const router = useRouter()

const buyer = ref({ name: '', email: '', phone: '', phoneCode: '+62' })
const buyerOpen = ref(true)
const cart = ref({})
const catalogList = ref(ticketCategories)
const eventId = ref(0)
const vouchers = ref([''])
const appliedVouchers = ref([])
const voucherMsg = ref('')
const useBuyerFor = ref({})
const ownerNames = ref({})
const ownerEmails = ref({})
const ownerPhones = ref({})
const ownerPhoneCodes = ref({})
const submitted = ref(false)
const openOwner = ref(null)
const submitMsg = ref('')
const submitError = ref('')
const submitting = ref(false)
const showSummary = ref(false)
const summaryDragY = ref(0)
const summaryDragging = ref(false)
let summaryDragStartY = 0

function onSummaryGrabStart(e) {
  summaryDragging.value = true
  summaryDragStartY = e.touches ? e.touches[0].clientY : e.clientY
}
function onSummaryGrabMove(e) {
  if (!summaryDragging.value) return
  const y = e.touches ? e.touches[0].clientY : e.clientY
  summaryDragY.value = Math.max(0, y - summaryDragStartY)
}
function onSummaryGrabEnd() {
  if (!summaryDragging.value) return
  summaryDragging.value = false
  if (summaryDragY.value > 110) showSummary.value = false
  summaryDragY.value = 0
}

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim())
const phoneOk = (v) => /^[0-9]{8,15}$/.test((v || '').replace(/\D/g, ''))
const ownerName = (k) => useBuyerFor.value[k] ? buyer.value.name : (ownerNames.value[k] || '')
const ownerEmail = (k) => useBuyerFor.value[k] ? buyer.value.email : (ownerEmails.value[k] || '')
const ownerPhone = (k) => useBuyerFor.value[k] ? buyer.value.phone : (ownerPhones.value[k] || '')
const ownerPhoneCode = (k) => useBuyerFor.value[k] ? buyer.value.phoneCode : (ownerPhoneCodes.value[k] || '+62')
const ownerValid = (k) => ownerName(k).trim().length >= 3 && emailOk(ownerEmail(k)) && phoneOk(ownerPhone(k))

function loadCart() {
  try {
    const raw = sessionStorage.getItem('silaturahmi_cart')
    if (raw) cart.value = JSON.parse(raw) || {}
    const rawCat = sessionStorage.getItem('silaturahmi_catalog')
    if (rawCat) catalogList.value = JSON.parse(rawCat) || ticketCategories
    const rawEid = sessionStorage.getItem('silaturahmi_event_id')
    if (rawEid) eventId.value = Number(rawEid) || 0
    if (!eventId.value && catalogList.value.length) {
      eventId.value = Number(catalogList.value[0].eventId) || 0
    }
  } catch { cart.value = {} }
}

onMounted(() => {
  loadCart()
  remaining.value = PAY_SECONDS
  payTimer = setInterval(() => {
    if (remaining.value > 0) remaining.value -= 1
  }, 1000)
})

onUnmounted(() => {
  if (payTimer) clearInterval(payTimer)
})

const catalog = computed(() => {
  const map = {}
  catalogList.value.forEach(t => { map[String(t.id)] = t })
  return map
})

const cartItems = computed(() => Object.entries(cart.value)
  .filter(([id, q]) => q > 0 && catalog.value[id])
  .map(([id, qty]) => ({ ...catalog.value[id], qty, subtotal: catalog.value[id].price * qty })))

const cartCount = computed(() => cartItems.value.reduce((a, b) => a + b.qty, 0))
const cartTotal = computed(() => cartItems.value.reduce((a, b) => a + b.subtotal, 0))
const fmt = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

const ownerSlots = computed(() => {
  const slots = []
  cartItems.value.forEach(item => {
    for (let i = 0; i < item.qty; i++) {
      slots.push({ key: `${item.id}-${i}`, ticket: item, index: slots.length + 1 })
    }
  })
  return slots
})

const emailValid = computed(() => emailOk(buyer.value.email))
const phoneValid = computed(() => phoneOk(buyer.value.phone))
const buyerValid = computed(() => buyer.value.name.trim().length >= 3 && emailValid.value && phoneValid.value)
const ownersValid = computed(() => ownerSlots.value.every(s => ownerValid(s.key)))
const canSubmit = computed(() => buyerValid.value && ownersValid.value && cartItems.value.length > 0 && !submitting.value)

function toggleOwner(key) {
  openOwner.value = openOwner.value === key ? null : key
}

function addVoucher() {
  if (vouchers.value.length >= 3) return
  vouchers.value.push('')
}

function submitVoucher() {
  const code = vouchers.value.map(v => v.trim()).filter(Boolean)
  if (!code.length) return
  appliedVouchers.value = [...new Set([...appliedVouchers.value, ...code])]
  vouchers.value = ['']
  voucherMsg.value = 'Voucher ' + code.join(', ') + ' diterapkan.'
  setTimeout(() => { voucherMsg.value = '' }, 4000)
}

function removeVoucher(code) {
  appliedVouchers.value = appliedVouchers.value.filter(v => v !== code)
}

async function submitOrder() {
  submitted.value = true
  submitError.value = ''
  submitMsg.value = ''
  if (!cartItems.value.length) {
    submitError.value = 'Keranjang kosong. Kembali dan tambah tiket dulu.'
    return
  }
  if (!buyerValid.value) {
    buyerOpen.value = true
    submitError.value = 'Lengkapi Data Pemesan (nama, email valid, no telepon valid).'
    return
  }
  if (!ownersValid.value) {
    openOwner.value = ownerSlots.value.find(s => !ownerValid(s.key))?.key || null
    submitError.value = 'Lengkapi data semua Pemilik Tiket.'
    return
  }
  const digits = (v) => (v || '').replace(/\D/g, '')
  const buyerPhone = digits(buyer.value.phoneCode + buyer.value.phone)
  const firstTicketId = Number(cartItems.value[0]?.ticketId) || Number(cartItems.value[0]?.id) || 0
  const identities = [
    {
      nik: '',
      full_name: buyer.value.name.trim(),
      email: buyer.value.email.trim(),
      countryCode: '',
      no_telp: buyerPhone,
      is_pemesan: 1,
      identity_type_id: 1,
      event_ticket_id: firstTicketId,
    },
    ...ownerSlots.value.map(s => ({
      nik: '',
      full_name: ownerName(s.key).trim(),
      email: ownerEmail(s.key).trim(),
      countryCode: '',
      no_telp: digits(ownerPhoneCode(s.key) + ownerPhone(s.key)),
      is_pemesan: 0,
      identity_type_id: 1,
      event_ticket_id: Number(s.ticket.ticketId) || Number(s.ticket.id) || 0,
    })),
  ]
  const tickets = cartItems.value.map(item => {
    const tid = Number(item.ticketId) || Number(item.id) || 0
    const fee = Number(item.fee) || 0
    return {
      id: tid,
      event_id: Number(eventId.value) || Number(item.eventId) || 0,
      event_ticket_id: tid,
      price: Number(item.price) || 0,
      ticket_fee: fee,
      name: item.name,
      subtotal_price: Number(item.price) * Number(item.qty),
      qty_ticket: Number(item.qty),
      payment_status: 'pending',
      event_session_id: item.eventSessionId ?? null,
      is_insurance: 0,
      insurance_amount: 0,
      insurance_require: 0,
      is_bundling: 0,
      bundling_qty: 0,
    }
  })
  const payload = {
    user_id: null,
    event_id: Number(eventId.value) || Number(cartItems.value[0]?.eventId) || 0,
    admin_fee: 0,
    payment_method: '4',
    grandtotal: cartTotal.value,
    ppn_type: 'percentage',
    ppn: 0,
    ppn_amount: 0,
    is_insurance: 0,
    insurance_amount: 0,
    insurance_total: 0,
    insurance_required: 0,
    identities,
    tickets,
    bank_code: '',
    expiration_date: new Date(Date.now() + Math.max(0, remaining.value) * 1000).toISOString(),
    vouchers: appliedVouchers.value,
    is_merch: 0,
  }
  submitting.value = true
  try {
    try {
      sessionStorage.setItem('silaturahmi_order', JSON.stringify({
        buyer: buyer.value, items: cartItems.value, vouchers: appliedVouchers.value,
        owners: ownerSlots.value.map(s => ({ ticket: s.ticket.name, name: ownerName(s.key), email: ownerEmail(s.key), phone: ownerPhone(s.key) })),
        total: cartTotal.value, ts: Date.now()
      }))
    } catch { /* ponytail: ignore storage failure, order still shown */ }
    const res = await createTransaction(payload)
    const d = res?.data ?? res ?? {}
    const xenditUrl = d.xendit_url || d.xenditUrl || d.payment_url || d.invoice_url || res?.xendit_url
    if (xenditUrl) {
      window.location.href = xenditUrl
      return
    }
    submitMsg.value = `Pesanan ${cartCount.value} tiket (${fmt(cartTotal.value)}) atas nama ${buyer.value.name} tercatat.`
  } catch (e) {
    submitError.value = e?.message || 'Gagal membuat transaksi. Coba lagi.'
  } finally {
    submitting.value = false
  }
}

function backToTickets() {
  router.push(EVENT_PATH)
}
</script>

<template>
  <div class="pi-page">
    <div class="container pi-wide">
      <h1 class="pi-title">Personal Informasi</h1>

      <div v-if="cartItems.length > 0" class="pi-top-countdown">
        <span class="pi-tc-label">Sisa waktu pembayaran</span>
        <strong class="pi-tc-time">{{ countdownText }}</strong>
      </div>

      <div v-if="cartItems.length === 0" class="pi-empty">
        <p>Belum ada tiket dipilih.</p>
        <button class="btn btn-yellow" @click="backToTickets">Pilih Tiket Dulu</button>
      </div>

      <div v-else class="pi-layout">
        <div class="pi-main">
          <section class="pi-card">
            <button class="pi-card-head" @click="buyerOpen = !buyerOpen">
              <span>Data Pemesan</span>
              <span class="pi-chev" :class="{ open: buyerOpen }">›</span>
            </button>
            <div v-show="buyerOpen" class="pi-card-body">
              <label class="pi-label">Nama Lengkap</label>
              <input v-model="buyer.name" class="pi-input" :class="{ error: submitted && buyer.name.trim().length < 3 }" type="text" placeholder="Nama Lengkap" />
              <p v-if="buyer.name ? buyer.name.trim().length < 3 : submitted" class="pi-hint-error">Nama lengkap minimal 3 karakter.</p>
              <label class="pi-label">Email</label>
              <input v-model="buyer.email" class="pi-input" :class="{ error: (buyer.email && !emailValid) || (submitted && !emailValid) }" type="email" placeholder="Contoh: example@example.com" />
              <p v-if="(buyer.email && !emailValid) || (submitted && !emailValid)" class="pi-hint-error">Format email belum valid.</p>
              <label class="pi-label">No Telepon</label>
              <div class="pi-phone-row">
                <select v-model="buyer.phoneCode" class="pi-input pi-code">
                  <option>+62</option>
                  <option>+60</option>
                  <option>+65</option>
                </select>
                <input v-model="buyer.phone" class="pi-input" :class="{ error: (buyer.phone && !phoneValid) || (submitted && !phoneValid) }" type="tel" inputmode="numeric" placeholder="Contoh: 81234567890" />
              </div>
              <p v-if="(buyer.phone && !phoneValid) || (submitted && !phoneValid)" class="pi-hint-error">No telepon 8-15 digit angka.</p>
            </div>
          </section>

          <section v-for="slot in ownerSlots" :key="slot.key" class="pi-card">
            <button class="pi-card-head" @click="toggleOwner(slot.key)">
              <span class="pi-owner-head">
                <span class="pi-plain-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
                    <path d="M13 5v2"></path>
                    <path d="M13 11v2"></path>
                    <path d="M13 17v2"></path>
                  </svg>
                </span>
                <span class="pi-owner-text">
                  <span class="pi-marquee"><strong class="pi-marquee-track"><span>{{ slot.index }}. Pemilik Tiket {{ slot.ticket.name }}*</span><span aria-hidden="true">{{ slot.index }}. Pemilik Tiket {{ slot.ticket.name }}*</span></strong></span>
                  <small>1 Tiket x {{ slot.ticket.priceFormatted }}</small>
                </span>
              </span>
              <span class="pi-chev" :class="{ open: openOwner === slot.key }">›</span>
            </button>
            <div v-show="openOwner === slot.key" class="pi-card-body">
              <div class="pi-toggle-row">
                <span>Gunakan Data Pemesan</span>
                <button
                  class="pi-switch"
                  :class="{ on: useBuyerFor[slot.key] }"
                  @click="useBuyerFor[slot.key] = !useBuyerFor[slot.key]"
                  :aria-pressed="!!useBuyerFor[slot.key]"
                ><span class="pi-knob"></span></button>
              </div>
              <template v-if="useBuyerFor[slot.key]">
                <label class="pi-label">Nama Lengkap</label>
                <input :value="buyer.name" class="pi-input pi-auto" type="text" placeholder="Nama Lengkap" disabled />
                <label class="pi-label">Email</label>
                <input :value="buyer.email" class="pi-input pi-auto" type="email" placeholder="Contoh: example@example.com" disabled />
                <label class="pi-label">No Telepon</label>
                <div class="pi-phone-row">
                  <select :value="buyer.phoneCode" class="pi-input pi-code pi-auto" disabled>
                    <option>+62</option>
                    <option>+60</option>
                    <option>+65</option>
                  </select>
                  <input :value="buyer.phone" class="pi-input pi-auto" type="tel" placeholder="Contoh: 81234567890" disabled />
                </div>
              </template>
              <template v-else>
                <label class="pi-label">Nama Lengkap</label>
                <input v-model="ownerNames[slot.key]" class="pi-input" :class="{ error: (ownerNames[slot.key] && ownerName(slot.key).trim().length < 3) || (submitted && ownerName(slot.key).trim().length < 3) }" type="text" placeholder="Nama Lengkap" />
                <p v-if="(ownerNames[slot.key] && ownerName(slot.key).trim().length < 3) || (submitted && ownerName(slot.key).trim().length < 3)" class="pi-hint-error">Nama lengkap minimal 3 karakter.</p>
                <label class="pi-label">Email</label>
                <input v-model="ownerEmails[slot.key]" class="pi-input" :class="{ error: (ownerEmails[slot.key] && !emailOk(ownerEmail(slot.key))) || (submitted && !emailOk(ownerEmail(slot.key))) }" type="email" placeholder="Contoh: example@example.com" />
                <p v-if="(ownerEmails[slot.key] && !emailOk(ownerEmail(slot.key))) || (submitted && !emailOk(ownerEmail(slot.key)))" class="pi-hint-error">Format email belum valid.</p>
                <label class="pi-label">No Telepon</label>
                <div class="pi-phone-row">
                  <select :value="ownerPhoneCode(slot.key)" @change="ownerPhoneCodes[slot.key] = $event.target.value" class="pi-input pi-code">
                    <option>+62</option>
                    <option>+60</option>
                    <option>+65</option>
                  </select>
                  <input v-model="ownerPhones[slot.key]" class="pi-input" :class="{ error: (ownerPhones[slot.key] && !phoneOk(ownerPhone(slot.key))) || (submitted && !phoneOk(ownerPhone(slot.key))) }" type="tel" inputmode="numeric" placeholder="Contoh: 81234567890" />
                </div>
                <p v-if="(ownerPhones[slot.key] && !phoneOk(ownerPhone(slot.key))) || (submitted && !phoneOk(ownerPhone(slot.key)))" class="pi-hint-error">No telepon 8-15 digit angka.</p>
              </template>
            </div>
          </section>
        </div>

        <aside class="pi-side">
          <section class="pi-card pi-event pi-card-event">
            <img src="/konser1.jpg" alt="Silaturahmi Festival 2027" class="pi-event-img" />
            <div>
              <strong>SILATURAHMI FESTIVAL 2027</strong>
              <small>23 May 2027</small>
            </div>
          </section>

          <section class="pi-card">
            <h2 class="pi-side-title">
              <span class="pi-plain-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2H2v10l9.3 9.3a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8z"></path>
                  <circle cx="7" cy="7" r="1.5"></circle>
                </svg>
              </span>
              Voucher
            </h2>
            <div v-for="(v, i) in vouchers" :key="i" class="pi-voucher-row">
              <input v-model="vouchers[i]" class="pi-input" type="text" :placeholder="`Masukan Kode Voucher ${i + 1}`" />
            </div>
            <div v-if="appliedVouchers.length" class="pi-chips">
              <span v-for="c in appliedVouchers" :key="c" class="pi-chip">
                {{ c }} <button @click="removeVoucher(c)" aria-label="Hapus voucher">×</button>
              </span>
            </div>
            <button class="pi-btn-submit" :disabled="!vouchers.some(v => v.trim())" @click="submitVoucher">Submit</button>
            <p v-if="voucherMsg" class="pi-hint-ok">{{ voucherMsg }}</p>
            <button v-if="vouchers.length < 3" class="pi-btn-outline" @click="addVoucher">+ Tambah Voucher</button>
          </section>

          <section class="pi-card pi-card-summary">
            <h2 class="pi-side-title">Ringksan Pesanan</h2>
            <ul class="pi-summary-list">
              <li v-for="item in cartItems" :key="item.id" class="pi-summary-item">
                <span class="pi-plain-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
                    <path d="M13 5v2"></path>
                    <path d="M13 11v2"></path>
                    <path d="M13 17v2"></path>
                  </svg>
                </span>
                <span class="pi-summary-text">
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.qty }} Tiket x {{ item.priceFormatted }} = {{ fmt(item.subtotal) }}</small>
                </span>
              </li>
            </ul>
            <div class="pi-total-row">
              <span>Jumlah ({{ cartCount }} Tiket)</span>
              <strong>{{ fmt(cartTotal) }}</strong>
            </div>
            <p v-if="submitError" class="pi-hint-error">{{ submitError }}</p>
            <p v-if="submitMsg" class="pi-hint-ok">{{ submitMsg }}</p>
          </section>
        </aside>
      </div>
    </div>

    <Transition name="pi-bottom">
      <div v-if="cartItems.length && !showSummary" class="pi-bottombar">
        <div class="container pi-wide pi-bottom-inner">
          <div class="pi-pay-timer">
            <span class="pi-pay-label">Sisa waktu pembayaran</span>
            <span class="pi-pay-time">{{ countdownText }}</span>
          </div>
          <div class="pi-pay-action">
            <button class="btn btn-yellow pi-pay-btn" :disabled="!canSubmit || submitting" @click="submitOrder">{{ submitting ? 'Memproses...' : 'Bayar Sekarang' }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="pi-sheet">
      <div v-if="showSummary" class="pi-sheet-backdrop" @click.self="showSummary = false">
        <section
          class="pi-card pi-sheet-card"
          :style="summaryDragY ? { transform: `translateY(${summaryDragY}px)` } : null"
          :class="{ dragging: summaryDragging }"
        >
          <div
            class="pi-grab"
            @mousedown="onSummaryGrabStart"
            @mousemove="onSummaryGrabMove"
            @mouseup="onSummaryGrabEnd"
            @mouseleave="onSummaryGrabEnd"
            @touchstart.passive="onSummaryGrabStart"
            @touchmove.passive="onSummaryGrabMove"
            @touchend="onSummaryGrabEnd"
          ><span></span></div>
          <h2 class="pi-side-title">Ringkasan Pesanan</h2>
          <ul class="pi-summary-list">
            <li v-for="item in cartItems" :key="item.id" class="pi-summary-item">
              <span class="pi-plain-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
                  <path d="M13 5v2"></path>
                  <path d="M13 11v2"></path>
                  <path d="M13 17v2"></path>
                </svg>
              </span>
              <span class="pi-summary-text">
                <strong>{{ item.name }}</strong>
                <small>{{ item.qty }} Tiket x {{ item.priceFormatted }} = {{ fmt(item.subtotal) }}</small>
              </span>
            </li>
          </ul>
          <div class="pi-total-row">
            <span>Jumlah ({{ cartCount }} Tiket)</span>
            <strong>{{ fmt(cartTotal) }}</strong>
          </div>
          <p v-if="submitError" class="pi-hint-error">{{ submitError }}</p>
          <p v-if="submitMsg" class="pi-hint-ok">{{ submitMsg }}</p>
        </section>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pi-page {
  background: var(--color-black);
  color: var(--color-white);
  min-height: 100vh;
  padding: 9rem 0 8rem;
}
.pi-wide { max-width: 1400px; }
.pi-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: var(--color-white);
  margin: 0 0 1.5rem;
  letter-spacing: 0.02em;
}
.pi-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 2rem;
  align-items: start;
}
.pi-main, .pi-side {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}
.pi-card {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  box-shadow: none;
  overflow: hidden;
}
.pi-card-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: none;
  border: none;
  padding: 1rem 1.25rem;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-white);
  cursor: pointer;
}
.pi-card-body {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.pi-chev {
  display: inline-block;
  color: var(--color-primary);
  font-size: 1.4rem;
  transform: rotate(-90deg);
  transition: transform 0.25s ease;
}
.pi-chev.open { transform: rotate(90deg); }
.pi-label { font-size: 0.9rem; color: rgba(255, 255, 255, 0.6); margin-top: 0.5rem; }
.pi-input {
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  font-size: 0.95rem;
  color: var(--color-white);
  background: var(--color-black);
  width: 100%;
}
.pi-input::placeholder { color: rgba(255, 255, 255, 0.35); }
.pi-input:focus { outline: 2px solid var(--color-primary); outline-offset: -1px; border-color: var(--color-primary); }
.pi-input.error { border-color: var(--color-secondary); }
.pi-input.error:focus { outline-color: var(--color-secondary); }
.pi-auto { opacity: 0.75; cursor: not-allowed; }
.pi-phone-row { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 0.75rem; }
.pi-code { text-align: center; }
.pi-hint-error { color: var(--color-secondary); font-size: 0.82rem; margin: 0.25rem 0 0; }
.pi-hint-ok { color: var(--color-tertiary); font-size: 0.85rem; margin: 0.5rem 0 0; }
.pi-owner-head { display: flex; align-items: center; gap: 0.75rem; min-width: 0; text-align: left; }
.pi-plain-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  background-color: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  outline: none;
  padding: 0;
  color: var(--color-primary);
}
.pi-plain-icon svg { display: block; stroke: var(--color-primary); }
.pi-owner-text { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; overflow: hidden; }
.pi-owner-text strong { font-size: 0.95rem; }
.pi-owner-text small { color: rgba(255, 255, 255, 0.55); font-weight: 500; }
.pi-marquee { display: block; overflow: hidden; white-space: nowrap; max-width: 100%; }
.pi-marquee-track { display: inline-flex; white-space: nowrap; animation: pi-marquee 16s linear infinite; }
.pi-marquee-track span { white-space: nowrap; flex-shrink: 0; padding-right: 1rem; }
@keyframes pi-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.pi-toggle-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.9rem;
  padding: 0.25rem 0;
}
.pi-switch {
  width: 46px;
  height: 26px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
}
.pi-switch.on { background: var(--color-primary); }
.pi-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.2s ease;
}
.pi-switch.on .pi-knob { left: 23px; background: var(--color-black); }
.pi-event {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.25rem;
}
.pi-event-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.pi-event strong { display: block; font-size: 0.95rem; }
.pi-event small { color: rgba(255, 255, 255, 0.55); }
.pi-side-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-heading);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  color: var(--color-white);
  margin: 0;
  padding: 1rem 1.25rem 0;
}
.pi-voucher-row { padding: 0.75rem 1.25rem 0; }
.pi-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.75rem 1.25rem 0; }
.pi-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(251, 218, 1, 0.12);
  border: 1px solid rgba(251, 218, 1, 0.4);
  color: var(--color-primary);
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 700;
}
.pi-chip button { background: none; border: none; color: inherit; cursor: pointer; font-size: 1rem; line-height: 1; }
.pi-btn-submit,
.pi-btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: calc(100% - 2.5rem);
  margin: 0.75rem 1.25rem 0;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.pi-btn-submit {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.pi-btn-submit:not(:disabled) { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-black); }
.pi-btn-submit:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(251, 218, 1, 0.25); filter: brightness(1.05); }
.pi-btn-submit:disabled { cursor: not-allowed; }
.pi-btn-outline {
  margin-bottom: 1.25rem;
  background: transparent;
  border: 1px dashed rgba(251, 218, 1, 0.5);
  color: var(--color-primary);
}
.pi-btn-outline:hover { background: rgba(251, 218, 1, 0.1); border-style: solid; transform: translateY(-1px); }
.pi-summary-list { list-style: none; margin: 0; padding: 0.75rem 1.25rem 0; display: flex; flex-direction: column; gap: 0.9rem; }
.pi-summary-item { display: flex; align-items: center; gap: 0.75rem; }
.pi-summary-text { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.pi-summary-text strong { font-size: 0.92rem; }
.pi-summary-text small { color: rgba(255, 255, 255, 0.55); }
.pi-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 1rem;
  padding: 1rem 1.25rem 1.25rem;
  font-size: 0.95rem;
}
.pi-total-row strong { font-size: 1.05rem; color: var(--color-primary); }
.pi-empty {
  background: var(--color-dark-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 3rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.pi-bottombar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: var(--color-dark-surface);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.pi-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
}

.pi-pay-timer { display: flex; flex-direction: column; gap: 0.15rem; }
.pi-pay-label { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.55); }
.pi-pay-time { font-family: var(--font-heading); font-size: 1.6rem; letter-spacing: 0.05em; color: var(--color-primary); line-height: 1; }
.pi-pay-action { display: flex; align-items: center; gap: 0.75rem; }
.pi-top-countdown {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  margin-bottom: 1rem;
  background: rgba(251, 218, 1, 0.08);
  border: 1px solid rgba(251, 218, 1, 0.2);
  border-radius: var(--radius-sm);
}
.pi-tc-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
}
.pi-tc-time {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  line-height: 1;
}
.pi-pay-btn:disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(1); }
.pi-detail-btn {
  display: none;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.25);
  color: var(--color-white);
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
}
.pi-sheet-backdrop { display: none; }
.pi-grab { display: none; }
.pi-bottom-enter-active, .pi-bottom-leave-active { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.pi-bottom-enter-from, .pi-bottom-leave-to { transform: translateY(100%); opacity: 0; }
.pi-sheet-enter-active, .pi-sheet-leave-active { transition: opacity 0.3s ease; }
.pi-sheet-enter-from, .pi-sheet-leave-to { opacity: 0; }
.pi-sheet-enter-active .pi-sheet-card { transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.pi-sheet-leave-active .pi-sheet-card { transition: transform 0.35s ease-in; }
.pi-sheet-enter-from .pi-sheet-card { transform: translateY(100%); }
.pi-sheet-leave-to .pi-sheet-card { transform: translateY(100%); }

@media (max-width: 992px) {
  .pi-layout { grid-template-columns: 1fr; }
  .pi-side { order: 2; }
}
@media (max-width: 640px) {
  .pi-page { padding: 6.5rem 0 8rem; }
  .pi-layout { gap: 1rem; }
  .pi-main, .pi-side { gap: 0.75rem; }
  .pi-phone-row { grid-template-columns: 82px minmax(0, 1fr); }
  .pi-card-head { padding: 0.8rem 0.9rem; font-size: 0.88rem; }
  .pi-card-body { padding: 0.85rem; }
  .pi-input { padding: 0.55rem 0.75rem; font-size: 0.88rem; }
  .pi-label { font-size: 0.82rem; }
  .pi-hint-error { font-size: 0.78rem; }
  .pi-top-countdown { display: flex; }
  .pi-owner-text strong { font-size: 0.85rem; }
  .pi-toggle-row { justify-content: space-between; }
  .pi-side { order: -1; }
  .pi-card-summary { display: none; }
  .pi-bottombar { border-radius: 16px 16px 0 0; overflow: hidden; }
  .pi-bottom-inner { flex-direction: row; align-items: center; gap: 0.6rem; padding: 0.6rem 0.9rem; }
  .pi-pay-timer { display: none; }
  .pi-pay-label { font-size: 0.62rem; }
  .pi-pay-time { font-size: 1.15rem; }
  .pi-pay-action { gap: 0.5rem; flex: 1; justify-content: flex-end; }
  .pi-detail-btn { display: inline-flex; }
  .pi-pay-btn { flex: 0 1 auto; padding: 0.65rem 1.1rem; font-size: 0.75rem; }
  .pi-sheet-backdrop {
    display: flex;
    align-items: flex-end;
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(0, 0, 0, 0.65);
  }
  .pi-sheet-card {
    width: 100%;
    max-height: 82vh;
    overflow: auto;
    border-radius: 18px 18px 0 0;
    border-bottom: none;
    padding-bottom: 1.5rem;
    touch-action: pan-y;
  }
  .pi-sheet-card.dragging { transition: none; }
  .pi-grab { display: block; padding: 0.6rem; cursor: grab; touch-action: none; }
  .pi-grab span { display: block; width: 44px; height: 5px; margin: 0 auto; border-radius: 999px; background: rgba(255,255,255,0.3); }
}
</style>
