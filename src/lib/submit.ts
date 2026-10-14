import { business } from '../data/site'

/**
 * Set VITE_FORM_ENDPOINT (e.g. a Formspree / Getform URL) in a .env file to have
 * requests delivered straight to the inbox. Without it we fall back to opening the
 * visitor's email app with the request pre-filled, so nothing is ever silently lost.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined

export type SubmitResult = { mode: 'sent' | 'mailto' }

export async function submitRequest(subject: string, fields: Record<string, string>): Promise<SubmitResult> {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, ...fields }),
    })
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    return { mode: 'sent' }
  }

  const body = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return { mode: 'mailto' }
}
