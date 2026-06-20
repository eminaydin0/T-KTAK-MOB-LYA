/**
 * Varsayilan vitrin verisi — sabit id'ler yeniden uretimde tutarli kalsin.
 */
import type { CarouselSlide, MediaItem, SiteNavItem } from './types'

/** Sinematik hero — editoryal, doğal ışıklı iç mekân görselleri (Unsplash) */
export const defaultCarousel: CarouselSlide[] = [
  {
    id: 'seed-car-1',
    imageUrl: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea',
    title: 'Açık plan yaşam',
    subtitle: 'Doğal ışık, nötr tonlar ve ferah oturma alanları',
    linkUrl: '/katalog',
    order: 0,
  },
  {
    id: 'seed-car-2',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace',
    title: 'Salon koleksiyonu',
    subtitle: 'Koltuk, sehpa ve aydınlatma — bütüncül oturma düzeni',
    linkUrl: '/katalog',
    order: 1,
  },
  {
    id: 'seed-car-3',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
    title: 'Yemek odası',
    subtitle: 'Masif ahşap, sıcak tonlar — aile sofraları için',
    linkUrl: '/katalog',
    order: 2,
  },
  {
    id: 'seed-car-4',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    title: 'Yatak odası',
    subtitle: 'Sakin çizgiler, yumuşak dokular — dinlenmeye davet eden alanlar',
    linkUrl: '/setler',
    order: 3,
  },
  {
    id: 'seed-car-5',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    title: 'Çalışma alanı',
    subtitle: 'Ergonomi ve depolama — ev ofisi ve kurumsal projeler',
    linkUrl: '/katalog',
    order: 4,
  },
  {
    id: 'seed-car-6',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
    title: 'Oturma köşesi',
    subtitle: 'Katmanlı dokular, sade detaylar — showroom’dan ilham',
    linkUrl: '/katalog',
    order: 5,
  },
]

/** Ana sayfa lookbook — site tanıtımı (kategori görsellerinden bağımsız, 3 slayt) */
export const defaultLookbookSlides: CarouselSlide[] = [
  {
    id: 'seed-look-1',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    title: 'Ölçüye özel üretim',
    subtitle: 'Her parça projenize göre planlanır — ölçü, renk ve malzeme seçenekleriyle.',
    linkUrl: '/katalog',
    order: 0,
  },
  {
    id: 'seed-look-2',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
    title: 'Malzeme ve işçilik',
    subtitle: 'Masif ahşap, kumaş ve metal detayları showroom’da yakından deneyimleyin.',
    linkUrl: '/katalog',
    order: 1,
  },
  {
    id: 'seed-look-3',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
    title: 'Keşiften montaja',
    subtitle: 'Ücretsiz keşif, termin takibi ve profesyonel kurulum — tek elden hizmet.',
    linkUrl: '/iletisim',
    order: 2,
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
    href: '/katalog',
    openInNewTab: false,
    order: 1,
    placement: 'header',
  },
  {
    id: 'seed-nav-h3',
    label: 'Paketler',
    href: '/setler',
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
