/**
 * Team portrait processor (run by hand, NOT part of prebuild).
 *
 *   node scripts/process-team-photos.mjs
 *
 * Reads the client's portraits from ../evidence/BIG files/Team Pictures (client
 * material, never committed) and writes small, consistently graded webp files to
 * public/team/. Only that output is committed.
 *
 * Grade: every portrait gets the same treatment so five different shoots read as
 * one set. Grayscale, levels stretched to the same black and white points, a
 * gentle S curve for contrast, a light sharpen after the downscale, and a soft
 * vignette that pulls the background toward the same charcoal. Sharp strips all
 * metadata (EXIF, GPS) by default.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(ROOT, '..', 'evidence', 'BIG files', 'Team Pictures');
const OUT = join(ROOT, 'public', 'team');
mkdirSync(OUT, { recursive: true });

/**
 * Per person crop of the 1254px source, as a square: [left, top, size].
 * Chosen so the head is a similar size and the eyes sit about 38 percent from
 * the top in every portrait.
 */
const PORTRAITS = [
  { from: 'Bret Ballentine.png', slug: 'bret-ballentine', crop: [90, 40, 1074] },
  { from: 'Pete Carroll.png', slug: 'pete-carroll', crop: [0, 0, 1254] },
  { from: 'Rodney Roberts.png', slug: 'rodney-roberts', crop: [60, 30, 1134] },
  { from: 'Dillon Schallenberg.png', slug: 'dillon-schallenberg', crop: [80, 50, 1094] },
  { from: 'Ashley Neugebauer.png', slug: 'ashley-neugebauer', crop: [0, 0, 1254] },
];

const SIZES = [640];

/** A radial vignette as an SVG overlay: transparent centre, charcoal edges. */
function vignette(size) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <defs><radialGradient id="g" cx="50%" cy="42%" r="75%">
         <stop offset="55%" stop-color="#1c1c1c" stop-opacity="0"/>
         <stop offset="100%" stop-color="#1c1c1c" stop-opacity="0.55"/>
       </radialGradient></defs>
       <rect width="100%" height="100%" fill="url(#g)"/>
     </svg>`,
  );
}

async function grade(pipeline, size) {
  const base = await pipeline
    .resize(size, size, { fit: 'cover', kernel: 'lanczos3' })
    .grayscale()
    .normalise({ lower: 1, upper: 99 })
    .gamma(1.05)
    .linear(1.08, -10)
    .sharpen({ sigma: 0.8, m1: 0.9, m2: 1.4 })
    .toBuffer();
  return sharp(base)
    .composite([{ input: vignette(size), blend: 'multiply' }])
    .webp({ quality: 80, effort: 5 });
}

for (const p of PORTRAITS) {
  const input = join(SRC, p.from);
  if (!existsSync(input)) {
    console.error(`missing source: ${input}`);
    process.exitCode = 1;
    continue;
  }
  const [left, top, size] = p.crop;
  for (const s of SIZES) {
    const file = s === 640 ? `${p.slug}.webp` : `${p.slug}-${s}.webp`;
    const pipeline = sharp(input).extract({ left, top, width: size, height: size });
    const out = await (await grade(pipeline, s)).toFile(join(OUT, file));
    console.log(`${file.padEnd(34)} ${s}x${s}  ${(out.size / 1024).toFixed(0)} KB`);
  }
}

// The group photo: 2:3 portrait. Same grade, two widths.
const group = join(SRC, 'Team.png');
if (existsSync(group)) {
  for (const w of [800, 480]) {
    const h = Math.round((w * 3) / 2);
    const base = await sharp(group)
      .resize(w, h, { fit: 'cover', kernel: 'lanczos3' })
      .grayscale()
      .normalise({ lower: 1, upper: 99 })
      .gamma(1.05)
      .linear(1.08, -10)
      .sharpen({ sigma: 0.8, m1: 0.9, m2: 1.4 })
      .webp({ quality: 74, effort: 5 })
      .toFile(join(OUT, `team-group-${w}.webp`));
    console.log(`team-group-${w}.webp`.padEnd(34), `${w}x${h}`, `${(base.size / 1024).toFixed(0)} KB`);
  }
} else {
  console.error(`missing source: ${group}`);
  process.exitCode = 1;
}
