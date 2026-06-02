import { Link } from 'react-router-dom'
import { packagesAnchor } from '../sitePaths'

type Props = {
  message?: string
}

export function HomePromoBar({ message }: Props) {
  const text = message?.trim()
  if (!text) return null

  return (
    <aside className="home-promo site-enter" aria-label="Duyuru">
      <Link to={packagesAnchor()} className="home-promo-link">
        {text}
      </Link>
    </aside>
  )
}
