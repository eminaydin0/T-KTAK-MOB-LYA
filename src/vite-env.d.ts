/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXCHANGERATE_API_KEY?: string
  /** Bos birakilirsa admin paneli sifresiz acilir; doluysa /admin/login zorunlu */
  readonly VITE_ADMIN_PASSWORD?: string
  /** true + VITE_PAYMENT_PROVIDER ile kart odeme gateway'i aktif olur */
  readonly VITE_PAYMENT_ENABLED?: string
  /** iyzico | stripe | mock */
  readonly VITE_PAYMENT_PROVIDER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
