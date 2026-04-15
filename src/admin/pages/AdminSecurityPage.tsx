import { adminPasswordConfigured } from '../../core/admin/auth'
import { useSite } from '../../core/context/SiteContext'
import { AdminPageShell } from '../components/AdminPageShell'
import { Button } from '../components/ui/Button'

export function AdminSecurityPage() {
  const locked = adminPasswordConfigured()
  const { resetToDefaults } = useSite()

  return (
    <AdminPageShell
      title="Giris ve guvenlik"
      description="Panel erisimi ve site verilerinin saklanmasi."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-800">Panel sifresi</p>
          <p className="mt-2 text-sm text-stone-600">
            {locked ? (
              <>
                <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">VITE_ADMIN_PASSWORD</code>{' '}
                tanimli; giris sayfasi aktif. Cikis icin kenar cubugundaki &quot;Cikis&quot; kullanilir.
              </>
            ) : (
              <>
                Sifre yok — panel herkese acik. Uretimde{' '}
                <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">.env</code> icine{' '}
                <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">VITE_ADMIN_PASSWORD</code>{' '}
                ekleyin.
              </>
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
          <p className="text-sm font-medium text-amber-950">Site verileri (CMS)</p>
          <p className="mt-2 text-sm text-amber-900/90">
            Carousel, metinler, menu, diller ve genel ayarlar tarayicinizda{' '}
            <code className="rounded bg-white/80 px-1 py-0.5 text-xs">localStorage</code> icinde saklanir; sunucu
            gonderilmez.
          </p>
          <Button
            type="button"
            variant="danger"
            className="mt-4"
            onClick={() => {
              if (
                window.confirm(
                  'Tum site ayarlari (carousel, metinler, menu, medya listesi) ornek veriye doner. Emin misiniz?'
                )
              ) {
                resetToDefaults()
              }
            }}
          >
            Site verilerini sifirla
          </Button>
        </div>
      </div>
    </AdminPageShell>
  )
}
