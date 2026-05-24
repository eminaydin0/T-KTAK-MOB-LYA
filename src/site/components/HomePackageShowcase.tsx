import { useMemo } from 'react'
import { useCatalog } from '../../core/context/CatalogContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import {
  packageBundlePriceUsd,
  packagePartsTotalUsd,
} from '../../core/catalog/defaultPackageSeed'
import { SitePackageCard } from './SitePackageCard'

export function HomePackageShowcase() {
  const { packages, products } = useCatalog()
  const usdToTry = useExchangeRate()

  const rows = useMemo(() => {
    return packages.map((pkg) => {
      const parts = pkg.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p != null)
      const total = packagePartsTotalUsd(pkg.productIds, products)
      const bundle = packageBundlePriceUsd(pkg.productIds, products, pkg.bundleDiscountPercent)
      const totalFmt = formatUsdAndTry(total, usdToTry)
      const bundleFmt = formatUsdAndTry(bundle, usdToTry)
      return {
        pkg,
        partsCount: parts.length,
        totalFmt,
        bundleFmt,
        savingsLabel: pkg.bundleDiscountPercent > 0 ? `%${pkg.bundleDiscountPercent} set indirimi` : undefined,
      }
    })
  }, [packages, products, usdToTry])

  if (rows.length === 0) return null

  return (
    <section id="packages" className="site-enter scroll-mt-24" aria-labelledby="home-packages-title">
      <div className="text-center">
        <p className="site-eyebrow text-cotta">Koleksiyon paketleri</p>
        <h2 id="home-packages-title" className="site-section-title mt-2">
          Tam set veya parça parça
        </h2>
        <p className="site-body mx-auto mt-3 max-w-lg">
          Düğün, oturma odası ve yatak odası paketlerimizin tüm parçalarını ayrı ayrı da satın alabilirsiniz.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {rows.map((row) => (
          <SitePackageCard
            key={row.pkg.id}
            pkg={row.pkg}
            partsCount={row.partsCount}
            partsTotalUsd={row.totalFmt.usd}
            bundlePriceUsd={row.bundleFmt.usd}
            bundleTry={row.bundleFmt.tryApprox ?? undefined}
            savingsLabel={row.savingsLabel}
          />
        ))}
      </div>
    </section>
  )
}
