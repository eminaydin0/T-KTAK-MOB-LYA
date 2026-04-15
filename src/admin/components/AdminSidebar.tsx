import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { adminPasswordConfigured, logoutAdmin } from '../../core/admin/auth'
import {
  IconCarousel,
  IconCart,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconExternal,
  IconLogout,
  IconFileText,
  IconFolder,
  IconImage,
  IconLanguages,
  IconMenu,
  IconPackage,
  IconSearch,
  IconSettings,
  IconShield,
  IconDashboard,
} from './AdminNavIcons'

const SECTION_STORAGE_KEY = 'emin-admin-sidebar-sections'
const COLLAPSED_STORAGE_KEY = 'emin-admin-sidebar-collapsed'

type NavItem = {
  to: string
  label: string
  hint: string
  icon: (props: { className?: string }) => ReactNode
}

type Section = {
  id: string
  label: string
  items: NavItem[]
}

const SECTIONS: Section[] = [
  {
    id: 'site',
    label: 'Site icerigi',
    items: [
      { to: '/admin/carousel', label: 'Carousel', hint: 'Ana sayfa slider', icon: (p) => <IconCarousel {...p} /> },
      { to: '/admin/content', label: 'Metinler', hint: 'Hero, footer, sabit sayfalar', icon: (p) => <IconFileText {...p} /> },
      { to: '/admin/navigation', label: 'Menu', hint: 'Ust ve alt baglantilar', icon: (p) => <IconMenu {...p} /> },
      { to: '/admin/media', label: 'Medya', hint: 'Gorsel kutuphanesi', icon: (p) => <IconImage {...p} /> },
    ],
  },
  {
    id: 'catalog',
    label: 'Katalog',
    items: [
      { to: '/admin/categories', label: 'Kategoriler', hint: 'Urun gruplari', icon: (p) => <IconFolder {...p} /> },
      { to: '/admin/products', label: 'Urunler', hint: 'Liste fiyat ve gorseller', icon: (p) => <IconPackage {...p} /> },
    ],
  },
  {
    id: 'work',
    label: 'Is',
    items: [{ to: '/admin/orders', label: 'Siparisler', hint: 'Durum ve musteri', icon: (p) => <IconCart {...p} /> }],
  },
  {
    id: 'system',
    label: 'Site ayarlari',
    items: [
      { to: '/admin/languages', label: 'Diller', hint: 'tr, en, ...', icon: (p) => <IconLanguages {...p} /> },
      { to: '/admin/settings', label: 'Genel', hint: 'SEO ve iletisim', icon: (p) => <IconSettings {...p} /> },
      { to: '/admin/security', label: 'Guvenlik', hint: 'Oturum ve sifre', icon: (p) => <IconShield {...p} /> },
    ],
  },
]

