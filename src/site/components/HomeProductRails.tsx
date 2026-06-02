import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CatalogProduct } from '../../core/catalog/types'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { catalogAnchor } from '../sitePaths'
import { HomeRailCard } from './HomeRailCard'

type TabId = 'featured' | 'in_stock' | 'sets'

const TABS: { id: TabId; label: string }[] = [
  { id: 'featured', label: 'Öne çıkanlar' },
  { id: 'in_stock', label: 'Stokta' },
  { id: 'sets', label: 'Set parçaları' },
]

type Props = {
  products: CatalogProduct[]
  categoryNameOf: (id: number) => string
}

function scoreFeatured(p: CatalogProduct) {
  return (
    (p.stockStatus === 'in_stock' ? 3 : p.stockStatus === 'pre_order' ? 1 : 0) +
    (p.images?.length ? 2 : 0) +
    (p.packageSlugs?.length ? 1 : 0)
  )
}

export function HomeProductRails({ products, categoryNameOf }: Props) {
  const usdToTry = useExchangeRate()
  const railRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState<TabId>('featured')

  const lists = useMemo(() => {
    const featured = [...products].sort((a, b) => scoreFeatured(b) - scoreFeatured(a)).slice(0, 14)
    const inStock = products.filter((p) => p.stockStatus === 'in_stock').slice(0, 14)
    const sets = products.filter((p) => p.packageSlugs && p.packageSlugs.length > 0).slice(0, 14)
    return { featured, in_stock: inStock, sets }
  }, [products])

  const active = lists[tab]
  if (active.length === 0 && products.length === 0) return null

  const scroll = (dir: -1 | 1) => {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(320, el.clientWidth * 0.85), behavior: 'smooth' })
  }

  return (
    <section id="highlights" className="home-rails site-enter scroll-mt-24" aria-labelledby="home-rails-title">
      <div className="home-rails-head">
        <div>
          <h2 id="home-rails-title" className="home-rails-title">
            Seçkin parçalar
          </h2>
          <p className="home-rails-lead">Kaydırarak keşfedin</p>
        </div>
        <Link to={catalogAnchor()} className="home-rails-more">
          Tümünü gör →
        </Link>
      </div>

      <div className="home-rails-tabs" role="tablist" aria-label="Ürün listeleri">
        {TABS.map((t) => {
          const count = lists[t.id].length
          if (count === 0) return null
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`home-rails-tab ${tab === t.id ? 'home-rails-tab--on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {active.length === 0 ? (
        <p className="home-rails-empty text-sm text-stone-500">Bu listede henüz ürün yok.</p>
      ) : (
        <div className="home-rails-wrap">
          <button
            type="button"
            className="home-rails-arrow home-rails-arrow--prev"
            aria-label="Önceki ürünler"
            onClick={() => scroll(-1)}
          >
            ‹
          </button>
          <div ref={railRef} className="home-rails-track">
            {active.map((product, index) => {
              const price = formatUsdAndTry(product.priceUsd, usdToTry)
              return (
                <HomeRailCard
                  key={product.id}
                  product={product}
                  categoryName={categoryNameOf(product.categoryId)}
                  priceUsd={price.usd}
                  priceTry={price.tryApprox ?? undefined}
                  priority={index < 4}
                />
              )
            })}
          </div>
          <button
            type="button"
            className="home-rails-arrow home-rails-arrow--next"
            aria-label="Sonraki ürünler"
            onClick={() => scroll(1)}
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}
