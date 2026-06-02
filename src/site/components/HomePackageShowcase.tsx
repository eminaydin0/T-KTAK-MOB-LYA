import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../core/context/CatalogContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { packageBundlePriceUsd } from '../../core/catalog/defaultPackageSeed'
import { packagePath } from '../sitePaths'
import { ImageThumb } from '../../shared/components/ImageThumb'

export function HomePackageShowcase() {
  const { packages, products } = useCatalog()
  const usdToTry = useExchangeRate()

  const rows = useMemo(() => {
    return packages.map((pkg) => {
      const parts = pkg.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p != null)
      const bundle = packageBundlePriceUsd(pkg.productIds, products, pkg.bundleDiscountPercent)
      return {
        pkg,
        partsCount: parts.length,
        bundleFmt: formatUsdAndTry(bundle, usdToTry),
        savings: pkg.bundleDiscountPercent,
      }
    })
  }, [packages, products, usdToTry])

  if (rows.length === 0) return null

  return (
    <section id="packages" className="home-packages home-breakout site-enter scroll-mt-24" aria-labelledby="home-packages-title">
      <div className="home-packages-inner">
        <header className="home-packages-head">
          <h2 id="home-packages-title" className="home-packages-title">
            Setlerde indirim,
            <br />
            parçada özgürlük
          </h2>
          <p className="home-packages-lead">
            Tam paketi tek tıkla sepete ekleyin — indirim otomatik uygulanır. İstediğiniz parçayı ayrıca da alabilirsiniz.
          </p>
        </header>

        <ul className="home-packages-list">
          {rows.map((row, index) => (
            <li key={row.pkg.id}>
              <Link to={packagePath(row.pkg.slug)} className="home-package-row group">
                <span className="home-package-num">{String(index + 1).padStart(2, '0')}</span>
                <div className="home-package-thumb">
                  {row.pkg.imageUrl?.trim() ? (
                    <ImageThumb
                      src={row.pkg.imageUrl}
                      alt=""
                      className="site-img-zoom h-full w-full object-cover"
                      emptyClassName="flex h-full w-full items-center justify-center bg-stone-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-stone-700 text-stone-500">
                      Set
                    </div>
                  )}
                </div>
                <div className="home-package-body">
                  <p className="home-package-name">{row.pkg.name}</p>
                  <p className="home-package-tag">{row.pkg.tagline}</p>
                  <p className="home-package-meta">
                    {row.partsCount} parça
                    {row.savings > 0 ? ` · %${row.savings} set indirimi` : ''}
                  </p>
                </div>
                <div className="home-package-price">
                  <p className="text-lg font-light tabular-nums text-white">{row.bundleFmt.usd}</p>
                  {row.bundleFmt.tryApprox ? (
                    <p className="text-xs text-stone-400">{row.bundleFmt.tryApprox}</p>
                  ) : null}
                  <span className="home-package-arrow" aria-hidden>
                    ↗
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
