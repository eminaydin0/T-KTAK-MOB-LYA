import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, type Transition } from '../../lib/motion'
import type { Easing } from 'motion/react'
import { cn } from '../../lib/cn'
import { easeSite } from '../../lib/motion-variants'

type BlurTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  id?: string
  className?: string
  delay?: number
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  immediate?: boolean
  animationFrom?: Record<string, string | number>
  animationTo?: Array<Record<string, string | number>>
  easing?: Easing | Easing[]
  stepDuration?: number
  onAnimationComplete?: () => void
}

function buildKeyframes(
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))])
  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

/** React Bits — BlurText (motion tabanlı, GSAP yok) */
export function BlurText({
  text,
  as: Tag = 'p',
  id,
  className,
  delay = 120,
  animateBy = 'words',
  direction = 'top',
  threshold = 0.12,
  rootMargin = '0px',
  immediate = false,
  animationFrom,
  animationTo,
  easing = easeSite,
  stepDuration = 0.42,
  onAnimationComplete,
}: BlurTextProps) {
  const reduced = useReducedMotion()
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(immediate)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (immediate || reduced) {
      setInView(true)
      return
    }
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [immediate, reduced, threshold, rootMargin])

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(8px)', opacity: 0, y: 22 }
        : { filter: 'blur(8px)', opacity: 0, y: 22 },
    [direction]
  )

  const defaultTo = useMemo(
    () => [
      { filter: 'blur(2px)', opacity: 0.65, y: 6 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    []
  )

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    )
  }

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo
  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  const MotionTag = motion[Tag]

  return (
    <MotionTag ref={ref as never} id={id} className={cn('flex flex-wrap', className)}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)
        const spanTransition: Transition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        }

        return (
          <motion.span
            key={`${segment}-${index}`}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        )
      })}
    </MotionTag>
  )
}
