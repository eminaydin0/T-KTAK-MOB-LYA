import { Link } from 'react-router-dom'
import { contactPath, denePath } from '../sitePaths'

const ITEMS = [
  {
    title: 'Showroom ziyareti',
    body: 'Malzemeyi yakından görün, ölçü ve kombinasyon için randevu alın.',
    href: contactPath(),
    cta: 'Randevu',
  },
  {
    title: 'Şeffaf termin',
    body: 'Her parçada stok durumu ve üretim süresi açıkça belirtilir.',
    href: denePath(),
    cta: 'Nasıl çalışır',
  },
  {
    title: 'Set indirimi',
    body: 'Tam paketi sepete ekleyin — indirim otomatik uygulanır.',
    href: '/#packages',
    cta: 'Setleri gör',
  },
] as const

export function HomeServiceStrip() {
  return (
    <section className="home-services home-breakout site-enter" aria-label="Hizmetler">
      <ul className="home-services-grid">
        {ITEMS.map((item) => (
          <li key={item.title} className="home-services-item">
            <h3 className="home-services-title">{item.title}</h3>
            <p className="home-services-body">{item.body}</p>
            <Link to={item.href} className="home-services-link">
              {item.cta} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
