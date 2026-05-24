import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { buildOrderPayment, processCheckoutPayment } from '../../core/payment/checkout'
import { PAYMENT_METHOD_LABEL, type PaymentMethodId } from '../../core/payment/types'
import { useCart } from '../../core/context/CartContext'
import { useCatalog } from '../../core/context/CatalogContext'
import { useOrders } from '../../core/context/OrdersContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { CheckoutStepper } from '../components/checkout/CheckoutStepper'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { PaymentSection } from '../components/checkout/PaymentSection'
import { CONTACT_WITHIN_BUSINESS_DAYS } from '../checkout/types'
import { cartPath } from '../sitePaths'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalItems, subtotalUsd, clear } = useCart()
  const { products } = useCatalog()
  const { addOrder } = useOrders()
  const usdToTry = useExchangeRate()

  const subtotalTry = useMemo(() => {
    if (usdToTry == null || !Number.isFinite(usdToTry) || usdToTry <= 0) return null
    return Math.round(subtotalUsd * usdToTry)
  }, [subtotalUsd, usdToTry])

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [note, setNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Ödeme'
  }, [])

  if (items.length === 0) {
    return <Navigate to={cartPath()} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const name = customerName.trim()
    const tel = phone.trim()
    if (!name || !tel) {
      setError('Ad soyad ve telefon zorunludur.')
      return
    }

    const payload = {
      customer: {
        customerName: name,
        phone: tel,
        email: email.trim() || undefined,
        shippingAddress: shippingAddress.trim() || undefined,
        note: note.trim() || undefined,
      },
      lines: items.map((l) => ({
        productId: l.productId,
        productName: l.productName,
        qty: l.qty,
        priceUsd: l.priceUsd,
      })),
      subtotalUsd,
      subtotalTry,
      paymentMethod,
    }

    setSubmitting(true)
    try {
      const paymentResult = await processCheckoutPayment(payload)

      if (!paymentResult.ok) {
        setError(paymentResult.error)
        return
      }

      if (paymentResult.mode === 'gateway') {
        window.location.href = paymentResult.redirectUrl
        return
      }

      const payment = buildOrderPayment(payload, paymentResult)

      const order = addOrder({
        customerName: name,
        phone: tel,
        email: payload.customer.email,
        shippingAddress: payload.customer.shippingAddress,
        note: payload.customer.note,
        lines: payload.lines.map((l) => ({
          productId: l.productId,
          productName: l.productName,
          qty: l.qty,
        })),
        payment,
      })

      if (!order) {
        setError('Sipariş oluşturulamadı. Lütfen tekrar deneyin.')
        return
      }

      const leadTimes = items
        .map((l) => products.find((p) => p.id === l.productId)?.leadTimeDays)
        .filter((d): d is number => d != null && d > 0)
      const maxLeadTimeDays = leadTimes.length > 0 ? Math.max(...leadTimes) : null

      clear()
      navigate('/odeme/basarili', {
        replace: true,
        state: {
          referenceCode: order.referenceCode,
          contactWithinDays: CONTACT_WITHIN_BUSINESS_DAYS,
          maxLeadTimeDays,
          customerPhone: tel,
          paymentStatus: payment.status === 'paid' ? 'paid' : 'pending',
          paymentMethodLabel: PAYMENT_METHOD_LABEL[paymentMethod],
        },
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="site-enter pb-12">
      <nav className="site-breadcrumb mb-8" aria-label="Sayfa yolu">
        <Link to="/" className="site-link">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <Link to={cartPath()} className="site-link">
          Sepet
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <span className="font-medium text-ink">Ödeme</span>
      </nav>

      <CheckoutStepper current="payment" />

      <h1 className="site-page-title">Ödeme</h1>
      <p className="site-body mt-2 max-w-prose">
        İletişim ve teslimat bilgilerinizi girin, ödeme yöntemini seçin ve siparişi tamamlayın.
      </p>

      <form
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12"
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <section className="site-card p-5 sm:p-6" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="site-card-title">
              İletişim bilgileri
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="site-caption">Ad soyad *</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="site-input mt-1 w-full"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="block">
                <span className="site-caption">Telefon *</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="site-input mt-1 w-full"
                  autoComplete="tel"
                  required
                />
              </label>
              <label className="block">
                <span className="site-caption">E-posta</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="site-input mt-1 w-full"
                  autoComplete="email"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="site-caption">Teslimat adresi</span>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="site-input mt-1 min-h-[80px] w-full resize-y"
                  rows={2}
                  autoComplete="street-address"
                  placeholder="Mahalle, sokak, bina no, ilçe / il"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="site-caption">Sipariş notu</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="site-input mt-1 min-h-[72px] w-full resize-y"
                  rows={2}
                  placeholder="Teslimat saati, kapı kodu vb."
                />
              </label>
            </div>
          </section>

          <PaymentSection
            method={paymentMethod}
            onMethodChange={setPaymentMethod}
            disabled={submitting}
          />
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="site-card p-5 sm:p-6">
            <h2 className="site-card-title">Sipariş özeti</h2>
            <OrderSummary totalItems={totalItems} subtotalUsd={subtotalUsd} usdToTry={usdToTry} />

            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto border-t border-line pt-4 text-sm">
              {items.map((line) => (
                <li key={line.productId} className="flex justify-between gap-3 text-stone-600">
                  <span className="min-w-0 truncate">
                    {line.productName} × {line.qty}
                  </span>
                </li>
              ))}
            </ul>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              className="site-btn-accent mt-6 w-full py-3 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'İşleniyor…' : 'Siparişi tamamla ve öde'}
            </button>
            <Link to={cartPath()} className="site-btn-ghost mt-3 block w-full py-2.5 text-center">
              Sepete dön
            </Link>
          </div>
        </aside>
      </form>
    </div>
  )
}
