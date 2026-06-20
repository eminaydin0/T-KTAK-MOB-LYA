import { useCallback, useEffect, useState } from 'react'
import type { CarouselSlide } from '../../core/site/types'
import {
  CAROUSEL_HERO_SIZES,
  carouselHeroSrc,
  carouselHeroSrcSet,
} from '../../lib/carouselImage'

type Props = {
  slides: CarouselSlide[]
  variant?: 'card' | 'immersive' | 'cinema'
  onSlideChange?: (index: number) => void
}

export const CAROUSEL_AUTO_MS = 7000

export function HomeCarousel({ slides, variant = 'card', onSlideChange }: Props) {
  const sorted = [...slides].sort((a, b) => a.order - b.order)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  const cinema = variant === 'cinema'
  const immersive = variant === 'immersive' || cinema

  useEffect(() => {
    setI(0)
  }, [slides])

  useEffect(() => {
    onSlideChange?.(i)
  }, [i, onSlideChange])

  useEffect(() => {
    for (const s of sorted) {
      const url = carouselHeroSrc(s.imageUrl ?? '')
      if (!url) continue
      const img = new Image()
      img.decoding = 'async'
      if (carouselHeroSrcSet(s.imageUrl ?? '')) {
        img.srcset = carouselHeroSrcSet(s.imageUrl ?? '')!
        img.sizes = CAROUSEL_HERO_SIZES
      }
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
    const t = window.setInterval(
      () => setI((prev) => ((prev + 1) % sorted.length + sorted.length) % sorted.length),
      CAROUSEL_AUTO_MS
    )
    return () => window.clearInterval(t)
  }, [sorted.length, paused])

  if (sorted.length === 0) return null

  const slide = sorted[i]!

  const shell = cinema
    ? 'absolute inset-0 h-full w-full overflow-hidden'
    : immersive
      ? 'relative w-full overflow-hidden bg-stone-100'
      : 'site-card flex h-full flex-col overflow-hidden'

  const frameClass = cinema
    ? 'relative h-full min-h-[72dvh] w-full sm:min-h-[78dvh]'
    : immersive
      ? 'relative aspect-[4/5] max-h-[min(68vh,640px)] min-h-[280px] w-full sm:aspect-[16/10] lg:aspect-[2.2/1] lg:max-h-[min(52vh,560px)]'
      : 'relative min-h-[200px] w-full sm:min-h-[220px] lg:aspect-[2.25/1] lg:max-h-[300px]'

  const cinemaZoomStyle = {
    ['--cinema-zoom-duration' as string]: `${CAROUSEL_AUTO_MS}ms`,
  }

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
      <div className={frameClass} style={cinema ? cinemaZoomStyle : undefined}>
        {cinema ? (
          sorted.map((s, idx) => {
            const active = idx === i
            const src = carouselHeroSrc(s.imageUrl ?? '')
            const srcSet = carouselHeroSrcSet(s.imageUrl ?? '')
            return (
              <div
                key={s.id}
                className={`home-cinema-slide ${active ? 'z-[1] opacity-100' : 'z-0 opacity-0'}`}
                aria-hidden={!active}
              >
                <img
                  key={active ? `zoom-${i}` : `idle-${s.id}`}
                  src={src || 'https://via.placeholder.com/1200x500?text=Gorsel'}
                  srcSet={srcSet}
                  sizes={srcSet ? CAROUSEL_HERO_SIZES : undefined}
                  alt={active ? s.title || 'Slayt görseli' : ''}
                  className={`home-cinema-slide-img ${active ? 'home-cinema-slide-img--active' : ''}`}
                  loading={idx <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={active ? 'high' : 'low'}
                />
              </div>
            )
          })
        ) : (
          sorted.map((s, idx) => {
            const src = carouselHeroSrc(s.imageUrl ?? '')
            const srcSet = carouselHeroSrcSet(s.imageUrl ?? '')
            return (
            <img
              key={s.id}
              src={src || 'https://via.placeholder.com/1200x500?text=Gorsel'}
              srcSet={srcSet}
              sizes={srcSet ? CAROUSEL_HERO_SIZES : undefined}
              alt={s.title || 'Slayt görseli'}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-soft ease-soft motion-reduce:transition-none ${
                idx === i
                  ? `z-[1] opacity-100 ${immersive ? 'motion-safe:animate-home-ken-burns motion-reduce:animate-none' : ''}`
                  : 'z-0 scale-100 opacity-0'
              }`}
              loading={idx <= 1 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={idx === i ? 'high' : 'low'}
            />
            )
          })
        )}

        {!cinema ? (
          <div
            className={
              immersive
                ? 'pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-stone-950/70 via-transparent to-stone-900/5'
                : 'pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-white/90 via-white/40 to-transparent'
            }
          />
        ) : null}
        {!immersive ? (
          <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-stone-900/20 via-transparent to-transparent" />
        ) : null}

        {immersive && !cinema ? (
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
        ) : !cinema ? (
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
        ) : null}

        {sorted.length > 1 ? (
          <>
            {!cinema ? (
              <div className="absolute bottom-0 left-0 right-0 z-[4] h-px bg-white/20">
                <div
                  key={`${i}-${paused}`}
                  className="h-full origin-left bg-cotta motion-safe:animate-carousel-progress motion-reduce:w-full motion-reduce:animate-none"
                />
              </div>
            ) : null}
            <div
              className={`absolute z-[5] flex items-center gap-1.5 ${
                cinema ? 'bottom-6 right-6 sm:bottom-8 sm:right-10' : 'bottom-3 right-3 sm:bottom-3.5 sm:right-4'
              }`}
            >
              <button
                type="button"
                aria-label="Önceki slayt"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-sm text-white backdrop-blur-sm transition hover:bg-black/50"
                onClick={() => go(i - 1)}
              >
                ‹
              </button>
              {!cinema ? (
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
              ) : null}
              <button
                type="button"
                aria-label="Sonraki slayt"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-sm text-white backdrop-blur-sm transition hover:bg-black/50"
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
