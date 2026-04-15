export type CarouselSlide = {
  id: string
  imageUrl: string
  title: string
  subtitle: string
  linkUrl: string
  order: number
}

export type SiteContent = {
  heroTitle: string
  heroSubtitle: string
  /** Ana sayfa kategori vitrin kartlari */
  categorySectionTitle: string
  categorySectionSubtitle: string
  filterSectionTitle: string
  catalogSectionTitle: string
  demoSectionTitle: string
  demoSectionNote: string
  footerText: string
}

export type SiteLanguage = {
  code: string
  name: string
  enabled: boolean
  isDefault: boolean
}

export type SiteNavItem = {
  id: string
  label: string
  href: string
  openInNewTab: boolean
  order: number
  placement: 'header' | 'footer'
}

export type MediaItem = {
  id: string
  url: string
  label: string
  createdAt: number
}

export type SiteSettings = {
  siteName: string
  siteTagline: string
  seoTitle: string
  seoDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  socialInstagram: string
  socialLinkedIn: string
  socialWhatsApp: string
}

export type SiteData = {
  carousel: CarouselSlide[]
  /** Dil kodu -> vitrin metinleri */
  contentByLocale: Record<string, SiteContent>
  languages: SiteLanguage[]
  navigation: SiteNavItem[]
  media: MediaItem[]
  settings: SiteSettings
}
