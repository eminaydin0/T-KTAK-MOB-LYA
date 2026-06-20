import type { ReactNode } from 'react'
import { motion, useReducedMotion } from '../../lib/motion'
import { pageTransition } from '../../lib/motion-variants'

type Props = {
  children: ReactNode
  /** Route pathname — AnimatePresence key */
  routeKey: string
  className?: string
}

export function PageTransition({ children, routeKey, className }: Props) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      key={routeKey}
      className={className}
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
