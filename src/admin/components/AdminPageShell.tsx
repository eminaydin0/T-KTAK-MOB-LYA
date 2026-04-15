import { type ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  children?: ReactNode
}

export function AdminPageShell({ title, description, children }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-stone-600">{description}</p> : null}
      </div>
      {children}
    </div>
  )
}

export function ComingSoonBanner() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">Yakinda</p>
      <p className="mt-1 text-amber-900/90">
        Bu bolum icin veri modeli ve vitrin baglantisi sonraki adimda eklenecek; arayuz ve menu hazir.
      </p>
    </div>
  )
}
