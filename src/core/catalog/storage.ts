import type { CatalogCategory, CatalogPackage, CatalogProduct, CategoryQuestion, StockStatus } from './types'
import { defaultCategories, defaultProducts } from './defaultCatalogSeed'
import { applyPackageSlugsToProducts, defaultPackages } from './defaultPackageSeed'

/** Aktif anahtar; vitrin katalogu burada. Eski surumler loadCatalog icinde migrate edilir. */
export const CATALOG_STORAGE_KEY = 'emin-dashboard-catalog-v5'
const LEGACY_CATALOG_KEYS = [
  'emin-dashboard-catalog-v4',
  'emin-dashboard-catalog-v3',
  'emin-dashboard-catalog-v2',
  'emin-dashboard-catalog-v1',
] as const

function normalizeCategory(raw: Partial<CatalogCategory> & { id: number }): CatalogCategory {
  const questions: CategoryQuestion[] = Array.isArray(raw.questions)
    ? raw.questions
        .filter(
          (q): q is CategoryQuestion =>
            typeof q === 'object' &&
            q !== null &&
            typeof (q as CategoryQuestion).id === 'string' &&
            typeof (q as CategoryQuestion).label === 'string'
        )
        .map((q) => ({
          id: q.id,
          label: q.label,
          placeholder: typeof q.placeholder === 'string' && q.placeholder.trim() ? q.placeholder : undefined,
        }))
    : []
  const imageUrlRaw = raw.imageUrl
  const imageUrl =
    typeof imageUrlRaw === 'string' && imageUrlRaw.trim() !== '' ? imageUrlRaw.trim() : undefined
  return {
    id: raw.id,
    name: typeof raw.name === 'string' ? raw.name : '',
    questions,
    ...(imageUrl ? { imageUrl } : {}),
  }
}

function normalizeProduct(raw: Partial<CatalogProduct> & { id: number }): CatalogProduct {
  const priceRaw: unknown = raw.priceUsd
  const priceUsd =
    typeof priceRaw === 'number' && Number.isFinite(priceRaw) && priceRaw >= 0
      ? priceRaw
      : typeof priceRaw === 'string' && priceRaw.trim() !== ''
        ? Math.max(0, parseFloat(priceRaw) || 0)
        : 0

  const ss = raw.stockStatus
  const stockStatus: StockStatus =
    ss === 'in_stock' || ss === 'pre_order' || ss === 'unknown' ? ss : 'unknown'

  let leadTimeDays: number | null = null
  const lt: unknown = raw.leadTimeDays
  if (lt === null || lt === undefined) leadTimeDays = null
  else if (typeof lt === 'number' && Number.isFinite(lt) && lt >= 0) leadTimeDays = Math.floor(lt)
  else if (typeof lt === 'string' && lt.trim() !== '') {
    const n = parseInt(lt, 10)
    leadTimeDays = Number.isFinite(n) && n >= 0 ? n : null
  }

  let categoryAnswers: Record<string, string> = {}
  const ca = raw.categoryAnswers
  if (ca && typeof ca === 'object' && !Array.isArray(ca)) {
    categoryAnswers = Object.fromEntries(
      Object.entries(ca).filter(
        ([k, v]) => typeof k === 'string' && typeof v === 'string'
      )
    )
  }

  let images: string[] = []
  const imgsUnknown: unknown = raw.images
  if (Array.isArray(imgsUnknown)) {
    images = imgsUnknown
      .filter((u): u is string => typeof u === 'string' && u.trim() !== '')
      .map((u) => u.trim())
  }
  const legacyUrl: unknown = (raw as { imageUrl?: unknown }).imageUrl
  if (images.length === 0 && typeof legacyUrl === 'string' && legacyUrl.trim()) {
    images = [legacyUrl.trim()]
  }

  let packageSlugs: string[] | undefined
  const ps = raw.packageSlugs
  if (Array.isArray(ps)) {
    packageSlugs = ps.filter((s): s is string => typeof s === 'string' && s.trim() !== '').map((s) => s.trim())
    if (packageSlugs.length === 0) packageSlugs = undefined
  }

  return {
    id: raw.id,
    name: typeof raw.name === 'string' ? raw.name : '',
    categoryId: typeof raw.categoryId === 'number' ? raw.categoryId : 0,
    description: typeof raw.description === 'string' ? raw.description : '',
    images,
    priceUsd,
    stockStatus,
    leadTimeDays,
    categoryAnswers,
    ...(packageSlugs ? { packageSlugs } : {}),
  }
}

