import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/cn'

type Props = {
  children: ReactNode
  to?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'gold' | 'ghost' | 'dark' | 'ghost-dark'
  size?: 'sm' | 'md' | 'lg'
  arrow?: boolean
  className?: string
  ariaLabel?: string
}

const variants = {
  gold: 'bg-gold-gradient text-ink',
  ghost: 'border border-white/25 text-ivory hover:border-gold-300 hover:text-gold-200',
  dark: 'bg-ink text-ivory hover:bg-graphite',
  'ghost-dark': 'border border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-ivory',
}

const sizes = {
  sm: 'px-5 py-2.5 text-[0.7rem]',
  md: 'px-7 py-3.5 text-[0.76rem]',
  lg: 'px-9 py-[1.15rem] text-[0.8rem]',
}

/** nudges toward the pointer a few pixels; mouse only, so it never fights touch scrolling */
function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      className={cn('inline-block', className)}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

export function Button({
  children,
  to,
  href,
  onClick,
  type = 'button',
  disabled,
  variant = 'gold',
  size = 'md',
  arrow = true,
  className,
  ariaLabel,
}: Props) {
  const classes = cn(
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full label-caps transition-colors duration-300',
    'before:pointer-events-none before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:skew-x-[-20deg] before:bg-white/35 before:opacity-0 before:transition-all before:duration-700',
    variant === 'gold' && 'hover:before:translate-x-[420%] hover:before:opacity-100',
    disabled && 'pointer-events-none opacity-40',
    variants[variant],
    sizes[size],
    className,
  )
  const inner = (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <ArrowUpRight
          aria-hidden
          className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  )

  return (
    <Magnetic>
      {to ? (
        <Link to={to} className={classes} aria-label={ariaLabel}>
          {inner}
        </Link>
      ) : href ? (
        <a href={href} className={classes} aria-label={ariaLabel}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={classes} aria-label={ariaLabel}>
          {inner}
        </button>
      )}
    </Magnetic>
  )
}
