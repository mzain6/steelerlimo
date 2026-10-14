import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ease } from '../lib/motion'

const curtain: Variants = {
  initial: { scaleY: 1, originY: 0 },
  animate: { scaleY: 0, originY: 0, transition: { duration: 0.8, ease, delay: 0.1 } },
  exit: { scaleY: 1, originY: 1, transition: { duration: 0.55, ease } },
}

const crest: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 0, transition: { duration: 0.25 } },
  exit: { opacity: 1, transition: { duration: 0.3, delay: 0.2 } },
}

/** wraps every route: a black curtain with the crest sweeps over the old page and lifts off the new one */
export function Page({ children }: { children: ReactNode }) {
  const { hash } = useLocation()
  const first = useRef(true)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!hash) return
    const t = window.setTimeout(
      () => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      first.current ? 1000 : 0,
    )
    first.current = false
    return () => window.clearTimeout(t)
  }, [hash])

  return (
    <motion.div initial="initial" animate="animate" exit="exit">
      <motion.div
        aria-hidden
        variants={curtain}
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-coal"
      >
        <motion.img variants={crest} src="/images/crest.png" alt="" width={231} height={320} className="h-28 w-auto" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gold-300/60" />
      </motion.div>
      <main id="main">{children}</main>
    </motion.div>
  )
}
