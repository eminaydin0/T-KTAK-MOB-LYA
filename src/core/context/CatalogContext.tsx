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
import type { CatalogCategory, CatalogProduct, CategoryQuestion } from '../catalog/types'
import {
  defaultCategories,
  defaultProducts,
  loadCatalog,
  resetCatalog,
  saveCatalog,
} from '../catalog/storage'

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

type CatalogContextValue = {
  categories: CatalogCategory[]
  products: CatalogProduct[]
  addCategory: (name: string, questionDrafts?: CategoryQuestionDraft[], imageUrl?: string) => void
  updateCategory: (
    id: number,
    patch: { name?: string; questions?: CategoryQuestion[]; imageUrl?: string }
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
      >
    >
  ) => void
  deleteCategory: (id: number) => void
  deleteProduct: (id: number) => void
  resetToDefaults: () => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const initialCatalog = useRef<ReturnType<typeof loadCatalog> | null>(null)
  if (initialCatalog.current === null) {
    initialCatalog.current = loadCatalog()
  }
  const [categories, setCategories] = useState<CatalogCategory[]>(() => initialCatalog.current!.categories)
  const [products, setProducts] = useState<CatalogProduct[]>(() => initialCatalog.current!.products)

  useEffect(() => {
    saveCatalog(categories, products)
  }, [categories, products])

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
      setCategories((prev) => [
        ...prev,
        {
          id,
          name: trimmed,
          questions,
          ...(img ? { imageUrl: img } : {}),
        },
      ])
    },
    []
  )

  const updateCategory = useCallback(
    (catId: number, patch: { name?: string; questions?: CategoryQuestion[]; imageUrl?: string }) => {
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
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        categoryId: input.categoryId,
        description,
        images,
        priceUsd,
        stockStatus: input.stockStatus ?? 'unknown',
        leadTimeDays: input.leadTimeDays ?? null,
        categoryAnswers,
      },
    ])
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
        >
      >
    ) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          const next: CatalogProduct = { ...p }
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
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const resetToDefaults = useCallback(() => {
    if (
      !window.confirm(
        'Katalog sifirlanacak: kategoriler ve urunler ornek veriye doner.\n\nSiparis kayitlari ayri tutulur ve bu islem onlari degistirmez.\n\nDevam edilsin mi?'
      )
    )
      return
    resetCatalog()
    setCategories(defaultCategories.map((c) => ({ ...c, questions: c.questions.map((q) => ({ ...q })) })))
    setProducts(
      defaultProducts.map((p) => ({
        ...p,
        images: [...p.images],
        categoryAnswers: { ...p.categoryAnswers },
      }))
    )
  }, [])

  const value = useMemo(
    () => ({
      categories,
      products,
      addCategory,
      updateCategory,
      addProduct,
      updateProduct,
      deleteCategory,
      deleteProduct,
      resetToDefaults,
    }),
    [
      categories,
      products,
      addCategory,
      updateCategory,
      addProduct,
      updateProduct,
      deleteCategory,
      deleteProduct,
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
