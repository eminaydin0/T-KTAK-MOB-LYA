import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../core/context/SiteContext'

export function KvkkPage() {
  const { data } = useSite()
  const name = data.settings.siteName || 'Vitrin'

  useEffect(() => {
    document.title = `KVKK — ${name}`
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
        <span className="text-stone-700">KVKK</span>
      </nav>

      <h1 className="site-page-title">Kişisel veriler</h1>
      <p className="site-body mt-3 text-lg">6698 sayılı KVKK kapsamında bilgilendirme</p>

      <div className="site-body mt-8 space-y-4">
        <p>
          Veri sorumlusu ve işleme amaçlarına ilişkin ayrıntılı aydınlatma metni, işletmenizin hukuk birimi tarafından
          hazırlanıp bu alana yerleştirilebilir. Burada yalnızca örnek bir iskelet sunulmaktadır.
        </p>
        <p>
          Kullanıcıların kişisel verileri; açık rıza veya kanunda öngörülen diğer hukuki sebepler çerçevesinde,
          belirli, açık ve meşru amaçlarla sınırlı olarak işlenmelidir.
        </p>
        <p className="site-caption">
          Başvuru için{' '}
          <Link to="/iletisim" className="font-medium text-cotta-dark underline-offset-2 hover:underline">
            İletişim
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
