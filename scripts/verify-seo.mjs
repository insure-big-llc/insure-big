#!/usr/bin/env node
/**
 * Post-build SEO verification. website-scope.md §5.4.
 *
 * This is the automated half of the machine-readability gate. It asserts the
 * things that would silently cost rankings if they regressed:
 *
 *   1. Every one of the 7 currently-indexed URLs exists as a real static file
 *   2. Canonicals are absolute, HTTPS, bare-domain and have NO trailing slash
 *   3. Exactly one <h1> per page
 *   4. Every JSON-LD block parses, and the organization node is present
 *   5. NAP appears on every page (the live site has it on none)
 *   6. Meta description present, unique, and a sensible length
 *   7. sitemap.xml lists exactly the pages that exist
 *   8. No page has a duplicate title
 *
 * Run: npm run verify   (after npm run build)
 *
 * Exit code 1 on any failure, so it can gate a deploy.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SITE = 'https://insure-big.com';

/** The 7 indexed URLs, in the exact form sitemap.website.xml uses. */
const INDEXED_URLS = [
  '/',
  '/personal-insurance',
  '/business-insurance',
  '/life-insurance',
  '/get-a-quote',
  '/privacy-policy',
  '/terms-%26-conditions',
];

/** Pages added by the rebuild. Additive only — never a substitute for the above. */
const NEW_PAGES = ['/coverage-partners'];

/**
 * The partner destinations the live insure-big.com site links to, supplied by
 * the client on 2026-10-15. Every one must ship as a 302 /go/ redirect in
 * dist/_redirects, byte for byte. Spec 0003.
 */
const LIVE_PARTNER_URLS = [
  'https://protect.likewize.com/farmers/electronic-device-insurance?refid=ball00q&utm_medium=agent',
  'https://www.travelinsurance.com/?utm_source=pap&a_aid=65f07b225c0a4',
  'https://www.petsbest.com/enroll/step1?qv1=8849P4&qv2=AGENTLINK&ci=FIGAGTLNK',
  'https://chrisbellinsurance.com/',
  'https://fastwill.com/advisors/invite/aa4afaab2b',
  'https://14089f.propeller.insure/axelerator-public/',
  'https://solainsurance.com/quote-application/get-quote?email=bballentine%40farmersagent.com',
  'https://eventualclimate.com/request-quote/4ddde0ee-b28b-4015-918c-6d4b853d00d6',
];

const errors = [];
const warnings = [];
const notes = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/** Walk dist/ and collect every emitted .html file. */
function walkHtml(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walkHtml(full));
    } else if (entry.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

/** Map a dist html path to the site-relative URL path it serves. */
function urlPathFor(file) {
  let rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length);
  if (rel.endsWith('.html')) return '/' + rel.slice(0, -'.html'.length);
  return '/' + rel;
}

const htmlFiles = walkHtml(DIST);

/**
 * Tool pages, not site pages: the CMS admin lives in public/admin/ and is
 * excluded from the sitewide page checks (no canonical, no NAP, no schema)
 * and from the sitemap completeness check.
 */
const TOOL_PATHS = ['/admin'];

const siteHtmlFiles = htmlFiles.filter((f) => !TOOL_PATHS.some((p) => urlPathFor(f) === p || urlPathFor(f).startsWith(`${p}/`)));

// ── 1. Indexed URLs must exist ────────────────────────────────────────────────
if (!existsSync(DIST)) {
  fail('dist/ does not exist — run `npm run build` first.');
} else {
  for (const url of INDEXED_URLS) {
    const candidates =
      url === '/'
        ? [join(DIST, 'index.html')]
        : [join(DIST, `${url.slice(1)}.html`), join(DIST, url.slice(1), 'index.html')];
    if (!candidates.some(existsSync)) {
      fail(`INDEXED URL MISSING from build: ${url} — this URL is indexed today and must survive.`);
    }
  }

  // Pages added by the rebuild must also be present and linkable.
  // NOTE: build.format is 'file', so /reviews emits dist/reviews.html. Both forms
  // are checked so an Astro config change cannot silently break this assertion.
  for (const url of NEW_PAGES) {
    const candidates = [
      join(DIST, url.slice(1) + '.html'),
      join(DIST, url.slice(1), 'index.html'),
    ];
    if (!candidates.some(existsSync)) fail(`NEW PAGE MISSING from build: ${url}`);
  }
}

