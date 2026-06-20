import type { ReactNode } from 'react'
import { motion, useReducedMotion } from '../../lib/motion'
import { cn } from '../../lib/cn'
import { staggerContainer, staggerItem } from '../../lib/motion-variants'

type Props = {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul' | 'ol'
}

export function Stagger({ children, className, as = 'div' }: Props) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Component
      className={cn(className)}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-4% 0px' }}
    >
      {children}
    </Component>
  )
}

type ItemProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
}

export function StaggerItem({ children, className, as = 'div' }: ItemProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Component className={cn(className)} variants={staggerItem}>
      {children}
    </Component>
  )
}
