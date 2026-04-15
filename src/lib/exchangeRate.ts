/**
 * ExchangeRate-API v6 — USD tabanli kur (production’da yaygin kullanilan servis).
 * Endpoint: GET https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD
 * TRY: data.conversion_rates.TRY  →  1 USD = ? TRY
 *
 * Dokumantasyon: https://www.exchangerate-api.com/docs/
 * Ucretsiz planda limit vardir; asagida 1 saat cache ile istek sayisi dusurulur.
 */
const CACHE_MS = 60 * 60 * 1000

let cache: { rate: number; fetchedAt: number } | null = null

type ExchangeRateResponse = {
  result?: 'success' | 'error'
  'error-type'?: string
  conversion_rates?: Record<string, number>
}

export async function fetchUsdToTry(): Promise<number | null> {
  const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY?.trim()
  if (!apiKey) return null

  if (cache && Date.now() - cache.fetchedAt < CACHE_MS) {
    return cache.rate
  }

  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
  )

  if (!res.ok) return null

  const data = (await res.json()) as ExchangeRateResponse

  if (data.result === 'error') return null
  if (data.result !== undefined && data.result !== 'success') return null

  const tryRate = data.conversion_rates?.TRY
  if (typeof tryRate !== 'number' || !Number.isFinite(tryRate) || tryRate <= 0) {
    return null
  }

  cache = { rate: tryRate, fetchedAt: Date.now() }
  return tryRate
}

export function clearUsdTryCache() {
  cache = null
}
