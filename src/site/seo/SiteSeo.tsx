import { useEffect } from 'react'
import { absoluteUrl } from './seoHelpers'

type JsonLd = Record<string, unknown>

type Props = {
  title: string
  description?: string
  /** Örn. /kategori/mobilya — canonical ve og:url için */
  path?: string
  image?: string
  type?: 'website' | 'product' | 'article'
  noindex?: boolean
  jsonLd?: JsonLd | JsonLd[]
}

const JSON_LD_ID = 'site-seo-jsonld'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function SiteSeo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: Props) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    document.title = title

    const canonical =
      path != null
        ? absoluteUrl(path)
        : typeof window !== 'undefined'
          ? window.location.href.split('#')[0]
          : ''

    if (canonical) upsertLink('canonical', canonical)

    upsertMeta('property', 'og:title', title)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('property', 'og:type', type)
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')

    if (canonical) {
      upsertMeta('property', 'og:url', canonical)
    }

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }

    if (image) {
      upsertMeta('property', 'og:image', image)
      upsertMeta('name', 'twitter:image', image)
    }

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, nofollow')
    } else {
      const robots = document.querySelector('meta[name="robots"]')
      if (robots) robots.remove()
    }

    const existing = document.getElementById(JSON_LD_ID)
    if (jsonLd) {
      const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
      const script = existing ?? document.createElement('script')
      script.id = JSON_LD_ID
      script.setAttribute('type', 'application/ld+json')
      script.textContent = JSON.stringify(payload.length === 1 ? payload[0] : payload)
      if (!existing) document.head.appendChild(script)
    } else if (existing) {
      existing.remove()
    }
  }, [title, description, path, image, type, noindex, jsonLdKey])

  return null
}