function loadSectionOpen(): Record<string, boolean> {
  const def: Record<string, boolean> = {
    site: true,
    catalog: true,
    work: true,
    system: true,
  }
  try {
    const raw = sessionStorage.getItem(SECTION_STORAGE_KEY)
    if (raw) return { ...def, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return def
}

function saveSectionOpen(next: Record<string, boolean>) {
  try {
    sessionStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

function loadCollapsed(): boolean {
  try {
    const raw = localStorage.getItem(COLLAPSED_STORAGE_KEY)
    if (raw === '1') return true
    if (raw === '0') return false
  } catch {
    /* ignore */
  }
  return false
}

function saveCollapsed(next: boolean) {
  try {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, next ? '1' : '0')
  } catch {
    /* ignore */
  }
}

function itemIconWrapClass(narrow: boolean) {
  return [
    'flex shrink-0 items-center justify-center rounded-md text-stone-500 transition-colors duration-150',
    narrow
      ? 'h-7 w-7 lg:h-6 lg:w-6'
      : 'h-8 w-8',
    'bg-transparent group-hover:bg-stone-200/60 group-hover:text-stone-800',
    'group-aria-[current=page]:bg-amber-200/50 group-aria-[current=page]:text-amber-950',
  ].join(' ')
}

function getNavLinkClass(narrow: boolean) {
  return ({ isActive }: { isActive: boolean }) =>
    [
      'group relative flex w-full gap-2 rounded-lg text-left transition-colors duration-150',
      narrow ? 'items-start px-2 py-1.5 lg:items-center lg:justify-center lg:gap-0 lg:px-1 lg:py-0.5' : 'items-start px-2 py-1.5',
      isActive
        ? narrow
          ? 'bg-amber-100/70 text-amber-950 ring-1 ring-amber-200/50'
          : 'bg-amber-50/90 text-amber-950 ring-1 ring-amber-200/40'
        : 'text-stone-600 hover:bg-stone-100/70 hover:text-stone-900',
    ].join(' ')
}

type Props = {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ mobileOpen = false, onMobileClose }: Props) {
  const routerNavigate = useNavigate()
  const showLogout = adminPasswordConfigured()

  const [query, setQuery] = useState('')
  const [sectionOpen, setSectionOpen] = useState(loadSectionOpen)
  const [collapsed, setCollapsed] = useState(loadCollapsed)

  const q = query.trim().toLowerCase()

  const filteredSections = useMemo(() => {
    if (!q) return SECTIONS
    return SECTIONS.map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) =>
          it.label.toLowerCase().includes(q) ||
          it.hint.toLowerCase().includes(q) ||
          sec.label.toLowerCase().includes(q)
      ),
    })).filter((sec) => sec.items.length > 0)
  }, [q])

  useEffect(() => {
    if (!q) return
    setSectionOpen((prev) => {
      const next = { ...prev }
      for (const sec of SECTIONS) {
        const hasMatch = sec.items.some(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            it.hint.toLowerCase().includes(q) ||
            sec.label.toLowerCase().includes(q)
        )
        if (hasMatch) next[sec.id] = true
      }
      saveSectionOpen(next)
      return next
    })
  }, [q])

  const toggleSection = (id: string) => {
    setSectionOpen((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      saveSectionOpen(next)
      return next
    })
  }

  const setCollapsedPersist = (next: boolean) => {
    setCollapsed(next)
    saveCollapsed(next)
  }

  const handleLogout = () => {
    logoutAdmin()
    onMobileClose?.()
    routerNavigate('/admin/login', { replace: true })
  }

  const iconSz = collapsed ? 'h-4 w-4 lg:h-3.5 lg:w-3.5' : 'h-4 w-4'

  const Brand = ({ compact }: { compact?: boolean }) => (
    <div className="flex min-w-0 items-center gap-2.5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-sm ring-1 ring-amber-400/30"
        aria-hidden
      >
        E
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-800/80">Yonetim</p>
        <p className={`truncate font-semibold tracking-tight text-stone-900 ${compact ? 'text-sm' : 'text-[15px] leading-tight'}`}>
          EMIN Admin
        </p>
      </div>
    </div>
  )

  const navLinkClass = getNavLinkClass(collapsed)

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-50 flex min-h-0 w-[min(18rem,100vw)] flex-col border-r border-stone-200/60',
        'bg-white lg:bg-stone-50/80',
        'transition-transform duration-300 ease-out lg:transition-[width] lg:duration-200',
        'lg:sticky lg:top-0 lg:z-0 lg:h-dvh lg:max-h-dvh lg:overflow-hidden lg:shadow-none',
        collapsed ? 'lg:w-14' : 'lg:w-60',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
      aria-label="Yonetim menusu"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Mobil: ust bar + kapat */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-stone-200/60 bg-white px-3 py-2.5 lg:hidden">
          <Brand compact />
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200/80 bg-stone-50 text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
            aria-label="Menuyu kapat"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Masaustu: marka + daralt */}
        <div className="hidden shrink-0 border-b border-stone-200/50 px-2.5 pb-3 pt-3.5 lg:block">
          {!collapsed ? (
            <div className="flex items-start justify-between gap-1.5">
              <div className="min-w-0 flex-1">
                <Brand />
                <p className="mt-2 text-[11px] leading-snug text-stone-500">
                  Vitrin ve siparisler tek yerde.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCollapsedPersist(true)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-200/70 bg-white text-stone-400 transition hover:border-amber-200/80 hover:bg-amber-50/50 hover:text-amber-900"
                title="Daralt"
                aria-expanded
                aria-label="Kenar cubugunu daralt"
              >
                <IconChevronLeft className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-white ring-1 ring-amber-400/25"
                aria-hidden
              >
                E
              </div>
              <button
                type="button"
                onClick={() => setCollapsedPersist(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200/70 bg-white text-stone-400 transition hover:border-amber-200/80 hover:bg-amber-50/50 hover:text-amber-900"
                title="Ac"
                aria-expanded={false}
                aria-label="Kenar cubugunu genislet"
              >
                <IconChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Arama — dar modda masaustunde gizli */}
        <div
          className={`shrink-0 border-b border-stone-200/50 px-2.5 py-2 ${collapsed ? 'hidden lg:hidden' : ''}`}
        >
          <label className="relative block">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400">
              <IconSearch className="h-3.5 w-3.5" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ara..."
              className="w-full rounded-lg border border-stone-200/70 bg-white py-1.5 pl-8 pr-2.5 text-[13px] text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-300/70 focus:ring-1 focus:ring-amber-200/60"
            />
          </label>
        </div>

        {/* Nav — tek scroll alani */}
        <nav
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2 [scrollbar-gutter:stable]"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="mb-0.5">
            <NavLink
              to="/admin"
              end
              onClick={onMobileClose}
              title={collapsed ? 'Genel bakis — Ozet ve hizli erisim' : undefined}
              className={navLinkClass}
            >
              <span className={itemIconWrapClass(collapsed)}>
                <IconDashboard className={iconSz} />
              </span>
              <span className={`min-w-0 ${collapsed ? 'lg:sr-only' : 'pt-0.5'}`}>
                <span className="block text-[13px] font-semibold leading-tight">Genel bakis</span>
                <span className="mt-px block text-[10px] leading-tight text-stone-400 group-hover:text-stone-500 group-aria-[current=page]:text-amber-800/70">
                  Ozet
                </span>
              </span>
            </NavLink>
          </div>

          {filteredSections.length === 0 ? (
            <p className="rounded-lg border border-dashed border-stone-200/80 bg-stone-50/50 px-2 py-4 text-center text-[11px] text-stone-500">
              Sonuc yok.
            </p>
          ) : (
            filteredSections.map((section, sIdx) => {
              const open = collapsed ? true : sectionOpen[section.id] !== false
              return (
                <div key={section.id} className="pt-0.5">
                  {collapsed ? (
                    sIdx > 0 ? (
                      <div className="mx-auto my-1 hidden h-px max-w-[1.75rem] bg-stone-200/80 lg:block" aria-hidden />
                    ) : null
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="mb-0.5 flex w-full items-center justify-between gap-1 rounded-md px-1.5 py-1 text-left text-[10px] font-semibold uppercase tracking-wide text-stone-400 transition hover:text-stone-500"
                    >
                      <span>{section.label}</span>
                      <IconChevronDown
                        className={`h-3 w-3 shrink-0 text-stone-400 transition-transform duration-150 ${
                          open ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                    </button>
                  )}
                  {open ? (
                    <div className="space-y-px">
                      {section.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onMobileClose}
                          title={collapsed ? `${item.label} — ${item.hint}` : undefined}
                          className={navLinkClass}
                        >
                          <span className={itemIconWrapClass(collapsed)}>
                            {item.icon({ className: iconSz })}
                          </span>
                          <span className={`min-w-0 ${collapsed ? 'lg:sr-only' : 'pt-0.5'}`}>
                            <span className="block text-[13px] font-medium leading-tight">{item.label}</span>
                            <span className="mt-px block text-[10px] leading-tight text-stone-400 group-hover:text-stone-500 group-aria-[current=page]:text-amber-800/70">
                              {item.hint}
                            </span>
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })
          )}
        </nav>

        {/* Alt aksiyonlar */}
        <div className="shrink-0 space-y-1 border-t border-stone-200/50 bg-white/60 p-2">
          <Link
            to="/"
            onClick={onMobileClose}
            title={collapsed ? 'Siteyi ac' : undefined}
            className={`flex w-full items-center justify-center gap-1.5 rounded-lg border border-stone-200/70 bg-white px-2 py-2 text-xs font-semibold text-stone-700 transition hover:border-amber-200/70 hover:bg-amber-50/40 hover:text-amber-950 ${collapsed ? 'lg:justify-center lg:px-1 lg:py-1.5' : ''}`}
          >
            <IconExternal className={`shrink-0 text-stone-400 ${collapsed ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5'}`} />
            <span className={collapsed ? 'lg:sr-only' : ''}>Site</span>
          </Link>
          {showLogout ? (
            <button
              type="button"
              onClick={handleLogout}
              title={collapsed ? 'Cikis yap' : undefined}
              className={`flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-100/90 bg-red-50/70 px-2 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-100/80 ${collapsed ? 'lg:justify-center lg:px-1 lg:py-1.5' : ''}`}
            >
              <IconLogout className={`h-3.5 w-3.5 shrink-0 text-red-600 ${collapsed ? 'hidden lg:block' : 'hidden'}`} />
              <span className={collapsed ? 'lg:sr-only' : ''}>Cikis</span>
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
