import type {
  AttributeDefinition,
  CategoryNode,
  Product,
  ShippingRule,
} from './types'

export const categoryTree: CategoryNode[] = [
  { id: 'cat-l1-oturma', slug: 'oturma', name: 'Oturma Gruplari', level: 1 },
  { id: 'cat-l1-yemek', slug: 'yemek', name: 'Yemek Odasi', level: 1 },
  { id: 'cat-l2-koltuk', slug: 'koltuk', name: 'Koltuklar', level: 2, parentId: 'cat-l1-oturma' },
  { id: 'cat-l2-sehpa', slug: 'sehpa', name: 'Sehpalar', level: 2, parentId: 'cat-l1-oturma' },
  { id: 'cat-l2-masa', slug: 'masa', name: 'Masalar', level: 2, parentId: 'cat-l1-yemek' },
  { id: 'cat-l3-uclu-koltuk', slug: 'uclu-koltuk', name: 'Uclu Koltuk', level: 3, parentId: 'cat-l2-koltuk' },
  { id: 'cat-l3-tv-sehpasi', slug: 'tv-sehpasi', name: 'TV Sehpasi', level: 3, parentId: 'cat-l2-sehpa' },
  { id: 'cat-l3-yemek-masasi', slug: 'yemek-masasi', name: 'Yemek Masasi', level: 3, parentId: 'cat-l2-masa' },
]

export const attributeDictionary: AttributeDefinition[] = [
  { id: 'material', name: 'Malzeme', type: 'select', options: ['Masif Ahsap', 'MDF', 'Metal'], filterable: true },
  { id: 'style', name: 'Stil', type: 'select', options: ['Modern', 'Klasik', 'Minimal'], filterable: true },
  { id: 'usageArea', name: 'Kullanim Alani', type: 'select', options: ['Salon', 'Yemek Odasi', 'Ofis'], filterable: true },
  { id: 'widthCm', name: 'Genislik', type: 'number', unit: 'cm', filterable: true },
  { id: 'leadTimeDays', name: 'Termin', type: 'number', unit: 'gun', filterable: false },
]

export const shippingRules: ShippingRule[] = [
  { countryCode: 'TR', currency: 'TRY', deliveryDays: '2-5', returnWindowDays: 14, logisticsType: 'parcel' },
  { countryCode: 'DE', currency: 'EUR', deliveryDays: '7-12', returnWindowDays: 30, logisticsType: 'freight' },
  { countryCode: 'AE', currency: 'USD', deliveryDays: '8-14', returnWindowDays: 21, logisticsType: 'freight' },
]

export const products: Product[] = [
  {
    id: 'prd-001',
    familyName: 'Luna Uclu Koltuk',
    categoryLevel3Id: 'cat-l3-uclu-koltuk',
    material: 'Masif Ahsap',
    style: 'Modern',
    usageArea: 'Salon',
    warrantyMonths: 24,
    leadTimeDays: 5,
    tags: ['yeni-sezon', 'ihracat-uygun'],
    variants: [
      {
        id: 'var-001',
        sku: 'LUN-3S-GRY',
        color: 'Gri',
        finish: 'Mat',
        widthCm: 220,
        depthCm: 90,
        heightCm: 84,
        stock: 36,
        packageWeightKg: 52,
      },
      {
        id: 'var-002',
        sku: 'LUN-3S-BEI',
        color: 'Bej',
        finish: 'Mat',
        widthCm: 220,
        depthCm: 90,
        heightCm: 84,
        stock: 18,
        packageWeightKg: 52,
      },
    ],
    pricingByCountry: {
      TR: { currency: 'TRY', b2c: 28500, b2b: 23900, minOrderB2B: 5 },
      DE: { currency: 'EUR', b2c: 990, b2b: 820, minOrderB2B: 10 },
      AE: { currency: 'USD', b2c: 1090, b2b: 910, minOrderB2B: 8 },
    },
  },
  {
    id: 'prd-002',
    familyName: 'Nova Yemek Masasi',
    categoryLevel3Id: 'cat-l3-yemek-masasi',
    material: 'MDF',
    style: 'Minimal',
    usageArea: 'Yemek Odasi',
    warrantyMonths: 24,
    leadTimeDays: 7,
    tags: ['cok-satan'],
    variants: [
      {
        id: 'var-003',
        sku: 'NOV-TBL-160',
        color: 'Ceviz',
        finish: 'Parlak',
        widthCm: 160,
        depthCm: 90,
        heightCm: 76,
        stock: 42,
        packageWeightKg: 45,
      },
    ],
    pricingByCountry: {
      TR: { currency: 'TRY', b2c: 19800, b2b: 16500, minOrderB2B: 4 },
      DE: { currency: 'EUR', b2c: 720, b2b: 610, minOrderB2B: 8 },
      AE: { currency: 'USD', b2c: 790, b2b: 670, minOrderB2B: 6 },
    },
  },
]

