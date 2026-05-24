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
        <div className="site-empty bg-white shadow-soft">
          <p className="site-card-title text-lg">Kategori bulunamadı</p>
          <p className="site-body mt-2">Bağlantı geçersiz veya kategori kaldırılmış olabilir.</p>
          <Link to="/" className="site-btn-accent mt-8 px-6">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="site-enter pb-16">
      <nav className="site-breadcrumb mb-8" aria-label="Sayfa yolu">
        <Link to="/" className="site-link">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <Link to="/#catalog" className="transition duration-site ease-site hover:text-cotta">
          Katalog
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <span className="font-medium text-ink">{category.name}</span>
      </nav>

      <div className="site-card overflow-hidden">
        {category.imageUrl?.trim() ? (
          <div className="relative h-44 sm:h-52">
            <img src={category.imageUrl} alt="" className="h-full w-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-24 bg-surface-muted sm:h-28" aria-hidden />
        )}

        <div className="px-6 py-8 sm:px-10">
          <h1 className="site-page-title">{category.name}</h1>
          <p className="site-caption mt-2 normal-case">{list.length} ürün</p>
          <Link to="/#catalog" className="site-btn-ghost mt-6">
            Tüm katalog
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="sr-only">Ürünler</h2>
        {list.length === 0 ? (
          <div className="site-empty">
            <p className="font-medium text-ink">Bu kategoride henüz ürün yok</p>
            <Link to="/" className="site-btn-accent mt-6">
              Ana sayfaya dön
            </Link>
          </div>
        ) : (
          <div className="home-product-grid">
            {list.map((product) => {
              const price = formatUsdAndTry(product.priceUsd, usdToTry)
              return (
                  <SiteProductCard
                    key={product.id}
                    product={product}
                    categoryName={category.name}
                    priceUsd={price.usd}
                    priceTry={price.tryApprox ?? undefined}
                    priority={false}
                  />
              )
            })}
          </div>
        )}
      </div>

      {categories.filter((c) => c.id !== category.id).length > 0 ? (
        <section className="site-card-muted mt-14 px-5 py-6 sm:px-8">
          <h2 className="site-overline text-ink">Diğer koleksiyonlar</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== category.id)
              .map((c) => (
                <Link key={c.id} to={categoryPath(c.id)} className="site-chip px-4">
                  {c.name}
                </Link>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
