import { type FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  packageBundlePriceUsd,
  packagePartsTotalUsd,
} from '../../core/catalog/defaultPackageSeed'
import { PACKAGE_KIND_LABEL, productPrimaryImage, type CatalogPackage, type CatalogPackageKind } from '../../core/catalog/types'
import { useCatalog } from '../../core/context/CatalogContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { packagePath } from '../../site/sitePaths'
import { Button } from '../components/ui/Button'
import { Field, inputClass, selectClass, textareaClass } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'

const KIND_OPTIONS: { value: CatalogPackageKind; label: string }[] = [
  { value: 'wedding', label: PACKAGE_KIND_LABEL.wedding },
  { value: 'living_room', label: PACKAGE_KIND_LABEL.living_room },
  { value: 'bedroom', label: PACKAGE_KIND_LABEL.bedroom },
]

type FormState = {
  name: string
  slug: string
  tagline: string
  description: string
  kind: CatalogPackageKind
  imageUrl: string
  discount: string
  productIds: number[]
}

function emptyForm(): FormState {
  return {
    name: '',
    slug: '',
    tagline: '',
    description: '',
    kind: 'living_room',
    imageUrl: '',
    discount: '10',
    productIds: [],
  }
}

function formFromPackage(pkg: CatalogPackage): FormState {
  return {
    name: pkg.name,
    slug: pkg.slug,
    tagline: pkg.tagline,
    description: pkg.description,
    kind: pkg.kind,
    imageUrl: pkg.imageUrl ?? '',
    discount: String(pkg.bundleDiscountPercent),
    productIds: [...pkg.productIds],
  }
}

