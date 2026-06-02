import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'
import type { HomeCategoryItem } from './HomeCategoryBento'

type Props = {
  categories: HomeCategoryItem[]
  title: string
}

function LookbookCard({ c, index }: { c: HomeCategoryItem; index: number }) {
  const hasImg = Boolean(c.imageUrl?.trim())

  return (
    <Link to={categoryPath(c)} className="home-lookbook-card group">
      <div className="home-lookbook-media">
        {hasImg ? (
          <ImageThumb
            src={c.imageUrl!}
            alt=""
            className="site-img-zoom h-full w-full object-cover"
            emptyClassName="flex h-full w-full items-center justify-center bg-stone-200"
            priority={index < 3}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
            <span className="text-5xl font-light text-white/80">{c.name.slice(0, 1)}</span>
          </div>
        )}
        <div className="home-lookbook-shade" aria-hidden />
        <div className="home-lookbook-meta">
          <span className="home-lookbook-index">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0 flex-1">
            <p className="home-lookbook-name">{c.name}</p>
            <p className="home-lookbook-sub">{c.count} parça</p>
          </div>
          <span className="home-lookbook-go" aria-hidden>
            ↗
          </span>
        </div>
      </div>
    </Link>
  )
}

export function HomeLookbook({ categories, title }: Props) {
  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const targetOffsetRef = useRef(0)
  const targetProgressRef = useRef(0)
  const currentOffsetRef = useRef(0)
  const currentProgressRef = useRef(0)
  const rafRef = useRef(0)
  const [travel, setTravel] = useState(0)
  const [offset, setOffset] = useState(0)
  const [progress, setProgress] = useState(0)
  const [pinHeight, setPinHeight] = useState<number | null>(null)
  const [scrollMode, setScrollMode] = useState(true)

  const measure = useCallback(() => {
    const rail = railRef.current
    const viewport = viewportRef.current
    if (!rail || !viewport) return
    const slideW = viewport.clientWidth
    viewport.style.setProperty('--lookbook-slide', `${slideW}px`)
    const max = Math.max(0, categories.length * slideW - slideW)
    setTravel(max)
    setPinHeight(max > 48 ? max + window.innerHeight : null)
    setScrollMode(max > 48)
  }, [categories.length])

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
  }, [categories, measure])

  useEffect(() => {
    const pin = pinRef.current
    if (!pin || !scrollMode || travel <= 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setScrollMode(false)
      return
    }

    const tick = () => {
      const factor = 0.1
      const nextOffset =
        currentOffsetRef.current +
        (targetOffsetRef.current - currentOffsetRef.current) * factor
      const nextProgress =
        currentProgressRef.current +
        (targetProgressRef.current - currentProgressRef.current) * factor

      const offsetDone = Math.abs(nextOffset - targetOffsetRef.current) < 0.4
      const progressDone = Math.abs(nextProgress - targetProgressRef.current) < 0.002

      currentOffsetRef.current = offsetDone ? targetOffsetRef.current : nextOffset
      currentProgressRef.current = progressDone ? targetProgressRef.current : nextProgress

      setOffset(currentOffsetRef.current)
      setProgress(currentProgressRef.current)

      if (!offsetDone || !progressDone) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = 0
      }
    }

    const onScroll = () => {
      const rect = pin.getBoundingClientRect()
      const range = pin.offsetHeight - window.innerHeight
      if (range <= 0) return
      const p = Math.min(1, Math.max(0, -rect.top / range))
      targetProgressRef.current = p
      targetOffsetRef.current = p * travel
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [travel, scrollMode])

  if (categories.length === 0) return null

  const cards = categories.map((c, index) => <LookbookCard key={c.id} c={c} index={index} />)

  return (
    <section id="lookbook" className="home-lookbook site-enter" aria-labelledby="home-lookbook-title">
      <div className="home-lookbook-shell">
        {scrollMode && pinHeight ? (
          <div ref={pinRef} className="home-lookbook-pin" style={{ height: pinHeight }}>
            <div className="home-lookbook-sticky">
              <div className="home-lookbook-head home-lookbook-head--pinned">
                <div>
                  <h2 id="home-lookbook-title" className="home-lookbook-title">
                    {title}
                  </h2>
                  <p className="home-lookbook-hint">Aşağı kaydırın — koleksiyonlar yana açılır</p>
                </div>
                <span className="home-lookbook-counter tabular-nums" aria-live="polite">
                  {String(Math.min(categories.length, Math.floor(progress * categories.length) + 1)).padStart(2, '0')}
                  <span className="text-stone-300"> / </span>
                  {String(categories.length).padStart(2, '0')}
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
            <div className="home-lookbook-head">
              <h2 id="home-lookbook-title" className="home-lookbook-title">
                {title}
              </h2>
              <p className="home-lookbook-hint">Kaydırarak gezinin</p>
            </div>
            <div ref={viewportRef} className="home-lookbook-rail-viewport home-lookbook-rail-viewport--scroll">
              <div ref={railRef} className="home-lookbook-rail">
                {cards}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
