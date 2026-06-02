import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { writeFileSync } from 'fs'
import { defaultCategories, defaultProducts } from './src/core/catalog/defaultCatalogSeed'
import { defaultPackages } from './src/core/catalog/defaultPackageSeed'

function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      const base = (process.env.VITE_SITE_URL || 'https://www.emin-mobilya.com').replace(/\/$/, '')
      const paths = [
        '/',
        '/iletisim',
        '/gizlilik',
        '/kvkk',
        ...defaultCategories.map((c) => `/kategori/${c.slug}`),
        ...defaultProducts.map((p) => `/urun/${p.slug}`),
        ...defaultPackages.map((p) => `/paket/${p.slug}`),
      ]
      const today = new Date().toISOString().slice(0, 10)
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${base}${p}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`
      writeFileSync('dist/sitemap.xml', xml)
      writeFileSync('public/sitemap.xml', xml)
    },
  }
}

export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
