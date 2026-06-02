const MATERIALS = [
  'Masif meşe',
  'Kuvars tezgah',
  'Keten döşeme',
  'Mat lake',
  'Paslanmaz ayak',
  'Ceviz kaplama',
  'Ergonomik sünger',
  'LED dimmer',
  'Modüler raf',
  'Özel ölçü',
]

export function HomeMaterialTape() {
  const loop = [...MATERIALS, ...MATERIALS]

  return (
    <div className="home-mat-tape home-breakout" aria-hidden>
      <div className="home-mat-track motion-reduce:animate-none">
        {loop.map((word, i) => (
          <span key={`${word}-${i}`} className="home-mat-word">
            {word}
            <span className="home-mat-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
