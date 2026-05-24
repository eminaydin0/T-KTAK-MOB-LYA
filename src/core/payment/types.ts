/** Ödeme sağlayıcı — gateway bağlantısında kullanılır */
export type PaymentProvider = 'iyzico' | 'stripe' | 'mock'

/** Müşterinin seçtiği ödeme yöntemi */
export type PaymentMethodId = 'card' | 'bank_transfer' | 'cash_on_delivery'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export type OrderPayment = {
  status: PaymentStatus
  method: PaymentMethodId
  provider?: PaymentProvider
  transactionId?: string
  amountUsd: number
  amountTry?: number
  /** Ödeme anındaki para birimi */
  currency: 'USD' | 'TRY'
  paidAt?: string
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethodId, string> = {
  card: 'Kredi / banka kartı',
  bank_transfer: 'Havale / EFT',
  cash_on_delivery: 'Kapıda ödeme',
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: 'Ödeme bekleniyor',
  processing: 'İşleniyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
  cancelled: 'İptal',
  refunded: 'İade edildi',
}

export type CheckoutCustomer = {
  customerName: string
  phone: string
  email?: string
  shippingAddress?: string
  note?: string
}

export type CheckoutLine = {
  productId: number
  productName: string
  qty: number
  priceUsd: number
}

export type CheckoutPayload = {
  customer: CheckoutCustomer
  lines: CheckoutLine[]
  subtotalUsd: number
  subtotalTry: number | null
  paymentMethod: PaymentMethodId
}

export type CheckoutPaymentResult =
  | { ok: true; mode: 'gateway'; redirectUrl: string }
  | { ok: true; mode: 'completed'; transactionId?: string; paymentStatus: PaymentStatus }
  | { ok: false; error: string }
