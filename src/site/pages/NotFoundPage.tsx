import { Link } from 'react-router-dom'
import { useSite } from '../../core/context/SiteContext'
import { SiteSeo } from '../seo/SiteSeo'
import { catalogAnchor, homePath } from '../sitePaths'

export function NotFoundPage() {
  const { data } = useSite()
  const siteName = data.settings.siteName || 'EMIN Mobilya'

  return (
    <>
      <SiteSeo
        title={`Sayfa bulunamadı | ${siteName}`}
        description="Aradığınız sayfa kaldırılmış veya adres yanlış olabilir."
        noindex
      />
      <div className="site-enter mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-6xl font-light tabular-nums text-stone-300">404</p>
        <h1 className="site-page-title mt-4">Sayfa bulunamadı</h1>
        <p className="site-body mt-3">
          Aradığınız adres mevcut değil veya taşınmış olabilir.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to={homePath()} className="site-btn-accent px-6">
            Ana sayfa
          </Link>
          <Link to={catalogAnchor()} className="site-btn-ghost px-6">
            Katalog
          </Link>
        </div>
      </div>
    </>
  )
}
