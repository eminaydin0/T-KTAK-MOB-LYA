import { Route, Routes } from 'react-router-dom'
import { RequireAdmin } from '../admin/components/RequireAdmin'
import { AdminLayout } from '../admin/layouts/AdminLayout'
import { AdminCarouselPage } from '../admin/pages/AdminCarouselPage'
import { AdminCategoriesPage } from '../admin/pages/AdminCategoriesPage'
import { AdminContentPage } from '../admin/pages/AdminContentPage'
import { AdminDashboardPage } from '../admin/pages/AdminDashboardPage'
import { AdminLanguagesPage } from '../admin/pages/AdminLanguagesPage'
import { AdminLoginPage } from '../admin/pages/AdminLoginPage'
import { AdminMediaPage } from '../admin/pages/AdminMediaPage'
import { AdminNavigationPage } from '../admin/pages/AdminNavigationPage'
import { AdminOrdersPage } from '../admin/pages/AdminOrdersPage'
import { AdminPackagesPage } from '../admin/pages/AdminPackagesPage'
import { AdminProductsPage } from '../admin/pages/AdminProductsPage'
import { AdminSecurityPage } from '../admin/pages/AdminSecurityPage'
import { AdminSettingsPage } from '../admin/pages/AdminSettingsPage'
import { SiteLayout } from '../site/layouts/SiteLayout'
import { CartPage } from '../site/pages/CartPage'
import { CategoryPage } from '../site/pages/CategoryPage'
import { CheckoutPage } from '../site/pages/CheckoutPage'
import { CheckoutSuccessPage } from '../site/pages/CheckoutSuccessPage'
import { ContactPage } from '../site/pages/ContactPage'
import { DenePage } from '../site/pages/DenePage'
import { GizlilikPage } from '../site/pages/GizlilikPage'
import { HomePage } from '../site/pages/HomePage'
import { KvkkPage } from '../site/pages/KvkkPage'
import { PackagePage } from '../site/pages/PackagePage'
import { NotFoundPage } from '../site/pages/NotFoundPage'
import { ProductDetailPage } from '../site/pages/ProductDetailPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="kategori/:categorySlug" element={<CategoryPage />} />
        <Route path="sepet" element={<CartPage />} />
        <Route path="odeme" element={<CheckoutPage />} />
        <Route path="odeme/basarili" element={<CheckoutSuccessPage />} />
        <Route path="dene" element={<DenePage />} />
        <Route path="iletisim" element={<ContactPage />} />
        <Route path="gizlilik" element={<GizlilikPage />} />
        <Route path="kvkk" element={<KvkkPage />} />
        <Route path="paket/:packageSlug" element={<PackagePage />} />
        <Route path="urun/:productSlug" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="carousel" element={<AdminCarouselPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="navigation" element={<AdminNavigationPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="packages" element={<AdminPackagesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="languages" element={<AdminLanguagesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="security" element={<AdminSecurityPage />} />
      </Route>
    </Routes>
  )
}
