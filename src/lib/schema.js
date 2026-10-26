/**
 * JSON-LD node builders. website-scope.md §5.2.
 *
 * Pages pass the result of one of these into <Schema schema={...} />, so every
 * node is constructed in one place rather than hand-written per page — which is
 * how structured data drifts out of sync with the visible content.
 */
import { SITE, CONTACT, absoluteUrl } from '../config/site.js';
import { GOOGLE_REVIEWS, CUSTOMER_REVIEWS } from '../config/reviews.js';
import { SERVICES, HUBS, servicePath } from '../config/services.js';

const ORG_ID = `${SITE.url}/#organization`;

/**
 * The metro we serve. Used on every Service and Offer node.
 *
 * ⚠️ This list must stay consistent with the market statement. Both offices are
 * in Missouri; the agency is licensed in Missouri and Kansas and the metro spans
 * the state line, which is why `areaServed` carries both states.
 */
export const AREA_SERVED = [
  { '@type': 'City', name: 'Kansas City' },
  { '@type': "City", name: "Lee's Summit" },
  { '@type': 'City', name: 'Blue Springs' },
  { '@type': 'City', name: 'Independence' },
  { '@type': 'City', name: 'Raymore' },
  { '@type': 'City', name: 'Grandview' },
  { '@type': 'City', name: 'Liberty' },
  { '@type': 'City', name: 'Gladstone' },
  { '@type': 'City', name: 'Parkville' },
  { '@type': 'City', name: 'North Kansas City' },
  { '@type': 'State', name: 'Missouri' },
  { '@type': 'State', name: 'Kansas' },
];

/**
 * Service node for a service page.
 * `areaServed` is attached at node level so every service page carries the same
 * market, which is what the old site failed to state consistently.
 */
export function serviceSchema({ name, description, path }) {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(path)}#service`,
    name,
    description,
    serviceType: name,
    provider: { '@id': ORG_ID },
    areaServed: AREA_SERVED,
    url: absoluteUrl(path),
  };
}

/**
 * A single review node.
 *
 * ⚠️ `datePublished` is emitted ONLY when a real calendar date is known. Most of
 * these reviews show as "a year ago" on Google, not a date — inventing one would
 * be fabricating structured data.
 *
 * ⚠️ Staff reviews are excluded upstream: `CUSTOMER_REVIEWS` only ever contains
 * genuine customer reviews. Google's policy prohibits marking up anything else.
 */
function reviewNode(review, itemReviewedId = ORG_ID) {
  const node = {
    '@type': 'Review',
    author: { '@type': 'Person', name: review.author },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating ?? 5,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.text,
    itemReviewed: { '@id': itemReviewedId },
  };
  if (review.date) node.datePublished = review.date;
  return node;
}

/**
 * Review + AggregateRating for the organization.
 *
 * ⚠️ Honest expectation: Google no longer grants star rich results for
 * self-serving LocalBusiness reviews. The value here is machine-readability and
 * AI citation, not stars in the SERP. Emitting it is still correct — answer
 * engines and other consumers read it.
 */
export function reviewsSchema() {
  return {
    '@type': 'InsuranceAgency',
    '@id': ORG_ID,
    review: CUSTOMER_REVIEWS.map(reviewNode),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: GOOGLE_REVIEWS.rating,
      reviewCount: GOOGLE_REVIEWS.count,
      bestRating: GOOGLE_REVIEWS.bestRating,
      worstRating: 1,
    },
  };
}

/**
 * Review + AggregateRating for one office's Google Business Profile. Merges by
 * @id into that office's LocalBusiness node, so the reviews and the aggregate
 * are attributed to the right office rather than the organization.
 */
export function locationReviewsSchema(locationId, reviews, aggregate) {
  const id = `${SITE.url}/#location-${locationId}`;
  return {
    '@type': 'LocalBusiness',
    '@id': id,
    review: reviews.map((r) => reviewNode(r, id)),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregate.rating,
      reviewCount: aggregate.count,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * OfferCatalog — one machine-readable statement of every coverage line the
 * agency writes. Gives crawlers and answer engines a single node describing the
 * full scope of the business rather than having to infer it from 37 pages.
 */
export function offerCatalogSchema() {
  const toOffer = ({ name, blurb }, parentName) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name,
      description: blurb,
      ...(parentName ? { category: parentName } : {}),
    },
    areaServed: AREA_SERVED,
    seller: { '@id': ORG_ID },
  });

  return {
    '@type': 'OfferCatalog',
    '@id': `${SITE.url}/#offer-catalog`,
    name: `${SITE.name} — insurance coverage`,
    url: `${SITE.url}/`,
    provider: { '@id': ORG_ID },
    itemListElement: [
      ...HUBS.flatMap((hub) => [
        toOffer({ name: hub.title, blurb: hub.blurb }, null),
        ...SERVICES.filter((s) => s.hub === hub.slug).map((s) => toOffer(s, hub.title)),
      ]),
      ...SERVICES.filter((s) => s.hub === 'specialty').map((s) => toOffer(s, 'Specialty')),
    ],
  };
}

/**
 * A specialist page's `Offer` where a partner transacts.
 * `seller` points at the partner, which is the honest representation: the agency
 * provides the service, the partner completes the transaction.
 */
export function partnerOfferSchema({ serviceName, description, path, partnerName, partnerUrl }) {
  return {
    '@type': 'Offer',
    '@id': `${absoluteUrl(path)}#offer`,
    name: serviceName,
    description,
    areaServed: AREA_SERVED,
    ...(partnerUrl ? { url: partnerUrl } : {}),
    seller: partnerName ? { '@type': 'Organization', name: partnerName } : { '@id': ORG_ID },
    provider: { '@id': ORG_ID },
  };
}

/**
 * FAQPage node.
 *
 * Only emit this where the questions and answers are genuinely visible on the
 * page — Google treats FAQ markup whose content is not on the page as spam.
 */
export function faqSchema({ faqs, path }) {
  if (!faqs?.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

/**
 * BreadcrumbList. Emitted on every nested page.
 * `trail` is an array of { name, path } from the site root down to this page.
 */
export function breadcrumbSchema(trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** ContactPage — for /contact. */
export function contactPageSchema({ path, title, description }) {
  return {
    '@type': 'ContactPage',
    '@id': `${absoluteUrl(path)}#contactpage`,
    name: title,
    description,
    url: absoluteUrl(path),
    about: { '@id': ORG_ID },
  };
}

/** AboutPage + the four team members. */
export function aboutPageSchema({ path, title, description, team }) {
  return {
    '@type': 'AboutPage',
    '@id': `${absoluteUrl(path)}#aboutpage`,
    name: title,
    description,
    url: absoluteUrl(path),
    about: { '@id': ORG_ID },
    mentions: team.map((person) => ({
      '@type': 'Person',
      name: person.name,
      jobTitle: person.title,
      worksFor: { '@id': ORG_ID },
      description: person.bio,
    })),
  };
}

/** WebPage — a generic fallback for pages with no more specific type. */
export function webPageSchema({ path, title, description }) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@id': `${SITE.url}/#website` },
    inLanguage: 'en-US',
  };
}

/** SiteNavigationElement — helps the crawler understand the menu. */
export function siteNavigationSchema(items) {
  return items.map((item, i) => ({
    '@type': 'SiteNavigationElement',
    '@id': `${SITE.url}/#nav-${i + 1}`,
    name: item.label,
    url: absoluteUrl(item.href),
  }));
}

export { ORG_ID };
