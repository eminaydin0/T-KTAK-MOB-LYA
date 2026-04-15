import { useEffect, useState } from 'react'
import { fetchUsdToTry } from './exchangeRate'

/** 1 USD = ? TRY (ExchangeRate-API, lib icinde cache li) */
export function useExchangeRate() {
  const [usdToTry, setUsdToTry] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchUsdToTry().then((r) => {
      if (!cancelled) setUsdToTry(r)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return usdToTry
}
