import { useCallback } from 'react'
import { defaultLookbookSlides } from '../../core/site/defaultSiteSeed'
import { useSearchParams } from 'react-router-dom'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { HomeCategoryFilm } from '../components/HomeCategoryFilm'
import { HomeAtelier } from '../components/HomeAtelier'
import { HomeCinemaHero } from '../components/HomeCinemaHero'
import { HomeLookbook } from '../components/HomeLookbook'
import { HomePackageShowcase } from '../components/HomePackageShowcase'
import { HomeProductRails } from '../components/HomeProductRails'
import { SiteCatalogBrowse } from '../components/SiteCatalogBrowse'
import { SiteSeo } from '../seo/SiteSeo'
import { absoluteUrl, truncateMeta } from '../seo/seoHelpers'
import { homePath } from '../sitePaths'

export function HomePage() {
  const { data: site, resolvedContent: content } = useSite()
  const { carousel } = site
  const { categories, products } = useCatalog()
  const [searchParams, setSearchParams] = useSearchParams()

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

  const nameOf = useCallback(
    (cid: number) => categories.find((x) => x.id === cid)?.name ?? '',
    [categories]
  )

  const settings = site.settings
  const seoTitle = settings.seoTitle || `${settings.siteName} — Mobilya & ev dekorasyonu`
  const seoDescription = truncateMeta(
    settings.seoDescription ||
      `${content.heroSubtitle} ${products.length} ürün, ${categories.length} kategori.`
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    description: seoDescription,
    url: absoluteUrl(homePath()),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(homePath())}?q={search_term_string}#catalog`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <SiteSeo title={seoTitle} description={seoDescription} path={homePath()} jsonLd={jsonLd} />

      <div className="home-v2">
        <HomeCinemaHero
          siteName={settings.siteName || 'EMIN Mobilya'}
          title={content.heroTitle}
          fallbackSubtitle={content.heroSubtitle}
          slides={carousel}
        />

        <HomeCategoryFilm />

        <HomeProductRails products={products} categoryNameOf={nameOf} />

        <SiteCatalogBrowse
          variant="minimal"
          className="site-section pb-8 pt-2 md:pb-12 md:pt-4"
          title={content.catalogSectionTitle}
          lead={content.filterSectionTitle}
          searchParams={searchParams}
          patchParams={patchParams}
        />

        <HomeLookbook
          slides={defaultLookbookSlides}
          title={content.categorySectionTitle}
          subtitle={content.categorySectionSubtitle}
        />

        <HomePackageShowcase />

        <HomeAtelier />
      </div>
    </>
  )
}
