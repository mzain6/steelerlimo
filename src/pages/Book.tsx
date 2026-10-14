import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Minus, Phone, Plus } from 'lucide-react'
import { business, services, vehicles, type ServiceId, type VehicleId } from '../data/site'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Eyebrow, Mask } from '../components/Reveal'
import { SuccessCheck } from '../components/SuccessCheck'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'
import { submitRequest, type SubmitResult } from '../lib/submit'
import { usePageMeta } from '../lib/usePageMeta'

/* ------------------------------------------------------------------ model */

type TripType = 'one-way' | 'round-trip' | 'hourly'

type Form = {
  service: ServiceId | ''
  tripType: TripType
  pickup: string
  dropoff: string
  date: string
  time: string
  passengers: number
  hours: number
  flight: string
  vehicle: VehicleId | 'any'
  name: string
  phone: string
  email: string
  notes: string
}

type Errors = Partial<Record<keyof Form, string>>

const tripTypes: { id: TripType; label: string }[] = [
  { id: 'one-way', label: 'One way' },
  { id: 'round-trip', label: 'Round trip' },
  { id: 'hourly', label: 'By the hour' },
]

const stepNames = ['Trip', 'Details', 'Vehicle', 'You']

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const prettyDate = (v: string) =>
  v ? new Date(`${v}T00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''

const prettyTime = (v: string) => {
  if (!v) return ''
  const [h, m] = v.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function initialForm(p: URLSearchParams): Form {
  const service = p.get('service')
  const vehicle = p.get('vehicle')
  return {
    service: services.some((s) => s.id === service) ? (service as ServiceId) : '',
    tripType: 'one-way',
    pickup: p.get('pickup') ?? '',
    dropoff: p.get('dropoff') ?? '',
    date: p.get('date') ?? '',
    time: p.get('time') ?? '',
    passengers: 2,
    hours: 4,
    flight: '',
    vehicle: vehicles.some((v) => v.id === vehicle) ? (vehicle as VehicleId) : 'any',
    name: '',
    phone: '',
    email: '',
    notes: '',
  }
}

function validate(step: number, f: Form): Errors {
  const e: Errors = {}
  if (step === 0 && !f.service) e.service = 'Choose the kind of ride you need.'
  if (step === 1) {
    if (!f.pickup.trim()) e.pickup = 'Where should we pick you up?'
    if (f.tripType !== 'hourly' && !f.dropoff.trim()) e.dropoff = 'Where are you headed?'
    if (!f.date) e.date = 'Choose a date.'
    else if (f.date < todayStr()) e.date = 'That date has already passed.'
    if (!f.time) e.time = 'Choose a pickup time.'
  }
  if (step === 3) {
    if (!f.name.trim()) e.name = 'Please tell us your name.'
    if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a phone number we can reach you on.'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
  }
  return e
}

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -48 }),
}

/* ------------------------------------------------------------------- page */

export default function Book() {
  usePageMeta(
    'Book Now | Steeler Limousine, Pittsburgh',
    'Book a chauffeured SUV in Pittsburgh in under a minute. Airport transfers, corporate travel, events and special occasions.',
  )
  const [params] = useSearchParams()
  const [form, setForm] = useState<Form>(() => initialForm(params))
  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const touched = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => {
      if (!e[key]) return e
      const next = { ...e }
      delete next[key]
      return next
    })
  }

  const go = (n: number) => {
    touched.current = true
    setDir(n > step ? 1 : -1)
    setStep(n)
    setMaxStep((m) => Math.max(m, n))
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submit = async () => {
    const svc = services.find((s) => s.id === form.service)
    const veh = vehicles.find((v) => v.id === form.vehicle)
    setStatus('sending')
    try {
      const res = await submitRequest(`Booking request: ${svc?.title ?? 'Ride'} on ${prettyDate(form.date)}`, {
        Service: svc?.title ?? '',
        'Trip type': tripTypes.find((t) => t.id === form.tripType)?.label ?? '',
        Date: prettyDate(form.date),
        'Pickup time': prettyTime(form.time),
        Pickup: form.pickup,
        'Drop-off': form.dropoff,
        Guests: String(form.passengers),
        Hours: form.tripType === 'hourly' ? String(form.hours) : '',
        'Flight number': form.service === 'airport' ? form.flight : '',
        Vehicle: veh?.name ?? 'No preference',
        Name: form.name,
        Phone: form.phone,
        Email: form.email,
        Notes: form.notes,
      })
      setResult(res)
      setStatus('done')
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {
      setStatus('error')
    }
  }

  const next = () => {
    const e = validate(step, form)
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    if (step < stepNames.length - 1) go(step + 1)
    else void submit()
  }

  const reset = () => {
    setForm(initialForm(new URLSearchParams()))
    setStep(0)
    setMaxStep(0)
    setStatus('idle')
    setResult(null)
  }

  return (
    // overflow-x-clip (not hidden) so the decorative glow can't cause sideways scroll while the summary stays sticky
    <section className="relative overflow-x-clip pb-28 pt-36 md:pb-40 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 top-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(227,195,112,0.12),transparent_65%)]"
      />
      <div className="wrap relative">
        <Eyebrow>Book now</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.8rem,7.6vw,6.4rem)] leading-[0.98] tracking-[-0.02em]">
          <Mask delay={0.1}>Book your</Mask>
          <Mask delay={0.2}>
            <em className="text-gold-gradient sheen pr-[0.1em]">ride.</em>
          </Mask>
        </h1>

        <div ref={topRef} className="mt-12 grid scroll-mt-28 gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {status === 'done' ? (
              <Done form={form} result={result} onReset={reset} />
            ) : (
              <>
                <Stepper step={step} maxStep={maxStep} onJump={go} />

                <div className="mt-10 min-h-[27rem] overflow-hidden md:mt-12">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease }}
                      onAnimationComplete={(d) => {
                        if (d === 'center' && touched.current) headingRef.current?.focus({ preventScroll: true })
                      }}
                    >
                      <h2 ref={headingRef} tabIndex={-1} className="text-3xl outline-none md:text-4xl">
                        {['What kind of ride?', 'Where and when?', 'Choose your vehicle', 'How do we reach you?'][step]}
                      </h2>
                      <div className="mt-8">
                        {step === 0 && <StepTrip form={form} errors={errors} set={set} />}
                        {step === 1 && <StepDetails form={form} errors={errors} set={set} />}
                        {step === 2 && <StepVehicle form={form} set={set} />}
                        {step === 3 && <StepContact form={form} errors={errors} set={set} />}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {status === 'error' && (
                  <p role="alert" className="mt-4 text-sm text-[#e0715f]">
                    Something went wrong sending your request. Please try again, or call {business.phone}.
                  </p>
                )}

                <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/12 pt-8">
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    className={cn(
                      'label-caps flex items-center gap-2.5 text-[0.7rem] text-ivory/70 transition-colors hover:text-gold-200',
                      step === 0 && 'invisible',
                    )}
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    Back
                  </button>
                  <Button onClick={next} size="lg" disabled={status === 'sending'}>
                    {step === stepNames.length - 1 ? (status === 'sending' ? 'Sending…' : 'Send request') : 'Continue'}
                  </Button>
                </div>
              </>
            )}
          </div>

          <Summary form={form} />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- stepper */

function Stepper({ step, maxStep, onJump }: { step: number; maxStep: number; onJump: (n: number) => void }) {
  return (
    <nav aria-label="Booking progress">
      <ol className="relative grid grid-cols-4">
        <span aria-hidden className="absolute left-0 right-0 top-[0.95rem] h-px bg-white/12" />
        <motion.span
          aria-hidden
          className="absolute left-0 top-[0.95rem] h-px w-full origin-left bg-gold-gradient"
          animate={{ scaleX: step / (stepNames.length - 1) }}
          transition={{ duration: 0.7, ease }}
        />
        {stepNames.map((name, i) => {
          const reachable = i <= maxStep
          const current = i === step
          return (
            <li key={name} className={cn('relative', i === stepNames.length - 1 ? 'justify-self-end text-right' : '')}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onJump(i)}
                aria-current={current ? 'step' : undefined}
                className={cn('group flex flex-col gap-3 text-left disabled:cursor-default', i === stepNames.length - 1 && 'items-end text-right')}
              >
                <span
                  className={cn(
                    'relative grid size-[1.9rem] place-items-center rounded-full border text-[0.7rem] transition-all duration-500',
                    current
                      ? 'border-gold-300 bg-gold-300 text-ink'
                      : i < step
                        ? 'border-gold-300 bg-ink text-gold-300'
                        : 'border-white/20 bg-ink text-ivory/45',
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    'label-caps text-[0.62rem] tracking-[0.24em] transition-colors',
                    current ? 'text-gold-200' : reachable ? 'text-ivory/70 group-hover:text-gold-200' : 'text-ivory/35',
                  )}
                >
                  {name}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ------------------------------------------------------------------ steps */

type StepProps = {
  form: Form
  errors?: Errors
  set: <K extends keyof Form>(key: K, value: Form[K]) => void
}

function StepTrip({ form, errors = {}, set }: StepProps) {
  return (
    <div className="space-y-10">
      <div>
        <div role="radiogroup" aria-label="Type of ride" className="grid gap-3 sm:grid-cols-2">
          {services.map((s, i) => {
            const on = form.service === s.id
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set('service', s.id)}
                className={cn(
                  'group relative border bg-ink/40 p-5 text-left transition-colors duration-300',
                  on ? 'border-transparent' : 'border-white/14 hover:border-white/35',
                  i === services.length - 1 && 'sm:col-span-2',
                )}
              >
                {on && (
                  <motion.span
                    layoutId="service-ring"
                    aria-hidden
                    className="absolute inset-0 border border-gold-300 bg-gold-300/[0.06]"
                    transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                  />
                )}
                <span className="relative flex items-baseline gap-4">
                  <span className={cn('label-caps text-[0.64rem] transition-colors', on ? 'text-gold-300' : 'text-ivory/40')}>{s.n}</span>
                  <span className="font-display text-xl leading-tight md:text-2xl">{s.title}</span>
                </span>
              </button>
            )
          })}
        </div>
        {errors.service && (
          <p role="alert" className="mt-3 text-sm text-[#e0715f]">
            {errors.service}
          </p>
        )}
      </div>

      <div>
        <p className="label-caps text-[0.62rem] tracking-[0.3em] text-gold-300/90">Trip type</p>
        <div role="radiogroup" aria-label="Trip type" className="mt-4 grid w-full grid-cols-3 gap-1 rounded-full border border-white/15 p-1.5 sm:flex sm:w-fit">
          {tripTypes.map((t) => {
            const on = form.tripType === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set('tripType', t.id)}
                className="label-caps relative z-10 px-2 py-3 text-center text-[0.6rem] tracking-[0.14em] sm:px-5 sm:text-[0.64rem] sm:tracking-[0.2em]"
              >
                {on && (
                  <motion.span
                    layoutId="trip-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gold-gradient"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                <span className={cn('transition-colors duration-300', on ? 'text-ink' : 'text-ivory/80')}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Counter({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div>
      <span className="label-caps block text-[0.62rem] tracking-[0.3em] text-gold-300/90">{label}</span>
      <div className="mt-3 flex items-center gap-5 border-b border-white/20 pb-2.5">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid size-9 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold-300 disabled:opacity-30"
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <span aria-live="polite" className="w-8 text-center font-display text-3xl tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid size-9 place-items-center rounded-full border border-white/20 transition-colors hover:border-gold-300 disabled:opacity-30"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function StepDetails({ form, errors = {}, set }: StepProps) {
  const hourly = form.tripType === 'hourly'
  const minHours = form.service === 'event' ? 4 : 2
  const hours = Math.max(form.hours, minHours)

  return (
    <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Pickup location" error={errors.pickup}>
          <input
            className="field-input"
            value={form.pickup}
            onChange={(e) => set('pickup', e.target.value)}
            placeholder="Address, hotel or airport"
            autoComplete="off"
            aria-invalid={!!errors.pickup}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field
          label={hourly ? 'First stop (optional)' : 'Drop-off location'}
          error={errors.dropoff}
          hint={hourly ? 'Tell us where you are headed first. We will plan the rest of the day with you.' : undefined}
        >
          <input
            className="field-input"
            value={form.dropoff}
            onChange={(e) => set('dropoff', e.target.value)}
            placeholder="Where to?"
            autoComplete="off"
            aria-invalid={!!errors.dropoff}
          />
        </Field>
      </div>
      <Field label="Date" error={errors.date}>
        <input
          className="field-input"
          type="date"
          min={todayStr()}
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          aria-invalid={!!errors.date}
        />
      </Field>
      <Field label="Pickup time" error={errors.time}>
        <input className="field-input" type="time" value={form.time} onChange={(e) => set('time', e.target.value)} aria-invalid={!!errors.time} />
      </Field>

      <div>
        <Counter label="Guests" value={form.passengers} min={1} max={20} onChange={(n) => set('passengers', n)} />
        {form.passengers > 7 && (
          <p className="mt-3 text-sm text-gold-200">Over seven? No problem. We will call to arrange the right vehicles.</p>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hourly && (
          <motion.div
            key="hours"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <Counter label="Hours" value={hours} min={minHours} max={24} onChange={(n) => set('hours', n)} />
            {form.service === 'event' && <p className="mt-3 text-sm text-mute">Special events are booked in 4-hour blocks.</p>}
          </motion.div>
        )}
        {form.service === 'airport' && (
          <motion.div
            key="flight"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden sm:col-span-2"
          >
            <Field label="Flight number (optional)" hint="So your driver knows exactly where to meet you at PIT.">
              <input
                className="field-input"
                value={form.flight}
                onChange={(e) => set('flight', e.target.value)}
                placeholder="e.g. AA 1234"
                autoComplete="off"
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StepVehicle({ form, set }: StepProps) {
  const options = [...vehicles.map((v) => ({ id: v.id as VehicleId | 'any', name: v.name, note: v.tagline, image: v.image, position: v.position })), { id: 'any' as const, name: 'No preference', note: 'We will recommend the best fit', image: '', position: undefined }]
  return (
    <div role="radiogroup" aria-label="Vehicle" className="grid gap-4 sm:grid-cols-2">
      {options.map((o) => {
        const on = form.vehicle === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => set('vehicle', o.id)}
            className={cn('group relative overflow-hidden border text-left transition-colors', on ? 'border-transparent' : 'border-white/14 hover:border-white/35', o.id === 'any' && 'sm:col-span-2')}
          >
            {on && (
              <motion.span
                layoutId="vehicle-ring"
                aria-hidden
                className="absolute inset-0 z-10 border border-gold-300"
                transition={{ type: 'spring', stiffness: 420, damping: 38 }}
              />
            )}
            {o.image && (
              <span className="block aspect-[16/10] overflow-hidden bg-graphite">
                <img
                  src={o.image}
                  alt=""
                  loading="lazy"
                  style={{ objectPosition: o.position }}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </span>
            )}
            <span className={cn('relative block p-5', on && 'bg-gold-300/[0.06]')}>
              <span className="block font-display text-2xl">{o.name}</span>
              <span className="label-caps mt-1.5 block text-[0.6rem] tracking-[0.24em] text-gold-300/90">{o.note}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function StepContact({ form, errors = {}, set }: StepProps) {
  return (
    <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Full name" error={errors.name}>
          <input className="field-input" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
        </Field>
      </div>
      <Field label="Phone" error={errors.phone}>
        <input
          className="field-input"
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          autoComplete="tel"
          aria-invalid={!!errors.phone}
        />
      </Field>
      <Field label="Email" error={errors.email}>
        <input
          className="field-input"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Anything else? (optional)" hint="Child seats, extra stops, special requests.">
          <textarea className="field-input resize-none" rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </Field>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- summary */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-white/10 py-4 last:border-0">
      <dt className="label-caps pt-1 text-[0.58rem] tracking-[0.26em] text-gold-300/80">{label}</dt>
      <dd className="min-h-[1.5rem] break-words text-[0.97rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value || 'empty'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={cn('block', !value && 'text-ivory/30')}
          >
            {value || '—'}
          </motion.span>
        </AnimatePresence>
      </dd>
    </div>
  )
}

function Summary({ form }: { form: Form }) {
  const svc = services.find((s) => s.id === form.service)
  const veh = vehicles.find((v) => v.id === form.vehicle)
  const hourly = form.tripType === 'hourly'
  const when = [prettyDate(form.date), prettyTime(form.time)].filter(Boolean).join(' · ')

  return (
    <aside aria-label="Trip summary" className="lg:col-span-5">
      <div className="border border-white/12 bg-coal p-7 sm:p-9 lg:sticky lg:top-28">
        <div className="flex items-center justify-between gap-4 border-b border-white/12 pb-6">
          <h2 className="text-3xl">Your trip</h2>
          <img src="/images/crest.png" alt="" width={231} height={320} className="h-12 w-auto opacity-90" />
        </div>
        <dl>
          <Row label="Service" value={svc?.title ?? ''} />
          <Row label="Type" value={tripTypes.find((t) => t.id === form.tripType)?.label ?? ''} />
          <Row label="When" value={when} />
          <Row label="From" value={form.pickup} />
          <Row label={hourly ? 'First stop' : 'To'} value={form.dropoff} />
          <Row label="Guests" value={String(form.passengers)} />
          {hourly && <Row label="Hours" value={String(Math.max(form.hours, form.service === 'event' ? 4 : 2))} />}
          <Row label="Vehicle" value={veh?.name ?? 'No preference'} />
        </dl>
        <div className="mt-6 border-t border-white/12 pt-6 text-sm leading-relaxed text-mute">
          <p>Send the request and we will confirm your details and pricing with you directly.</p>
          <a href={business.phoneHref} className="label-caps mt-5 inline-flex items-center gap-3 text-[0.72rem] text-gold-200 transition-colors hover:text-gold-100">
            <Phone className="size-4" aria-hidden />
            Prefer to talk? {business.phone}
          </a>
        </div>
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------------- done */

function Done({ form, result, onReset }: { form: Form; result: SubmitResult | null; onReset: () => void }) {
  const sent = result?.mode === 'sent'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="flex min-h-[32rem] flex-col items-start justify-center border border-white/12 bg-ink p-8 sm:p-12"
      role="status"
    >
      <SuccessCheck />
      <h2 className="mt-9 text-4xl leading-tight md:text-5xl">{sent ? 'Request received.' : 'One last step.'}</h2>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">
        {sent
          ? `Thank you, ${form.name.split(' ')[0]}. We will confirm your ride and pricing by phone or email shortly.`
          : `Your email app should have opened with your trip details ready to go, ${form.name.split(' ')[0]}. Press send and we will take it from there. If nothing opened, email ${business.email}.`}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button href={business.phoneHref} arrow={false}>
          Call {business.phone}
        </Button>
        <Button onClick={onReset} variant="ghost" arrow={false}>
          Book another ride
        </Button>
      </div>
    </motion.div>
  )
}
