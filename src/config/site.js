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
    street: '16 SE 3rd St',
    /** Verbatim string used in schema and the footer — must not drift. */
    full: "16 SE 3rd St, Lee's Summit, MO 64063",
    isPrimary: true,
    /** Exact pin from the Google Business Profile (client supplied the map link). */
    geo: { latitude: 38.912387, longitude: -94.3770295 },
    /** The client's Google Maps place URL for this office. */
    mapLink:
      'https://www.google.com/maps/place/Farmers+Insurance+-+Ballentine+Insurance+Group/@38.9123942,-94.3795651,17z/data=!4m15!1m8!3m7!1s0x87c11f8cca9fc2bf:0xd195e5f4af048407!2s16+SE+3rd+St,+Lee\'s+Summit,+MO+64063,+USA!3b1!8m2!3d38.9123901!4d-94.3769902!16s%2Fg%2F11bw412bd4!3m5!1s0x87c11fac5f80e67b:0xa56db49e539ebea3!8m2!3d38.912387!4d-94.3770295!16s%2Fg%2F11f6_prp2n',
  },
  {
    id: 'northland',
    slug: 'northland',
    name: 'Northland Office',
    locality: 'Kansas City',
    region: 'MO',
    postalCode: '64155',
    street: '200 NE 91 St',
    full: '200 NE 91 St, Kansas City, MO 64155',
    isPrimary: false,
    /** Exact pin from the Google Business Profile (client supplied the map link). */
    geo: { latitude: 39.259383, longitude: -94.577399 },
    mapLink:
      'https://www.google.com/maps/place/Farmers+Insurance+-+Bret+Ballentine/@39.2593871,-94.5799739,17z/data=!4m15!1m8!3m7!1s0x87c0583bd2db3ecf:0x4338d6e8c29e1566!2s200+NE+91+St,+Kansas+City,+MO+64155,+USA!3b1!8m2!3d39.259383!4d-94.577399!16s%2Fg%2F11cshtr74f!3m5!1s0x87c0f71054d5f9c9:0xef1d75cb02fbe777!8m2!3d39.259383!4d-94.577399!16s%2Fg%2F11bw5m8yn2',
  },
];

/**
 * Keyless Google Maps embed for an office, from its exact pin and name. The
 * embed loads Google's script only when the visitor's browser reaches the
 * iframe, so the site's own page weight does not grow.
 */
export function mapEmbedUrl(loc) {
  const q = `${loc.geo.latitude},${loc.geo.longitude}(${encodeURIComponent(loc.name)})`;
  return `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
}

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
 * Brand line art per page type. The drawings themselves live in
 * src/components/Art.astro as inline SVG (crisp at every size); this map only
 * says which motif each hub and the specialty pages use.
 */
export const ART = {
  hub: {
    'personal-insurance': 'home',
    'business-insurance': 'business',
    'life-insurance': 'life',
    specialty: 'specialty',
  },
};

/**
 * The agency's own photos, processed from its public Facebook pictures by
 * scripts/process-photos.mjs into public/images/photos/. Sizes are real file
 * dimensions so the browser reserves the right space (no layout shift).
 *
 * Alt text describes what is visible and names nobody: we do not label
 * individuals in photos.
 */
export const PHOTOS = {
  officeMeeting: {
    src: '/images/photos/office-meeting-960.webp',
    srcset: '/images/photos/office-meeting-640.webp 640w, /images/photos/office-meeting-960.webp 960w',
    width: 960,
    height: 720,
    alt: 'Two members of the Ballentine Insurance Group team going over a policy together at a desk in the office',
  },
  agentOnPhone: {
    src: '/images/photos/agent-on-phone-960.webp',
    srcset: '/images/photos/agent-on-phone-640.webp 640w, /images/photos/agent-on-phone-960.webp 960w',
    width: 960,
    height: 720,
    alt: 'A Ballentine Insurance Group agent on the phone with a client at his desk',
  },
  teamStorefront: {
    src: '/images/photos/team-storefront-768.webp',
    srcset: '/images/photos/team-storefront-480.webp 480w, /images/photos/team-storefront-768.webp 768w',
    width: 768,
    height: 1024,
    alt: "Three members of the Ballentine Insurance Group team standing outside the agency's storefront",
  },
};

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
