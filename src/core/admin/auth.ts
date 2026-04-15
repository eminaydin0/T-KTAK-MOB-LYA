const SESSION_KEY = 'emin-admin-session'

/** Bos veya tanimli degilse panel acik (gelistirme); doluysa giris zorunlu */
export function adminPasswordConfigured(): boolean {
  const p = import.meta.env.VITE_ADMIN_PASSWORD
  return typeof p === 'string' && p.trim().length > 0
}

export function isAdminAuthenticated(): boolean {
  if (!adminPasswordConfigured()) return true
  return sessionStorage.getItem(SESSION_KEY) === 'ok'
}

export function loginAdmin(password: string): boolean {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD?.trim()
  if (!expected) return true
  if (password === expected) {
    sessionStorage.setItem(SESSION_KEY, 'ok')
    return true
  }
  return false
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
