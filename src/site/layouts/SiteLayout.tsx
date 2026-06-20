import { useEffect, useMemo, type ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from '../../lib/motion'
import { SiteProviders } from '../../providers/SiteProviders'
import { useCatalog } from '../../core/context/CatalogContext'
import { useSite } from '../../core/context/SiteContext'
import { PageTransition } from '../../components/motion'
import { SiteHeader } from '../components/header/SiteHeader'
import { BackToTop } from '../components/BackToTop'
import { CartPreviewModal } from '../components/CartPreviewModal'
import { SocialLinks } from '../components/SocialLinks'
import { categoryPath, packagesAnchor } from '../sitePaths'

function isAdminNavHref(href: string) {
  const path = href.split('#')[0].replace(/\/$/, '') || '/'
  return path === '/admin' || path.startsWith('/admin/')
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
  return <h3 className="site-eyebrow mb-4 font-semibold text-ink">{children}</h3>
}

export function SiteLayout() {
  const { data, activeLocale, setActiveLocale, resolvedContent } = useSite()
  const { settings, navigation, languages } = data
  const { categories, products } = useCatalog()
  const content = resolvedContent
  const location = useLocation()

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
    window.scrollTo(0, 0)
  }, [location.pathname])

  const routeKey = location.pathname
  const isHome = location.pathname === '/'

  return (
    <SiteProviders>
      <div className={isHome ? 'min-h-dvh bg-white antialiased' : 'min-h-dvh bg-surface-soft antialiased'}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:shadow-lg"
        >
          İçeriğe geç
        </a>

        <SiteHeader
          siteName={settings.siteName || 'Vitrin'}
          tagline={settings.siteTagline}
          contactPhone={settings.contactPhone}
          categories={categoriesWithCount}
          headerNav={headerNav}
          enabledLangs={enabledLangs}
          activeLocale={activeLocale}
          onLocaleChange={setActiveLocale}
        />

        <main
          id="main"
          className={isHome ? 'site-main site-main--home' : 'site-main mx-auto max-w-site px-5 py-10 sm:px-8 sm:py-14 md:py-16'}
        >
          <AnimatePresence mode="wait">
            <PageTransition routeKey={routeKey} key={routeKey}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
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
                  {settings.contactPhone ? (
                    <li className="text-stone-700">{settings.contactPhone}</li>
                  ) : null}
                  {settings.contactAddress ? (
                    <li className="leading-relaxed text-stone-500">{settings.contactAddress}</li>
                  ) : null}
                </ul>
              </div>
            </div>

            <div className="mt-14 border-t border-line pt-8 text-center text-xs text-stone-400">
              <p>{content.footerText}</p>
              <p className="mt-2">
                © {new Date().getFullYear()} {settings.siteName}
              </p>
            </div>
          </div>
        </footer>

        <BackToTop />
        <CartPreviewModal />
      </div>
    </SiteProviders>
  )
}
