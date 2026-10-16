// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * Canonical URL policy — see website-scope.md §4.
 *
 *   1. Bare domain. No `www` ever.
 *   2. HTTPS only.
 *   3. NO TRAILING SLASH. This is the form the seven currently-indexed URLs
 *      use in sitemap.website.xml, so it is the form we must keep.
 *      `trailingSlash: 'never'` makes Astro emit no-slash canonical links;
 *      the host (Netlify `_redirects`) 301s the slash form across.
 *   4. Every URL is derived from `site` below — never hardcoded in a page.
 */
export default defineConfig({
  site: 'https://insure-big.com',
  trailingSlash: 'never',
  build: {
    // Emit /personal-insurance/auto.html rather than /personal-insurance/auto/index.html.
    // Cloudflare Pages and Netlify both serve that as /personal-insurance/auto with no
    // trailing slash and no redirect hop — which is exactly the canonical form.
    format: 'file',
    inlineStylesheets: 'auto',
  },
  // No @astrojs/sitemap integration on purpose.
  //
  // It emits sitemap-index.xml + sitemap-0.xml, but the live site publishes
  // /sitemap.xml — a path Google already knows. src/pages/sitemap.xml.ts owns
  // that URL instead, so we control the exact output: no <changefreq>, no
  // <priority> (Google ignores both), no trailing slashes, and every URL derived
  // from the same config the pages use.
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
