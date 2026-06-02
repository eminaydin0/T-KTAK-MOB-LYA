import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  packageBundlePriceUsd,
  packagePartsTotalUsd,
} from '../../core/catalog/defaultPackageSeed'
import { PACKAGE_KIND_LABEL, STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { useCart } from '../../core/context/CartContext'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { SiteProductCard } from '../components/SiteProductCard'
import { SiteSeo } from '../seo/SiteSeo'
import { absoluteUrl, truncateMeta } from '../seo/seoHelpers'
import { homePath, packagePath, packagesAnchor } from '../sitePaths'

export function PackagePage() {
  const { packageSlug } = useParams<{ packageSlug: string }>()
  const { packages, products, categories } = useCatalog()
  const { addPackageProducts } = useCart()
  const { data } = useSite()
  const usdToTry = useExchangeRate()
  const siteName = data.settings.siteName || 'EMIN Mobilya'

  const pkg = useMemo(
    () => packages.find((p) => p.slug === packageSlug),
    [packages, packageSlug]
  )

  const parts = useMemo(() => {
    if (!pkg) return []
    return pkg.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p != null)
  }, [pkg, products])

  const partsTotal = pkg ? packagePartsTotalUsd(pkg.productIds, products) : 0
  const bundleTotal = pkg
    ? packageBundlePriceUsd(pkg.productIds, products, pkg.bundleDiscountPercent)
    : 0
  const partsPrice = formatUsdAndTry(partsTotal, usdToTry)
  const bundlePrice = formatUsdAndTry(bundleTotal, usdToTry)
  const savings = partsTotal - bundleTotal

  if (!pkg) {
    return <Navigate to={packagesAnchor()} replace />
  }

  const seoDescription = truncateMeta(`${pkg.tagline}. ${pkg.description}`)
  const path = packagePath(pkg.slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.name,
    description: seoDescription,
    image: pkg.imageUrl,
    url: absoluteUrl(path),
    brand: { '@type': 'Brand', name: siteName },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: bundleTotal,
      highPrice: partsTotal,
      offerCount: parts.length,
    },
  }

  const nameOf = (cid: number) => categories.find((c) => c.id === cid)?.name ?? ''

  return (
    <>
      <SiteSeo
        title={`${pkg.name} | ${PACKAGE_KIND_LABEL[pkg.kind]} Paketi | ${siteName}`}
        description={seoDescription}
        path={path}
        image={pkg.imageUrl}
        type="product"
        jsonLd={jsonLd}
      />

    <div className="site-enter pb-20">
      <nav className="site-breadcrumb mb-6" aria-label="Sayfa yolu">
        <Link to={homePath()} className="site-link">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <Link to="/#packages" className="site-link">
          Paketler
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <span className="font-medium text-ink">{pkg.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="shop-package-card-media relative min-h-[240px] overflow-hidden rounded-site-lg border border-line lg:min-h-[320px]">
          {pkg.imageUrl?.trim() ? (
            <ImageThumb
              src={pkg.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              emptyClassName="flex h-full min-h-[240px] w-full items-center justify-center"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-cotta">
            {PACKAGE_KIND_LABEL[pkg.kind]}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="site-overline text-cotta">Koleksiyon paketi</p>
          <h1 className="site-page-title mt-2">{pkg.name}</h1>
          <p className="site-body mt-3 text-base text-stone-600">{pkg.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="site-tag">{parts.length} parça</span>
            <span className="site-tag">Parça parça satış</span>
            {pkg.bundleDiscountPercent > 0 ? (
              <span className="site-tag bg-cotta/10 font-medium text-cotta">
                Tam sette %{pkg.bundleDiscountPercent} indirim
              </span>
            ) : null}
          </div>

          <div className="site-card mt-6 border border-line p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="site-caption">Parça parça toplam</p>
                <p className="text-lg font-semibold tabular-nums text-stone-400 line-through">{partsPrice.usd}</p>
              </div>
              <div>
                <p className="site-caption">Tam set fiyatı</p>
                <p className="shop-card-price text-2xl">{bundlePrice.usd}</p>
                {bundlePrice.tryApprox ? (
                  <p className="site-caption mt-0.5">{bundlePrice.tryApprox}</p>
                ) : null}
                {savings > 0 ? (
                  <p className="mt-1 text-xs font-medium text-emerald-700">
                    {formatUsdAndTry(savings, usdToTry).usd} tasarruf
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="site-btn-accent px-6 py-3"
                onClick={() =>
                  addPackageProducts(parts, {
                    bundleDiscountPercent: pkg.bundleDiscountPercent,
                    packageName: pkg.name,
                  })
                }
                disabled={parts.length === 0}
              >
                Tüm seti sepete ekle
              </button>
              <a href="#paket-parcalari" className="site-btn-ghost px-6 py-3">
                Parçaları seç
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 max-w-prose">
        {pkg.description.split(/\n\n+/).map((para) => (
          <p key={para.slice(0, 40)} className="site-body mb-4 text-base leading-relaxed text-stone-700">
            {para.trim()}
          </p>
        ))}
      </section>

      <section id="paket-parcalari" className="mt-14 scroll-mt-24 border-t border-line pt-12">
        <h2 className="site-section-title">Paket parçaları</h2>
        <span className="site-section-rule" aria-hidden />
        <p className="site-body mt-3 max-w-prose">
          Her parçayı tek başına sepete ekleyebilir veya yukarıdaki butonla tüm seti birlikte sipariş edebilirsiniz.
        </p>

        {parts.length === 0 ? (
          <div className="site-empty mt-8">Bu pakete henüz ürün bağlanmamış.</div>
        ) : (
          <div className="home-product-grid mt-8">
            {parts.map((product) => {
              const price = formatUsdAndTry(product.priceUsd, usdToTry)
              return (
                <SiteProductCard
                  key={product.id}
                  product={product}
                  categoryName={nameOf(product.categoryId)}
                  priceUsd={price.usd}
                  priceTry={price.tryApprox ?? undefined}
                />
              )
            })}
          </div>
        )}

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-line/80 bg-surface-muted/50 px-4 py-3 text-sm">
              <span className="min-w-0 truncate font-medium text-ink">{p.name}</span>
              <span className="shrink-0 text-xs text-stone-500">{STOCK_STATUS_LABEL[p.stockStatus ?? 'unknown']}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
    </>
  )
}
