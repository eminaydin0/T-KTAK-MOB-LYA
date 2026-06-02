import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../../core/context/CartContext'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { BackToTop } from '../components/BackToTop'
import { CartPreviewModal } from '../components/CartPreviewModal'
import { SocialLinks } from '../components/SocialLinks'
import { SiteNavCategoryMenu } from '../components/SiteNavCategoryMenu'
import { cartPath, categoryPath, checkoutPath, packagesAnchor } from '../sitePaths'

function isAdminNavHref(href: string) {
  const path = href.split('#')[0].replace(/\/$/, '') || '/'
  return path === '/admin' || path.startsWith('/admin/')
}

function navItemActive(href: string, pathname: string, hash: string) {
  const [pathPart, hashPart] = href.split('#')
  const path = pathPart.replace(/\/$/, '') || '/'
  if (hashPart) {
    return pathname === (path || '/') && hash === `#${hashPart}`
  }
  if (path === '/') return pathname === '/' && !hash
  return pathname === path || pathname.startsWith(`${path}/`)
}

function navLinkClassName(href: string, pathname: string, hash: string, extra = '') {
  const active = navItemActive(href, pathname, hash)
  return ['site-nav-link', active ? 'site-nav-link--active' : '', extra].filter(Boolean).join(' ')
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

function isExternal(href: string) {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  )
}

function FooterColTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="site-eyebrow mb-4 font-semibold text-ink">{children}</h3>
  )
}

function SiteBrandMark({ name }: { name: string }) {
  return (
    <Link to="/" className="site-brand-title transition duration-site ease-site hover:text-cotta">
      {name}
    </Link>
  )
}

