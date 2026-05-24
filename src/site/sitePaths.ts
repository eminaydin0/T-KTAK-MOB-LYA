/** Vitrin rotaları — tek yerden import edin */
export function categoryPath(categoryId: number) {
  return `/kategori/${categoryId}`
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

export function packagesAnchor() {
  return '/#packages'
}

export function denePath() {
  return '/dene'
}
