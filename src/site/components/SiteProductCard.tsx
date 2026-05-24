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
  compact?: boolean
  priority?: boolean
}

/** Mağaza ürün kartı — görsel odaklı, sade metin */
export function SiteProductCard({
  product,
  categoryName,
  priceUsd,
  priceTry,
  compact = true,
  priority = false,
}: Props) {
  const stock = STOCK_STATUS_LABEL[product.stockStatus ?? 'unknown']
  const showStock = stock !== 'Belirtilmedi'

  if (!compact) {
    return (
      <article className="shop-card group">
        <Link to={`/urun/${product.id}`} className="shop-card-media">
          <ImageThumb
            src={productPrimaryImage(product)}
            alt={product.name}
            className="site-img-zoom h-full w-full"
            emptyClassName="flex h-full min-h-[200px] w-full items-center justify-center"
            priority={priority}
          />
          {showStock ? (
            <span className="site-badge-soft absolute left-2.5 top-2.5">{stock}</span>
          ) : null}
        </Link>
        <div className="shop-card-body">
          <p className="site-caption truncate">{categoryName}</p>
          <Link to={`/urun/${product.id}`}>
            <h3 className="shop-card-name mt-0.5">{product.name}</h3>
          </Link>
          <p className="site-body mt-2 line-clamp-2 flex-1 text-xs">{product.description}</p>
          <div className="mt-3">
            <p className="shop-card-price text-base">{priceUsd}</p>
            {priceTry ? <p className="site-caption mt-0.5">{priceTry}</p> : null}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="shop-card group">
      <Link to={`/urun/${product.id}`} className="shop-card-media">
        <ImageThumb
          src={productPrimaryImage(product)}
          alt={product.name}
          className="site-img-zoom h-full w-full"
          emptyClassName="flex h-full min-h-[140px] w-full items-center justify-center"
          priority={priority}
        />
        {showStock ? (
          <span className="site-badge-soft absolute left-2 top-2">{stock}</span>
        ) : null}
      </Link>
      <div className="shop-card-body">
        <p className="site-caption truncate">{categoryName}</p>
        <Link to={`/urun/${product.id}`}>
          <h3 className="shop-card-name mt-0.5">{product.name}</h3>
        </Link>
        <p className="shop-card-price">{priceUsd}</p>
        {priceTry ? <p className="site-caption mt-0.5">{priceTry}</p> : null}
      </div>
    </article>
  )
}
