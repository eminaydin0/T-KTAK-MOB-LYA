import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useSite } from '../../core/context/SiteContext'
import { CheckoutStepper } from '../components/checkout/CheckoutStepper'
import type { CheckoutSuccessState } from '../checkout/types'
import { cartPath } from '../sitePaths'

export function CheckoutSuccessPage() {
  const location = useLocation()
  const { data: site } = useSite()
  const contactPhone = site.settings.contactPhone?.trim()
  const info = location.state as CheckoutSuccessState | null

  useEffect(() => {
    document.title = 'Sipariş onayı'
  }, [])

  if (!info?.referenceCode) {
    return <Navigate to={cartPath()} replace />
  }

  const {
    referenceCode,
    contactWithinDays,
    maxLeadTimeDays,
    customerPhone: submittedPhone,
    paymentStatus,
    paymentMethodLabel,
  } = info

  const paid = paymentStatus === 'paid'

  return (
    <div className="site-enter mx-auto max-w-lg pb-12">
      <CheckoutStepper current="success" />

      <div className="site-empty bg-white text-center shadow-soft">
        <p className="site-overline text-cotta">{paid ? 'Ödeme alındı' : 'Sipariş alındı'}</p>
        <p className="site-card-title mt-2 text-lg">
          {paid ? 'Ödemeniz başarıyla tamamlandı' : 'Siparişiniz oluşturuldu'}
        </p>
        <p className="site-body mt-2 font-mono text-sm text-stone-600">{referenceCode}</p>
        <p className="site-body mt-3">
          Teşekkür ederiz. Siparişiniz kaydedildi
          {paid ? ' ve ödemeniz onaylandı' : ''}.
        </p>

        <div className="site-panel mt-6 text-left text-sm leading-relaxed text-stone-600">
          <p className="font-medium text-ink">Ödeme</p>
          <p className="mt-2">
            Yöntem: <strong className="text-ink">{paymentMethodLabel}</strong>
            {' · '}
            Durum:{' '}
            <strong className="text-ink">{paid ? 'Ödendi' : 'Ödeme bekleniyor'}</strong>
          </p>

          <p className="mt-4 font-medium text-ink">Sonraki adımlar</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {paid ? (
              <li>
                Siparişiniz üretim / sevkiyat sürecine alınacaktır. Durum güncellemeleri{' '}
                <strong className="font-semibold text-ink">{submittedPhone}</strong> numarasından
                paylaşılır.
              </li>
            ) : (
              <li>
                Satış ekibimiz{' '}
                <strong className="font-semibold text-ink">{contactWithinDays} iş günü</strong> içinde{' '}
                <strong className="font-semibold text-ink">{submittedPhone}</strong> numarasından
                sizinle iletişime geçecek; ödeme talimatları bu görüşmede netleştirilir.
              </li>
            )}
            {maxLeadTimeDays != null ? (
              <li>
                Tahmini termin süresi yaklaşık{' '}
                <strong className="font-semibold text-ink">{maxLeadTimeDays} gün</strong> olabilir.
              </li>
            ) : (
              <li>Teslimat tarihi ve kargo detayları onay sonrası bildirilir.</li>
            )}
          </ul>

          {contactPhone ? (
            <p className="mt-4 border-t border-line pt-4 text-stone-500">
              Sorularınız için:{' '}
              <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="font-medium text-cotta">
                {contactPhone}
              </a>
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="site-btn-accent px-6 py-3">
            Ana sayfa
          </Link>
          <Link to="/#catalog" className="site-btn-ghost px-6 py-3">
            Kataloga dön
          </Link>
        </div>
      </div>
    </div>
  )
}