// ── Per-page checks ───────────────────────────────────────────────────────────
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const emitted = new Set();

for (const file of siteHtmlFiles) {
  const urlPath = urlPathFor(file);
  emitted.add(urlPath);
  const html = readFileSync(file, 'utf8');

  // 2. Canonical
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (!canonical) {
    fail(`${urlPath}: no <link rel="canonical">`);
  } else {
    if (!canonical.startsWith(SITE)) {
      fail(`${urlPath}: canonical is not on ${SITE} — got ${canonical}`);
    }
    if (canonical.includes('://www.')) {
      fail(`${urlPath}: canonical uses www — must be the bare domain`);
    }
    if (canonical.length > SITE.length + 1 && canonical.endsWith('/')) {
      fail(`${urlPath}: canonical has a TRAILING SLASH — got ${canonical}`);
    }
    if (canonicals.has(canonical)) {
      fail(`duplicate canonical ${canonical} on ${urlPath} and ${canonicals.get(canonical)}`);
    }
    canonicals.set(canonical, urlPath);
  }

  // 3. Exactly one h1
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0) fail(`${urlPath}: no <h1>`);
  if (h1Count > 1) fail(`${urlPath}: ${h1Count} <h1> elements — must be exactly 1`);

  // 5. NAP present
  if (!html.includes('(816) 868-1787')) fail(`${urlPath}: phone number missing`);
  // NAP strings match the Google Business Profiles exactly (scope 21).
  if (!html.includes('16 SE 3rd St')) fail(`${urlPath}: Lee's Summit address missing`);
  if (!html.includes('200 NE 91 St')) fail(`${urlPath}: Northland address missing`);

  // Market statement, verbatim
  if (
    !html.includes('Kansas City metro area and communities throughout Missouri and Kansas')
  ) {
    fail(`${urlPath}: market statement missing or paraphrased`);
  }

  // 4. JSON-LD parses
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) {
    fail(`${urlPath}: no JSON-LD`);
  } else {
    for (const [, body] of blocks) {
      try {
        const parsed = JSON.parse(body);
        const graph = parsed['@graph'] ?? [parsed];
        if (!graph.some((n) => n['@type'] === 'InsuranceAgency')) {
          fail(`${urlPath}: JSON-LD has no InsuranceAgency node`);
        }
      } catch (e) {
        fail(`${urlPath}: JSON-LD does not parse — ${e.message}`);
      }
    }
  }

  // 6. Title + description uniqueness
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1]?.trim();

  if (!title) {
    fail(`${urlPath}: no <title>`);
  } else {
    if (titles.has(title)) fail(`duplicate title "${title}" on ${urlPath} and ${titles.get(title)}`);
    titles.set(title, urlPath);
    if (title.length > 65) warn(`${urlPath}: title is ${title.length} chars (aim ≤60): "${title}"`);
  }

  // The 404 page is intentionally noindex and may share boilerplate.
  const isNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex/.test(html);
  if (!isNoindex) {
    if (!desc) {
      fail(`${urlPath}: no meta description`);
    } else {
      if (descriptions.has(desc)) {
        fail(`duplicate meta description on ${urlPath} and ${descriptions.get(desc)}`);
      }
      descriptions.set(desc, urlPath);
      if (desc.length < 70) warn(`${urlPath}: meta description only ${desc.length} chars`);
      if (desc.length > 165) warn(`${urlPath}: meta description ${desc.length} chars (aim ≤160)`);
    }
  }
}

