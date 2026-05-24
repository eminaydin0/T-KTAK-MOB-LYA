import { useLayoutEffect, useRef, useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  emptyClassName?: string
  loading?: 'lazy' | 'eager'
  /** İlk ekran görselleri — öncelikli yükleme */
  priority?: boolean
}

function isImgReady(img: HTMLImageElement | null) {
  return Boolean(img && img.complete && img.naturalWidth > 0)
}

export function ImageThumb({
  src,
  alt,
  className = '',
  emptyClassName = '',
  loading = 'lazy',
  priority = false,
}: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    setFailed(false)
    setReady(false)
    if (!src?.trim()) return

    const img = imgRef.current
    if (isImgReady(img)) {
      setReady(true)
      return
    }

    const timeout = window.setTimeout(() => {
      if (isImgReady(imgRef.current)) {
        setReady(true)
      }
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [src])

  const bindImg = (node: HTMLImageElement | null) => {
    imgRef.current = node
    if (isImgReady(node)) {
      setReady(true)
    }
  }

  if (!src?.trim()) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-muted text-xs text-stone-400 ${emptyClassName}`}
      >
        Görsel yok
      </div>
    )
  }

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-muted text-xs text-stone-400 ${emptyClassName}`}
      >
        Görsel yok
      </div>
    )
  }

  return (
    <span className={`relative block overflow-hidden bg-surface-muted ${emptyClassName}`}>
      {!ready ? (
        <span className="absolute inset-0 z-[1] animate-pulse bg-stone-200/50" aria-hidden />
      ) : null}
      <img
        key={src}
        ref={bindImg}
        src={src}
        alt={alt}
        decoding="async"
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`relative z-[2] object-cover transition-opacity duration-200 ${className} ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
      />
    </span>
  )
}
