import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { STOCK_STATUS_LABEL } from '../../core/catalog/types'
import { useCart } from '../../core/context/CartContext'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { SiteSpinner } from '../../shared/components/SiteSpinner'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { ProductDetailGallery } from '../components/ProductDetailGallery'
import { SiteProductCard } from '../components/SiteProductCard'
import { categoryPath, packagePath } from '../sitePaths'

type DetailTab = 'overview' | 'specs' | 'delivery'

const STOCK_TONE: Record<string, string> = {
  in_stock: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  pre_order: 'bg-amber-50 text-amber-900 ring-amber-200',
  unknown: 'bg-stone-100 text-stone-600 ring-stone-200',
}

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const id = productId ? parseInt(productId, 10) : NaN
  const { products, categories, packages } = useCatalog()
  const { addProduct } = useCart()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<DetailTab>('overview')
  const [copied, setCopied] = useState(false)
  const { data } = useSite()
  const usdToTry = useExchangeRate()
  const siteName = data.settings.siteName || 'Vitrin'
  const settings = data.settings

  const product = useMemo(() => {
    if (!Number.isFinite(id)) return undefined
    return products.find((p) => p.id === id)
  }, [products, id])

  const category = product ? categories.find((c) => c.id === product.categoryId) : undefined

  const price = product ? formatUsdAndTry(product.priceUsd, usdToTry) : null
  const lineTotal = product && price ? formatUsdAndTry(product.priceUsd * qty, usdToTry) : null

  const memberPackages = useMemo(() => {
    if (!product?.packageSlugs?.length) return []
    return packages.filter((p) => product.packageSlugs!.includes(p.slug))
  }, [packages, product])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4)
  }, [products, product])

  const specRows =
    category?.questions
      .map((q) => {
        const v = product?.categoryAnswers?.[q.id]?.trim()
        return v ? { label: q.label, value: v } : null
      })
      .filter((x): x is { label: string; value: string } => x !== null) ?? []

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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

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

  const stockKey = product.stockStatus ?? 'unknown'
  const stockLabel = STOCK_STATUS_LABEL[stockKey]
  const stockTone = STOCK_TONE[stockKey] ?? STOCK_TONE.unknown

  const whatsappHref =  settings.socialWhatsApp?.trim()
    ? `${settings.socialWhatsApp}${settings.socialWhatsApp.includes('?') ? '&' : '?'}text=${encodeURIComponent(`${product.name} hakkında bilgi almak istiyorum.`)}`
    : null

  return (
    <div className="site-enter pb-20">
      <nav className="site-breadcrumb mb-6" aria-label="Sayfa yolu">
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

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 xl:gap-14">
        <div className="min-w-0">
          <ProductDetailGallery imageUrls={product.images} name={product.name} />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <Link to={categoryPath(category.id)} className="site-chip">
                {category.imageUrl?.trim() ? (
                  <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-line">
                    <ImageThumb
                      src={category.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      emptyClassName="flex h-full w-full items-center justify-center bg-stone-200 text-[10px]"
                    />
                  </span>
                ) : null}
                {category.name}
              </Link>
            ) : null}
            <span className="site-caption font-mono text-stone-400">SKU-{String(product.id).padStart(4, '0')}</span>
          </div>

          <h1 className="site-page-title text-2xl sm:text-3xl">{product.name}</h1>

          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${stockTone}`}>
              {stockLabel}
            </span>
            {product.leadTimeDays != null ? (
              <span className="site-tag">Termin ~{product.leadTimeDays} gün</span>
            ) : null}
            {product.images.length > 1 ? (
              <span className="site-tag">{product.images.length} fotoğraf</span>
            ) : null}
          </div>

          {price ? (
            <div className="site-card border border-line/80 p-5 shadow-soft">
              <p className="site-caption">Liste fiyatı</p>
              <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="site-price text-3xl">{price.usd}</span>
                {price.tryApprox ? (
                  <span className="text-base tabular-nums text-stone-600">{price.tryApprox}</span>
                ) : usdToTry === null ? (
                  <SiteSpinner label="TL kuru yükleniyor…" />
                ) : null}
              </div>
              {lineTotal && qty > 1 ? (
                <p className="site-caption mt-2 text-stone-500">
                  {qty} adet: <span className="font-medium text-ink">{lineTotal.usd}</span>
                  {lineTotal.tryApprox ? ` · ${lineTotal.tryApprox}` : ''}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="site-card sticky top-24 z-10 border border-line/80 p-5 shadow-soft lg:static">
            <p className="site-caption mb-3">Satın alma</p>
            <div className="flex flex-wrap items-stretch gap-3">
              <div className="flex items-center rounded-full border border-line bg-white">
                <button
                  type="button"
                  className="site-btn-icon h-11 w-11 rounded-none rounded-l-full border-0 shadow-none"
                  aria-label="Azalt"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="min-w-12 text-center text-sm font-medium tabular-nums">{qty}</span>
                <button
                  type="button"
                  className="site-btn-icon h-11 w-11 rounded-none rounded-r-full border-0 shadow-none"
                  aria-label="Artır"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="site-btn-accent min-h-[44px] flex-1 px-6 py-3 sm:flex-none sm:min-w-[180px]"
                onClick={() => addProduct(product, qty)}
              >
                Sepete ekle
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/iletisim" className="site-btn-ghost flex-1 py-2.5 text-center sm:flex-none sm:px-5">
                Teklif al
              </Link>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="site-btn-ghost flex-1 py-2.5 text-center sm:flex-none sm:px-5"
                >
                  WhatsApp
                </a>
              ) : null}
              <button type="button" className="site-btn-ghost px-4 py-2.5" onClick={copyLink}>
                {copied ? 'Kopyalandı' : 'Linki kopyala'}
              </button>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Ücretsiz keşif', desc: 'Showroom randevusu' },
              { title: 'Montaj desteği', desc: 'Talep üzerine kurulum' },
              { title: 'Güvenli ödeme', desc: 'Kart / havale / kapıda' },
            ].map((item) => (
              <li key={item.title} className="rounded-site-lg border border-line/70 bg-surface-muted/60 px-3 py-3 text-center">
                <p className="text-xs font-semibold text-ink">{item.title}</p>
                <p className="site-caption mt-0.5">{item.desc}</p>
              </li>
            ))}
          </ul>

          {memberPackages.length > 0 ? (
            <div className="rounded-site-lg border border-cotta/20 bg-cotta/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-cotta">Paket parçası</p>
              <p className="site-body mt-1 text-sm text-stone-600">
                Bu ürün aşağıdaki setlerin parçasıdır; tek başına veya tam set olarak sipariş edilebilir.
              </p>
              <ul className="mt-3 space-y-2">
                {memberPackages.map((pkg) => (
                  <li key={pkg.id}>
                    <Link to={packagePath(pkg.slug)} className="site-btn-text text-sm">
                      {pkg.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <section className="mt-12 lg:mt-16">
        <div className="flex gap-1 overflow-x-auto border-b border-line pb-px" role="tablist">
          {(
            [
              ['overview', 'Genel bakış'],
              ['specs', 'Özellikler'],
              ['delivery', 'Teslimat'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`shrink-0 rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
                tab === key
                  ? 'border border-b-0 border-line bg-white text-ink shadow-soft'
                  : 'text-stone-500 hover:text-ink'
              }`}
              onClick={() => setTab(key)}
            >
              {label}
              {key === 'specs' && specRows.length > 0 ? (
                <span className="ml-1.5 text-xs text-stone-400">({specRows.length})</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="site-card rounded-t-none border border-t-0 border-line p-5 sm:p-8">
          {tab === 'overview' ? (
            <div className="max-w-prose space-y-4">
              {product.description.split(/\n\n+/).map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="site-body text-base leading-relaxed text-stone-700">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          ) : null}

          {tab === 'specs' ? (
            specRows.length > 0 ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                {specRows.map((row) => (
                  <div key={row.label} className="rounded-lg border border-line/80 bg-surface-muted/40 px-4 py-3">
                    <dt className="site-caption text-stone-500">{row.label}</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="site-body text-stone-500">Bu ürün için ek teknik özellik girilmemiş.</p>
            )
          ) : null}

          {tab === 'delivery' ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="site-card-title text-base">Teslimat</h3>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>İstanbul içi randevulu teslimat ve montaj hizmeti sunulur.</li>
                  <li>
                    {product.leadTimeDays != null
                      ? `Tahmini termin süresi yaklaşık ${product.leadTimeDays} gündür.`
                      : 'Stoktaki ürünlerde hızlı sevkiyat mümkündür.'}
                  </li>
                  <li>Diğer illere anlaşmalı kargo ile gönderim yapılır.</li>
                </ul>
              </div>
              <div>
                <h3 className="site-card-title text-base">Ödeme & iade</h3>
                <ul className="mt-3 space-y-2 text-sm text-stone-600">
                  <li>Kredi kartı, havale/EFT ve kapıda ödeme seçenekleri.</li>
                  <li>Özel üretim ürünlerde iade koşulları sipariş öncesi paylaşılır.</li>
                  {settings.contactPhone ? (
                    <li>
                      Sorularınız:{' '}
                      <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="text-cotta">
                        {settings.contactPhone}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-14 border-t border-line pt-12">
          <h2 className="site-card-title">Benzer ürünler</h2>
          <span className="site-section-rule" aria-hidden />
          <p className="site-body mt-2">
            {category?.name} kategorisinden diğer seçenekler
          </p>
          <div className="home-product-grid mt-8">
            {related.map((p) => {
              const catName = categories.find((c) => c.id === p.categoryId)?.name ?? ''
              const pPrice = formatUsdAndTry(p.priceUsd, usdToTry)
              return (
                <SiteProductCard
                  key={p.id}
                  product={p}
                  categoryName={catName}
                  priceUsd={pPrice.usd}
                  priceTry={pPrice.tryApprox ?? undefined}
                />
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}
