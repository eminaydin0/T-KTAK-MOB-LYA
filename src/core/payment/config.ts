import type { PaymentProvider } from './types'

function readProvider(): PaymentProvider | undefined {
  const raw = import.meta.env.VITE_PAYMENT_PROVIDER?.trim().toLowerCase()
  if (raw === 'iyzico' || raw === 'stripe' || raw === 'mock') return raw
  return undefined
}

/** Gateway aktif mi — VITE_PAYMENT_ENABLED=true ve provider tanımlı */
export function isPaymentGatewayEnabled(): boolean {
  return import.meta.env.VITE_PAYMENT_ENABLED === 'true' && readProvider() !== undefined
}

export function getPaymentProvider(): PaymentProvider | undefined {
  return readProvider()
}

/** Kart formu mount noktası (Stripe Elements / Iyzico iframe) */
export const PAYMENT_ELEMENT_ID = 'payment-element'
