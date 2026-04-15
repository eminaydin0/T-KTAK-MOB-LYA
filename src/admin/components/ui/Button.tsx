import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-amber-400 to-amber-500 text-stone-900 shadow-md shadow-amber-500/15 hover:from-amber-300 hover:to-amber-400 focus-visible:ring-amber-400',
  secondary:
    'border border-stone-300 bg-white text-stone-800 shadow-sm hover:bg-stone-50 focus-visible:ring-stone-400',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-stone-400',
  danger:
    'border border-red-200 bg-red-50 text-red-700 shadow-sm hover:bg-red-100 focus-visible:ring-red-400',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
  loading?: boolean
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  loading = false,
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Spinner className="!h-4 !w-4 border-t-current" /> : null}
      {children}
    </button>
  )
}
