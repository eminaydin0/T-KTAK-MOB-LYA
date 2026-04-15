import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'

type Item = {
  id: number
  name: string
  count: number
  imageUrl?: string
}

type Props = {
  categories: Item[]
  className?: string
}

export function SiteNavCategoryMenu({ categories, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  if (categories.length === 0) return null

  const activeMatch = location.pathname.match(/^\/kategori\/(\d+)/)
  const activeId = activeMatch ? parseInt(activeMatch[1]!, 10) : null

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className={`inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] shadow-soft transition ${
          open
            ? 'border-cotta bg-cotta text-white'
            : activeId != null
              ? 'border-cotta bg-white text-cotta'
              : 'border-stone-200 bg-white text-stone-700 hover:border-cotta hover:text-cotta'
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        Kategoriler
        <svg className="h-3.5 w-3.5 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-[80] mt-2 w-[min(calc(100vw-2rem),20rem)] overflow-hidden border border-stone-200 bg-white shadow-card sm:w-80"
          role="listbox"
        >
          <ul className="max-h-[min(70vh,22rem)] overflow-y-auto py-2">
            {categories.map((c) => {
              const to = categoryPath(c.id)
              const active = activeId === c.id
              return (
                <li key={c.id} role="option" aria-selected={active}>
                  <Link
                    to={to}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                      active ? 'bg-cotta/10 text-cotta-dark' : 'text-stone-700 hover:bg-surface-muted'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="h-10 w-10 shrink-0 overflow-hidden border border-stone-200 bg-surface-muted">
                      {c.imageUrl?.trim() ? (
                        <ImageThumb
                          src={c.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          emptyClassName="flex h-full w-full items-center justify-center text-[8px] text-stone-400"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-stone-400">
                          {c.name.slice(0, 1)}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{c.name}</span>
                      <span className="text-xs tabular-nums text-stone-400">{c.count} ürün</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="border-t border-stone-200 bg-surface-soft px-2 py-2">
            <Link
              to="/#catalog"
              className="block py-2 text-center text-xs font-semibold uppercase tracking-wide text-cotta transition hover:underline"
              onClick={() => setOpen(false)}
            >
              Tüm ürünler
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
