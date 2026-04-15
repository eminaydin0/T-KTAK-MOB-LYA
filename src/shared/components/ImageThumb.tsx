import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  emptyClassName?: string
}

export function ImageThumb({ src, alt, className = '', emptyClassName = '' }: Props) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-[10px] text-gray-500 ${emptyClassName}`}
      >
        Gorsel yok
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
