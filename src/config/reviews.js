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

export const REVIEWS = [
  {
    author: 'Chanda Clough',
    rating: 5,
    dateText: '6 months ago',
    date: null,
    text: 'Pete & Ashley at the Northland office were amazing to work with from start to finish. They were super quick, no hassle, great follow-up, and they were able to get us the best rates possible. I would highly recommend their services - you will not be disappointed!',
    staffMentioned: ['Pete Carroll', 'Ashley Neugebauer'],
    locations: ['northland'],
    serviceContext: null,
    featured: true,
  },
  {
    author: 'Richard Heap',
    rating: 5,
    dateText: '8 months ago',
    date: null,
    text: 'Ashley and this team are fabulous to work with in every way. Competent. Friendly. Effedtive. Patient. Quality products and above best-in-class service, period. I have had insurance products for 30 years. They are unmatched.',
    staffMentioned: ['Ashley Neugebauer'],
    locations: [],
    serviceContext: null,
    featured: true,
  },
  {
    author: 'Craig Eddins',
    rating: 5,
    dateText: '8 months ago',
    date: null,
    text: 'Excellent experience with the Ballentine Agency!! Peter contacted me prior to renewal and was able to provide even greater savings. I was Very impressed and appreciative!! For ME, they continue to have the best rates/coverage. They deserve Your consideration!! Thx Bret/Peter !!',
    staffMentioned: ['Pete Carroll', 'Bret Ballentine'],
    locations: [],
    serviceContext: null,
    featured: true,
  },
  {
    author: 'Maya Greer',
    rating: 5,
    dateText: '10 months ago',
    date: null,
    text: 'I have been with Farmer\u2019s Insurance for over 10 years and Pete has been an absolute pleasure to work with. Pete exemplifies truly what customer service should be. No mater the time or issue, Pete ALWAYS responds quickly with accurate information. I truly appreciate his professionalism.',
    staffMentioned: ['Pete Carroll'],
    locations: [],
    serviceContext: null,
    featured: true,
  },
  {
    author: 'Trent Austin',
    rating: 5,
    dateText: 'a year ago',
    date: null,
    text: 'Absolutely impeccably perfect service! This has been by far the best experience I\u2019ve ever had with insurance agents. They truly care about you and go the extra mile to make everything right! The absolute best of the best! A+++++++++',
    staffMentioned: [],
    locations: [],
    serviceContext: null,
    featured: true,
    ownerResponse:
      'Wow\u2014thank you so much, Trent! We\u2019re thrilled to hear your experience with our team has been such a positive one. Providing caring, attentive service and going the extra mile for our clients is exactly what we strive for every day. We\u2019re grateful for your trust in us for your business and insurance needs!',
  },
  {
    author: 'Dr. Sam Chuba',
    rating: 5,
    dateText: '11 months ago',
    date: null,
    text: 'I\u2019ve been with this insurance company for a while now, and I can confidently say they are head and shoulders above the rest! They\u2019ve got me covered with all 4 of my vehicles, and their customer service is simply top-notch. Pete and Dillon are the best.',
    staffMentioned: ['Pete Carroll', 'Dillon Schallenberg'],
    locations: [],
    serviceContext: 'auto',
    featured: false,
    ownerResponse:
      'Thank you so much, Sammy! We truly appreciate your kind words and the trust you place in our team. Pete and Dillon will be thrilled to hear your feedback \u2014 they take a lot of pride in providing the level of service you described. We\u2019re so glad to have you with us!',
  },
  {
    author: 'Natalie VanLerberg',
    rating: 5,
    dateText: '4/7/2026',
    date: '2026-04-07',
    text: 'Pete-the office manager was extremely helpful and quick in an important situation for me. I will continue to use his office for all our insurance needs.',
    staffMentioned: ['Pete Carroll'],
    locations: [],
    serviceContext: null,
    featured: false,
  },
  {
    author: 'Jane Sommers',
    rating: 5,
    dateText: '11 months ago',
    date: null,
    text: 'Pete Carroll has always taken great care of our families auto/home insurance needs. He has always gone above and beyond to get us the best rates possible. He\u2019s honest, knowledgeable and always such a pleasure to deal with.',
    staffMentioned: ['Pete Carroll'],
    locations: [],
    serviceContext: 'personal-insurance',
    featured: true,
    ratingContext: 'Price assessment: Great price',
    ownerResponse:
      'Thank you, Jane! We really appreciate your loyalty and kind words. Pete truly cares about his customers and takes pride in finding the best coverage and value possible. We\u2019re grateful to have him on our team \u2014 and to have your family with us! \u2014 Bret Ballentine & The BIG Team',
  },
  {
    author: 'Nicholas Lee',
    rating: 5,
    dateText: '10 months ago',
    date: null,
    text: 'Ashley was incredibly helpful and knowledgeable. She listened to all of my concerns to find me options that best suit my needs. She did all of the work for me and got the information to me promptly. I highly recommend Bret Ballentine\u2019s team for all your insurance needs.',
    staffMentioned: ['Ashley Neugebauer', 'Bret Ballentine'],
    locations: [],
    serviceContext: null,
    featured: false,
  },
  {
    author: 'Marsha Ross',
    rating: 5,
    dateText: 'a year ago',
    date: null,
    text: 'Brett is AMAZING! He took an incredible amount of time, listening, and evaluating my business, and the issues I was having with my current Ins provider. I look forward to many years of doing great business together. So very pleased to have him as part of MY BUSINESS TEAM! *MGRoss - Window Treatments and More, Inc.',
    staffMentioned: ['Bret Ballentine'],
    locations: [],
    // A named commercial testimonial — the most persuasive kind for the
    // business pages, and rare.
    serviceContext: 'workers-compensation',
    featured: true,
    ratingContext: 'Services: Workers\u2019 compensation insurance',
    ownerResponse:
      'Thank you so much for the kind words, Marsha! We\u2019re thrilled to be part of your business team and to help protect the company you\u2019ve worked so hard to build. At BIG, we take pride in listening first and tailoring coverage to fit each client\u2019s unique needs. We look forward to many successful years of partnership with Window Treatments and More!',
  },
  {
    author: 'Nita Pridgen',
    rating: 5,
    dateText: '11/20/2025',
    date: '2025-11-20',
    text: 'Saved us a bunch of money with his expertise',
    staffMentioned: [],
    locations: [],
    serviceContext: null,
    featured: false,
  },
  {
    author: 'Veljko Stojic',
    rating: 5,
    dateText: '5/14/2026',
    date: '2026-05-14',
    text: 'Pete was AMAZING!!',
    staffMentioned: ['Pete Carroll'],
    locations: [],
    serviceContext: null,
    featured: false,
  },
  {
    author: 'Sean Gillispie',
    rating: 5,
    dateText: '1/14/2026',
    date: '2026-01-14',
    text: 'These folks are the best in their business. No reason to look elsewhere!',
    staffMentioned: [],
    locations: [],
    serviceContext: null,
    featured: false,
  },
];

/**
 * The Google Business Profile figures.
 *
 * These will drift over time. A build-time fetcher (scripts/fetch-reviews.mjs,
 * not yet built) could refresh them via the Google Places API if the client ever
 * adds API access; until then they are updated by hand from the profile.
 */
export const GOOGLE_REVIEWS = {
  profileName: 'Farmers Insurance \u2013 Bret Ballentine',
  rating: 5.0,
  count: 54,
  bestRating: 5,
  source:
    'https://www.google.com/maps/place/Farmers+Insurance+-+Bret+Ballentine/@39.259383,-94.577399,17z',
  /** The date these figures were read from the profile. */
  observedOn: '2026-10-14',
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
