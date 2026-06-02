import type { ContactLead } from './types'

export const LEADS_STORAGE_KEY = 'emin-dashboard-leads-v1'

export function loadLeads(): ContactLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l): l is ContactLead =>
        l &&
        typeof l === 'object' &&
        typeof l.id === 'string' &&
        typeof l.name === 'string' &&
        typeof l.email === 'string' &&
        l.kvkkAccepted === true
    )
  } catch {
    return []
  }
}

export function saveLead(lead: ContactLead) {
  const prev = loadLeads()
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify([lead, ...prev]))
}
