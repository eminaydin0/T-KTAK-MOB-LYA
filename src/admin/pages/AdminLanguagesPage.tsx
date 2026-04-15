import { useSite } from '../../core/context/SiteContext'
import { AdminPageShell } from '../components/AdminPageShell'
import { Button } from '../components/ui/Button'

export function AdminLanguagesPage() {
  const { data, update } = useSite()
  const langs = [...data.languages].sort((a, b) => a.code.localeCompare(b.code))

  const setDefault = (code: string) => {
    update((d) => ({
      ...d,
      languages: d.languages.map((l) => ({
        ...l,
        isDefault: l.code === code,
        enabled: l.code === code ? true : l.enabled,
      })),
    }))
  }

  const toggleEnabled = (code: string, enabled: boolean) => {
    update((d) => {
      let next = d.languages.map((l) => (l.code === code ? { ...l, enabled } : l))
      if (enabled === false && next.some((l) => l.isDefault && l.code === code)) {
        const fallback = next.find((l) => l.enabled && l.code !== code) || next.find((l) => l.code !== code)
        if (fallback) {
          next = next.map((l) => ({
            ...l,
            isDefault: l.code === fallback.code,
            enabled: l.code === fallback.code ? true : l.enabled,
          }))
        }
      }
      if (!next.some((l) => l.enabled)) {
        next = next.map((l, i) => (i === 0 ? { ...l, enabled: true } : l))
      }
      if (!next.some((l) => l.isDefault)) {
        const f = next.find((l) => l.enabled) ?? next[0]
        next = next.map((l) => ({ ...l, isDefault: f ? l.code === f.code : false }))
      }
      return { ...d, languages: next }
    })
  }

  const updateName = (code: string, name: string) => {
    update((d) => ({
      ...d,
      languages: d.languages.map((l) => (l.code === code ? { ...l, name } : l)),
    }))
  }

  const remove = (code: string) => {
    if (data.languages.length <= 1) {
      window.alert('En az bir dil kalmali.')
      return
    }
    if (!window.confirm(`"${code}" dilini kaldirmak istiyor musunuz?`)) return
    update((d) => {
      const next = d.languages.filter((l) => l.code !== code)
      if (!next.some((l) => l.isDefault)) {
        const f = next[0]
        return {
          ...d,
          languages: next.map((l, i) => ({ ...l, isDefault: f ? l.code === f.code : i === 0 })),
        }
      }
      return { ...d, languages: next }
    })
  }

  const add = () => {
    const code = window.prompt('Dil kodu (orn: de, fr)', '')
    if (!code?.trim()) return
    const c = code.trim().toLowerCase()
    if (data.languages.some((l) => l.code === c)) {
      window.alert('Bu kod zaten var.')
      return
    }
    const name = window.prompt('Dil adi', c.toUpperCase()) || c
    update((d) => ({
      ...d,
      languages: [...d.languages, { code: c, name, enabled: false, isDefault: false }],
    }))
  }

  return (
    <AdminPageShell
      title="Diller"
      description="Aktif diller vitrinde secilebilir (asagida). Varsayilan dil isaretleme zorunludur."
    >
      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={add}>
          + Dil ekle
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Kod</th>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Aktif</th>
              <th className="px-4 py-3 font-medium">Varsayilan</th>
              <th className="w-24 px-4 py-3 text-right font-medium">Islem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {langs.map((l) => (
              <tr key={l.code}>
                <td className="px-4 py-2 font-mono text-sm text-stone-800">{l.code}</td>
                <td className="px-4 py-2">
                  <input
                    className="w-full max-w-[200px] rounded border border-stone-200 px-2 py-1 text-sm"
                    value={l.name}
                    onChange={(e) => updateName(l.code, e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={l.enabled}
                    onChange={(e) => toggleEnabled(l.code, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="radio"
                    name="default-lang"
                    checked={l.isDefault}
                    onChange={() => setDefault(l.code)}
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <Button type="button" variant="danger" className="!py-1 !text-xs" onClick={() => remove(l.code)}>
                    Sil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        Dil kodunu degistirmek baglantilari etkileyebilir; vitrin metinleri simdilik tek dil uzerinden yonetilir.
      </p>
    </AdminPageShell>
  )
}
