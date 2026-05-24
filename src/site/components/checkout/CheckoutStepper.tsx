import { Link } from 'react-router-dom'
import { cartPath, checkoutPath } from '../../sitePaths'

type Step = 'cart' | 'payment' | 'success'

type Props = {
  current: Step
}

const STEPS: { id: Step; label: string; path?: string }[] = [
  { id: 'cart', label: 'Sepet', path: cartPath() },
  { id: 'payment', label: 'Ödeme', path: checkoutPath() },
  { id: 'success', label: 'Onay' },
]

export function CheckoutStepper({ current }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.id === current)

  return (
    <nav className="mb-10" aria-label="Ödeme adımları">
      <ol className="flex flex-wrap items-center gap-2 sm:gap-0">
        {STEPS.map((step, i) => {
          const done = i < currentIdx
          const active = i === currentIdx
          const content = (
            <span
              className={`flex items-center gap-2 text-sm ${
                active ? 'font-semibold text-ink' : done ? 'text-cotta' : 'text-stone-400'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  active
                    ? 'bg-ink text-white'
                    : done
                      ? 'bg-cotta text-white'
                      : 'border border-line bg-white text-stone-500'
                }`}
                aria-hidden
              >
                {done ? '✓' : i + 1}
              </span>
              {step.label}
            </span>
          )

          return (
            <li key={step.id} className="flex items-center">
              {step.path && !active && done ? (
                <Link to={step.path} className="transition hover:text-cotta">
                  {content}
                </Link>
              ) : (
                content
              )}
              {i < STEPS.length - 1 ? (
                <span className="mx-2 hidden h-px w-8 bg-line sm:block md:mx-4 md:w-12" aria-hidden />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
