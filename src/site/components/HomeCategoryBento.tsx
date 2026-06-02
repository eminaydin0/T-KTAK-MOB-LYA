import { Link } from 'react-router-dom'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'

export type HomeCategoryItem = {
  id: number
  slug: string
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
      <header className="home-section-head">
        <div>
          <p className="home-section-eyebrow">01 — Koleksiyon</p>
          <h2 id="home-categories-title" className="home-section-title">
            {title}
          </h2>
          {subtitle ? <p className="home-section-lead">{subtitle}</p> : null}
        </div>
        <Link to="/#catalog" className="home-section-link">
          Tümünü gör
          <span aria-hidden>→</span>
        </Link>
      </header>

      <div className="home-category-grid mt-10">
        {categories.map((c, index) => {
          const hasImg = Boolean(c.imageUrl?.trim())
          const featured = index === 0
          return (
            <Link
              key={c.id}
              to={categoryPath(c)}
              className={`home-category-tile group ${featured ? 'home-category-tile--lead' : ''}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {hasImg ? (
                <ImageThumb
                  src={c.imageUrl!}
                  alt=""
                  className="site-img-zoom h-full w-full object-cover"
                  emptyClassName="flex h-full w-full items-center justify-center"
                  priority={index < 4}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-100">
                  <span className="text-4xl font-light text-stone-300">{c.name.slice(0, 1)}</span>
                </div>
              )}
              <div className="home-category-shade" aria-hidden />
              <div className="home-category-caption">
                <p className="text-sm font-medium text-white sm:text-base">{c.name}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-white/75">
                  <span>{c.count} parça</span>
                  <span className="home-category-arrow opacity-0 transition duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