// ── 7. Sitemap matches what was emitted ───────────────────────────────────────
// /sitemap.xml is generated by src/pages/sitemap.xml.ts (we removed
// @astrojs/sitemap so we control the output exactly). It must exist, list every
// indexed URL, and contain no trailing slashes or ignored elements.
const sitemapPath = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  fail('dist/sitemap.xml not found — the live site serves this path and it must survive');
} else {
  const xml = readFileSync(sitemapPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) fail('sitemap.xml contains no <loc> entries');

  for (const loc of locs) {
    if (loc.endsWith('/') && loc !== `${SITE}/`) {
      fail(`sitemap has a trailing-slash URL: ${loc}`);
    }
    if (!loc.startsWith(SITE)) fail(`sitemap entry off-domain: ${loc}`);
  }
  for (const url of INDEXED_URLS) {
    const abs = url === '/' ? `${SITE}/` : `${SITE}${url}`;
    if (!locs.includes(abs)) fail(`sitemap is missing indexed URL: ${abs}`);
  }
  if (xml.includes('<changefreq>') || xml.includes('<priority>')) {
    fail('sitemap contains changefreq/priority, which Google ignores and we deliberately omit');
  }
  if (locs.some((l) => l.includes('/404'))) {
    fail('sitemap must not list the 404 page');
  }
  const nonPage = new Set(['/404', '/llms.txt', '/sitemap.xml', ...TOOL_PATHS]);
  const orphaned = [...emitted].filter(
    (u) => !nonPage.has(u) && !locs.includes(u === '/' ? `${SITE}/` : `${SITE}${u}`),
  );
  if (orphaned.length) fail(`pages missing from sitemap: ${orphaned.join(', ')}`);

  const notBuilt = locs
    .map((l) => l.replace(SITE, '') || '/')
    .filter((p) => !emitted.has(p));
  if (notBuilt.length) fail(`sitemap lists pages that were not built: ${notBuilt.join(', ')}`);
}

// ── 8. llms.txt + llms-full.txt built ─────────────────────────────────────────
const llms = join(DIST, 'llms.txt');
if (!existsSync(llms)) {
  fail('dist/llms.txt missing');
} else {
  const body = readFileSync(llms, 'utf8');
  const linked = (body.match(/\]\(https:\/\/insure-big\.com/g) || []).length;
  if (linked < 30) {
    fail(`llms.txt links only ${linked} pages — it must cover the whole site`);
  }
}

