import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { BlurText, ShinyText } from '../../components/react-bits'

type Props = {
  kicker?: string
  title: string
  lead?: string
  href?: string
  linkLabel?: string
  className?: string
  titleId?: string
  /** React Bits — başlıkta blur reveal */
  animateTitle?: boolean
  /** React Bits — kicker parıltısı */
  shinyKicker?: boolean
}

/** Tüm vitrin bölümlerinde ortak başlık düzeni */
export function SiteSectionHead({
  kicker,
  title,
  lead,
  href,
  linkLabel = 'Tümünü gör →',
  className,
  titleId,
  animateTitle = false,
  shinyKicker = false,
}: Props) {
  return (
    <header className={cn('site-section-head', className)}>
      <div className="site-section-head-main">
        {kicker ? (
          shinyKicker ? (
            <ShinyText
              text={kicker}
              className="site-section-kicker uppercase"
              color="#a8a29e"
              shineColor="#e7e5e4"
              speed={4}
              spread={105}
            />
          ) : (
            <p className="site-section-kicker">{kicker}</p>
          )
        ) : null}
        {animateTitle ? (
          <BlurText
            as="h2"
            id={titleId}
            text={title}
            className="site-section-head-title home-display"
            delay={90}
            rootMargin="-8% 0px"
          />
        ) : (
          <h2 id={titleId} className="site-section-head-title home-display">
            {title}
          </h2>
        )}
        {lead ? <p className="site-section-lead">{lead}</p> : null}
      </div>
      {href ? (
        <Link to={href} className="site-section-more">
          {linkLabel}
        </Link>
      ) : null}
    </header>
  )
}
