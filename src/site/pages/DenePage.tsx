import { Link } from 'react-router-dom'
import { productPrimaryImage } from '../../core/catalog/types'
import { useCart } from '../../core/context/CartContext'
import { useCatalog } from '../../core/context/CatalogContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { checkoutPath } from '../sitePaths'

export function DenePage() {
  const { products } = useCatalog()
  const { addProduct, openPreview, totalItems, items } = useCart()
  const usdToTry = useExchangeRate()

  const samples = products.slice(0, 6)

  return (
    <div className="site-enter pb-16">
      <nav className="site-breadcrumb mb-8" aria-label="Sayfa yolu">
        <Link to="/" className="site-link">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <span className="font-medium text-ink">Dene</span>
      </nav>

      <p className="site-overline text-cotta">Demo</p>
      <h1 className="site-page-title">Sepeti dene</h1>
      <p className="site-body mt-3 max-w-prose">
        Bu sayfa sepet akışını test etmek içindir. Ürün ekleyin, önizleme modalını açın veya tam sepet
        sayfasına gidin.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className="site-btn-accent px-6 py-3" onClick={() => openPreview()}>
          Sepetimi görüntüle
        </button>
        <Link to={checkoutPath()} className="site-btn-ghost px-6 py-3">
          Ödeme sayfası ({totalItems})
        </Link>
        <Link to="/#catalog" className="site-btn-text px-4 py-3">
          Katalog
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="site-card-title">Örnek ürünler</h2>
        <span className="site-section-rule" aria-hidden />
        <p className="site-body mt-2">Sepete ekle butonuna basınca önizleme modalı açılır.</p>

        {samples.length === 0 ? (
          <div className="site-empty mt-6">Katalogda henüz ürün yok.</div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {samples.map((product) => {
              const price = formatUsdAndTry(product.priceUsd, usdToTry)
              const inCart = items.find((l) => l.productId === product.id)
              return (
                <li key={product.id} className="site-card overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden border-b border-line bg-surface-muted">
                    <ImageThumb
                      src={productPrimaryImage(product)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      emptyClassName="flex h-full w-full items-center justify-center text-stone-400"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-ink">{product.name}</h3>
                    <p className="site-price mt-1">{price.usd}</p>
                    {inCart ? (
                      <p className="site-caption mt-1 text-cotta">Sepette: {inCart.qty} adet</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="site-btn-accent flex-1 py-2.5"
                        onClick={() => addProduct(product)}
                      >
                        Sepete ekle
                      </button>
                      <Link to={`/urun/${product.id}`} className="site-btn-ghost px-4 py-2.5">
                        Detay
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="site-card-title">Nasıl çalışır?</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-stone-600">
          <li>Ürün detayında veya burada &quot;Sepete ekle&quot;ye tıklayın.</li>
          <li>&quot;Sepetimi görüntüle&quot; modalında ürünleri kontrol edin, ardından ödeme sayfasına geçin.</li>
          <li>Ödeme yöntemini seçip siparişi tamamlayın — kart, havale veya kapıda ödeme.</li>
        </ol>
      </section>
    </div>
  )
}
