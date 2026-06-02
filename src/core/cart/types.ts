export type CartLine = {
  productId: number
  productName: string
  priceUsd: number
  imageUrl?: string
  qty: number
  /** Paket set indirimi öncesi birim fiyat (gösterim) */
  listPriceUsd?: number
  packageLabel?: string
}
