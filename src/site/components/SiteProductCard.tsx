import { Link } from 'react-router-dom'
import { useCart } from '../../core/context/CartContext'
import type { CatalogProduct } from '../../core/catalog/types'
import { STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { productPrimaryImage } from '../../core/catalog/types'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { packagePath, productPath } from '../sitePaths'

type Props = {
  product: CatalogProduct
  categoryName: string
  priceUsd: string
  priceTry?: string
  compact?: boolean
  priority?: boolean
}

/** Mağaza ürün kartı — geliştirilmiş görsel ve hover aksiyonları */
export function SiteProductCard({
  product,
  categoryName,
  priceUsd,
  priceTry,
  compact = true,
  priority = false,
}: Props) {
  const { addProduct } = useCart()
  const stock = STOCK_STATUS_LABEL[product.stockStatus ?? 'unknown']
  const showStock = stock !== 'Belirtilmedi'
  const packageSlug = product.packageSlugs?.[0]

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addProduct(product)
  }

  const media = (
    <>
      <ImageThumb
        src={productPrimaryImage(product)}
        alt={product.name}
        className="site-img-zoom h-full w-full object-cover"
        emptyClassName="flex h-full min-h-[140px] w-full items-center justify-center text-stone-400"
        priority={priority}
      />
      <span className="shop-card-media-overlay" aria-hidden />
      {packageSlug ? (
        <span className="shop-card-badge bg-cotta/95 text-white">Paket</span>
      ) : showStock ? (
        <span className="shop-card-badge">{stock}</span>
      ) : null}
      <div className="shop-card-actions">
        <button type="button" className="site-btn-accent flex-1 py-2 text-xs shadow-lg" onClick={onAdd}>
          Sepete ekle
        </button>
        <Link
          to={productPath(product)}
          className="site-btn-ghost shrink-0 bg-white/95 px-3 py-2 text-xs backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          İncele
        </Link>
      </div>
    </>
  )

  if (!compact) {
    return (
      <article className="shop-card">
        <Link to={productPath(product)} className="shop-card-media">
          {media}
        </Link>
        <div className="shop-card-body">
          <p className="site-caption truncate uppercase tracking-wide">{categoryName}</p>
          <Link to={productPath(product)}>
            <h3 className="shop-card-name mt-0.5">{product.name}</h3>
          </Link>
          <p className="site-body mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed">
            {product.description.split('\n\n')[0]}
          </p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <div>
              <p className="shop-card-price">{priceUsd}</p>
              {priceTry ? <p className="site-caption mt-0.5">{priceTry}</p> : null}
            </div>
            {packageSlug ? (
              <Link to={packagePath(packageSlug)} className="site-btn-text text-xs">
                Seti gör →
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="shop-card">
      <Link to={productPath(product)} className="shop-card-media">
        {media}
      </Link>
      <div className="shop-card-body">
        <div className="flex items-center justify-between gap-2">
          <p className="site-caption truncate">{categoryName}</p>
          {product.packageSlugs && product.packageSlugs.length > 1 ? (
            <span className="shrink-0 text-[10px] font-medium text-cotta">Paket parçası</span>
          ) : null}
        </div>
        <Link to={productPath(product)}>
          <h3 className="shop-card-name mt-0.5">{product.name}</h3>
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="shop-card-price">{priceUsd}</p>
            {priceTry ? <p className="site-caption">{priceTry}</p> : null}
          </div>
          <button
            type="button"
            className="site-btn-icon h-8 w-8 shrink-0 text-base"
            aria-label="Sepete ekle"
            onClick={onAdd}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
