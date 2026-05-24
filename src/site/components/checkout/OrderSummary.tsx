import { formatUsdAndTry } from '../../../shared/formatPrice'

type Props = {
  totalItems: number
  subtotalUsd: number
  usdToTry: number | null
  compact?: boolean
}

export function OrderSummary({ totalItems, subtotalUsd, usdToTry, compact }: Props) {
  const total = formatUsdAndTry(subtotalUsd, usdToTry)

  return (
    <dl className={`space-y-2 text-sm ${compact ? '' : 'mt-4'}`}>
      <div className="flex justify-between text-stone-600">
        <dt>Ürün adedi</dt>
        <dd className="tabular-nums font-medium text-ink">{totalItems}</dd>
      </div>
      <div className="flex justify-between text-stone-600">
        <dt>Ara toplam</dt>
        <dd className="tabular-nums">{total.usd}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3">
        <dt className="font-medium text-ink">Ödenecek tutar</dt>
        <dd>
          <p className="site-price text-right text-xl">{total.usd}</p>
          {total.tryApprox ? <p className="site-caption text-right">{total.tryApprox}</p> : null}
        </dd>
      </div>
      <p className="site-caption pt-1 text-stone-400">
        KDV ve kargo ücreti ödeme adımında veya teklif sonrası netleşir.
      </p>
    </dl>
  )
}
