/**
 * One-off photo processor (run by hand, NOT part of prebuild).
 *
 * Turns the agency's own public Facebook photos into small, clean web files.
 * The originals live in ../evidence/Screenshot (client material, never
 * committed). Only the processed webp output lands in public/images/photos/,
 * and that output is what gets committed.
 *
 *   node scripts/process-photos.mjs
 *
 * Sharp strips all metadata (EXIF, GPS) by default, which is what we want for
 * files that ship to the public.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(ROOT, '..', 'evidence', 'Screenshot');
const OUT = join(ROOT, 'public', 'images', 'photos');
mkdirSync(OUT, { recursive: true });

const jobs = [
  {
    from: '469854172_1530818844276648_9188942510317067200_n.jpg',
    name: 'office-meeting',
    sizes: [
      [960, 720],
      [640, 480],
    ],
  },
  {
    from: '471161558_1538746753483857_1745505606593644241_n.jpg',
    name: 'agent-on-phone',
    sizes: [
      [960, 720],
      [640, 480],
    ],
  },
  {
    from: '481957233_1171334475003303_8267794646933288770_n.jpg',
    name: 'team-storefront',
    quality: 68, // busy street scene: lower quality keeps the weight sensible
    sizes: [
      [768, 1024],
      [480, 640],
    ],
  },
];

for (const job of jobs) {
  const input = join(SRC, job.from);
  if (!existsSync(input)) {
    console.error(`missing source: ${input}`);
    process.exitCode = 1;
    continue;
  }
  for (const [w, h] of job.sizes) {
    const file = `${job.name}-${w}.webp`;
    const info = await sharp(input)
      .resize(w, h, { fit: 'cover', position: 'attention', withoutEnlargement: true })
      .modulate({ saturation: 1.04 })
      .sharpen({ sigma: 0.5 })
      .webp({ quality: job.quality ?? 80, effort: 5 })
      .toFile(join(OUT, file));
    console.log(`wrote public/images/photos/${file}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
