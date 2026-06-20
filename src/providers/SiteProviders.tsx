import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { ReactLenis } from 'lenis/react'
import { MotionConfig, useReducedMotion } from '../lib/motion'
import { easeSite } from '../lib/motion-variants'
import 'lenis/dist/lenis.css'

type Props = {
  children: ReactNode
  /** Lenis yumuşak kaydırma (lookbook scroll-jack ile uyumlu, hafif lerp) */
  smoothScroll?: boolean
}

export function SiteProviders({ children, smoothScroll = true }: Props) {
  const reducedMotion = useReducedMotion()

  const lenisOptions = useMemo(
    () => ({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      allowNestedScroll: true,
    }),
    []
  )

  const useLenis = smoothScroll && !reducedMotion

  const tree = (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.48, ease: easeSite }}
    >
      {children}
    </MotionConfig>
  )

  if (!useLenis) return tree

  return (
    <ReactLenis root options={lenisOptions}>
      {tree}
    </ReactLenis>
  )
}
