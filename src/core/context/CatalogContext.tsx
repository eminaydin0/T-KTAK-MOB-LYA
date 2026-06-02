import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { CatalogCategory, CatalogPackage, CatalogPackageKind, CatalogProduct, CategoryQuestion } from '../catalog/types'
import {
  defaultCategories,
  defaultProducts,
  loadCatalog,
  resetCatalog,
  saveCatalog,
} from '../catalog/storage'
import { applyPackageSlugsToProducts, defaultPackages } from '../catalog/defaultPackageSeed'
import { ensureUniqueSlug, slugifyTr } from '../catalog/slugify'

export type CategoryQuestionDraft = { label: string; placeholder?: string }

type AddProductInput = {
  name: string
  categoryId: number
  description: string
  images: string[]
  priceUsd: number
  stockStatus?: CatalogProduct['stockStatus']
  leadTimeDays?: number | null
  categoryAnswers?: Record<string, string>
}

type AddPackageInput = {
  name: string
  slug?: string
  tagline: string
  description: string
  kind: CatalogPackageKind
  imageUrl?: string
  productIds: number[]
  bundleDiscountPercent: number
}

type CatalogContextValue = {
  categories: CatalogCategory[]
  products: CatalogProduct[]
  packages: CatalogPackage[]
  addCategory: (name: string, questionDrafts?: CategoryQuestionDraft[], imageUrl?: string) => void
  updateCategory: (
    id: number,
    patch: {
      name?: string
      questions?: CategoryQuestion[]
      imageUrl?: string
      slug?: string
      seoDescription?: string
    }
  ) => void
  addProduct: (input: AddProductInput) => void
  updateProduct: (
    id: number,
    patch: Partial<
      Pick<
        CatalogProduct,
        | 'name'
        | 'description'
        | 'images'
        | 'categoryId'
        | 'priceUsd'
        | 'stockStatus'
        | 'leadTimeDays'
        | 'categoryAnswers'
        | 'slug'
      >
    >
  ) => void
  addPackage: (input: AddPackageInput) => void
  updatePackage: (
    id: number,
    patch: Partial<
      Pick<
        CatalogPackage,
        'name' | 'slug' | 'tagline' | 'description' | 'kind' | 'imageUrl' | 'productIds' | 'bundleDiscountPercent'
      >
    >
  ) => void
  deleteCategory: (id: number) => void
  deleteProduct: (id: number) => void
  deletePackage: (id: number) => void
  resetToDefaults: () => void
}

function slugifyPackageName(name: string) {
  return slugifyTr(name)
}

