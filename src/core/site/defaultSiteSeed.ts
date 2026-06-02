/**
 * Varsayilan vitrin verisi — sabit id'ler yeniden uretimde tutarli kalsin.
 */
import type { CarouselSlide, MediaItem, SiteNavItem } from './types'

export const defaultCarousel: CarouselSlide[] = [
  {
    id: 'seed-car-1',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&h=560&fit=crop',
    title: 'Salon ve yemek odası',
    subtitle: 'Köşe koltuktan masif yemek masasına — bütüncül yaşam alanları',
    linkUrl: '/#catalog',
    order: 0,
  },
  {
    id: 'seed-car-2',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=560&fit=crop',
    title: 'Ofis ve çalışma',
    subtitle: 'Ergonomi, depolama ve toplantı alanları — kurumsal projelere uygun',
    linkUrl: '/#catalog',
    order: 1,
  },
  {
    id: 'seed-car-3',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&h=560&fit=crop',
    title: 'TV ve depolama',
    subtitle: 'Duvar üniteleri, sade çizgiler — kablo düzeni düşünülmüş',
    linkUrl: '/#catalog',
    order: 2,
  },
  {
    id: 'seed-car-4',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&h=560&fit=crop',
    title: 'Yatak odası',
    subtitle: 'Baza, komodin, gardırop — setlerde indirimli tamamlama',
    linkUrl: '/#packages',
    order: 3,
  },
  {
    id: 'seed-car-5',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1400&h=560&fit=crop',
    title: 'Aydınlatma',
    subtitle: 'Lambader, avize ve aplik — mekâna derinlik katan ışık',
    linkUrl: '/#catalog',
    order: 4,
  },
  {
    id: 'seed-car-6',
    imageUrl: 'https://images.unsplash.com/photo-1595428774220-17a58b32ab47?w=1400&h=560&fit=crop',
    title: 'Depolama',
    subtitle: 'Modüler gardırop ve şifonyer — ölçünüze göre iç düzen',
    linkUrl: '/#catalog',
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
    label: 'Gizlilik',
    href: '/gizlilik',
    openInNewTab: false,
    order: 0,
    placement: 'footer',
  },
  {
    id: 'seed-nav-f2',
    label: 'KVKK',
    href: '/kvkk',
    openInNewTab: false,
    order: 1,
    placement: 'footer',
  },
  {
    id: 'seed-nav-f3',
    label: 'İletişim',
    href: '/iletisim',
    openInNewTab: false,
    order: 2,
    placement: 'footer',
  },
]

export const defaultMedia: MediaItem[] = []
