import { Link } from 'react-router-dom'
import type { CatalogPackage } from '../../core/catalog/types'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { packageBundlePriceUsd } from '../../core/catalog/defaultPackageSeed'
import type { CatalogProduct } from '../../core/catalog/types'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { catalogAnchor, packagePath } from '../sitePaths'

type Props = {
  pkg: CatalogPackage
  products: CatalogProduct[]
}

export function HomeCollectionSpotlight({ pkg, products }: Props) {
  const usdToTry = useExchangeRate()
  const bundle = packageBundlePriceUsd(pkg.productIds, products, pkg.bundleDiscountPercent)
  const price = formatUsdAndTry(bundle, usdToTry)
  const hasImg = Boolean(pkg.imageUrl?.trim())

  return (
    <section className="home-spotlight home-breakout site-enter" aria-labelledby="home-spotlight-title">
      <div className="home-spotlight-inner">
        <div className="home-spotlight-media">
          {hasImg ? (
            <ImageThumb
              src={pkg.imageUrl!}
              alt={pkg.name}
              className="site-img-zoom h-full w-full object-cover"
              emptyClassName="flex h-full w-full items-center justify-center bg-stone-200"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
              <span className="text-6xl font-light text-white/70">{pkg.name.slice(0, 1)}</span>
            </div>
          )}
        </div>
        <div className="home-spotlight-copy">
          <p className="home-spotlight-eyebrow">Özel koleksiyon</p>
          <h2 id="home-spotlight-title" className="home-spotlight-title">
            {pkg.name}
          </h2>
          <p className="home-spotlight-lead">{pkg.tagline || pkg.description.split('\n\n')[0]}</p>
          <div className="home-spotlight-meta">
            <p className="home-spotlight-price">{price.usd}</p>
            {price.tryApprox ? <p className="home-spotlight-try">{price.tryApprox}</p> : null}
            {pkg.bundleDiscountPercent > 0 ? (
              <span className="home-spotlight-badge">Sette %{pkg.bundleDiscountPercent} indirim</span>
            ) : null}
          </div>
          <div className="home-spotlight-actions">
            <Link to={packagePath(pkg.slug)} className="home-spotlight-cta home-spotlight-cta--solid">
              Koleksiyonu incele
            </Link>
            <Link to={catalogAnchor()} className="home-spotlight-cta home-spotlight-cta--ghost">
              Tüm parçalar
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
