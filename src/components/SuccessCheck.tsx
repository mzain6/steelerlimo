import { motion } from 'framer-motion'
import { ease } from '../lib/motion'

/** gold ring that draws itself, then the tick */
export function SuccessCheck({ size = 96 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden
      initial="hidden"
      animate="show"
    >
      <defs>
        <linearGradient id="gold-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b88a2f" />
          <stop offset="0.5" stopColor="#fff0b2" />
          <stop offset="1" stopColor="#d1a94c" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="48"
        cy="48"
        r="44"
        stroke="url(#gold-ring)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease } } }}
      />
      <motion.path
        d="M30 50 L43 63 L67 36"
        stroke="url(#gold-ring)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.6, ease, delay: 0.8 } } }}
      />
    </motion.svg>
  )
}
