// One-off asset prep (run once, outputs are committed to /public/images):
//  - turns the black-background logo into a transparent PNG
//  - builds a crest-only favicon + social share image
//  - writes web-sized WebP versions of the site photos
// usage: node scripts/prepare-images.mjs <folder with downloaded originals> <out dir>
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const [srcDir, outDir] = process.argv.slice(2)
fs.mkdirSync(outDir, { recursive: true })
const src = (f) => path.join(srcDir, f)

// ---------- logo: light-on-black -> transparent (alpha from brightness, colour un-premultiplied)
const { data, info } = await sharp(src('f19d8e_cdf70e165812466a99f857adf37a9b14~mv2.jpg')).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const FLOOR = 34
for (let i = 0; i < data.length; i += 4) {
  const px = i / 4
  const x = px % info.width
  const y = Math.floor(px / info.width)
  const m = Math.max(data[i], data[i + 1], data[i + 2])
  // stray specks in the source art, outside the crest
  const stray = x < 280 || x > 790 || (y < 150 && (x < 420 || x > 650))
  let a = Math.max(0, Math.min(255, ((m - FLOOR) / (255 - FLOOR)) * 255 * 1.15))
  if (stray || a < 2) { data[i] = data[i + 1] = data[i + 2] = 0; data[i + 3] = 0; continue }
  const k = 255 / Math.max(m, 1)
  data[i] = Math.min(255, data[i] * k)
  data[i + 1] = Math.min(255, data[i + 1] * k)
  data[i + 2] = Math.min(255, data[i + 2] * k)
  data[i + 3] = a
}
const full = await sharp(data, { raw: info }).png().toBuffer()
const logo = await sharp(full).trim({ threshold: 1 }).png().toBuffer()
await sharp(logo).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'logo.png'))

// crest only (crown + ST roundel) for favicon / app icon
// keep only the crown + roundel (drops the flourish tips that touch the circle's lower corners)
const crestData = Buffer.from(data)
for (let i = 0; i < crestData.length; i += 4) {
  const px = i / 4
  const x = px % info.width
  const y = Math.floor(px / info.width)
  const inRoundel = Math.hypot(x - 533, y - 251) <= 108
  if (!(y < 160 || inRoundel)) crestData[i + 3] = 0
}
const crestFull = await sharp(crestData, { raw: info }).png().toBuffer()
// (sharp runs trim before extract inside one pipeline, so these are two separate steps)
const crestRegion = await sharp(crestFull).extract({ left: 425, top: 62, width: 218, height: 298 }).png().toBuffer()
const crest = await sharp(crestRegion).trim({ threshold: 1 }).png().toBuffer()
const icon = async (size, bg) => {
  const inner = await sharp(crest).resize({ height: Math.round(size * 0.78), width: Math.round(size * 0.78), fit: 'inside' }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: inner, gravity: 'centre' }]).png().toBuffer()
}
await sharp(crest).resize({ height: 320 }).png({ compressionLevel: 9 }).toFile(path.join(outDir, 'crest.png'))
fs.writeFileSync(path.join(outDir, '..', 'favicon.png'), await icon(256, { r: 10, g: 10, b: 11, alpha: 1 }))
fs.writeFileSync(path.join(outDir, '..', 'apple-touch-icon.png'), await icon(180, { r: 10, g: 10, b: 11, alpha: 1 }))

// ---------- photos
const webp = (img, name, width, quality = 78) =>
  img.resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(path.join(outDir, name))

await webp(sharp(src('f19d8e_49cadff1567e4b6a99f6121bf0c2dfdf~mv2.jpg')), 'hero-skyline.webp', 2000, 82)
await webp(sharp(src('banner-about.jpg')).extract({ left: 213, top: 0, width: 855, height: 720 }), 'bridge.webp', 1400, 82)
await webp(sharp(src('f19d8e_2d2982d8c90e4772b709d0a910eacc38~mv2.jpg')), 'corporate.webp', 1600)
await webp(sharp(src('ea26fd_d11cdc4d49f0431fb307fe86072898e8~mv2_d_2952_2025_s_2.jpg')), 'airport.webp', 1600)
await webp(sharp(src('f19d8e_0a250715c65f4e6d986c071337d76fac~mv2.jpeg')), 'wedding.webp', 1400)
await webp(sharp(src('f19d8e_2224c6491f45405c900a043eea3a046c~mv2.jpg')), 'escalade.webp', 1200)
await webp(sharp(src('f19d8e_020c54f36b044e83aa6eb5396df2d80d~mv2.jpg')), 'yukon.webp', 1400)

// ---------- social share image 1200x630
const bg = await sharp(src('f19d8e_49cadff1567e4b6a99f6121bf0c2dfdf~mv2.jpg')).resize(1200, 630, { fit: 'cover' }).modulate({ brightness: 0.45 }).toBuffer()
const logoOg = await sharp(logo).resize({ height: 440 }).toBuffer()
await sharp(bg).composite([{ input: logoOg, gravity: 'centre' }]).jpeg({ quality: 85 }).toFile(path.join(outDir, 'og.jpg'))
console.log('done')
