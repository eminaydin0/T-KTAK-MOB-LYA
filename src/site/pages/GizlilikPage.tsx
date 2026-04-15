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
    <div className="mx-auto max-w-2xl">
      <nav className="mb-8 text-sm text-stone-500">
        <Link to="/" className="font-medium text-[#333333] transition hover:text-cotta">
          Ana sayfa
        </Link>
        <span className="mx-2 text-stone-300">/</span>
        <span className="text-stone-700">Gizlilik</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold text-[#333333] sm:text-4xl">Gizlilik</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-stone-700">
        <p>
          Bu sayfa, web sitemizi kullanırken paylaştığınız bilgilerin nasıl işlendiğine dair genel bir çerçeve sunar.
          Kesin metin ve hukuki detaylar için kurumsal politikanızı buraya ekleyebilirsiniz.
        </p>
        <p>
          İletişim formları veya sipariş süreçlerinde toplanan veriler, yalnızca talebinizi karşılamak ve yasal
          yükümlülükleri yerine getirmek amacıyla kullanılmalıdır.
        </p>
        <p className="text-sm text-stone-500">Son güncelleme: site yöneticisi tarafından düzenlenir.</p>
      </div>
    </div>
  )
}
