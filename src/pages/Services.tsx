import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { business, faqs, pricing, services, type Service } from '../data/site'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { Eyebrow, Mask, ParallaxImage, Reveal } from '../components/Reveal'
import { cn } from '../lib/cn'
import { ease, fadeUp, stagger } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

export default function Services() {
  usePageMeta(
    'Services | Steeler Limousine, Pittsburgh',
    'Luxury transportation, corporate travel, airport transfers, event transportation and special occasions in Pittsburgh. Hourly, point-to-point and flat-rate pricing.',
  )
  return (
    <>
      <ServicesHero />
      <SideNav />
      {services.map((s, i) => (
        <ServiceSection key={s.id} s={s} flip={i % 2 === 1} />
      ))}
      <Pricing />
      <Faq />
      <CtaBand line1="Tell us where." line2="We’ll handle the rest." text="Book online in a minute, or call and talk it through with us directly." />
    </>
  )
}

/* ------------------------------------------------------------------ hero */

function ServicesHero() {
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <section className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(227,195,112,0.13),transparent_65%)]"
      />
      <div className="wrap relative grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-7 text-[clamp(3rem,8.2vw,7.4rem)] leading-[0.94] tracking-[-0.02em]">
            <Mask delay={0.1}>Every ride,</Mask>
            <Mask delay={0.22}>
              done <em className="text-gold-gradient sheen pr-[0.12em]">properly.</em>
            </Mask>
          </h1>
        </div>
        <div className="lg:col-span-4">
          <Reveal delay={0.4}>
            <p className="leading-relaxed text-mute md:text-lg">
              Five kinds of ride, one way of doing it: a clean car, a professional driver, and a plan that fits your day.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="wrap relative mt-14 md:mt-20">
        <motion.ul
          variants={stagger(0.07, 0.5)}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2.5 border-t border-white/12 pt-8"
        >
          {services.map((s) => (
            <motion.li key={s.id} variants={fadeUp}>
              <button
                onClick={() => jump(s.id)}
                className="label-caps group flex items-center gap-3 rounded-full border border-white/18 px-5 py-3 text-[0.66rem] tracking-[0.2em] text-ivory/85 transition-colors duration-300 hover:border-gold-300 hover:text-gold-200"
              >
                <span className="text-gold-300/70">{s.n}</span>
                {s.title}
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------- side progress dots */

function SideNav() {
  const [active, setActive] = useState<string | null>(null)
  const seen = useRef<string[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          seen.current = seen.current.filter((id) => id !== e.target.id)
          if (e.isIntersecting) seen.current.push(e.target.id)
        }
        setActive(seen.current[seen.current.length - 1] ?? null)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    services.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <motion.nav
      aria-label="Services"
      animate={{ opacity: active ? 1 : 0, x: active ? 0 : 12 }}
      transition={{ duration: 0.5, ease }}
      className={cn('fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-5 xl:flex', !active && 'pointer-events-none')}
    >
      {services.map((s) => {
        const on = active === s.id
        return (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            aria-label={s.title}
            aria-current={on}
            className="group flex items-center gap-3"
          >
            {/* label only on hover, in a small pill, so it never sits on top of the page content */}
            <span
              className={cn(
                'label-caps translate-x-2 rounded-full bg-ink/90 px-3 py-1.5 text-[0.58rem] tracking-[0.22em] opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
                on ? 'text-gold-200' : 'text-ivory/70',
              )}
            >
              {s.title}
            </span>
            <span
              className={cn(
                'block rotate-45 transition-all duration-500',
                on ? 'size-2.5 bg-gold-300' : 'size-1.5 bg-white/35 group-hover:bg-gold-300/70',
              )}
            />
          </button>
        )
      })}
    </motion.nav>
  )
}

/* -------------------------------------------------------------- sections */

function ServiceSection({ s, flip }: { s: Service; flip: boolean }) {
  return (
    <section id={s.id} className="relative scroll-mt-20 py-14 md:py-24">
      <div className="wrap grid items-center gap-10 lg:grid-cols-12 lg:gap-0">
        <div className={cn('lg:col-span-6', flip ? 'lg:col-start-7 lg:row-start-1' : 'lg:col-start-1')}>
          <ParallaxImage
            src={s.image}
            alt={s.alt}
            position={s.position}
            className="aspect-[5/4] lg:aspect-[4/5]"
          />
        </div>

        <div className={cn('lg:col-span-5', flip ? 'lg:col-start-1 lg:row-start-1 lg:pr-8' : 'lg:col-start-8')}>
          <Reveal>
            <span className="font-display text-7xl italic leading-none text-gold-gradient md:text-8xl">{s.n}</span>
          </Reveal>
          <h2 className="mt-5 text-[clamp(2.2rem,4.6vw,3.9rem)] leading-[1.04] tracking-[-0.015em]">
            <Mask>{s.title}</Mask>
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-mute md:text-[1.05rem]">{s.body}</p>
          </Reveal>

          <motion.ul
            variants={stagger(0.08, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-8 space-y-3.5 border-t border-white/12 pt-8"
          >
            {s.points.map((p) => (
              <motion.li key={p} variants={fadeUp} className="flex items-start gap-4 text-ivory/90">
                <span aria-hidden className="mt-[0.6rem] size-1.5 shrink-0 rotate-45 bg-gold-300" />
                {p}
              </motion.li>
            ))}
          </motion.ul>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button to={`/book?service=${s.id}`}>Book this ride</Button>
              <a
                href={business.phoneHref}
                className="label-caps text-[0.7rem] text-ivory/70 underline decoration-gold-300/50 underline-offset-8 transition-colors hover:text-gold-200"
              >
                Or call us
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- pricing */

function Pricing() {
  const [tab, setTab] = useState(pricing[0].id)
  const current = pricing.find((p) => p.id === tab) ?? pricing[0]

  return (
    <section className="bg-cream py-28 text-ink md:py-40">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Eyebrow tone="light">Pricing</Eyebrow>
          <h2 className="mt-6 text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.02] tracking-[-0.015em]">
            <Mask>Pricing,</Mask>
            <Mask delay={0.1}>
              <em className="text-gold-700 pr-[0.1em]">plainly.</em>
            </Mask>
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-sm leading-relaxed text-mute-dark">
              Three ways to book a ride, none of them complicated. Pick the one that fits your day and ask for a quote.
            </p>
            <p className="mt-6 max-w-sm border-l-2 border-gold-500 pl-4 text-sm leading-relaxed text-mute-dark">
              Special events are booked in 4-hour blocks.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div role="tablist" aria-label="Pricing options" className="flex w-fit max-w-full flex-wrap gap-1 rounded-full border border-ink/15 p-1.5">
            {pricing.map((p) => (
              <button
                key={p.id}
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={tab === p.id}
                aria-controls={`panel-${p.id}`}
                onClick={() => setTab(p.id)}
                className="label-caps relative z-10 px-5 py-3 text-[0.66rem] tracking-[0.2em] sm:px-6"
              >
                {tab === p.id && (
                  <motion.span
                    layoutId="pricing-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className={cn('transition-colors duration-300', tab === p.id ? 'text-ivory' : 'text-ink')}>{p.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 min-h-[19rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                role="tabpanel"
                id={`panel-${current.id}`}
                aria-labelledby={`tab-${current.id}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease }}
              >
                <h3 className="text-4xl leading-tight md:text-6xl">{current.title}</h3>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute-dark">{current.body}</p>
                <p className="label-caps mt-9 text-[0.66rem] text-gold-700">Good for</p>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {current.fits.map((f) => (
                    <li key={f} className="rounded-full border border-ink/20 px-4 py-2 text-sm">
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Button to="/book" variant="dark">
                    Get a quote
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- faq */

function Faq() {
  return (
    <section className="bg-ink py-28 md:py-40">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.04] tracking-[-0.015em]">
            <Mask>Good to</Mask>
            <Mask delay={0.1}>
              <em className="text-gold-gradient pr-[0.1em]">know.</em>
            </Mask>
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xs leading-relaxed text-mute">
              Something we missed? Call <a href={business.phoneHref} className="text-gold-200 underline underline-offset-4">{business.phone}</a> and ask us directly.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  )
}
