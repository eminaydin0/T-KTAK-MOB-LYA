import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../core/context/CartContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { cartPath, checkoutPath } from '../sitePaths'

export function CartPreviewModal() {
  const { items, previewOpen, closePreview, lastAddedName, totalItems, subtotalUsd, updateQty, removeItem } =
    useCart()
  const usdToTry = useExchangeRate()
  const total = formatUsdAndTry(subtotalUsd, usdToTry)

  useEffect(() => {
    if (!previewOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [previewOpen, closePreview])

  if (!previewOpen) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-[1px]"
        aria-label="Sepeti kapat"
        onClick={closePreview}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-preview-title"
        className="fixed inset-x-0 bottom-0 z-[90] mx-auto flex max-h-[min(85dvh,640px)] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-h-[min(80dvh,560px)] sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <p className="site-overline text-cotta">Sepet</p>
            <h2 id="cart-preview-title" className="site-card-title text-lg">
              Sepetimi görüntüle
            </h2>
            {lastAddedName ? (
              <p className="site-caption mt-1 text-stone-500">
                <span className="font-medium text-ink">{lastAddedName}</span> sepete eklendi
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="site-btn-ghost shrink-0 px-3 py-1 text-sm normal-case tracking-normal"
            onClick={closePreview}
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {items.length === 0 ? (
            <div className="site-empty bg-surface-muted">
              <p className="site-card-title">Sepetiniz boş</p>
              <p className="site-body mt-2">Katalogdan ürün ekleyerek başlayın.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((line) => {
                const price = formatUsdAndTry(line.priceUsd, usdToTry)
                return (
                  <li key={line.productId} className="flex gap-3 border border-line bg-white p-3">
                    <Link
                      to={`/urun/${line.productId}`}
                      className="h-16 w-16 shrink-0 overflow-hidden border border-line bg-surface-muted"
                      onClick={closePreview}
                    >
                      <ImageThumb
                        src={line.imageUrl ?? ''}
                        alt=""
                        className="h-full w-full object-cover"
                        emptyClassName="flex h-full w-full items-center justify-center text-xs text-stone-400"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/urun/${line.productId}`}
                        className="line-clamp-2 text-sm font-medium text-ink hover:text-cotta"
                        onClick={closePreview}
                      >
                        {line.productName}
                      </Link>
                      <p className="site-caption mt-1">{price.usd}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <p className="site-caption">Adet</p>
                        <div className="flex items-center rounded border border-line">
                          <button
                            type="button"
                            className="site-btn-icon h-8 w-8 rounded-none border-0"
                            aria-label="Azalt"
                            onClick={() => updateQty(line.productId, line.qty - 1)}
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm tabular-nums">{line.qty}</span>
                          <button
                            type="button"
                            className="site-btn-icon h-8 w-8 rounded-none border-0"
                            aria-label="Artır"
                            onClick={() => updateQty(line.productId, line.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="site-btn-text ml-auto text-xs text-stone-500"
                          onClick={() => removeItem(line.productId)}
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-5 py-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="site-caption">Toplam ({totalItems} ürün)</p>
              <p className="site-price text-xl">{total.usd}</p>
              {total.tryApprox ? <p className="site-caption mt-0.5">{total.tryApprox}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={checkoutPath()} className="site-btn-accent px-5 py-2.5" onClick={closePreview}>
                Ödemeye geç
              </Link>
              <Link
                to={cartPath()}
                className="site-btn-ghost px-4 py-2.5 text-sm"
                onClick={closePreview}
              >
                Sepet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
