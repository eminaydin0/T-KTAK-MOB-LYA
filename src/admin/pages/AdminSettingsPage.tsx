import { useSite } from '../../core/context/SiteContext'
import { AdminPageShell } from '../components/AdminPageShell'
import { Field, inputClass } from '../components/ui/Field'

export function AdminSettingsPage() {
  const { data, update } = useSite()
  const s = data.settings

  const patch = (p: Partial<typeof s>) => {
    update((d) => ({ ...d, settings: { ...d.settings, ...p } }))
  }

  return (
    <AdminPageShell
      title="Genel ayarlar"
      description="Site adi vitrin basliginda; SEO alanlari sayfa basligi ve aciklamada kullanilir."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-stone-900">Marka</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Site adi" htmlFor="site-name">
              <input
                id="site-name"
                className={inputClass}
                value={s.siteName}
                onChange={(e) => patch({ siteName: e.target.value })}
              />
            </Field>
            <Field label="Slogan" htmlFor="tag">
              <input
                id="tag"
                className={inputClass}
                value={s.siteTagline}
                onChange={(e) => patch({ siteTagline: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-stone-900">SEO</h3>
          <div className="mt-4 space-y-4">
            <Field label="Sayfa basligi (title)" htmlFor="seo-title">
              <input
                id="seo-title"
                className={inputClass}
                value={s.seoTitle}
                onChange={(e) => patch({ seoTitle: e.target.value })}
              />
            </Field>
            <Field label="Meta aciklama" htmlFor="seo-desc">
              <textarea
                id="seo-desc"
                rows={3}
                className={`${inputClass} resize-y min-h-[72px]`}
                value={s.seoDescription}
                onChange={(e) => patch({ seoDescription: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-stone-900">Iletisim</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="E-posta" htmlFor="em">
              <input
                id="em"
                type="email"
                className={inputClass}
                value={s.contactEmail}
                onChange={(e) => patch({ contactEmail: e.target.value })}
              />
            </Field>
            <Field label="Telefon" htmlFor="ph">
              <input
                id="ph"
                className={inputClass}
                value={s.contactPhone}
                onChange={(e) => patch({ contactPhone: e.target.value })}
              />
            </Field>
            <Field label="Adres" htmlFor="ad" className="sm:col-span-2">
              <textarea
                id="ad"
                rows={2}
                className={inputClass}
                value={s.contactAddress}
                onChange={(e) => patch({ contactAddress: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-stone-900">Sosyal</h3>
          <p className="mt-1 text-xs text-stone-500">Tam URL yapiskin (https://...)</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Instagram" htmlFor="ig">
              <input
                id="ig"
                className={inputClass}
                value={s.socialInstagram}
                onChange={(e) => patch({ socialInstagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="LinkedIn" htmlFor="li">
              <input
                id="li"
                className={inputClass}
                value={s.socialLinkedIn}
                onChange={(e) => patch({ socialLinkedIn: e.target.value })}
              />
            </Field>
            <Field label="WhatsApp" htmlFor="wa" hint="wa.me veya api.whatsapp.com linki">
              <input
                id="wa"
                className={inputClass}
                value={s.socialWhatsApp}
                onChange={(e) => patch({ socialWhatsApp: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <p className="text-xs text-stone-500">Degisiklikler otomatik olarak tarayicida saklanir.</p>
      </div>
    </AdminPageShell>
  )
}
