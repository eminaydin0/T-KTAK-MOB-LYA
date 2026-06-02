import { Link } from 'react-router-dom'
import { useCart } from '../../core/context/CartContext'
import type { CatalogProduct } from '../../core/catalog/types'
import { STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { productPrimaryImage } from '../../core/catalog/types'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { productPath } from '../sitePaths'

type Props = {
  product: CatalogProduct
  categoryName: string
  priceUsd: string
  priceTry?: string
  priority?: boolean
}

/** Yatay vitrin rayı — sade ürün kartı (İstikbal tarzı) */
export function HomeRailCard({
  product,
  categoryName,
  priceUsd,
  priceTry,
  priority = false,
}: Props) {
  const { addProduct } = useCart()
  const stock = STOCK_STATUS_LABEL[product.stockStatus ?? 'unknown']
  const showStock = stock === 'Stokta' || stock === 'On siparis'

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addProduct(product)
  }

  return (
    <article className="home-rail-card">
      <Link to={productPath(product)} className="home-rail-card-media group">
        <ImageThumb
          src={productPrimaryImage(product)}
          alt={product.name}
          className="site-img-zoom h-full w-full object-cover"
          emptyClassName="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400"
          priority={priority}
        />
        {showStock ? <span className="home-rail-card-badge">{stock}</span> : null}
      </Link>
      <div className="home-rail-card-body">
        <p className="home-rail-card-cat">{categoryName}</p>
        <Link to={productPath(product)}>
          <h3 className="home-rail-card-name">{product.name}</h3>
        </Link>
        <div className="home-rail-card-foot">
          <div>
            <p className="home-rail-card-price">{priceUsd}</p>
            {priceTry ? <p className="home-rail-card-try">{priceTry}</p> : null}
          </div>
          <button
            type="button"
            className="home-rail-card-add"
            aria-label={`${product.name} sepete ekle`}
            onClick={onAdd}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}
