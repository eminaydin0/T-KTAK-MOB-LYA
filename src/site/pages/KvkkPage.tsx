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
    <div className="mx-auto max-w-2xl">
      <nav className="mb-8 text-sm text-stone-500">
        <Link to="/" className="font-medium text-[#333333] transition hover:text-cotta">
          Ana sayfa
        </Link>
        <span className="mx-2 text-stone-300">/</span>
        <span className="text-stone-700">KVKK</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold text-[#333333] sm:text-4xl">Kişisel veriler</h1>
      <p className="mt-3 text-lg text-stone-600">6698 sayılı KVKK kapsamında bilgilendirme</p>

      <div className="mt-8 space-y-4 leading-relaxed text-stone-700">
        <p>
          Veri sorumlusu ve işleme amaçlarına ilişkin ayrıntılı aydınlatma metni, işletmenizin hukuk birimi tarafından
          hazırlanıp bu alana yerleştirilebilir. Burada yalnızca örnek bir iskelet sunulmaktadır.
        </p>
        <p>
          Kullanıcıların kişisel verileri; açık rıza veya kanunda öngörülen diğer hukuki sebepler çerçevesinde,
          belirli, açık ve meşru amaçlarla sınırlı olarak işlenmelidir.
        </p>
        <p className="text-sm text-stone-500">
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
