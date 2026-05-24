import { useEffect, useState } from 'react'
import { fetchUsdToTry } from '../../lib/exchangeRate'
import { SiteSpinner } from '../../shared/components/SiteSpinner'

const fmt = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function ExchangeRateStrip() {
  const [rate, setRate] = useState<number | null | undefined>(undefined)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!import.meta.env.VITE_EXCHANGERATE_API_KEY?.trim()) {
      setRate(null)
      return
    }

    let cancelled = false
    setError(false)

    fetchUsdToTry()
      .then((r) => {
        if (cancelled) return
        if (r === null) {
          setError(true)
          setRate(null)
        } else {
          setRate(r)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setRate(null)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (rate === undefined) {
    return (
      <div className="site-panel" aria-live="polite">
        <SiteSpinner label="Kur yükleniyor…" />
      </div>
    )
  }

  if (rate === null) {
    if (error) {
      return (
        <div className="border border-cotta/40 bg-cotta/5 px-4 py-2.5 text-xs text-cotta-dark">
          Kur alınamadı. Anahtarı ve ağ bağlantısını kontrol edin.
        </div>
      )
    }
    return (
      <div className="site-panel bg-surface-muted text-stone-600">
        Kur için <code className="bg-white px-1 text-stone-700">VITE_EXCHANGERATE_API_KEY</code> ekleyin (.env)
      </div>
    )
  }

  return (
    <div className="site-panel text-stone-700">
      <span className="font-semibold text-ink">1 USD</span>
      <span className="mx-1.5 text-cotta">≈</span>
      <span className="font-mono tabular-nums text-stone-800">{fmt.format(rate)} TRY</span>
      <span className="site-meta ml-2 normal-case tracking-normal text-stone-500">(USD/TRY)</span>
    </div>
  )
}