function uniqueSlug(base: string, existing: CatalogPackage[], exceptId?: number) {
  let slug = base || 'paket'
  let n = 1
  while (existing.some((p) => p.id !== exceptId && p.slug === slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  return slug
}

function syncProductsPackageSlugs(products: CatalogProduct[], packages: CatalogPackage[]) {
  return applyPackageSlugsToProducts(
    products.map((p) => {
      const { packageSlugs: _drop, ...rest } = p
      return rest as CatalogProduct
    }),
    packages
  )
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const initialCatalog = useRef<ReturnType<typeof loadCatalog> | null>(null)
  if (initialCatalog.current === null) {
    initialCatalog.current = loadCatalog()
  }
  const [categories, setCategories] = useState<CatalogCategory[]>(() => initialCatalog.current!.categories)
  const [products, setProducts] = useState<CatalogProduct[]>(() => initialCatalog.current!.products)
  const [packages, setPackages] = useState<CatalogPackage[]>(() => initialCatalog.current!.packages)

  useEffect(() => {
    saveCatalog(categories, products, packages)
  }, [categories, products, packages])

  const addCategory = useCallback(
    (name: string, questionDrafts?: CategoryQuestionDraft[], imageUrl?: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      const id = Date.now()
      const questions: CategoryQuestion[] = (questionDrafts ?? [])
        .filter((q) => q.label.trim())
        .map((q, i) => ({
          id: `q_${id}_${i}_${Math.random().toString(36).slice(2, 8)}`,
          label: q.label.trim(),
          placeholder: q.placeholder?.trim() || undefined,
        }))
      const img = imageUrl?.trim()
      setCategories((prev) => {
        const used = new Set(prev.map((c) => c.slug))
        const slug = ensureUniqueSlug(slugifyTr(trimmed), used, `kategori-${id}`)
        return [
          ...prev,
          {
            id,
            name: trimmed,
            slug,
            questions,
            ...(img ? { imageUrl: img } : {}),
          },
        ]
      })
    },
    []
  )

  const updateCategory = useCallback(
    (
      catId: number,
      patch: {
        name?: string
        questions?: CategoryQuestion[]
        imageUrl?: string
        slug?: string
        seoDescription?: string
      }
    ) => {
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id !== catId) return c
          const name = patch.name !== undefined ? patch.name.trim() : c.name
          const questions = patch.questions !== undefined ? patch.questions : c.questions
          let next: CatalogCategory = { ...c, name: name || c.name, questions }
          if (patch.imageUrl !== undefined) {
            const t = patch.imageUrl.trim()
            if (!t) {
              const { imageUrl: _drop, ...rest } = next
              next = rest as CatalogCategory
            } else {
              next = { ...next, imageUrl: t }
            }
          }
          if (patch.slug !== undefined) {
            const t = patch.slug.trim()
            if (t) {
              const used = new Set(prev.filter((x) => x.id !== catId).map((x) => x.slug))
              next = { ...next, slug: ensureUniqueSlug(slugifyTr(t), used, c.slug) }
            }
          }
          if (patch.seoDescription !== undefined) {
            const t = patch.seoDescription.trim()
            if (!t) {
              const { seoDescription: _drop, ...rest } = next
              next = rest as CatalogCategory
            } else {
              next = { ...next, seoDescription: t }
            }
          }
          return next
        })
      )
    },
    []
  )

  const addProduct = useCallback((input: AddProductInput) => {
    const name = input.name.trim()
    if (!name || !input.categoryId) return
    const description = input.description.trim() || 'Aciklama eklenmedi'
    const images = input.images.map((u) => u.trim()).filter(Boolean)
    const priceUsd =
      typeof input.priceUsd === 'number' && Number.isFinite(input.priceUsd)
        ? Math.max(0, input.priceUsd)
        : 0
    const categoryAnswers = input.categoryAnswers ?? {}
    setProducts((prev) => {
      const used = new Set(prev.map((p) => p.slug))
      const slug = ensureUniqueSlug(slugifyTr(name), used, `urun-${Date.now()}`)
      return [
        ...prev,
        {
          id: Date.now(),
          name,
          slug,
          categoryId: input.categoryId,
          description,
          images,
          priceUsd,
          stockStatus: input.stockStatus ?? 'unknown',
          leadTimeDays: input.leadTimeDays ?? null,
          categoryAnswers,
        },
      ]
    })
  }, [])

  const updateProduct = useCallback(
    (
      id: number,
      patch: Partial<
        Pick<
          CatalogProduct,
          | 'name'
          | 'description'
          | 'images'
          | 'categoryId'
          | 'priceUsd'
          | 'stockStatus'
          | 'leadTimeDays'
          | 'categoryAnswers'
          | 'slug'
        >
      >
    ) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          const next: CatalogProduct = { ...p }
          if (patch.slug !== undefined) {
            const t = patch.slug.trim()
            if (t) {
              const used = new Set(prev.filter((x) => x.id !== id).map((x) => x.slug))
              next.slug = ensureUniqueSlug(slugifyTr(t), used, p.slug)
            }
          }
          if (patch.name !== undefined) next.name = patch.name.trim()
          if (patch.description !== undefined) {
            next.description = patch.description.trim() || 'Aciklama eklenmedi'
          }
          if (patch.images !== undefined)
            next.images = patch.images.map((u) => u.trim()).filter(Boolean)
          if (patch.categoryId !== undefined) next.categoryId = patch.categoryId
          if (patch.priceUsd !== undefined) {
            next.priceUsd =
              typeof patch.priceUsd === 'number' && Number.isFinite(patch.priceUsd)
                ? Math.max(0, patch.priceUsd)
                : 0
          }
          if (patch.stockStatus !== undefined) next.stockStatus = patch.stockStatus
          if (patch.leadTimeDays !== undefined) {
            next.leadTimeDays =
              patch.leadTimeDays === null
                ? null
                : typeof patch.leadTimeDays === 'number' && Number.isFinite(patch.leadTimeDays)
                  ? Math.max(0, Math.floor(patch.leadTimeDays))
                  : null
          }
          if (patch.categoryAnswers !== undefined) next.categoryAnswers = { ...patch.categoryAnswers }
          return next
        })
      )
    },
    []
  )

  const deleteCategory = useCallback((id: number) => {
    if (!window.confirm('Bu kategoriyi ve icindeki tum urunleri silmek istiyor musunuz?')) return
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setProducts((prev) => prev.filter((p) => p.categoryId !== id))
  }, [])

  const deleteProduct = useCallback((id: number) => {
    if (
      !window.confirm(
        'Bu urunu katalogdan kaldirmak istiyor musunuz?\n\nGecmis siparislerdeki urun adlari (o andaki kopya) degismez.'
      )
    )
      return
    setPackages((prevPkg) => {
      const nextPkg = prevPkg.map((pkg) => ({
        ...pkg,
        productIds: pkg.productIds.filter((pid) => pid !== id),
      }))
      setProducts((prevProds) =>
        syncProductsPackageSlugs(
          prevProds.filter((p) => p.id !== id),
          nextPkg
        )
      )
      return nextPkg
    })
  }, [])

  const addPackage = useCallback((input: AddPackageInput) => {
    const name = input.name.trim()
    if (!name) return
    setPackages((prev) => {
      const baseSlug = slugifyPackageName(input.slug?.trim() || name)
      const slug = uniqueSlug(baseSlug, prev)
      const productIds = [...new Set(input.productIds.filter((id) => Number.isFinite(id)))]
      const discount = Math.min(50, Math.max(0, Math.floor(input.bundleDiscountPercent)))
      const imageUrl = input.imageUrl?.trim() || undefined
      const nextPkg: CatalogPackage = {
        id: Date.now(),
        slug,
        name,
        tagline: input.tagline.trim(),
        description: input.description.trim() || 'Aciklama eklenmedi',
        kind: input.kind,
        productIds,
        bundleDiscountPercent: discount,
        ...(imageUrl ? { imageUrl } : {}),
      }
      const next = [...prev, nextPkg]
      setProducts((prods) => syncProductsPackageSlugs(prods, next))
      return next
    })
  }, [])

  const updatePackage = useCallback(
    (
      id: number,
      patch: Partial<
        Pick<
          CatalogPackage,
          'name' | 'slug' | 'tagline' | 'description' | 'kind' | 'imageUrl' | 'productIds' | 'bundleDiscountPercent'
        >
      >
    ) => {
      setPackages((prev) => {
        const next = prev.map((pkg) => {
          if (pkg.id !== id) return pkg
          let slug = pkg.slug
          if (patch.slug !== undefined) {
            const base = slugifyPackageName(patch.slug.trim() || pkg.name)
            slug = uniqueSlug(base, prev, id)
          }
          const name = patch.name !== undefined ? patch.name.trim() || pkg.name : pkg.name
          const productIds =
            patch.productIds !== undefined
              ? [...new Set(patch.productIds.filter((pid) => Number.isFinite(pid)))]
              : pkg.productIds
          const bundleDiscountPercent =
            patch.bundleDiscountPercent !== undefined
              ? Math.min(50, Math.max(0, Math.floor(patch.bundleDiscountPercent)))
              : pkg.bundleDiscountPercent
          let imageUrl = pkg.imageUrl
          if (patch.imageUrl !== undefined) {
            const t = patch.imageUrl.trim()
            imageUrl = t || undefined
          }
          return {
            ...pkg,
            name,
            slug,
            tagline: patch.tagline !== undefined ? patch.tagline.trim() : pkg.tagline,
            description:
              patch.description !== undefined
                ? patch.description.trim() || 'Aciklama eklenmedi'
                : pkg.description,
            kind: patch.kind ?? pkg.kind,
            productIds,
            bundleDiscountPercent,
            ...(imageUrl ? { imageUrl } : {}),
          }
        })
        setProducts((prods) => syncProductsPackageSlugs(prods, next))
        return next
      })
    },
    []
  )

  const deletePackage = useCallback((id: number) => {
    if (!window.confirm('Bu paketi silmek istiyor musunuz? Urunler katalogda kalir.')) return
    setPackages((prev) => {
      const next = prev.filter((p) => p.id !== id)
      setProducts((prods) => syncProductsPackageSlugs(prods, next))
      return next
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    if (
      !window.confirm(
        'Katalog sifirlanacak: kategoriler ve urunler ornek veriye doner.\n\nSiparis kayitlari ayri tutulur ve bu islem onlari degistirmez.\n\nDevam edilsin mi?'
      )
    )
      return
    resetCatalog()
    const pkg = defaultPackages.map((p) => ({ ...p, productIds: [...p.productIds] }))
    setCategories(defaultCategories.map((c) => ({ ...c, questions: c.questions.map((q) => ({ ...q })) })))
    setProducts(
      applyPackageSlugsToProducts(
        defaultProducts.map((p) => ({
          ...p,
          images: [...p.images],
          categoryAnswers: { ...p.categoryAnswers },
        })),
        pkg
      )
    )
    setPackages(pkg)
  }, [])

  const value = useMemo(
    () => ({
      categories,
      products,
      packages,
      addCategory,
      updateCategory,
      addProduct,
      updateProduct,
      addPackage,
      updatePackage,
      deleteCategory,
      deleteProduct,
      deletePackage,
      resetToDefaults,
    }),
    [
      categories,
      products,
      packages,
      addCategory,
      updateCategory,
      addProduct,
      updateProduct,
      addPackage,
      updatePackage,
      deleteCategory,
      deleteProduct,
      deletePackage,
      resetToDefaults,
    ]
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
