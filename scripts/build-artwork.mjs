/**
 * Generates the brand artwork: the hero backdrop and themed per-line
 * illustrations for the hub and specialty pages.
 *
 * Abstract line drawings on purpose: they decorate with the thing the page
 * sells (a house, a building, an umbrella, a shield), never fabricated photos
 * of people or places. Deterministic (no randomness), so every build produces
 * the same files. Outputs land in public/images/art/.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT = join(ROOT, 'public', 'images', 'art');
mkdirSync(OUT, { recursive: true });

const INK = '#1a1a1a';
const GOLD = '#bd9b01';

/** One shield outline path, centered on (cx, cy), sized by s. */
function shield(cx, cy, s, opacity) {
  const w = s;
  const h = s * 1.15;
  return `
    <path d="M ${cx - w / 2} ${cy - h / 2}
             L ${cx - w / 2} ${cy - h * 0.15}
             Q ${cx - w / 2} ${cy + h / 2} ${cx} ${cy + h / 2}
             Q ${cx + w / 2} ${cy + h / 2} ${cx + w / 2} ${cy - h * 0.15}
             L ${cx + w / 2} ${cy - h / 2}
             Q ${cx} ${cy - h / 2 - h * 0.12} ${cx - w / 2} ${cy - h / 2} Z"
      fill="none" stroke="${GOLD}" stroke-opacity="${opacity}" stroke-width="${Math.max(2, s / 90)}" />`;
}

function svg(width, height, motif) {
  // Duotone ink with gold ink, plus a soft gold glow behind the motif so the
  // line art reads as lit rather than flat (spec 0006, AC-6).
  const glow = `
  <defs>
    <radialGradient id="glow" cx="62%" cy="50%" r="55%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.16" />
      <stop offset="60%" stop-color="${GOLD}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#glow)" />`;
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${INK}" />
  ${glow}
  ${motif}
</svg>`);
}

/** A large outline drawing sits on the right; the left stays calm for text. */
function drawing(paths, opacity = 0.14, extra = '') {
  return `
  ${paths
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="${GOLD}" stroke-opacity="${opacity}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
    )
    .join('\n  ')}
  ${extra}`;
}

const house = drawing([
  'M 980 260 L 1330 520 L 1680 260',
  'M 1020 300 L 1020 620 L 1640 620 L 1640 300',
  'M 1220 620 L 1220 480 L 1430 480 L 1430 620',
], 0.16);

const business = drawing([
  'M 1020 220 L 1020 640 L 1660 640 L 1660 220 Z',
  'M 1060 640 L 1060 180 L 1300 180 L 1300 640',
  'M 1180 240 L 1180 300 M 1180 340 L 1180 400 M 1180 440 L 1180 500 M 1180 540 L 1180 590',
  'M 1120 120 L 1240 80 L 1560 120',
], 0.16);

const life = drawing([
  'M 1340 200 A 300 300 0 0 1 1640 500 A 300 300 0 0 1 1340 800 A 300 300 0 0 1 1040 500 A 300 300 0 0 1 1340 200 Z',
  'M 1340 500 L 1340 780',
  'M 1180 500 A 160 160 0 0 1 1500 500',
], 0.16);

const specialty = drawing([
  'M 1340 180 L 1680 180 L 1680 500 Q 1680 760 1340 840 Q 1000 760 1000 500 L 1000 180 Z',
  'M 1130 380 L 1340 620 L 1560 330',
], 0.16);

const jobs = [
  // The hero shield sits right so roughly half of it centers behind the logo card.
  { file: 'hero-art.webp', width: 1600, height: 900, motif: shield(1260, 520, 420, 0.09) },
  { file: 'band-art.webp', width: 1600, height: 420, motif: shield(1320, 210, 260, 0.08) },
  { file: 'house-art.webp', width: 1600, height: 420, motif: house },
  { file: 'business-art.webp', width: 1600, height: 420, motif: business },
  { file: 'life-art.webp', width: 1600, height: 420, motif: life },
  { file: 'specialty-art.webp', width: 1600, height: 420, motif: specialty },
];

for (const j of jobs) {
  await sharp(svg(j.width, j.height, j.motif))
    .webp({ quality: 82 })
    .toFile(join(OUT, j.file));
  console.log(`wrote public/images/art/${j.file}`);
}
console.log('artwork generation done');
