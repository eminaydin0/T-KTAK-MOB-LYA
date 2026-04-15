import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
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
      document.title = `Urun bulunamadi — ${siteName}`
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
        <div className="border border-dashed border-stone-300 bg-white px-8 py-14 shadow-soft">
          <p className="font-display text-lg font-semibold text-[#333333]">Ürün bulunamadı</p>
          <p className="mt-2 text-sm text-stone-600">Bağlantı geçersiz veya ürün kaldırılmış olabilir.</p>
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

  const specRows =
    category?.questions
      .map((q) => {
        const v = product.categoryAnswers?.[q.id]?.trim()
        return v ? { label: q.label, value: v } : null
      })
      .filter((x): x is { label: string; value: string } => x !== null) ?? []

  return (
    <div className="pb-16">
      <nav className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-500" aria-label="Sayfa yolu">
        <Link to="/" className="font-medium transition hover:text-cotta">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        {category ? (
          <>
            <Link to={categoryPath(category.id)} className="transition hover:text-cotta">
              {category.name}
            </Link>
            <span className="text-stone-300" aria-hidden>
              /
            </span>
          </>
        ) : (
          <>
            <Link to="/#catalog" className="transition hover:text-cotta">
              Katalog
            </Link>
            <span className="text-stone-300" aria-hidden>
              /
            </span>
          </>
        )}
        <span className="font-medium text-[#333333]">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="min-w-0">
          <SiteProductGallery imageUrls={product.images} name={product.name} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          {category ? (
            <Link
              to={categoryPath(category.id)}
              className="inline-flex w-fit items-center gap-2 border border-stone-200 bg-surface-soft py-1 pl-1 pr-3 text-xs font-semibold uppercase tracking-wider text-[#333333] transition hover:border-cotta hover:text-cotta"
            >
              {category.imageUrl?.trim() ? (
                <span className="h-8 w-8 shrink-0 overflow-hidden border border-stone-200">
                  <ImageThumb
                    src={category.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    emptyClassName="flex h-full w-full items-center justify-center bg-stone-200 text-[8px] text-stone-500"
                  />
                </span>
              ) : null}
              {category.name}
            </Link>
          ) : null}

          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#333333] sm:text-4xl sm:leading-tight">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-stone-100 pb-6">
            {price ? (
              <>
                <span className="font-display text-3xl font-semibold tabular-nums text-cotta">{price.usd}</span>
                {price.tryApprox ? (
                  <span className="text-lg tabular-nums text-stone-600">{price.tryApprox}</span>
                ) : (
                  <span className="text-sm text-stone-400">TL tahmini için kur bilgisi yükleniyor</span>
                )}
              </>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex border border-stone-200 bg-surface-soft px-4 py-2 text-sm font-medium text-[#333333]">
              {STOCK_STATUS_LABEL[product.stockStatus ?? 'unknown']}
              {product.leadTimeDays != null ? ` · Termin ~${product.leadTimeDays} gün` : ''}
            </span>
          </div>

          <p className="max-w-prose text-base leading-relaxed text-stone-600">{product.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center bg-cotta px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-soft transition hover:bg-cotta-dark"
            >
              İletişim
            </Link>
            <Link
              to="/#catalog"
              className="inline-flex items-center justify-center border border-stone-300 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#333333] transition hover:border-cotta hover:text-cotta"
            >
              Kataloga dön
            </Link>
          </div>
        </div>
      </div>

      {specRows.length > 0 ? (
        <section className="mt-14 border-t border-stone-200 pt-12">
          <h2 className="font-display text-xl font-semibold text-[#333333]">Ürün özellikleri</h2>
          <span className="mt-2 block h-1 w-10 bg-cotta" aria-hidden />
          <p className="mt-3 text-sm text-stone-500">Kategoriye özel bilgiler</p>
          <ul className="mt-6 divide-y divide-stone-100 overflow-hidden border border-stone-200 bg-white shadow-soft">
            {specRows.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-start sm:gap-8 sm:px-6 sm:py-5"
              >
                <span className="shrink-0 text-sm font-medium text-stone-500 sm:w-52">{row.label}</span>
                <span className="min-w-0 text-sm font-medium leading-relaxed text-[#333333]">{row.value}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
