export type Locale = 'tr' | 'en'
export type Channel = 'b2c' | 'b2b'

export interface CategoryNode {
  id: string
  slug: string
  name: string
  level: 1 | 2 | 3
  parentId?: string
}

export interface AttributeDefinition {
  id: string
  name: string
  type: 'text' | 'number' | 'select'
  unit?: string
  options?: string[]
  filterable: boolean
}

export interface ProductVariant {
  id: string
  sku: string
  color: string
  finish: string
  widthCm: number
  depthCm: number
  heightCm: number
  stock: number
  packageWeightKg: number
}

export interface ProductPricing {
  currency: 'TRY' | 'EUR' | 'USD'
  b2c: number
  b2b: number
  minOrderB2B: number
}

export interface Product {
  id: string
  familyName: string
  categoryLevel3Id: string
  material: string
  style: string
  usageArea: string
  warrantyMonths: number
  leadTimeDays: number
  tags: string[]
  variants: ProductVariant[]
  pricingByCountry: Record<string, ProductPricing>
}

export interface ShippingRule {
  countryCode: string
  currency: ProductPricing['currency']
  deliveryDays: string
  returnWindowDays: number
  logisticsType: 'parcel' | 'freight'
}

export interface CartItem {
  productId: string
  variantId: string
  quantity: number
}

export interface QuoteRequest {
  companyName: string
  countryCode: string
  email: string
  items: CartItem[]
}

