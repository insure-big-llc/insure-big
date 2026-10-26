/**
 * Shared measurement targets, one source of truth for both drivers.
 *
 * `measure.mjs` (Lighthouse scores plus screenshots on a normal machine) and
 * `mcp-measure.mjs` (the Playwright MCP screenshot pass) import from here, so
 * the page set and the screenshot widths can never drift apart.
 */
export const MEASURE_PAGES = [
  { name: 'home', path: '/' },
  { name: 'service-home-insurance', path: '/personal-insurance/home' },
  // The /reviews page was removed by the client (2026-10-26); a location page
  // replaces it in the set so the map embeds stay under measurement.
  { name: 'lees-summit', path: '/lees-summit' },
  { name: 'hub-business', path: '/business-insurance' },
  // The pages the design pass restyled (spec 0002, task 7): previously untouched.
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'privacy-policy', path: '/privacy-policy' },
  // The indexed URL /terms-%26-conditions is served by production hosts with the
  // literal percent in the filename. astro preview URL-decodes once, so it 404s
  // that form; the double-encoded form reaches the same file locally.
  { name: 'terms', path: '/terms-%26-conditions', measurePath: '/terms-%2526-conditions' },
];

export const SCREENSHOT_WIDTHS = [360, 768, 1440];
export const SCREENSHOT_HEIGHT = 800;

/** Lighthouse's built in category thresholds. A score below 90 gets a warning marker, never an exit failure. */
export const CATEGORY_THRESHOLD = 90;
