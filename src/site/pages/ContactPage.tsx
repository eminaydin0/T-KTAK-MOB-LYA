import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/motion'
import { saveLead } from '../../core/leads/storage'
import type { ContactLead } from '../../core/leads/types'
import { useSite } from '../../core/context/SiteContext'
import { SocialLinks } from '../components/SocialLinks'
import { SiteSeo } from '../seo/SiteSeo'
import { truncateMeta } from '../seo/seoHelpers'
import { homePath } from '../sitePaths'

type Topic = ContactLead['topic']

const TOPIC_LABEL: Record<Topic, string> = {
  quote: 'Teklif / fiyat talebi',
  appointment: 'Randevu / showroom ziyareti',
  general: 'Genel soru',
}

export function ContactPage() {
  const { data } = useSite()
  const s = data.settings
  const name = s.siteName || 'Vitrin'

  const [formName, setFormName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState<Topic>('quote')
  const [message, setMessage] = useState('')
  const [kvkk, setKvkk] = useState(false)
  const [attachmentName, setAttachmentName] = useState<string | undefined>()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const seoDescription = truncateMeta(
    `${name} ile iletişime geçin — teklif, randevu veya genel sorularınız için formu doldurun.`
  )

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setAttachmentName(undefined)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ek dosya en fazla 5 MB olabilir.')
      e.target.value = ''
      return
    }
    setAttachmentName(file.name)
    setError(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!formName.trim() || !email.trim() || !message.trim()) {
      setError('Ad, e-posta ve mesaj alanları zorunludur.')
      return
    }
    if (!kvkk) {
      setError('Devam etmek için KVKK metnini okuduğunuzu onaylamanız gerekir.')
      return
    }
    const lead: ContactLead = {
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: formName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      topic,
      message: attachmentName
        ? `${message.trim()}\n\n[Ek dosya: ${attachmentName}]`
        : message.trim(),
      kvkkAccepted: true,
    }
    saveLead(lead)
    setSubmitted(true)
    setFormName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setTopic('quote')
    setKvkk(false)
    setAttachmentName(undefined)
  }

  return (
    <>
      <SiteSeo title={`İletişim | ${name}`} description={seoDescription} path="/iletisim" />

      <Reveal className="mx-auto max-w-2xl">
        <nav className="site-breadcrumb mb-8">
          <Link to={homePath()} className="site-link">
            Ana sayfa
          </Link>
          <span className="text-stone-300" aria-hidden>
            /
          </span>
          <span className="text-stone-700">İletişim</span>
        </nav>

        <h1 className="site-page-title">İletişim</h1>
        <p className="site-body mt-3">
          Teklif, randevu veya ölçü talepleriniz için formu doldurun; en kısa sürede dönüş yapılır.
        </p>

        {submitted ? (
          <div className="site-card mt-10 border border-emerald-200 bg-emerald-50/60 p-6" role="status">
            <p className="font-medium text-emerald-900">Talebiniz alındı</p>
            <p className="site-body mt-2 text-emerald-900/90">
              Mesajınız kaydedildi. Ekibimiz en kısa sürede sizinle iletişime geçecek.
            </p>
            <button type="button" className="site-btn-ghost mt-4" onClick={() => setSubmitted(false)}>
              Yeni mesaj gönder
            </button>
          </div>
        ) : (
          <form className="site-card mt-10 space-y-5 p-6 sm:p-8" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="site-meta">Ad soyad *</span>
                <input
                  className="site-input mt-1"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="site-meta">E-posta *</span>
                <input
                  type="email"
                  className="site-input mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <span className="site-meta">Telefon</span>
                <input
                  type="tel"
                  className="site-input mt-1"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="+90 …"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="site-meta">Konu</span>
                <select
                  className="site-input mt-1"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as Topic)}
                >
                  {(Object.keys(TOPIC_LABEL) as Topic[]).map((key) => (
                    <option key={key} value={key}>
                      {TOPIC_LABEL[key]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="site-meta">Mesajınız *</span>
                <textarea
                  className="site-input mt-1 min-h-[120px] resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Ürün, ölçü, teslimat bölgesi veya randevu tercihiniz…"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="site-meta">Ek dosya (isteğe bağlı, max 5 MB)</span>
                <input
                  type="file"
                  className="mt-2 block w-full text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-surface-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                  accept="image/*,.pdf,.dwg,.dxf"
                  onChange={handleFile}
                />
                {attachmentName ? (
                  <p className="site-caption mt-1">Seçilen: {attachmentName}</p>
                ) : null}
              </label>
            </div>

            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                className="mt-1"
                checked={kvkk}
                onChange={(e) => setKvkk(e.target.checked)}
                required
              />
              <span>
                <Link to="/kvkk" className="site-link" target="_blank" rel="noopener noreferrer">
                  KVKK aydınlatma metnini
                </Link>{' '}
                okudum; iletişim talebimin işlenmesini kabul ediyorum. *
              </span>
            </label>

            {error ? (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="site-btn-accent w-full sm:w-auto px-8">
              Gönder
            </button>
          </form>
        )}

        <section className="mt-12 border-t border-line pt-10" aria-labelledby="contact-direct">
          <h2 id="contact-direct" className="site-section-title text-xl">
            Doğrudan iletişim
          </h2>
          <ul className="mt-6 space-y-4 text-stone-800">
            {s.contactEmail ? (
              <li>
                <span className="site-meta">E-posta</span>
                <a
                  className="mt-1 block text-lg font-medium text-cotta-dark transition duration-site ease-site hover:underline"
                  href={`mailto:${s.contactEmail}`}
                >
                  {s.contactEmail}
                </a>
              </li>
            ) : null}
            {s.contactPhone ? (
              <li>
                <span className="site-meta">Telefon</span>
                <a
                  className="site-link mt-1 block text-lg"
                  href={`tel:${s.contactPhone.replace(/\s/g, '')}`}
                >
                  {s.contactPhone}
                </a>
              </li>
            ) : null}
            {s.contactAddress ? (
              <li>
                <span className="site-meta">Adres</span>
                <p className="site-body mt-1">{s.contactAddress}</p>
              </li>
            ) : null}
          </ul>

          {!s.contactEmail && !s.contactPhone && !s.contactAddress ? (
            <p className="site-empty mt-6 py-4 text-left">
              İletişim bilgileri henüz eklenmemiş. Yönetim panelinden site ayarlarına kaydedebilirsiniz.
            </p>
          ) : null}

          <div className="mt-8">
            <p className="site-meta">Sosyal</p>
            <SocialLinks instagram={s.socialInstagram} whatsapp={s.socialWhatsApp} className="mt-3" />
          </div>
        </section>
      </Reveal>
    </>
  )
}
