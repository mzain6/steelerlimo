import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { business } from '../data/site'
import { Button } from './Button'
import { useIntroReady } from './Intro'
import { ease } from '../lib/motion'

/** sticky call / book bar for phones, where most limo bookings start */
export function MobileBar() {
  const { pathname } = useLocation()
  const ready = useIntroReady()
  if (pathname === '/book') return null

  return (
    <motion.div
      initial={{ y: '120%' }}
      animate={{ y: ready ? 0 : '120%' }}
      transition={{ duration: 0.8, ease, delay: 0.4 }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <a
          href={business.phoneHref}
          aria-label={`Call ${business.phone}`}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-gold-300/50 text-gold-200"
        >
          <Phone className="size-5" aria-hidden />
        </a>
        <Button to="/book" className="flex-1 [&>span]:w-full" size="md">
          Book now
        </Button>
      </div>
    </motion.div>
  )
}
