import { Link } from 'react-router-dom'
import { contactPath, denePath, packagesAnchor } from '../sitePaths'

const SERVICES = [
  {
    title: 'Showroom',
    body: 'Malzemeyi yakından görün, randevu alın.',
    href: contactPath(),
  },
  {
    title: 'Termin',
    body: 'Stok ve üretim süresi her parçada açık.',
    href: denePath(),
  },
  {
    title: 'Set indirimi',
    body: 'Tam pakette indirim otomatik uygulanır.',
    href: packagesAnchor(),
  },
] as const

export function HomeAtelier() {
  return (
    <section className="home-atelier site-enter" aria-labelledby="home-atelier-title">
      <div className="home-atelier-card">
        <div className="home-atelier-main">
          <p className="home-atelier-eyebrow">Showroom</p>
          <h2 id="home-atelier-title" className="home-atelier-title home-display">
            Dokunun, karar verin
          </h2>
          <p className="home-atelier-body">
            Kumaş, ahşap ve ölçü seçeneklerini yerinde deneyimleyin. Uzman ekibimiz size özel teklif hazırlasın.
          </p>
          <Link to={contactPath()} className="home-atelier-link">
            Randevu al →
          </Link>
        </div>
        <ul className="home-atelier-services">
          {SERVICES.map((item) => (
            <li key={item.title}>
              <Link to={item.href} className="home-atelier-service">
                <span className="home-atelier-service-title">{item.title}</span>
                <span className="home-atelier-service-body">{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
