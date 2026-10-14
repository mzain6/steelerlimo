import type { ReactNode } from 'react'

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps block text-[0.62rem] tracking-[0.3em] text-gold-300/90">{label}</span>
      {children}
      {hint && !error && <span className="mt-2 block text-sm text-mute">{hint}</span>}
      {error && (
        <span role="alert" className="mt-2 block text-sm text-[#e0715f]">
          {error}
        </span>
      )}
    </label>
  )
}
