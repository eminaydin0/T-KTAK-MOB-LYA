import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { adminPasswordConfigured, isAdminAuthenticated, loginAdmin } from '../../core/admin/auth'
import { Button } from '../components/ui/Button'
import { Field, inputClass } from '../components/ui/Field'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (adminPasswordConfigured() && isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  if (!adminPasswordConfigured()) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-stone-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-stone-900">Yonetici girisi</h1>
          <p className="mt-2 text-sm text-stone-600">
            <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">VITE_ADMIN_PASSWORD</code>{' '}
            tanimli degil; panel su an sifresiz acik. Isterseniz{' '}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">.env</code> dosyasina sifre
            ekleyin.
          </p>
          <Link
            to="/admin"
            className="mt-6 inline-flex rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Panele git
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (loginAdmin(password)) {
      navigate(from, { replace: true })
    } else {
      setError('Sifre hatali.')
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-stone-100 to-stone-200 px-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-lg shadow-stone-200/60">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">EMIN</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Yonetici girisi</h1>
        <p className="mt-2 text-sm text-stone-600">
          Site icerigini ve katalogu yonetmek icin sifrenizi girin.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Field label="Sifre" htmlFor="admin-pass">
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
            />
          </Field>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full justify-center">
            Giris yap
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          <Link to="/" className="font-semibold text-amber-800 hover:underline">
            Siteye don
          </Link>
        </p>
      </div>
    </div>
  )
}
