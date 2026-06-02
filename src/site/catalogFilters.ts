import type { CatalogProduct, StockStatus } from '../core/catalog/types'

export const PAGE_SIZE = 12

export type ProductSort = 'default' | 'price-asc' | 'price-desc' | 'name'

export type StockFilter = 'all' | StockStatus

export const PRODUCT_SORT_LABEL: Record<ProductSort, string> = {
  default: 'Önerilen',
  'price-asc': 'Fiyat (artan)',
  'price-desc': 'Fiyat (azalan)',
  name: 'İsim (A–Z)',
}

export const STOCK_FILTER_LABEL: Record<StockFilter, string> = {
  all: 'Tüm stoklar',
  in_stock: 'Stokta',
  pre_order: 'Ön sipariş',
  unknown: 'Belirtilmedi',
}

export function filterProductsByQuery(products: CatalogProduct[], query: string): CatalogProduct[] {
  const q = query.trim().toLowerCase()
  if (!q) return products
  return products.filter((p) => {
    const inName = p.name.toLowerCase().includes(q)
    const inDesc = p.description.toLowerCase().includes(q)
    const inAnswers = Object.values(p.categoryAnswers ?? {}).some((v) => v.toLowerCase().includes(q))
    return inName || inDesc || inAnswers
  })
}

export function filterProductsByStock(products: CatalogProduct[], stock: StockFilter): CatalogProduct[] {
  if (stock === 'all') return products
  return products.filter((p) => (p.stockStatus ?? 'unknown') === stock)
}

export function sortProducts(products: CatalogProduct[], sort: ProductSort): CatalogProduct[] {
  const list = [...products]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.priceUsd - b.priceUsd)
    case 'price-desc':
      return list.sort((a, b) => b.priceUsd - a.priceUsd)
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    default:
      return list
  }
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
    pageSize,
  }
}
