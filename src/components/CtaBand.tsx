import { business } from '../data/site'
import { Button } from './Button'
import { Mask, Reveal } from './Reveal'

/** closing call to action shared by the inner pages */
export function CtaBand({
  eyebrow = 'Ready when you are',
  line1,
  line2,
  text,
}: {
  eyebrow?: string
  line1: string
  line2: string
  text?: string
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(227,195,112,0.16),transparent_62%)]"
      />
      <div className="wrap relative text-center">
        <p className="label-caps text-[0.72rem] text-gold-300">{eyebrow}</p>
        <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(2.8rem,8.4vw,7.5rem)] leading-[0.96] tracking-[-0.02em]">
          <Mask>{line1}</Mask>
          <Mask delay={0.1}>
            <em className="text-gold-gradient pr-[0.1em]">{line2}</em>
          </Mask>
        </h2>
        {text && (
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-md leading-relaxed text-mute">{text}</p>
          </Reveal>
        )}
        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button to="/book" size="lg">
              Book now
            </Button>
            <Button href={business.phoneHref} variant="ghost" size="lg" arrow={false}>
              {business.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