// llms-full.txt is what an answer engine can actually QUOTE. The AI-visibility
// finding is that too little citable material exists about the agency, so an
// empty or thin file here is a real failure, not a cosmetic one.
const llmsFull = join(DIST, 'llms-full.txt');
if (!existsSync(llmsFull)) {
  fail('dist/llms-full.txt missing');
} else {
  const body = readFileSync(llmsFull, 'utf8');
  const kb = Buffer.byteLength(body, 'utf8') / 1024;
  if (kb < 20) fail(`llms-full.txt is only ${kb.toFixed(1)} KB — expected the whole site`);
  // Spot-check that it carries real prose, not just a link list.
  if (!body.includes('Q:')) fail('llms-full.txt contains no FAQ answers');
  if (!body.includes('(816) 868-1787')) fail('llms-full.txt is missing the phone number');
  if (!body.includes('Carriers')) warn('llms-full.txt may be missing the carrier list');
  const serviceHeadings = (body.match(/^### /gm) || []).length;
  if (serviceHeadings < 26) {
    fail(`llms-full.txt has only ${serviceHeadings} sections — expected all 26 service lines`);
  }
  notes.push(
    `llms-full.txt is ${kb.toFixed(0)} KB, ${serviceHeadings} sections — quotable content for answer engines`,
  );
}

// ── 9. Partner links must match the live set (spec 0003) ─────────────────────
// Parity with the live site is asserted in section 12 against dist/_redirects.
notes.push('partner parity: checked against the live URL set in section 12');

// ── 10. Partner links must be safe and labelled ───────────────────────────────
// A partner link carries noopener/noreferrer, and never leaks a window handle.
for (const file of siteHtmlFiles) {
  const html = readFileSync(file, 'utf8');
  const urlPath = urlPathFor(file);
  const outbound = [...html.matchAll(/<a\b[^>]*href="\/go\/[^"]*"[^>]*>/g)].map((m) => m[0]);
  for (const tag of outbound) {
    if (!/rel="[^"]*noopener/.test(tag)) {
      fail(`${urlPath}: partner link missing rel="noopener" — ${tag.slice(0, 90)}`);
    }
  }
}

// ── 11. Reviews ───────────────────────────────────────────────────────────────
// The /reviews page was removed by the client (2026-10-26); the home page keeps
// the organization-level review markup and each location page keeps its own
// office's reviews and aggregate. The same guards run against those pages.
const homePage = join(DIST, 'index.html');
if (!existsSync(homePage)) {
  fail('dist/index.html missing');
} else {
  const html = readFileSync(homePage, 'utf8');
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) {
    fail('/: no JSON-LD');
  } else {
    let parsed;
    try {
      parsed = JSON.parse(ld[1]);
    } catch (e) {
      fail(`/: JSON-LD does not parse — ${e.message}`);
    }
    if (parsed) {
      const org = (parsed['@graph'] ?? []).find((n) => n['@id'] === `${SITE}/#organization`);
      if (!org) {
        fail('/: organization node missing');
      } else {
        const reviews = org.review ?? [];
        if (reviews.length === 0) fail('/: no Review nodes');
        if (!org.aggregateRating) {
          fail('/: no aggregateRating');
        } else if (org.aggregateRating.reviewCount < 10) {
          warn(`/: aggregateRating.reviewCount is ${org.aggregateRating.reviewCount}`);
        }
        // ⚠️ A staff member's rating-only submission must NEVER be marked up as a
        // customer review. Rendered as a testimonial it would be misleading, and
        // Google's policy prohibits marking up non-genuine reviews.
        const staffNames = ['Ashley Neugebauer'];
        for (const r of reviews) {
          const name = r.author?.name ?? '';
          if (staffNames.includes(name)) {
            fail(`/: STAFF review "${name}" is present in Review markup — must be excluded`);
          }
          // datePublished must only exist where a real calendar date is known.
          if ('datePublished' in r && !/^\d{4}-\d{2}-\d{2}$/.test(r.datePublished)) {
            fail(`/: malformed datePublished "${r.datePublished}"`);
          }
        }
        notes.push(
          `/: ${reviews.length} Review nodes, aggregate ${org.aggregateRating?.ratingValue}/${org.aggregateRating?.reviewCount}, 0 staff reviews`,
        );
      }
    }
  }

  // Reviews must be reproduced in full, not truncated with an ellipsis.
  if (/&hellip;|\.\.\.<\/blockquote>/.test(html)) {
    fail('/: a review appears to be truncated — reviews must be reproduced in full');
  }
}

// Each office page carries its own reviews and aggregate, attributed to the
// right LocalBusiness node.
for (const [slug, expectedCount] of [['lees-summit', 83], ['northland', 54]]) {
  const page = join(DIST, `${slug}.html`);
  if (!existsSync(page)) {
    fail(`dist/${slug}.html missing`);
    continue;
  }
  const html = readFileSync(page, 'utf8');
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) {
    fail(`/${slug}: no JSON-LD`);
    continue;
  }
  let parsed;
  try {
    parsed = JSON.parse(ld[1]);
  } catch (e) {
    fail(`/${slug}: JSON-LD does not parse — ${e.message}`);
    continue;
  }
  const officeId = `${SITE}/#location-${slug}`;
  const org = (parsed['@graph'] ?? []).find((n) => n['@id'] === `${SITE}/#organization`);
  const node = (org?.location ?? []).find((n) => n['@id'] === officeId);
  if (!node) {
    fail(`/${slug}: office node ${officeId} missing`);
    continue;
  }
  const reviews = node.review ?? [];
  if (reviews.length === 0) fail(`/${slug}: no Review nodes on the office node`);
  if (node.aggregateRating?.reviewCount !== expectedCount) {
    fail(`/${slug}: office aggregate reviewCount is ${node.aggregateRating?.reviewCount}, expected ${expectedCount}`);
  }
  for (const r of reviews) {
    if (r.itemReviewed?.['@id'] !== officeId) {
      fail(`/${slug}: a Review node does not itemReviewed the office node`);
    }
  }
  notes.push(`/${slug}: ${reviews.length} Review nodes, aggregate ${node.aggregateRating?.ratingValue}/${node.aggregateRating?.reviewCount}`);
}

