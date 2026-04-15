import { useSite } from '../../core/context/SiteContext'
import { uid } from '../../core/site/storage'
import type { CarouselSlide } from '../../core/site/types'
import { AdminPageShell } from '../components/AdminPageShell'
import { Button } from '../components/ui/Button'
import { Field, inputClass } from '../components/ui/Field'

function sortSlides(list: CarouselSlide[]) {
  return [...list].sort((a, b) => a.order - b.order).map((s, i) => ({ ...s, order: i }))
}

export function AdminCarouselPage() {
  const { data, update } = useSite()
  const slides = sortSlides(data.carousel)

  const patchSlide = (id: string, patch: Partial<CarouselSlide>) => {
    update((d) => ({
      ...d,
      carousel: d.carousel.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  const remove = (id: string) => {
    update((d) => ({
      ...d,
      carousel: sortSlides(d.carousel.filter((s) => s.id !== id)),
    }))
  }

  const move = (id: string, dir: -1 | 1) => {
    update((d) => {
      const sorted = sortSlides(d.carousel)
      const idx = sorted.findIndex((s) => s.id === id)
      if (idx < 0) return d
      const j = idx + dir
      if (j < 0 || j >= sorted.length) return d
      const a = sorted[idx]!
      const b = sorted[j]!
      sorted[idx] = { ...b, order: idx }
      sorted[j] = { ...a, order: j }
      return { ...d, carousel: sortSlides(sorted) }
    })
  }

  const add = () => {
    update((d) => ({
      ...d,
      carousel: sortSlides([
        ...d.carousel,
        {
          id: uid(),
          imageUrl: '',
          title: 'Yeni slayt',
          subtitle: '',
          linkUrl: '',
          order: d.carousel.length,
        },
      ]),
    }))
  }

  return (
    <AdminPageShell
      title="Ana sayfa carousel"
      description="Slaytlar vitrin ana sayfasinin ustinde gorunur. Bos birakilan gorsel adresi yer tutucu gosterir."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          {slides.length} slayt · sirayi oklarla degistirin
        </p>
        <Button type="button" onClick={add}>
          + Slayt ekle
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="lg:w-48">
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-stone-100 bg-stone-100">
                  {s.imageUrl.trim() ? (
                    <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full min-h-[100px] items-center justify-center text-xs text-stone-400">
                      Gorsel URL
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <Field label="Gorsel URL" htmlFor={`img-${s.id}`}>
                  <input
                    id={`img-${s.id}`}
                    className={inputClass}
                    value={s.imageUrl}
                    onChange={(e) => patchSlide(s.id, { imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Baslik" htmlFor={`t-${s.id}`}>
                    <input
                      id={`t-${s.id}`}
                      className={inputClass}
                      value={s.title}
                      onChange={(e) => patchSlide(s.id, { title: e.target.value })}
                    />
                  </Field>
                  <Field label="Alt baslik" htmlFor={`st-${s.id}`}>
                    <input
                      id={`st-${s.id}`}
                      className={inputClass}
                      value={s.subtitle}
                      onChange={(e) => patchSlide(s.id, { subtitle: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Baglanti (istege bagli)" htmlFor={`l-${s.id}`} hint="Orn: / veya https://...">
                  <input
                    id={`l-${s.id}`}
                    className={inputClass}
                    value={s.linkUrl}
                    onChange={(e) => patchSlide(s.id, { linkUrl: e.target.value })}
                    placeholder="Bos birakilabilir"
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" disabled={idx === 0} onClick={() => move(s.id, -1)}>
                    Yukari
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={idx === slides.length - 1}
                    onClick={() => move(s.id, 1)}
                  >
                    Asagi
                  </Button>
                  <Button type="button" variant="danger" onClick={() => remove(s.id)}>
                    Sil
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPageShell>
  )
}
