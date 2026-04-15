import { useEffect, useState } from 'react'
import type { CarouselSlide } from '../../core/site/types'

type Props = {
  slides: CarouselSlide[]
}

const AUTO_MS = 6500

export function HomeCarousel({ slides }: Props) {
  const sorted = [...slides].sort((a, b) => a.order - b.order)
  const [i, setI] = useState(0)

  useEffect(() => {
    setI(0)
  }, [slides])

  useEffect(() => {
    if (sorted.length <= 1) return
    const t = window.setInterval(() => {
      setI((x) => (x + 1) % sorted.length)
    }, AUTO_MS)
    return () => window.clearInterval(t)
  }, [sorted.length])

  if (sorted.length === 0) return null

  const slide = sorted[i]!

  return (
    <section className="site-card flex h-full flex-col overflow-hidden" aria-roledescription="carousel" aria-label="Öne çıkan kampanyalar">
      <div className="relative min-h-[220px] w-full sm:min-h-[260px] lg:aspect-[2.25/1] lg:min-h-[380px]">
        {sorted.map((s, idx) => (
          <img
            key={s.id}
            src={s.imageUrl || 'https://via.placeholder.com/1200x500?text=Gorsel'}
            alt={s.title || 'Slayt görseli'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              idx === i ? 'z-[1] opacity-100' : 'z-0 opacity-0'
            } ${idx === i ? 'motion-safe:animate-carousel-ken motion-reduce:animate-none' : ''}`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-white/92 via-white/55 to-transparent sm:from-white/88 sm:via-white/40" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-stone-900/25 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-[3] flex flex-col justify-end p-6 sm:p-8 lg:max-w-[56%] lg:pb-10 lg:pl-10">
          {slide.linkUrl.trim() ? (
            <a
              href={slide.linkUrl}
              className="group block text-left"
              {...(slide.linkUrl.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <h2 className="site-hero-title">{slide.title || 'Başlık'}</h2>
              {slide.subtitle ? <p className="site-body mt-2.5 max-w-xl">{slide.subtitle}</p> : null}
            </a>
          ) : (
            <>
              <h2 className="site-hero-title">{slide.title || 'Başlık'}</h2>
              {slide.subtitle ? <p className="site-body mt-2.5 max-w-xl">{slide.subtitle}</p> : null}
            </>
          )}
        </div>

        {sorted.length > 1 ? (
          <>
            <div className="absolute bottom-0 left-0 right-0 z-[4] h-0.5 bg-stone-200/80">
              <div
                key={i}
                className="h-full w-full origin-left scale-x-0 bg-cotta motion-safe:animate-carousel-progress motion-reduce:scale-x-100 motion-reduce:animate-none"
              />
            </div>
            <button
              type="button"
              aria-label="Önceki slayt"
              className="absolute left-4 top-1/2 z-[5] flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-stone-200 bg-white/95 text-lg text-[#333333] shadow-soft backdrop-blur-sm transition hover:border-cotta hover:text-cotta sm:left-5"
              onClick={() => setI((x) => (x - 1 + sorted.length) % sorted.length)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Sonraki slayt"
              className="absolute right-4 top-1/2 z-[5] flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-stone-200 bg-white/95 text-lg text-[#333333] shadow-soft backdrop-blur-sm transition hover:border-cotta hover:text-cotta sm:right-5"
              onClick={() => setI((x) => (x + 1) % sorted.length)}
            >
              ›
            </button>
            <div className="absolute bottom-6 left-0 right-0 z-[5] flex justify-center gap-2 sm:bottom-8">
              {sorted.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Slayt ${idx + 1}`}
                  aria-current={idx === i}
                  className={`h-1.5 transition-all ${
                    idx === i ? 'w-8 bg-cotta' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                  onClick={() => setI(idx)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}
