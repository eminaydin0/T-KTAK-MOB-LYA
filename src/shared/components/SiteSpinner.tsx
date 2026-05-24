type Props = {
  className?: string
  label?: string
}

export function SiteSpinner({ className = '', label }: Props) {
  return (
    <span className={`site-loading ${className}`.trim()} role="status">
      <span className="site-spinner" aria-hidden />
      {label ? <span>{label}</span> : <span className="sr-only">Yükleniyor</span>}
    </span>
  )
}
