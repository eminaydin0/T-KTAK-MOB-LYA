import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { productPrimaryImage } from '../../core/catalog/types'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { products as demoProducts } from '../../data'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { HomeCarousel } from '../components/HomeCarousel'
import { SiteCategoryShowcase } from '../components/SiteCategoryShowcase'
import { SiteProductCard } from '../components/SiteProductCard'
import { categoryPath } from '../sitePaths'

const tryFmt = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })

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

  const featured = demoProducts.slice(0, 2)

  const heroProduct = products[0]
  const heroCategoryName = heroProduct
    ? (categories.find((x) => x.id === heroProduct.categoryId)?.name ?? '')
    : ''
  const heroPrice = heroProduct ? formatUsdAndTry(heroProduct.priceUsd, usdToTry) : null

  return (
    <div className="space-y-16 md:space-y-24">
      <section
        aria-label="Öne çıkan"
        className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-stretch lg:gap-10"
      >
        <aside className="order-2 flex min-h-0 flex-col gap-5 lg:order-1">
          {heroProduct && heroPrice ? (
            <article className="site-card flex min-h-0 flex-1 flex-col">
              <Link
                to={`/urun/${heroProduct.id}`}
                className="relative block aspect-[5/4] max-h-52 overflow-hidden bg-surface-muted sm:max-h-60 lg:aspect-[4/5] lg:max-h-[min(22rem,42vh)]"
              >
                <ImageThumb
                  src={productPrimaryImage(heroProduct)}
                  alt={heroProduct.name}
                  className="h-full w-full object-cover"
                  emptyClassName="flex h-full min-h-[160px] w-full items-center justify-center text-stone-400"
                />
                <span className="absolute left-0 top-0 bg-cotta px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  Öne çıkan
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="site-overline text-stone-400">{heroCategoryName}</p>
                <h2 className="mt-2 font-display text-[1.125rem] font-semibold leading-snug text-[#333333] md:text-[1.25rem]">
                  {heroProduct.name}
                </h2>
                <p className="mt-3 font-display text-xl font-semibold text-cotta tabular-nums md:text-2xl">{heroPrice.usd}</p>
                {heroPrice.tryApprox ? (
                  <p className="mt-1 text-xs tabular-nums text-stone-500">{heroPrice.tryApprox}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link to={`/urun/${heroProduct.id}`} className="site-btn-ghost px-4 py-2 text-[11px]">
                    İncele
                  </Link>
                  <Link to="/iletisim" className="site-btn-accent px-4 py-2 text-[11px]">
                    İletişim
                  </Link>
                </div>
              </div>
            </article>
          ) : null}

          <div className="site-card-muted flex flex-1 flex-col p-6 md:p-7">
            <p className="site-overline text-cotta-dark">Koleksiyon</p>
            <h1 className="mt-3 font-display text-[1.35rem] font-semibold leading-snug text-[#333333] md:text-[1.5rem]">
              {content.heroTitle}
            </h1>
            <p className="site-body mt-4 flex-1 line-clamp-5">{content.heroSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a href="#catalog" className="site-btn-ghost">
                Ürünleri keşfet
              </a>
              <Link to="/iletisim" className="site-btn-accent">
                Teklif al
              </Link>
            </div>
          </div>
        </aside>

        <div className="order-1 flex min-h-0 min-w-0 flex-col lg:order-2">
          <HomeCarousel slides={carousel} />
        </div>
      </section>

      <SiteCategoryShowcase
        categories={categoryShowcase}
        title={content.categorySectionTitle}
        subtitle={content.categorySectionSubtitle}
      />

      <section id="catalog" className="site-card scroll-mt-28 p-6 md:p-8">
        <div className="flex flex-col gap-8 border-b border-stone-100 pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            <h2 className="site-section-title">{content.filterSectionTitle}</h2>
            <span className="site-section-rule" aria-hidden />
            <p className="site-body mt-4 max-w-xl">Tüm ürünlerde arama; daraltmak için koleksiyon linkleri.</p>
          </div>
          <label className="block w-full lg:max-w-md">
            <span className="site-overline text-stone-500">Arama</span>
            <input className="site-input mt-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ürün adı, açıklama veya özellik…" />
          </label>
        </div>

        {categories.length > 0 ? (
          <div className="mt-8">
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible sm:gap-2.5">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={categoryPath(c.id)}
                  className="flex shrink-0 snap-start items-center gap-2.5 border border-stone-200 bg-surface-soft py-2 pl-2 pr-4 text-sm font-medium text-stone-800 shadow-soft transition hover:border-cotta hover:text-cotta"
                >
                  {c.imageUrl?.trim() ? (
                    <span className="relative h-8 w-8 shrink-0 overflow-hidden border border-stone-200">
                      <ImageThumb
                        src={c.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        emptyClassName="flex h-full w-full items-center justify-center bg-stone-200 text-[8px] text-stone-500"
                      />
                    </span>
                  ) : null}
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="font-display text-[1.25rem] font-semibold text-[#333333] md:text-[1.35rem]">{content.catalogSectionTitle}</h3>
            <span className="text-sm tabular-nums text-stone-500">{flatProducts.length} ürün</span>
          </div>

          {flatProducts.length === 0 ? (
            <div className="border border-dashed border-stone-300 bg-surface-muted px-6 py-16 text-center">
              <p className="font-medium text-[#333333]">Eşleşen ürün yok</p>
              <p className="site-body mt-2">Aramayı değiştirin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
              {flatProducts.map(({ product, categoryName }) => {
                const price = formatUsdAndTry(product.priceUsd, usdToTry)
                return (
                  <SiteProductCard
                    key={product.id}
                    product={product}
                    categoryName={categoryName}
                    priceUsd={price.usd}
                    priceTry={price.tryApprox ?? undefined}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="site-card p-6 md:p-10">
        <h2 className="site-section-title">{content.demoSectionTitle}</h2>
        <span className="site-section-rule" aria-hidden />
        <p className="site-body mt-4 max-w-2xl">{content.demoSectionNote}</p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {featured.map((p) => {
            const tr = p.pricingByCountry.TR
            const v = p.variants[0]
            return (
              <article
                key={p.id}
                className="site-card-muted flex flex-col p-6 md:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#333333]">{p.familyName}</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {p.material} · {p.style} · {p.usageArea}
                    </p>
                  </div>
                  {tr && (
                    <span className="border border-cotta/35 bg-cotta/10 px-3 py-1 text-sm font-semibold text-cotta-dark">
                      B2C {tryFmt.format(tr.b2c)}
                    </span>
                  )}
                </div>
                {v && (
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-stone-700 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-stone-500">SKU</dt>
                      <dd className="font-medium">{v.sku}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-stone-500">Stok</dt>
                      <dd className="font-medium">{v.stock}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-stone-500">Termin</dt>
                      <dd className="font-medium">{p.leadTimeDays} gün</dd>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <dt className="text-xs uppercase tracking-wide text-stone-500">Ölçü (cm)</dt>
                      <dd className="font-medium">
                        {v.widthCm} × {v.depthCm} × {v.heightCm}
                      </dd>
                    </div>
                  </dl>
                )}
                {p.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-stone-200 bg-white px-2 py-0.5 text-xs font-medium text-stone-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
