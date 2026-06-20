/** Unsplash hero görselleri — sinematik carousel için yüksek çözünürlük */

const UNSPLASH_RE = /^https:\/\/images\.unsplash\.com\/photo-[^?]+/i

function unsplashBase(url: string): string | null {
  const t = url.trim()
  if (!UNSPLASH_RE.test(t)) return null
  return t.split('?')[0]!
}

function unsplashParams(w: number, h: number, q: number, extra = '') {
  return `auto=format&fit=crop&w=${w}&h=${h}&q=${q}&crop=entropy${extra ? `&${extra}` : ''}`
}

/** Ana carousel kaynağı — tam genişlik hero */
export function carouselHeroSrc(url: string): string {
  const base = unsplashBase(url)
  if (!base) return url.trim()
  return `${base}?${unsplashParams(2560, 1440, 88)}`
}

/** Retina / geniş ekran için srcset */
export function carouselHeroSrcSet(url: string): string | undefined {
  const base = unsplashBase(url)
  if (!base) return undefined
  return [
    `${base}?${unsplashParams(1280, 720, 82)} 1280w`,
    `${base}?${unsplashParams(1920, 1080, 85)} 1920w`,
    `${base}?${unsplashParams(2560, 1440, 88)} 2560w`,
    `${base}?${unsplashParams(3200, 1800, 90)} 3200w`,
  ].join(', ')
}

export const CAROUSEL_HERO_SIZES = '100vw'

/** Kaldırılmış / 404 dönen Unsplash görselleri */
const BROKEN_CAROUSEL_PHOTOS = [
  'photo-1560448204',
  'photo-1600607687929',
  'photo-1618210238122',
  'photo-1615874952470',
  'photo-1615874959474',
  'photo-1600210492486-724fe641c773',
] as const

/** Seed slaytlarda eski düşük çözünürlüklü görselleri yeniler */
const LEGACY_CAROUSEL_PHOTOS = [
  'photo-1618221195710',
  'photo-1555041469',
  'photo-1616486338812',
  'photo-1505693416388',
  'photo-1507473885765',
  'photo-1595428774220',
] as const

export function isLegacyCarouselImage(url: string): boolean {
  const base = url.split('?')[0] ?? ''
  return (
    LEGACY_CAROUSEL_PHOTOS.some((id) => base.includes(id)) ||
    BROKEN_CAROUSEL_PHOTOS.some((id) => base.includes(id))
  )
}

/** Unsplash dışı veya düşük kaliteli parametreli URL'leri yükselt */
export function needsCarouselImageUpgrade(url: string, seedUrl: string): boolean {
  if (!url.trim()) return true
  if (isLegacyCarouselImage(url)) return true
  const currentBase = url.split('?')[0] ?? ''
  const seedBase = seedUrl.split('?')[0] ?? ''
  if (currentBase === seedBase) return url.includes('w=1400') || url.includes('w=1200')
  return false
}
