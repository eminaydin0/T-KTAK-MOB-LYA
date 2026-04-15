import type {
  CarouselSlide,
  MediaItem,
  SiteContent,
  SiteData,
  SiteLanguage,
  SiteNavItem,
  SiteSettings,
} from './types'
import { defaultCarousel, defaultMedia, defaultNavigation } from './defaultSiteSeed'

/** Aktif vitrin CMS anahtari; v1 loadSiteData icinde migrate edilir. */
export const SITE_STORAGE_KEY = 'emin-dashboard-site-v2'
const LEGACY_SITE_KEYS = ['emin-dashboard-site-v1'] as const

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const defaultSiteData = (): SiteData => ({
  carousel: defaultCarousel,
  languages: [
    { code: 'tr', name: 'Turkce', enabled: true, isDefault: true },
    { code: 'en', name: 'English', enabled: true, isDefault: false },
  ],
  navigation: defaultNavigation,
  media: defaultMedia,
  settings: {
    siteName: 'EMIN Mobilya',
    siteTagline: 'Mobilya, ofis ve aydinlatma — genis katalog, USD liste fiyatlari',
    seoTitle: 'EMIN Mobilya — Koltuk, yatak, ofis, depolama',
    seoDescription:
      'Yuzlerce vitrin kombinasyonu: mobilya, sehpa, yatak odasi, depolama ve aydinlatma. Fiyatlar USD, TL tahmini guncel kur ile.',
    contactEmail: 'siparis@emin-mobilya.demo',
    contactPhone: '+90 (212) 555 01 23',
    contactAddress: 'Istanbul, Turkiye — Showroom randevu ile',
    socialInstagram: 'https://instagram.com',
    socialLinkedIn: 'https://linkedin.com',
    socialWhatsApp: 'https://wa.me/905555555555',
  },
  contentByLocale: {
    tr: {
      heroTitle: 'Genis demoya hazir katalog',
      heroSubtitle:
        'Asagida onlarca ornek urun, alti kategori ve kategoriye ozel form alanlari var. Carousel ve medya kutuphanesi admin panelden duzenlenir; fiyatlar USD, TL karsiligi kur ile tahmini.',
      categorySectionTitle: 'Kategorilere göz atın',
      categorySectionSubtitle: 'Bir koleksiyona tıklayarak o kategorinin ürünlerine gidin.',
      filterSectionTitle: 'Kategori ve arama',
      catalogSectionTitle: 'Urun vitrini',
      demoSectionTitle: 'Ek demo: B2B ornek aileler',
      demoSectionNote:
        'Bu bolum `data.ts` icindeki sabit B2B/B2C orneklerini gosterir (katalogdaki canli urunlerden bagimsiz vitrin).',
      footerText: 'EMIN Mobilya — demo vitrin verisi',
    },
    en: {
      heroTitle: 'A rich default showroom dataset',
      heroSubtitle:
        'Dozens of sample products across six categories, plus carousel slides and a media library. Prices in USD with a TRY estimate.',
      categorySectionTitle: 'Browse by category',
      categorySectionSubtitle: 'Open a collection to see products in that category.',
      filterSectionTitle: 'Search & category',
      catalogSectionTitle: 'Product showcase',
      demoSectionTitle: 'Extra demo: B2B sample families',
      demoSectionNote: 'This block uses static B2B/B2C samples from `data.ts` (separate from the live catalog).',
      footerText: 'EMIN Furniture — demo storefront',
    },
  },
})

function normalizeSlide(raw: Partial<CarouselSlide> & { id: string }): CarouselSlide {
  return {
    id: raw.id,
    imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : '',
    title: typeof raw.title === 'string' ? raw.title : '',
    subtitle: typeof raw.subtitle === 'string' ? raw.subtitle : '',
    linkUrl: typeof raw.linkUrl === 'string' ? raw.linkUrl : '',
    order: typeof raw.order === 'number' && Number.isFinite(raw.order) ? raw.order : 0,
  }
}

