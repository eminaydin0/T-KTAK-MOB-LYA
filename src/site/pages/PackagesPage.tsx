import { useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Reveal } from '../../components/motion'
import { cn } from '../../lib/cn'
import { packageBundlePriceUsd } from '../../core/catalog/defaultPackageSeed'
import {
  PACKAGE_KIND_LABEL,
  PACKAGE_KIND_ORDER,
} from '../../core/catalog/types'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { SitePageHero } from '../components/SitePageHero'
import { SiteSeo } from '../seo/SiteSeo'
import { absoluteUrl, truncateMeta } from '../seo/seoHelpers'
import { contactPath, homePath, packagePath, packagesPath } from '../sitePaths'

const KIND_VALUES = ['all', ...PACKAGE_KIND_ORDER] as const
type KindFilter = (typeof KIND_VALUES)[number]

function parseKind(raw: string | null): KindFilter {
  return KIND_VALUES.includes(raw as KindFilter) ? (raw as KindFilter) : 'all'
}

export function PackagesPage() {
  const { packages, products } = useCatalog()
  const { data } = useSite()
  const usdToTry = useExchangeRate()
  const [searchParams, setSearchParams] = useSearchParams()
  const siteName = data.settings.siteName || 'EMIN Mobilya'

  const kind = parseKind(searchParams.get('kind'))

  const patchKind = useCallback(
    (next: KindFilter) => {
      setSearchParams(next === 'all' ? {} : { kind: next }, { replace: true })
    },
    [setSearchParams]
  )

  const rows = useMemo(() => {
    return packages
      .filter((pkg) => kind === 'all' || pkg.kind === kind)
      .map((pkg) => {
        const partsCount = pkg.productIds.filter((id) => products.some((p) => p.id === id)).length
        const bundle = packageBundlePriceUsd(pkg.productIds, products, pkg.bundleDiscountPercent)
        const fmt = formatUsdAndTry(bundle, usdToTry)
        return { pkg, partsCount, fmt }
      })
  }, [packages, products, usdToTry, kind])

  const seoDescription = truncateMeta(
    `Düğün seti, oturma odası grubu, yatak odası seti ve daha fazlası. ${packages.length} hazır paket; parça parça veya tam sette indirim.`
  )

  return (
    <>
      <SiteSeo
        title={`Set koleksiyonları | ${siteName}`}
        description={seoDescription}
        path={packagesPath()}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `Set koleksiyonları — ${siteName}`,
          description: seoDescription,
          url: absoluteUrl(packagesPath()),
        }}
      />

      <div className="site-page">
        <Reveal>
          <nav className="site-breadcrumb mb-8" aria-label="Sayfa yolu">
            <Link to={homePath()} className="site-link">
              Ana sayfa
            </Link>
            <span className="text-stone-300" aria-hidden>
              /
            </span>
            <span className="font-medium text-ink">Setler</span>
          </nav>

          <SitePageHero
            kicker="Tam set, akıllı fiyat"
            title="Set koleksiyonları"
            lead="Düğün setinden oturma odası grubuna — her parçayı ayrı alabilir veya tam sette indirim kazanabilirsiniz. Showroom'da bir arada görün."
          >
            <Link to={contactPath()} className="site-btn-ghost mt-6 inline-flex px-6">
              Set için randevu al
            </Link>
          </SitePageHero>
        </Reveal>

        <Reveal className="mt-10" delay={0.06}>
          <div className="site-tabs" role="tablist" aria-label="Set türü">
            <button
              type="button"
              role="tab"
              aria-selected={kind === 'all'}
              className={cn('site-tab', kind === 'all' && 'site-tab--on')}
              onClick={() => patchKind('all')}
            >
              Tümü
              <span className="site-tab-count">{packages.length}</span>
            </button>
            {PACKAGE_KIND_ORDER.map((k) => {
              const count = packages.filter((p) => p.kind === k).length
              if (count === 0) return null
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={kind === k}
                  className={cn('site-tab', kind === k && 'site-tab--on')}
                  onClick={() => patchKind(k)}
                >
                  {PACKAGE_KIND_LABEL[k]}
                  <span className="site-tab-count">{count}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {rows.length === 0 ? (
          <div className="site-empty mt-12">
            <p className="font-medium text-ink">Bu türde henüz set yok</p>
            <button type="button" className="site-btn-text mt-4" onClick={() => patchKind('all')}>
              Tüm setlere dön
            </button>
          </div>
        ) : (
          <ul className="site-set-grid mt-8">
            {rows.map(({ pkg, partsCount, fmt }, index) => (
              <Reveal as="li" key={pkg.id} delay={index * 0.04} y={12}>
                <Link to={packagePath(pkg.slug)} className="site-set-card group">
                  <div className="site-set-card-media">
                    {pkg.imageUrl?.trim() ? (
                      <ImageThumb
                        src={pkg.imageUrl}
                        alt=""
                        className="site-img-zoom h-full w-full object-cover"
                        emptyClassName="flex h-full w-full items-center justify-center bg-stone-100"
                        priority={index < 3}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-stone-100 font-display text-4xl text-stone-300">
                        {pkg.name.slice(0, 1)}
                      </div>
                    )}
                    <span className="site-set-card-badge">{PACKAGE_KIND_LABEL[pkg.kind]}</span>
                    {pkg.bundleDiscountPercent > 0 ? (
                      <span className="site-set-card-discount">%{pkg.bundleDiscountPercent}</span>
                    ) : null}
                  </div>
                  <div className="site-set-card-body">
                    <h2 className="site-set-card-name">{pkg.name}</h2>
                    <p className="site-set-card-tag">{pkg.tagline}</p>
                    <div className="site-set-card-foot">
                      <div>
                        <p className="site-set-card-price">{fmt.usd}</p>
                        {fmt.tryApprox ? <p className="site-set-card-try">{fmt.tryApprox}</p> : null}
                      </div>
                      <span className="site-set-card-meta">
                        {partsCount} parça
                        <span aria-hidden> →</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
