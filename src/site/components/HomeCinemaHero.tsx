import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CarouselSlide } from '../../core/site/types'
import { motion, useReducedMotion } from '../../lib/motion'
import { easeSite, staggerContainer, staggerItem } from '../../lib/motion-variants'
import { BlurText, ShinyText } from '../../components/react-bits'
import { HomeCarousel } from './HomeCarousel'
import { catalogPath, contactPath } from '../sitePaths'

type Props = {
  siteName: string
  title: string
  fallbackSubtitle: string
  slides: CarouselSlide[]
}

function shortChip(text: string, max = 36) {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max).trimEnd()}…`
}

export function HomeCinemaHero({ siteName, title, fallbackSubtitle, slides }: Props) {
  const [slideIndex, setSlideIndex] = useState(0)
  const reduced = useReducedMotion()
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
    <section className="home-cinema home-breakout" aria-label="Giriş">
      <div className="home-cinema-stage">
        {hasSlides ? (
          <HomeCarousel slides={slides} variant="cinema" onSlideChange={onSlideChange} />
        ) : (
          <div className="home-cinema-fallback" />
        )}
        <div className="home-cinema-vignette" aria-hidden />
      </div>

      <motion.div
        className="home-cinema-copy"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : 'hidden'}
        animate={reduced ? undefined : 'visible'}
      >
        {activeSlide?.title ? (
          <motion.p className="home-cinema-chip" key={activeSlide.id} variants={staggerItem}>
            <ShinyText
              text={shortChip(activeSlide.title)}
              color="rgba(255,255,255,0.55)"
              shineColor="rgba(255,255,255,0.95)"
              speed={3}
              spread={120}
              yoyo
              pauseOnHover={false}
            />
          </motion.p>
        ) : null}
        <BlurText
          as="h1"
          text={title}
          immediate
          className="home-cinema-title home-display"
          delay={70}
          animateBy="words"
          animationFrom={{ filter: 'blur(10px)', opacity: 0, y: 28 }}
          animationTo={[
            { filter: 'blur(3px)', opacity: 0.55, y: 10 },
            { filter: 'blur(0px)', opacity: 1, y: 0 },
          ]}
          stepDuration={0.55}
        />
        <motion.p className="home-cinema-lead" variants={staggerItem}>
          {liveSubtitle}
        </motion.p>
        <motion.div className="home-cinema-actions" variants={staggerItem}>
          <Link to={catalogPath()} className="home-cinema-cta home-cinema-cta--primary">
            Koleksiyonu keşfet
          </Link>
          <Link to={contactPath()} className="home-cinema-cta home-cinema-cta--link">
            Randevu
          </Link>
        </motion.div>
        {hasSlides && slides.length > 1 ? (
          <motion.p
            className="home-cinema-progress"
            aria-live="polite"
            variants={staggerItem}
            key={slideIndex}
            initial={reduced ? false : { opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: easeSite }}
          >
            <span className="tabular-nums">{String(slideIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/30"> / </span>
            <span className="tabular-nums text-white/40">{String(slides.length).padStart(2, '0')}</span>
          </motion.p>
        ) : null}
        <p className="sr-only">{siteName}</p>
      </motion.div>
    </section>
  )
}
