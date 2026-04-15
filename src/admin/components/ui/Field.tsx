import type { ReactNode } from 'react'

type Props = {
  label: string
  hint?: string
  error?: string
  children: ReactNode
  htmlFor?: string
  className?: string
}

export function Field({ label, hint, error, children, htmlFor, className = '' }: Props) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wide text-stone-500"
      >
        {label}
      </label>
      {children}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-stone-500">{hint}</p> : null}
    </div>
  )
}

export const inputClass =
  'w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/25'

export const selectClass = `${inputClass} cursor-pointer`
