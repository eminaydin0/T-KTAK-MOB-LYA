/**
 * Varsayilan vitrin verisi — sabit id’ler (carousel/nav/medya) yeniden uretimde tutarli kalsin.
 */
import type { CarouselSlide, MediaItem, SiteNavItem } from './types'

export const defaultCarousel: CarouselSlide[] = [
  {
    id: 'seed-car-1',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&h=560&fit=crop',
    title: 'Oturma ve yemek alanları',
    subtitle:
      'Köşe koltuk, masif yemek masası, büfe ve sandalye setleri — detaylı ölçü ve malzeme bilgileriyle',
    linkUrl: '/',
    order: 0,
  },
  {
    id: 'seed-car-2',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=560&fit=crop',
    title: 'Ofis ve çalışma düzeni',
    subtitle:
      'Ergonomik sandalye, L masa, dosya dolabı ve 240 cm toplantı masası — kurumsal projelere uygun',
    linkUrl: '/',
    order: 1,
  },
  {
    id: 'seed-car-3',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&h=560&fit=crop',
    title: 'Minimal TV ve depolama',
    subtitle: 'Duvar üniteleri, kablo kanalları ve mat lake yüzeyler — modern salon çözümleri',
    linkUrl: '/',
    order: 2,
  },
  {
    id: 'seed-car-4',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&h=560&fit=crop',
    title: 'Yatak odası konforu',
    subtitle: 'Baza setleri, komodin, şifonyer ve köşe gardırop — set indirimleriyle',
    linkUrl: '/',
    order: 3,
  },
  {
    id: 'seed-car-5',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400&h=560&fit=crop',
    title: 'Aydınlatma ile atmosfer',
    subtitle: 'Lambader, avize ve LED çalışma lambası — dimmer uyumlu seçenekler',
    linkUrl: '/',
    order: 4,
  },
  {
    id: 'seed-car-6',
    imageUrl: 'https://images.unsplash.com/photo-1595428774220-17a58b32ab47?w=1400&h=560&fit=crop',
    title: 'Depolama ve düzen',
    subtitle: 'Sürgülü gardırop, şifonyer ve modüler iç düzen — ölçüye özel üretim',
    linkUrl: '/',
    order: 5,
  },
]

export const defaultNavigation: SiteNavItem[] = [
  {
    id: 'seed-nav-h1',
    label: 'Ana sayfa',
    href: '/',
    openInNewTab: false,
    order: 0,
    placement: 'header',
  },
  {
    id: 'seed-nav-h2',
    label: 'Katalog',
    href: '/#catalog',
    openInNewTab: false,
    order: 1,
    placement: 'header',
  },
  {
    id: 'seed-nav-h3',
    label: 'Paketler',
    href: '/#packages',
    openInNewTab: false,
    order: 2,
    placement: 'header',
  },
  {
    id: 'seed-nav-h4',
    label: 'İletişim',
    href: '/iletisim',
    openInNewTab: false,
    order: 3,
    placement: 'header',
  },
  {
    id: 'seed-nav-f1',
    label: 'Iletisim',
    href: '/iletisim',
    openInNewTab: false,
    order: 0,
    placement: 'footer',
  },
  {
    id: 'seed-nav-f2',
    label: 'Gizlilik',
    href: '/gizlilik',
    openInNewTab: false,
    order: 1,
    placement: 'footer',
  },
  {
    id: 'seed-nav-f3',
    label: 'KVKK',
    href: '/kvkk',
    openInNewTab: false,
    order: 2,
    placement: 'footer',
  },
]

const mediaUrls: { url: string; label: string }[] = [
  { url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop', label: 'Yemek masasi' },
  { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop', label: 'Koltuk' },
  { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop', label: 'TV unitesi' },
  { url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=400&fit=crop', label: 'Ofis sandalyesi' },
  { url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop', label: 'Ofis masasi' },
  { url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=400&fit=crop', label: 'Kitaplik' },
  { url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&h=400&fit=crop', label: 'Sehpa' },
  { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop', label: 'Yatak odasi' },
  { url: 'https://images.unsplash.com/photo-1595428774220-17a58b32ab47?w=600&h=400&fit=crop', label: 'Gardrop' },
  { url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=400&fit=crop', label: 'Sifonyer' },
  { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop', label: 'Lambader' },
  { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop', label: 'Ofis depolama' },
  { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&h=400&fit=crop', label: 'Konsol' },
  { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop', label: 'Bench' },
  { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', label: 'Toplanti salonu' },
]

export const defaultMedia: MediaItem[] = mediaUrls.map((m, i) => ({
  id: `seed-media-${String(i + 1).padStart(3, '0')}`,
  url: m.url,
  label: m.label,
  createdAt: 1704067200000 + i * 3600000,
}))
