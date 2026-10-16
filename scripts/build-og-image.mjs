/**
 * Generate the default Open Graph image (1200x630) with the brand mark.
 *
 * Rendered from an inline SVG so it is crisp at any scale and reproducible:
 *   node scripts/build-og-image.mjs   →   public/og-default.png
 *
 * Brand: dark ink background (#1a1a1a), gold (#bd9b01) ring monogram, the name
 * and the market statement. Text is kept minimal — social platforms crop.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC = new URL('../public/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
mkdirSync(PUBLIC, { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#1a1a1a"/>
  <circle cx="196" cy="315" r="96" fill="none" stroke="#bd9b01" stroke-width="10"/>
  <text x="196" y="342" text-anchor="middle" font-family="Georgia, serif" font-size="72"
        font-weight="bold" fill="#bd9b01">BIG</text>
  <text x="340" y="280" font-family="Arial, sans-serif" font-size="44" font-weight="bold"
        fill="#ffffff">Ballentine Insurance Group</text>
  <text x="340" y="330" font-family="Arial, sans-serif" font-size="24" fill="#d4d4d4">An independent agency in the Kansas City metro</text>
  <text x="340" y="374" font-family="Arial, sans-serif" font-size="22" fill="#9c9c9c">Home · Auto · Business · Life · Specialty coverage</text>
  <text x="340" y="414" font-family="Arial, sans-serif" font-size="22" fill="#bd9b01">(816) 868-1787</text>
  <rect x="0" y="600" width="1200" height="30" fill="#bd9b01"/>
</svg>`;

const out = join(PUBLIC, 'og-default.png');
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(`og-default.png written (${(await sharp(out).metadata()).width}px)`);
