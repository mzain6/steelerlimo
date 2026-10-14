import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../lib/cn'
import { ease } from '../lib/motion'

export function Accordion({ items, tone = 'dark' }: { items: { q: string; a: string }[]; tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState<number | null>(0)
  const line = tone === 'dark' ? 'border-white/12' : 'border-ink/15'

  return (
    <div className={cn('border-t', line)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={cn('border-b', line)}>
            <h3>
              <button
                id={`faq-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="font-display text-xl transition-colors duration-300 group-hover:text-gold-300 md:text-[1.7rem]">
                  {item.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ duration: 0.45, ease }}
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-full border transition-colors',
                    tone === 'dark' ? 'border-white/20 group-hover:border-gold-300' : 'border-ink/25 group-hover:border-ink',
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="overflow-hidden"
                >
                  <p className={cn('max-w-2xl pb-8 leading-relaxed', tone === 'dark' ? 'text-mute' : 'text-mute-dark')}>
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
