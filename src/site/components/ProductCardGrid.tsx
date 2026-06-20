import type { ReactNode } from 'react'
import { Stagger, StaggerItem } from '../../components/motion'
import { cn } from '../../lib/cn'

type GridProps = {
  children: ReactNode
  className?: string
  mosaic?: boolean
}

/** Katalog ızgarası — Stagger ile kartlar sırayla belirir */
export function ProductCardGrid({ children, className, mosaic }: GridProps) {
  return (
    <Stagger className={cn('home-product-grid', mosaic && 'home-product-grid--mosaic', className)}>
      {children}
    </Stagger>
  )
}

type ItemProps = {
  children: ReactNode
  className?: string
}

export function ProductCardGridItem({ children, className }: ItemProps) {
  return <StaggerItem className={className}>{children}</StaggerItem>
}
