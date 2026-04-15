import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { CatalogCategory, CatalogProduct } from '../../core/catalog/types'
import { STOCK_STATUS_LABEL, productPrimaryImage, type StockStatus } from '../../core/catalog/types'
import { useCatalog } from '../../core/context/CatalogContext'
import { useExchangeRate } from '../../lib/useExchangeRate'
import { formatUsdAndTry } from '../../shared/formatPrice'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { Button } from '../components/ui/Button'
import { Field, inputClass, selectClass } from '../components/ui/Field'
import { AdminProductImageCarousel } from '../components/AdminProductImageCarousel'
import { Modal } from '../components/ui/Modal'

/** Modalda `?? []` kullanmayin; her render yeni dizi carousel'i bozar. */
const EMPTY_IMAGES: string[] = []

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export function AdminProductsPage() {
  const { categories, products, addProduct, updateProduct, deleteProduct } = useCatalog()
  const usdToTry = useExchangeRate()

  const [modalOpen, setModalOpen] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(0)
  const [description, setDescription] = useState('')
  /** Bos satirlar kayitta atilir */
  const [images, setImages] = useState<string[]>([''])
  const [priceUsdInput, setPriceUsdInput] = useState('0')
  const [stockStatus, setStockStatus] = useState<StockStatus>('unknown')
  const [leadTimeInput, setLeadTimeInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, string>>({})

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId),
    [categories, categoryId]
  )

  const parsePriceUsd = (raw: string) => {
    const n = parseFloat(raw.replace(',', '.').trim())
    return Number.isFinite(n) ? Math.max(0, n) : 0
  }

  const modalPreview = formatUsdAndTry(parsePriceUsd(priceUsdInput), usdToTry)

  useEffect(() => {
    if (categories.length === 0) {
      setCategoryId(0)
      return
    }
    if (!categories.some((c) => c.id === categoryId)) {
      setCategoryId(categories[0].id)
    }
  }, [categories, categoryId])

  useEffect(() => {
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) return
    setCategoryAnswers((prev) => {
      const next: Record<string, string> = {}
      for (const q of cat.questions) {
        next[q.id] = prev[q.id] ?? ''
      }
      return next
    })
  }, [categoryId, categories])

  useEffect(() => {
    if (detailId === null) return
    if (!products.some((x) => x.id === detailId)) setDetailId(null)
  }, [products, detailId])

  const detailProduct: CatalogProduct | undefined = useMemo(
    () => (detailId !== null ? products.find((x) => x.id === detailId) : undefined),
    [products, detailId]
  )
  const detailCategory = detailProduct
    ? categories.find((c) => c.id === detailProduct.categoryId)
    : undefined
  const detailPrice = detailProduct
    ? formatUsdAndTry(detailProduct.priceUsd, usdToTry)
    : null

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setDescription('')
    setImages([''])
    setPriceUsdInput('0')
    setStockStatus('unknown')
    setLeadTimeInput('')
    setCategoryAnswers({})
    if (fileRef.current) fileRef.current.value = ''
    if (categories[0]) setCategoryId(categories[0].id)
  }

  const closeModal = () => {
    setModalOpen(false)
    resetForm()
  }

  const openCreate = () => {
    resetForm()
    setModalOpen(true)
  }

  const startEdit = (id: number) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setEditingId(id)
    setName(p.name)
    setCategoryId(p.categoryId)
    setDescription(p.description)
    setImages(p.images?.length ? [...p.images] : [''])
    setPriceUsdInput(String(p.priceUsd))
    setStockStatus(p.stockStatus ?? 'unknown')
    setLeadTimeInput(p.leadTimeDays != null ? String(p.leadTimeDays) : '')
    const cat = categories.find((c) => c.id === p.categoryId)
    const ans: Record<string, string> = {}
    if (cat) {
      for (const q of cat.questions) {
        ans[q.id] = p.categoryAnswers?.[q.id] ?? ''
      }
    }
    setCategoryAnswers(ans)
    if (fileRef.current) fileRef.current.value = ''
    setModalOpen(true)
  }

  function answersPayloadForSave(cat: CatalogCategory | undefined): Record<string, string> {
    if (!cat?.questions.length) return {}
    const out: Record<string, string> = {}
    for (const q of cat.questions) {
      out[q.id] = (categoryAnswers[q.id] ?? '').trim()
    }
    return out
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    const added: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 2 * 1024 * 1024) {
        window.alert(`Atlandı (2 MB altinda olmali): ${file.name}`)
        continue
      }
      try {
        added.push(await readFileAsDataUrl(file))
      } catch {
        window.alert(`Okunamadi: ${file.name}`)
      }
    }
    if (added.length) setImages((prev) => [...prev.filter((u) => u.trim() !== ''), ...added])
    e.target.value = ''
  }

  const imagesPayload = () => images.map((u) => u.trim()).filter(Boolean)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !categoryId) return
    const priceUsd = parsePriceUsd(priceUsdInput)
    const leadTrim = leadTimeInput.trim()
    const leadTimeDays =
      leadTrim === '' ? null : Math.max(0, Math.floor(parseFloat(leadTrim) || 0))
    const cat = categories.find((c) => c.id === categoryId)
    const categoryAnswersPayload = answersPayloadForSave(cat)

    const imgs = imagesPayload()
    if (editingId !== null) {
      updateProduct(editingId, {
        name,
        categoryId,
        description,
        images: imgs,
        priceUsd,
        stockStatus,
        leadTimeDays,
        categoryAnswers: categoryAnswersPayload,
      })
    } else {
      addProduct({
        name,
        categoryId,
        description,
        images: imgs,
        priceUsd,
        stockStatus,
        leadTimeDays,
        categoryAnswers: categoryAnswersPayload,
      })
    }
    closeModal()
  }

  const isEdit = editingId !== null

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Urunler</h2>
          <p className="mt-1 text-sm text-stone-600">
            Birden fazla gorsel URL veya dosya — tarayicida saklanir
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          disabled={categories.length === 0}
          className="shrink-0"
          title={categories.length === 0 ? 'Once kategori ekleyin' : undefined}
        >
          <span className="text-lg leading-none">+</span>
          Yeni urun
        </Button>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={isEdit ? 'Urunu duzenle' : 'Yeni urun'}
        description={
          isEdit
            ? 'Degisiklikler kaydedildiginde vitrinde guncellenir.'
            : 'Urun bilgilerini girin; istege bagli gorsel ekleyebilirsiniz.'
        }
        size="lg"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Urun adi" htmlFor="prd-name" className="sm:col-span-2">
              <input
                id="prd-name"
                required
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Orn: TV unitesi"
                autoFocus
              />
            </Field>

            <Field label="Kategori" htmlFor="prd-cat">
              <select
                id="prd-cat"
                className={selectClass}
                value={categoryId || ''}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                disabled={categories.length === 0}
                required
              >
                {categories.length === 0 ? (
                  <option value="">Once kategori ekleyin</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {(c.questions?.length ?? 0) > 0 ? ` (${c.questions.length} soru)` : ''}
                    </option>
                  ))
                )}
              </select>
            </Field>

            {selectedCategory && selectedCategory.questions.length > 0 ? (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 sm:col-span-2">
                <p className="text-sm font-semibold text-amber-950">
                  Kategoriye ozel: {selectedCategory.name}
                </p>
                <p className="mt-1 text-xs text-amber-900/80">
                  Bu alanlar sadece secilen kategori icin gosterilir; vitrinde urun kartinda listelenir.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {selectedCategory.questions.map((q) => (
                    <Field key={q.id} label={q.label} htmlFor={`prd-a-${q.id}`}>
                      <input
                        id={`prd-a-${q.id}`}
                        className={inputClass}
                        value={categoryAnswers[q.id] ?? ''}
                        onChange={(e) =>
                          setCategoryAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        placeholder={q.placeholder || 'Cevabinizi yazin'}
                      />
                    </Field>
                  ))}
                </div>
              </div>
            ) : null}

            <Field
              label="Liste fiyati (USD)"
              htmlFor="prd-price"
              hint="TL, ustteki guncel kurla otomatik hesaplanir."
            >
              <input
                id="prd-price"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.01}
                className={inputClass}
                value={priceUsdInput}
                onChange={(e) => setPriceUsdInput(e.target.value)}
                placeholder="0"
              />
            </Field>

            <div className="rounded-xl border border-stone-200 bg-stone-50/90 px-4 py-3 text-sm text-stone-700 sm:col-span-2">
              <p className="font-medium text-stone-800">Onizleme</p>
              <p className="mt-1 font-semibold tabular-nums text-stone-900">{modalPreview.usd}</p>
              {modalPreview.tryApprox ? (
                <p className="mt-0.5 text-stone-600">{modalPreview.tryApprox}</p>
              ) : (
                <p className="mt-0.5 text-xs text-stone-500">
                  TL icin kur yukleniyor veya API anahtari eksik.
                </p>
              )}
            </div>

            <Field label="Stok durumu" htmlFor="prd-stock">
              <select
                id="prd-stock"
                className={selectClass}
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
              >
                {(Object.keys(STOCK_STATUS_LABEL) as StockStatus[]).map((k) => (
                  <option key={k} value={k}>
                    {STOCK_STATUS_LABEL[k]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Termin (gun)"
              htmlFor="prd-lead"
              hint="On siparis icin; bos birakilabilir."
            >
              <input
                id="prd-lead"
                type="number"
                min={0}
                className={inputClass}
                value={leadTimeInput}
                onChange={(e) => setLeadTimeInput(e.target.value)}
                placeholder="Orn: 14"
              />
            </Field>

            <Field label="Aciklama" htmlFor="prd-desc" className="sm:col-span-2">
              <textarea
                id="prd-desc"
                rows={3}
                className={`${inputClass} resize-y min-h-[88px]`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kisa aciklama, malzeme, renk notu..."
              />
            </Field>

            <div className="space-y-3 sm:col-span-2">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Gorseller</p>
                <Button
                  type="button"
                  variant="ghost"
                  className="!py-1 !text-xs"
                  onClick={() => setImages((prev) => [...prev, ''])}
                >
                  + URL satiri
                </Button>
              </div>
              <p className="text-xs text-stone-500">
                HTTPS adresi veya asagidan birden fazla dosya secin. Liste sirasi vitrinde kullanilir.
              </p>
              <div className="space-y-2">
                {images.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="url"
                      className={inputClass}
                      value={url}
                      onChange={(e) =>
                        setImages((rows) => rows.map((r, j) => (j === idx ? e.target.value : r)))
                      }
                      placeholder="https://..."
                      aria-label={`Gorsel URL ${idx + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="shrink-0 !px-2 !text-xs text-stone-500"
                      onClick={() =>
                        setImages((rows) => {
                          const next = rows.filter((_, j) => j !== idx)
                          return next.length === 0 ? [''] : next
                        })
                      }
                    >
                      Sil
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Dosyadan yukle (coklu secim)"
                htmlFor="prd-file"
                hint="PNG, JPG — dosya basina max ~2 MB; listeye eklenir."
              >
                <input
                  ref={fileRef}
                  id="prd-file"
                  type="file"
                  accept="image/*"
                  multiple
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm text-stone-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-stone-200 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone-800 hover:border-amber-300"
                  onChange={handleFiles}
                />
              </Field>
            </div>
          </div>

          {imagesPayload().length > 0 ? (
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-800">Onizleme ({imagesPayload().length})</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {imagesPayload().map((url, i) => (
                  <div key={`${i}-${url.slice(0, 24)}`} className="text-center">
                    <ImageThumb
                      src={url}
                      alt=""
                      className="h-24 w-32 rounded-xl"
                      emptyClassName="flex h-24 w-32 items-center justify-center rounded-xl bg-stone-200 text-xs text-stone-500"
                    />
                    <p className="mt-1 max-w-[8rem] truncate text-[10px] text-stone-500">
                      {url.startsWith('data:') ? 'Yerel' : 'URL'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Vazgec
            </Button>
            <Button type="submit" disabled={categories.length === 0}>
              {isEdit ? 'Guncelle' : 'Urunu ekle'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detailId !== null && detailProduct !== undefined}
        onClose={() => setDetailId(null)}
        title="Vitrin onizlemesi"
        description="Urun kartinin sitede nasil gorunecegi (yaklasik)."
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setDetailId(null)}>
              Kapat
            </Button>
            {detailProduct ? (
              <Button
                type="button"
                onClick={() => {
                  setDetailId(null)
                  startEdit(detailProduct.id)
                }}
              >
                Duzenle
              </Button>
            ) : null}
          </div>
        }
      >
        {detailProduct && detailCategory ? (
          <div className="rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white to-stone-50/90 p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <div className="mx-auto w-full max-w-[360px] shrink-0 lg:mx-0">
                <AdminProductImageCarousel
                  key={`${detailProduct.id}-${detailProduct.images?.length ?? 0}`}
                  imageUrls={detailProduct.images ?? EMPTY_IMAGES}
                  name={detailProduct.name}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-6 lg:max-w-xl lg:pt-0.5">
                <header className="space-y-3">
                  <span className="inline-flex rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
                    {detailCategory.name}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-[1.65rem] sm:leading-snug">
                    {detailProduct.name}
                  </h3>
                  <p className="max-w-prose text-base leading-7 text-stone-600">{detailProduct.description}</p>
                </header>

                {detailCategory.questions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Kategoriye ozel</p>
                    <ul className="divide-y divide-stone-200/90 rounded-xl border border-stone-200/80 bg-white/80 px-1 py-0.5">
                      {detailCategory.questions.map((q) => {
                        const v = detailProduct.categoryAnswers?.[q.id]?.trim()
                        if (!v) return null
                        return (
                          <li
                            key={q.id}
                            className="flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-start sm:gap-4 sm:py-3.5"
                          >
                            <span className="shrink-0 text-sm font-medium text-stone-500 sm:min-w-[10rem] sm:pt-0.5">
                              {q.label}
                            </span>
                            <span className="min-w-0 text-sm font-medium leading-relaxed text-stone-900">{v}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                  {detailPrice ? (
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums">
                      <span className="text-lg font-semibold text-stone-900">{detailPrice.usd}</span>
                      {detailPrice.tryApprox ? (
                        <span className="text-base text-stone-600">{detailPrice.tryApprox}</span>
                      ) : (
                        <span className="text-sm text-stone-400">TL tahmini icin kur yukleniyor</span>
                      )}
                    </div>
                  ) : null}
                  <span className="inline-flex w-fit rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-800">
                    {STOCK_STATUS_LABEL[detailProduct.stockStatus ?? 'unknown']}
                    {detailProduct.leadTimeDays != null ? ` · ~${detailProduct.leadTimeDays} gün` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 bg-stone-50/80 px-4 py-3 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Liste</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-3 py-3 font-medium">Gorsel</th>
                <th className="px-3 py-3 font-medium">Urun</th>
                <th className="px-3 py-3 font-medium">Kategori</th>
                <th className="min-w-[140px] px-3 py-3 font-medium">Fiyat</th>
                <th className="px-3 py-3 font-medium">Stok</th>
                <th className="px-3 py-3 font-medium">Aciklama</th>
                <th className="min-w-[200px] px-3 py-3 text-right font-medium">Islem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <p className="text-stone-500">Henuz urun yok.</p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-3"
                      onClick={openCreate}
                      disabled={categories.length === 0}
                    >
                      Ilk urunu ekle
                    </Button>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId)
                  const rowPrice = formatUsdAndTry(p.priceUsd, usdToTry)
                  return (
                    <tr key={p.id} className="transition hover:bg-stone-50/80">
                      <td className="px-3 py-2">
                        <div className="relative">
                          <ImageThumb
                            src={productPrimaryImage(p)}
                            alt={p.name}
                            className="h-14 w-14 rounded-xl"
                            emptyClassName="flex h-14 w-14 items-center justify-center rounded-xl bg-stone-200 text-[10px] text-stone-500"
                          />
                          {(p.images?.length ?? 0) > 1 ? (
                            <span className="absolute -bottom-1 -right-1 rounded-full bg-amber-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                              +{(p.images!.length - 1)}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="max-w-[180px] px-3 py-2 font-medium text-stone-900">
                        {p.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-stone-600">
                        {cat?.name ?? '—'}
                      </td>
                      <td className="px-3 py-2 align-top text-xs tabular-nums text-stone-800">
                        <span className="block font-semibold">{rowPrice.usd}</span>
                        {rowPrice.tryApprox ? (
                          <span className="mt-0.5 block text-stone-500">{rowPrice.tryApprox}</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 text-xs text-stone-700">
                        <span className="font-medium">{STOCK_STATUS_LABEL[p.stockStatus ?? 'unknown']}</span>
                        {p.leadTimeDays != null ? (
                          <span className="mt-0.5 block text-stone-500">~{p.leadTimeDays} gün</span>
                        ) : null}
                      </td>
                      <td className="max-w-xs truncate px-3 py-2 text-stone-600">{p.description}</td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          className="!inline-flex !py-1 !text-xs text-stone-700"
                          onClick={() => setDetailId(p.id)}
                        >
                          Detay
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="!inline-flex !py-1 !text-xs text-amber-800"
                          onClick={() => startEdit(p.id)}
                        >
                          Duzenle
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="!inline-flex !py-1 !text-xs"
                          onClick={() => deleteProduct(p.id)}
                        >
                          Sil
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
