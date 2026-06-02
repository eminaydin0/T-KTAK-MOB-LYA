import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CarouselSlide } from '../../core/site/types'
import { HomeCarousel } from './HomeCarousel'
import { catalogAnchor, contactPath } from '../sitePaths'

type Props = {
  siteName: string
  title: string
  fallbackSubtitle: string
  slides: CarouselSlide[]
}

export function HomeCinemaHero({ siteName, title, fallbackSubtitle, slides }: Props) {
  const [slideIndex, setSlideIndex] = useState(0)
  const hasSlides = slides.length > 0
  const activeSlide = hasSlides ? slides[slideIndex] : null
  const liveSubtitle = activeSlide?.subtitle?.trim() || fallbackSubtitle

  const onSlideChange = useCallback((index: number) => {
    setSlideIndex(index)
  }, [])

  useEffect(() => {
    setSlideIndex(0)
  }, [slides])

  return (
    <section className="home-cinema home-breakout site-enter" aria-label="Giriş">
      <div className="home-cinema-stage">
        {hasSlides ? (
          <HomeCarousel slides={slides} variant="cinema" onSlideChange={onSlideChange} />
        ) : (
          <div className="home-cinema-fallback" />
        )}
        <div className="home-cinema-vignette" aria-hidden />
      </div>

      <div className="home-cinema-copy">
        {activeSlide?.title ? (
          <p className="home-cinema-chip" key={activeSlide.id}>
            {activeSlide.title}
          </p>
        ) : null}
        <p className="home-cinema-brand">{siteName}</p>
        <h1 className="home-cinema-title home-display">{title}</h1>
        <p className="home-cinema-lead">{liveSubtitle}</p>
        <div className="home-cinema-actions">
          <a href={catalogAnchor()} className="home-cinema-cta home-cinema-cta--solid">
            Koleksiyonu keşfet
          </a>
          <Link to={contactPath()} className="home-cinema-cta home-cinema-cta--line">
            Showroom randevusu
          </Link>
        </div>
        {hasSlides && slides.length > 1 ? (
          <p className="home-cinema-progress" aria-live="polite">
            <span className="tabular-nums">{String(slideIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/35"> / </span>
            <span className="tabular-nums text-white/45">{String(slides.length).padStart(2, '0')}</span>
          </p>
        ) : null}
      </div>
    </section>
  )
}
