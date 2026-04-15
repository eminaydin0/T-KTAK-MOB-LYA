import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { SiteContent, SiteData, SiteLanguage } from '../site/types'
import { defaultSiteData, loadSiteData, resetSiteData, saveSiteData } from '../site/storage'

function normalizeLanguages(langs: SiteLanguage[]): SiteLanguage[] {
  if (langs.length === 0) return defaultSiteData().languages
  let next = langs.map((l) => ({ ...l }))
  if (!next.some((l) => l.enabled)) {
    next[0] = { ...next[0], enabled: true }
  }
  const defIdx = next.findIndex((l) => l.isDefault)
  if (defIdx === -1) {
    const firstOn = next.find((l) => l.enabled) ?? next[0]
    next = next.map((l) => ({ ...l, isDefault: l.code === firstOn.code }))
  }
  let seen = false
  next = next.map((l) => {
    if (!l.isDefault) return l
    if (seen) return { ...l, isDefault: false }
    seen = true
    return l
  })
  return next
}

function syncContentLocales(data: SiteData): SiteData {
  const langs = normalizeLanguages(data.languages)
  const defCode = langs.find((l) => l.isDefault)?.code || 'tr'
  const def = defaultSiteData()
  let map = { ...data.contentByLocale }
  const base =
    map[defCode] || map.tr || def.contentByLocale.tr || def.contentByLocale[defCode]
  if (!map[defCode] && base) {
    map = { ...map, [defCode]: { ...base } }
  }
  const seed = map[defCode] || map.tr || def.contentByLocale.tr
  for (const l of langs) {
    if (!map[l.code] && seed) {
      map[l.code] = { ...seed }
    }
  }
  return { ...data, languages: langs, contentByLocale: map }
}

function normalizeData(data: SiteData): SiteData {
  return syncContentLocales(data)
}

type SiteContextValue = {
  data: SiteData
  /** Secili vitrin dili */
  activeLocale: string
  setActiveLocale: (code: string) => void
  /** activeLocale icin cozumlenmis metinler */
  resolvedContent: SiteContent
  update: (fn: (prev: SiteData) => SiteData) => void
  resetToDefaults: () => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => normalizeData(loadSiteData()))

  const [activeLocale, setActiveLocaleState] = useState(() => {
    try {
      return sessionStorage.getItem('emin-site-locale') || 'tr'
    } catch {
      return 'tr'
    }
  })

  useEffect(() => {
    saveSiteData(data)
  }, [data])

  useEffect(() => {
    const enabled = data.languages.filter((l) => l.enabled)
    const codes = enabled.map((l) => l.code)
    const def = data.languages.find((l) => l.isDefault)?.code || 'tr'
    if (codes.length === 0) return
    let next = activeLocale
    if (!next || !codes.includes(next)) {
      next = codes.includes(def) ? def : codes[0]!
    }
    if (next !== activeLocale) setActiveLocaleState(next)
  }, [data.languages, activeLocale])

  const setActiveLocale = useCallback((code: string) => {
    setActiveLocaleState(code)
    try {
      sessionStorage.setItem('emin-site-locale', code)
    } catch {
      /* ignore */
    }
  }, [])

  const resolvedContent = useMemo(() => {
    const def = data.languages.find((l) => l.isDefault)?.code || 'tr'
    const map = data.contentByLocale
    return (
      map[activeLocale] ||
      map[def] ||
      map.tr ||
      defaultSiteData().contentByLocale.tr
    )
  }, [data.contentByLocale, data.languages, activeLocale])

  const update = useCallback((fn: (prev: SiteData) => SiteData) => {
    setData((prev) => normalizeData(fn(prev)))
  }, [])

  const resetToDefaults = useCallback(() => {
    resetSiteData()
    const next = normalizeData(defaultSiteData())
    setData(next)
    const def = next.languages.find((l) => l.isDefault)?.code || 'tr'
    setActiveLocaleState(def)
    try {
      sessionStorage.setItem('emin-site-locale', def)
    } catch {
      /* ignore */
    }
  }, [setActiveLocaleState])

  const value = useMemo(
    () => ({
      data,
      activeLocale: activeLocale || data.languages.find((l) => l.isDefault)?.code || 'tr',
      setActiveLocale,
      resolvedContent,
      update,
      resetToDefaults,
    }),
    [data, activeLocale, setActiveLocale, resolvedContent, update, resetToDefaults]
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
