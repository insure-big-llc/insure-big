/**
 * Single source of truth for every fact that repeats across the site.
 *
 * website-scope.md §1 and §5:
 *   - NAP must be IDENTICAL everywhere (footer, JSON-LD, contact page, location pages).
 *     Nothing may hardcode an address, phone number or hour anywhere else.
 *   - The market statement is verbatim, everywhere, no variants.
 *   - The 7 indexed URLs are protected: see `indexedUrls` below.
 *
 * If a fact changes, it changes HERE and nowhere else.
 */

export const SITE = {
  /** Bare domain, no www, no trailing slash. Matches sitemap.website.xml. */
  url: 'https://insure-big.com',

  /** Must match the <title> brand and the Google Business Profile exactly. */
  name: 'Ballentine Insurance Group',
  shortName: 'BIG',

  /**
   * ⚠️ ENTITY-NAME ALIGNMENT
   *
   * This agency is referred to by four different names across the surfaces an AI
   * or a search engine reads:
   *
   *   insurer's website + GBP ... "Farmers Insurance – Bret Ballentine"
   *   the website + this file ..... "Ballentine Insurance Group"
   *   Downtown LS directory ....... "Ballentine Insurance Agency"
   *   Microsoft/Google tenant ..... "Insure-BIG"
   *
   * Inconsistent naming makes a business harder to recognise confidently, which is
   * one of the recorded AI-visibility blockers. Declaring the variants here is the
   * cheap half of the fix: it tells machines these all refer to one entity. The
   * other half — aligning the Google Business Profile and the directory listing —
   * is a client task, recorded in website-scope.md §14.
   */
  alternateNames: [
    'BIG',
    'Ballentine Insurance Agency',
    'Ballentine Insurance',
    'Insure-BIG',
    'Farmers Insurance - Bret Ballentine',
  ],

  /** Verbatim, sitewide. Fixes the old "Kansas" vs "Missouri, Kansas" contradiction. */
  marketStatement:
    'Serving the Kansas City metro area and communities throughout Missouri and Kansas.',

  tagline: 'Feel the BIG Difference',

  founded: 2018,
  foundedWhere: "Downtown Lee's Summit",

  facebook: 'https://www.facebook.com/184676192224260',
};

/**
 * Two locations, shared phone and shared hours (confirmed).
 *
 * `telephone` is emitted ONCE at Organization level in the JSON-LD and NOT repeated
 * on each LocalBusiness node, because two LocalBusiness nodes sharing one number
 * reads as conflicting data to validators. See website-scope.md §5.2.
 */
export const LOCATIONS = [
  {
    id: 'lees-summit',
    slug: 'lees-summit',
    name: "Lee's Summit Office",
    locality: "Lee's Summit",
    region: 'MO',
    postalCode: '64063',
    street: '16 SE 3rd Street',
    /** Verbatim string used in schema and the footer — must not drift. */
    full: "16 SE 3rd Street, Lee's Summit, MO 64063",
    isPrimary: true,
    /** Geo coordinates are refined in Phase 4 against the Google Business Profile. */
    geo: { latitude: 38.9108, longitude: -94.3774 },
  },
  {
    id: 'northland',
    slug: 'northland',
    name: 'Northland Office',
    locality: 'Kansas City',
    region: 'MO',
    postalCode: '64155',
    street: '200 NE 91st Street',
    full: '200 NE 91st Street, Kansas City, MO 64155',
    isPrimary: false,
    geo: { latitude: 39.2022, longitude: -94.5775 },
  },
];

/** Shared by both offices — confirmed by the client. */
export const CONTACT = {
  /** Display form. `tel` below is the machine form. */
  phone: '(816) 868-1787',
  phoneHref: 'tel:+18168681787',
  email: 'bret@insure-big.com',
  hours: {
    /** Mon–Fri, both offices. */
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
    display: 'Monday – Friday, 9:00am – 5:00pm',
    /** schema.org openingHoursSpecification */
    spec: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  },
};

/** The one quote route every action points at (spec 0002, shared constant). */
export const QUOTE_URL = "/get-a-quote";

/** The two Jotform endpoints (website-scope.md §2, decision 8). */
export const FORMS = {
  personal: 'https://form.jotform.com/212725697286165',
  business: 'https://form.jotform.com/222544643652052',
};

/**
 * Generated brand artwork (spec 0002). Abstract line drawings, produced by
 * scripts/build-artwork.mjs into public/images/art/. Background images only,
 * so they never occupy layout.
 */
export const ART = {
  hero: '/images/art/hero-art.webp',
  band: '/images/art/band-art.webp',
  /** Themed per hub and per specialty, drawn from the line the page sells. */
  hub: {
    'personal-insurance': '/images/art/house-art.webp',
    'business-insurance': '/images/art/business-art.webp',
    'life-insurance': '/images/art/life-art.webp',
    specialty: '/images/art/specialty-art.webp',
  },
};

/**
 * The hero photo slot (spec 0002). null today: the client does not want a
 * person in the hero. When real photos are approved for the hero, set this to
 * the path and drop the file into public/. Missing files fall back to artwork.
 */
export const HERO_IMAGE = null;

/**
 * The 7 URLs that are indexed TODAY, in the exact form they appear in
 * https://insure-big.com/sitemap.website.xml — HTTPS, bare domain, NO trailing slash.
 *
 * website-scope.md §4: these must survive byte-identical. `scripts/verify-seo.mjs`
 * asserts this after every build. Do not "tidy" them.
 */
export const INDEXED_URLS = [
  '/',
  '/personal-insurance',
  '/business-insurance',
  '/life-insurance',
  '/get-a-quote',
  '/privacy-policy',
  '/terms-%26-conditions',
];

/**
 * Old GoDaddy paths that will die at cutover, and where they should land.
 * Keep the list short and each hop single — no chains. website-scope.md §4.
 */
export const LEGACY_REDIRECTS = [
  // The unencoded ampersand. GoDaddy serves this today; the new site does not.
  { from: '/terms-&-conditions', to: '/terms-%26-conditions' },
  { from: '/home', to: '/' },
  { from: '/index.html', to: '/' },
  { from: '/quote', to: '/get-a-quote' },
  { from: '/contact-us', to: '/contact' },
  { from: '/about-us', to: '/about' },
];

/** Absolute URL for a site-relative path. Used by canonicals, OG tags, sitemap. */
export function absoluteUrl(path = '/') {
  if (path === '/') return `${SITE.url}/`;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/** The NAP block, rendered identically in the footer and referenced by schema. */
export function napLines() {
  return LOCATIONS.map((loc) => ({
    name: loc.name,
    address: loc.full,
  }));
}
