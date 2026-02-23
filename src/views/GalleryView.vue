<script setup>
import { ref, onMounted } from 'vue'
import MarqueeSection from '../components/MarqueeSection.vue';

const STORAGE_KEY = 'silaturahmi_gallery'
const VISITOR_KEY = 'silaturahmi_visitor_id'

const visitorId = ref('')

onMounted(() => {
  let vid = localStorage.getItem(VISITOR_KEY)
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    localStorage.setItem(VISITOR_KEY, vid)
  }
  visitorId.value = vid
})

// Slight random rotation per card (-6 to +6 deg)
function getRotation(id) {
  const seed = typeof id === 'number' ? id : [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)
  return ((seed % 13) - 6)
}

// Random tape position: left, center, right
function getTapePos(id) {
  const seed = typeof id === 'number' ? id : [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0)
  const positions = ['tape-left', 'tape-center', 'tape-right']
  return positions[seed % 3]
}

function loadPhotos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

const photos = ref(loadPhotos())
const showForm = ref(false)
const form = ref({ caption: '', ig: '' })
const fileInput = ref(null)
const previewUrl = ref(null)
const errorMsg = ref('')
const successMsg = ref('')

// Image compression helper
function compressImage(base64Str, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = base64Str
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
  })
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { errorMsg.value = 'Maks 5MB ya!'; return }
  errorMsg.value = ''
  const reader = new FileReader()
  reader.onload = async (ev) => { 
    // Compress immediately on selection to save memory in state
    previewUrl.value = await compressImage(ev.target.result)
  }
  reader.readAsDataURL(file)
}

function clearForm() {
  form.value = { caption: '', ig: '' }
  previewUrl.value = null
  errorMsg.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function submitPhoto() {
  if (!previewUrl.value) { errorMsg.value = 'Pilih foto dulu!'; return }
  if (!form.value.caption.trim()) { errorMsg.value = 'Tulis caption dulu!'; return }

  const newPhoto = {
    id: Date.now(),
    src: previewUrl.value,
    caption: form.value.caption.trim(),
    ig: form.value.ig.trim().replace(/^@/, ''),
    ts: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    authorId: visitorId.value
  }

  try {
    const updatedPhotos = [newPhoto, ...photos.value]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos))
    
    // update reactive state only AFTER successful persistence
    photos.value = updatedPhotos
    successMsg.value = '🤘 Foto lo udah masuk wall!'
    clearForm()
    showForm.value = false
    setTimeout(() => { successMsg.value = '' }, 5000)
  } catch (e) {
    console.error('Storage full:', e)
    errorMsg.value = 'Memori Browser lo penuh! Hapus foto lama lo biar bisa upload baru.'
  }
}

function deletePhoto(id) {
  if (!confirm('Hapus foto ini dari wall?')) return
  photos.value = photos.value.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos.value))
}

// Lightbox
const lightbox = ref(null)
function openLightbox(p) { lightbox.value = p }
function closeLightbox() { lightbox.value = null }
</script>

