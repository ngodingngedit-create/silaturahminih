export const EVENT_PATH = '/event/silaturahmi-volume-3'
export const EVENT_SLUG = 'silaturahmi-volume-3'

export function isTicketPagePath(path) {
  const p = path || ''
  return p === '/tickets' || p === '/personal-info' || p.startsWith('/event/')
}
