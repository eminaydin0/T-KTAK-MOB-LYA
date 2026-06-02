import { Link } from 'react-router-dom'

type Props = {
  page: number
  totalPages: number
  buildHref: (page: number) => string
}

export function CatalogPagination({ page, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Sayfalama">
      {page > 1 ? (
        <Link to={buildHref(page - 1)} className="site-btn-ghost px-4 py-2 text-sm">
          ← Önceki
        </Link>
      ) : null}
      {pages.map((p, i) => {
        const prev = pages[i - 1]
        const gap = prev != null && p - prev > 1
        return (
          <span key={p} className="inline-flex items-center gap-2">
            {gap ? <span className="px-1 text-stone-400">…</span> : null}
            <Link
              to={buildHref(p)}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium ${
                p === page
                  ? 'bg-ink text-white'
                  : 'border border-line bg-white text-stone-700 hover:bg-surface-muted'
              }`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </Link>
          </span>
        )
      })}
      {page < totalPages ? (
        <Link to={buildHref(page + 1)} className="site-btn-ghost px-4 py-2 text-sm">
          Sonraki →
        </Link>
      ) : null}
    </nav>
  )
}
