const usdFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const tryFmt = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

/** USD liste fiyati + kur ile TL tahmini */
export function formatUsdAndTry(priceUsd: number, usdToTry: number | null) {
  const usd = usdFmt.format(Math.max(0, priceUsd))
  if (usdToTry == null || !Number.isFinite(usdToTry) || usdToTry <= 0) {
    return { usd, tryApprox: null as string | null }
  }
  const tryApprox = tryFmt.format(Math.max(0, priceUsd) * usdToTry)
  return { usd, tryApprox: `≈ ${tryApprox}` }
}
