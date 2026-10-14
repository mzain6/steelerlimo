import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { vehicles, type VehicleId } from '../data/site'
import { Button } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { Eyebrow, Mask, ParallaxImage, Reveal } from '../components/Reveal'
import { cn } from '../lib/cn'
import { ease, fadeUp, stagger } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'

const inside = [
  { title: 'Leather seating', body: 'Room to settle in, whether it is a 20-minute hop or a long haul across the state.' },
  { title: 'Space for your luggage', body: 'Bags ride with you, not in a second car. The XL adds extra cargo room behind the third row.' },
  { title: 'Spotless and well maintained', body: 'Cleaned and checked so the car feels the way you expect a car like this to feel.' },
  { title: 'A professional driver', body: 'Experienced behind the wheel, easy to talk to when you want to, quiet when you do not.' },
]

export default function Fleet() {
  usePageMeta(
    'Fleet | Steeler Limousine, Pittsburgh',
    'Mid-size and XL luxury SUVs seating up to seven, with leather interiors and room for luggage. Chauffeured by professional drivers in Pittsburgh.',
  )
  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-40 md:pb-20 md:pt-52">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(227,195,112,0.12),transparent_65%)]"
        />
        <div className="wrap relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow>The fleet</Eyebrow>
            <h1 className="mt-7 text-[clamp(3.2rem,10vw,8.6rem)] leading-[0.94] tracking-[-0.025em]">
              <Mask delay={0.1}>Built around</Mask>
              <Mask delay={0.22}>
                the <em className="text-gold-gradient sheen pr-[0.12em]">back seat.</em>
              </Mask>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.4}>
              <p className="leading-relaxed text-mute md:text-lg">
                Two classes of luxury SUV. Both seat up to seven, both are leather-lined, and both are kept to the standard you would expect of a car you are hiring.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Explorer />
      <Inside />

      <CtaBand
        line1="Travelling with"
        line2="more than seven?"
        text="Call us and we will build the right plan, with the right vehicles, for your group."
      />
    </>
  )
}

/* -------------------------------------------------------------- explorer */

function Explorer() {
  const [id, setId] = useState<VehicleId>('mid-suv')
  const v = vehicles.find((x) => x.id === id) ?? vehicles[0]

  return (
    <section className="relative pb-28 md:pb-40">
      <div className="wrap">
        <div role="tablist" aria-label="Choose a vehicle" className="flex gap-8 border-b border-white/12 md:gap-14">
          {vehicles.map((x) => (
            <button
              key={x.id}
              role="tab"
              id={`veh-tab-${x.id}`}
              aria-selected={id === x.id}
              aria-controls={`veh-panel-${x.id}`}
              onClick={() => setId(x.id)}
              className={cn(
                'relative pb-5 font-display text-[1.7rem] leading-none transition-colors duration-300 md:text-5xl',
                id === x.id ? 'text-ivory' : 'text-ivory/40 hover:text-ivory/70',
              )}
            >
              {x.name}
              {id === x.id && (
                <motion.span
                  layoutId="fleet-underline"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-gold-gradient"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`veh-panel-${v.id}`} aria-labelledby={`veh-tab-${v.id}`} className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-graphite">
              <AnimatePresence initial={false}>
                <motion.img
                  key={v.id}
                  src={v.image}
                  alt={v.alt}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease }}
                  style={{ objectPosition: v.position }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <p className="label-caps absolute bottom-4 left-5 text-[0.6rem] tracking-[0.3em] text-ivory/70">Representative vehicle</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={v.id}
                variants={stagger(0.07)}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              >
                <motion.p variants={fadeUp} className="label-caps text-[0.7rem] text-gold-300">
                  {v.tagline}
                </motion.p>
                <motion.h2 variants={fadeUp} className="mt-4 text-5xl leading-[1.02] md:text-6xl">
                  {v.name}
                </motion.h2>
                <motion.p variants={fadeUp} className="mt-6 leading-relaxed text-mute md:text-lg">
                  {v.blurb}
                </motion.p>

                <motion.dl variants={fadeUp} className="mt-9 grid grid-cols-3 gap-4 border-y border-white/12 py-6">
                  {v.facts.map((f) => (
                    <div key={f.label}>
                      <dt className="label-caps text-[0.58rem] tracking-[0.26em] text-gold-300/80">{f.label}</dt>
                      <dd className="mt-2 text-[0.95rem] leading-snug text-ivory/90">{f.value}</dd>
                    </div>
                  ))}
                </motion.dl>

                <motion.div variants={fadeUp} className="mt-8">
                  <p className="label-caps text-[0.62rem] text-mute">Best for</p>
                  <ul className="mt-4 space-y-2.5">
                    {v.best.map((b) => (
                      <li key={b} className="flex items-center gap-3.5 text-ivory/90">
                        <Check className="size-4 text-gold-300" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-10">
                  <Button to={`/book?vehicle=${v.id}`}>Book this vehicle</Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- inside */

function Inside() {
  return (
    <section className="bg-cream py-28 text-ink md:py-40">
      <div className="wrap grid items-start gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          {/* stays in view beside the list so the left side is never an empty gap */}
          <div className="lg:sticky lg:top-28">
            <ParallaxImage
              src="/images/corporate.webp"
              alt="A passenger working on a laptop in the leather back seat"
              position="38% 45%"
              className="aspect-[4/5] max-h-[calc(100svh-9rem)] w-full"
            />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Eyebrow tone="light">Inside every vehicle</Eyebrow>
          <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.04] tracking-[-0.015em]">
            <Mask>The same standard,</Mask>
            <Mask delay={0.1}>
              <em className="text-gold-700 pr-[0.1em]">whichever you choose.</em>
            </Mask>
          </h2>
          <div className="mt-12">
            {inside.map((r) => (
              <Reveal key={r.title}>
                <div className="relative py-7">
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px origin-left bg-ink/20"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease }}
                  />
                  <h3 className="text-2xl md:text-3xl">{r.title}</h3>
                  <p className="mt-2.5 max-w-md leading-relaxed text-mute-dark">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
