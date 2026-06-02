import { Link } from 'react-router-dom'
import type { CatalogProduct } from '../../core/catalog/types'
import { productPrimaryImage } from '../../core/catalog/types'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { catalogAnchor, productPath } from '../sitePaths'

type Props = {
  hero: CatalogProduct | null
  side: CatalogProduct[]
  categoryNameOf: (id: number) => string
}

export function HomeEditorialSpot({ hero, side, categoryNameOf }: Props) {
  const usdToTry = useExchangeRate()
  if (!hero) return null

  const heroPrice = formatUsdAndTry(hero.priceUsd, usdToTry)

  return (
    <section id="editorial" className="home-editorial site-enter" aria-labelledby="home-editorial-title">
      <div className="home-editorial-intro">
        <h2 id="home-editorial-title" className="home-editorial-heading">
          Editörün seçimi
        </h2>
        <Link to={catalogAnchor()} className="home-editorial-more">
          Tüm parçalar
        </Link>
      </div>

      <div className="home-editorial-grid">
        <Link to={productPath(hero)} className="home-editorial-hero group">
          <div className="home-editorial-hero-media">
            <ImageThumb
              src={productPrimaryImage(hero)}
              alt={hero.name}
              className="site-img-zoom h-full w-full object-cover"
              emptyClassName="flex h-full min-h-[320px] w-full items-center justify-center bg-stone-200"
              priority
            />
            <div className="home-editorial-hero-shade" aria-hidden />
          </div>
          <div className="home-editorial-hero-copy">
            <p className="text-xs uppercase tracking-[0.15em] text-white/70">
              {categoryNameOf(hero.categoryId)}
            </p>
            <p className="mt-2 text-2xl font-light leading-snug text-white sm:text-3xl">{hero.name}</p>
            <p className="mt-3 text-sm text-white/80">{heroPrice.usd}</p>
          </div>
        </Link>

        <ul className="home-editorial-side">
          {side.map((p) => {
            const price = formatUsdAndTry(p.priceUsd, usdToTry)
            return (
              <li key={p.id}>
                <Link to={productPath(p)} className="home-editorial-side-link group">
                  <div className="home-editorial-thumb">
                    <ImageThumb
                      src={productPrimaryImage(p)}
                      alt=""
                      className="site-img-zoom h-full w-full object-cover"
                      emptyClassName="flex h-full w-full items-center justify-center bg-stone-100"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-stone-400">{categoryNameOf(p.categoryId)}</p>
                    <p className="truncate text-sm font-medium text-ink group-hover:text-cotta">{p.name}</p>
                    <p className="mt-0.5 text-xs tabular-nums text-stone-500">{price.usd}</p>
                  </div>
                  <span className="text-stone-300 transition group-hover:text-cotta" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function pickEditorial(products: CatalogProduct[]) {
  const scored = [...products].sort((a, b) => {
    const s = (p: CatalogProduct) =>
      (p.stockStatus === 'in_stock' ? 3 : 0) +
      (p.images?.length ? 2 : 0) +
      (p.leadTimeDays != null && p.leadTimeDays <= 14 ? 1 : 0)
    return s(b) - s(a)
  })
  const hero = scored[0] ?? null
  const side: CatalogProduct[] = []
  const used = new Set<number>()
  if (hero) used.add(hero.id)
  for (const p of scored) {
    if (side.length >= 3) break
    if (used.has(p.id)) continue
    side.push(p)
    used.add(p.id)
  }
  return { hero, side }
}

export { pickEditorial }
