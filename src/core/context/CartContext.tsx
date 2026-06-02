import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CatalogProduct } from '../catalog/types'
import { productPrimaryImage } from '../catalog/types'
import { loadCart, saveCart } from '../cart/storage'
import type { CartLine } from '../cart/types'

type AddItemInput = {
  productId: number
  productName: string
  priceUsd: number
  imageUrl?: string
  qty?: number
  listPriceUsd?: number
  packageLabel?: string
}

type AddPackageOptions = {
  openPreview?: boolean
  bundleDiscountPercent?: number
  packageName?: string
}

type CartContextValue = {
  items: CartLine[]
  totalItems: number
  subtotalUsd: number
  previewOpen: boolean
  lastAddedName: string | null
  addItem: (input: AddItemInput, options?: { openPreview?: boolean }) => void
  addProduct: (product: CatalogProduct, qty?: number, options?: { openPreview?: boolean }) => void
  addPackageProducts: (products: CatalogProduct[], options?: AddPackageOptions) => void
  updateQty: (productId: number, qty: number) => void
  removeItem: (productId: number) => void
  clear: () => void
  openPreview: () => void
  closePreview: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => loadCart())
  const [previewOpen, setPreviewOpen] = useState(false)
  const [lastAddedName, setLastAddedName] = useState<string | null>(null)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((input: AddItemInput, options?: { openPreview?: boolean }) => {
    const qty = Math.max(1, Math.floor(input.qty ?? 1))
    const productName = input.productName.trim()
    if (!productName) return

    setItems((prev) => {
      const idx = prev.findIndex((l) => l.productId === input.productId)
      if (idx === -1) {
        return [
          ...prev,
          {
            productId: input.productId,
            productName,
            priceUsd: Math.max(0, input.priceUsd),
            qty,
            ...(input.imageUrl?.trim() ? { imageUrl: input.imageUrl.trim() } : {}),
            ...(input.listPriceUsd != null && input.listPriceUsd > input.priceUsd
              ? { listPriceUsd: input.listPriceUsd }
              : {}),
            ...(input.packageLabel ? { packageLabel: input.packageLabel } : {}),
          },
        ]
      }
      const next = [...prev]
      next[idx] = { ...next[idx], qty: next[idx].qty + qty }
      return next
    })

    setLastAddedName(productName)
    if (options?.openPreview !== false) {
      setPreviewOpen(true)
    }
  }, [])

  const addProduct = useCallback(
    (product: CatalogProduct, qty = 1, options?: { openPreview?: boolean }) => {
      addItem(
        {
          productId: product.id,
          productName: product.name,
          priceUsd: product.priceUsd,
          imageUrl: productPrimaryImage(product),
          qty,
        },
        options
      )
    },
    [addItem]
  )

  const addPackageProducts = useCallback(
    (products: CatalogProduct[], options?: AddPackageOptions) => {
      if (products.length === 0) return
      const discount = Math.min(50, Math.max(0, Math.floor(options?.bundleDiscountPercent ?? 0)))
      const partsTotal = products.reduce((sum, p) => sum + p.priceUsd, 0)
      const factor = partsTotal > 0 && discount > 0 ? 1 - discount / 100 : 1
      const packageLabel = options?.packageName?.trim() || undefined

      products.forEach((product, index) => {
        let priceUsd = Math.round(product.priceUsd * factor * 100) / 100
        if (index === products.length - 1 && discount > 0 && partsTotal > 0) {
          const prevSum = products
            .slice(0, -1)
            .reduce((sum, p) => sum + Math.round(p.priceUsd * factor * 100) / 100, 0)
          const bundleTotal = Math.round(partsTotal * factor * 100) / 100
          priceUsd = Math.round((bundleTotal - prevSum) * 100) / 100
        }
        addItem(
          {
            productId: product.id,
            productName: product.name,
            priceUsd,
            listPriceUsd: discount > 0 ? product.priceUsd : undefined,
            imageUrl: productPrimaryImage(product),
            qty: 1,
            packageLabel,
          },
          { openPreview: false }
        )
      })
      setLastAddedName(
        packageLabel
          ? `${packageLabel} (${products.length} parça${discount > 0 ? `, %${discount} indirim` : ''})`
          : `${products.length} parçalık set`
      )
      if (options?.openPreview !== false) setPreviewOpen(true)
    },
    [addItem]
  )

  const updateQty = useCallback((productId: number, qty: number) => {
    const nextQty = Math.floor(qty)
    if (nextQty <= 0) {
      setItems((prev) => prev.filter((l) => l.productId !== productId))
      return
    }
    setItems((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, qty: nextQty } : l))
    )
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setLastAddedName(null)
  }, [])

  const openPreview = useCallback(() => setPreviewOpen(true), [])
  const closePreview = useCallback(() => setPreviewOpen(false), [])

  const totalItems = useMemo(() => items.reduce((sum, l) => sum + l.qty, 0), [items])
  const subtotalUsd = useMemo(
    () => items.reduce((sum, l) => sum + l.priceUsd * l.qty, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotalUsd,
      previewOpen,
      lastAddedName,
      addItem,
      addProduct,
      addPackageProducts,
      updateQty,
      removeItem,
      clear,
      openPreview,
      closePreview,
    }),
    [
      items,
      totalItems,
      subtotalUsd,
      previewOpen,
      lastAddedName,
      addItem,
      addProduct,
      addPackageProducts,
      updateQty,
      removeItem,
      clear,
      openPreview,
      closePreview,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
