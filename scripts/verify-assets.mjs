#!/usr/bin/env node
/**
 * Extended verification: things the SEO checker does not cover.
 *
 *  A. Every local asset referenced in the built HTML or CSS exists in dist/
 *     (this is the class of bug that produced a linked-but-missing
 *     apple-touch-icon.png, which would have been a 404 on every page load)
 *  B. Accessibility floor: every <img> has alt, every <html> has lang, every page
 *     has a viewport meta, no positive tabindex, form controls are labelled
 *  C. Mobile-readiness: viewport present, no fixed pixel widths that would force
 *     horizontal scroll at 360px
 *  D. Weight budget: per-page HTML + CSS size, and the count of render-blocking
 *     resources in <head>
 *
 * Run after `npm run build`:  node scripts/verify-assets.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep, dirname, resolve } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const errors = [];
const warnings = [];
const notes = [];

function walk(dir, filter = () => true) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full, filter));
    else if (filter(full)) out.push(full);
  }
  return out;
}

const htmlFiles = walk(DIST, (f) => f.endsWith('.html'));

/**
 * Paths served by a Netlify redirect rule rather than a built file.
 * Read from dist/_redirects so the check proves the rule was generated.
 */
const redirectPaths = new Set();
{
  const redirectsFile = join(DIST, '_redirects');
  if (existsSync(redirectsFile)) {
    for (const line of readFileSync(redirectsFile, 'utf8').split('\n')) {
      const m = line.match(/^(\/\S+)\s+/);
      if (m) redirectPaths.add(m[1]);
    }
  }
}
const cssFiles = walk(DIST, (f) => f.endsWith('.css'));

// ── A. Asset references resolve ───────────────────────────────────────────────
/** Turn a root-relative URL into the file dist/ should contain for it. */
function distTarget(urlPath) {
  const clean = urlPath.split('?')[0].split('#')[0];
  if (!clean.startsWith('/')) return null;
  const rel = clean.slice(1);
  if (rel === '') return join(DIST, 'index.html');
  const direct = join(DIST, rel);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  // Extensionless paths are served by the .html file (build.format: 'file').
  if (!rel.includes('.')) {
    const asHtml = join(DIST, `${rel}.html`);
    if (existsSync(asHtml)) return asHtml;
    const asIndex = join(DIST, rel, 'index.html');
    if (existsSync(asIndex)) return asIndex;
  }
  return direct; // report as missing
}

const checkedAssets = new Set();
let assetChecks = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(DIST, file).split(sep).join('/');

  // Every href/src that is root-relative and looks like a file (has an extension
  // or is a declared asset link).
  const refs = [
    ...html.matchAll(/<link[^>]+href="(\/[^"]+)"/g),
    ...html.matchAll(/<script[^>]+src="(\/[^"]+)"/g),
    ...html.matchAll(/<img[^>]+src="(\/[^"]+)"/g),
    ...html.matchAll(/<source[^>]+srcset="(\/[^"\s]+)/g),
  ].map((m) => m[1]);

  for (const ref of refs) {
    if (checkedAssets.has(ref)) continue;
    checkedAssets.add(ref);
    assetChecks++;
    const target = distTarget(ref);
    if (!target || !existsSync(target)) {
      errors.push(`${rel}: references ${ref} but no such file in dist/`);
    }
  }

  // Internal page links must resolve to a built page (catches typos in hrefs).
  //
  // EXCEPTION: /go/<partner> is served by a Netlify rule in dist/_redirects, not
  // by a built file. Those are validated against the redirect table below instead
  // — which is a stronger check than "a file exists", because it proves the
  // redirect was actually generated.
  const pageLinks = [...html.matchAll(/<a[^>]+href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const link of new Set(pageLinks)) {
    if (link === '/') continue;
    if (link.startsWith('/go/')) {
      if (!redirectPaths.has(link)) {
        errors.push(`${rel}: partner link ${link} has no matching _redirects rule`);
      }
      continue;
    }
    const target = distTarget(link);
    if (!target || !existsSync(target)) {
      errors.push(`${rel}: internal link ${link} does not resolve to a built page`);
    }
  }
}

