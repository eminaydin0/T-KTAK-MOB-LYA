import type { CatalogCategory, CatalogProduct, CategoryQuestion, StockStatus } from './types'

/** Aktif anahtar; vitrin katalogu burada. Eski surumler loadCatalog icinde migrate edilir. */
export const CATALOG_STORAGE_KEY = 'emin-dashboard-catalog-v3'
const LEGACY_CATALOG_KEYS = ['emin-dashboard-catalog-v2', 'emin-dashboard-catalog-v1'] as const

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
  }
}

export const defaultCategories: CatalogCategory[] = [
  {
    id: 1,
    name: 'Mobilya',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    questions: [
      {
        id: 'q_mob_olcu',
        label: 'Olcu (G x D x Y, cm)',
        placeholder: 'Orn: 180 x 90 x 75',
      },
      {
        id: 'q_mob_malzeme',
        label: 'Ana malzeme / kaplama',
        placeholder: 'Masif, MDF, laminat...',
      },
    ],
  },
  {
    id: 2,
    name: 'Ofis Mobilyasi',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    questions: [
      {
        id: 'q_ofis_ergo',
        label: 'Ergonomi / ayar ozellikleri',
        placeholder: 'Yukseklik ayari, bel destegi...',
      },
      {
        id: 'q_ofis_garanti',
        label: 'Garanti suresi',
        placeholder: 'Yil',
      },
    ],
  },
  {
    id: 3,
    name: 'Sehpa',
    imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop',
    questions: [
      {
        id: 'q_sehpa_tabla',
        label: 'Ust tabla olculeri (cm)',
        placeholder: 'Orn: 120 x 60',
      },
      { id: 'q_sehpa_raf', label: 'Raf / bolme sayisi', placeholder: '0, 1, 2...' },
      {
        id: 'q_sehpa_ayak',
        label: 'Ayak tipi / malzeme',
        placeholder: 'Metal, ahsap, gizli teker...',
      },
    ],
  },
  {
    id: 4,
    name: 'Yatak Odasi',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_yatak_ebat', label: 'Baz / yatak ebat', placeholder: '160x200, 180x200...' },
      { id: 'q_yatak_malzeme', label: 'Kumas / baslik', placeholder: 'Kadife, keten...' },
    ],
  },
  {
    id: 5,
    name: 'Depolama',
    imageUrl: 'https://images.unsplash.com/photo-1595428774220-17a58b32ab47?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_dep_ic', label: 'Ic duzen / modul', placeholder: 'Askili, raflı, cekmece' },
      { id: 'q_dep_malzeme', label: 'Govde malzemesi', placeholder: 'MDF, suntalam...' },
    ],
  },
  {
    id: 6,
    name: 'Aydinlatma',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_aydin_w', label: 'Watt / sicaklik (K)', placeholder: 'Orn: 12W, 3000K' },
      { id: 'q_aydin_mont', label: 'Montaj', placeholder: 'Tavan, masa, plug-in' },
    ],
  },
]

