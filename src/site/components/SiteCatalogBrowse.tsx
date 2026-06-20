import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useCatalog } from '../../core/context/CatalogContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { carouselHeroSrc } from '../../lib/carouselImage'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { CatalogPagination } from './CatalogPagination'
import { ProductCardGrid, ProductCardGridItem } from './ProductCardGrid'
import { SiteProductCard } from './SiteProductCard'
import { SiteSectionHead } from './SiteSectionHead'
import {
  filterProductsByQuery,
  filterProductsByStock,
  PAGE_SIZE,
  paginate,
  PRODUCT_SORT_LABEL,
  sortProducts,
  STOCK_FILTER_LABEL,
  type ProductSort,
  type StockFilter,
} from '../catalogFilters'
import { categoryPath } from '../sitePaths'

const SORT_VALUES: ProductSort[] = ['default', 'price-asc', 'price-desc', 'name']
const STOCK_VALUES: StockFilter[] = ['all', 'in_stock', 'pre_order', 'unknown']

function parseSort(raw: string | null): ProductSort {
  return SORT_VALUES.includes(raw as ProductSort) ? (raw as ProductSort) : 'default'
}

function parseStock(raw: string | null): StockFilter {
  return STOCK_VALUES.includes(raw as StockFilter) ? (raw as StockFilter) : 'all'
}

type SearchParamsLike = {
  get: (key: string) => string | null
}

type Props = {
  title: string
  lead?: string
  titleId?: string
  showHeader?: boolean
  variant?: 'default' | 'minimal'
  searchParams: SearchParamsLike
  patchParams: (patch: Record<string, string | null>, replace?: boolean) => void
  buildPageHref?: (page: number) => string
  className?: string
}

