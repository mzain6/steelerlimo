import { Link } from 'react-router-dom'

/** header lockup: the crest from the existing logo plus a live-text wordmark that mirrors its lettering */
export function Logo() {
  return (
    <Link to="/" aria-label="Steeler Limousine, home" className="group flex items-center gap-3">
      <img
        src="/images/crest.png"
        alt=""
        width={231}
        height={320}
        className="h-11 w-auto transition-transform duration-500 group-hover:scale-105 sm:h-12"
      />
      <span className="flex flex-col leading-none">
        <span className="font-label text-[1.02rem] tracking-[0.3em] text-ivory sm:text-[1.12rem]">STEELER</span>
        <span className="label-caps mt-1.5 text-[0.55rem] tracking-[0.52em] text-gold-300 sm:text-[0.6rem]">LIMOUSINE</span>
      </span>
    </Link>
  )
}
