import { useRef, useState, type MouseEventHandler, type PropsWithChildren } from 'react'
import { cn } from '../../lib/cn'

type SpotlightCardProps = PropsWithChildren<{
  className?: string
  spotlightColor?: string
}>

/** React Bits — SpotlightCard (hover ışık huzmesi, vitrin kartları) */
export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(180, 110, 80, 0.16)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 72%)`,
        }}
        aria-hidden
      />
      <div className="relative z-[2]">{children}</div>
    </div>
  )
}
