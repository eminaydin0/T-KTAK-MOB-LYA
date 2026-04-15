import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAdminAuthenticated } from '../../core/admin/auth'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
