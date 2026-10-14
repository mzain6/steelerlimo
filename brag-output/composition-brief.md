# Hyperframes Composition Brief: Steeler Limousine (new website)

## Objective
Create one 60-second launch-style film for the new Steeler Limousine website, built from real desktop footage of the real site, showing every feature in the order a visitor meets it, at a slow, unhurried pace. No mobile scene (user request).

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape, 1920x1080
- Duration: exactly 60 seconds (user-requested; the `/brag` default of 15–25s is deliberately overridden)

## Source Material
- Project root: `C:\Users\mmZai\OneDrive\Desktop\steelerlimousine` (React + Vite + Tailwind v4 + Framer Motion)
- Footage: captured from the production build with a slow-motion method (page clock at 1/4 speed, recorded in real time, then re-timed) so every animation is the real behaviour; 1080p/60fps, one take recorded at a time to keep frame rate high. Files in `assets/footage/` with exact event timestamps in `*.events.json`.
- A footer-flash bug during page transitions was found and fixed in the site before recording (pages are now eagerly loaded). The homepage reservation form was removed at the user's request, and every take was re-recorded against that build.
- Copy that must appear verbatim (all from the site): "Arrive in black & gold.", "Pittsburgh runs on black and gold. So do we.", "Every ride, done properly.", "Built around the back seat.", "From Oakdale, to wherever.", "Black · Gold · Pittsburgh", "Book your ride".

## Creative Direction
- Tone preset: `polished`
- Creative direction: a slow, quiet premium product film. Black and gold, Pittsburgh after dark, real footage only.
- Interpretation: slowness is the feel. Footage plays at natural 1.0× speed (some beats gently slower), no fast-forwarding; moments are joined by soft dissolves; gentle push-ins; captions are small caps labels.
- Hook: the real loading screen, then the shutters part. Title: "The new Steeler Limousine website".
- Outro / punchline: crest on black, "Black · Gold · Pittsburgh", then "Book your ride."
- Avoid: generic SaaS language; abstract filler; altering the footage; showing a phone number; any mobile/phone scene.

## Visual Identity
- Background #0a0a0b; text #f3eee3; accent #e3c370 (highlight #fff0b2, deep #b88a2f)
- Display Bodoni Moda, labels Marcellus, body Hanken Grotesk (bundled locally in `assets/fonts/`)

## Storyboard
Use `brag-plan.md` as the creative contract. Scene starts are snapped to the music beat grid:
1. Opening screen 0.0 · 2. Hero 6.00 · 3. Scroll-lit story 12.55 · 4. Services index 18.02 · 5. Services page 23.46 · 6. Fleet explorer 33.83 · 7. About & contact 40.38 · 8. Book Now 44.74 · 9. Outro 57.28 (ends 60.0)

Structure rules learned from the Hyperframes linter:
- Footage videos are direct, absolutely timed clips; a `<video>` must NOT sit inside a timed wrapper. A static (untimed) clipping wrapper with `overflow:hidden` keeps push-in zooms inside the frame.
- Local assets only; deterministic logic only.

## Audio
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`, fade-in ~1.2s, volume ~0.30, fade-out last ~2.8s
- Music cue guidance: bundled preset + beat grid for 0–60s in `assets/music/beats-0-60.json` (110 BPM). Lock ≤3 major reveals within ±0.15s of strong cues; snap cuts within ±0.1s of beats.
- Audio-reactive: subtle. Per-frame RMS (`assets/music/rms-30fps.json`) modulates the gold bloom behind the frame and the outro crest glow.
- SFX: warm, low-HF-risk files only, synced to the recorded event timestamps and premixed into one SFX bed aligned to the final timeline. Volumes ≤0.6.

## Hyperframes Instructions
Author with native Hyperframes conventions. The domain skills are not installed in this session, so `npx hyperframes docs …`, `check` and `lint` are the contract. Telemetry and skill installs are disabled for this run.

Requirements:
- Real footage in every product scene; all text readable (labels ≥0.8s settled, sentences ~0.3s/word).
- 60 seconds total; music + SFX layer included.
- Run `hyperframes check` before render; render with `--video-frame-format png`.
- Keep creation and rendering local; no publishing.
