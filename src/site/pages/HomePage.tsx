import { useCallback } from 'react'
import { defaultLookbookSlides } from '../../core/site/defaultSiteSeed'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { HomeCategoryFilm } from '../components/HomeCategoryFilm'
import { HomeAtelier } from '../components/HomeAtelier'
import { HomeCinemaHero } from '../components/HomeCinemaHero'
import { HomeLookbook } from '../components/HomeLookbook'
import { HomePackageShowcase } from '../components/HomePackageShowcase'
import { HomeProductRails } from '../components/HomeProductRails'
// SiteCatalogBrowse removed from homepage — catalog remains on catalog page only
import { SiteSeo } from '../seo/SiteSeo'
import { absoluteUrl, truncateMeta } from '../seo/seoHelpers'
import { homePath } from '../sitePaths'

export function HomePage() {
  const { data: site, resolvedContent: content } = useSite()
  const { carousel } = site
  const { categories, products } = useCatalog()

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

        {/* Catalog preview removed from homepage; full catalog lives on /katalog */}

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
