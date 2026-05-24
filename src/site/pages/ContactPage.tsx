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
    <div className="site-enter mx-auto max-w-2xl">
      <nav className="site-breadcrumb mb-8">
        <Link to="/" className="site-link">
          Ana sayfa
        </Link>
        <span className="text-stone-300" aria-hidden>
          /
        </span>
        <span className="text-stone-700">İletişim</span>
      </nav>

      <h1 className="site-page-title">İletişim</h1>
      <p className="site-body mt-3">Sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.</p>

      <ul className="mt-10 space-y-4 text-stone-800">
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
        <p className="site-empty mt-8 py-6 text-left">
          İletişim bilgileri henüz eklenmemiş. Yönetim panelinden site ayarlarına kaydedebilirsiniz.
        </p>
      ) : null}

      <div className="mt-10 border-t border-line pt-8">
        <p className="site-meta">Sosyal</p>
        <SocialLinks instagram={s.socialInstagram} whatsapp={s.socialWhatsApp} className="mt-3" />
      </div>
    </div>
  )
}
