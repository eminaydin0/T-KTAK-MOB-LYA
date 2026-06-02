import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { CatalogPagination } from '../components/CatalogPagination'
import { CatalogToolbar } from '../components/CatalogToolbar'
import { HomeAtelier } from '../components/HomeAtelier'
import { HomeCategoryNav } from '../components/HomeCategoryNav'
import { HomeCinemaHero } from '../components/HomeCinemaHero'
import { HomeCollectionSpotlight } from '../components/HomeCollectionSpotlight'
import { HomeEditorialSpot, pickEditorial } from '../components/HomeEditorialSpot'
import { HomeLookbook } from '../components/HomeLookbook'
import { HomePackageShowcase } from '../components/HomePackageShowcase'
import { HomeProductRails } from '../components/HomeProductRails'
import { HomePromoBar } from '../components/HomePromoBar'
import { SiteProductCard } from '../components/SiteProductCard'
import { SiteSeo } from '../seo/SiteSeo'
import { absoluteUrl, truncateMeta } from '../seo/seoHelpers'
import {
  filterProductsByQuery,
  filterProductsByStock,
  PAGE_SIZE,
  paginate,
  sortProducts,
  type ProductSort,
  type StockFilter,
} from '../catalogFilters'
import { categoryPath, homePath } from '../sitePaths'

const SORT_VALUES: ProductSort[] = ['default', 'price-asc', 'price-desc', 'name']
const STOCK_VALUES: StockFilter[] = ['all', 'in_stock', 'pre_order', 'unknown']

function parseSort(raw: string | null): ProductSort {
  return SORT_VALUES.includes(raw as ProductSort) ? (raw as ProductSort) : 'default'
}

function parseStock(raw: string | null): StockFilter {
  return STOCK_VALUES.includes(raw as StockFilter) ? (raw as StockFilter) : 'all'
}

