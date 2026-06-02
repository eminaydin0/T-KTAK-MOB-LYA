/** Meta açıklama için düz metin (max ~160 karakter) */
export function truncateMeta(text: string, max = 158): string {
  const plain = text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}

export function siteOrigin(): string {
  const env = import.meta.env.VITE_SITE_URL?.trim()
  if (env) return env.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function absoluteUrl(path: string): string {
  const origin = siteOrigin()
  const p = path.startsWith('/') ? path : `/${path}`
  return origin ? `${origin}${p}` : p
}

export function productAvailabilitySchema(stock: string): string {
  if (stock === 'in_stock') return 'https://schema.org/InStock'
  if (stock === 'pre_order') return 'https://schema.org/PreOrder'
  return 'https://schema.org/LimitedAvailability'
}
