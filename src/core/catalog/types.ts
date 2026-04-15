/** Kategoriye bagli urun formu sorulari (cevaplar urunde tutulur) */
export type CategoryQuestion = {
  id: string
  label: string
  placeholder?: string
}

export type CatalogCategory = {
  id: number
  name: string
  /** Vitrin: kategori kartı, menü; https veya data:image/... */
  imageUrl?: string
  /** Bu kategori secildiginde urun formunda gosterilecek sorular */
  questions: CategoryQuestion[]
}

export type StockStatus = 'in_stock' | 'pre_order' | 'unknown'

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  in_stock: 'Stokta',
  pre_order: 'On siparis',
  unknown: 'Belirtilmedi',
}

export type CatalogProduct = {
  id: number
  name: string
  categoryId: number
  description: string
  /** Gorsel listesi (https veya data:image/...); sirayla vitrin ve galeride kullanilir */
  images: string[]
  /** Liste fiyati (USD); TL vitrinde guncel kur ile hesaplanir */
  priceUsd: number
  /** Stok / termin ozeti */
  stockStatus: StockStatus
  /** Termin (gun); on siparis veya uretim sureci icin */
  leadTimeDays: number | null
  /** Kategoriye ozel soru cevaplari (soru id -> metin) */
  categoryAnswers: Record<string, string>
}

export function productImageList(p: CatalogProduct): string[] {
  return Array.isArray(p.images) ? p.images.filter((u) => u.trim() !== '') : []
}

export function productPrimaryImage(p: CatalogProduct): string {
  return productImageList(p)[0] ?? ''
}
