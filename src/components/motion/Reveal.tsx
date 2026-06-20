import type { ReactNode } from 'react'
import { motion, useReducedMotion } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { easeSite } from '../../lib/motion-variants'

type Props = {
  children: ReactNode
  className?: string
  id?: string
  'aria-labelledby'?: string
  'aria-label'?: string
  /** Gecikme (saniye) */
  delay?: number
  /** Dikey kayma (px); reduced-motion'da 0 */
  y?: number
  /** Viewport margin — erken tetikleme için negatif değer */
  margin?: string
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'footer'
}

export function Reveal({
  children,
  className,
  id,
  'aria-labelledby': ariaLabelledby,
  'aria-label': ariaLabel,
  delay = 0,
  y = 16,
  margin = '-6% 0px',
  as = 'div',
}: Props) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      id={id}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      className={cn(className)}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={{ duration: 0.85, delay, ease: easeSite }}
    >
      {children}
    </Component>
  )
}
