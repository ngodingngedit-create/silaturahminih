const API_URL = import.meta.env.VITE_API_URL || 'https://api.kolektix.com'

export async function fetchEventBySlug(slug) {
  const res = await fetch(`${API_URL}/api/event/${slug}`)
  if (!res.ok) throw new Error(`Failed to fetch event ${slug}`)
  return res.json()
}

const fmtRp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID')

function ticketWindow(t) {
  const start = t.ticket_date ? new Date(`${t.ticket_date}T${t.starting_time || '00:00:00'}`) : null
  const end = t.ticket_end ? new Date(`${t.ticket_end}T${t.ending_time || '23:59:59'}`) : null
  return { start, end }
}

function fmtSale(dateStr, timeStr) {
  if (!dateStr) return ''
  const time = (timeStr || '').slice(0, 5)
  const d = new Date(`${dateStr}T00:00:00`)
  const date = isNaN(d) ? dateStr : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return time && time !== '00:00' ? `${date}, ${time}` : date
}

function mapTicket(t, now = new Date(), eventId = 0) {
  const id = String(t.id)
  const price = Number(t.price || 0)
  const { start, end } = ticketWindow(t)
  const soldout = Number(t.is_soldout) === 1
  const notStarted = start && now < start
  const ended = end && now > end
  const available = !soldout && !notStarted && !ended && t.is_show !== 0
  return {
    id,
    ticketId: Number(t.id) || 0,
    eventId: Number(eventId) || 0,
    eventSessionId: t.event_session_id ?? null,
    name: String(t.name || '').toUpperCase(),
    category: t.ticket_category || '',
    price,
    priceFormatted: fmtRp(price),
    fee: Number(t.ticket_fee || 0),
    desc: t.description || '',
    endsAt: t.ticket_end || '',
    startsAt: t.ticket_date || '',
    saleStartLabel: fmtSale(t.ticket_date, t.starting_time),
    saleEndLabel: fmtSale(t.ticket_end, t.ending_time),
    maxBuy: t.max_buy_ticket != null ? Number(t.max_buy_ticket) : null,
    available,
    status: soldout || ended ? 'HABIS' : notStarted ? 'SEGERA' : 'PENJUALAN BERLANGSUNG',
    badgeClass: soldout || ended ? 'badge-soon' : notStarted ? 'badge-soon' : 'badge-available',
    soldout: soldout || ended,
    upcoming: notStarted && !soldout && !ended,
  }
}

export async function createTransaction(payload) {
  const res = await fetch(`${API_URL}/api/transaction-without-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let msg = `Transaction failed (${res.status})`
    try {
      const err = await res.json()
      msg = err?.message || err?.msg || msg
    } catch { /* ponytail: keep default status message */ }
    throw new Error(msg)
  }
  return res.json()
}

export function mapEventPayload(payload) {
  const d = payload?.data || {}
  const now = new Date()
  const tickets = (d.has_event_ticket || []).map((t) => mapTicket(t, now, d.id))
  return {
    id: d.id,
    name: d.name || '',
    slug: d.slug || '',
    imageUrl: d.image_url || '',
    thumbnailUrl: d.thumbnail_url || '',
    tag: d.tag || '',
    startDate: d.start_date || '',
    endDate: d.end_date || '',
    startTime: d.start_time || '',
    endTime: d.end_time || '',
    zoneTime: d.zone_time || 'WIB',
    locationName: d.location_name || '',
    locationCity: d.location_city || '',
    locationAddress: d.location_address || '',
    locationMap: d.location_map || '',
    description: (d.description || '')
      .replace(/17 April 2026/gi, '10 April 2027')
      .replace(/17 April 2027/gi, '10 April 2027')
      .replace(
        /mempererat tali kasih dan persaudaraan/gi,
        '<strong class="desc-highlight">$&</strong>',
      ),
    termCondition: (d.term_condition || '')
      .replace(/Kolektix\.com/gi, 'Silaturahmi.live')
      .replace(
        /Setiap tiket hanya berlaku untuk satu orang dan hanya dapat digunakan sesuai dengan ketentuan yang berlaku pada acara\.?/gi,
        'Setiap tiket hanya berlaku untuk satu orang dan hanya bisa digunakan satu kali scan ketika acara',
      ),
    maxBuyTicket: d.max_buy_ticket != null ? Number(d.max_buy_ticket) : null,
    maxBuyEmail: d.max_buy_email != null ? Number(d.max_buy_email) : null,
    maxUseVoucher: d.max_use_voucher != null ? Number(d.max_use_voucher) : null,
    startingPrice: Number(d.starting_price || 0),
    organizer: d.has_creator?.name || d.created_by || '',
    organizerImage: d.has_creator?.image_url || '',
    tickets,
  }
}
