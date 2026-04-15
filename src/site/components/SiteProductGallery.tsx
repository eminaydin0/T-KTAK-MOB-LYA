import { useEffect, useMemo, useState } from 'react'

type Props = {
  imageUrls: string[] | undefined
  name: string
}

function listFrom(urls: string[] | undefined) {
  if (!urls?.length) return []
  return urls.map((u) => String(u).trim()).filter(Boolean)
}

/** Vitrin ürün detay: büyük görsel alanı, çoklu fotoğrafta carousel */
export function SiteProductGallery({ imageUrls, name }: Props) {
  const list = useMemo(() => listFrom(imageUrls), [imageUrls])
  const [i, setI] = useState(0)

  useEffect(() => setI(0), [list.length])

  useEffect(() => {
    if (list.length <= 1) return
    const t = window.setInterval(() => setI((x) => (x + 1) % list.length), 6000)
    return () => window.clearInterval(t)
  }, [list.length])

  const idx = list.length === 0 ? 0 : ((i % list.length) + list.length) % list.length
  const slide = list[idx]

  const shell =
    'relative overflow-hidden border border-stone-200/90 bg-surface-muted shadow-soft'

  if (list.length === 0) {
    return (
      <div
        className={`${shell} flex aspect-[16/10] min-h-[240px] items-center justify-center text-stone-500`}
      >
        Görsel eklenmemiş
      </div>
    )
  }

  if (list.length === 1) {
    return (
      <div className={shell}>
        <div className="relative aspect-[16/10] w-full min-h-[260px]">
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
    <div className={shell}>
      <div className="relative aspect-[16/10] w-full min-h-[260px]">
        {slide ? (
          <img
            key={`g-${idx}`}
            src={slide}
            alt={`${name} — ${idx + 1}/${list.length}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/15 via-transparent to-transparent" />
        <button
          type="button"
          aria-label="Önceki"
          className="pointer-events-auto absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-stone-300 bg-white/95 text-xl text-[#333333] shadow-soft transition hover:border-cotta hover:text-cotta"
          onClick={() => setI((x) => (x - 1 + list.length) % list.length)}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Sonraki"
          className="pointer-events-auto absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-stone-300 bg-white/95 text-xl text-[#333333] shadow-soft transition hover:border-cotta hover:text-cotta"
          onClick={() => setI((x) => (x + 1) % list.length)}
        >
          ›
        </button>
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {list.map((_, j) => (
            <button
              key={j}
              type="button"
              aria-label={`Fotoğraf ${j + 1}`}
              aria-current={j === idx}
              className={`h-1.5 transition-all ${
                j === idx ? 'w-8 bg-cotta' : 'w-1.5 bg-white/90 hover:bg-white'
              }`}
              onClick={() => setI(j)}
            />
          ))}
        </div>
        <div className="absolute right-4 top-4 z-10 border border-stone-200/80 bg-white/95 px-3 py-1 text-[11px] font-semibold tabular-nums text-[#333333] shadow-soft backdrop-blur-sm">
          {idx + 1} / {list.length}
        </div>
      </div>
    </div>
  )
}