function normalizePackage(raw: Partial<CatalogPackage> & { id: number }): CatalogPackage | null {
  const slug = typeof raw.slug === 'string' ? raw.slug.trim() : ''
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  if (!slug || !name) return null
  const kind =
    raw.kind === 'wedding' || raw.kind === 'living_room' || raw.kind === 'bedroom' ? raw.kind : 'living_room'
  const productIds = Array.isArray(raw.productIds)
    ? raw.productIds.filter((id): id is number => typeof id === 'number')
    : []
  const discount =
    typeof raw.bundleDiscountPercent === 'number' && Number.isFinite(raw.bundleDiscountPercent)
      ? Math.min(50, Math.max(0, raw.bundleDiscountPercent))
      : 0
  const imageUrlRaw = raw.imageUrl
  const imageUrl =
    typeof imageUrlRaw === 'string' && imageUrlRaw.trim() !== '' ? imageUrlRaw.trim() : undefined
  return {
    id: raw.id,
    slug,
    name,
    tagline: typeof raw.tagline === 'string' ? raw.tagline.trim() : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    kind,
    productIds,
    bundleDiscountPercent: discount,
    ...(imageUrl ? { imageUrl } : {}),
  }
}

export { defaultCategories, defaultProducts, defaultPackages }

function readCatalogRaw(): string | null {
  let raw = localStorage.getItem(CATALOG_STORAGE_KEY)
  if (raw) return raw
  for (const key of LEGACY_CATALOG_KEYS) {
    const legacy = localStorage.getItem(key)
    if (legacy) {
      try {
        localStorage.setItem(CATALOG_STORAGE_KEY, legacy)
      } catch {
        /* quota */
      }
      return legacy
    }
  }
  return null
}

export function loadCatalog(): {
  categories: CatalogCategory[]
  products: CatalogProduct[]
  packages: CatalogPackage[]
} {
  try {
    const raw = readCatalogRaw()
    if (!raw) {
      const products = applyPackageSlugsToProducts(defaultProducts, defaultPackages)
      return { categories: defaultCategories, products, packages: defaultPackages }
    }
    const parsed = JSON.parse(raw) as {
      categories?: Partial<CatalogCategory>[]
      products?: Partial<CatalogProduct>[]
      packages?: Partial<CatalogPackage>[]
    }
    if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) {
      const products = applyPackageSlugsToProducts(defaultProducts, defaultPackages)
      return { categories: defaultCategories, products, packages: defaultPackages }
    }
    const categories = parsed.categories
      .filter((c): c is Partial<CatalogCategory> & { id: number } => typeof c?.id === 'number')
      .map((c) => normalizeCategory(c))
    let products = parsed.products
      .filter((p): p is Partial<CatalogProduct> & { id: number } => typeof p?.id === 'number')
      .map((p) => normalizeProduct(p))
    const packages = Array.isArray(parsed.packages)
      ? parsed.packages
          .filter((p): p is Partial<CatalogPackage> & { id: number } => typeof p?.id === 'number')
          .map((p) => normalizePackage(p))
          .filter((p): p is CatalogPackage => p !== null)
      : defaultPackages
    products = applyPackageSlugsToProducts(products, packages.length > 0 ? packages : defaultPackages)
    return {
      categories,
      products,
      packages: packages.length > 0 ? packages : defaultPackages,
    }
  } catch {
    const products = applyPackageSlugsToProducts(defaultProducts, defaultPackages)
    return { categories: defaultCategories, products, packages: defaultPackages }
  }
}

export function saveCatalog(
  categories: CatalogCategory[],
  products: CatalogProduct[],
  packages: CatalogPackage[]
) {
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify({ categories, products, packages }))
}

export function resetCatalog() {
  localStorage.removeItem(CATALOG_STORAGE_KEY)
  for (const key of LEGACY_CATALOG_KEYS) {
    localStorage.removeItem(key)
  }
}
