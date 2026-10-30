/**
 * Verified Google reviews. SINGLE SOURCE OF TRUTH for testimonials.
 *
 * Source: the Google Business Profile `Farmers Insurance – Bret Ballentine`
 * (5.0 stars, 54 reviews), transcribed from screenshots the client supplied on
 * 2026-10-14. Every review here is reproduced in the reviewer's own words.
 *
 * ⚠️ DATES ARE RELATIVE ON PURPOSE
 * Google displays these as "a year ago", "8 months ago" etc. — it does not show
 * calendar dates for them. `dateText` therefore carries exactly what Google shows,
 * and `date` stays null unless a real date is known. The schema builder OMITS
 * `datePublished` when `date` is null. Inventing review dates would be fabricating
 * data, which is precisely what earns structured-data penalties.
 *
 * ⚠️ `isCustomerReview`
 * One card on the live site reads "This customer did not write a review." and is
 * credited to Ashley Neugebauer — who the client confirmed is AGENCY STAFF. It is
 * a rating-only submission, not a testimonial, so it is excluded here entirely:
 * not rendered as a testimonial, and never emitted as Review markup. Google's
 * policy prohibits marking up reviews that are not genuine customer reviews.
 *
 * `staffMentioned` drives a small attribution line that links to /about, which
 * turns praise into an internal-linking asset rather than a dead quote.
 * `serviceContext` lets a review surface on the relevant service page — a named
 * commercial testimonial is far more persuasive there than generic praise.
 */

import northland from '../content/data/reviews-northland.json';
import leesSummit from '../content/data/reviews-lees-summit.json';

/**
 * EDITABLE IN THE CMS: the reviews now live in src/content/data/reviews-*.json.
 * The rules above still apply and the build gate enforces them: full text only,
 * relative dates unless a real calendar date is shown on Google, never invented.
 */
export const REVIEWS = northland.reviews.map((x) => ({
  author: x.author,
  rating: x.rating,
  dateText: x.dateText,
  date: x.date || null,
  text: x.text,
  staffMentioned: x.staffMentioned ?? [],
  locations: x.locations ?? [],
  serviceContext: x.serviceContext || null,
  featured: Boolean(x.featured),
  ...(x.ownerResponse ? { ownerResponse: x.ownerResponse } : {}),
  ...(x.ratingContext ? { ratingContext: x.ratingContext } : {}),
}));

/**
 * The Google Business Profile figures.
 *
 * These will drift over time. A build-time fetcher (scripts/fetch-reviews.mjs,
 * not yet built) could refresh them via the Google Places API if the client ever
 * adds API access; until then they are updated by hand from the profile.
 */
export const GOOGLE_REVIEWS = {
  profileName: northland.profileName,
  rating: northland.rating,
  count: northland.count,
  bestRating: 5,
  source:
    'https://www.google.com/maps/place/Farmers+Insurance+-+Bret+Ballentine/@39.259383,-94.577399,17z',
  /** The date these figures were read from the profile. */
  observedOn: northland.observedOn,
};

/** Only genuine customer reviews may be rendered or marked up. */
export const CUSTOMER_REVIEWS = REVIEWS.filter((r) => r.rating && r.text);

/** Reviews to lead with on the homepage. */
export const FEATURED_REVIEWS = CUSTOMER_REVIEWS.filter((r) => r.featured);

/** Reviews that mention a given service line, for surfacing on that page. */
export function reviewsForService(serviceSlug) {
  return CUSTOMER_REVIEWS.filter((r) => r.serviceContext === serviceSlug);
}

/** Reviews left at a given office. */
export function reviewsForLocation(locationSlug) {
  return CUSTOMER_REVIEWS.filter((r) => r.locations?.includes(locationSlug));
}

/**
 * Per-office Google Business Profiles, so each location page shows its own
 * rating and its own reviews, and the Review markup can point at the right
 * LocalBusiness node.
 *
 * Northland: the Bret Ballentine profile that REVIEWS above came from; its
 * aggregate mirrors GOOGLE_REVIEWS so the two never drift apart.
 *
 * Lee's Summit: the Ballentine Insurance Group profile at 16 SE 3rd Street,
 * 5.0 from 83 reviews, transcribed from the screenshots the client supplied
 * on 2026-10-25. Same rules as REVIEWS: relative dates only, full text only,
 * never fabricated. Two reviews from that profile (Jason Atkinson, Randy
 * White) are NOT included yet because the captures cut their text off mid
 * sentence; they join once the client supplies the full words.
 */
export const LOCATION_PROFILES = {
  'lees-summit': {
    profileName: leesSummit.profileName,
    rating: leesSummit.rating,
    count: leesSummit.count,
    observedOn: leesSummit.observedOn,
    reviews: leesSummit.reviews.map((x) => ({
      author: x.author,
      dateText: x.dateText,
      text: x.text,
      ...(x.response ? { response: x.response } : {}),
    })),
  },
  northland: {
    profileName: GOOGLE_REVIEWS.profileName,
    rating: GOOGLE_REVIEWS.rating,
    count: GOOGLE_REVIEWS.count,
    observedOn: GOOGLE_REVIEWS.observedOn,
  },
};
