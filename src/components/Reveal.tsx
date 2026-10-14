import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'

/** fade + rise when scrolled into view */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** one line of a headline sliding up out of a mask */
export function Mask({
  children,
  className,
  delay = 0,
  active,
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** when set, the line is driven by this flag (e.g. "loader finished") instead of scroll position */
  active?: boolean
}) {
  // The in-view trigger lives on the OUTER (unclipped) span. Observing the inner span would never fire:
  // it starts translated out of its own overflow mask, so the browser reports it as 0% visible.
  const trigger =
    active === undefined
      ? { whileInView: 'show', viewport: { once: true, amount: 0.5 } }
      : { animate: active ? 'show' : 'hidden' }
  return (
    <motion.span className={cn('block overflow-hidden pb-[0.14em] -mb-[0.14em]', className)} initial="hidden" {...trigger}>
      <motion.span
        className="block"
        variants={{
          hidden: { y: '108%' },
          show: { y: 0, transition: { duration: 1.05, ease, delay } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

export function Eyebrow({ children, className, tone = 'dark' }: { children: ReactNode; className?: string; tone?: 'dark' | 'light' }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={cn(
        'label-caps flex items-center gap-4 text-[0.7rem] sm:text-[0.74rem]',
        tone === 'dark' ? 'text-gold-300' : 'text-gold-700',
        className,
      )}
    >
      <motion.span
        aria-hidden
        className={cn('h-px w-10 origin-left sm:w-14', tone === 'dark' ? 'bg-gold-300/70' : 'bg-gold-700/70')}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease }}
      />
      {children}
    </motion.p>
  )
}

/** image that wipes open on entry and drifts slower than the page while you scroll */
export function ParallaxImage({
  src,
  alt,
  className,
  amount = 8,
  reveal = true,
  position,
  priority,
}: {
  src: string
  alt: string
  className?: string
  amount?: number
  reveal?: boolean
  position?: string
  priority?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`])

  // Outer box is the (unclipped) in-view trigger; the clip-path wipe runs on an inner layer via variants.
  // A target that carries its own clip-path reports 0% visible, which would keep it hidden forever.
  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      initial={reveal ? 'hidden' : false}
      whileInView={reveal ? 'show' : undefined}
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden bg-graphite"
        variants={{
          hidden: { clipPath: 'inset(0 0 100% 0)' },
          show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.2, ease } },
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{ y, objectPosition: position }}
          className="absolute -top-[10%] left-0 h-[120%] w-full object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

function Word({ word, gold, progress, range }: { word: string; gold: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className={cn('mr-[0.26em] inline-block', gold && 'text-gold-gradient italic')}>
      {word}
    </motion.span>
  )
}

/** a statement whose words light up one by one as you scroll through it. {{double braces}} turn gold. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  // finishes lighting when the paragraph's bottom reaches 72% down the screen (was 50%), so even on shorter
  // laptop screens the whole sentence is fully on screen, mid-screen, at the moment every word is lit
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.72'] })

  const words = text
    .split(/(\{\{.*?\}\})/)
    .filter(Boolean)
    .flatMap((chunk) => {
      const gold = chunk.startsWith('{{')
      const clean = gold ? chunk.slice(2, -2) : chunk
      return clean
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ w, gold }))
    })

  return (
    <p ref={ref} className={className}>
      {words.map(({ w, gold }, i) => (
        <Word key={i} word={w} gold={gold} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2.5) / words.length)]} />
      ))}
    </p>
  )
}
