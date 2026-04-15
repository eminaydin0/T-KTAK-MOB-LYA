import { useEffect, useMemo, useState } from 'react'
import { useCatalog } from '../../core/context/CatalogContext'
import { useOrders } from '../../core/context/OrdersContext'
import { downloadCsv, ordersToCsv } from '../../core/orders/exportCsv'
import {
  COMM_CHANNEL_LABEL,
  ORDER_STATUS_HINT,
  ORDER_STATUS_LABEL,
  type CommChannel,
  type Order,
  type OrderStatus,
} from '../../core/orders/types'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Field, inputClass, selectClass } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'

const statusBadge: Record<OrderStatus, string> = {
  yeni: 'bg-sky-100 text-sky-800 ring-sky-200',
  onay: 'bg-amber-100 text-amber-900 ring-amber-200',
  kargo: 'bg-violet-100 text-violet-800 ring-violet-200',
  tamam: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
}

const PAGE_SIZE = 10

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function linesSummary(o: Order) {
  return o.lines.map((l) => `${l.qty} x ${l.productName}`).join(', ')
}

export function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrder, addOrderCommunication, addOrder } = useOrders()
  const { products } = useCatalog()

  const [filter, setFilter] = useState<OrderStatus | 'hepsi'>('hepsi')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const [cName, setCName] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cNote, setCNote] = useState('')
  const [productId, setProductId] = useState<number>(0)
  const [qty, setQty] = useState(1)
  const [createErrors, setCreateErrors] = useState<{ phone?: string }>({})

  const [internalDraft, setInternalDraft] = useState('')
  const [commChannel, setCommChannel] = useState<CommChannel>('telefon')
  const [commMessage, setCommMessage] = useState('')

  const sorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = sorted
    if (filter !== 'hepsi') list = list.filter((o) => o.status === filter)
    if (q) {
      list = list.filter(
        (o) =>
          o.referenceCode.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          linesSummary(o).toLowerCase().includes(q)
      )
    }
    return list
  }, [sorted, filter, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount - 1)

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)))
  }, [pageCount])
  const paged = useMemo(() => {
    const start = pageSafe * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, pageSafe])

  const detailOrder = useMemo(
    () => (detailId ? orders.find((o) => o.id === detailId) ?? null : null),
    [orders, detailId]
  )

  const openCreate = () => {
    setCName('')
    setCPhone('')
    setCNote('')
    setQty(1)
    setCreateErrors({})
    setProductId(products[0]?.id ?? 0)
    setCreateOpen(true)
  }

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const phoneOk = cPhone.trim().length >= 8
    if (!phoneOk) {
      setCreateErrors({ phone: 'Telefon en az 8 karakter olsun.' })
      return
    }
    setCreateErrors({})
    const p = products.find((x) => x.id === productId)
    if (!p) return
    addOrder({
      customerName: cName,
      phone: cPhone,
      note: cNote || undefined,
      lines: [{ productId: p.id, productName: p.name, qty: Math.max(1, qty) }],
    })
    setCreateOpen(false)
  }

  const handleExport = () => {
    setExporting(true)
    window.setTimeout(() => {
      try {
        const csv = ordersToCsv(filtered)
        downloadCsv(`siparisler-${new Date().toISOString().slice(0, 10)}.csv`, csv)
      } finally {
        setExporting(false)
      }
    }, 80)
  }

  const openDetail = (id: string) => {
    const o = orders.find((x) => x.id === id)
    setInternalDraft(o?.internalNotes ?? '')
    setCommMessage('')
    setDetailId(id)
  }

  useEffect(() => {
    if (!detailOrder) return
    setInternalDraft(detailOrder.internalNotes ?? '')
  }, [detailOrder?.id, detailOrder?.internalNotes])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Siparisler</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
            Durum, dahili not ve iletisim kayitlari sipariste saklanir. CSV disa aktarma Excel ile uyumludur
            (UTF-8).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" loading={exporting} onClick={handleExport}>
            CSV indir
          </Button>
          <Button type="button" onClick={openCreate} disabled={products.length === 0}>
            + Manuel siparis
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="block w-full max-w-md text-sm">
          <span className="text-stone-600">Ara</span>
          <input
            className={`${inputClass} mt-1`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="No, musteri, telefon..."
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['hepsi', 'yeni', 'onay', 'kargo', 'tamam'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setFilter(k)
              setPage(0)
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              filter === k
                ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-200'
                : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
            }`}
          >
            {k === 'hepsi' ? 'Tumu' : ORDER_STATUS_LABEL[k]}
          </button>
        ))}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Manuel siparis girisi"
        description="Telefon veya mesajla gelen siparisi kayda almak icin."
        size="md"
      >
        <form className="space-y-5" onSubmit={submitCreate}>
          <Field label="Musteri adi soyadi" htmlFor="o-name">
            <input
              id="o-name"
              className={inputClass}
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              required
              placeholder="Ornek: Ali Veli"
            />
          </Field>
          <Field
            label="Telefon"
            htmlFor="o-phone"
            hint="Uluslararasi formatta"
            error={createErrors.phone}
          >
            <input
              id="o-phone"
              className={inputClass}
              value={cPhone}
              onChange={(e) => setCPhone(e.target.value)}
              required
              placeholder="+90 5xx xxx xx xx"
              inputMode="tel"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Urun (katalog)" htmlFor="o-prd">
              <select
                id="o-prd"
                className={selectClass}
                value={productId || ''}
                onChange={(e) => setProductId(Number(e.target.value))}
                required
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Adet" htmlFor="o-qty">
              <input
                id="o-qty"
                type="number"
                min={1}
                className={inputClass}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Musteri notu" htmlFor="o-note" hint="Teslimat, adres...">
            <input
              id="o-note"
              className={inputClass}
              value={cNote}
              onChange={(e) => setCNote(e.target.value)}
              placeholder="Istege bagli"
            />
          </Field>
          <div className="flex flex-col-reverse gap-2 border-t border-stone-200 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
              Vazgec
            </Button>
            <Button type="submit">Siparisi kaydet</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detailOrder !== null}
        onClose={() => setDetailId(null)}
        title={detailOrder ? detailOrder.referenceCode : ''}
        description={detailOrder ? `${formatDate(detailOrder.createdAt)} · ${ORDER_STATUS_LABEL[detailOrder.status]}` : undefined}
        size="lg"
      >
        {detailOrder ? (
          <div className="max-h-[70dvh] space-y-5 overflow-y-auto pr-1 text-sm text-stone-700">
            <p>
              <span className="font-medium text-stone-900">{detailOrder.customerName}</span>
              <br />
              <a
                href={`tel:${detailOrder.phone.replace(/\s/g, '')}`}
                className="text-amber-800 hover:underline"
              >
                {detailOrder.phone}
              </a>
            </p>

            <div>
              <p className="text-xs font-semibold uppercase text-stone-500">Kalemler</p>
              <ul className="mt-2 space-y-2">
                {detailOrder.lines.map((l, i) => (
                  <li
                    key={i}
                    className="flex justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2 text-stone-800"
                  >
                    <span>
                      {l.qty} adet {l.productName}
                    </span>
                    {l.productId !== undefined ? (
                      <span className="text-xs text-stone-400">ID: {l.productId}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            {detailOrder.note ? (
              <div className="rounded-xl border border-stone-200 bg-amber-50/50 px-3 py-2">
                <span className="text-xs font-semibold text-stone-500">Musteri notu: </span>
                {detailOrder.note}
              </div>
            ) : null}

            <div>
              <label className="text-xs font-semibold uppercase text-stone-500" htmlFor="det-status">
                Durum
              </label>
              <p className="mt-0.5 text-xs text-stone-500">{ORDER_STATUS_HINT[detailOrder.status]}</p>
              <select
                id="det-status"
                className={`${selectClass} mt-2 max-w-full text-sm`}
                value={detailOrder.status}
                onChange={(e) => {
                  const s = e.target.value as OrderStatus
                  updateOrderStatus(detailOrder.id, s)
                }}
              >
                {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-stone-500">Dahili notlar</p>
              <textarea
                className={`${inputClass} mt-2 min-h-[88px] resize-y`}
                value={internalDraft}
                onChange={(e) => setInternalDraft(e.target.value)}
                placeholder="Operasyon, fatura, uretim notu..."
              />
              <Button
                type="button"
                className="mt-2"
                variant="secondary"
                onClick={() => updateOrder(detailOrder.id, { internalNotes: internalDraft })}
              >
                Dahili notu kaydet
              </Button>
            </div>

            <div className="rounded-xl border border-stone-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">Iletisim kaydi</p>
              <ul className="mt-2 max-h-36 space-y-2 overflow-y-auto text-xs">
                {(detailOrder.communications ?? []).length === 0 ? (
                  <li className="text-stone-400">Henuz kayit yok.</li>
                ) : (
                  [...(detailOrder.communications ?? [])]
                    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
                    .map((c) => (
                      <li key={c.id} className="rounded-lg bg-stone-50 px-2 py-1.5">
                        <span className="font-medium text-stone-700">
                          {COMM_CHANNEL_LABEL[c.channel]}
                        </span>
                        <span className="text-stone-400"> · {formatDate(c.at)}</span>
                        <p className="mt-0.5 text-stone-800">{c.message}</p>
                      </li>
                    ))
                )}
              </ul>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                <Field label="Kanal" htmlFor="comm-ch">
                  <select
                    id="comm-ch"
                    className={selectClass}
                    value={commChannel}
                    onChange={(e) => setCommChannel(e.target.value as CommChannel)}
                  >
                    {(Object.keys(COMM_CHANNEL_LABEL) as CommChannel[]).map((k) => (
                      <option key={k} value={k}>
                        {COMM_CHANNEL_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Mesaj" htmlFor="comm-msg">
                  <input
                    id="comm-msg"
                    className={inputClass}
                    value={commMessage}
                    onChange={(e) => setCommMessage(e.target.value)}
                    placeholder="Orn: musteri yarini arayacak"
                  />
                </Field>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    addOrderCommunication(detailOrder.id, {
                      channel: commChannel,
                      message: commMessage,
                    })
                    setCommMessage('')
                  }}
                >
                  Ekle
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-stone-500">Durum gecmisi</p>
              <ul className="mt-2 space-y-1 text-xs text-stone-600">
                {(detailOrder.statusLog ?? []).length === 0 ? (
                  <li className="text-stone-400">Kayit yok.</li>
                ) : (
                  [...(detailOrder.statusLog ?? [])]
                    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
                    .map((e, i) => (
                      <li key={i}>
                        {formatDate(e.at)}: {ORDER_STATUS_LABEL[e.from]} → {ORDER_STATUS_LABEL[e.to]}
                      </li>
                    ))
                )}
              </ul>
            </div>

            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setDetailId(null)}>
              Kapat
            </Button>
          </div>
        ) : null}
      </Modal>

      {filtered.length === 0 ? (
        <EmptyState
          title="Kayit bulunamadi"
          description={
            orders.length === 0
              ? 'Henuz siparis yok. Manuel siparis ekleyin veya vitrin uzerinden test edin.'
              : 'Filtre veya arama kriterlerinizi degistirin.'
          }
          action={
            orders.length === 0 ? (
              <Button type="button" onClick={openCreate} disabled={products.length === 0}>
                Siparis olustur
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 bg-stone-50/80 px-4 py-3 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {filtered.length} kayit · sayfa {pageSafe + 1}/{pageCount}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
                <tr>
                  <th className="px-3 py-3 font-medium">Siparis no</th>
                  <th className="px-3 py-3 font-medium">Tarih</th>
                  <th className="px-3 py-3 font-medium">Musteri</th>
                  <th className="px-3 py-3 font-medium">Ozet</th>
                  <th className="px-3 py-3 font-medium">Durum</th>
                  <th className="w-28 px-3 py-3 text-right font-medium">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paged.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80">
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold text-stone-800">
                      {o.referenceCode}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-stone-600">{formatDate(o.createdAt)}</td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-stone-900">{o.customerName}</span>
                      <br />
                      <span className="text-xs text-stone-500">{o.phone}</span>
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-3 text-stone-700" title={linesSummary(o)}>
                      {linesSummary(o)}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        className={`max-w-[170px] rounded-lg border-0 px-2 py-1.5 text-xs font-semibold ring-1 ${statusBadge[o.status]}`}
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        aria-label={`${o.referenceCode} durumu`}
                      >
                        {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="!py-1 !text-xs"
                        onClick={() => openDetail(o.id)}
                      >
                        Detay
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pageCount > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 px-4 py-3">
              <Button
                type="button"
                variant="secondary"
                disabled={pageSafe <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Onceki
              </Button>
              <span className="text-xs text-stone-500">
                {pageSafe * PAGE_SIZE + 1}–{Math.min((pageSafe + 1) * PAGE_SIZE, filtered.length)} /{' '}
                {filtered.length}
              </span>
              <Button
                type="button"
                variant="secondary"
                disabled={pageSafe >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              >
                Sonraki
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
