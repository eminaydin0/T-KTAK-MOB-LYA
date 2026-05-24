import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  imageUrls: string[] | undefined
  name: string
}

function listFrom(urls: string[] | undefined) {
  if (!urls?.length) return []
  return urls.map((u) => String(u).trim()).filter(Boolean)
}

function IconZoom() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  )
}

function IconExpand() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
    </svg>
  )
}

/** Ürün detay galerisi — küçük resimler, hover yakınlaştırma, tam ekran lightbox */
export function ProductDetailGallery({ imageUrls, name }: Props) {
  const list = useMemo(() => listFrom(imageUrls), [imageUrls])
  const [idx, setIdx] = useState(0)
  const [hoverZoom, setHoverZoom] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%')
  const [lightbox, setLightbox] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const stageRef = useRef<HTMLDivElement>(null)

  const safeIdx = list.length === 0 ? 0 : ((idx % list.length) + list.length) % list.length
  const current = list[safeIdx]

  useEffect(() => setIdx(0), [list.join('|')])

  const go = useCallback(
    (delta: number) => {
      if (list.length <= 1) return
      setIdx((i) => (i + delta + list.length) % list.length)
    },
    [list.length]
  )

  const openLightbox = useCallback(() => {
    setLightboxZoom(1)
    setLightbox(true)
  }, [])

  const closeLightbox = useCallback(() => setLightbox(false), [])

  useEffect(() => {
    if (!lightbox) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === '+' || e.key === '=') setLightboxZoom((z) => Math.min(3, z + 0.25))
      if (e.key === '-') setLightboxZoom((z) => Math.max(1, z - 0.25))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox, closeLightbox, go])

  const onStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverZoom || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomOrigin(`${x}% ${y}%`)
  }

  if (list.length === 0) {
    return (
      <div className="flex aspect-[4/3] max-h-[380px] items-center justify-center rounded-site-lg border border-line bg-surface-muted text-sm text-stone-500">
        Görsel eklenmemiş
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {list.length > 1 ? (
          <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:max-h-[380px] sm:w-[72px] sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:pb-0">
            {list.map((url, j) => (
              <button
                key={`${url.slice(-24)}-${j}`}
                type="button"
                onClick={() => setIdx(j)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-[68px] sm:w-full ${
                  j === safeIdx
                    ? 'border-cotta ring-2 ring-cotta/20'
                    : 'border-line opacity-80 hover:border-stone-300 hover:opacity-100'
                }`}
                aria-label={`Görsel ${j + 1}`}
                aria-current={j === safeIdx}
              >
                <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="relative min-w-0 flex-1">
          <div
            ref={stageRef}
            className={`group relative aspect-[4/3] max-h-[380px] overflow-hidden rounded-site-lg border border-line bg-surface-muted ${
              hoverZoom ? 'cursor-zoom-in' : 'cursor-zoom-in'
            }`}
            onMouseMove={onStageMove}
            onMouseEnter={() => setHoverZoom(true)}
            onMouseLeave={() => {
              setHoverZoom(false)
              setZoomOrigin('50% 50%')
            }}
            onClick={openLightbox}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openLightbox()
              }
            }}
            aria-label={`${name} — tam ekran görüntüle`}
          >
            {current ? (
              <img
                src={current}
                alt={name}
                className="h-full w-full object-cover transition duration-300 ease-out"
                style={{
                  transform: hoverZoom ? 'scale(1.75)' : 'scale(1)',
                  transformOrigin: zoomOrigin,
                }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-stone-900/25 to-transparent" />

            <div className="absolute left-3 top-3 flex flex-wrap gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <span className="site-badge-soft bg-white/95 text-[11px] font-medium text-stone-700">
                Yakınlaştır
              </span>
            </div>

            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                className="site-btn-icon h-9 w-9 bg-white/95"
                aria-label="Tam ekran"
                onClick={(e) => {
                  e.stopPropagation()
                  openLightbox()
                }}
              >
                <IconExpand />
              </button>
            </div>

            {list.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Önceki görsel"
                  className="site-btn-icon absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/95 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    go(-1)
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Sonraki görsel"
                  className="site-btn-icon absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/95 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    go(1)
                  }}
                >
                  ›
                </button>
                <span className="site-panel absolute bottom-3 right-3 bg-white/95 font-semibold tabular-nums backdrop-blur-sm">
                  {safeIdx + 1} / {list.length}
                </span>
              </>
            ) : null}
          </div>

          <p className="site-caption mt-2 flex items-center gap-1.5 text-stone-500">
            <IconZoom />
            Fare ile yakınlaştırın veya tam ekran açın
          </p>
        </div>
      </div>

      {lightbox && current
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex flex-col bg-stone-950/98"
              role="dialog"
              aria-modal="true"
              aria-label={`${name} — galeri`}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{name}</p>
                  {list.length > 1 ? (
                    <p className="text-xs text-stone-400">
                      {safeIdx + 1} / {list.length}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="site-btn-icon h-9 w-9 border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    aria-label="Uzaklaştır"
                    onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.25))}
                  >
                    −
                  </button>
                  <span className="min-w-12 text-center text-xs tabular-nums text-stone-300">
                    {Math.round(lightboxZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    className="site-btn-icon h-9 w-9 border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    aria-label="Yakınlaştır"
                    onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.25))}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="site-btn-ghost ml-2 border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                    onClick={closeLightbox}
                  >
                    Kapat
                  </button>
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
                {list.length > 1 ? (
                  <button
                    type="button"
                    className="site-btn-icon absolute left-4 z-10 h-11 w-11 border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    aria-label="Önceki"
                    onClick={() => go(-1)}
                  >
                    ‹
                  </button>
                ) : null}

                <img
                  src={current}
                  alt={name}
                  className="max-h-full max-w-full object-contain transition duration-200"
                  style={{ transform: `scale(${lightboxZoom})` }}
                  draggable={false}
                />

                {list.length > 1 ? (
                  <button
                    type="button"
                    className="site-btn-icon absolute right-4 z-10 h-11 w-11 border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    aria-label="Sonraki"
                    onClick={() => go(1)}
                  >
                    ›
                  </button>
                ) : null}
              </div>

              {list.length > 1 ? (
                <div className="flex justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
                  {list.map((url, j) => (
                    <button
                      key={`lb-${j}`}
                      type="button"
                      onClick={() => setIdx(j)}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded border-2 ${
                        j === safeIdx ? 'border-cotta' : 'border-white/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>,
            document.body
          )
        : null}
    </>
  )
}
