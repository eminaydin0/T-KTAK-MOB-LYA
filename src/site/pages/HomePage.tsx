import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { HomeCarousel } from '../components/HomeCarousel'
import { HomeCategoryBento } from '../components/HomeCategoryBento'
import { HomePackageShowcase } from '../components/HomePackageShowcase'
import { SiteProductCard } from '../components/SiteProductCard'
import { categoryPath } from '../sitePaths'

export function HomePage() {
  const { data: site, resolvedContent: content } = useSite()
  const { carousel } = site
  const { categories, products } = useCatalog()
  const usdToTry = useExchangeRate()
  const [query, setQuery] = useState('')

  const categoryShowcase = useMemo(() => {
    const counts = new Map<number, number>()
    for (const p of products) {
      counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)
    }
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      count: counts.get(c.id) ?? 0,
      imageUrl: c.imageUrl,
    }))
  }, [categories, products])

  const flatProducts = useMemo(() => {
    const q = query.trim().toLowerCase()
    const nameOf = (cid: number) => categories.find((x) => x.id === cid)?.name ?? ''
    return products
      .filter((p) => {
        if (!q) return true
        const inName = p.name.toLowerCase().includes(q)
        const inDesc = p.description.toLowerCase().includes(q)
        const inAnswers = Object.values(p.categoryAnswers ?? {}).some((v) => v.toLowerCase().includes(q))
        return inName || inDesc || inAnswers
      })
      .map((p) => ({ product: p, categoryName: nameOf(p.categoryId) }))
  }, [products, categories, query])

  const hasCarousel = carousel.length > 0

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero — görsel + sade metin */}
      <section className="site-enter" aria-label="Giriş">
        <div className="-mx-5 overflow-hidden sm:-mx-8 sm:rounded-site-lg">
          {hasCarousel ? (
            <HomeCarousel slides={carousel} variant="immersive" />
          ) : (
            <div className="flex aspect-[2.2/1] min-h-[200px] items-center justify-center bg-surface-muted">
              <p className="site-body">Kampanya görseli ekleyin</p>
            </div>
          )}
        </div>

        <div className="home-hero-copy mt-10 md:mt-12">
          <p className="site-eyebrow text-cotta">Yeni sezon</p>
          <h1 className="site-page-title mt-2">{content.heroTitle}</h1>
          <p className="site-body mx-auto mt-3 max-w-md">{content.heroSubtitle}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#catalog" className="site-btn-accent">
              Koleksiyonu keşfet
            </a>
            <Link to="/iletisim" className="site-btn-ghost">
              İletişim
            </Link>
          </div>
        </div>
      </section>

      <HomeCategoryBento
        categories={categoryShowcase}
        title={content.categorySectionTitle}
        subtitle={content.categorySectionSubtitle}
      />

      <HomePackageShowcase />

      {/* Katalog */}
      <section id="catalog" className="site-enter scroll-mt-24" aria-labelledby="catalog-heading">
        <div className="text-center">
          <h2 id="catalog-heading" className="site-section-title">
            {content.catalogSectionTitle}
          </h2>
          <p className="site-body mx-auto mt-2 max-w-md">{content.filterSectionTitle}</p>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <label className="sr-only" htmlFor="catalog-search">
            Ürün ara
          </label>
          <input
            id="catalog-search"
            className="site-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün veya koleksiyon ara…"
          />
        </div>

        {categories.length > 0 ? (
          <nav
            className="mt-6 flex justify-start gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center [&::-webkit-scrollbar]:hidden"
            aria-label="Kategoriler"
          >
            <a href="#catalog" className="site-pill site-pill--active">
              Tümü · {products.length}
            </a>
            {categories.map((c) => {
              const count = products.filter((p) => p.categoryId === c.id).length
              return (
                <Link key={c.id} to={categoryPath(c.id)} className="site-pill">
                  {c.name}
                  <span className="ml-1 text-stone-400">({count})</span>
                </Link>
              )
            })}
          </nav>
        ) : null}

        <div className="mt-10">
          <p className="site-caption mb-6 text-center sm:text-right">
            {flatProducts.length} ürün
          </p>

          {flatProducts.length === 0 ? (
            <div className="site-empty">
              <p className="font-medium text-ink">Eşleşen ürün bulunamadı</p>
              <p className="site-body mt-2">Farklı bir arama deneyin.</p>
            </div>
          ) : (
            <div className="home-product-grid">
              {flatProducts.map(({ product, categoryName }, index) => {
                const price = formatUsdAndTry(product.priceUsd, usdToTry)
                return (
                  <SiteProductCard
                    key={product.id}
                    product={product}
                    categoryName={categoryName}
                    priceUsd={price.usd}
                    priceTry={price.tryApprox ?? undefined}
                    priority={index < 8}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
