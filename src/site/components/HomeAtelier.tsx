import { Link } from 'react-router-dom'
import { Reveal } from '../../components/motion'
import { defaultLookbookSlides } from '../../core/site/defaultSiteSeed'
import { carouselHeroSrc } from '../../lib/carouselImage'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { contactPath, denePath, packagesPath } from '../sitePaths'

const SHOWROOM_IMAGE = defaultLookbookSlides[1]?.imageUrl ?? defaultLookbookSlides[0]!.imageUrl

const SERVICES = [
  {
    title: 'Showroom',
    body: 'Malzemeyi yakından görün, kumaş ve ahşap örneklerini karşılaştırın.',
    href: contactPath(),
    image: defaultLookbookSlides[1]?.imageUrl,
  },
  {
    title: 'Termin',
    body: 'Stok ve üretim süresi her parçada açık — sürpriz yok.',
    href: denePath(),
    image: defaultLookbookSlides[0]?.imageUrl,
  },
  {
    title: 'Set indirimi',
    body: 'Tam pakette indirim otomatik; parçaları ayrı da seçin.',
    href: packagesPath(),
    image: defaultLookbookSlides[2]?.imageUrl,
  },
] as const

export function HomeAtelier() {
  return (
    <Reveal as="section" className="home-atelier site-section scroll-mt-24" aria-labelledby="home-atelier-title">
      <div className="home-atelier-editorial">
        <Link to={contactPath()} className="home-atelier-visual group">
          <ImageThumb
            src={carouselHeroSrc(SHOWROOM_IMAGE)}
            alt=""
            className="site-img-zoom h-full w-full object-cover"
            emptyClassName="h-full w-full bg-stone-200"
          />
          <span className="home-atelier-visual-shade" aria-hidden />
          <span className="home-atelier-visual-copy">
            <span className="home-atelier-visual-kicker">Showroom</span>
            <span className="home-atelier-visual-title home-display">Dokunun, karar verin</span>
            <span className="home-atelier-visual-cta">Randevu al →</span>
          </span>
        </Link>

        <div className="home-atelier-side">
          <p id="home-atelier-title" className="home-atelier-side-lead">
            Kumaş, ahşap ve ölçü seçeneklerini yerinde deneyimleyin. Uzman ekibimiz size özel teklif hazırlasın.
          </p>

          <ul className="home-atelier-services">
            {SERVICES.map((item) => (
              <li key={item.title}>
                <Link to={item.href} className="home-atelier-service group">
                  {item.image ? (
                    <span className="home-atelier-service-media">
                      <ImageThumb
                        src={carouselHeroSrc(item.image)}
                        alt=""
                        className="h-full w-full object-cover"
                        emptyClassName="h-full w-full bg-stone-200"
                      />
                    </span>
                  ) : null}
                  <span className="home-atelier-service-body">
                    <span className="home-atelier-service-title">{item.title}</span>
                    <span className="home-atelier-service-text">{item.body}</span>
                  </span>
                  <span className="home-atelier-service-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}
