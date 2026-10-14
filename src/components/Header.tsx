import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Phone } from 'lucide-react'
import { business, nav } from '../data/site'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'
import { Button } from './Button'
import { Logo } from './Logo'

export function Header() {
  const { scrollY } = useScroll()
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 40)
    setHidden(y > prev && y > 180)
  })

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-110%' : 0 }}
        transition={{ duration: 0.5, ease }}
        className={cn(
          'fixed inset-x-0 top-0 z-[61] transition-[background-color,backdrop-filter,border-color] duration-500',
          solid && !open ? 'border-b border-white/8 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent',
        )}
      >
        <div className="wrap flex h-[4.75rem] items-center justify-between gap-6 md:h-[5.25rem]">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'label-caps relative py-2 text-[0.74rem] transition-colors duration-300 hover:text-gold-200',
                    isActive ? 'text-gold-200' : 'text-ivory/80',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-gold-300"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={business.phoneHref}
              className="label-caps hidden items-center gap-2.5 text-[0.74rem] text-ivory/80 transition-colors hover:text-gold-200 xl:flex"
            >
              <Phone className="size-3.5 text-gold-300" aria-hidden />
              {business.phone}
            </a>
            <div className="hidden sm:block">
              <Button to="/book" size="sm">
                Book now
              </Button>
            </div>

            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="relative grid size-11 place-items-center rounded-full border border-white/20 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <motion.span
                  className="absolute left-0 top-0 h-px w-full bg-ivory"
                  animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-px w-full bg-ivory"
                  animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease }}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.6rem) 2.6rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.6rem) 2.6rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.6rem) 2.6rem)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink pt-28 lg:hidden"
          >
            <nav aria-label="Mobile" className="wrap flex flex-1 flex-col justify-center gap-1">
              {[...nav, { to: '/book', label: 'Book now' }].map((item, i) => (
                <div key={item.to} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.07 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-baseline gap-4 py-2 font-display text-[2.6rem] leading-[1.1] sm:text-6xl',
                          isActive ? 'text-gold-gradient italic' : 'text-ivory',
                        )
                      }
                    >
                      <span className="label-caps text-[0.65rem] text-gold-300/70 not-italic">0{i + 1}</span>
                      {item.label}
                    </NavLink>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="wrap border-t border-white/10 py-7 text-sm text-mute"
            >
              <a href={business.phoneHref} className="label-caps text-[0.8rem] text-gold-200">
                {business.phone}
              </a>
              <p className="mt-2">{business.email}</p>
              <p className="mt-1">
                {business.street}, {business.cityLine}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