// ── 12. Partner redirects generated, all eight live URLs shipped ──────────────
const redirects = join(DIST, '_redirects');
if (!existsSync(redirects)) {
  fail('dist/_redirects missing');
} else {
  const body = readFileSync(redirects, 'utf8');
  const goRules = (body.match(/^\/go\//gm) || []).length;
  if (goRules === 0) fail('_redirects has no /go/ partner rules — postbuild did not run');
  for (const url of LIVE_PARTNER_URLS) {
    if (!body.includes(url)) {
      fail(`_redirects is missing the live partner URL: ${url}`);
    }
  }
  // Every /go/ rule must be a 302: a permanent redirect would hand the partner
  // the authority for that path.
  const badStatus = body
    .split('\n')
    .filter((l) => l.startsWith('/go/') && !/\s302(\s|$)/.test(l));
  if (badStatus.length) {
    fail(`${badStatus.length} /go/ rule(s) are not 302: ${badStatus.join(' | ')}`);
  }
  notes.push(`_redirects: ${goRules} tracked partner redirect(s), all ${LIVE_PARTNER_URLS.length} live URLs shipped`);
}
// ── 13. FONTS — the claim must be true ───────────────────────────────────────
// W2: the site must actually ship self-hosted brand fonts. This assertion exists
// because an earlier build pass named the fonts in CSS while shipping none.
const fontsCssPath = join(DIST, 'fonts.css');
if (!existsSync(fontsCssPath)) {
  fail('dist/fonts.css missing — @font-face declarations not generated');
} else {
  const faces = (readFileSync(fontsCssPath, 'utf8').match(/@font-face/g) || []).length;
  if (faces < 5) fail(`fonts.css declares only ${faces} faces — expected 5`);
  notes.push(`fonts: ${faces} @font-face declarations`);
}
const fontDir = join(DIST, 'fonts');
if (!existsSync(fontDir)) {
  fail('dist/fonts/ missing — no self-hosted font files shipped');
} else {
  const woff2 = readdirSync(fontDir).filter((f) => f.endsWith('.woff2'));
  if (woff2.length < 5) fail(`dist/fonts has only ${woff2.length} woff2 files — expected 5`);
  notes.push(`fonts: ${woff2.length} woff2 files (${(woff2.reduce((n, f) => n + statSync(join(fontDir, f)).size, 0) / 1024).toFixed(1)} KB)`);
}

// ── 14. TYPOGRAPHY — no content below 16px, prose at 18px ────────────────────
// W1: 456 paragraphs used to render at 14px. The escalation lives in global.css
// and lands in the built CSS, so assert the declaration made it through the build.
// Local CSS walk — walkHtml above is html-only, so recurse here instead.
function walkCss(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkCss(full));
    else if (entry.endsWith('.css')) out.push(full);
  }
  return out;
}
let builtCss = '';
for (const f of walkCss(DIST)) {
  builtCss += readFileSync(f, 'utf8');
}
if (!builtCss.includes('font-size:1.125rem')) {
  fail('built CSS has no 18px prose rule — .prose-page p is not 1.125rem');
}
if (!builtCss.includes('main p.text-sm')) {
  fail('built CSS has no content-size escalation rule — text-sm paragraphs still render at 14px');
}
notes.push('typography: 18px prose + 16px content floor rules present');

