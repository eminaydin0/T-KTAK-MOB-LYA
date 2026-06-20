import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from '../../../lib/motion'
import { dropdownPanel } from '../../../lib/motion-variants'
import { cn } from '../../../lib/cn'
import { ImageThumb } from '../../../shared/components/ImageThumb'
import { catalogPath, contactPath, categoryPath } from '../../sitePaths'

export type HeaderCategory = {
  id: number
  slug: string
  name: string
  count: number
  imageUrl?: string
}

type Props = {
  categories: HeaderCategory[]
  open: boolean
  onOpenChange: (open: boolean) => void
  activeSlug: string | null
}

function pickFeatured(categories: HeaderCategory[]) {
  const withImage = categories.filter((c) => c.imageUrl?.trim())
  if (withImage.length === 0) return categories[0]
  return [...withImage].sort((a, b) => b.count - a.count)[0]
}

export function SiteHeaderMegaMenu({ categories, open, onOpenChange, activeSlug }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const featured = pickFeatured(categories)
  const rest = categories.filter((c) => c.id !== featured?.id)
  const totalProducts = categories.reduce((n, c) => n + c.count, 0)

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    onOpenChange(false)
    navigate(q ? `${catalogPath()}?q=${encodeURIComponent(q)}` : catalogPath())
  }

  if (categories.length === 0) return null

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="site-mega-backdrop"
            aria-label="Menüyü kapat"
            variants={dropdownPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={panelRef}
            id="site-mega-menu"
            className="site-mega-panel"
            role="dialog"
            aria-label="Koleksiyonlar"
            variants={dropdownPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="site-mega-inner">
              <aside className="site-mega-aside">
                <p className="site-mega-kicker">Koleksiyonlar</p>
                <h2 className="site-mega-title home-display">Oda oda keşfedin</h2>
                <p className="site-mega-lead">
                  {totalProducts > 0
                    ? `${totalProducts} parça, ${categories.length} kategori — ölçü ve malzeme detaylarıyla.`
                    : 'Kategorilere göre filtreleyin veya tüm kataloğu açın.'}
                </p>

                <form className="site-mega-search" role="search" onSubmit={onSearch}>
                  <label className="sr-only" htmlFor="mega-search">
                    Katalogda ara
                  </label>
                  <input
                    id="mega-search"
                    className="site-mega-search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ürün veya oda ara…"
                    autoComplete="off"
                  />
                  <button type="submit" className="site-mega-search-btn">
                    Ara
                  </button>
                </form>

                <div className="site-mega-aside-links">
                  <Link to={catalogPath()} className="site-mega-link" onClick={() => onOpenChange(false)}>
                    Tüm koleksiyon
                    <span aria-hidden> →</span>
                  </Link>
                  <Link to={contactPath()} className="site-mega-link site-mega-link--muted" onClick={() => onOpenChange(false)}>
                    Showroom randevusu
                  </Link>
                </div>
              </aside>

              <div className="site-mega-grid-wrap">
                {featured ? (
                  <Link
                    to={categoryPath(featured)}
                    className="site-mega-feature group"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="site-mega-feature-media">
                      {featured.imageUrl?.trim() ? (
                        <ImageThumb
                          src={featured.imageUrl}
                          alt=""
                          className="site-img-zoom h-full w-full object-cover"
                          emptyClassName="flex h-full w-full items-center justify-center bg-stone-200 text-stone-400"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                          <span className="font-display text-6xl font-light text-white/40">
                            {featured.name.slice(0, 1)}
                          </span>
                        </div>
                      )}
                      <div className="site-mega-feature-shade" aria-hidden />
                    </div>
                    <div className="site-mega-feature-copy">
                      <span className="site-mega-feature-tag">Öne çıkan</span>
                      <span className="site-mega-feature-name">{featured.name}</span>
                      <span className="site-mega-feature-meta">{featured.count} parça</span>
                    </div>
                  </Link>
                ) : null}

                <ul className="site-mega-grid">
                  {rest.map((c) => {
                    const active = activeSlug === c.slug
                    return (
                      <li key={c.id}>
                        <Link
                          to={categoryPath(c)}
                          className={cn('site-mega-tile group', active && 'site-mega-tile--active')}
                          onClick={() => onOpenChange(false)}
                        >
                          <span className="site-mega-tile-media">
                            {c.imageUrl?.trim() ? (
                              <ImageThumb
                                src={c.imageUrl}
                                alt=""
                                className="site-img-zoom h-full w-full object-cover"
                                emptyClassName="flex h-full w-full items-center justify-center bg-stone-100 text-xs text-stone-400"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center bg-stone-100 font-display text-2xl text-stone-300">
                                {c.name.slice(0, 1)}
                              </span>
                            )}
                          </span>
                          <span className="site-mega-tile-body">
                            <span className="site-mega-tile-name">{c.name}</span>
                            <span className="site-mega-tile-count">{c.count}</span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
