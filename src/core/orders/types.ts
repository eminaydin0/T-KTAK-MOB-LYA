/**
 * Siparis durumu (satis sonrasi tipik akis: bekleme → onay → sevkiyat → kapanis)
 */
export type OrderStatus = 'yeni' | 'onay' | 'kargo' | 'tamam'

/** Satirda urun adi siparis aninda sabitlenir; productId sadece referans icindir */
export type OrderLine = {
  productId?: number
  productName: string
  qty: number
}

export type CommChannel = 'telefon' | 'whatsapp' | 'eposta' | 'yuz_yuze' | 'diger'

/** Musteri ile yapilan iletisim kaydi (admin) */
export type OrderCommunication = {
  id: string
  at: string
  channel: CommChannel
  message: string
}

/** Durum degisikligi gecmisi */
export type OrderStatusChange = {
  at: string
  from: OrderStatus
  to: OrderStatus
}

export type Order = {
  /** Dahili benzersiz id */
  id: string
  /** Musteriye gosterilebilir siparis no (or. EMIN-2026-00042) */
  referenceCode: string
  createdAt: string
  customerName: string
  phone: string
  lines: OrderLine[]
  status: OrderStatus
  /** Musteri notu (siparis olusturulurken) */
  note?: string
  /** Dahili notlar — sadece admin */
  internalNotes?: string
  /** Musteri iletisimi */
  communications: OrderCommunication[]
  /** Durum gecmisi */
  statusLog: OrderStatusChange[]
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  yeni: 'Beklemede',
  onay: 'Onaylandi',
  kargo: 'Sevkiyatta',
  tamam: 'Tamamlandi',
}

/** Gercek is akisina uygun aciklama (UI ipucu) */
export const ORDER_STATUS_HINT: Record<OrderStatus, string> = {
  yeni: 'Yeni dusen siparis, henuz isleme alinmadi',
  onay: 'Stok / uretim onayi verildi',
  kargo: 'Yolda veya teslimata cikti',
  tamam: 'Teslim veya kapanis kaydedildi',
}

export const COMM_CHANNEL_LABEL: Record<CommChannel, string> = {
  telefon: 'Telefon',
  whatsapp: 'WhatsApp',
  eposta: 'E-posta',
  yuz_yuze: 'Yuz yuze',
  diger: 'Diger',
}
