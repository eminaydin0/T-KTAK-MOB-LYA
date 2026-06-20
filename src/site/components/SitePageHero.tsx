import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Props = {
  kicker?: string
  title: string
  lead?: string
  children?: ReactNode
  className?: string
}

/** İç sayfa üst başlığı — katalog, setler, kategori vb. */
export function SitePageHero({ kicker, title, lead, children, className }: Props) {
  return (
    <header className={cn('site-page-hero', className)}>
      {kicker ? <p className="site-page-kicker">{kicker}</p> : null}
      <h1 className="site-page-hero-title home-display">{title}</h1>
      {lead ? <p className="site-page-hero-lead">{lead}</p> : null}
      {children}
    </header>
  )
}
