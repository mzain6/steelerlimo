# Steeler Limousine website

Redesign of steelerlimousine.com. Five pages: **Home, Services, Fleet, About & Contact, Book Now**.
React + TypeScript + Vite, Tailwind CSS v4, Framer Motion, React Router.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then outputs ./dist
npm run preview    # serve the production build locally
```

## Edit the content

Everything the site says lives in **`src/data/site.ts`**: phone, email, address, services, fleet,
pricing options, FAQs, service areas. Components never hard-code copy, so changing a number or a
sentence is a one-line edit.

Please confirm before launch:
- **Phone number.** The old site *displayed* `412-608-9759` but its tap-to-call link dialled `412-424-1776`. The new site uses 412-608-9759 everywhere (`business.phone` / `business.phoneHref`).
- **Fleet details.** Two SUV classes seating 7 come from the old site; luggage/interior wording and the photos are representative.
- **Service areas** (`areas`) and the FAQ answers are drafted from the old site's content. Check they match what you actually offer.

## Make the forms deliver to your inbox

The Book Now and contact forms need somewhere to send. Create a free endpoint (Formspree, Getform, etc.)
that forwards to `steelerlimousine@gmail.com`, copy `.env.example` to `.env`, and set:

```
VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Without it, the forms fall back to opening the visitor's email app with the request pre-filled.

## Brand & design

- Logo, crest and photos are from the existing site (`scripts/prepare-images.mjs` turned the black-background
  logo into a transparent PNG and produced the favicon, crest mark, share image and optimised photos).
- Palette is taken from the crest: black `#0a0a0b`, metallic gold ramp, champagne cream `#eee2c6` for light sections (`src/index.css`).
- Type: Bodoni Moda (headlines), Marcellus (labels, echoing the crest lettering), Hanken Grotesk (body). All self-hosted.
- Motion honours the visitor's "reduce motion" setting.

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages). `vercel.json` and `public/_redirects` already
route every path to `index.html` so `/services`, `/fleet`, etc. work on refresh. Point the
steelerlimousine.com domain at the new host once you are happy with it.
