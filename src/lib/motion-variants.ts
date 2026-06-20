import type { Transition, Variants } from 'motion/react'

/** Vitrin easing — tailwind `ease-site` ile uyumlu */
export const easeSite: Transition['ease'] = [0.22, 1, 0.36, 1]
export const easeSoft: Transition['ease'] = [0.16, 1, 0.3, 1]

export const transitionSoft: Transition = {
  duration: 0.72,
  ease: easeSoft,
}

export const transitionSite: Transition = {
  duration: 0.48,
  ease: easeSite,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionSoft,
  },
}

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: easeSite } },
  exit: { opacity: 0, transition: { duration: 0.28, ease: easeSite } },
}

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionSite },
  exit: { opacity: 0, transition: { duration: 0.28, ease: easeSite } },
}

export const panelSlideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitionSoft },
  exit: { opacity: 0, y: 16, transition: { duration: 0.32, ease: easeSite } },
}

export const drawerSlideRight: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: transitionSoft },
  exit: { x: '100%', transition: { duration: 0.38, ease: easeSite } },
}

export const dropdownPanel: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transitionSite },
  exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.22, ease: easeSite } },
}

export const catalogPanel: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transitionSoft },
  exit: { opacity: 0, y: 8, transition: { duration: 0.28, ease: easeSite } },
}

/** Ürün kartı — hafif hover */
export const cardHover = {
  rest: { y: 0 },
  hover: { y: -3, transition: { duration: 0.4, ease: easeSite } },
}
