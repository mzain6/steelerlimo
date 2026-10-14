import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { areas, business, reasons, services, vehicles, type Service } from '../data/site'
import { Button } from '../components/Button'
import { useIntroReady } from '../components/Intro'
import { Eyebrow, Mask, ParallaxImage, Reveal, ScrollWords } from '../components/Reveal'
import { ease, fadeUp, stagger } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

export default function Home() {
  usePageMeta(
    'Steeler Limousine | Luxury Chauffeured Rides in Pittsburgh, PA',
    `Luxury SUV and limousine service in Pittsburgh. Airport transfers, corporate travel, weddings and special occasions with professional drivers. Book online or call ${business.phone}.`,
  )
  return (
    <>
      <Hero />
      <Statement />
      <ServicesIndex />
      <FleetTeaser />
      <WhyUs />
      <BridgeBand />
      <FinalCta />
    </>
  )
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  const ready = useIntroReady()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, ease, delay },
  })

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pt-36">
      <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10">
        <motion.img
          src="/images/hero-skyline.webp"
          alt="Pittsburgh skyline and rivers at dusk"
          className="h-full w-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: ready ? 1.03 : 1.2 }}
          transition={{ duration: 3, ease }}
          fetchPriority="high"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-ink)_3%,rgba(10,10,11,0.62)_40%,rgba(10,10,11,0.4)_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_72%,rgba(10,10,11,0.75),transparent_62%)]" />
      {/* extra shade on phones, where the headline sits over the brightest part of the skyline */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/35 md:hidden" />
      {/* letterhead frame; starts below the fixed header so the two never cross */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-3 bottom-3 top-[5.5rem] -z-10 border border-gold-300/20 md:inset-x-6 md:bottom-6 md:top-[6.25rem]"
      />

      <div className="wrap pb-8 md:pb-12">
        {/* the whole hero text group drifts up and fades as you scroll past */}
        <motion.div style={{ y: textY, opacity: fade }}>
        <motion.p {...rise(0.25)} className="label-caps flex items-center gap-4 text-[0.68rem] text-gold-300 sm:text-[0.74rem]">
          <span aria-hidden className="h-px w-10 bg-gold-300/70 sm:w-14" />
          Pittsburgh, PA · Luxury SUV &amp; limousine service
        </motion.p>

        <h1 className="mt-7 font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.92] tracking-[-0.012em] [word-spacing:0.1em]">
          <Mask active={ready} delay={0.3}>
            Arrive in
          </Mask>
          <Mask active={ready} delay={0.45}>
            <span className="text-gold-gradient sheen pr-[0.14em] italic">black &amp; gold.</span>
          </Mask>
        </h1>

        <div className="mt-9 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <motion.p {...rise(0.75)} className="max-w-xl text-[1.05rem] leading-relaxed text-ivory/80 md:text-lg">
            Airport runs, boardroom mornings, wedding days and nights out. Professional drivers and spotless SUVs, at your door when you need them.
          </motion.p>
          <motion.div {...rise(0.9)} className="flex flex-wrap items-center gap-4">
            <Button to="/book" size="lg">
              Book now
            </Button>
            <Button href={business.phoneHref} variant="ghost" size="lg" arrow={false}>
              {business.phone}
            </Button>
          </motion.div>
        </div>

        <motion.ul {...rise(1.1)} className="label-caps mt-10 hidden flex-wrap gap-x-10 gap-y-2 text-[0.64rem] tracking-[0.26em] text-ivory/55 md:mt-14 md:flex">
          {['Terminal meet & greet at PIT', 'Hourly · point-to-point · flat-rate packages', 'Call us any time'].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span aria-hidden className="size-1 rotate-45 bg-gold-300" />
              {t}
            </li>
          ))}
        </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- statement */

