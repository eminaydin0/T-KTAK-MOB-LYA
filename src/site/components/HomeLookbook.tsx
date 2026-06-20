import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { Reveal } from '../../components/motion'
import { BlurText } from '../../components/react-bits'
import { carouselHeroSrc } from '../../lib/carouselImage'
import { ImageThumb } from '../../shared/components/ImageThumb'
import type { CarouselSlide } from '../../core/site/types'

type Props = {
  slides: CarouselSlide[]
  title: string
  subtitle?: string
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function slideMotion(index: number, offset: number, slideWidth: number) {
  if (slideWidth <= 0) {
    return { focus: index === 0 ? 1 : 0, imageScale: 1, imageX: 0 }
  }

  const center = index * slideWidth
  const distance = Math.abs(offset - center) / slideWidth
  const focus = clamp01(1 - distance)
  const imageScale = 1.04 + (1 - focus) * 0.05
  const imageX = (offset - center) * 0.08

  return { focus, imageScale, imageX }
}

function LookbookCard({
  slide,
  index,
  total,
  offset,
  slideWidth,
}: {
  slide: CarouselSlide
  index: number
  total: number
  offset: number
  slideWidth: number
}) {
  const hasImg = Boolean(slide.imageUrl?.trim())
  const href = slide.linkUrl?.trim() || '/katalog'
  const { focus, imageScale, imageX } = slideMotion(index, offset, slideWidth)

  return (
    <Link to={href} className="home-lookbook-card group">
      <div className="home-lookbook-media">
        <div
          className="home-lookbook-media-inner"
          style={{
            transform: `translate3d(${imageX}px, 0, 0) scale(${imageScale})`,
          }}
        >
          {hasImg ? (
            <ImageThumb
              src={carouselHeroSrc(slide.imageUrl)}
              alt=""
              className="site-img-zoom h-full w-full object-cover"
              emptyClassName="flex h-full w-full items-center justify-center bg-stone-200"
              priority={index < 2}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-300 to-stone-500">
              <span className="font-display text-7xl font-light text-white/25 sm:text-8xl">
                {slide.title.slice(0, 1)}
              </span>
            </div>
          )}
        </div>

        <div className="home-lookbook-shade" aria-hidden />

        <div
          className="home-lookbook-copy"
          style={{
            opacity: 0.28 + focus * 0.72,
            transform: `translate3d(0, ${(1 - focus) * 18}px, 0)`,
          }}
        >
          <div className="home-lookbook-copy-top">
            <span className="home-lookbook-eyebrow">EMIN</span>
            <span className="home-lookbook-index">
              {String(index + 1).padStart(2, '0')}
              <span className="text-white/35"> / {String(total).padStart(2, '0')}</span>
            </span>
          </div>

          <div className="home-lookbook-copy-main">
            <p className="home-lookbook-kicker">EMIN Mobilya</p>
            <h3 className="home-lookbook-name home-display">{slide.title}</h3>
            <p className="home-lookbook-lead">{slide.subtitle}</p>
            <div className="home-lookbook-foot">
              <span className="home-lookbook-stat">Showroom & keşif</span>
              <span className="home-lookbook-stat-dot" aria-hidden>
                ·
              </span>
              <span className="home-lookbook-stat">Ölçüye özel üretim</span>
              <span className="home-lookbook-cta">
                Devam et
                <span aria-hidden> →</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function HomeLookbook({ slides, title, subtitle }: Props) {
  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const travelRef = useRef(0)
  const scrollModeRef = useRef(true)
  const [travel, setTravel] = useState(0)
  const [offset, setOffset] = useState(0)
  const [progress, setProgress] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)
  const [pinHeight, setPinHeight] = useState<number | null>(null)
  const [scrollMode, setScrollMode] = useState(true)

  const syncFromScroll = useCallback(() => {
    const pin = pinRef.current
    if (!pin || !scrollModeRef.current || travelRef.current <= 0) return

    const rect = pin.getBoundingClientRect()
    const range = pin.offsetHeight - window.innerHeight
    if (range <= 0) return

    const p = clamp01(-rect.top / range)
    const nextOffset = p * travelRef.current

    setProgress(p)
    setOffset(nextOffset)
  }, [])

  const measure = useCallback(() => {
    const rail = railRef.current
    const viewport = viewportRef.current
    if (!rail || !viewport) return

    const vw = viewport.clientWidth
    const isSm = window.matchMedia('(min-width: 640px)').matches
    const sidePad = isSm ? 64 : 40
    const gap = isSm ? 20 : 16
    const maxCard = 672

    const fullSlide = vw
    const peekCard = Math.min(vw - sidePad, maxCard)

    const maxAtFull = Math.max(0, slides.length * fullSlide - fullSlide)
    const nextScrollMode = maxAtFull > 48 && slides.length >= 5

    const cardWidth = nextScrollMode ? fullSlide : peekCard
    const step = nextScrollMode ? fullSlide : peekCard + gap

    viewport.style.setProperty('--lookbook-slide', `${cardWidth}px`)

    travelRef.current = nextScrollMode ? maxAtFull : 0
    scrollModeRef.current = nextScrollMode

    setSlideWidth(step)
    setTravel(nextScrollMode ? maxAtFull : 0)
    setPinHeight(nextScrollMode ? maxAtFull + window.innerHeight : null)
    setScrollMode(nextScrollMode)
    syncFromScroll()
  }, [slides.length, syncFromScroll])

  useLayoutEffect(() => {
    measure()

    const rail = railRef.current
    if (!rail) return

    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    if (viewportRef.current) ro.observe(viewportRef.current)
    window.addEventListener('resize', measure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [slides, measure])

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      scrollModeRef.current = false
      setScrollMode(false)
      return
    }

    syncFromScroll()
    window.addEventListener('scroll', syncFromScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', syncFromScroll)
    }
  }, [syncFromScroll, scrollMode, travel])

  useLenis(() => {
    syncFromScroll()
  })

  useLayoutEffect(() => {
    if (scrollMode) return

    const viewport = viewportRef.current
    if (!viewport) return

    const onHorizontalScroll = () => {
      setOffset(viewport.scrollLeft)
      if (slideWidth > 0 && slides.length > 1) {
        setProgress(clamp01(viewport.scrollLeft / (slideWidth * (slides.length - 1))))
      }
    }

    onHorizontalScroll()
    viewport.addEventListener('scroll', onHorizontalScroll, { passive: true })

    return () => {
      viewport.removeEventListener('scroll', onHorizontalScroll)
    }
  }, [scrollMode, slideWidth, slides.length])

  const scrollByStep = (dir: -1 | 1) => {
    const vp = viewportRef.current
    if (!vp) return
    const step = slideWidth || vp.clientWidth
    vp.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const onViewportKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollByStep(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollByStep(1)
    }
  }

  if (slides.length === 0) return null

  const activeSlide = travel > 0 ? Math.min(slides.length, Math.round(progress * (slides.length - 1)) + 1) : 1

  const cards = slides.map((slide, index) => (
    <LookbookCard
      key={slide.id}
      slide={slide}
      index={index}
      total={slides.length}
      offset={offset}
      slideWidth={slideWidth}
    />
  ))

  const hint = subtitle?.trim() || 'Aşağı kaydırın — markamızı keşfedin'

  return (
    <section id="lookbook" className="home-lookbook" aria-labelledby="home-lookbook-title">
      <div className="home-lookbook-shell">
        {scrollMode && pinHeight ? (
          <div ref={pinRef} className="home-lookbook-pin" style={{ height: pinHeight }}>
            <div className="home-lookbook-sticky">
              <div className="home-lookbook-head home-lookbook-head--pinned">
                <div>
                  <BlurText
                    as="h2"
                    id="home-lookbook-title"
                    text={title}
                    className="home-lookbook-title"
                    delay={80}
                    immediate
                  />
                  <p className="home-lookbook-hint">{hint}</p>
                </div>
                <span className="home-lookbook-counter tabular-nums" aria-live="polite">
                  {String(activeSlide).padStart(2, '0')}
                  <span className="text-stone-300"> / </span>
                  {String(slides.length).padStart(2, '0')}
                </span>
              </div>

              <div className="home-lookbook-progress" aria-hidden>
                <div className="home-lookbook-progress-fill" style={{ transform: `scaleX(${progress})` }} />
              </div>

              <div ref={viewportRef} className="home-lookbook-rail-viewport">
                <div
                  ref={railRef}
                  className="home-lookbook-rail home-lookbook-rail--scroll"
                  style={{ transform: `translate3d(-${offset}px, 0, 0)` }}
                >
                  {cards}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Reveal className="home-lookbook-head">
              <BlurText
                as="h2"
                id="home-lookbook-title"
                text={title}
                className="home-lookbook-title"
                delay={80}
                rootMargin="-8% 0px"
              />
              <p className="home-lookbook-hint">Kaydırarak gezinin</p>
            </Reveal>
            <div
              ref={viewportRef}
              className="home-lookbook-rail-viewport home-lookbook-rail-viewport--scroll"
              data-lenis-prevent
              tabIndex={0}
              onKeyDown={onViewportKey}
            >
              <div ref={railRef} className="home-lookbook-rail">
                {cards}
              </div>
              <div className="home-lookbook-controls">
                <button
                  type="button"
                  aria-label="Önceki koleksiyon"
                  className="site-btn-icon home-lookbook-prev"
                  onClick={() => scrollByStep(-1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Sonraki koleksiyon"
                  className="site-btn-icon home-lookbook-next"
                  onClick={() => scrollByStep(1)}
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
