/** Vitrin rotaları — tek yerden import edin */
import type { CatalogCategory, CatalogProduct } from '../core/catalog/types'

export function categoryPath(category: Pick<CatalogCategory, 'slug'> | string) {
  const slug = typeof category === 'string' ? category : category.slug
  return `/kategori/${slug}`
}

export function productPath(product: Pick<CatalogProduct, 'slug'> | string) {
  const slug = typeof product === 'string' ? product : product.slug
  return `/urun/${slug}`
}

export function cartPath() {
  return '/sepet'
}

export function checkoutPath() {
  return '/odeme'
}

export function checkoutSuccessPath() {
  return '/odeme/basarili'
}

export function packagePath(slug: string) {
  return `/paket/${slug}`
}

export function packagesPath() {
  return '/setler'
}

export function packagesAnchor() {
  return packagesPath()
}

export function catalogPath() {
  return '/katalog'
}

export function catalogAnchor() {
  return catalogPath()
}

export function denePath() {
  return '/dene'
}

export function contactPath() {
  return '/iletisim'
}

export function homePath() {
  return '/'
}