export function AdminPackagesPage() {
  const { packages, products, categories, addPackage, updatePackage, deletePackage } = useCatalog()
  const usdToTry = useExchangeRate()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [productQuery, setProductQuery] = useState('')

  const editing = editingId != null ? packages.find((p) => p.id === editingId) : null

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase()
    return products.filter((p) => {
      if (!q) return true
      const cat = categories.find((c) => c.id === p.categoryId)?.name.toLowerCase() ?? ''
      return p.name.toLowerCase().includes(q) || cat.includes(q)
    })
  }, [products, categories, productQuery])

  const productsByCategory = useMemo(() => {
    const map = new Map<number, typeof products>()
    for (const p of filteredProducts) {
      const list = map.get(p.categoryId) ?? []
      list.push(p)
      map.set(p.categoryId, list)
    }
    return [...map.entries()].map(([categoryId, list]) => ({
      categoryId,
      name: categories.find((c) => c.id === categoryId)?.name ?? 'Kategori',
      products: list,
    }))
  }, [filteredProducts, categories])

  const formPreview = useMemo(() => {
    const discount = Math.min(50, Math.max(0, parseInt(form.discount, 10) || 0))
    const selected = products.filter((p) => form.productIds.includes(p.id))
    const total = packagePartsTotalUsd(form.productIds, products)
    const bundle = packageBundlePriceUsd(form.productIds, products, discount)
    return {
      count: selected.length,
      total: formatUsdAndTry(total, usdToTry),
      bundle: formatUsdAndTry(bundle, usdToTry),
      discount,
    }
  }, [form.productIds, form.discount, products, usdToTry])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setProductQuery('')
    setModalOpen(true)
  }

  const openEdit = (pkg: CatalogPackage) => {
    setEditingId(pkg.id)
    setForm(formFromPackage(pkg))
    setProductQuery('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm())
    setProductQuery('')
  }

  const toggleProduct = (id: number) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((x) => x !== id)
        : [...f.productIds, id],
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const discount = Math.min(50, Math.max(0, parseInt(form.discount, 10) || 0))
    const payload = {
      name: form.name,
      slug: form.slug,
      tagline: form.tagline,
      description: form.description,
      kind: form.kind,
      imageUrl: form.imageUrl.trim() || undefined,
      productIds: form.productIds,
      bundleDiscountPercent: discount,
    }
    if (editing) {
      updatePackage(editing.id, payload)
    } else {
      addPackage(payload)
    }
    closeModal()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Paketler</h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">
            Urunleri birlestirerek dugun, oturma odasi veya yatak odasi paketleri olusturun. Parcalar
            vitrinde ayri ayri da satilir; tam sette indirim uygulanir.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          Yeni paket
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center text-sm text-stone-500">
          Henuz paket yok. Urunleri secerek ilk paketinizi olusturun.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {packages.map((pkg) => {
            const parts = pkg.productIds
              .map((id) => products.find((p) => p.id === id))
              .filter((p): p is NonNullable<typeof p> => p != null)
            const total = packagePartsTotalUsd(pkg.productIds, products)
            const bundle = packageBundlePriceUsd(pkg.productIds, products, pkg.bundleDiscountPercent)
            const totalFmt = formatUsdAndTry(total, usdToTry)
            const bundleFmt = formatUsdAndTry(bundle, usdToTry)
            return (
              <article
                key={pkg.id}
                className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {pkg.imageUrl?.trim() ? (
                      <ImageThumb
                        src={pkg.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        emptyClassName="flex h-full w-full items-center justify-center text-xs text-stone-400"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                        Gorsel yok
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {PACKAGE_KIND_LABEL[pkg.kind]}
                    </p>
                    <h3 className="truncate font-semibold text-stone-900">{pkg.name}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-stone-500">{pkg.tagline}</p>
                    <p className="mt-2 text-xs text-stone-600">
                      {parts.length} parca · %{pkg.bundleDiscountPercent} set indirimi
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-stone-900">
                      {bundleFmt.usd}
                      <span className="ml-2 text-xs font-normal text-stone-400 line-through">
                        {totalFmt.usd}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-stone-100 bg-stone-50/80 px-4 py-3">
                  <Button type="button" variant="secondary" className="text-xs" onClick={() => openEdit(pkg)}>
                    Duzenle
                  </Button>
                  <Link
                    to={packagePath(pkg.slug)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Vitrinde ac
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    className="ml-auto text-xs text-red-600 hover:text-red-700"
                    onClick={() => deletePackage(pkg.id)}
                  >
                    Sil
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Paketi duzenle' : 'Yeni paket'}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Iptal
            </Button>
            <Button type="submit" form="admin-package-form">
              {editing ? 'Kaydet' : 'Olustur'}
            </Button>
          </>
        }
      >
        <form id="admin-package-form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Paket adi">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </Field>
            <Field label="URL slug" hint="Vitrin: /paket/slug">
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="ornek: dugun-paketi"
              />
            </Field>
          </div>

          <Field label="Kisa aciklama (tagline)">
            <input
              className={inputClass}
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            />
          </Field>

          <Field label="Detayli aciklama">
            <textarea
              className={textareaClass}
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Paket tipi">
              <select
                className={selectClass}
                value={form.kind}
                onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as CatalogPackageKind }))}
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Set indirimi (%)" hint="0–50">
              <input
                className={inputClass}
                type="number"
                min={0}
                max={50}
                value={form.discount}
                onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
              />
            </Field>
          </div>

          <Field label="Kapak gorseli URL">
            <input
              className={inputClass}
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://..."
            />
          </Field>

          <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
            <p className="font-medium">
              {formPreview.count} parca secili · Tam set {formPreview.bundle.usd}
            </p>
            <p className="mt-0.5 text-xs text-amber-900/80">
              Parca toplami {formPreview.total.usd}
              {formPreview.discount > 0 ? ` · %${formPreview.discount} indirim uygulanir` : ''}
            </p>
          </div>

          <div>
            <Field label="Pakete dahil urunler">
              <input
                className={`${inputClass} mb-3`}
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Urun veya kategori ara..."
              />
            </Field>
            <div className="max-h-64 space-y-4 overflow-y-auto rounded-lg border border-stone-200 p-3">
              {products.length === 0 ? (
                <p className="text-sm text-stone-500">Once urun ekleyin.</p>
              ) : productsByCategory.length === 0 ? (
                <p className="text-sm text-stone-500">Eslesen urun yok.</p>
              ) : (
                productsByCategory.map((group) => (
                  <div key={group.categoryId}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {group.name}
                    </p>
                    <ul className="space-y-1">
                      {group.products.map((p) => {
                        const checked = form.productIds.includes(p.id)
                        const price = formatUsdAndTry(p.priceUsd, usdToTry)
                        return (
                          <li key={p.id}>
                            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-stone-50">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleProduct(p.id)}
                                className="rounded border-stone-300"
                              />
                              <span className="h-10 w-10 shrink-0 overflow-hidden rounded bg-stone-100">
                                <ImageThumb
                                  src={productPrimaryImage(p)}
                                  alt=""
                                  className="h-full w-full object-cover"
                                  emptyClassName="flex h-full w-full items-center justify-center text-[10px]"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-stone-800">
                                  {p.name}
                                </span>
                                <span className="text-xs tabular-nums text-stone-500">{price.usd}</span>
                              </span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
