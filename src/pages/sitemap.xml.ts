/**
 * /sitemap.xml — owned outright rather than delegated to @astrojs/sitemap.
 *
 * The live site already serves https://insure-big.com/sitemap.xml, so that exact
 * path must keep working after cutover. Writing it here means:
 *
 *   - every URL is derived from the same config the pages use, so the sitemap
 *     can never list a page that does not exist, or miss one that does
 *   - NO trailing slashes, matching the canonical form (website-scope.md §4)
 *   - NO <changefreq> or <priority> — Google ignores both, and the current
 *     GoDaddy sitemap sets them on every entry, which is pure noise
 *   - the 404 page is excluded; it is noindex
 *
 * website-scope.md §5.1.
 */
import type { APIRoute } from 'astro';
import { publishedPosts } from '../lib/blog-posts.js';
import { SITE, absoluteUrl, LOCATIONS } from '../config/site.js';
import { HUBS, SERVICES, servicePath } from '../config/services.js';

export const prerender = true;

/** Every indexable path on the site, in a deliberate order. */
function allPaths(): string[] {
  const paths: string[] = ['/'];

  // The three indexed hubs, then their children.
  for (const hub of HUBS) {
    paths.push(`/${hub.slug}`);
    for (const s of SERVICES.filter((x) => x.hub === hub.slug)) {
      paths.push(`/${hub.slug}/${s.slug}`);
    }
  }

  // Specialty pages. There is no /specialty index — each one is a landing page.
  for (const s of SERVICES.filter((x) => x.hub === 'specialty')) {
    paths.push(servicePath(s));
  }

  // The blog index and every published post. Drafts stay out. Spec 0004.
  paths.push('/blog');
  for (const p of publishedPosts()) {
    paths.push(`/blog/${p.slug}`);
  }

  // Site pages. Order roughly mirrors importance.
  paths.push('/get-a-quote');
  paths.push('/contact');
  paths.push('/about');
  paths.push('/coverage-partners');
  for (const loc of LOCATIONS) paths.push(`/${loc.slug}`);
  paths.push('/privacy-policy');
  paths.push('/terms-%26-conditions');

  return paths;
}

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  // Build-time date. A single lastmod for the whole build is honest — every page
  // was in fact generated at this moment — and avoids the stale-date problem the
  // live sitemap has (everything stamped 2026-09-29 regardless of real edits).
  const lastmod = new Date().toISOString().split('T')[0];

  const entries = allPaths()
    .map(
      (p) =>
        `  <url>\n    <loc>${escapeXml(absoluteUrl(p))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
