import { useCallback, useEffect, useState } from 'react'
import type { CarouselSlide } from '../../core/site/types'

type Props = {
  slides: CarouselSlide[]
  variant?: 'card' | 'immersive'
}

const AUTO_MS = 7000

export function HomeCarousel({ slides, variant = 'card' }: Props) {
  const sorted = [...slides].sort((a, b) => a.order - b.order)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    setI(0)
  }, [slides])

  useEffect(() => {
    for (const s of sorted) {
      const url = s.imageUrl?.trim()
      if (!url) continue
      const img = new Image()
      img.decoding = 'async'
      img.src = url
    }
  }, [sorted])

  const go = useCallback(
    (next: number) => {
      setI(((next % sorted.length) + sorted.length) % sorted.length)
    },
    [sorted.length]
  )

  useEffect(() => {
    if (sorted.length <= 1 || paused) return
    const t = window.setInterval(() => go(i + 1), AUTO_MS)
    return () => window.clearInterval(t)
  }, [sorted.length, paused, i, go])

  if (sorted.length === 0) return null

  const slide = sorted[i]!
  const immersive = variant === 'immersive'

  const shell = immersive
    ? 'relative w-full overflow-hidden bg-stone-100'
    : 'site-card flex h-full flex-col overflow-hidden'

  const frameClass = immersive
    ? 'relative aspect-[2.1/1] max-h-[min(36vh,400px)] min-h-[200px] w-full'
    : 'relative min-h-[200px] w-full sm:min-h-[220px] lg:aspect-[2.25/1] lg:max-h-[300px]'

  return (
    <section
      className={shell}
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={frameClass}>
        {sorted.map((s, idx) => (
          <img
            key={s.id}
            src={s.imageUrl || 'https://via.placeholder.com/1200x500?text=Gorsel'}
            alt={s.title || 'Slayt görseli'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-out motion-reduce:transition-none ${
              idx === i ? 'z-[1] opacity-100' : 'z-0 opacity-0'
            }`}
            loading={idx <= 1 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={idx === i ? 'high' : 'low'}
          />
        ))}

        <div
          className={
            immersive
              ? 'pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-stone-950/70 via-transparent to-stone-900/5'
              : 'pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-white/90 via-white/40 to-transparent'
          }
        />
        {!immersive ? (
          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-stone-900/20 via-transparent to-transparent" />
        ) : null}

        {immersive ? (
          <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-3 px-4 pb-3 pt-10 sm:px-5 sm:pb-4">
            <div className="min-w-0 text-left text-white">
              {slide.linkUrl.trim() ? (
                <a
                  href={slide.linkUrl}
                  className="block hover:opacity-90"
                  {...(slide.linkUrl.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <p className="text-sm font-semibold leading-snug sm:text-base">{slide.title || 'Başlık'}</p>
                  {slide.subtitle ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/75">{slide.subtitle}</p>
                  ) : null}
                </a>
              ) : (
                <>
                  <p className="text-sm font-semibold leading-snug sm:text-base">{slide.title || 'Başlık'}</p>
                  {slide.subtitle ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/75">{slide.subtitle}</p>
                  ) : null}
                </>
              )}
            </div>
            {sorted.length > 1 ? (
              <span className="shrink-0 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white/90 backdrop-blur-sm">
                {i + 1} / {sorted.length}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 z-[3] flex max-w-[85%] flex-col justify-end p-5 sm:p-6">
            {slide.linkUrl.trim() ? (
              <a
                href={slide.linkUrl}
                className="block text-left"
                {...(slide.linkUrl.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <h2 className="site-hero-title text-lg sm:text-xl">{slide.title || 'Başlık'}</h2>
                {slide.subtitle ? <p className="site-body mt-1.5 line-clamp-2">{slide.subtitle}</p> : null}
              </a>
            ) : (
              <>
                <h2 className="site-hero-title text-lg sm:text-xl">{slide.title || 'Başlık'}</h2>
                {slide.subtitle ? <p className="site-body mt-1.5 line-clamp-2">{slide.subtitle}</p> : null}
              </>
            )}
          </div>
        )}

        {sorted.length > 1 ? (
          <>
            <div className="absolute bottom-0 left-0 right-0 z-[4] h-px bg-white/20">
              <div
                key={`${i}-${paused}`}
                className="h-full origin-left bg-cotta motion-safe:animate-carousel-progress motion-reduce:w-full motion-reduce:animate-none"
              />
            </div>
            <div className="absolute bottom-3 right-3 z-[5] flex items-center gap-1.5 sm:bottom-3.5 sm:right-4">
              <button
                type="button"
                aria-label="Önceki slayt"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/35 text-sm text-white backdrop-blur-sm transition hover:bg-black/50"
                onClick={() => go(i - 1)}
              >
                ‹
              </button>
              <div className="hidden items-center gap-1 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm sm:flex">
                {sorted.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Slayt ${idx + 1}`}
                    aria-current={idx === i}
                    className={`rounded-full transition-all ${
                      idx === i ? 'h-1.5 w-4 bg-cotta' : 'h-1.5 w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                    onClick={() => go(idx)}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Sonraki slayt"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/35 text-sm text-white backdrop-blur-sm transition hover:bg-black/50"
                onClick={() => go(i + 1)}
              >
                ›
              </button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
