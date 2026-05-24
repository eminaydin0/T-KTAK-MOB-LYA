import { PAYMENT_ELEMENT_ID, isPaymentGatewayEnabled } from '../../../core/payment/config'
import { PAYMENT_METHOD_LABEL, type PaymentMethodId } from '../../../core/payment/types'

type Props = {
  method: PaymentMethodId
  onMethodChange: (method: PaymentMethodId) => void
  disabled?: boolean
}

const METHODS: PaymentMethodId[] = ['card', 'bank_transfer', 'cash_on_delivery']

export function PaymentSection({ method, onMethodChange, disabled }: Props) {
  const gatewayOn = isPaymentGatewayEnabled()

  return (
    <section className="site-card p-5 sm:p-6" aria-labelledby="payment-heading">
      <h2 id="payment-heading" className="site-card-title">
        Ödeme yöntemi
      </h2>
      <p className="site-body mt-2 text-sm">
        Tercih ettiğiniz yöntemi seçin. Kart ödemesi için güvenli ödeme altyapısı bağlanacaktır.
      </p>

      <fieldset className="mt-5 space-y-3" disabled={disabled}>
        <legend className="sr-only">Ödeme yöntemi seçimi</legend>
        {METHODS.map((id) => (
          <label
            key={id}
            className={`flex cursor-pointer gap-3 border p-4 transition ${
              method === id ? 'border-cotta bg-cotta/5' : 'border-line hover:border-stone-300'
            } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={id}
              checked={method === id}
              onChange={() => onMethodChange(id)}
              className="mt-1 shrink-0 accent-ink"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">{PAYMENT_METHOD_LABEL[id]}</span>
              {id === 'card' ? (
                <span className="site-caption mt-0.5 block">
                  {gatewayOn
                    ? 'Visa, Mastercard, Troy — 3D Secure'
                    : 'Kart altyapısı yakında aktif; şimdilik siparişiniz ödeme bekliyor olarak kaydedilir.'}
                </span>
              ) : null}
              {id === 'bank_transfer' ? (
                <span className="site-caption mt-0.5 block">
                  Sipariş onayından sonra IBAN bilgisi paylaşılır.
                </span>
              ) : null}
              {id === 'cash_on_delivery' ? (
                <span className="site-caption mt-0.5 block">Teslimat sırasında nakit veya POS.</span>
              ) : null}
            </span>
          </label>
        ))}
      </fieldset>

      {method === 'card' ? (
        <div className="mt-6">
          <p className="site-caption mb-3">Kart bilgileri</p>
          <div
            id={PAYMENT_ELEMENT_ID}
            className="min-h-[120px] rounded border border-dashed border-line bg-surface-muted px-4 py-6"
            data-payment-ready={gatewayOn ? 'true' : 'false'}
          >
            {gatewayOn ? (
              <p className="text-center text-sm text-stone-500">
                Ödeme formu buraya yüklenecek (
                <code className="text-xs">{import.meta.env.VITE_PAYMENT_PROVIDER}</code>
                ).
              </p>
            ) : (
              <p className="text-center text-sm text-stone-500">
                <span className="font-medium text-ink">Ödeme entegrasyonu hazırlanıyor.</span>
                <br />
                Siparişiniz oluşturulur; ödeme onayı sonrası işleme alınır.
              </p>
            )}
          </div>
          <p className="site-caption mt-3 flex items-center gap-2 text-stone-400">
            <span aria-hidden>🔒</span>
            SSL ile şifrelenmiş bağlantı (entegrasyon sonrası)
          </p>
        </div>
      ) : null}
    </section>
  )
}
