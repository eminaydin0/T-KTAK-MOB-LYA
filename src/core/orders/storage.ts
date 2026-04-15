import type { Order, OrderCommunication, OrderLine, OrderStatus, OrderStatusChange } from './types'

const STORAGE_KEY = 'emin-dashboard-orders-v1'
const SEQ_PREFIX = 'emin-order-ref-seq-'

/** Yillik artan siparis referansi (or. EMIN-2026-00007) */
export function nextReferenceCode(): string {
  const y = new Date().getFullYear()
  const key = `${SEQ_PREFIX}${y}`
  const prev = parseInt(localStorage.getItem(key) || '0', 10)
  const next = prev + 1
  localStorage.setItem(key, String(next))
  return `EMIN-${y}-${String(next).padStart(5, '0')}`
}

function normalizeLine(raw: unknown): OrderLine | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const productName = typeof r.productName === 'string' ? r.productName.trim() : ''
  const qty = typeof r.qty === 'number' ? Math.max(1, Math.floor(r.qty)) : 1
  if (!productName) return null
  const productId = typeof r.productId === 'number' ? r.productId : undefined
  return { productName, qty, ...(productId !== undefined ? { productId } : {}) }
}

function normalizeOrder(raw: Partial<Order> & { id: string }): Order {
  const status: OrderStatus =
    raw.status === 'yeni' || raw.status === 'onay' || raw.status === 'kargo' || raw.status === 'tamam'
      ? raw.status
      : 'yeni'

  const linesRaw = Array.isArray(raw.lines) ? raw.lines : []
  const lines = linesRaw.map(normalizeLine).filter((x): x is OrderLine => x !== null)

  const createdAt =
    typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString()

  let referenceCode =
    typeof raw.referenceCode === 'string' && raw.referenceCode.trim() ? raw.referenceCode.trim() : ''

  if (!referenceCode) {
    const y = new Date(createdAt).getFullYear()
    const tail = String(raw.id).replace(/\D/g, '').slice(-5).padStart(5, '0')
    referenceCode = `EMIN-${y}-${tail}`
  }

  const internalNotes =
    typeof raw.internalNotes === 'string' && raw.internalNotes.trim()
      ? raw.internalNotes.trim()
      : undefined

  const commRaw = Array.isArray(raw.communications) ? raw.communications : []
  const communications: OrderCommunication[] = commRaw
    .map((c): OrderCommunication | null => {
      if (!c || typeof c !== 'object') return null
      const r = c as Record<string, unknown>
      const id = typeof r.id === 'string' ? r.id : ''
      const at = typeof r.at === 'string' ? r.at : new Date().toISOString()
      const message = typeof r.message === 'string' ? r.message.trim() : ''
      const ch = r.channel
      const channel =
        ch === 'telefon' ||
        ch === 'whatsapp' ||
        ch === 'eposta' ||
        ch === 'yuz_yuze' ||
        ch === 'diger'
          ? ch
          : 'diger'
      if (!id || !message) return null
      return { id, at, channel, message }
    })
    .filter((x): x is OrderCommunication => x !== null)

  const logRaw = Array.isArray(raw.statusLog) ? raw.statusLog : []
  const statusLog: OrderStatusChange[] = logRaw
    .map((s): OrderStatusChange | null => {
      if (!s || typeof s !== 'object') return null
      const r = s as Record<string, unknown>
      const at = typeof r.at === 'string' ? r.at : new Date().toISOString()
      const from = r.from as OrderStatus
      const to = r.to as OrderStatus
      if (from !== 'yeni' && from !== 'onay' && from !== 'kargo' && from !== 'tamam') return null
      if (to !== 'yeni' && to !== 'onay' && to !== 'kargo' && to !== 'tamam') return null
      return { at, from, to }
    })
    .filter((x): x is OrderStatusChange => x !== null)

  return {
    id: raw.id,
    referenceCode,
    createdAt,
    customerName: typeof raw.customerName === 'string' ? raw.customerName.trim() || 'Musteri' : 'Musteri',
    phone: typeof raw.phone === 'string' ? raw.phone.trim() : '',
    lines: lines.length > 0 ? lines : [{ productName: 'Urun', qty: 1 }],
    status,
    note: typeof raw.note === 'string' && raw.note.trim() ? raw.note.trim() : undefined,
    internalNotes,
    communications,
    statusLog,
  }
}

export const defaultOrders: Order[] = [
  {
    id: 'ord-demo-1',
    referenceCode: 'EMIN-2026-00001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customerName: 'Ayse Yilmaz',
    phone: '+90 532 000 00 01',
    lines: [{ productId: 1, productName: 'Ahsap Yemek Masasi', qty: 1 }],
    status: 'tamam',
    communications: [],
    statusLog: [],
  },
  {
    id: 'ord-demo-2',
    referenceCode: 'EMIN-2026-00002',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    customerName: 'Mehmet Kaya',
    phone: '+90 533 111 22 33',
    lines: [
      { productId: 2, productName: 'Ergonomik Ofis Sandalyesi', qty: 2 },
      { productId: 1, productName: 'Ahsap Yemek Masasi', qty: 1 },
    ],
    status: 'kargo',
    communications: [],
    statusLog: [],
  },
  {
    id: 'ord-demo-3',
    referenceCode: 'EMIN-2026-00003',
    createdAt: new Date().toISOString(),
    customerName: 'Selin Demir',
    phone: '+90 544 999 88 77',
    lines: [{ productId: 2, productName: 'Ergonomik Ofis Sandalyesi', qty: 1 }],
    status: 'yeni',
    note: 'Teslimat: Kadikoy, hafta ici 09:00-18:00',
    communications: [],
    statusLog: [],
  },
]

/** Ilk yuklemede ornek siparis numaralari (00001-00003) ile cakismasin diye sayaci esitle */
function seedSequenceFromDemoIfFresh() {
  const y = new Date().getFullYear()
  const key = `${SEQ_PREFIX}${y}`
  const demoCount = defaultOrders.filter((o) => o.referenceCode.startsWith(`EMIN-${y}-`)).length
  if (demoCount === 0) return
  const lastDemo = Math.max(
    ...defaultOrders.map((o) => {
      const m = /^EMIN-\d+-(\d+)$/.exec(o.referenceCode)
      return m ? parseInt(m[1], 10) : 0
    })
  )
  const cur = parseInt(localStorage.getItem(key) || '0', 10)
  if (cur < lastDemo) localStorage.setItem(key, String(lastDemo))
}

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      seedSequenceFromDemoIfFresh()
      return defaultOrders.map((o) => ({ ...o }))
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return defaultOrders.map((o) => ({ ...o }))
    return parsed
      .filter((x): x is Partial<Order> & { id: string } => x && typeof (x as Order).id === 'string')
      .map((x) => normalizeOrder(x))
  } catch {
    return defaultOrders.map((o) => ({ ...o }))
  }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}
