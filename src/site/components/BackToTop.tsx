import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Yukarı çık"
      className="fixed bottom-6 right-5 z-40 flex h-10 w-10 items-center justify-center border border-cotta-dark/20 bg-cotta text-base text-white shadow-soft transition hover:bg-cotta-dark sm:bottom-8 sm:right-8"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  )
}
