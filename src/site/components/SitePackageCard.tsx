import { Link } from 'react-router-dom'
import type { CatalogPackage } from '../../core/catalog/types'
import { PACKAGE_KIND_LABEL } from '../../core/catalog/types'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { packagePath } from '../sitePaths'

type Props = {
  pkg: CatalogPackage
  partsCount: number
  partsTotalUsd: string
  bundlePriceUsd: string
  bundleTry?: string
  savingsLabel?: string
}

export function SitePackageCard({
  pkg,
  partsCount,
  partsTotalUsd,
  bundlePriceUsd,
  bundleTry,
  savingsLabel,
}: Props) {
  return (
    <article className="shop-package-card">
      <Link to={packagePath(pkg.slug)} className="shop-package-card-media block">
        {pkg.imageUrl?.trim() ? (
          <ImageThumb
            src={pkg.imageUrl}
            alt=""
            className="site-img-zoom h-full w-full object-cover"
            emptyClassName="flex h-full w-full items-center justify-center bg-stone-200"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-stone-400">
            {pkg.name.slice(0, 1)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/55 via-stone-900/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cotta shadow-soft">
          {PACKAGE_KIND_LABEL[pkg.kind]}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-white sm:text-xl">{pkg.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/85">{pkg.tagline}</p>
        </div>
      </Link>

      <div className="shop-package-card-body">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="site-tag">{partsCount} parça</span>
          <span className="site-tag">Parça parça satılır</span>
          {savingsLabel ? <span className="site-tag bg-cotta/10 text-cotta">{savingsLabel}</span> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="site-caption">Tam set</p>
            <p className="shop-card-price text-lg">{bundlePriceUsd}</p>
            {bundleTry ? <p className="site-caption">{bundleTry}</p> : null}
            <p className="site-caption mt-1 line-through opacity-60">{partsTotalUsd} parça toplamı</p>
          </div>
          <Link to={packagePath(pkg.slug)} className="site-btn-accent px-5 py-2.5 text-sm">
            Paketi incele
          </Link>
        </div>
      </div>
    </article>
  )
}
