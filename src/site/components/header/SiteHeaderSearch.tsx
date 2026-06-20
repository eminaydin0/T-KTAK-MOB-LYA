import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from '../../../lib/motion'
import { catalogPanel } from '../../../lib/motion-variants'
import { catalogPath } from '../../sitePaths'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SiteHeaderSearch({ open, onOpenChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenChange])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    onOpenChange(false)
    navigate(q ? `${catalogPath()}?q=${encodeURIComponent(q)}` : catalogPath())
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="site-header-search"
          role="search"
          variants={catalogPanel}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <form className="site-header-search-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="header-search">
              Ürün ara
            </label>
            <input
              ref={inputRef}
              id="header-search"
              className="site-header-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ne arıyorsunuz? — koltuk, masa, set…"
              autoComplete="off"
            />
            <button type="submit" className="site-btn-accent shrink-0 px-5 py-2 text-sm">
              Ara
            </button>
            <button
              type="button"
              className="site-btn-ghost shrink-0 px-3 py-2 text-sm normal-case tracking-normal"
              onClick={() => onOpenChange(false)}
              aria-label="Aramayı kapat"
            >
              ✕
            </button>
          </form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
