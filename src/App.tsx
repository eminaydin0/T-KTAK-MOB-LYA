import { AppRoutes } from './app/AppRoutes'
import { CatalogProvider } from './core/context/CatalogContext'
import { OrdersProvider } from './core/context/OrdersContext'
import { SiteProvider } from './core/context/SiteContext'

export default function App() {
  return (
    <SiteProvider>
      <CatalogProvider>
        <OrdersProvider>
          <AppRoutes />
        </OrdersProvider>
      </CatalogProvider>
    </SiteProvider>
  )
}