export function SiteCatalogBrowse({
  title,
  lead,
  titleId = 'catalog-heading',
  showHeader = true,
  variant = 'default',
  searchParams,
  patchParams,
  buildPageHref,
  className,
}: Props) {
  const { categories, products } = useCatalog()
  const usdToTry = useExchangeRate()
  const resultsRef = useRef<HTMLDivElement>(null)

  const query = searchParams.get('q') ?? ''
  const catSlug = searchParams.get('cat')
  const sort = parseSort(searchParams.get('sort'))
  const stock = parseStock(searchParams.get('stock'))
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const [searchDraft, setSearchDraft] = useState(query)

  useEffect(() => setSearchDraft(query), [query])

  const categoryCounts = useMemo(() => {
    const counts = new Map<number, number>()
    for (const p of products) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)
    return counts
  }, [products])

  const activeCategory = useMemo(
    () => (catSlug ? categories.find((c) => c.slug === catSlug) : undefined),
    [categories, catSlug]
  )

  const nameOf = useCallback(
    (cid: number) => categories.find((x) => x.id === cid)?.name ?? '',
    [categories]
  )

  const filteredProducts = useMemo(() => {
    let list = products
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory.id)
    list = filterProductsByQuery(list, query)
    list = filterProductsByStock(list, stock)
    return sortProducts(list, sort)
  }, [products, activeCategory, query, stock, sort])

  const paged = useMemo(() => paginate(filteredProducts, page, PAGE_SIZE), [filteredProducts, page])
  const hasFilters = Boolean(query.trim() || catSlug || sort !== 'default' || stock !== 'all')

  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const updateParams = useCallback(
    (patch: Record<string, string | null>, replace = false, scroll = false) => {
      patchParams(patch, replace)
      if (scroll) scrollToResults()
    },
    [patchParams, scrollToResults]
  )

  const resetFilters = useCallback(() => {
    setSearchDraft('')
    updateParams({ q: null, cat: null, sort: null, stock: null, page: null }, true, true)
  }, [updateParams])

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateParams({ page: nextPage > 1 ? String(nextPage) : null }, true, true)
    },
    [updateParams]
  )

  return (
    <section
      id="catalog"
      className={cn('catalog-browse scroll-mt-28', variant === 'minimal' && 'catalog-browse--minimal', className)}
      aria-labelledby={showHeader ? titleId : undefined}
    >
      <div className="catalog-browse-shell">
        {showHeader ? (
          <SiteSectionHead
            titleId={titleId}
            title={title}
            lead={lead ?? `${products.length} parça — filtreleyin, karşılaştırın, teklif alın.`}
            animateTitle={variant === 'minimal'}
          />
        ) : null}

        <div className="catalog-browse-panel">
          <form
            className="catalog-browse-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              updateParams({ q: searchDraft.trim() || null, page: null }, true, true)
            }}
          >
            <label className="sr-only" htmlFor="catalog-browse-search">
              Ürün ara
            </label>
            <input
              id="catalog-browse-search"
              className="catalog-browse-search-input"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Koltuk, masa, dolap…"
            />
            <button type="submit" className="catalog-browse-search-btn site-btn-accent">
              Ara
            </button>
          </form>

          {categories.length > 0 ? (
            <nav className="catalog-browse-cats" aria-label="Kategoriler" data-lenis-prevent>
              <button
                type="button"
                className={cn('catalog-browse-cat', !catSlug && 'catalog-browse-cat--on')}
                onClick={() => updateParams({ cat: null, page: null }, true, true)}
              >
                Tümü
                <span className="catalog-browse-cat-count">{products.length}</span>
              </button>
              {categories.map((c) => {
                const thumb = variant === 'minimal' && c.imageUrl?.trim()
                return (
                <button
                  key={c.id}
                  type="button"
                  className={cn('catalog-browse-cat', catSlug === c.slug && 'catalog-browse-cat--on', thumb && 'catalog-browse-cat--visual')}
                  onClick={() =>
                    updateParams({ cat: catSlug === c.slug ? null : c.slug, page: null }, true, true)
                  }
                >
                  {thumb ? (
                    <span className="catalog-browse-cat-thumb">
                      <ImageThumb
                        src={carouselHeroSrc(c.imageUrl!)}
                        alt=""
                        className="h-full w-full object-cover"
                        emptyClassName="h-full w-full bg-stone-200"
                      />
                    </span>
                  ) : null}
                  <span className="catalog-browse-cat-label">{c.name}</span>
                  <span className="catalog-browse-cat-count">{categoryCounts.get(c.id) ?? 0}</span>
                </button>
              )})}
            </nav>
          ) : null}

          {hasFilters ? (
            <div className="catalog-browse-active">
              {query.trim() ? (
                <button
                  type="button"
                  className="catalog-browse-active-chip"
                  onClick={() => updateParams({ q: null, page: null }, true, true)}
                >
                  “{query.trim()}” ✕
                </button>
              ) : null}
              {activeCategory ? (
                <button
                  type="button"
                  className="catalog-browse-active-chip"
                  onClick={() => updateParams({ cat: null, page: null }, true, true)}
                >
                  {activeCategory.name} ✕
                </button>
              ) : null}
              {sort !== 'default' ? (
                <button
                  type="button"
                  className="catalog-browse-active-chip"
                  onClick={() => updateParams({ sort: null, page: null }, true)}
                >
                  {PRODUCT_SORT_LABEL[sort]} ✕
                </button>
              ) : null}
              {stock !== 'all' ? (
                <button
                  type="button"
                  className="catalog-browse-active-chip"
                  onClick={() => updateParams({ stock: null, page: null }, true)}
                >
                  {STOCK_FILTER_LABEL[stock]} ✕
                </button>
              ) : null}
              <button type="button" className="catalog-browse-active-reset" onClick={resetFilters}>
                Tümünü sıfırla
              </button>
            </div>
          ) : null}

          <div className="catalog-browse-controls">
            <p className="catalog-browse-total">
              <span className="catalog-browse-total-num">{paged.total}</span> ürün
            </p>
            <div className="catalog-browse-filters">
              <label className="catalog-browse-filter">
                <span className="catalog-browse-filter-label">Sırala</span>
                <select
                  className="catalog-browse-select"
                  value={sort}
                  onChange={(e) =>
                    updateParams({ sort: e.target.value === 'default' ? null : e.target.value, page: null }, true)
                  }
                >
                  {(Object.keys(PRODUCT_SORT_LABEL) as ProductSort[]).map((key) => (
                    <option key={key} value={key}>
                      {PRODUCT_SORT_LABEL[key]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="catalog-browse-filter">
                <span className="catalog-browse-filter-label">Stok</span>
                <select
                  className="catalog-browse-select"
                  value={stock}
                  onChange={(e) =>
                    updateParams({ stock: e.target.value === 'all' ? null : e.target.value, page: null }, true)
                  }
                >
                  {(Object.keys(STOCK_FILTER_LABEL) as StockFilter[]).map((key) => (
                    <option key={key} value={key}>
                      {STOCK_FILTER_LABEL[key]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {activeCategory ? (
            <Link to={categoryPath(activeCategory)} className="catalog-browse-category-link">
              {activeCategory.name} kategori sayfası ↗
            </Link>
          ) : null}

          <div ref={resultsRef} className="catalog-browse-results">
            {paged.items.length === 0 ? (
              <div className="catalog-browse-empty">
                <p className="catalog-browse-empty-title">Eşleşme yok</p>
                <p className="catalog-browse-empty-lead">Farklı bir arama veya kategori deneyin.</p>
                {hasFilters ? (
                  <button type="button" className="site-btn-ghost mt-4 px-5 py-2 text-sm" onClick={resetFilters}>
                    Filtreleri temizle
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <ProductCardGrid mosaic>
                  {paged.items.map((product, index) => {
                    const price = formatUsdAndTry(product.priceUsd, usdToTry)
                    const featured = index % 7 === 0
                    return (
                      <ProductCardGridItem
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
                      </ProductCardGridItem>
                    )
                  })}
                </ProductCardGrid>
                <CatalogPagination
                  page={paged.page}
                  totalPages={paged.totalPages}
                  buildHref={buildPageHref}
                  onPageChange={buildPageHref ? undefined : handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { parseSort, parseStock, SORT_VALUES, STOCK_VALUES }