function normalizeContent(raw: Partial<SiteContent> | undefined): SiteContent {
  const d = defaultSiteData().contentByLocale.tr
  if (!raw || typeof raw !== 'object') return d
  return {
    heroTitle: typeof raw.heroTitle === 'string' ? raw.heroTitle : d.heroTitle,
    heroSubtitle: typeof raw.heroSubtitle === 'string' ? raw.heroSubtitle : d.heroSubtitle,
    categorySectionTitle:
      typeof raw.categorySectionTitle === 'string' ? raw.categorySectionTitle : d.categorySectionTitle,
    categorySectionSubtitle:
      typeof raw.categorySectionSubtitle === 'string' ? raw.categorySectionSubtitle : d.categorySectionSubtitle,
    filterSectionTitle:
      typeof raw.filterSectionTitle === 'string' ? raw.filterSectionTitle : d.filterSectionTitle,
    catalogSectionTitle:
      typeof raw.catalogSectionTitle === 'string' ? raw.catalogSectionTitle : d.catalogSectionTitle,
    demoSectionTitle:
      typeof raw.demoSectionTitle === 'string' ? raw.demoSectionTitle : d.demoSectionTitle,
    demoSectionNote:
      typeof raw.demoSectionNote === 'string' ? raw.demoSectionNote : d.demoSectionNote,
    footerText: typeof raw.footerText === 'string' ? raw.footerText : d.footerText,
  }
}

function normalizeLang(raw: Partial<SiteLanguage> & { code: string }): SiteLanguage {
  return {
    code: raw.code.trim().toLowerCase() || 'tr',
    name: typeof raw.name === 'string' ? raw.name : raw.code,
    enabled: Boolean(raw.enabled),
    isDefault: Boolean(raw.isDefault),
  }
}

function normalizeNav(raw: Partial<SiteNavItem> & { id: string }): SiteNavItem {
  const placement = raw.placement === 'footer' ? 'footer' : 'header'
  return {
    id: raw.id,
    label: typeof raw.label === 'string' ? raw.label : '',
    href: typeof raw.href === 'string' ? raw.href : '/',
    openInNewTab: Boolean(raw.openInNewTab),
    order: typeof raw.order === 'number' && Number.isFinite(raw.order) ? raw.order : 0,
    placement,
  }
}

function normalizeMedia(raw: Partial<MediaItem> & { id: string }): MediaItem {
  return {
    id: raw.id,
    url: typeof raw.url === 'string' ? raw.url : '',
    label: typeof raw.label === 'string' ? raw.label : '',
    createdAt:
      typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt)
        ? raw.createdAt
        : Date.now(),
  }
}

function normalizeSettings(raw: Partial<SiteSettings> | undefined): SiteSettings {
  const d = defaultSiteData().settings
  if (!raw || typeof raw !== 'object') return { ...d }
  return {
    siteName: typeof raw.siteName === 'string' ? raw.siteName : d.siteName,
    siteTagline: typeof raw.siteTagline === 'string' ? raw.siteTagline : d.siteTagline,
    seoTitle: typeof raw.seoTitle === 'string' ? raw.seoTitle : d.seoTitle,
    seoDescription: typeof raw.seoDescription === 'string' ? raw.seoDescription : d.seoDescription,
    contactEmail: typeof raw.contactEmail === 'string' ? raw.contactEmail : d.contactEmail,
    contactPhone: typeof raw.contactPhone === 'string' ? raw.contactPhone : d.contactPhone,
    contactAddress: typeof raw.contactAddress === 'string' ? raw.contactAddress : d.contactAddress,
    socialInstagram: typeof raw.socialInstagram === 'string' ? raw.socialInstagram : d.socialInstagram,
    socialLinkedIn: typeof raw.socialLinkedIn === 'string' ? raw.socialLinkedIn : d.socialLinkedIn,
    socialWhatsApp: typeof raw.socialWhatsApp === 'string' ? raw.socialWhatsApp : d.socialWhatsApp,
  }
}

