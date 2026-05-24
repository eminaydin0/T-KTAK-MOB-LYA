import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../core/context/CartContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { CheckoutStepper } from '../components/checkout/CheckoutStepper'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { checkoutPath } from '../sitePaths'

export function CartPage() {
  const { items, totalItems, subtotalUsd, updateQty, removeItem } = useCart()
  const usdToTry = useExchangeRate()
  const total = formatUsdAndTry(subtotalUsd, usdToTry)

  useEffect(() => {
    document.title = 'Sepetim'
  }, [])

  return (
    <div className="site-enter pb-12">
      <nav className="site-breadcrumb mb-8" aria-label="Sayfa yolu">
        <Link to="/" className="site-link">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <span className="font-medium text-ink">Sepetim</span>
      </nav>

      <CheckoutStepper current="cart" />

      <h1 className="site-page-title">Sepetim</h1>
      <p className="site-body mt-2 max-w-prose">
        Ürünleri gözden geçirin ve ödeme adımına geçin.
      </p>

      {items.length === 0 ? (
        <div className="site-empty mt-10 bg-white shadow-soft">
          <p className="site-card-title">Sepetiniz boş</p>
          <p className="site-body mt-2">Henüz ürün eklemediniz.</p>
          <Link to="/#catalog" className="site-btn-accent mt-8 px-6">
            Kataloğa git
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <ul className="space-y-4">
            {items.map((line) => {
              const lineTotal = formatUsdAndTry(line.priceUsd * line.qty, usdToTry)
              const unitPrice = formatUsdAndTry(line.priceUsd, usdToTry)
              return (
                <li key={line.productId} className="site-card flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                  <Link
                    to={`/urun/${line.productId}`}
                    className="h-28 w-full shrink-0 overflow-hidden border border-line bg-surface-muted sm:h-24 sm:w-28"
                  >
                    <ImageThumb
                      src={line.imageUrl ?? ''}
                      alt=""
                      className="h-full w-full object-cover"
                      emptyClassName="flex h-full w-full items-center justify-center text-stone-400"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/urun/${line.productId}`}
                      className="site-card-title text-base hover:text-cotta"
                    >
                      {line.productName}
                    </Link>
                    <p className="site-caption mt-1">
                      Birim: {unitPrice.usd}
                      {unitPrice.tryApprox ? ` · ${unitPrice.tryApprox}` : ''}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center rounded border border-line">
                        <button
                          type="button"
                          className="site-btn-icon h-9 w-9 rounded-none border-0"
                          aria-label="Azalt"
                          onClick={() => updateQty(line.productId, line.qty - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-10 text-center text-sm tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          className="site-btn-icon h-9 w-9 rounded-none border-0"
                          aria-label="Artır"
                          onClick={() => updateQty(line.productId, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="site-btn-text text-sm text-stone-500"
                        onClick={() => removeItem(line.productId)}
                      >
                        Kaldır
                      </button>
                      <p className="ml-auto site-price text-lg">{lineTotal.usd}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="site-card p-5 sm:p-6">
              <h2 className="site-card-title">Sipariş özeti</h2>
              <OrderSummary totalItems={totalItems} subtotalUsd={subtotalUsd} usdToTry={usdToTry} />
              <Link to={checkoutPath()} className="site-btn-accent mt-6 block w-full py-3 text-center">
                Ödemeye geç
              </Link>
              <Link to="/#catalog" className="site-btn-ghost mt-3 block w-full py-2.5 text-center">
                Alışverişe devam
              </Link>
              <p className="site-caption mt-4 text-center text-stone-400">
                Güvenli ödeme · {total.usd}
                {total.tryApprox ? ` · ${total.tryApprox}` : ''}
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