<template>
  <!-- Hero -->
  <section class="mem-hero">
    <div class="mem-hero-bg"></div>
    <div class="container mem-hero-inner">
      <div class="mem-hero-text">
        <div class="mem-eyebrow">📸 GALERI</div>
        <h1 class="mem-title">
          <span class="mem-highlight">MEMORABLE</span>
          <span class="mem-title-rest"> MOMEN DI</span>
          <span class="mem-fest"> SILATURAHMI FEST</span>
        </h1>
      </div>
      <button class="submit-btn" @click="showForm = !showForm">
        {{ showForm ? '✕ TUTUP FORM' : '📤 KIRIM KENANGAN LO' }}
      </button>
    </div>
  </section>

  <MarqueeSection text="MEMORABLE MOMENT AT SILAHTURAHMI" />

  <!-- Upload Form (collapsible) -->
  <Transition name="slide-down">
    <section v-if="showForm" class="upload-panel">
      <div class="container">
        <div class="up-inner">
          <h2 class="up-title">ABADIIN MOMEN LO 🤘</h2>
          <div class="up-grid">
            <!-- File Drop -->
            <div class="drop-zone" :class="{ 'has-img': previewUrl }" @click="fileInput.click()">
              <img v-if="previewUrl" :src="previewUrl" class="drop-preview" alt="preview" />
              <div v-else class="drop-inner">
                <span class="drop-icon">🖼️</span>
                <span>Pilih foto</span>
                <small>JPG / PNG / WEBP — maks 5MB</small>
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />

            <!-- Fields -->
            <div class="up-fields">
              <div class="up-field">
                <label class="up-label">CAPTION *</label>
                <textarea v-model="form.caption" rows="4" maxlength="200"
                  placeholder="Ceritain momen itu..." class="up-input"></textarea>
                <small class="char-count">{{ form.caption.length }}/200</small>
              </div>
              <div class="up-field">
                <label class="up-label">INSTAGRAM</label>
                <div class="ig-wrap">
                  <span class="ig-at">@</span>
                  <input v-model="form.ig" type="text" maxlength="30"
                    placeholder="username_kamu" class="up-input ig-in" />
                </div>
              </div>
              <div v-if="errorMsg" class="msg-err">⚠️ {{ errorMsg }}</div>
              <div class="up-actions">
                <button class="btn-ghost" @click="clearForm">Reset</button>
                <button class="submit-btn sm" @click="submitPhoto">UPLOAD 🤘</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Transition>

  <!-- Success toast -->
  <Transition name="toast">
    <div v-if="successMsg" class="success-toast">{{ successMsg }}</div>
  </Transition>

  <!-- Wall -->
  <section class="wall-section">
    <div class="container">

      <div v-if="photos.length === 0" class="empty-wall">
        <div class="empty-tape"></div>
        <p class="empty-text">🎸 Belum ada kenangan. Jadilah yang pertama!</p>
      </div>

      <div v-else class="polaroid-wall">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="polaroid"
          :class="getTapePos(photo.id)"
          :style="{ '--rot': getRotation(photo.id) + 'deg' }"
          @click="openLightbox(photo)"
        >
          <div class="polaroid-tape"></div>
          <div class="polaroid-img-wrap">
            <img :src="photo.src" :alt="photo.caption" class="polaroid-img" loading="lazy" />
            <div class="polaroid-hover-icon">🔍</div>
            <button 
              class="polaroid-delete" 
              @click.stop="deletePhoto(photo.id)"
              title="Hapus foto"
            >
              ✕
            </button>
          </div>
          <div class="polaroid-body">
            <p class="polaroid-caption">{{ photo.caption }}</p>
            <div class="polaroid-footer">
              <span v-if="photo.ig" class="polaroid-ig">
                <svg class="ig-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                {{ photo.ig }}
              </span>
              <span class="polaroid-date">{{ photo.ts }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <Transition name="lb">
    <div v-if="lightbox" class="lightbox" @click.self="closeLightbox">
      <button class="lb-close" @click="closeLightbox">✕</button>
      <div class="lb-polaroid">
        <img :src="lightbox.src" :alt="lightbox.caption" class="lb-img" />
        <div class="lb-body">
          <p class="lb-caption">{{ lightbox.caption }}</p>
          <div class="lb-foot">
            <a v-if="lightbox.ig" :href="`https://instagram.com/${lightbox.ig}`" target="_blank" class="lb-ig">@{{ lightbox.ig }}</a>
            <span class="lb-date">{{ lightbox.ts }}</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ---- Hero ---- */
.mem-hero {
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  padding-bottom: 3rem;
}

.mem-hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%),
    url('/konser2.jpg') center/cover no-repeat;
  z-index: 0;
}

.mem-hero-inner {
  position: relative;
  z-index: 1;
  padding-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
}

.mem-eyebrow {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--color-primary);
  text-transform: uppercase;
}

.mem-title {
  font-size: clamp(2.2rem, 6vw, 5rem);
  line-height: 1;
  color: var(--color-white);
  flex-wrap: wrap;
  display: flex;
  align-items: baseline;
  gap: 0.3em;
}

.mem-highlight {
  background: var(--color-primary);
  color: var(--color-black);
  padding: 0 0.3em;
  display: inline-block;
  font-style: italic;
  transform: skewX(-4deg);
}

.mem-title-rest { color: var(--color-white); }
.mem-fest {
  color: var(--color-primary);
  opacity: 0.8;
  font-size: 0.65em;
  letter-spacing: 0.05em;
}

/* Submit Button */
.submit-btn {
  font-family: var(--font-heading);
  font-size: 1rem;
  letter-spacing: 0.12em;
  color: var(--color-black);
  background: var(--color-primary);
  border: none;
  padding: 0.9rem 2.5rem;
  cursor: pointer;
  transition: all 0.2s;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}
.submit-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
.submit-btn.sm { font-size: 0.9rem; padding: 0.75rem 2rem; }

/* ---- Upload Panel ---- */
.upload-panel {
  background: var(--color-dark-surface);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding: 3rem 0;
}

.up-inner { max-width: 800px; }
.up-title {
  font-size: 1.4rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
}

.up-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.drop-zone {
  aspect-ratio: 1;
  border: 2px dashed rgba(255,221,0,0.3);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,221,0,0.03);
}
.drop-zone:hover { border-color: var(--color-primary); }
.drop-zone.has-img { border-style: solid; border-color: var(--color-primary); }
.drop-preview { width: 100%; height: 100%; object-fit: cover; }

.drop-inner {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  color: rgba(255,255,255,0.4); font-size: 0.9rem; text-align: center; padding: 1rem;
}
.drop-icon { font-size: 2.5rem; }

.up-fields { display: flex; flex-direction: column; gap: 1rem; }
.up-field { display: flex; flex-direction: column; gap: 0.3rem; position: relative; }

.up-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-white);
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.up-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  resize: none;
  outline: none;
  border-radius: var(--radius-sm);
  transition: border-color 0.2s;
}
.up-input:focus { border-color: var(--color-primary); }
.up-input::placeholder { color: rgba(255, 255, 255, 0.4); }