export function SiteLayout() {
  const { data, activeLocale, setActiveLocale, resolvedContent } = useSite()
  const { settings, navigation, languages } = data
  const { categories, products } = useCatalog()
  const { totalItems, openPreview } = useCart()
  const content = resolvedContent
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const headerNav = useMemo(() => {
    const items = [...navigation]
      .filter((n) => n.placement === 'header' && !isAdminNavHref(n.href))
      .sort((a, b) => a.order - b.order)
    const hasPackages = items.some((n) => n.href === packagesAnchor() || n.href.includes('#packages'))
    if (!hasPackages) {
      items.push({
        id: 'builtin-nav-packages',
        label: 'Paketler',
        href: packagesAnchor(),
        openInNewTab: false,
        order: 98,
        placement: 'header',
      })
    }
    return items.sort((a, b) => a.order - b.order)
  }, [navigation])
  const footerNav = useMemo(
    () =>
      [...navigation].filter((n) => n.placement === 'footer').sort((a, b) => a.order - b.order),
    [navigation]
  )

  const enabledLangs = useMemo(() => languages.filter((l) => l.enabled), [languages])

  const footerCategories = useMemo(() => categories.slice(0, 10), [categories])

  const categoriesWithCount = useMemo(() => {
    const counts = new Map<number, number>()
    for (const p of products) {
      counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)
    }
    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      count: counts.get(c.id) ?? 0,
      imageUrl: c.imageUrl,
    }))
  }, [categories, products])

  useEffect(() => {
    document.documentElement.lang = activeLocale
  }, [activeLocale])

  useEffect(() => {
    setMobileOpen(false)
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

  return (
    <div className="min-h-dvh bg-surface-soft antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cotta focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:shadow-lg"
      >
        İçeriğe geç
      </a>

      <div className="site-topbar">
        {settings.contactPhone ? (
          <span>
            <span className="font-semibold text-cotta">Müşteri hattı</span>
            <span className="mx-2 text-stone-300">·</span>
            <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="hover:text-ink">
              {settings.contactPhone}
            </a>
          </span>
        ) : (
          <span>Ücretsiz keşif ve randevu için iletişime geçin</span>
        )}
      </div>

      <header className="sticky top-0 z-50 border-b border-line/50 bg-white/88 backdrop-blur-md">
        <div className="mx-auto grid max-w-site grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3 sm:px-8">
          <div className="flex min-w-0 items-center justify-start gap-3 lg:gap-6">
            <button
              type="button"
              className="site-btn-icon shrink-0 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-nav"
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menü'}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
              </span>
            </button>
            <nav className="hidden min-w-0 items-center gap-5 lg:flex xl:gap-7" aria-label="Ana menü">
              {headerNav.map((item) => {
                const className = navLinkClassName(item.href, location.pathname, location.hash)
                return isExternal(item.href) ? (
                  <a
                    key={item.id}
                    href={item.href}
                    className={className}
                    {...(item.openInNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.id} to={item.href || '/'} className={className}>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="justify-self-center px-1">
            <SiteBrandMark name={settings.siteName || 'Vitrin'} />
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <div className="hidden md:block">
              <SiteNavCategoryMenu categories={categoriesWithCount} />
            </div>
            <button
              type="button"
              className="relative site-btn-icon"
              onClick={() => openPreview()}
              aria-label={totalItems > 0 ? `Sepet, ${totalItems} ürün` : 'Sepeti aç'}
            >
              <IconCart />
              {totalItems > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cotta px-1 text-[10px] font-semibold leading-none text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              ) : null}
            </button>
            <Link to={cartPath()} className="site-btn-ghost hidden px-3 py-2 text-xs sm:inline-flex">
              Sepet
            </Link>
            <Link
              to="/iletisim"
              className="site-btn-accent hidden px-4 py-2 text-xs md:inline-flex"
            >
              Teklif al
            </Link>
            {enabledLangs.length > 1 ? (
              <label className="hidden items-center lg:flex">
                <select
                  value={activeLocale}
                  onChange={(e) => setActiveLocale(e.target.value)}
                  className="site-input py-2 text-xs shadow-soft"
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
      </header>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[1px] lg:hidden"
            aria-label="Kapat"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="site-mobile-nav"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100vw,340px)] flex-col border-l border-line bg-white shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between site-divide-b px-5 py-4">
              <span className="site-overline text-stone-800">Menü</span>
              <button
                type="button"
                className="site-btn-ghost px-3 py-1 text-sm normal-case tracking-normal"
                onClick={() => setMobileOpen(false)}
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <nav className="flex flex-col gap-0.5" aria-label="Mobil menü">
                {headerNav.map((item) => {
                  const className = navLinkClassName(
                    item.href,
                    location.pathname,
                    location.hash,
                    'site-divide-b py-3'
                  )
                  return isExternal(item.href) ? (
                    <a
                      key={item.id}
                      href={item.href}
                      className={className}
                      {...(item.openInNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.id} to={item.href || '/'} className={className}>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-4 space-y-2">
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
                <Link
                  to="/iletisim"
                  className="site-btn-ghost w-full py-3 text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Teklif & iletişim
                </Link>
              </div>

              {categoriesWithCount.length > 0 ? (
                <div className="mt-8 border-t border-line pt-6">
                  <p className="site-overline">Kategoriler</p>
                  <ul className="mt-3 space-y-1">
                    {categoriesWithCount.map((c) => (
                      <li key={c.id}>
                        <Link
                          to={categoryPath(c)}
                          className="flex items-center justify-between gap-3 py-2.5 text-sm text-stone-700 hover:text-cotta"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            {c.imageUrl?.trim() ? (
                              <span className="h-9 w-9 shrink-0 overflow-hidden border border-line bg-surface-muted">
                                <ImageThumb
                                  src={c.imageUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                  emptyClassName="flex h-full w-full items-center justify-center text-xs text-stone-400"
                                />
                              </span>
                            ) : null}
                            <span className="truncate">{c.name}</span>
                          </span>
                          <span className="shrink-0 tabular-nums text-xs text-stone-400">{c.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {enabledLangs.length > 1 ? (
                <label className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6 text-sm text-stone-600">
                  Dil
                  <select
                    value={activeLocale}
                    onChange={(e) => setActiveLocale(e.target.value)}
                    className="site-input py-2"
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
        </>
      ) : null}

      <main id="main" className="mx-auto max-w-site px-5 py-10 sm:px-8 sm:py-14 md:py-16">
        <Outlet />
      </main>

      <section className="bg-surface-muted" aria-label="İletişim">
        <div className="mx-auto flex max-w-site flex-col items-center justify-between gap-6 px-5 py-12 text-center sm:flex-row sm:text-left sm:px-8 md:py-14">
          <div>
            <h2 className="site-section-title">Teklif & randevu</h2>
            <p className="site-body mt-3 max-w-md">
              Ürün seçimi ve fiyatlandırma için bizimle iletişime geçin.
            </p>
          </div>
          <Link to="/iletisim" className="site-btn-accent shrink-0 px-8 py-3 md:px-10">
            İletişim
          </Link>
        </div>
      </section>

      <footer id="footer" className="bg-white text-stone-500">
        <div className="mx-auto max-w-site px-5 py-14 sm:px-8 lg:py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            <div>
              <FooterColTitle>{settings.siteName}</FooterColTitle>
              <p className="text-sm leading-relaxed text-stone-500">{settings.siteTagline}</p>
              <SocialLinks
                instagram={settings.socialInstagram}
                whatsapp={settings.socialWhatsApp}
                className="mt-6"
              />
            </div>

            <div>
              <FooterColTitle>Kurumsal</FooterColTitle>
              <ul className="space-y-2.5 text-sm">
                {footerNav.map((item) =>
                  isExternal(item.href) ? (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className="transition hover:text-cotta"
                        {...(item.openInNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {item.label}
                      </a>
                    </li>
                  ) : (
                    <li key={item.id}>
                      <Link to={item.href || '/'} className="transition hover:text-cotta">
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <FooterColTitle>Kategoriler</FooterColTitle>
              <ul className="space-y-2.5 text-sm">
                {footerCategories.map((c) => (
                  <li key={c.id}>
                    <Link to={categoryPath(c)} className="transition hover:text-cotta">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <FooterColTitle>İletişim</FooterColTitle>
              <ul className="space-y-2.5 text-sm">
                {settings.contactEmail ? (
                  <li>
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-cotta">
                      {settings.contactEmail}
                    </a>
                  </li>
                ) : null}
                {settings.contactPhone ? <li className="text-stone-700">{settings.contactPhone}</li> : null}
                {settings.contactAddress ? <li className="leading-relaxed text-stone-500">{settings.contactAddress}</li> : null}
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-line pt-8 text-center text-xs text-stone-400">
            <p>{content.footerText}</p>
            <p className="mt-2">© {new Date().getFullYear()} {settings.siteName}</p>
          </div>
        </div>
      </footer>

      <BackToTop />
      <CartPreviewModal />
    </div>
  )
}
