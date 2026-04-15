import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../core/context/SiteContext'
import { SocialLinks } from '../components/SocialLinks'

export function ContactPage() {
  const { data } = useSite()
  const s = data.settings
  const name = s.siteName || 'Vitrin'

  useEffect(() => {
    document.title = `İletişim — ${name}`
    return () => {
      document.title = name
    }
  }, [name])

  return (
    <div className="mx-auto max-w-2xl">
      <nav className="mb-8 text-sm text-stone-500">
        <Link to="/" className="font-medium text-[#333333] transition hover:text-cotta">
          Ana sayfa
        </Link>
        <span className="mx-2 text-stone-300">/</span>
        <span className="text-stone-700">İletişim</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#333333] sm:text-4xl">İletişim</h1>
      <p className="mt-3 text-stone-600">Sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.</p>

      <ul className="mt-10 space-y-4 text-stone-800">
        {s.contactEmail ? (
          <li>
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">E-posta</span>
            <a className="mt-1 block text-lg font-medium text-cotta-dark hover:underline" href={`mailto:${s.contactEmail}`}>
              {s.contactEmail}
            </a>
          </li>
        ) : null}
        {s.contactPhone ? (
          <li>
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Telefon</span>
            <a className="mt-1 block text-lg font-medium text-[#333333] hover:text-cotta" href={`tel:${s.contactPhone.replace(/\s/g, '')}`}>
              {s.contactPhone}
            </a>
          </li>
        ) : null}
        {s.contactAddress ? (
          <li>
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Adres</span>
            <p className="mt-1 leading-relaxed text-stone-700">{s.contactAddress}</p>
          </li>
        ) : null}
      </ul>

      {!s.contactEmail && !s.contactPhone && !s.contactAddress ? (
        <p className="mt-8 border border-dashed border-stone-300 bg-surface-muted px-4 py-6 text-sm text-stone-600">
          İletişim bilgileri henüz eklenmemiş. Yönetim panelinden site ayarlarına kaydedebilirsiniz.
        </p>
      ) : null}

      <div className="mt-10 border-t border-stone-200 pt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Sosyal</p>
        <SocialLinks instagram={s.socialInstagram} whatsapp={s.socialWhatsApp} className="mt-3" />
      </div>
    </div>
  )
}
