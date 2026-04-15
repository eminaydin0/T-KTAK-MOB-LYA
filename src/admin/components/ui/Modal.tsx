import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  footer?: ReactNode
}

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ open, onClose, title, description, size = 'md', children, footer }: Props) {
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/35 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="Modal disina tikla, kapat"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`relative z-10 flex max-h-[min(90vh,720px)] w-full flex-col rounded-t-3xl border border-stone-200/90 bg-gradient-to-b from-white to-stone-50 shadow-2xl shadow-stone-900/10 ring-1 ring-stone-200/60 transition-transform duration-200 sm:rounded-3xl ${sizeClass[size]}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-200 px-6 py-5">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-stone-900">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1.5 text-sm leading-relaxed text-stone-600">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="!p-2 !px-2 text-stone-500 hover:text-stone-900"
            aria-label="Kapat"
          >
            <span className="text-xl leading-none">×</span>
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-stone-200 bg-stone-50/80 px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body
  )
}