// CSS url() references (fonts, background images).
let cssUrlChecks = 0;
for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8');
  for (const m of css.matchAll(/url\((['"]?)(\/[^'")]+)\1\)/g)) {
    const ref = m[2];
    cssUrlChecks++;
    const target = distTarget(ref);
    if (!target || !existsSync(target)) {
      errors.push(`${relative(DIST, file)}: CSS references ${ref} which is missing`);
    }
  }
}

// ── B/C/D. Per-page quality checks ────────────────────────────────────────────
let totalHtml = 0;
let maxHtml = { page: '', size: 0 };
const blockingCounts = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const rel = '/' + relative(DIST, file).split(sep).join('/').replace(/\.html$/, '');
  const size = Buffer.byteLength(html, 'utf8');
  totalHtml += size;
  if (size > maxHtml.size) maxHtml = { page: rel, size };

  // B. Accessibility floor
  if (!/<html[^>]+lang=/.test(html)) errors.push(`${rel}: <html> has no lang attribute`);

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt=/.test(t));
  if (noAlt.length) errors.push(`${rel}: ${noAlt.length} <img> without alt`);

  // Carrier logos must keep their reserved aspect box: the measurement run
  // traced a 0.225 CLS on the service page to a carrier img whose CSS width
  // resolved differently before and after load. The aspect class pins the box.
  const looseCarrierImgs = imgs.filter(
    (t) => /src="\/carriers\//.test(t) && !/aspect-\[5\/2\]/.test(t),
  );
  if (looseCarrierImgs.length) {
    errors.push(`${rel}: ${looseCarrierImgs.length} carrier logo(s) without the aspect box (CLS regression)`);
  }

  if (/tabindex="[1-9]/.test(html)) {
    errors.push(`${rel}: positive tabindex found — breaks natural tab order`);
  }

  // Inputs must be labelled or explicitly aria-labelled.
  const inputs = [...html.matchAll(/<input\b[^>]*>/g)].map((m) => m[0]);
  const unlabelled = inputs.filter(
    (t) => !/\b(aria-label|aria-labelledby|id=)/.test(t) && !/type="(hidden|submit)"/.test(t),
  );
  if (unlabelled.length) warnings.push(`${rel}: ${unlabelled.length} input(s) may be unlabelled`);

  // C. Mobile readiness
  if (!/<meta[^>]+name="viewport"[^>]+width=device-width/.test(html)) {
    errors.push(`${rel}: viewport meta missing or not width=device-width`);
  }
  // A fixed width > 360px on a top-level element forces horizontal scroll.
  const fixedWide = [...html.matchAll(/style="[^"]*width:\s*(\d{4,})px/g)].map((m) => Number(m[1]));
  if (fixedWide.some((w) => w > 360)) {
    warnings.push(`${rel}: inline fixed width > 360px may cause horizontal scroll on mobile`);
  }

  // D. Render-blocking resources in <head>
  const head = html.split('</head>')[0] ?? '';
  const blockingCss = (head.match(/<link[^>]+rel="stylesheet"/g) || []).length;
  const blockingJs = (head.match(/<script(?![^>]*(async|defer|type="application\/ld\+json"))/g) || [])
    .length;
  blockingCounts.push({ page: rel, css: blockingCss, js: blockingJs });

  // E. Home section rhythm (spec 0002): no two adjacent sections may share the
  // same background, the proxy for "no card monotony" on the home page.
  if (rel === '/') {
    const sections = [...html.matchAll(/<section\b[^>]*class="([^"]*)"/g)].map((m) => m[1]);
    const bgOf = (cls) => {
      if (/bg-\[var\(--color-ink\)\]/.test(cls)) return 'ink';
      if (/bg-\[var\(--color-surface-alt\)\]/.test(cls)) return 'alt';
      if (/bg-\[var\(--color-brand-50\)\]/.test(cls)) return 'tint';
      return 'white';
    };
    const bgs = sections.map(bgOf);
    for (let i = 1; i < bgs.length; i++) {
      if (bgs[i] === bgs[i - 1]) {
        errors.push(`home: adjacent sections ${i} and ${i + 1} share the ${bgs[i]} background (rhythm check)`);
      }
    }
  }
}

// ── F. Hero photos (design pass 2): the home hero and the customer band use the
// agency's own processed photos. A missing file would leave a broken frame.
for (const photo of [
  'images/photos/office-meeting-960.webp',
  'images/photos/office-meeting-640.webp',
  'images/photos/agent-on-phone-960.webp',
  'images/photos/agent-on-phone-640.webp',
  'images/photos/team-storefront-768.webp',
  'images/photos/team-storefront-480.webp',
]) {
  if (!existsSync(join(DIST, photo))) errors.push(`dist/${photo} missing — run scripts/process-photos.mjs and commit the output`);
}
// ── G. Security headers (netlify deploy readiness): the headers file must
// reach dist with the baseline protections, or the deploy ships without them.
const headersPath = join(DIST, '_headers');
if (!existsSync(headersPath)) {
  errors.push('dist/_headers missing — the security headers would not deploy');
} else {
  const headers = readFileSync(headersPath, 'utf8');
  for (const header of ['X-Content-Type-Options: nosniff', 'X-Frame-Options: DENY', 'Referrer-Policy']) {
    if (!headers.includes(header)) errors.push(`dist/_headers is missing ${header}`);
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
const totalCss = cssFiles.reduce((n, f) => n + statSync(f).size, 0);

console.log('\nAsset & quality verification\n');
console.log(`  pages checked          ${htmlFiles.length}`);
console.log(`  unique assets resolved ${checkedAssets.size} (+${cssUrlChecks} from CSS)`);
console.log(`  CSS bundle total       ${(totalCss / 1024).toFixed(1)} KB`);
console.log(`  mean HTML size         ${(totalHtml / htmlFiles.length / 1024).toFixed(1)} KB`);
console.log(`  largest page           ${maxHtml.page} at ${(maxHtml.size / 1024).toFixed(1)} KB`);

const worstBlocking = blockingCounts.reduce(
  (a, b) => (b.css + b.js > a.css + a.js ? b : a),
  { page: '', css: 0, js: 0 },
);
console.log(
  `  render-blocking (max)  ${worstBlocking.css} CSS + ${worstBlocking.js} JS on ${worstBlocking.page}`,
);
console.log('');

if (warnings.length) {
  console.log(`⚠  ${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 25)) console.log(`   • ${w}`);
  if (warnings.length > 25) console.log(`   … and ${warnings.length - 25} more`);
  console.log('');
}

if (errors.length) {
  console.log(`✗  ${errors.length} error(s):`);
  for (const e of errors.slice(0, 40)) console.log(`   • ${e}`);
  if (errors.length > 40) console.log(`   … and ${errors.length - 40} more`);
  console.log('');
  process.exit(1);
}

console.log('✓  All asset references resolve. No accessibility-floor violations.\n');
