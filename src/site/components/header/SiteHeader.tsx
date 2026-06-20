import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from '../../../lib/motion'
import { drawerSlideRight, overlayFade } from '../../../lib/motion-variants'
import { cn } from '../../../lib/cn'
import { useCart } from '../../../core/context/CartContext'
import { ImageThumb } from '../../../shared/components/ImageThumb'
import {
  cartPath,
  catalogPath,
  categoryPath,
  checkoutPath,
  contactPath,
  packagesPath,
} from '../../sitePaths'
import { SiteHeaderMegaMenu, type HeaderCategory } from './SiteHeaderMegaMenu'
import { SiteHeaderSearch } from './SiteHeaderSearch'

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconCart({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconChevron({ className, open }: { className?: string; open?: boolean }) {
  return (
    <motion.svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.28 }}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </motion.svg>
  )
}

type NavItem = { id: string; label: string; href: string; openInNewTab?: boolean }

type Props = {
  siteName: string
  tagline?: string
  contactPhone?: string
  categories: HeaderCategory[]
  headerNav: NavItem[]
  enabledLangs: { code: string; name: string }[]
  activeLocale: string
  onLocaleChange: (code: string) => void
}

function navActive(href: string, pathname: string, hash: string) {
  const [pathPart, hashPart] = href.split('#')
  const path = pathPart.replace(/\/$/, '') || '/'
  if (hashPart) return pathname === (path || '/') && hash === `#${hashPart}`
  if (path === '/') return pathname === '/' && !hash
  return pathname === path || pathname.startsWith(`${path}/`)
}

function isCatalogRoute(pathname: string) {
  return pathname === '/katalog' || pathname.startsWith('/kategori/')
}

