import { getPaymentProvider, isPaymentGatewayEnabled } from './config'
import type {
  CheckoutPayload,
  CheckoutPaymentResult,
  OrderPayment,
} from './types'

/**
 * Kart ödemesi — gateway bağlandığında burada API çağrısı yapılır.
 * Şimdilik: gateway kapalıysa pending sipariş; mock provider ile paid simülasyonu.
 */
export async function processCheckoutPayment(
  payload: CheckoutPayload
): Promise<CheckoutPaymentResult> {
  const { paymentMethod } = payload

  if (paymentMethod === 'card' && isPaymentGatewayEnabled()) {
    const provider = getPaymentProvider()
    // TODO: POST /api/checkout/session → redirectUrl veya client secret
    if (provider === 'mock') {
      await delay(600)
      return {
        ok: true,
        mode: 'completed',
        transactionId: `mock_${Date.now()}`,
        paymentStatus: 'paid',
      }
    }
    return {
      ok: false,
      error: `${provider ?? 'Ödeme'} entegrasyonu henüz tamamlanmadı. Yönetici ile iletişime geçin.`,
    }
  }

  if (paymentMethod === 'card' && !isPaymentGatewayEnabled()) {
    return {
      ok: true,
      mode: 'completed',
      transactionId: undefined,
      paymentStatus: 'pending',
    }
  }

  // Havale / kapıda: sipariş oluştur, ödeme bekleniyor
  return {
    ok: true,
    mode: 'completed',
    paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
  }
}

export function buildOrderPayment(
  payload: CheckoutPayload,
  result: Extract<CheckoutPaymentResult, { ok: true; mode: 'completed' }>
): OrderPayment {
  const currency: OrderPayment['currency'] =
    payload.subtotalTry != null && payload.paymentMethod === 'card' ? 'TRY' : 'USD'

  return {
    status: result.paymentStatus,
    method: payload.paymentMethod,
    provider: isPaymentGatewayEnabled() ? getPaymentProvider() : undefined,
    transactionId: result.transactionId,
    amountUsd: payload.subtotalUsd,
    ...(payload.subtotalTry != null ? { amountTry: payload.subtotalTry } : {}),
    currency,
    ...(result.paymentStatus === 'paid' ? { paidAt: new Date().toISOString() } : {}),
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
