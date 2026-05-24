import { Link } from 'react-router-dom'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'

export type HomeCategoryItem = {
  id: number
  name: string
  count: number
  imageUrl?: string
}

type Props = {
  categories: HomeCategoryItem[]
  title: string
  subtitle?: string
}

export function HomeCategoryBento({ categories, title, subtitle }: Props) {
  if (categories.length === 0) return null

  return (
    <section className="site-enter" aria-labelledby="home-categories-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="home-categories-title" className="site-section-title">
            {title}
          </h2>
          {subtitle ? <p className="site-body mt-2 max-w-lg">{subtitle}</p> : null}
        </div>
        <Link to="/#catalog" className="site-btn-text shrink-0">
          Tümünü gör →
        </Link>
      </div>

      <div className="shop-category-grid mt-8">
        {categories.map((c, index) => {
          const hasImg = Boolean(c.imageUrl?.trim())
          return (
            <Link key={c.id} to={categoryPath(c.id)} className="shop-category-tile">
              {hasImg ? (
                <ImageThumb
                  src={c.imageUrl!}
                  alt=""
                  className="site-img-zoom h-full w-full object-cover"
                  emptyClassName="flex h-full w-full items-center justify-center"
                  priority={index < 4}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-stone-100 to-stone-200/80">
                  <span className="text-3xl font-light text-stone-300">{c.name.slice(0, 1)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="mt-0.5 text-xs text-white/75">{c.count} ürün</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
