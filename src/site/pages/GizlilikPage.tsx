import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../core/context/SiteContext'

export function GizlilikPage() {
  const { data } = useSite()
  const name = data.settings.siteName || 'Vitrin'

  useEffect(() => {
    document.title = `Gizlilik — ${name}`
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
        <span className="text-stone-700">Gizlilik</span>
      </nav>

      <h1 className="site-page-title">Gizlilik</h1>
      <div className="site-body mt-8 space-y-4">
        <p>
          Bu sayfa, web sitemizi kullanırken paylaştığınız bilgilerin nasıl işlendiğine dair genel bir çerçeve sunar.
          Kesin metin ve hukuki detaylar için kurumsal politikanızı buraya ekleyebilirsiniz.
        </p>
        <p>
          İletişim formları veya sipariş süreçlerinde toplanan veriler, yalnızca talebinizi karşılamak ve yasal
          yükümlülükleri yerine getirmek amacıyla kullanılmalıdır.
        </p>
        <p className="site-caption">Son güncelleme: site yöneticisi tarafından düzenlenir.</p>
      </div>
    </div>
  )
}
