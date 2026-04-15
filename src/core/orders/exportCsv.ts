import type { Order } from './types'
import { ORDER_STATUS_LABEL } from './types'

function esc(cell: string) {
  if (cell.includes('"') || cell.includes(',') || cell.includes('\n')) {
    return `"${cell.replace(/"/g, '""')}"`
  }
  return cell
}

function linesSummary(o: Order) {
  return o.lines.map((l) => `${l.qty}x ${l.productName}`).join('; ')
}

/** UTF-8 BOM + virgul ayirac — Excel TR icin uyumlu */
export function ordersToCsv(orders: Order[]): string {
  const headers = [
    'referans',
    'tarih',
    'musteri',
    'telefon',
    'durum',
    'kalemler',
    'musteri_notu',
    'dahili_not',
    'iletisim_sayisi',
  ]
  const rows = orders.map((o) =>
    [
      o.referenceCode,
      o.createdAt,
      o.customerName,
      o.phone,
      ORDER_STATUS_LABEL[o.status],
      linesSummary(o),
      o.note ?? '',
      o.internalNotes ?? '',
      String(o.communications?.length ?? 0),
    ].map((c) => esc(String(c)))
  )
  const body = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  return `\ufeff${body}`
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
