import { Link } from 'react-router-dom'
import type { CatalogProduct } from '../../core/catalog/types'
import { STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { productPrimaryImage } from '../../core/catalog/types'
import { ImageThumb } from '../../shared/components/ImageThumb'

type Props = {
  product: CatalogProduct
  categoryName: string
  priceUsd: string
  priceTry?: string
}

/** Vitrin kartı — kare görsel, ad | kategori, fiyat display + ghost CTA */
export function SiteProductCard({ product, categoryName, priceUsd, priceTry }: Props) {
  const stock = STOCK_STATUS_LABEL[product.stockStatus ?? 'unknown']

  return (
    <article className="site-card group flex h-full flex-col transition duration-300 hover:shadow-card-hover">
      <Link to={`/urun/${product.id}`} className="relative block aspect-square overflow-hidden bg-surface-muted">
        <ImageThumb
          src={productPrimaryImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          emptyClassName="flex h-full min-h-[180px] w-full items-center justify-center bg-surface-muted text-xs text-stone-400"
        />
        <span className="absolute left-0 top-0 bg-cotta px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
          {stock}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
          <Link to={`/urun/${product.id}`} className="min-w-0 flex-1">
            <h3 className="text-xs font-bold uppercase leading-snug tracking-[0.1em] text-[#333333] transition group-hover:text-cotta md:text-[13px]">
              {product.name}
            </h3>
          </Link>
          <span className="shrink-0 max-w-[42%] truncate text-right text-[10px] font-medium uppercase tracking-[0.1em] text-stone-400">
            {categoryName}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-600">{product.description}</p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-stone-100 pt-4">
          <div>
            <p className="font-display text-xl font-semibold text-cotta tabular-nums md:text-2xl">{priceUsd}</p>
            {priceTry ? (
              <p className="mt-0.5 text-xs tabular-nums text-stone-500">{priceTry}</p>
            ) : (
              <p className="mt-0.5 text-[11px] text-stone-400">TL tahmini…</p>
            )}
          </div>
          <Link to={`/urun/${product.id}`} className="site-btn-ghost shrink-0 px-4 py-2 text-[11px]">
            İncele
          </Link>
        </div>
      </div>
    </article>
  )
}
