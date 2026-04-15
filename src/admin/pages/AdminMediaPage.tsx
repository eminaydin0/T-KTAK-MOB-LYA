import { useSite } from '../../core/context/SiteContext'
import { uid } from '../../core/site/storage'
import { AdminPageShell } from '../components/AdminPageShell'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Field, inputClass } from '../components/ui/Field'
import { type FormEvent, useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 12

export function AdminMediaPage() {
  const { data, update } = useSite()
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data.media
    return data.media.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.url.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    )
  }, [data.media, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount - 1)

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)))
  }, [pageCount])

  const pageItems = useMemo(() => {
    const start = pageSafe * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, pageSafe])

  const add = (e: FormEvent) => {
    e.preventDefault()
    const u = url.trim()
    if (!u) return
    update((d) => ({
      ...d,
      media: [
        { id: uid(), url: u, label: label.trim() || u.slice(0, 40), createdAt: Date.now() },
        ...d.media,
      ],
    }))
    setUrl('')
    setLabel('')
  }

  const remove = (id: string) => {
    if (!window.confirm('Bu kaydi silmek istiyor musunuz?')) return
    update((d) => ({ ...d, media: d.media.filter((m) => m.id !== id) }))
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      window.alert('Panoya kopyalandi.')
    } catch {
      window.prompt('Kopyalayin:', text)
    }
  }

  const total = data.media.length
  const emptyLibrary = total === 0
  const noMatches = !emptyLibrary && filtered.length === 0

  return (
    <AdminPageShell
      title="Medya kutuphanesi"
      description="Gorsel URL adreslerini listeleyin; urun ve carousel formlarina yapistirmak icin kopyalayin."
    >
      <form onSubmit={add} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gorsel URL" htmlFor="m-url" className="sm:col-span-2">
            <input
              id="m-url"
              className={inputClass}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... veya data:image/..."
            />
          </Field>
          <Field label="Etiket (istege bagli)" htmlFor="m-lab">
            <input
              id="m-lab"
              className={inputClass}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Field>
        </div>
        <Button type="submit" className="mt-4">
          Listeye ekle
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Field label="Ara (etiket veya URL)" htmlFor="m-search" className="min-w-0 flex-1 sm:max-w-md">
          <input
            id="m-search"
            className={inputClass}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Ornek: unsplash, logo..."
          />
        </Field>
        <p className="text-xs text-stone-500">
          {emptyLibrary
            ? 'Henuz medya yok.'
            : `${filtered.length} / ${total} kayit · Sayfa ${pageSafe + 1} / ${pageCount}`}
        </p>
      </div>

      {emptyLibrary ? (
        <div className="mt-8">
          <EmptyState
            title="Medya kutuphanesi bos"
            description="Yukaridan URL ekleyerek baslayin. Buyuk listelerde arama ve sayfalama ile gezinebilirsiniz."
          />
        </div>
      ) : noMatches ? (
        <div className="mt-8">
          <EmptyState
            title="Eslesen kayit yok"
            description="Farkli bir arama terimi deneyin veya filtreyi temizleyin."
            action={
              <Button type="button" variant="ghost" onClick={() => setQuery('')}>
                Aramayi temizle
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Onizleme</th>
                  <th className="px-4 py-3 font-medium">Etiket</th>
                  <th className="px-4 py-3 font-medium">URL</th>
                  <th className="w-36 px-4 py-3 text-right font-medium">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pageItems.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2">
                      <div className="h-14 w-20 overflow-hidden rounded-lg border border-stone-100 bg-stone-100">
                        <img
                          src={m.url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-2 font-medium text-stone-900">{m.label}</td>
                    <td className="max-w-xs truncate px-4 py-2 font-mono text-xs text-stone-600">{m.url}</td>
                    <td className="px-4 py-2 text-right">
                      <Button type="button" variant="ghost" className="!mr-1 !py-1 !text-xs" onClick={() => copy(m.url)}>
                        Kopyala
                      </Button>
                      <Button type="button" variant="danger" className="!py-1 !text-xs" onClick={() => remove(m.id)}>
                        Sil
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Button type="button" variant="ghost" disabled={pageSafe <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                Onceki
              </Button>
              <span className="text-xs text-stone-500">
                {pageSafe + 1} / {pageCount}
              </span>
              <Button
                type="button"
                variant="ghost"
                disabled={pageSafe >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              >
                Sonraki
              </Button>
            </div>
          ) : null}
        </>
      )}
    </AdminPageShell>
  )
}
