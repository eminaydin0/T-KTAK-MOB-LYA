import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { SiteProductCard } from '../components/SiteProductCard'
import { categoryPath } from '../sitePaths'

export function CategoryPage() {
  const { categoryId: rawId } = useParams<{ categoryId: string }>()
  const id = rawId ? parseInt(rawId, 10) : NaN
  const { categories, products } = useCatalog()
  const { data } = useSite()
  const usdToTry = useExchangeRate()
  const siteName = data.settings.siteName || 'Vitrin'

  const category = useMemo(() => {
    if (!Number.isFinite(id)) return undefined
    return categories.find((c) => c.id === id)
  }, [categories, id])

  const list = useMemo(() => {
    if (!category) return []
    return products.filter((p) => p.categoryId === category.id)
  }, [category, products])

  useEffect(() => {
    if (!category) {
      document.title = `Kategori — ${siteName}`
    } else {
      document.title = `${category.name} — ${siteName}`
    }
    return () => {
      document.title = siteName
    }
  }, [category, siteName])

  if (!Number.isFinite(id) || !category) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="border border-dashed border-stone-300 bg-white px-8 py-14 shadow-soft">
          <p className="font-display text-lg font-semibold text-[#333333]">Kategori bulunamadı</p>
          <p className="mt-2 text-sm text-stone-600">Bağlantı geçersiz veya kategori kaldırılmış olabilir.</p>
          <Link
            to="/"
            className="mt-8 inline-flex bg-cotta px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-soft transition hover:bg-cotta-dark"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-16">
      <nav className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-600" aria-label="Sayfa yolu">
        <Link to="/" className="font-medium text-[#333333] transition hover:text-cotta">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <Link to="/#catalog" className="transition hover:text-cotta">
          Katalog
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <span className="font-medium text-[#333333]">{category.name}</span>
      </nav>

      <div className="overflow-hidden border border-stone-200/90 bg-white shadow-soft">
        {category.imageUrl?.trim() ? (
          <div className="relative h-44 sm:h-52">
            <img
              src={category.imageUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-24 bg-surface-muted sm:h-28" aria-hidden />
        )}

        <div className="px-6 py-8 sm:px-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#333333] sm:text-4xl">{category.name}</h1>
          <p className="mt-2 text-stone-600">{list.length} ürün</p>
          <Link
            to="/#catalog"
            className="mt-6 inline-flex border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#333333] transition hover:border-cotta hover:text-cotta"
          >
            Tüm katalog
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="sr-only">Ürünler</h2>
        {list.length === 0 ? (
          <div className="border border-dashed border-stone-300 bg-surface-muted px-6 py-14 text-center">
            <p className="font-medium text-[#333333]">Bu kategoride henüz ürün yok</p>
            <Link
              to="/"
              className="mt-6 inline-flex bg-cotta px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-cotta-dark"
            >
              Ana sayfaya dön
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((product) => {
              const price = formatUsdAndTry(product.priceUsd, usdToTry)
              return (
                <SiteProductCard
                  key={product.id}
                  product={product}
                  categoryName={category.name}
                  priceUsd={price.usd}
                  priceTry={price.tryApprox ?? undefined}
                />
              )
            })}
          </div>
        )}
      </div>

      {categories.filter((c) => c.id !== category.id).length > 0 ? (
        <section className="mt-14 border border-stone-200/90 bg-surface-soft px-5 py-6 sm:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#333333]">Diğer koleksiyonlar</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== category.id)
              .map((c) => (
                <Link
                  key={c.id}
                  to={categoryPath(c.id)}
                  className="inline-flex border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-cotta hover:text-cotta"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
