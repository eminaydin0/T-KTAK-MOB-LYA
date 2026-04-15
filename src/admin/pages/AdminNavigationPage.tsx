import { useSite } from '../../core/context/SiteContext'
import { uid } from '../../core/site/storage'
import type { SiteNavItem } from '../../core/site/types'
import { AdminPageShell } from '../components/AdminPageShell'
import { Button } from '../components/ui/Button'
import { Field, inputClass } from '../components/ui/Field'

function sortNav(items: SiteNavItem[]) {
  return [...items].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
}

function reindexAll(nav: SiteNavItem[]): SiteNavItem[] {
  const h = sortNav(nav.filter((n) => n.placement === 'header')).map((x, i) => ({ ...x, order: i }))
  const f = sortNav(nav.filter((n) => n.placement === 'footer')).map((x, i) => ({ ...x, order: i }))
  return [...h, ...f]
}

function NavBlock({
  title,
  placement,
  items,
  onAdd,
  onPatch,
  onRemove,
  onMove,
}: {
  title: string
  placement: 'header' | 'footer'
  items: SiteNavItem[]
  onAdd: () => void
  onPatch: (id: string, patch: Partial<SiteNavItem>) => void
  onRemove: (id: string) => void
  onMove: (id: string, dir: -1 | 1) => void
}) {
  const list = sortNav(items.filter((x) => x.placement === placement))
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
        <Button type="button" variant="secondary" onClick={onAdd}>
          + Link ekle
        </Button>
      </div>
      <ul className="mt-4 space-y-3">
        {list.map((it, idx) => (
          <li
            key={it.id}
            className="rounded-xl border border-stone-100 bg-stone-50/80 p-3 sm:grid sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-3"
          >
            <Field label="Etiket" htmlFor={`l-${it.id}`}>
              <input
                id={`l-${it.id}`}
                className={inputClass}
                value={it.label}
                onChange={(e) => onPatch(it.id, { label: e.target.value })}
              />
            </Field>
            <Field label="URL" htmlFor={`u-${it.id}`}>
              <input
                id={`u-${it.id}`}
                className={inputClass}
                value={it.href}
                onChange={(e) => onPatch(it.id, { href: e.target.value })}
                placeholder="/ veya https://"
              />
            </Field>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
              <label className="flex items-center gap-2 text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={it.openInNewTab}
                  onChange={(e) => onPatch(it.id, { openInNewTab: e.target.checked })}
                />
                Yeni sekme
              </label>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" className="!px-2 !text-xs" disabled={idx === 0} onClick={() => onMove(it.id, -1)}>
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="!px-2 !text-xs"
                  disabled={idx === list.length - 1}
                  onClick={() => onMove(it.id, 1)}
                >
                  ↓
                </Button>
                <Button type="button" variant="danger" className="!px-2 !text-xs" onClick={() => onRemove(it.id)}>
                  Sil
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AdminNavigationPage() {
  const { data, update } = useSite()

  const add = (placement: 'header' | 'footer') => {
    update((d) => {
      const same = d.navigation.filter((n) => n.placement === placement)
      const next: SiteNavItem = {
        id: uid(),
        label: 'Yeni link',
        href: '/',
        openInNewTab: false,
        order: same.length,
        placement,
      }
      return { ...d, navigation: reindexAll([...d.navigation, next]) }
    })
  }

  const patch = (id: string, p: Partial<SiteNavItem>) => {
    update((d) => ({
      ...d,
      navigation: d.navigation.map((n) => (n.id === id ? { ...n, ...p } : n)),
    }))
  }

  const remove = (id: string) => {
    update((d) => ({ ...d, navigation: reindexAll(d.navigation.filter((n) => n.id !== id)) }))
  }

  const move = (id: string, dir: -1 | 1) => {
    update((d) => {
      const it = d.navigation.find((n) => n.id === id)
      if (!it) return d
      const pool = sortNav(d.navigation.filter((n) => n.placement === it.placement))
      const idx = pool.findIndex((n) => n.id === id)
      const j = idx + dir
      if (idx < 0 || j < 0 || j >= pool.length) return d
      const a = pool[idx]!
      const b = pool[j]!
      return {
        ...d,
        navigation: d.navigation.map((n) => {
          if (n.id === a.id) return { ...n, order: b.order }
          if (n.id === b.id) return { ...n, order: a.order }
          return n
        }),
      }
    })
  }

  return (
    <AdminPageShell
      title="Menu ve yonlendirme"
      description="Ust ve alt bilgi linkleri vitrinde otomatik listelenir. Dahili sayfalar icin / ile baslayin."
    >
      <div className="space-y-8">
        <NavBlock
          title="Ust menu"
          placement="header"
          items={data.navigation}
          onAdd={() => add('header')}
          onPatch={patch}
          onRemove={remove}
          onMove={move}
        />
        <NavBlock
          title="Alt bilgi linkleri"
          placement="footer"
          items={data.navigation}
          onAdd={() => add('footer')}
          onPatch={patch}
          onRemove={remove}
          onMove={move}
        />
      </div>
    </AdminPageShell>
  )
}
