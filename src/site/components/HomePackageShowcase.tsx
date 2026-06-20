import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../../components/motion'
import { cn } from '../../lib/cn'
import { packageBundlePriceUsd } from '../../core/catalog/defaultPackageSeed'
import { PACKAGE_KIND_LABEL } from '../../core/catalog/types'
import { useCatalog } from '../../core/context/CatalogContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { packagePath, packagesPath } from '../sitePaths'
import { SiteSectionHead } from './SiteSectionHead'

const HOME_SET_LIMIT = 3

export function HomePackageShowcase() {
  const { packages, products } = useCatalog()
  const usdToTry = useExchangeRate()

  const rows = useMemo(() => {
    return packages.slice(0, HOME_SET_LIMIT).map((pkg) => {
      const partsCount = pkg.productIds.filter((id) => products.some((p) => p.id === id)).length
      const bundle = packageBundlePriceUsd(pkg.productIds, products, pkg.bundleDiscountPercent)
      return {
        pkg,
        partsCount,
        bundleFmt: formatUsdAndTry(bundle, usdToTry),
      }
    })
  }, [packages, products, usdToTry])

  if (rows.length === 0) return null

  return (
    <Reveal
      as="section"
      id="packages"
      className="site-section scroll-mt-24 py-10 md:py-14"
      aria-labelledby="home-packages-title"
    >
      <SiteSectionHead
        titleId="home-packages-title"
        kicker="Tam set"
        title="Set koleksiyonları"
        lead="Tam sette indirim; parçaları ayrı ayrı da seçebilirsiniz."
        href={packagesPath()}
        linkLabel="Tüm setler →"
        animateTitle
        shinyKicker
      />

      <Stagger as="ul" className="home-set-bento mt-10">
        {rows.map((row, index) => (
          <StaggerItem
            as="li"
            key={row.pkg.id}
            className={cn(index === 0 && rows.length >= 3 && 'home-set-bento-feature')}
          >
            <Link to={packagePath(row.pkg.slug)} className="home-set-card group">
              <div className="home-set-card-media">
                {row.pkg.imageUrl?.trim() ? (
                  <ImageThumb
                    src={row.pkg.imageUrl}
                    alt=""
                    className="site-img-zoom h-full w-full object-cover"
                    emptyClassName="flex h-full w-full items-center justify-center bg-stone-100"
                    priority={index === 0}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-100 font-display text-4xl text-stone-300">
                    {row.pkg.name.slice(0, 1)}
                  </div>
                )}
                <span className="home-set-card-shade" aria-hidden />
                <span className="home-set-card-overlay">
                  <span className="site-set-card-badge">{PACKAGE_KIND_LABEL[row.pkg.kind]}</span>
                  {row.pkg.bundleDiscountPercent > 0 ? (
                    <span className="site-set-card-discount">%{row.pkg.bundleDiscountPercent}</span>
                  ) : null}
                </span>
              </div>
              <div className="home-set-card-body">
                <h3 className="home-set-card-name">{row.pkg.name}</h3>
                <p className="home-set-card-tag">{row.pkg.tagline}</p>
                <div className="home-set-card-foot">
                  <div>
                    <p className="home-set-card-price">{row.bundleFmt.usd}</p>
                    {row.bundleFmt.tryApprox ? (
                      <p className="home-set-card-try">{row.bundleFmt.tryApprox}</p>
                    ) : null}
                  </div>
                  <span className="home-set-card-meta">
                    {row.partsCount} parça
                    <span aria-hidden> →</span>
                  </span>
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  )
}
