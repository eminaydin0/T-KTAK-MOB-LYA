import { Link } from 'react-router-dom'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'
import { SiteSectionHeader } from './SiteSectionHeader'

export type SiteCategoryCard = {
  id: number
  name: string
  count: number
  imageUrl?: string
}

type Props = {
  categories: SiteCategoryCard[]
  title: string
  subtitle?: string
}

export function SiteCategoryShowcase({ categories, title, subtitle }: Props) {
  if (categories.length === 0) return null

  return (
    <section>
      <SiteSectionHeader
        title={title}
        subtitle={subtitle}
        action={
          <Link to="/#catalog" className="site-btn-text">
            Tümünü gör →
          </Link>
        }
      />

      <div className="shop-category-grid mt-8">
        {categories.map((c) => {
          const hasImg = Boolean(c.imageUrl?.trim())
          return (
            <Link key={c.id} to={categoryPath(c.id)} className="shop-category-tile">
              {hasImg ? (
                <ImageThumb
                  src={c.imageUrl!}
                  alt=""
                  className="site-img-zoom h-full w-full object-cover"
                  emptyClassName="flex h-full w-full items-center justify-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-100">
                  <span className="text-2xl font-light text-stone-300">{c.name.slice(0, 1)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-sm font-medium text-white">{c.name}</p>
                <p className="text-xs text-white/75">{c.count} ürün</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
