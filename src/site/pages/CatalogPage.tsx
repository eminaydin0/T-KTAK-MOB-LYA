import { useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Reveal } from '../../components/motion'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { SiteCatalogBrowse } from '../components/SiteCatalogBrowse'
import { SitePageHero } from '../components/SitePageHero'
import { SiteSeo } from '../seo/SiteSeo'
import { absoluteUrl, truncateMeta } from '../seo/seoHelpers'
import { catalogPath, homePath, packagesPath } from '../sitePaths'

export function CatalogPage() {
  const { categories, products } = useCatalog()
  const { data, resolvedContent } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()
  const siteName = data.settings.siteName || 'EMIN Mobilya'

  const patchParams = useCallback(
    (patch: Record<string, string | null>, replace = false) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            if (value == null || value === '') next.delete(key)
            else next.set(key, value)
          }
          return next
        },
        { replace }
      )
    },
    [setSearchParams]
  )

  const seoDescription = truncateMeta(
    `${products.length} parça, ${categories.length} kategori. ${resolvedContent.filterSectionTitle}`
  )

  return (
    <>
      <SiteSeo
        title={`Katalog | ${siteName}`}
        description={seoDescription}
        path={catalogPath()}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `Ürün kataloğu — ${siteName}`,
          description: seoDescription,
          url: absoluteUrl(catalogPath()),
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
            <span className="font-medium text-ink">Katalog</span>
          </nav>

          <SitePageHero
            title={resolvedContent.catalogSectionTitle}
            lead={resolvedContent.filterSectionTitle}
          >
            <Link to={packagesPath()} className="site-btn-ghost mt-6 inline-flex px-5 py-2.5 text-sm">
              Setleri gör →
            </Link>
          </SitePageHero>
        </Reveal>

        <SiteCatalogBrowse
          className="mt-10 px-0"
          title={resolvedContent.catalogSectionTitle}
          titleId="catalog-page-heading"
          showHeader={false}
          searchParams={searchParams}
          patchParams={patchParams}
        />
      </div>
    </>
  )
}
