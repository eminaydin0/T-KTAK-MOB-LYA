import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/motion'
import { BlurText, ShinyText } from '../../components/react-bits'
import { useCatalog } from '../../core/context/CatalogContext'
import { carouselHeroSrc } from '../../lib/carouselImage'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { categoryPath } from '../sitePaths'

/** Kategori görselleri — tam genişlik film şeridi */
export function HomeCategoryFilm() {
  const { categories, products } = useCatalog()

  const tiles = useMemo(() => {
    const counts = new Map<number, number>()
    for (const p of products) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)

    return categories
      .map((c) => ({
        ...c,
        count: counts.get(c.id) ?? 0,
        image: c.imageUrl?.trim() || '',
      }))
      .filter((c) => c.image && c.count > 0)
      .slice(0, 10)
  }, [categories, products])

  if (tiles.length === 0) return null

  return (
    <Reveal as="section" className="home-category-film" aria-label="Odalara göre keşfet">
      <div className="home-category-film-head site-section">
        <ShinyText
          text="Odalara göre"
          className="site-section-kicker uppercase"
          color="#a8a29e"
          shineColor="#d6d3d1"
          speed={4.5}
        />
        <BlurText
          as="h2"
          text="Nereyi döşüyoruz?"
          className="home-category-film-title home-display"
          delay={85}
          rootMargin="-6% 0px"
        />
      </div>

      <div className="home-category-film-track-wrap">
        <div className="home-category-film-track" data-lenis-prevent>
          {tiles.map((c) => (
            <Link key={c.id} to={categoryPath(c)} className="home-category-film-card group">
              <ImageThumb
                src={carouselHeroSrc(c.image)}
                alt=""
                className="site-img-zoom h-full w-full object-cover"
                emptyClassName="h-full w-full bg-stone-200"
              />
              <span className="home-category-film-shade" aria-hidden />
              <span className="home-category-film-copy">
                <span className="home-category-film-name">{c.name}</span>
                <span className="home-category-film-count">{c.count} parça</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  )
}
