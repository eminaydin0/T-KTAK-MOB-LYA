import { AppRoutes } from './app/AppRoutes'
import { ScrollToTop } from './app/ScrollToTop'
import { CartProvider } from './core/context/CartContext'
import { CatalogProvider } from './core/context/CatalogContext'
import { OrdersProvider } from './core/context/OrdersContext'
import { SiteProvider } from './core/context/SiteContext'

export default function App() {
  return (
    <SiteProvider>
      <CatalogProvider>
        <CartProvider>
          <OrdersProvider>
            <ScrollToTop />
            <AppRoutes />
          </OrdersProvider>
        </CartProvider>
      </CatalogProvider>
    </SiteProvider>
  )
}