export const defaultProducts: CatalogProduct[] = [
  {
    id: 1,
    name: 'Ahsap Yemek Masasi',
    categoryId: 1,
    description: 'Genis ahsap tabla, mat vernik; 6-8 kisilik.',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1615874959474-d60996a81fe8?w=400&h=300&fit=crop',
    ],
    priceUsd: 899,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '180 x 90 x 75',
      q_mob_malzeme: 'Masif mese',
    },
  },
  {
    id: 2,
    name: 'Ergonomik Ofis Sandalyesi',
    categoryId: 2,
    description: 'File sirt, ayarlanabilir kol ve bel destegi.',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop'],
    priceUsd: 249,
    stockStatus: 'pre_order',
    leadTimeDays: 14,
    categoryAnswers: {
      q_ofis_ergo: 'Bel destegi + kol dayama ayarli',
      q_ofis_garanti: '2 yil',
    },
  },
  {
    id: 3,
    name: 'Moduler Kose Koltuk',
    categoryId: 1,
    description: 'Sag modul secilebilir; yikanabilir kilif.',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop'],
    priceUsd: 1899,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '280 x 180 x 85',
      q_mob_malzeme: 'Kumas + ahşap ayak',
    },
  },
  {
    id: 4,
    name: 'TV Unitesi Duvar Modulu',
    categoryId: 1,
    description: 'Kablo kanalli, mat lake beyaz.',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop',
    ],
    priceUsd: 620,
    stockStatus: 'pre_order',
    leadTimeDays: 21,
    categoryAnswers: {
      q_mob_olcu: '220 x 45 x 50',
      q_mob_malzeme: 'MDF lake',
    },
  },
  {
    id: 5,
    name: 'Yemek Sandalyesi (2li set)',
    categoryId: 1,
    description: 'Deri görünümlü döşeme, metal ayak.',
    images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop'],
    priceUsd: 198,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '45 x 55 x 92 (tek)',
      q_mob_malzeme: 'Suni deri',
    },
  },
  {
    id: 6,
    name: 'Konsol Dresuar',
    categoryId: 1,
    description: 'Dar koridor ve giris icin; cekmeceli.',
    images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=300&fit=crop'],
    priceUsd: 410,
    stockStatus: 'unknown',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '120 x 35 x 78',
      q_mob_malzeme: 'Ceviz laminat',
    },
  },
  {
    id: 7,
    name: 'L Sektor Ofis Masasi',
    categoryId: 2,
    description: 'Kablo tepsisi, sol/sag L secenegi.',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop'],
    priceUsd: 579,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_ofis_ergo: 'Yukseklik sabit 75 cm',
      q_ofis_garanti: '3 yil',
    },
  },
  {
    id: 8,
    name: 'Metal Kitaplik 5 Raflı',
    categoryId: 2,
    description: 'Ofis ve ev icin; toz boya siyah.',
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop'],
    priceUsd: 189,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_ofis_ergo: '-',
      q_ofis_garanti: '1 yil',
    },
  },
  {
    id: 9,
    name: 'Toplanti Masasi 240cm',
    categoryId: 2,
    description: 'Beyaz melamin yuzey, gizli priz modulu.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'],
    priceUsd: 1299,
    stockStatus: 'pre_order',
    leadTimeDays: 30,
    categoryAnswers: {
      q_ofis_ergo: 'Tek parca tabla',
      q_ofis_garanti: '2 yil',
    },
  },
  {
    id: 10,
    name: 'Orta Sehpa Mermer Desenli',
    categoryId: 3,
    description: 'Yuvarlak tabla, siyah metal ayak.',
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop',
    ],
    priceUsd: 320,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_sehpa_tabla: '80 cm (yuvarlak)',
      q_sehpa_raf: '0',
      q_sehpa_ayak: 'Metal mat siyah',
    },
  },
  {
    id: 11,
    name: 'Yan Sehpa Cift Cekmece',
    categoryId: 3,
    description: 'Yatak odasi ve koltuk yanina.',
    images: ['https://images.unsplash.com/photo-1616628182502-6c2a9c0a6e0e?w=400&h=300&fit=crop'],
    priceUsd: 145,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_sehpa_tabla: '50 x 40',
      q_sehpa_raf: '2 cekmece',
      q_sehpa_ayak: 'Ahşap',
    },
  },
  {
    id: 12,
    name: 'Seffaflik Cam Sehpa',
    categoryId: 3,
    description: 'Temperli cam, minimal profil.',
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7a115?w=400&h=300&fit=crop'],
    priceUsd: 265,
    stockStatus: 'pre_order',
    leadTimeDays: 10,
    categoryAnswers: {
      q_sehpa_tabla: '100 x 50',
      q_sehpa_raf: '0',
      q_sehpa_ayak: 'Krom',
    },
  },
  {
    id: 13,
    name: 'Baza Seti Komodin Dahil',
    categoryId: 4,
    description: 'Yumusak baslik, ortopedik uyumlu.',
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop'],
    priceUsd: 749,
    stockStatus: 'pre_order',
    leadTimeDays: 18,
    categoryAnswers: {
      q_yatak_ebat: '160 x 200',
      q_yatak_malzeme: 'Gri kadife',
    },
  },
  {
    id: 14,
    name: 'Komodin Tek Cekmece',
    categoryId: 4,
    description: 'Ceviz kapak, soft-close.',
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop'],
    priceUsd: 185,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_yatak_ebat: '50 x 40 x 48',
      q_yatak_malzeme: 'Ceviz',
    },
  },
  {
    id: 15,
    name: 'Surgulu Gardrop 240',
    categoryId: 5,
    description: 'Aynali kanat; ic giyinme cubugu.',
    images: ['https://images.unsplash.com/photo-1595428774220-17a58b32ab47?w=400&h=300&fit=crop'],
    priceUsd: 1100,
    stockStatus: 'pre_order',
    leadTimeDays: 35,
    categoryAnswers: {
      q_dep_ic: '2 aski + 4 raf',
      q_dep_malzeme: 'Suntalam beyaz',
    },
  },
  {
    id: 16,
    name: 'Sifonyer 6 Cekmece',
    categoryId: 5,
    description: 'Yatak odasi takimina uyumlu.',
    images: ['https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400&h=300&fit=crop'],
    priceUsd: 425,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_dep_ic: '6 cekmece',
      q_dep_malzeme: 'MDF',
    },
  },
  {
    id: 17,
    name: 'Lambader Tripod',
    categoryId: 6,
    description: 'Kumas abajur, dimmer uyumlu.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop'],
    priceUsd: 89,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_aydin_w: '9W LED, 3000K',
      q_aydin_mont: 'Masa / zemin',
    },
  },
  {
    id: 18,
    name: 'Modern Avize 3 Kollu',
    categoryId: 6,
    description: 'Buzlu cam küreler, bronz gövde.',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop'],
    priceUsd: 210,
    stockStatus: 'pre_order',
    leadTimeDays: 12,
    categoryAnswers: {
      q_aydin_w: '3x4W G9',
      q_aydin_mont: 'Tavan',
    },
  },
  {
    id: 19,
    name: 'Bench Oturak',
    categoryId: 1,
    description: 'Yatak ucu veya antre icin.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
    priceUsd: 165,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '120 x 40 x 45',
      q_mob_malzeme: 'Keten döşeme',
    },
  },
  {
    id: 20,
    name: 'Dosya Dolabi Metal',
    categoryId: 2,
    description: 'A4 klasor uyumlu; kilitli.',
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop'],
    priceUsd: 298,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_ofis_ergo: '4 cekmece',
      q_ofis_garanti: '2 yil',
    },
  },
]

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

export function loadCatalog(): { categories: CatalogCategory[]; products: CatalogProduct[] } {
  try {
    const raw = readCatalogRaw()
    if (!raw) {
      return { categories: defaultCategories, products: defaultProducts }
    }
    const parsed = JSON.parse(raw) as {
      categories?: Partial<CatalogCategory>[]
      products?: Partial<CatalogProduct>[]
    }
    if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) {
      return { categories: defaultCategories, products: defaultProducts }
    }
    const categories = parsed.categories
      .filter((c): c is Partial<CatalogCategory> & { id: number } => typeof c?.id === 'number')
      .map((c) => normalizeCategory(c))
    const products = parsed.products
      .filter((p): p is Partial<CatalogProduct> & { id: number } => typeof p?.id === 'number')
      .map((p) => normalizeProduct(p))
    return { categories, products }
  } catch {
    return { categories: defaultCategories, products: defaultProducts }
  }
}

export function saveCatalog(categories: CatalogCategory[], products: CatalogProduct[]) {
  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify({ categories, products }))
}

export function resetCatalog() {
  localStorage.removeItem(CATALOG_STORAGE_KEY)
  for (const key of LEGACY_CATALOG_KEYS) {
    localStorage.removeItem(key)
  }
}
