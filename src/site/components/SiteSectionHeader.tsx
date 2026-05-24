import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  as?: 'h1' | 'h2' | 'h3'
  action?: ReactNode
  className?: string
}

export function SiteSectionHeader({ title, subtitle, as: Tag = 'h2', action, className = '' }: Props) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${className}`.trim()}>
      <div>
        <Tag className="site-section-title">{title}</Tag>
        {subtitle ? <p className="site-body mt-2 max-w-2xl">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