export function HomePage() {
  const { data: site, resolvedContent: content } = useSite()
  const { carousel } = site
  const { categories, products, packages } = useCatalog()
  const usdToTry = useExchangeRate()
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const catSlug = searchParams.get('cat')
  const sort = parseSort(searchParams.get('sort'))
  const stock = parseStock(searchParams.get('stock'))
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const [searchDraft, setSearchDraft] = useState(query)
  const [catalogOpen, setCatalogOpen] = useState(Boolean(query || catSlug))

  useEffect(() => setSearchDraft(query), [query])
  useEffect(() => {
    if (query || catSlug) setCatalogOpen(true)
  }, [query, catSlug])

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

  const activeCategory = useMemo(
    () => (catSlug ? categories.find((c) => c.slug === catSlug) : undefined),
    [categories, catSlug]
  )

  const categoryShowcase = useMemo(() => {
    const counts = new Map<number, number>()
    for (const p of products) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)
    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      count: counts.get(c.id) ?? 0,
      imageUrl: c.imageUrl,
      seoDescription: c.seoDescription,
    }))
  }, [categories, products])

  const nameOf = useCallback(
    (cid: number) => categories.find((x) => x.id === cid)?.name ?? '',
    [categories]
  )

  const editorial = useMemo(() => pickEditorial(products), [products])

  const spotlightPackage = useMemo(() => {
    if (packages.length === 0) return null
    return [...packages].sort((a, b) => b.bundleDiscountPercent - a.bundleDiscountPercent)[0]!
  }, [packages])

  const filteredProducts = useMemo(() => {
    let list = products
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory.id)
    list = filterProductsByQuery(list, query)
    list = filterProductsByStock(list, stock)
    return sortProducts(list, sort)
  }, [products, activeCategory, query, stock, sort])

  const paged = useMemo(() => paginate(filteredProducts, page, PAGE_SIZE), [filteredProducts, page])

  const buildHref = useCallback(
    (p: number) => {
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      if (catSlug) params.set('cat', catSlug)
      if (sort !== 'default') params.set('sort', sort)
      if (stock !== 'all') params.set('stock', stock)
      if (p > 1) params.set('page', String(p))
      const qs = params.toString()
      return `${homePath()}${qs ? `?${qs}` : ''}#catalog`
    },
    [query, catSlug, sort, stock]
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
        urlTemplate: `${absoluteUrl(homePath())}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const hasFilters = Boolean(query.trim() || catSlug || sort !== 'default' || stock !== 'all')

  return (
    <>
      <SiteSeo title={seoTitle} description={seoDescription} path={homePath()} jsonLd={jsonLd} />

      <div className="home-v2 -mt-10 sm:-mt-14">
        <HomeCinemaHero
          siteName={settings.siteName || 'EMIN Mobilya'}
          title={content.heroTitle}
          fallbackSubtitle={content.heroSubtitle}
          slides={carousel}
        />

        <HomePromoBar message={settings.siteTagline} />

        <HomeCategoryNav categories={categoryShowcase} />

        <HomeProductRails products={products} categoryNameOf={nameOf} />

        <HomeLookbook categories={categoryShowcase} title={content.categorySectionTitle} />

        {spotlightPackage ? (
          <HomeCollectionSpotlight pkg={spotlightPackage} products={products} />
        ) : null}

        <HomeEditorialSpot
          hero={editorial.hero}
          side={editorial.side}
          categoryNameOf={nameOf}
        />

        <HomePackageShowcase />

        <HomeAtelier />

        <section id="catalog" className="home-catalog-v2 site-enter mx-auto max-w-site scroll-mt-24 px-5 sm:px-8" aria-labelledby="catalog-heading">
          <button
            type="button"
            className="home-catalog-trigger"
            aria-expanded={catalogOpen}
            onClick={() => setCatalogOpen((o) => !o)}
          >
            <span className="home-catalog-trigger-label" id="catalog-heading">
              {content.catalogSectionTitle}
            </span>
            <span className="home-catalog-trigger-count">{paged.total} parça</span>
            <span className={`home-catalog-trigger-icon ${catalogOpen ? 'home-catalog-trigger-icon--open' : ''}`} aria-hidden>
              +
            </span>
          </button>

          {catalogOpen ? (
            <div className="home-catalog-panel">
              <p className="home-catalog-lead">{content.filterSectionTitle}</p>

              <form
                className="home-catalog-search"
                role="search"
                onSubmit={(e) => {
                  e.preventDefault()
                  patchParams({ q: searchDraft.trim() || null, page: null }, true)
                }}
              >
                <label className="sr-only" htmlFor="catalog-search">
                  Ürün ara
                </label>
                <input
                  id="catalog-search"
                  className="home-catalog-search-input"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="Ne arıyorsunuz?"
                />
              </form>

              {categories.length > 0 ? (
                <nav className="home-catalog-chips" aria-label="Kategoriler">
                  <button
                    type="button"
                    className={`home-chip ${!catSlug ? 'home-chip--on' : ''}`}
                    onClick={() => patchParams({ cat: null, page: null })}
                  >
                    Tümü
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`home-chip ${catSlug === c.slug ? 'home-chip--on' : ''}`}
                      onClick={() =>
                        patchParams({ cat: catSlug === c.slug ? null : c.slug, page: null })
                      }
                    >
                      {c.name}
                    </button>
                  ))}
                  {activeCategory ? (
                    <Link to={categoryPath(activeCategory)} className="home-catalog-more">
                      Kategori sayfası ↗
                    </Link>
                  ) : null}
                </nav>
              ) : null}

              <div className="home-catalog-bar">
                <CatalogToolbar
                  sort={sort}
                  stock={stock}
                  total={paged.total}
                  onSortChange={(v) => patchParams({ sort: v === 'default' ? null : v, page: null })}
                  onStockChange={(v) => patchParams({ stock: v === 'all' ? null : v, page: null })}
                />
                {hasFilters ? (
                  <button
                    type="button"
                    className="site-btn-text text-xs"
                    onClick={() => {
                      setSearchDraft('')
                      patchParams({ q: null, cat: null, sort: null, stock: null, page: null })
                    }}
                  >
                    Sıfırla
                  </button>
                ) : null}
              </div>

              {paged.items.length === 0 ? (
                <div className="home-catalog-empty">
                  <p className="text-lg font-light">Eşleşme yok</p>
                  <p className="mt-2 text-sm text-stone-500">Başka bir filtre deneyin.</p>
                </div>
              ) : (
                <>
                  <div className="home-product-grid home-product-grid--mosaic">
                    {paged.items.map((product, index) => {
                      const price = formatUsdAndTry(product.priceUsd, usdToTry)
                      const featured = index % 7 === 0
                      return (
                        <div
                          key={product.id}
                          className={featured ? 'home-grid-feature' : undefined}
                        >
                          <SiteProductCard
                            product={product}
                            categoryName={nameOf(product.categoryId)}
                            priceUsd={price.usd}
                            priceTry={price.tryApprox ?? undefined}
                            priority={index < 8}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <CatalogPagination page={paged.page} totalPages={paged.totalPages} buildHref={buildHref} />
                </>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </>
  )
}
