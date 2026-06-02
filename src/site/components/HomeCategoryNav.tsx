import { Link } from 'react-router-dom'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'
import type { HomeCategoryItem } from './HomeCategoryBento'

type Props = {
  categories: HomeCategoryItem[]
}

export function HomeCategoryNav({ categories }: Props) {
  if (categories.length === 0) return null

  return (
    <nav className="home-cat-nav site-enter" aria-label="Kategoriler">
      <div className="home-cat-nav-rail">
        {categories.map((c) => {
          const hasImg = Boolean(c.imageUrl?.trim())
          return (
            <Link key={c.id} to={categoryPath(c)} className="home-cat-nav-item group">
              <span className="home-cat-nav-thumb">
                {hasImg ? (
                  <ImageThumb
                    src={c.imageUrl!}
                    alt=""
                    className="h-full w-full object-cover"
                    emptyClassName="flex h-full w-full items-center justify-center bg-stone-100 text-lg text-stone-400"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-stone-100 text-lg font-light text-stone-500">
                    {c.name.slice(0, 1)}
                  </span>
                )}
              </span>
              <span className="home-cat-nav-label">{c.name}</span>
              {c.count > 0 ? (
                <span className="home-cat-nav-count">{c.count} parça</span>
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