export function SiteHeader({
  siteName,
  tagline,
  contactPhone,
  categories,
  headerNav,
  enabledLangs,
  activeLocale,
  onLocaleChange,
}: Props) {
  const location = useLocation()
  const { totalItems, openPreview } = useCart()
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCatsOpen, setMobileCatsOpen] = useState(true)

  const activeCategorySlug = useMemo(() => {
    const m = location.pathname.match(/^\/kategori\/([^/]+)/)
    return m ? decodeURIComponent(m[1]!) : null
  }, [location.pathname])

  const closePanels = () => {
    setMegaOpen(false)
    setSearchOpen(false)
  }

  useEffect(() => {
    setMobileOpen(false)
    closePanels()
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const headerElevated = megaOpen || searchOpen

  return (
    <header className={cn('site-header', headerElevated && 'site-header--elevated')}>
      <div className="site-topbar">
        <div className="site-topbar-inner">
          {contactPhone ? (
            <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="site-topbar-phone">
              {contactPhone}
            </a>
          ) : (
            <span className="site-topbar-phone">Showroom & randevu</span>
          )}
          {tagline ? (
            <span className="site-topbar-tag hidden md:block">{tagline}</span>
          ) : null}
          <Link to={contactPath()} className="site-topbar-cta hidden sm:inline-flex">
            Randevu al
          </Link>
        </div>
      </div>

      <div className="site-header-bar">
        <div className="site-header-inner">
          <div className="site-header-start">
            <button
              type="button"
              className="site-header-menu-btn lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-nav"
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menü'}
              onClick={() => {
                closePanels()
                setMobileOpen((o) => !o)
              }}
            >
              <span className="site-header-menu-icon" aria-hidden>
                <span />
                <span />
              </span>
            </button>
            <Link to="/" className="site-brand-title" onClick={closePanels}>
              {siteName}
            </Link>
          </div>

          <nav className="site-header-nav hidden lg:flex" aria-label="Ana menü">
            <button
              type="button"
              className={cn(
                'site-header-nav-trigger',
                (megaOpen || activeCategorySlug) && 'site-header-nav-trigger--active'
              )}
              aria-expanded={megaOpen}
              aria-controls="site-mega-menu"
              onClick={() => {
                setSearchOpen(false)
                setMegaOpen((o) => !o)
              }}
            >
              Koleksiyonlar
              <IconChevron open={megaOpen} className="opacity-60" />
            </button>

            <Link
              to={catalogPath()}
              className={cn(
                'site-header-nav-link',
                isCatalogRoute(location.pathname) && 'site-header-nav-link--active'
              )}
              onClick={closePanels}
            >
              Katalog
            </Link>

            <Link
              to={packagesPath()}
              className={cn(
                'site-header-nav-link',
                (location.pathname === packagesPath() || location.pathname.startsWith('/paket/')) &&
                'site-header-nav-link--active'
              )}
              onClick={closePanels}
            >
              Setler
            </Link>
          </nav>

          <div className="site-header-actions">
            <button
              type="button"
              className={cn('site-header-action', searchOpen && 'site-header-action--active')}
              aria-expanded={searchOpen}
              aria-label="Ara"
              onClick={() => {
                setMegaOpen(false)
                setSearchOpen((o) => !o)
              }}
            >
              <IconSearch className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              className="site-header-action site-header-action--cart"
              onClick={() => {
                closePanels()
                openPreview()
              }}
              aria-label={totalItems > 0 ? `Sepet, ${totalItems} ürün` : 'Sepeti aç'}
            >
              <IconCart className="h-[18px] w-[18px]" />
              {totalItems > 0 ? (
                <span className="site-header-cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>
              ) : null}
            </button>

            <Link
              to={contactPath()}
              className="site-btn-accent site-header-cta hidden sm:inline-flex"
              onClick={closePanels}
            >
              Teklif al
            </Link>

            {enabledLangs.length > 1 ? (
              <label className="site-header-lang hidden xl:flex">
                <select
                  value={activeLocale}
                  onChange={(e) => onLocaleChange(e.target.value)}
                  className="site-header-lang-select"
                  aria-label="Dil"
                >
                  {enabledLangs.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        </div>

        <SiteHeaderSearch open={searchOpen} onOpenChange={setSearchOpen} />
      </div>

      <SiteHeaderMegaMenu
        categories={categories}
        open={megaOpen}
        onOpenChange={setMegaOpen}
        activeSlug={activeCategorySlug}
      />

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              className="site-mobile-backdrop lg:hidden"
              aria-label="Kapat"
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="site-mobile-nav"
              className="site-mobile-drawer lg:hidden"
              variants={drawerSlideRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="site-mobile-head">
                <span className="site-overline">Menü</span>
                <button
                  type="button"
                  className="site-btn-ghost px-3 py-1 text-sm normal-case tracking-normal"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Kapat"
                >
                  ✕
                </button>
              </div>

              <div className="site-mobile-body">
                <SiteHeaderSearchMobile onNavigate={() => setMobileOpen(false)} />

                {categories.length > 0 ? (
                  <div className="site-mobile-section">
                    <button
                      type="button"
                      className="site-mobile-section-trigger"
                      aria-expanded={mobileCatsOpen}
                      onClick={() => setMobileCatsOpen((o) => !o)}
                    >
                      Koleksiyonlar
                      <IconChevron open={mobileCatsOpen} />
                    </button>
                    {mobileCatsOpen ? (
                      <ul className="site-mobile-cat-grid">
                        {categories.map((c) => (
                          <li key={c.id}>
                            <Link
                              to={categoryPath(c)}
                              className={cn(
                                'site-mobile-cat-tile',
                                activeCategorySlug === c.slug && 'site-mobile-cat-tile--active'
                              )}
                              onClick={() => setMobileOpen(false)}
                            >
                              <span className="site-mobile-cat-media">
                                {c.imageUrl?.trim() ? (
                                  <ImageThumb
                                    src={c.imageUrl}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    emptyClassName="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400"
                                  />
                                ) : (
                                  <span className="flex h-full w-full items-center justify-center bg-stone-100 font-display text-lg text-stone-300">
                                    {c.name.slice(0, 1)}
                                  </span>
                                )}
                              </span>
                              <span className="site-mobile-cat-name">{c.name}</span>
                              <span className="site-mobile-cat-count">{c.count}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}

                <nav className="site-mobile-links" aria-label="Mobil menü">
                  {headerNav.map((item) => {
                    const active = navActive(item.href, location.pathname, location.hash)
                    return (
                      <Link
                        key={item.id}
                        to={item.href || '/'}
                        className={cn('site-mobile-link', active && 'site-mobile-link--active')}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                  <Link
                    to={contactPath()}
                    className="site-mobile-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    İletişim
                  </Link>
                </nav>

                <div className="site-mobile-actions">
                  <button
                    type="button"
                    className="site-btn-accent flex w-full items-center justify-center gap-2 py-3"
                    onClick={() => {
                      setMobileOpen(false)
                      openPreview()
                    }}
                  >
                    <IconCart className="h-5 w-5" />
                    Sepet {totalItems > 0 ? `(${totalItems})` : ''}
                  </button>
                  <Link
                    to={cartPath()}
                    className="site-btn-ghost w-full py-3 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sepet sayfası
                  </Link>
                  {totalItems > 0 ? (
                    <Link
                      to={checkoutPath()}
                      className="site-btn-ghost w-full py-3 text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Ödemeye geç
                    </Link>
                  ) : null}
                </div>

                {enabledLangs.length > 1 ? (
                  <label className="site-mobile-lang">
                    Dil
                    <select
                      value={activeLocale}
                      onChange={(e) => onLocaleChange(e.target.value)}
                      className="site-input py-2 text-sm"
                    >
                      {enabledLangs.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function SiteHeaderSearchMobile({ onNavigate }: { onNavigate: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    onNavigate()
    navigate(q ? `${catalogPath()}?q=${encodeURIComponent(q)}` : catalogPath())
  }

  return (
    <form className="site-mobile-search" role="search" onSubmit={onSubmit}>
      <input
        className="site-mobile-search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ürün ara…"
        aria-label="Ürün ara"
      />
      <button type="submit" className="site-mobile-search-btn" aria-label="Ara">
        <IconSearch className="h-4 w-4" />
      </button>
    </form>
  )
}
