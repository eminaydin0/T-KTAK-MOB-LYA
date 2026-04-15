import { useEffect, useState } from 'react'
import { ImageThumb } from '../../shared/components/ImageThumb'

type Props = {
  name: string
  imageUrls: string[]
  className?: string
  thumbClassName?: string
  emptyClassName?: string
}

/** Birden fazla urun fotografi: ana gorsel + kucuk secim */
export function ProductImageGallery({
  name,
  imageUrls,
  className = 'h-20 w-24 shrink-0 rounded-lg',
  thumbClassName,
  emptyClassName,
}: Props) {
  const list = imageUrls.filter((u) => u.trim() !== '')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(0)
  }, [imageUrls.join('|')])

  if (list.length === 0) {
    return (
      <ImageThumb
        src=""
        alt=""
        className={className}
        emptyClassName={
          emptyClassName ??
          'flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400'
        }
      />
    )
  }

  const i = Math.min(idx, list.length - 1)
  const main = list[i]!

  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      <ImageThumb
        src={main}
        alt={name}
        className={thumbClassName ?? className}
        emptyClassName={emptyClassName}
      />
      {list.length > 1 ? (
        <div className="flex max-w-[7.5rem] flex-wrap gap-1">
          {list.map((url, j) => (
            <button
              key={`${url.slice(0, 40)}-${j}`}
              type="button"
              onClick={() => setIdx(j)}
              className={`overflow-hidden rounded border-2 transition ${
                j === i ? 'border-blue-600 ring-1 ring-blue-200' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
              aria-label={`Gorsel ${j + 1}`}
            >
              <img src={url} alt="" className="h-7 w-9 object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
