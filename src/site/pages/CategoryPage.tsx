import { useCallback, useMemo } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { Reveal } from '../../components/motion'
import {
  categorySeoDescription,
  findCategoryByParam,
  isNumericRouteParam,
} from '../../core/catalog/catalogSlugs'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { CatalogPagination } from '../components/CatalogPagination'
import { CatalogToolbar } from '../components/CatalogToolbar'
import { ProductCardGrid, ProductCardGridItem } from '../components/ProductCardGrid'
import { SiteProductCard } from '../components/SiteProductCard'
import { SiteSeo } from '../seo/SiteSeo'
import { absoluteUrl, truncateMeta } from '../seo/seoHelpers'
import {
  filterProductsByStock,
  PAGE_SIZE,
  paginate,
  sortProducts,
  type ProductSort,
  type StockFilter,
} from '../catalogFilters'
import { catalogAnchor, categoryPath, homePath } from '../sitePaths'

const SORT_VALUES: ProductSort[] = ['default', 'price-asc', 'price-desc', 'name']
const STOCK_VALUES: StockFilter[] = ['all', 'in_stock', 'pre_order', 'unknown']

function parseSort(raw: string | null): ProductSort {
  return SORT_VALUES.includes(raw as ProductSort) ? (raw as ProductSort) : 'default'
}

function parseStock(raw: string | null): StockFilter {
  return STOCK_VALUES.includes(raw as StockFilter) ? (raw as StockFilter) : 'all'
}

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories, products } = useCatalog()
  const { data } = useSite()
  const usdToTry = useExchangeRate()
  const siteName = data.settings.siteName || 'EMIN Mobilya'

  const sort = parseSort(searchParams.get('sort'))
  const stock = parseStock(searchParams.get('stock'))
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)

  const category = useMemo(
    () => findCategoryByParam(categories, categorySlug),
    [categories, categorySlug]
  )

  const list = useMemo(() => {
    if (!category) return []
    let items = products.filter((p) => p.categoryId === category.id)
    items = filterProductsByStock(items, stock)
    items = sortProducts(items, sort)
    return items
  }, [category, products, stock, sort])

  const paged = useMemo(() => paginate(list, page, PAGE_SIZE), [list, page])

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(patch)) {
          if (value == null || value === '') next.delete(key)
          else next.set(key, value)
        }
        return next
      })
    },
    [setSearchParams]
  )

  const buildHref = useCallback(
    (p: number) => {
      if (!category) return homePath()
      const params = new URLSearchParams()
      if (sort !== 'default') params.set('sort', sort)
      if (stock !== 'all') params.set('stock', stock)
      if (p > 1) params.set('page', String(p))
      const qs = params.toString()
      return `${categoryPath(category)}${qs ? `?${qs}` : ''}`
    },
    [category, sort, stock]
  )

  if (category && isNumericRouteParam(categorySlug) && category.slug !== categorySlug) {
    return <Navigate to={categoryPath(category)} replace />
  }

  if (!category) {
    return (
      <>
        <SiteSeo
          title={`Kategori bulunamadı | ${siteName}`}
          description="Aradığınız kategori kaldırılmış veya bağlantı geçersiz olabilir."
          path={categorySlug ? `/kategori/${categorySlug}` : undefined}
          noindex
        />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="site-empty bg-white shadow-soft">
            <p className="site-card-title text-lg">Kategori bulunamadı</p>
            <p className="site-body mt-2">Bağlantı geçersiz veya kategori kaldırılmış olabilir.</p>
            <Link to={homePath()} className="site-btn-accent mt-8 px-6">
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </>
    )
  }

  const seoDescription = truncateMeta(categorySeoDescription(category, list.length))
  const pageTitle = `${category.name} Mobilya Koleksiyonu | ${siteName}`
  const path = categoryPath(category)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — ${siteName}`,
    description: seoDescription,
    url: absoluteUrl(path),
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: absoluteUrl(homePath()),
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: paged.items.slice(0, 12).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: absoluteUrl(`/urun/${p.slug}`),
      })),
    },
  }

  return (
    <>
      <SiteSeo
        title={pageTitle}
        description={seoDescription}
        path={path}
        image={category.imageUrl}
        jsonLd={jsonLd}
      />

      <div className="pb-16">
        <nav className="site-breadcrumb mb-8" aria-label="Sayfa yolu">
          <Link to={homePath()} className="site-link">
            Ana sayfa
          </Link>
          <span className="text-stone-300" aria-hidden>
            /
          </span>
          <Link to={catalogAnchor()} className="site-link">
            Katalog
          </Link>
          <span className="text-stone-300" aria-hidden>
            /
          </span>
          <span className="font-medium text-ink">{category.name}</span>
        </nav>

        <Reveal className="site-card overflow-hidden">
          {category.imageUrl?.trim() ? (
            <div className="relative h-44 sm:h-52">
              <img
                src={category.imageUrl}
                alt={`${category.name} koleksiyonu`}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-24 bg-surface-muted sm:h-28" aria-hidden />
          )}

          <div className="px-6 py-8 sm:px-10">
            <h1 className="site-page-title">{category.name}</h1>
            <p className="site-body mt-3 max-w-2xl normal-case text-stone-600">{seoDescription}</p>
            <Link to={catalogAnchor()} className="site-btn-ghost mt-6">
              Tüm katalog
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-12" delay={0.08}>
          <CatalogToolbar
            sort={sort}
            stock={stock}
            total={paged.total}
            onSortChange={(v) => patchParams({ sort: v === 'default' ? null : v, page: null })}
            onStockChange={(v) => patchParams({ stock: v === 'all' ? null : v, page: null })}
            className="mb-6"
          />
          <h2 className="sr-only">{category.name} ürünleri</h2>
          {paged.items.length === 0 ? (
            <div className="site-empty">
              <p className="font-medium text-ink">Bu filtrelerle ürün bulunamadı</p>
              <button
                type="button"
                className="site-btn-accent mt-6"
                onClick={() => setSearchParams({})}
              >
                Filtreleri temizle
              </button>
            </div>
          ) : (
            <>
              <ProductCardGrid>
                {paged.items.map((product) => {
                  const price = formatUsdAndTry(product.priceUsd, usdToTry)
                  return (
                    <ProductCardGridItem key={product.id}>
                      <SiteProductCard
                        product={product}
                        categoryName={category.name}
                        priceUsd={price.usd}
                        priceTry={price.tryApprox ?? undefined}
                        priority={false}
                      />
                    </ProductCardGridItem>
                  )
                })}
              </ProductCardGrid>
              <CatalogPagination page={paged.page} totalPages={paged.totalPages} buildHref={buildHref} />
            </>
          )}
        </Reveal>

        {categories.filter((c) => c.id !== category.id).length > 0 ? (
          <Reveal as="section" className="site-card-muted mt-14 px-5 py-6 sm:px-8" delay={0.12}>
            <h2 className="site-overline text-ink">Diğer koleksiyonlar</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories
                .filter((c) => c.id !== category.id)
                .map((c) => (
                  <Link key={c.id} to={categoryPath(c)} className="site-chip px-4">
                    {c.name}
                  </Link>
                ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </>
  )
}