// ── 14b. ACCESSIBILITY — focus visibility, skip link, no gold as text ────────
// The brand gold #bd9b01 is 2.6:1 on white and fails WCAG AA for any text. It
// is allowed for borders, icons and fills only. The focus rule and the skip
// link must survive every build, or keyboard users lose their way in.
if (!builtCss.includes(':focus-visible')) {
  fail('built CSS has no :focus-visible rule — keyboard focus would be invisible');
}
if (!builtCss.includes('.skip-link:focus')) {
  fail('built CSS has no .skip-link:focus rule — the skip link could never appear');
}
let goldAsText = 0;
for (const file of siteHtmlFiles) {
  goldAsText += (readFileSync(file, 'utf8').match(/text-\[var\(--color-brand-500\)\]/g) || []).length;
}
if (goldAsText > 0) {
  fail(`built HTML uses the brand gold as text color on ${goldAsText} element(s) — 2.6:1 on white fails WCAG AA`);
}
notes.push('accessibility: focus-visible rule, skip link rule, and no gold-as-text asserted');

// ── 15. OG IMAGE — every page must carry one ──────────────────────────────────
for (const file of siteHtmlFiles) {
  const html = readFileSync(file, 'utf8');
  const urlPath = urlPathFor(file);
  if (!/<meta property="og:image"/.test(html)) {
    fail(`${urlPath}: no og:image — shared links would render as bare text`);
  }
}

// ── 16. SPECIALIST PAGES — original content floor + FAQ ───────────────────────
// W3: every specialist page must carry substantive original content and a FAQ
// block. Word count is measured on the visible text inside <main>.
const SPECIALIST_SLUGS = ['surety-bonds','travel','pet','device-protection','sola-wind-hail','premium-lock','farmers-insurance'];
for (const slug of SPECIALIST_SLUGS) {
  const f = join(DIST, 'specialty', `${slug}.html`);
  if (!existsSync(f)) { fail(`/specialty/${slug} missing`); continue; }
  const html = readFileSync(f, 'utf8');
  if (!html.includes('Understanding')) {
    fail(`/specialty/${slug}: missing the original explanatory section`);
  }
  if (!html.includes('<summary')) {
    fail(`/specialty/${slug}: no FAQ block`);
  }
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  const words = (main.match(/\b[a-z]{2,}\b/gi) || []).length;
  if (words < 300) {
    fail(`/specialty/${slug}: only ${words} words of visible content — floor is 300`);
  }
}
notes.push(`specialty pages: content floor checked for ${SPECIALIST_SLUGS.length} pages`);

