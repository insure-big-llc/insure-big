/**
 * Generate favicon and platform icon set from the brand favicon.
 *
 * Output goes to public/ so Astro copies it to dist/ verbatim.
 *
 * The source asset is `BIG Favicon.webp` (copied to public/favicon.webp).
 * WebP is fine for the <link rel="icon"> on modern browsers, but:
 *   - Safari and several crawlers/feed readers do not support WebP favicons
 *   - iOS needs an apple-touch-icon PNG, and the layout links one
 *   - /favicon.ico is requested by convention even when not declared
 * so the PNG and ICO forms are generated here rather than assumed.
 *
 * Run once (and again only if the source logo changes):
 *   node scripts/build-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PUB = new URL('../public/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(PUB, 'favicon.webp');

if (!existsSync(SRC)) {
  console.error(`Source favicon not found: ${SRC}`);
  process.exit(1);
}
mkdirSync(PUB, { recursive: true });

const src = readFileSync(SRC);
const meta = await sharp(src).metadata();
console.log(`source: ${meta.width}x${meta.height} ${meta.format}`);

/**
 * Render the icon at a square size with transparent padding so a non-square
 * source is centred rather than stretched.
 */
async function squarePng(size) {
  const side = Math.max(meta.width, meta.height);
  return sharp(src)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .resize(size, size) // no-op when already square; keeps chain explicit
    .png({ compressionLevel: 9 })
    .toBuffer()
    .catch(async () => {
      // If the source is not square, pad it first.
      const padded = await sharp({
        create: {
          width: side,
          height: side,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: src, gravity: 'centre' }])
        .png()
        .toBuffer();
      return sharp(padded).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
    });
}

/** Build a multi-size .ico container holding PNG frames. */
function buildIco(frames) {
  // ICONDIR: reserved(2) type(2) count(2)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(frames.length, 4);

  // ICONDIRENTRY is 16 bytes each.
  const entries = Buffer.alloc(16 * frames.length);
  let offset = 6 + 16 * frames.length;

  frames.forEach((f, i) => {
    const at = i * 16;
    // 256 is encoded as 0 in a single byte.
    entries.writeUInt8(f.size >= 256 ? 0 : f.size, at + 0); // width
    entries.writeUInt8(f.size >= 256 ? 0 : f.size, at + 1); // height
    entries.writeUInt8(0, at + 2); // palette colours
    entries.writeUInt8(0, at + 3); // reserved
    entries.writeUInt16LE(1, at + 4); // colour planes
    entries.writeUInt16LE(32, at + 6); // bits per pixel
    entries.writeUInt32LE(f.data.length, at + 8); // size of image data
    entries.writeUInt32LE(offset, at + 12); // offset
    offset += f.data.length;
  });

  return Buffer.concat([header, entries, ...frames.map((f) => f.data)]);
}

// ── Standard favicon sizes ────────────────────────────────────────────────────
for (const size of [16, 32, 48]) {
  const png = await squarePng(size);
  writeFileSync(join(PUB, `favicon-${size}x${size}.png`), png);
  console.log(`  favicon-${size}x${size}.png  ${png.length} bytes`);
}

// ── favicon.ico (16 + 32 + 48) ────────────────────────────────────────────────
const icoFrames = [];
for (const size of [16, 32, 48]) {
  icoFrames.push({ size, data: await squarePng(size) });
}
const ico = buildIco(icoFrames);
writeFileSync(join(PUB, 'favicon.ico'), ico);
console.log(`  favicon.ico  ${ico.length} bytes`);

// ── Apple touch icon (180x180, opaque background — iOS does not render alpha well) ──
const apple = await sharp(src)
  .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(join(PUB, 'apple-touch-icon.png'), apple);
console.log(`  apple-touch-icon.png  ${apple.length} bytes`);

// ── Web app manifest icons (192 + 512), used by the manifest ─────────────────
mkdirSync(join(PUB, 'icons'), { recursive: true });
for (const size of [192, 512]) {
  const png = await squarePng(size);
  writeFileSync(join(PUB, 'icons', `icon-${size}.png`), png);
  console.log(`  icons/icon-${size}.png  ${png.length} bytes`);
}

console.log('\nIcon set generated.');
