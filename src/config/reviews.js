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
    profileName: 'Farmers Insurance - Ballentine Insurance Group',
    rating: 5.0,
    count: 83,
    observedOn: '2026-10-25',
    reviews: [
      {
        author: 'Stephanie Frey',
        dateText: '6 months ago',
        text: 'Dillon with Farmers made our switch incredibly seamless from start to finish. His customer service was outstanding\u2014he was responsive, easy to communicate with, and took the time to answer all of our questions thoroughly. The whole process felt simple and stress-free, which we really appreciated. Highly recommend if you\u2019re looking for great service and a smooth experience!',
      },
      {
        author: 'Michelle Lewis',
        dateText: '3 months ago',
        text: 'Ashley was very helpful in putting together a quote for us and reviewing it thoroughly. She responded to any questions in a timely manner and was more than willing to help. We ended up switching because Farmers was able to save us some money per year.',
      },
      {
        author: 'Brandon Bridges',
        dateText: '3 months ago',
        text: 'Ashley has been great! She got me lower rates on home and auto saving hundreds per month. She has been easy to work with and very responsive, answering all my questions along the way. I\u2019ll definitely be back in a year or two to review policies with her again and keep the savings rolling.',
      },
      {
        author: 'Crystal Farley',
        dateText: '8 months ago',
        text: 'I can\u2019t say enough good things about Bret, Pete and the entire office staff at Ballentine Insurance. We have been long time customers for both our personal and commercial needs. They are always ready and willing to answer questions and VERY prompt with responses and requests. If you are looking for a great, reputable insurance company I highly recommend you give Ballentine Insurance the opportunity!',
        response:
          'Thank you for sharing your experience with our agency Crystal! We\u2019re thrilled to hear that Pete and I were able to assist you and make the process smooth & easy. Our goal is always to provide the best service and find the right coverage for our clients. If you ever need anything in the future, don\u2019t hesitate to reach out. We truly appreciate your trust in us!',
      },
      {
        author: 'Krista Hurd',
        dateText: '8 months ago',
        text: 'One of our vehicles was recently totaled, and during the initial stages of working with the insurance company, we encountered several challenges related to communication and delays. At that point, we brought Bret in to assist with the process, and the difference was immediate. Bret quickly stepped in, assessed the situation, and got the ball rolling without hesitation. His professionalism, combined with a clear and direct communication style, helped cut through the roadblocks and reach the appropriate parties needed to move the process forward. Bret was proactive, persistent, and incredibly thorough, staying on top of every detail until the matter was fully resolved. Throughout the entire process, he kept us informed, was highly responsive to questions, and made what could have been a stressful situation feel manageable and well-handled. Bret was truly a pleasure to work with, and his dedication and follow-through gave us great confidence during a challenging time. We will absolutely continue working with Bret moving forward and would highly recommend him to anyone in need of knowledgeable, reliable, and effective support.',
      },
      {
        author: 'Max M',
        dateText: '4 months ago',
        text: 'Pete has helped my family for years and we love him! Second generation with him.',
      },
      {
        author: 'Helene',
        dateText: '11 months ago',
        text: 'Balentine\u2019s office of Farmers insurance has employees who take care of you like they\u2019re your neighbor - if you\u2019re lucky enough to live in a neighborhood where your neighbors still want to get to know each other. They return your phone call and ask how they can help, listen and then take action. I\u2019d like to specifically point out, Pete, who goes out of his way to follow through with whatever help you may need, as I did today. I was a customer at this specific office for years before I moved away to Texas. But I still have a policy with them. And even though I\u2019m not local, when I call, they\u2019re quick to answer the phone, listen and assist. I highly recommend them.',
        response:
          'Thank you so much, Helene! We really appreciate your thoughtful words and continued loyalty \u2014 even from Texas! It means a lot that you still trust our office after all these years. Pete and the team take pride in treating every customer like a true neighbor, whether you\u2019re right here in Kansas City or miles away. We\u2019re grateful for your recommendation and for being part of the BIG family!',
      },
      {
        author: 'Jane Sommers',
        dateText: '11 months ago',
        text: 'Pete Carrol is by far the best agent we have ever used. He\u2019s been taking care of our family\u2019s auto/home insurance needs for as long as he\u2019s been with Farmer\u2019s. He responds immediately to every email, and voice mail. He always has an answer to all our questions and if he doesn\u2019t, he\u2019s honest and says he\u2019ll get us an answer, and ALWAYS keeps us updated in the process. And on top of that always friendly and willing to go the extra mile for us. We appreciate Pete!',
        response:
          'Thank you so much, Jane! We couldn\u2019t agree more Pete truly goes above and beyond for our customers, and we\u2019re lucky to have him on the BIG Team. We appreciate your family\u2019s loyalty and the trust you\u2019ve placed in us over the years. Thanks for sharing your experience!',
      },
      {
        author: 'Cynthia Jackman',
        dateText: 'a year ago',
        text: 'The first time contacting this agency I just basically had questions and an interest in making him my agent. Bret and Pete both went above and beyond for me and they genuinely were concerned about finding me exactly what I needed. Adding the policy was a smooth and easy transition I highly recommend them for your auto insurance!',
        response:
          'Thank you for sharing your experience with our agency Cynthia! We\u2019re thrilled to hear that Pete and I were able to assist you and make the process smooth & easy. Our goal is always to provide the best service and find the right coverage for our clients. If you ever need anything in the future, don\u2019t hesitate to reach out. We truly appreciate your trust in us!',
      },
      {
        author: 'Duncan Hill',
        dateText: 'a year ago',
        text: 'Spectacular service! Went above and beyond to ensure I had the best rate. Rates were cheaper for the first week with one insurer, but cheaper in perpetuity after the first week with Farmers. They took care of it all for me, I didn\u2019t have to worry about a thing. 10/10 would recommend!',
        response:
          'Thanks Duncan! We like to think outside the box here and appreciate customers like you willing to go there with us.',
      },
      {
        author: 'Marissa Young',
        dateText: '2 years ago',
        text: 'We can\u2019t say enough good things about Bret and Pete! They have the lowest rates, are quick to respond to emails, and are very very helpful with moving houses, selling cars, and adding cars. They really make everything seamless with minimal effort on our part! We love working with them and wouldn\u2019t look for insurance anywhere else.',
        response:
          'Thank you so much, Marissa! We\u2019re so glad to hear that. It\u2019s always a pleasure working with you and helping make those transitions\u2014homes, cars, and all\u2014go as smoothly as possible. We truly appreciate your trust and loyalty!',
      },
      {
        author: 'Kim F',
        dateText: 'a year ago',
        text: 'Bret and his staff have provided us with excellent services. They are very knowledgeable and helpful with all of our insurance needs. His customers are the main priority and they are very easy to get ahold of. I wouldn\u2019t go to any other agency.',
        response:
          'Thank you so much for your thoughtful review! We\u2019re thrilled to hear that you\u2019ve had a great experience with our team. Providing excellent service and making sure our customers are our top priority is what we strive for every day. We truly appreciate your trust in us and look forward to continuing to serve your insurance needs!',
      },
      {
        author: 'Trudie Boss',
        dateText: '11 months ago',
        text: 'Bret took care of my home owners insurance so fast and gave me the best rate. I highly recommend him for any insurance needs.',
        response:
          'Thank you, Trudie! I really appreciate the kind words and your trust in letting us help with your homeowners coverage. We\u2019re always glad to find the best rate and make the process quick and easy!',
      },
      {
        author: 'Jacob Allen',
        dateText: '2 years ago',
        text: 'I\u2019ve been using Ballentine Farmers for several years now. Brett and Pete have always been very responsive and do everything they can to make sure I have the coverage I need at the best possible price. It\u2019s reassuring having them in my corner. You can deal with these guys in full confidence.',
        response:
          'Thank you for your loyalty and for sharing your experience! We\u2019re so glad to hear that Pete and I have been able to provide you with responsive service and the best coverage at the best price. Knowing you feel confident with us in your corner means the world. We truly appreciate your trust and look forward to continuing to serve you!',
      },
      {
        author: 'K T Cruise',
        dateText: '2 months ago',
        text: 'Great Customer Service. Explained every item on the policies.',
      },
      {
        author: 'Justin Williams',
        dateText: '2 years ago',
        text: 'Pete Carroll at the Ballentine agency has taken tremendous care of us for years, both individually and for our business. His general disposition has always been one of finding a way to be of service with an attitude of knowing there\u2019s a solution that will work for us. Further, it is clear that his integrity is good. In an industry where this isn\u2019t always the case, it\u2019s even more appreciated. I can\u2019t recommend Pete or the Ballentine agency enough.',
        response:
          'Thank you for your thoughtful and kind review! We\u2019re so grateful for your trust in Pete and the Ballentine Agency over the years. It means a lot to hear that his dedication, integrity, and commitment to finding the best solutions have made a difference for both your personal and business needs. We truly appreciate your recommendation and look forward to continuing to serve you!',
      },
    ],
  },
  northland: {
    profileName: GOOGLE_REVIEWS.profileName,
    rating: GOOGLE_REVIEWS.rating,
    count: GOOGLE_REVIEWS.count,
    observedOn: GOOGLE_REVIEWS.observedOn,
  },
};
