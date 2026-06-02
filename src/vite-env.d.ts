/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXCHANGERATE_API_KEY?: string
  /** Bos birakilirsa admin paneli sifresiz acilir; doluysa /admin/login zorunlu */
  readonly VITE_ADMIN_PASSWORD?: string
  /** true + VITE_PAYMENT_PROVIDER ile kart odeme gateway'i aktif olur */
  readonly VITE_PAYMENT_ENABLED?: string
  /** iyzico | stripe | mock */
  readonly VITE_PAYMENT_PROVIDER?: string
  /** Canonical URL ve Open Graph icin site kok adresi (or. https://www.emin-mobilya.com) */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
