const SECTIONS = [
  { id: 'top', label: 'Giriş' },
  { id: 'highlights', label: 'Keşfet' },
  { id: 'lookbook', label: 'Koleksiyon' },
  { id: 'editorial', label: 'Seçki' },
  { id: 'packages', label: 'Setler' },
  { id: 'catalog', label: 'Katalog' },
] as const

export function HomeSectionNav() {
  return (
    <nav className="home-dots" aria-label="Sayfa bölümleri">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={s.id === 'top' ? '#' : `#${s.id}`}
          className="home-dots-item group"
          title={s.label}
        >
          <span className="home-dots-pip" />
          <span className="home-dots-label">{s.label}</span>
        </a>
      ))}
    </nav>
  )
}
