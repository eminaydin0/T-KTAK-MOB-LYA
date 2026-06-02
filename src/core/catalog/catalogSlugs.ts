import type { CatalogCategory, CatalogProduct } from './types'
import { ensureUniqueSlug, slugifyTr } from './slugify'

const CATEGORY_SLUGS: Record<number, string> = {
  1: 'mobilya',
  2: 'ofis-mobilyasi',
  3: 'sehpa',
  4: 'yatak-odasi',
  5: 'depolama',
  6: 'aydinlatma',
  7: 'mutfak',
  8: 'bahce-balkon',
}

const CATEGORY_SEO: Record<number, string> = {
  1: 'Oturma grupları, yemek masaları, koltuk takımları ve salon mobilyaları. Ölçü, malzeme ve bakım bilgileriyle detaylı ürün sayfaları.',
  2: 'Ergonomik ofis sandalyesi, çalışma masası, toplantı masası ve kurumsal depolama çözümleri. USD liste fiyatları ve termin bilgisi.',
  3: 'Salon orta sehpası, yan sehpa, cam sehpa ve iç içe sehpa setleri. Modern ve klasik koleksiyonlar.',
  4: 'Baza seti, komodin, şifonyer ve yatak odası tamamlayıcı mobilyalar. Set indirimleri ve özel ölçü seçenekleri.',
  5: 'Gardırop, şifonyer, ayakkabılık ve modüler depolama üniteleri. İç düzen ve kapak tipi özelleştirmesi.',
  6: 'Lambader, avize, sarkıt ve duvar aplikleri. Watt, montaj ve dimmer uyumu teknik detaylarda.',
  7: 'Mutfak adası, bar taburesi, üst dolap ve kiler modülleri. Kuvars tezgah ve yerinde montaj seçenekleri.',
  8: 'Bahçe yemek seti, balkon bistro, salıncak ve dış mekân oturma grupları. UV dayanımlı malzemeler.',
}

export function categorySeoDescription(category: CatalogCategory, productCount = 0): string {
  if (category.seoDescription?.trim()) return category.seoDescription.trim()
  const preset = CATEGORY_SEO[category.id]
  if (preset) {
    return productCount > 0
      ? `${category.name} kategorisinde ${productCount} ürün. ${preset}`
      : preset
  }
  return productCount > 0
    ? `${category.name} koleksiyonunda ${productCount} ürün. Ölçü, malzeme ve fiyat detaylarıyla inceleyin.`
    : `${category.name} mobilya koleksiyonu — EMIN vitrin kataloğu.`
}

export function enrichCategories(categories: Omit<CatalogCategory, 'slug'>[]): CatalogCategory[] {
  const used = new Set<string>()
  return categories.map((c) => {
    const presetSlug = CATEGORY_SLUGS[c.id]
    const base = presetSlug || slugifyTr(c.name)
    const slug = ensureUniqueSlug(base, used, `kategori-${c.id}`)
    const seoDescription = c.seoDescription?.trim() || CATEGORY_SEO[c.id]
    return {
      ...c,
      slug,
      ...(seoDescription ? { seoDescription } : {}),
    }
  })
}

export function enrichProducts(products: Omit<CatalogProduct, 'slug'>[]): CatalogProduct[] {
  const used = new Set<string>()
  return products.map((p) => {
    const base = slugifyTr(p.name)
    const slug = ensureUniqueSlug(base, used, `urun-${p.id}`)
    return { ...p, slug }
  })
}

export function findCategoryByParam(categories: CatalogCategory[], param: string | undefined) {
  if (!param?.trim()) return undefined
  const decoded = decodeURIComponent(param.trim())
  const bySlug = categories.find((c) => c.slug === decoded)
  if (bySlug) return bySlug
  const id = parseInt(decoded, 10)
  if (Number.isFinite(id)) return categories.find((c) => c.id === id)
  return undefined
}

export function findProductByParam(products: CatalogProduct[], param: string | undefined) {
  if (!param?.trim()) return undefined
  const decoded = decodeURIComponent(param.trim())
  const bySlug = products.find((p) => p.slug === decoded)
  if (bySlug) return bySlug
  const id = parseInt(decoded, 10)
  if (Number.isFinite(id)) return products.find((p) => p.id === id)
  return undefined
}

export function isNumericRouteParam(param: string | undefined) {
  if (!param?.trim()) return false
  return /^\d+$/.test(param.trim())
}
