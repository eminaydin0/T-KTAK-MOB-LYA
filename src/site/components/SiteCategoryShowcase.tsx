import { Link } from 'react-router-dom'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'

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

/** Kategori vitrinı */
export function SiteCategoryShowcase({ categories, title, subtitle }: Props) {
  if (categories.length === 0) return null

  return (
    <section className="site-card p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h2 className="site-section-title">{title}</h2>
          <span className="site-section-rule" aria-hidden />
          {subtitle ? <p className="site-body mt-4 max-w-2xl">{subtitle}</p> : null}
        </div>
        <Link
          to="/#catalog"
          className="inline-flex w-fit shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cotta transition hover:text-cotta-dark"
        >
          Tüm katalog
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {categories.map((c) => {
          const hasImg = Boolean(c.imageUrl?.trim())

          return (
            <Link
              key={c.id}
              to={categoryPath(c.id)}
              className="site-card-muted group flex flex-col transition duration-300 hover:border-cotta/35 hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
                {hasImg ? (
                  <ImageThumb
                    src={c.imageUrl!}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    emptyClassName="flex h-full w-full items-center justify-center text-stone-400"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200/80">
                    <span className="font-display text-3xl font-light text-stone-300">{c.name.slice(0, 1)}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <p className="text-xs font-bold uppercase leading-snug tracking-[0.1em] text-[#333333] transition group-hover:text-cotta">
                  {c.name}
                </p>
                <p className="mt-2 text-sm text-stone-500">{c.count} ürün</p>
                <span className="mt-auto pt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-cotta">
                  İncele →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
