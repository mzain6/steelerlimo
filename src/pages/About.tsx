import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { business, principles } from '../data/site'
import { Button } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { Eyebrow, Mask, ParallaxImage, Reveal, ScrollWords } from '../components/Reveal'
import { SuccessCheck } from '../components/SuccessCheck'
import { ease } from '../lib/motion'
import { submitRequest, type SubmitResult } from '../lib/submit'
import { usePageMeta } from '../lib/usePageMeta'

export default function About() {
  usePageMeta(
    'About & Contact | Steeler Limousine, Oakdale PA',
    `Steeler Limousine LLC is a luxury transportation company based in Oakdale, PA. Call ${business.phone} or send us a message.`,
  )
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-40 md:pb-32 md:pt-52">
        <div className="wrap grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow>About us</Eyebrow>
            <h1 className="mt-7 text-[clamp(3.2rem,9.5vw,8.2rem)] leading-[0.94] tracking-[-0.025em]">
              <Mask delay={0.1}>From Oakdale,</Mask>
              <Mask delay={0.22}>
                to <em className="text-gold-gradient sheen pr-[0.12em]">wherever.</em>
              </Mask>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <ParallaxImage
              src="/images/bridge.webp"
              alt="A golden Pittsburgh bridge with the downtown skyline behind it"
              position="50% 55%"
              className="aspect-[5/4]"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-coal py-28 md:py-40">
        <div className="wrap">
          <Eyebrow>Who we are</Eyebrow>
          <ScrollWords
            className="mt-10 max-w-5xl font-display text-[clamp(1.9rem,4.4vw,3.8rem)] leading-[1.16] tracking-[-0.01em]"
            text="Steeler Limousine is a luxury transportation company based in Oakdale, PA. Our fleet is built around {{passenger comfort}} and satisfaction, and we drive airport trips, corporate events and nights out across Pittsburgh and across the state."
          />
        </div>
      </section>

      <section className="bg-ink py-28 md:py-40">
        <div className="wrap">
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-6 text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1.04] tracking-[-0.015em]">
            <Mask>Three things</Mask>
            <Mask delay={0.1}>
              we <em className="text-gold-gradient pr-[0.1em]">don’t compromise on.</em>
            </Mask>
          </h2>
          <div className="mt-16 grid gap-px bg-white/10 md:mt-24 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} className="bg-ink">
                <div className="h-full py-10 md:px-9 md:py-12 md:first:pl-0 md:last:pr-0">
                  <span className="font-display text-6xl italic leading-none text-gold-gradient">0{i + 1}</span>
                  <h3 className="mt-8 text-3xl">{p.title}</h3>
                  <p className="mt-4 max-w-xs leading-relaxed text-mute">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Contact />

      <CtaBand line1="Let’s get you" line2="where you’re going." />
    </>
  )
}

/* --------------------------------------------------------------- contact */

function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()
    const email = String(f.get('email') ?? '').trim()
    const message = String(f.get('message') ?? '').trim()

    const next: Record<string, string> = {}
    if (!name) next.name = 'Please tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Please enter a valid email.'
    if (!message) next.message = 'Add a short message.'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      setResult(await submitRequest('Website message from ' + name, { Name: name, Email: email, Message: message }))
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-20 bg-coal py-28 md:py-40">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.04] tracking-[-0.015em]">
            <Mask>Call any time.</Mask>
            <Mask delay={0.1}>
              <em className="text-gold-gradient pr-[0.1em]">Or write.</em>
            </Mask>
          </h2>

          <Reveal delay={0.15}>
            <ul className="mt-10 space-y-6 text-lg">
              <li>
                <a href={business.phoneHref} className="group flex items-start gap-4 transition-colors hover:text-gold-200">
                  <Phone className="mt-1.5 size-5 shrink-0 text-gold-300" aria-hidden />
                  <span>
                    <span className="label-caps block text-[0.6rem] tracking-[0.3em] text-mute">Phone</span>
                    {business.phone}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="group flex items-start gap-4 break-all transition-colors hover:text-gold-200">
                  <Mail className="mt-1.5 size-5 shrink-0 text-gold-300" aria-hidden />
                  <span>
                    <span className="label-caps block text-[0.6rem] tracking-[0.3em] text-mute">Email</span>
                    {business.email}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="mt-1.5 size-5 shrink-0 text-gold-300" aria-hidden />
                <span>
                  <span className="label-caps block text-[0.6rem] tracking-[0.3em] text-mute">Office</span>
                  {business.street}
                  <br />
                  {business.cityLine}
                </span>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.25} className="mt-12">
            <div className="relative aspect-[16/10] overflow-hidden border border-white/12 bg-graphite">
              <iframe
                title={`Map showing ${business.mapQuery}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&z=12&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.9)_contrast(0.9)_sepia(0.25)]"
              />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="relative border border-white/12 bg-ink p-7 sm:p-10 md:p-12">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease }}
                  className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                >
                  <SuccessCheck />
                  <h3 className="mt-8 text-4xl">{result?.mode === 'sent' ? 'Message received.' : 'One last step.'}</h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-mute">
                    {result?.mode === 'sent'
                      ? 'Thanks for getting in touch. We will reply by email as soon as we can.'
                      : `Your email app should have opened with your message ready to go. Press send to finish. If nothing opened, write to ${business.email}.`}
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="space-y-8">
                  <div>
                    <h3 className="text-3xl md:text-4xl">Send us a message</h3>
                    <p className="mt-2 text-mute">Questions, quotes, special requests. We read everything.</p>
                  </div>
                  <Field label="Name" error={errors.name}>
                    <input name="name" className="field-input" autoComplete="name" aria-invalid={!!errors.name} />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input name="email" type="email" className="field-input" autoComplete="email" aria-invalid={!!errors.email} />
                  </Field>
                  <Field label="Message" error={errors.message}>
                    <textarea name="message" rows={4} className="field-input resize-none" aria-invalid={!!errors.message} />
                  </Field>
                  {status === 'error' && (
                    <p role="alert" className="text-sm text-[#e0715f]">
                      Something went wrong sending that. Please try again or call {business.phone}.
                    </p>
                  )}
                  <Button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps block text-[0.62rem] tracking-[0.3em] text-gold-300/90">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-sm text-[#e0715f]">
          {error}
        </span>
      )}
    </label>
  )
}
