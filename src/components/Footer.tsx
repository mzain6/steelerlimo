import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { business, nav } from '../data/site'
import { Button } from './Button'
import { Reveal } from './Reveal'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-coal pb-28 pt-20 md:pb-10 md:pt-28">
      <div className="wrap">
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <img src="/images/logo.png" alt="Steeler Limousine LLC" width={900} height={765} className="-ml-4 w-56 sm:w-64" loading="lazy" />
            <p className="mt-6 max-w-sm leading-relaxed text-mute">
              Luxury SUV and limousine service for Pittsburgh. Airport transfers, corporate travel, weddings and nights out, with professional drivers.
            </p>
            <div className="mt-8">
              <Button to="/book">Book your ride</Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3 lg:col-start-7">
            <h2 className="label-caps font-label text-[0.72rem] text-gold-300">Explore</h2>
            <ul className="mt-6 space-y-3.5">
              {[...nav, { to: '/book', label: 'Book now' }].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="font-display text-2xl text-ivory/90 transition-colors duration-300 hover:text-gold-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-3">
            <h2 className="label-caps font-label text-[0.72rem] text-gold-300">Reach us any time</h2>
            <ul className="mt-6 space-y-5 text-ivory/85">
              <li>
                <a href={business.phoneHref} className="flex items-start gap-3.5 transition-colors hover:text-gold-200">
                  <Phone className="mt-1 size-4 shrink-0 text-gold-300" aria-hidden />
                  {business.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="flex items-start gap-3.5 break-all transition-colors hover:text-gold-200">
                  <Mail className="mt-1 size-4 shrink-0 text-gold-300" aria-hidden />
                  {business.email}
                </a>
              </li>
              <li className="flex items-start gap-3.5">
                <MapPin className="mt-1 size-4 shrink-0 text-gold-300" aria-hidden />
                <span>
                  {business.street}
                  <br />
                  {business.cityLine}
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-mute md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          <p className="label-caps text-[0.66rem] tracking-[0.3em]">Black · Gold · Pittsburgh</p>
        </div>
      </div>
    </footer>
  )
}
