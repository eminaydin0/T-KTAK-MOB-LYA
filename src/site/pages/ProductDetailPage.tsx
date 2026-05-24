import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { SiteSpinner } from '../../shared/components/SiteSpinner'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { SiteProductGallery } from '../components/SiteProductGallery'
import { categoryPath } from '../sitePaths'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = productId ? parseInt(productId, 10) : NaN
  const { products, categories } = useCatalog()
  const { data } = useSite()
  const usdToTry = useExchangeRate()
  const siteName = data.settings.siteName || 'Vitrin'

  const product = useMemo(() => {
    if (!Number.isFinite(id)) return undefined
    return products.find((p) => p.id === id)
  }, [products, id])

  const category = product ? categories.find((c) => c.id === product.categoryId) : undefined

  const price = product ? formatUsdAndTry(product.priceUsd, usdToTry) : null

  useEffect(() => {
    if (!product) {
      document.title = `Ürün bulunamadı — ${siteName}`
    } else {
      document.title = `${product.name} — ${siteName}`
    }
    return () => {
      document.title = siteName
    }
  }, [product, siteName])

  if (!Number.isFinite(id) || !product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="site-empty bg-white shadow-soft">
          <p className="site-card-title text-lg">Ürün bulunamadı</p>
          <p className="site-body mt-2">Bağlantı geçersiz veya ürün kaldırılmış olabilir.</p>
          <Link to="/" className="site-btn-accent mt-8 px-6">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    )
  }

  const specRows =
    category?.questions
      .map((q) => {
        const v = product.categoryAnswers?.[q.id]?.trim()
        return v ? { label: q.label, value: v } : null
      })
      .filter((x): x is { label: string; value: string } => x !== null) ?? []

  return (
    <div className="site-enter pb-16">
      <nav className="site-breadcrumb mb-8" aria-label="Sayfa yolu">
        <Link to="/" className="site-link">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        {category ? (
          <>
            <Link to={categoryPath(category.id)} className="transition duration-site ease-site hover:text-cotta">
              {category.name}
            </Link>
            <span className="text-stone-300" aria-hidden>
              /
            </span>
          </>
        ) : (
          <>
            <Link to="/#catalog" className="transition duration-site ease-site hover:text-cotta">
              Katalog
            </Link>
            <span className="text-stone-300" aria-hidden>
              /
            </span>
          </>
        )}
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="site-grid-split lg:gap-12">
        <div className="min-w-0">
          <SiteProductGallery imageUrls={product.images} name={product.name} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          {category ? (
            <Link to={categoryPath(category.id)} className="site-chip w-fit">
              {category.imageUrl?.trim() ? (
                <span className="h-8 w-8 shrink-0 overflow-hidden border border-line">
                  <ImageThumb
                    src={category.imageUrl}
                    alt=""
                    className="h-full w-full"
                    emptyClassName="flex h-full w-full items-center justify-center bg-stone-200 text-xs text-stone-500"
                  />
                </span>
              ) : null}
              {category.name}
            </Link>
          ) : null}

          <h1 className="site-page-title">{product.name}</h1>

          <div className="site-divide-b flex flex-wrap items-end gap-x-4 gap-y-2 pb-6">
            {price ? (
              <>
                <span className="site-price text-3xl">{price.usd}</span>
                {price.tryApprox ? (
                  <span className="text-lg tabular-nums text-stone-600">{price.tryApprox}</span>
                ) : usdToTry === null ? (
                  <SiteSpinner label="TL kuru yükleniyor…" />
                ) : (
                  <span className="site-caption text-stone-400">TL tahmini için kur bilgisi gerekli</span>
                )}
              </>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="site-panel text-sm font-medium text-ink">
              {STOCK_STATUS_LABEL[product.stockStatus ?? 'unknown']}
              {product.leadTimeDays != null ? ` · Termin ~${product.leadTimeDays} gün` : ''}
            </span>
          </div>

          <p className="site-body max-w-prose text-base">{product.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/iletisim" className="site-btn-accent px-6 py-3">
              İletişim
            </Link>
            <Link to="/#catalog" className="site-btn-ghost px-6 py-3">
              Kataloga dön
            </Link>
          </div>
        </div>
      </div>

      {specRows.length > 0 ? (
        <section className="mt-14 border-t border-line pt-12">
          <h2 className="site-card-title">Ürün özellikleri</h2>
          <span className="site-section-rule" aria-hidden />
          <p className="site-body mt-3">Kategoriye özel bilgiler</p>
          <ul className="site-card mt-6 divide-y divide-line overflow-hidden">
            {specRows.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-start sm:gap-8 sm:px-6 sm:py-5"
              >
                <span className="site-meta shrink-0 sm:w-52">{row.label}</span>
                <span className="min-w-0 text-sm font-medium leading-relaxed text-ink">{row.value}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
