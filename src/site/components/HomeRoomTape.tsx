import { Link } from 'react-router-dom'
import { categoryPath } from '../sitePaths'
import type { HomeCategoryItem } from './HomeCategoryBento'

type Props = {
  categories: HomeCategoryItem[]
}

export function HomeRoomTape({ categories }: Props) {
  if (categories.length === 0) return null

  const loop = [...categories, ...categories]

  return (
    <nav className="home-tape home-breakout" aria-label="Oda ve koleksiyonlar">
      <div className="home-tape-fade home-tape-fade--left" aria-hidden />
      <div className="home-tape-fade home-tape-fade--right" aria-hidden />
      <div className="home-tape-track motion-reduce:animate-none">
        {loop.map((c, i) => (
          <Link
            key={`${c.id}-${i}`}
            to={categoryPath(c)}
            className="home-tape-item group"
          >
            <span className="home-tape-name">{c.name}</span>
            <span className="home-tape-dot" aria-hidden>
              ·
            </span>
            <span className="home-tape-count">{c.count}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
