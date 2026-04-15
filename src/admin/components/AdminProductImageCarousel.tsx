import { useEffect, useMemo, useState } from 'react'

type Props = {
  imageUrls: string[] | undefined
  name: string
  className?: string
}

function normalizeList(urls: string[] | undefined): string[] {
  if (!urls?.length) return []
  return urls.map((u) => String(u).trim()).filter(Boolean)
}

/**
 * Admin urun detay: tek fotoda sabit kutu; birden fazlaysa carousel (ok, nokta, 5 sn otomatik).
 * Not: parent her render `?? []` ile yeni dizi vermemeli — AdminProductsPage sabit EMPTY kullanir.
 */
export function AdminProductImageCarousel({ imageUrls, name, className = '' }: Props) {
  const list = useMemo(() => normalizeList(imageUrls), [imageUrls])
  const [i, setI] = useState(0)

  useEffect(() => {
    setI(0)
  }, [list.length])

  useEffect(() => {
    if (list.length <= 1) return
    const t = window.setInterval(() => {
      setI((x) => (x + 1) % list.length)
    }, 5000)
    return () => window.clearInterval(t)
  }, [list.length])

  const idx = list.length === 0 ? 0 : ((i % list.length) + list.length) % list.length
  const slide = list[idx]

  const frame = `relative w-full max-w-[360px] overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100 shadow-md ring-1 ring-stone-200/60 ${className}`

  if (list.length === 0) {
    return (
      <div className={`${frame} flex aspect-[4/3] min-h-[220px] items-center justify-center text-sm text-stone-500`}>
        Gorsel yok
      </div>
    )
  }

  if (list.length === 1) {
    return (
      <div className={frame}>
        <div className="relative aspect-[4/3] w-full min-h-[200px]">
          <img
            src={list[0]}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={frame}>
      <div className="relative aspect-[4/3] w-full min-h-[200px]">
        {slide ? (
          <img
            key={`slide-${idx}`}
            src={slide}
            alt={`${name} — ${idx + 1}/${list.length}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : null}
        <button
          type="button"
          aria-label="Onceki gorsel"
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl leading-none text-white shadow-sm backdrop-blur-sm transition hover:bg-black/60"
          onClick={() => setI((x) => (x - 1 + list.length) % list.length)}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Sonraki gorsel"
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl leading-none text-white shadow-sm backdrop-blur-sm transition hover:bg-black/60"
          onClick={() => setI((x) => (x + 1) % list.length)}
        >
          ›
        </button>
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
          {list.map((_, j) => (
            <button
              key={j}
              type="button"
              aria-label={`Gorsel ${j + 1}`}
              aria-current={j === idx}
              className={`h-2 rounded-full transition-all ${
                j === idx ? 'w-7 bg-white shadow' : 'w-2 bg-white/55 hover:bg-white/85'
              }`}
              onClick={() => setI(j)}
            />
          ))}
        </div>
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
          {idx + 1} / {list.length}
        </div>
      </div>
    </div>
  )
}
