import { Link } from 'react-router-dom'
import { useCatalog } from '../../core/context/CatalogContext'
import { useOrders } from '../../core/context/OrdersContext'

export function AdminDashboardPage() {
  const { categories, products, resetToDefaults } = useCatalog()
  const { orders } = useOrders()

  const openOrders = orders.filter((o) => o.status !== 'tamam').length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Genel bakis</h2>
          <p className="mt-1 text-sm text-stone-600">Katalog ve siparis ozetleri ayri tutulur</p>
        </div>
        <button
          type="button"
          onClick={resetToDefaults}
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
        >
          Katalogu sifirla
        </button>
      </div>

      <p className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">
        <strong className="text-stone-800">Veri mantigi:</strong> Kategoriler ve urunler vitrin katalogudur.
        Siparisler musteri taleplerinin kaydidir; katalog sifirlansa bile siparis gecmisi silinmez (ayri
        depolama).
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">Kategoriler</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{categories.length}</p>
          <Link
            to="/admin/categories"
            className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            Yonet →
          </Link>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">Urunler</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{products.length}</p>
          <Link
            to="/admin/products"
            className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            Yonet →
          </Link>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">Siparisler</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{orders.length}</p>
          <Link
            to="/admin/orders"
            className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            Listele →
          </Link>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">Acik siparis</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{openOrders}</p>
          <p className="mt-3 text-xs text-stone-500">Teslim edilmemis kayit</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Site (CMS)</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: '/admin/carousel', label: 'Carousel', hint: 'Ana sayfa slider' },
            { to: '/admin/content', label: 'Metinler', hint: 'Hero, footer, sabit sayfalar' },
            { to: '/admin/navigation', label: 'Menu', hint: 'Ust / alt baglantilar' },
            { to: '/admin/media', label: 'Medya', hint: 'Ortak gorsel kutuphanesi' },
            { to: '/admin/languages', label: 'Diller', hint: 'tr, en, ...' },
            { to: '/admin/settings', label: 'Genel ayarlar', hint: 'SEO, iletisim' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:bg-amber-50/40"
            >
              <p className="font-semibold text-stone-900">{item.label}</p>
              <p className="mt-1 text-xs text-stone-500">{item.hint}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/80 p-5 text-sm text-stone-600">
          <p className="font-medium text-stone-800">Katalog</p>
          <p className="mt-2">
            <Link className="font-semibold text-amber-700 hover:underline" to="/admin/categories">
              Kategoriler
            </Link>{' '}
            ve{' '}
            <Link className="font-semibold text-amber-700 hover:underline" to="/admin/products">
              urunler
            </Link>{' '}
            ile vitrini besleyin.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/80 p-5 text-sm text-stone-600">
          <p className="font-medium text-stone-800">Siparisler</p>
          <p className="mt-2">
            <Link className="font-semibold text-amber-700 hover:underline" to="/admin/orders">
              Siparis listesi
            </Link>
            ’nde durum guncelleyin veya hizli test siparisi olusturun.
          </p>
        </div>
      </div>
    </div>
  )
}
