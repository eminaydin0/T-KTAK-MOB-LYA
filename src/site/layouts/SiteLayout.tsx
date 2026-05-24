import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { BackToTop } from '../components/BackToTop'
import { SocialLinks } from '../components/SocialLinks'
import { SiteNavCategoryMenu } from '../components/SiteNavCategoryMenu'
import { categoryPath } from '../sitePaths'

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
  const content = resolvedContent
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const headerNav = useMemo(
    () =>
      [...navigation].filter((n) => n.placement === 'header').sort((a, b) => a.order - b.order),
    [navigation]
  )
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
      name: c.name,
      count: counts.get(c.id) ?? 0,
      imageUrl: c.imageUrl,
    }))
  }, [categories, products])

  useEffect(() => {
    document.title = settings.seoTitle || settings.siteName || 'EMIN'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', settings.seoDescription || '')
  }, [settings.seoTitle, settings.siteName, settings.seoDescription])

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
            {settings.contactPhone}
          </span>
        ) : (
          <span>Ücretsiz keşif ve randevu için iletişime geçin</span>
        )}
      </div>

      <header className="sticky top-0 z-50 bg-white/90 shadow-soft backdrop-blur-md">
            <div className="mx-auto grid max-w-site grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-3.5 sm:px-8">
              <div className="flex min-w-0 items-center justify-start gap-4 lg:gap-8">
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-700 ring-1 ring-line lg:hidden"
                  aria-expanded={mobileOpen}
                  aria-controls="site-mobile-nav"
                  aria-label={mobileOpen ? 'Menüyü kapat' : 'Menü'}
                  onClick={() => setMobileOpen((o) => !o)}
                >
                  <span className="flex flex-col gap-1.5" aria-hidden>
                    <span className="h-px w-5 bg-current" />
                    <span className="h-px w-5 bg-current" />
                    <span className="h-px w-5 bg-current" />
                  </span>
                </button>
                <nav className="hidden min-w-0 items-center gap-6 lg:flex xl:gap-8" aria-label="Ana menü">
                  {headerNav.map((item) =>
                    isExternal(item.href) ? (
                      <a
                        key={item.id}
                        href={item.href}
                        className="site-nav-link"
                        {...(item.openInNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link key={item.id} to={item.href || '/'} className="site-nav-link">
                        {item.label}
                      </Link>
                    )
                  )}
                </nav>
              </div>

              <div className="justify-self-center px-1">
                <SiteBrandMark name={settings.siteName || 'Vitrin'} />
              </div>

              <div className="flex items-center justify-end gap-2 sm:gap-2.5">
                <div className="hidden sm:block">
                  <SiteNavCategoryMenu categories={categoriesWithCount} />
                </div>
                <Link
                  to="/#catalog"
                  className="relative hidden site-btn-ghost px-4 py-2 sm:inline-flex"
                >
                  Katalog
                  {products.length > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cotta px-1 text-[10px] font-medium leading-none text-white">
                      {products.length > 99 ? '99+' : products.length}
                    </span>
                  ) : null}
                </Link>
                {enabledLangs.length > 1 ? (
                  <label className="hidden items-center gap-1 lg:flex">
                    <select
                      value={activeLocale}
                      onChange={(e) => setActiveLocale(e.target.value)}
                      className="site-input py-2 text-xs shadow-soft"
                    >
                      {enabledLangs.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <Link
                  to="/admin"
                  className="site-btn-ghost hidden px-3 py-2 text-stone-500 sm:inline-flex"
                >
                  Yönetim
                </Link>
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
              <nav className="flex flex-col gap-1" aria-label="Mobil menü">
                {headerNav.map((item) =>
                  isExternal(item.href) ? (
                    <a
                      key={item.id}
                      href={item.href}
                      className="site-divide-b py-3 text-sm font-medium text-stone-700"
                      {...(item.openInNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.href || '/'}
                      className="site-divide-b py-3 text-sm font-medium text-stone-700"
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <Link
                  to="/#catalog"
                  className="site-btn-accent mt-3 w-full py-3"
                  onClick={() => setMobileOpen(false)}
                >
                  Katalog
                </Link>
                <Link
                  to="/admin"
                  className="site-btn-ghost w-full py-3 text-stone-500"
                >
                  Yönetim
                </Link>
              </nav>

              {categoriesWithCount.length > 0 ? (
                <div className="mt-8 border-t border-line pt-6">
                  <p className="site-overline">Kategoriler</p>
                  <ul className="mt-3 space-y-1">
                    {categoriesWithCount.map((c) => (
                      <li key={c.id}>
                        <Link
                          to={categoryPath(c.id)}
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
                    <Link to={categoryPath(c.id)} className="transition hover:text-cotta">
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
    </div>
  )
}
