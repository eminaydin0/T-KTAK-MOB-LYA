type Props = {
  productCount: number
  categoryCount: number
  packageCount: number
}

export function HomeInterlude({ productCount, categoryCount, packageCount }: Props) {
  return (
    <section className="home-interlude home-breakout site-enter" aria-label="Vitrin özeti">
      <div className="home-interlude-grid">
        <div className="home-interlude-stat">
          <p className="home-interlude-num tabular-nums">{productCount}</p>
          <p className="home-interlude-label">parça</p>
        </div>
        <div className="home-interlude-divider" aria-hidden />
        <div className="home-interlude-stat">
          <p className="home-interlude-num tabular-nums">{categoryCount}</p>
          <p className="home-interlude-label">oda & alan</p>
        </div>
        {packageCount > 0 ? (
          <>
            <div className="home-interlude-divider" aria-hidden />
            <div className="home-interlude-stat">
              <p className="home-interlude-num tabular-nums">{packageCount}</p>
              <p className="home-interlude-label">set paketi</p>
            </div>
          </>
        ) : null}
      </div>
      <p className="home-interlude-tagline">Ölçü · malzeme · termin — her parçada şeffaf detay</p>
    </section>
  )
}
