import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { IconExternal, IconPanelLeft } from '../components/AdminNavIcons'
import { AdminSidebar } from '../components/AdminSidebar'

export function AdminLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  return (
    <div className="min-h-dvh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-100 via-stone-50 to-stone-100 text-stone-900">
      {/* Mobil ust bar */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-stone-200/80 bg-white/85 px-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200/90 bg-gradient-to-b from-white to-stone-50 text-stone-700 shadow-sm transition hover:border-amber-200 hover:text-amber-950"
          aria-label="Menuyu ac"
        >
          <IconPanelLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700/90">EMIN</p>
          <p className="truncate text-sm font-semibold text-stone-900">Yonetim paneli</p>
        </div>
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-800 transition hover:border-amber-200 hover:bg-amber-50/80"
        >
          <IconExternal className="h-3.5 w-3.5 opacity-70" />
          Site
        </Link>
      </header>

      {/* Overlay */}
      <button
        type="button"
        aria-label="Menuyu kapat"
        className={`fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-dvh flex-col pt-14 lg:flex-row lg:items-stretch lg:pt-0">
        <AdminSidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:min-h-dvh">
          {/* Ince masaustu bandi — tekrar yok, sadece baglam */}
          <header className="hidden border-b border-stone-200/60 bg-white/40 px-6 py-3 backdrop-blur-sm lg:block">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-stone-500">
                <span className="font-medium text-stone-700">Yonetim</span>
                <span className="text-stone-400"> · </span>
                <span className="hidden sm:inline">Icerik ve siparisler yerel olarak tarayicida saklanir.</span>
              </p>
              <p
                className="hidden shrink-0 font-mono text-[10px] text-stone-400 sm:block"
                title="Vite ortam modu (teknik)"
              >
                {import.meta.env.MODE}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-4 py-1.5 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50/70 hover:text-amber-950"
              >
                <IconExternal className="h-3.5 w-3.5" />
                Canli site
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
