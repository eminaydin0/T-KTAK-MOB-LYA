import { Link } from 'react-router-dom'
import { useCart } from '../../core/context/CartContext'
import type { CatalogProduct } from '../../core/catalog/types'
import { STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { productPrimaryImage } from '../../core/catalog/types'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { SpotlightCard } from '../../components/react-bits'
import { motion, useReducedMotion } from '../../lib/motion'
import { cardHover } from '../../lib/motion-variants'
import { cn } from '../../lib/cn'
import { productPath } from '../sitePaths'

type Props = {
  product: CatalogProduct
  categoryName: string
  priceUsd: string
  priceTry?: string
  priority?: boolean
  featured?: boolean
}

/** Yatay vitrin rayı — motion hover ile sade kart */
export function HomeRailCard({
  product,
  categoryName,
  priceUsd,
  priceTry,
  priority = false,
  featured = false,
}: Props) {
  const { addProduct } = useCart()
  const reduced = useReducedMotion()
  const stock = STOCK_STATUS_LABEL[product.stockStatus ?? 'unknown']
  const showStock = stock === 'Stokta' || stock === 'On siparis'

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addProduct(product)
  }

  return (
    <motion.article
      className={cn('home-rail-card', featured && 'home-rail-card--featured')}
      variants={reduced ? undefined : cardHover}
      initial={reduced ? false : 'rest'}
      whileHover={reduced ? undefined : 'hover'}
    >
      <SpotlightCard
        className="home-rail-card-media group block"
        spotlightColor={featured ? 'rgba(180, 110, 80, 0.22)' : 'rgba(120, 113, 108, 0.14)'}
      >
        <Link to={productPath(product)} className="relative block aspect-[4/5]">
          <ImageThumb
            src={productPrimaryImage(product)}
            alt={product.name}
            className="site-img-zoom h-full w-full object-cover"
            emptyClassName="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400"
            priority={priority}
          />
          {showStock ? <span className="home-rail-card-badge">{stock}</span> : null}
        </Link>
      </SpotlightCard>
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
          <motion.button
            type="button"
            className="home-rail-card-add"
            aria-label={`${product.name} sepete ekle`}
            onClick={onAdd}
            whileTap={reduced ? undefined : { scale: 0.9 }}
          >
            +
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