.char-count { font-size: 0.72rem; color: rgba(255,255,255,0.45); text-align: right; }

.ig-wrap { display: flex; }
.ig-at {
  background: rgba(255,221,0,0.08);
  border: 2px solid rgba(255,255,255,0.1);
  border-right: none;
  color: var(--color-primary);
  padding: 0.75rem 0.8rem;
  font-family: var(--font-heading);
}
.ig-in { flex: 1; }

.msg-err {
  font-size: 0.85rem; color: #ff6b6b;
  background: rgba(255,80,80,0.08);
  border-left: 3px solid #ff6b6b;
  padding: 0.6rem 0.8rem;
}

.up-actions { display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 0.5rem; }

.btn-ghost {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.4);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: var(--color-white); }

/* ---- Success Toast ---- */
.success-toast {
  position: fixed;
  bottom: 2rem; left: 50%; transform: translateX(-50%);
  background: var(--color-primary);
  color: var(--color-black);
  font-family: var(--font-heading);
  font-size: 1rem;
  padding: 1rem 2rem;
  z-index: 9000;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.4);
}

/* ---- Wall ---- */
.wall-section {
  background: var(--color-black);
  padding: 5rem 0 7rem;
  min-height: 60vh;
}

.empty-wall {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 6rem 0; gap: 1rem;
}
.empty-tape {
  width: 60px; height: 14px;
  background: rgba(255,221,0,0.3);
  transform: rotate(-2deg);
  margin-bottom: 0.5rem;
}
.empty-text { color: rgba(255,255,255,0.3); font-size: 1rem; }

/* Polaroid Wall */
.polaroid-wall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 3rem 2rem;
  padding: 2rem 0;
}

/* Polaroid Card */
.polaroid {
  --rot: 0deg;
  background: var(--color-dark-surface);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.6rem 0.6rem 1.5rem;
  position: relative;
  transform: rotate(var(--rot));
  transition: transform 0.4s cubic-bezier(.16,1,.36,1), box-shadow 0.4s;
  cursor: pointer;
}

.polaroid:hover {
  transform: rotate(0deg) translateY(-8px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  z-index: 10;
}

/* Tape strip */
.polaroid-tape {
  position: absolute;
  top: -10px;
  width: 55px; height: 18px;
  background: rgba(255,221,0,0.55);
  transform: rotate(-2deg);
  left: 50%; translate: -50% 0;
  border-radius: 1px;
}

.tape-left .polaroid-tape  { left: 20%;  transform: rotate(-5deg); }
.tape-center .polaroid-tape { left: 50%; transform: rotate(1deg); }
.tape-right .polaroid-tape  { left: 70%; transform: rotate(4deg); }

/* Photo */
.polaroid-img-wrap {
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
  background: #000;
}
.polaroid-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.3s;
}
.polaroid:hover .polaroid-img { filter: brightness(0.75); }

.polaroid-hover-icon {
  position: absolute;
  inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
  opacity: 0; transition: opacity 0.25s;
}
.polaroid:hover .polaroid-hover-icon { opacity: 1; }

/* Delete Button */
.polaroid-delete {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: #ff4757;
  color: white;
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  z-index: 20;
  opacity: 0;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 #000;
}

.polaroid:hover .polaroid-delete { opacity: 1; }
.polaroid-delete:hover { transform: scale(1.1) rotate(5deg); background: #ff6b81; }

@media (max-width: 768px) {
  .polaroid-delete { opacity: 1; width: 35px; height: 35px; }
}

/* Card body */
.polaroid-body {
  padding: 0.8rem 0.3rem 0;
}

.polaroid-caption {
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.polaroid-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.3rem;
  border-top: 1px solid rgba(255,221,0,0.1);
  padding-top: 0.5rem;
}

.polaroid-ig {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
}

.ig-icon { flex-shrink: 0; }

.polaroid-date {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.25);
}

/* ---- Lightbox ---- */
.lightbox {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.9);
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(8px);
}

.lb-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.15);
  color: var(--color-white);
  font-size: 1.1rem;
  width: 42px; height: 42px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.lb-close:hover { background: var(--color-primary); color: #000; border-color: var(--color-primary); }

.lb-polaroid {
  background: #1c1c1c;
  border: 3px solid var(--color-primary);
  padding: 1rem 1rem 2rem;
  max-width: 560px;
  width: 100%;
  box-shadow: 8px 8px 0 var(--color-primary);
}

.lb-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.lb-body { padding: 1rem 0.5rem 0; }

.lb-caption {
  font-size: 1rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
  margin-bottom: 0.8rem;
}

.lb-foot { display: flex; align-items: center; gap: 1rem; }

.lb-ig {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}
.lb-ig:hover { text-decoration: underline; }

.lb-date { font-size: 0.8rem; color: rgba(255,255,255,0.3); }

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.35s ease; max-height: 600px; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }

.lb-enter-active, .lb-leave-active { transition: opacity 0.25s; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 700px) {
  .up-grid { grid-template-columns: 1fr; }
  .drop-zone { aspect-ratio: 16/9; }
  .polaroid-wall { gap: 2.5rem 1rem; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
}
</style>