// ── 17. PARTNER LINKS — informational labels, never transactional ────────────
// W3: the live site's intent is "LEARN MORE". "Continue to X" / "Go to X" reads
// as a transaction. Both labels are banned from partner CTAs.
for (const file of siteHtmlFiles) {
  const html = readFileSync(file, 'utf8');
  const urlPath = urlPathFor(file);
  for (const banned of ['Continue to', 'Go to']) {
    const m = html.match(new RegExp(`<a[^>]*href="/go/[^"]*"[^>]*>[^<]*${banned}`));
    if (m) {
      fail(`${urlPath}: partner link uses transactional label "${banned}" — must be "Learn more at"`);
    }
  }
}
// ── 13. Blog (spec 0004) ─────────────────────────────────────────────────────
// Duplicate slugs or malformed frontmatter already fail the build itself
// (the collection schema and Astro's duplicate path check). This section
// guards the visibility rules: drafts stay out of the sitemap, published
// posts appear in it, and the blog index exists.
const blogContentDir = new URL('../src/content/blog/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const blogIndexHtml = join(DIST, 'blog.html');
if (!existsSync(blogIndexHtml)) {
  fail('dist/blog.html missing');
} else {
  const sitemapBody = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  if (!sitemapBody.includes(`${SITE}/blog`)) fail('/blog missing from the sitemap');
  const seen = new Map();
  for (const name of readdirSync(blogContentDir)) {
    if (!name.endsWith('.md')) continue;
    const raw = readFileSync(join(blogContentDir, name), 'utf8');
    const slug = (raw.match(/^slug:\s*['"]?([\w-]+)/m) ?? [])[1];
    const draft = /^draft:\s*true/m.test(raw);
    if (!slug) {
      fail(`blog post ${name}: no slug in frontmatter`);
      continue;
    }
    if (seen.has(slug)) fail(`blog: duplicate slug "${slug}" (${seen.get(slug)} and ${name})`);
    seen.set(slug, name);
    const inSitemap = sitemapBody.includes(`${SITE}/blog/${slug}`);
    if (draft && inSitemap) fail(`blog: draft post "${slug}" appears in the sitemap`);
    if (!draft && !inSitemap) fail(`blog: published post "${slug}" missing from the sitemap`);
    const postHtml = join(DIST, 'blog', `${slug}.html`);
    if (!existsSync(postHtml)) {
      fail(`blog: post page dist/blog/${slug}.html missing`);
      continue;
    }
    const html = readFileSync(postHtml, 'utf8');
    if (draft && !html.includes('name="robots" content="noindex')) {
      fail(`blog: draft post "${slug}" is not noindexed`);
    }
  }
  if (seen.size) notes.push(`blog posts: ${[...seen.keys()].join(', ')}`);
}

// ── 12.5. AISO schema and zero-click FAQs (scope 19 and 20) ─────────────────
// The org node must carry Bret's broad capability phrases and the four
// InsuranceProduct nodes. Every FAQ on a page must open with a short answer
// of 45 words or fewer, the zero-click pattern.
{
  const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
  const blocks = [...homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  });
  const flat = blocks.flatMap((b) => (Array.isArray(b) ? b : b?.['@graph'] ?? (b ? [b] : [])));
  const org = (flat.find((n) => n?.['@id'] === `${SITE}/#organization`) ?? null);
  if (!org) {
    fail('org node missing from the homepage graph');
  } else {
    const knows = org.knowsAbout ?? [];
    for (const phrase of ['Commercial Risk Management', 'Asset Protection', 'Estate Planning', 'Property and Casualty Insurance']) {
      if (!knows.includes(phrase)) fail(`org knowsAbout missing "${phrase}"`);
    }
    const offers = org.makesOffer ?? [];
    if (offers.length !== 4) {
      fail(`org makesOffer must carry exactly 4 InsuranceProduct nodes, found ${offers.length}`);
    } else {
      for (const name of ['Homeowners Insurance', 'Automobile Insurance', 'Life Insurance', 'Commercial Business Insurance']) {
        if (!offers.some((o) => o['@type'] === 'InsuranceProduct' && o.name === name)) {
          fail(`org makesOffer missing the InsuranceProduct "${name}"`);
        }
      }
    }
  }
}

for (const file of siteHtmlFiles) {
  const html = readFileSync(file, 'utf8');
  // Count only inside the FAQ section (the nav also uses details/summary).
  const faqSections = html.split('<section class="mt-14">').slice(1);
  for (const section of faqSections) {
    const detailsCount = (section.match(/<details[\s>]/g) || []).length;
    const shorts = [...section.matchAll(/<p class="faq-short[^"]*"[^>]*>([\s\S]*?)<\/p>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim(),
    );
    const urlPath = urlPathFor(file);
    if (shorts.length !== detailsCount) {
      fail(`${urlPath}: ${detailsCount} FAQ question(s) but ${shorts.length} short answer(s) — every FAQ needs a zero-click lead`);
    }
    for (const s of shorts) {
      const words = s.split(/\s+/).filter(Boolean).length;
      if (words > 45) fail(`${urlPath}: a short answer runs ${words} words (ceiling 45)`);
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
const n = emitted.size;
console.log(`\nSEO verification — ${n} page(s) in dist/\n`);

if (notes.length) {
  for (const note of notes) console.log(`ℹ  ${note}`);
  console.log('');
}

if (warnings.length) {
  console.log(`⚠  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`   • ${w}`);
  console.log('');
}

if (errors.length) {
  console.log(`✗  ${errors.length} error(s):`);
  for (const e of errors) console.log(`   • ${e}`);
  console.log('');
  process.exit(1);
}

console.log('✓  All checks passed.');
console.log(`   • 7 indexed URLs present`);
console.log(`   • canonicals absolute, no-slash, unique`);
console.log(`   • one <h1> per page`);
console.log(`   • NAP + market statement sitewide`);
console.log(`   • JSON-LD parses with an InsuranceAgency node`);
console.log(`   • titles and descriptions unique`);
console.log(`   • sitemap.xml and llms.txt complete\n`);
