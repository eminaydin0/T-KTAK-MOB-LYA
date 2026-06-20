type Props = {
  page: number
  totalPages: number
  buildHref?: (page: number) => string
  onPageChange?: (page: number) => void
}

export function CatalogPagination({ page, totalPages, buildHref, onPageChange }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  const pageClass = (active: boolean) =>
    `inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition duration-soft ease-soft ${
      active
        ? 'bg-ink text-white'
        : 'border border-line bg-white text-stone-700 hover:border-stone-300 hover:bg-surface-soft'
    }`

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return
    onPageChange?.(p)
  }

  return (
    <nav className="catalog-browse-pagination" aria-label="Sayfalama">
      {page > 1 ? (
        onPageChange ? (
          <button type="button" className="site-btn-ghost px-5 py-2.5 text-sm" onClick={() => go(page - 1)}>
            ← Önceki
          </button>
        ) : buildHref ? (
          <a href={buildHref(page - 1)} className="site-btn-ghost px-5 py-2.5 text-sm" rel="prev">
            ← Önceki
          </a>
        ) : null
      ) : null}

      {pages.map((p, i) => {
        const prev = pages[i - 1]
        const gap = prev != null && p - prev > 1
        return (
          <span key={p} className="inline-flex items-center gap-2">
            {gap ? <span className="px-1 text-stone-400">…</span> : null}
            {onPageChange ? (
              <button
                type="button"
                className={pageClass(p === page)}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => go(p)}
              >
                {p}
              </button>
            ) : buildHref ? (
              <a
                href={buildHref(p)}
                className={pageClass(p === page)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </a>
            ) : null}
          </span>
        )
      })}

      {page < totalPages ? (
        onPageChange ? (
          <button type="button" className="site-btn-ghost px-5 py-2.5 text-sm" onClick={() => go(page + 1)}>
            Sonraki →
          </button>
        ) : buildHref ? (
          <a href={buildHref(page + 1)} className="site-btn-ghost px-5 py-2.5 text-sm" rel="next">
            Sonraki →
          </a>
        ) : null
      ) : null}
    </nav>
  )
}
