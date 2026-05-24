import type { CatalogPackage } from './types'

export const defaultPackages: CatalogPackage[] = [
  {
    id: 1,
    slug: 'dugun-paketi',
    name: 'Düğün Paketi',
    tagline: 'Söz, nişan ve düğün organizasyonu için komple set',
    description:
      'Yemek masası, sandalye setleri, konsol ve aydınlatmayı bir araya getiren düğün paketi. Tüm parçalar ayrı ayrı da sipariş edilebilir; tam sette %12 indirim uygulanır.\n\nShowroom’da masa düzeni ve kumaş seçimi için randevu alabilirsiniz. Teslimat ve kurulum hizmeti talep üzerine planlanır.',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=700&fit=crop',
    kind: 'wedding',
    productIds: [1, 5, 6, 10, 17, 18],
    bundleDiscountPercent: 12,
  },
  {
    id: 2,
    slug: 'oturma-odasi-paketi',
    name: 'Oturma Odası Paketi',
    tagline: 'Koltuk takımından TV ünitesine tam oturma grubu',
    description:
      'Köşe koltuk, sehpalar, TV ünitesi, berjer ve lambaderden oluşan oturma odası seti. Her parça tek başına satılır; set halinde %10 tasarruf edersiniz.\n\nKumaş ve ayak rengi kartelden özelleştirilebilir. Ölçü keşfi ücretsizdir.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=700&fit=crop',
    kind: 'living_room',
    productIds: [3, 4, 10, 11, 17, 21],
    bundleDiscountPercent: 10,
  },
  {
    id: 3,
    slug: 'yatak-odasi-paketi',
    name: 'Yatak Odası Paketi',
    tagline: 'Baza, gardırop ve depolama — uyumlu yatak odası',
    description:
      'Baza seti, komodin, şifonyer ve gardırop modüllerini kapsayan yatak odası paketi. Parça parça alım mümkündür; tam sette %10 indirim.\n\nModüler iç düzen ve kumaş seçenekleri sipariş sırasında netleştirilir.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=700&fit=crop',
    kind: 'bedroom',
    productIds: [13, 14, 15, 16, 24],
    bundleDiscountPercent: 10,
  },
]

/** Urunlere paket slug'larini isler (seed senkronu) */
export function applyPackageSlugsToProducts<T extends { id: number; packageSlugs?: string[] }>(
  products: T[],
  packages: CatalogPackage[]
): T[] {
  const byProduct = new Map<number, Set<string>>()
  for (const pkg of packages) {
    for (const pid of pkg.productIds) {
      if (!byProduct.has(pid)) byProduct.set(pid, new Set())
      byProduct.get(pid)!.add(pkg.slug)
    }
  }
  return products.map((p) => {
    const slugs = byProduct.get(p.id)
    if (!slugs?.size) {
      const { packageSlugs: _drop, ...rest } = p
      return rest as T
    }
    return { ...p, packageSlugs: [...slugs] }
  })
}

export function packagePartsTotalUsd(productIds: number[], products: { id: number; priceUsd: number }[]) {
  return productIds.reduce((sum, id) => {
    const p = products.find((x) => x.id === id)
    return sum + (p?.priceUsd ?? 0)
  }, 0)
}

export function packageBundlePriceUsd(
  productIds: number[],
  products: { id: number; priceUsd: number }[],
  discountPercent: number
) {
  const total = packagePartsTotalUsd(productIds, products)
  return Math.round(total * (1 - discountPercent / 100) * 100) / 100
}
