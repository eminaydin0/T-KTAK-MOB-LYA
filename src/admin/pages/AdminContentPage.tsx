import { useEffect, useState } from 'react'
import { useSite } from '../../core/context/SiteContext'
import type { SiteContent } from '../../core/site/types'
import { AdminPageShell } from '../components/AdminPageShell'
import { Field, inputClass } from '../components/ui/Field'

export function AdminContentPage() {
  const { data, update, activeLocale, setActiveLocale } = useSite()
  const enabled = data.languages.filter((l) => l.enabled)
  const [editLocale, setEditLocale] = useState(activeLocale)

  useEffect(() => {
    if (enabled.some((l) => l.code === activeLocale)) {
      setEditLocale(activeLocale)
    } else if (enabled[0]) {
      setEditLocale(enabled[0].code)
    }
  }, [activeLocale, enabled])

  const c: SiteContent =
    data.contentByLocale[editLocale] || data.contentByLocale.tr || data.contentByLocale[Object.keys(data.contentByLocale)[0]!]

  const set =
    <K extends keyof SiteContent>(key: K) =>
    (value: SiteContent[K]) => {
      update((d) => ({
        ...d,
        contentByLocale: {
          ...d.contentByLocale,
          [editLocale]: { ...(d.contentByLocale[editLocale] || c), [key]: value },
        },
      }))
    }

  return (
    <AdminPageShell
      title="Site metinleri"
      description="Her aktif dil icin ayri metinler. Vitrin, ustte secilen dile gosterir."
    >
      {enabled.length > 1 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {enabled.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setEditLocale(l.code)
                setActiveLocale(l.code)
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                editLocale === l.code
                  ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-200'
                  : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
              }`}
            >
              {l.name} ({l.code})
            </button>
          ))}
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-stone-900">Hero</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Hero baslik" htmlFor="hero-title" className="sm:col-span-2">
              <input
                id="hero-title"
                className={inputClass}
                value={c.heroTitle}
                onChange={(e) => set('heroTitle')(e.target.value)}
              />
            </Field>
            <Field label="Hero aciklama" htmlFor="hero-sub" className="sm:col-span-2">
              <textarea
                id="hero-sub"
                rows={3}
                className={`${inputClass} resize-y min-h-[80px]`}
                value={c.heroSubtitle}
                onChange={(e) => set('heroSubtitle')(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-stone-900">Kategori vitrini (ana sayfa)</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Baslik" htmlFor="cat-show-title">
              <input
                id="cat-show-title"
                className={inputClass}
                value={c.categorySectionTitle}
                onChange={(e) => set('categorySectionTitle')(e.target.value)}
              />
            </Field>
            <Field label="Alt metin" htmlFor="cat-show-sub" className="sm:col-span-2">
              <textarea
                id="cat-show-sub"
                rows={2}
                className={inputClass}
                value={c.categorySectionSubtitle}
                onChange={(e) => set('categorySectionSubtitle')(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-stone-900">Bolum basliklari</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Filtre bolumu basligi" htmlFor="f-title">
              <input
                id="f-title"
                className={inputClass}
                value={c.filterSectionTitle}
                onChange={(e) => set('filterSectionTitle')(e.target.value)}
              />
            </Field>
            <Field label="Katalog bolumu basligi" htmlFor="cat-title">
              <input
                id="cat-title"
                className={inputClass}
                value={c.catalogSectionTitle}
                onChange={(e) => set('catalogSectionTitle')(e.target.value)}
              />
            </Field>
            <Field label="Ornek urunler basligi" htmlFor="demo-title">
              <input
                id="demo-title"
                className={inputClass}
                value={c.demoSectionTitle}
                onChange={(e) => set('demoSectionTitle')(e.target.value)}
              />
            </Field>
            <Field label="Ornek urunler notu" htmlFor="demo-note" className="sm:col-span-2">
              <textarea
                id="demo-note"
                rows={2}
                className={inputClass}
                value={c.demoSectionNote}
                onChange={(e) => set('demoSectionNote')(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <Field label="Footer metni" htmlFor="footer" hint="Secili dil icin alt bilgi">
            <input
              id="footer"
              className={inputClass}
              value={c.footerText}
              onChange={(e) => set('footerText')(e.target.value)}
            />
          </Field>
        </div>

        <p className="text-xs text-stone-500">Degisiklikler otomatik kaydedilir.</p>
      </div>
    </AdminPageShell>
  )
}
