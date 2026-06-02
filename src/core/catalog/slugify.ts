/** Türkçe metinden URL slug üretir */
export function slugifyTr(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ensureUniqueSlug(base: string, used: Set<string>, fallback = 'item'): string {
  let slug = base || fallback
  let n = 1
  while (used.has(slug)) {
    slug = `${base || fallback}-${n}`
    n += 1
  }
  used.add(slug)
  return slug
}