export function normalizeSiteData(raw: unknown): SiteData {
  const def = defaultSiteData()
  if (!raw || typeof raw !== 'object') return def
  const o = raw as Record<string, unknown>

  const carouselRaw = o.carousel
  const carousel = Array.isArray(carouselRaw)
    ? carouselRaw
        .filter((s): s is Partial<CarouselSlide> & { id: string } => typeof (s as { id?: unknown })?.id === 'string')
        .map(normalizeSlide)
        .sort((a, b) => a.order - b.order)
    : def.carousel

  const languagesRaw = o.languages
  let languages = Array.isArray(languagesRaw)
    ? languagesRaw
        .filter((l): l is Partial<SiteLanguage> & { code: string } => typeof (l as { code?: unknown })?.code === 'string')
        .map(normalizeLang)
    : def.languages
  if (languages.length === 0) languages = def.languages
  if (!languages.some((l) => l.isDefault)) languages[0] = { ...languages[0], isDefault: true }
  if (!languages.some((l) => l.enabled)) languages = languages.map((l, i) => (i === 0 ? { ...l, enabled: true } : l))

  const navigationRaw = o.navigation
  const navigation = Array.isArray(navigationRaw)
    ? navigationRaw
        .filter((n): n is Partial<SiteNavItem> & { id: string } => typeof (n as { id?: unknown })?.id === 'string')
        .map(normalizeNav)
    : def.navigation

  const mediaRaw = o.media
  const media = Array.isArray(mediaRaw)
    ? mediaRaw
        .filter((m): m is Partial<MediaItem> & { id: string } => typeof (m as { id?: unknown })?.id === 'string')
        .map(normalizeMedia)
    : def.media

  const cblRaw = o.contentByLocale
  let contentByLocale: Record<string, SiteContent>
  if (cblRaw && typeof cblRaw === 'object' && !Array.isArray(cblRaw)) {
    contentByLocale = {}
    for (const [k, v] of Object.entries(cblRaw)) {
      contentByLocale[k] = normalizeContent(v as Partial<SiteContent>)
    }
  } else if (o.content && typeof o.content === 'object') {
    contentByLocale = { tr: normalizeContent(o.content as Partial<SiteContent>) }
  } else {
    contentByLocale = { ...def.contentByLocale }
  }

  const defCode = languages.find((l) => l.isDefault)?.code || 'tr'
  if (!contentByLocale[defCode]) {
    contentByLocale[defCode] = normalizeContent(undefined)
  }
  const base = contentByLocale[defCode]!
  for (const lang of languages) {
    if (!contentByLocale[lang.code]) {
      contentByLocale[lang.code] = { ...base }
    }
  }

  return {
    carousel: carousel.length ? carousel : def.carousel,
    contentByLocale,
    languages,
    navigation: navigation.length ? navigation : def.navigation,
    media,
    settings: normalizeSettings(o.settings as Partial<SiteSettings>),
  }
}

function readSiteRaw(): string | null {
  let s = localStorage.getItem(SITE_STORAGE_KEY)
  if (s) return s
  for (const key of LEGACY_SITE_KEYS) {
    const legacy = localStorage.getItem(key)
    if (legacy) {
      try {
        localStorage.setItem(SITE_STORAGE_KEY, legacy)
      } catch {
        /* quota */
      }
      return legacy
    }
  }
  return null
}

export function loadSiteData(): SiteData {
  try {
    const s = readSiteRaw()
    if (!s) return defaultSiteData()
    return normalizeSiteData(JSON.parse(s) as unknown)
  } catch {
    return defaultSiteData()
  }
}

export function saveSiteData(data: SiteData): void {
  try {
    localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

export function resetSiteData(): void {
  try {
    localStorage.removeItem(SITE_STORAGE_KEY)
    for (const key of LEGACY_SITE_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    /* ignore */
  }
}

export { uid }