function Statement() {
  return (
    <section className="relative bg-ink py-28 md:py-44">
      <div className="wrap">
        <Eyebrow>The Steeler standard</Eyebrow>
        <ScrollWords
          className="mt-10 max-w-5xl font-display text-[clamp(2rem,5.2vw,4.5rem)] leading-[1.14] tracking-[-0.01em]"
          text="Pittsburgh runs on {{black and gold.}} So do we. Spacious SUVs, drivers who know the city, and a schedule we treat like our own, whether it’s a 5 a.m. terminal pickup or a late ride home."
        />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- services */

function ServicesIndex() {
  const [active, setActive] = useState<Service | null>(null)
  const my = useMotionValue(0)
  const sy = useSpring(my, { stiffness: 170, damping: 24, mass: 0.6 })

  useEffect(() => {
    const move = (e: MouseEvent) => my.set(e.clientY)
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [my])

  return (
    <section className="relative bg-coal py-28 md:py-40">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-6 text-[clamp(2.5rem,6vw,5.4rem)] leading-[1.02] tracking-[-0.015em]">
              <Mask>Rides for every</Mask>
              <Mask delay={0.1}>
                kind of <em className="text-gold-gradient pr-[0.1em]">day.</em>
              </Mask>
            </h2>
          </div>
          <Reveal>
            <Button to="/services" variant="ghost">
              All services
            </Button>
          </Reveal>
        </div>

        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 md:mt-24"
        >
          {services.map((s) => (
            <motion.li key={s.id} variants={fadeUp} className="border-b border-white/12 first:border-t">
              <Link
                to={`/services#${s.id}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(s)}
                onPointerLeave={() => setActive(null)}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 py-7 md:gap-x-10 md:py-11"
              >
                <span className="label-caps self-start pt-3 text-[0.7rem] text-gold-300/80 md:pt-5">{s.n}</span>
                <span>
                  <span className="block font-display text-[clamp(1.85rem,4.6vw,4rem)] leading-[1.06] transition-all duration-500 group-hover:translate-x-3 group-hover:text-gold-200">
                    {s.title}
                  </span>
                  <span className="mt-2.5 block max-w-xl text-[0.95rem] leading-relaxed text-mute md:text-base">{s.short}</span>
                </span>
                <span className="grid size-12 place-items-center rounded-full border border-white/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold-300 group-hover:bg-gold-300 group-hover:text-ink md:size-16">
                  <ArrowUpRight className="size-5" aria-hidden />
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* photo that slides alongside the row you're pointing at (mouse only) */}
      <div aria-hidden className="pointer-events-none fixed right-[5vw] top-0 z-30 hidden lg:block">
        <motion.div style={{ y: sy }}>
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.86, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease }}
                className="-mt-[12rem] h-[24rem] w-[19rem] overflow-hidden border border-gold-300/30 bg-graphite shadow-2xl shadow-black/60"
              >
                <img src={active.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: active.position }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------- fleet */

function FleetTeaser() {
  return (
    <section className="bg-cream py-28 text-ink md:py-40">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow tone="light">The fleet</Eyebrow>
            <h2 className="mt-6 text-[clamp(2.5rem,6vw,5.4rem)] leading-[1.02] tracking-[-0.015em]">
              <Mask>Two SUV classes.</Mask>
              <Mask delay={0.1}>
                <em className="text-gold-700 pr-[0.1em]">One standard.</em>
              </Mask>
            </h2>
          </div>
          <Reveal>
            <p className="max-w-sm leading-relaxed text-mute-dark">
              Spacious, leather-lined and meticulously maintained. Each class seats up to seven guests.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-10">
          {vehicles.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.12} className={i === 1 ? 'md:mt-24' : ''}>
              <Link to="/fleet" className="group block">
                <ParallaxImage
                  src={v.image}
                  alt={v.alt}
                  position={v.position}
                  amount={6}
                  className="aspect-[4/3] [&_img]:transition-transform [&_img]:duration-[1400ms] group-hover:[&_img]:scale-105"
                />
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl">{v.name}</h3>
                    <p className="label-caps mt-2 text-[0.68rem] text-gold-700">{v.tagline}</p>
                    <p className="mt-4 max-w-md leading-relaxed text-mute-dark">{v.blurb}</p>
                  </div>
                  <span className="mt-1 grid size-12 shrink-0 place-items-center rounded-full border border-ink/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- why us */

function WhyUs() {
  return (
    <section className="relative bg-ink py-28 md:py-40">
      <div className="wrap grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <Eyebrow>Why Steeler</Eyebrow>
            <h2 className="mt-6 text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.02] tracking-[-0.015em]">
              <Mask>What you can</Mask>
              <Mask delay={0.1}>
                <em className="text-gold-gradient pr-[0.1em]">count on.</em>
              </Mask>
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-sm leading-relaxed text-mute">
                A limo ride should be the easy part of your day. Here is how we keep it that way.
              </p>
              <div className="mt-10">
                <Button to="/about" variant="ghost">
                  About us
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {reasons.map((r, i) => (
            <Reveal key={r.title}>
              <div className="relative grid grid-cols-[auto_1fr] gap-x-7 py-9 md:py-12">
                <motion.span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left bg-gold-300/50"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, ease }}
                />
                <span className="font-display text-5xl italic leading-none text-gold-gradient md:text-6xl">0{i + 1}</span>
                <div>
                  <h3 className="text-2xl md:text-[2rem]">{r.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-mute">{r.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- bridges */

function BridgeBand() {
  return (
    <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden py-28">
      <div className="absolute inset-0 -z-10">
        <ParallaxImage src="/images/bridge.webp" alt="A golden Pittsburgh bridge with the downtown skyline behind it" reveal={false} amount={9} position="50% 55%" className="h-full" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/50 to-ink/5" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-transparent to-ink/50" />

      <div className="wrap">
        <Eyebrow>Around Pittsburgh</Eyebrow>
        <h2 className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,6.4rem)] leading-[1] tracking-[-0.02em]">
          <Mask>A city of bridges.</Mask>
          <Mask delay={0.1}>
            <em className="text-gold-gradient pr-[0.1em]">We know which one to take.</em>
          </Mask>
        </h2>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-lg leading-relaxed text-ivory/75">
            Point-to-point trips across town or across the state, from the terminal at PIT to a table downtown.
          </p>
        </Reveal>
        <motion.ul
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 flex max-w-3xl flex-wrap gap-2.5"
        >
          {areas.map((a) => (
            <motion.li
              key={a}
              variants={fadeUp}
              className="label-caps rounded-full border border-white/20 bg-ink/40 px-4 py-2.5 text-[0.64rem] tracking-[0.2em] text-ivory/85 backdrop-blur-sm"
            >
              {a}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------- CTA */

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gold-gradient py-28 text-ink md:py-44">
      <div
        aria-hidden
        className="absolute -right-16 top-1/2 hidden h-[130%] w-[34rem] -translate-y-1/2 bg-ink/10 md:block"
        style={{
          WebkitMaskImage: 'url(/images/crest.png)',
          maskImage: 'url(/images/crest.png)',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      <div className="wrap relative">
        <p className="label-caps text-[0.72rem] text-ink/70">Ready when you are</p>
        <h2 className="mt-6 text-[clamp(3.2rem,10.5vw,9.5rem)] leading-[0.92] tracking-[-0.025em]">
          <Mask>Your car is</Mask>
          <Mask delay={0.1}>
            <em className="pr-[0.1em]">waiting.</em>
          </Mask>
        </h2>
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button to="/book" variant="dark" size="lg">
              Book now
            </Button>
            <Button href={business.phoneHref} variant="ghost-dark" size="lg" arrow={false}>
              Call {business.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
