import { createContext, useContext, useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { ease } from '../lib/motion'

/** true once the opening loader has finished; the hero waits on this to start its entrance */
const IntroContext = createContext(true)
export const IntroProvider = IntroContext.Provider
export const useIntroReady = () => useContext(IntroContext)

const HERO_IMAGE = '/images/hero-skyline.webp'
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Opening loading screen. Plays on every fresh visit (not on in-site navigation).
 * It really waits for the hero photo, with a minimum run time so it never just flashes.
 */
export function Preloader({ onReveal }: { onReveal: () => void }) {
  const [show, setShow] = useState(true)
  const progress = useMotionValue(0)
  const count = useTransform(progress, (v) => String(Math.round(v)).padStart(3, '0'))
  const bar = useTransform(progress, [0, 100], [0, 1])

  useEffect(() => {
    const minMs = prefersReduced() ? 700 : 2200
    let cancelled = false
    document.documentElement.style.overflow = 'hidden'

    const crawl = animate(progress, 92, { duration: (minMs - 400) / 1000, ease: [0.4, 0, 0.2, 1] })

    const imageReady = new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = img.onerror = () => resolve()
      img.src = HERO_IMAGE
      window.setTimeout(resolve, 6000) // never hold the visitor hostage to a slow connection
    })
    const minTime = new Promise<void>((resolve) => window.setTimeout(resolve, minMs - 400))

    Promise.all([imageReady, minTime]).then(async () => {
      if (cancelled) return
      crawl.stop()
      await animate(progress, 100, { duration: 0.4, ease: 'easeOut' })
      if (cancelled) return
      await new Promise((r) => window.setTimeout(r, 150))
      if (cancelled) return
      document.documentElement.style.overflow = ''
      setShow(false)
      onReveal()
    })

    return () => {
      cancelled = true
      crawl.stop()
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="preloader" className="fixed inset-0 z-[100]" role="status" aria-live="polite" aria-label="Loading Steeler Limousine">
          {/* two shutters that part to reveal the page */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            exit={{ y: '-100%' }}
            transition={{ duration: 1, ease, delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            exit={{ y: '100%' }}
            transition={{ duration: 1, ease, delay: 0.2 }}
          />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.5, ease }}
          >
            <motion.div
              className="relative aspect-[900/765] w-[min(64vw,17rem)] sm:w-[19rem]"
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.3, ease, delay: 0.15 }}
            >
              <img src="/images/logo.png" alt="Steeler Limousine" width={900} height={765} className="absolute inset-0 h-full w-full object-contain" />
              {/* a glint that travels across the crest only (masked to the logo's own shape) */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: 'url(/images/logo.png)',
                  maskImage: 'url(/images/logo.png)',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  backgroundImage: 'linear-gradient(105deg, transparent 38%, rgba(255,250,225,0.95) 50%, transparent 62%)',
                  backgroundSize: '260% 100%',
                  backgroundRepeat: 'no-repeat',
                }}
                initial={{ backgroundPosition: '140% 0' }}
                animate={{ backgroundPosition: '-40% 0' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.7, repeat: Infinity, repeatDelay: 0.5 }}
              />
            </motion.div>

            <motion.p
              className="label-caps mt-9 text-[0.62rem] tracking-[0.42em] text-gold-300/80 sm:text-[0.68rem]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.7 }}
            >
              Pittsburgh · Chauffeured Rides
            </motion.p>

            <div className="mt-8 w-[min(64vw,17rem)] sm:w-[19rem]">
              <div className="mb-3 flex items-end justify-between font-label text-[0.7rem] tracking-[0.3em] text-ivory/60">
                <span>LOADING</span>
                <motion.span className="tabular-nums">{count}</motion.span>
              </div>
              <div className="h-px w-full bg-white/12">
                <motion.div className="h-full origin-left bg-gold-gradient" style={{ scaleX: bar }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
