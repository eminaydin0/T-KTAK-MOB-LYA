import type { CartLine } from './types'

export const CART_STORAGE_KEY = 'emin-dashboard-cart-v1'

function normalizeLine(raw: unknown): CartLine | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const productId = typeof r.productId === 'number' ? r.productId : NaN
  const productName = typeof r.productName === 'string' ? r.productName.trim() : ''
  const priceUsd =
    typeof r.priceUsd === 'number' && Number.isFinite(r.priceUsd) && r.priceUsd >= 0 ? r.priceUsd : 0
  const qty = typeof r.qty === 'number' ? Math.max(1, Math.floor(r.qty)) : 1
  const imageUrlRaw = r.imageUrl
  const imageUrl =
    typeof imageUrlRaw === 'string' && imageUrlRaw.trim() !== '' ? imageUrlRaw.trim() : undefined
  if (!Number.isFinite(productId) || !productName) return null
  return { productId, productName, priceUsd, qty, ...(imageUrl ? { imageUrl } : {}) }
}

export function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeLine).filter((l): l is CartLine => l !== null)
  } catch {
    return []
  }
}

export function saveCart(lines: CartLine[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
}
