export type CheckoutSuccessState = {
  referenceCode: string
  contactWithinDays: number
  maxLeadTimeDays: number | null
  customerPhone: string
  paymentStatus: 'paid' | 'pending'
  paymentMethodLabel: string
}

/** İlk geri dönüş için hedef süre (iş günü) */
export const CONTACT_WITHIN_BUSINESS_DAYS = 2
