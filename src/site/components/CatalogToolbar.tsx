import { selectClass } from '../../admin/components/ui/Field'
import {
  PRODUCT_SORT_LABEL,
  STOCK_FILTER_LABEL,
  type ProductSort,
  type StockFilter,
} from '../catalogFilters'

type Props = {
  sort: ProductSort
  stock: StockFilter
  onSortChange: (v: ProductSort) => void
  onStockChange: (v: StockFilter) => void
  total: number
  className?: string
}

export function CatalogToolbar({
  sort,
  stock,
  onSortChange,
  onStockChange,
  total,
  className = '',
}: Props) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="site-caption">{total} ürün</p>
      <div className="flex flex-wrap gap-2">
        <label className="flex items-center gap-2 text-xs text-stone-600">
          Sırala
          <select
            className={`${selectClass} py-2 text-xs`}
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ProductSort)}
          >
            {(Object.keys(PRODUCT_SORT_LABEL) as ProductSort[]).map((key) => (
              <option key={key} value={key}>
                {PRODUCT_SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-stone-600">
          Stok
          <select
            className={`${selectClass} py-2 text-xs`}
            value={stock}
            onChange={(e) => onStockChange(e.target.value as StockFilter)}
          >
            {(Object.keys(STOCK_FILTER_LABEL) as StockFilter[]).map((key) => (
              <option key={key} value={key}>
                {STOCK_FILTER_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
