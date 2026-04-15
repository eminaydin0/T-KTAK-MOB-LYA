/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXCHANGERATE_API_KEY?: string
  /** Bos birakilirsa admin paneli sifresiz acilir; doluysa /admin/login zorunlu */
  readonly VITE_ADMIN_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
