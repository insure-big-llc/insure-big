/**
 * The 26 service pages, grouped under the 3 indexed hub URLs.
 * website-scope.md §4.
 *
 * Hubs (`/personal-insurance`, `/business-insurance`, `/life-insurance`) are the
 * three service URLs that are ALREADY INDEXED. They stay exactly as they are and
 * become full pages; every service nests beneath one of them.
 *
 * `/specialty/*` is deliberately its own group — those products do not belong to
 * the three Farmers-led lines in the same way, and inventing a 4th hub risked
 * competing with the three indexed URLs.
 *
 * `form` selects which Jotform the page posts to (website-scope.md §2, decision 8).
 * `searchIntent` and `faq` drive the on-page copy and the FAQPage JSON-LD.
 * `source` records where the copy came from — nothing is invented (scope §13).
 */

export const HUBS = [  {
    slug: 'personal-insurance',
    title: 'Personal Insurance',
    h1: 'Personal Insurance Built Around Your Life',
    metaTitle: "Personal Insurance | Lee's Summit & Kansas City | BIG",
    metaDescription:
      'Home, auto, renters, condo, umbrella and flood insurance for Kansas City metro families, compared across multiple carriers. Get a quote.',
    blurb:
      'Home, auto, renters, condo, umbrella and flood coverage — compared across multiple top-rated carriers rather than sold from a single shelf.',
    form: 'personal',
    /** Verbatim from the live /personal-insurance page. */
    intro: [
      "Insurance isn't just about protecting your home or car; it's about safeguarding the life you've worked hard to build.",
      "At Ballentine Insurance Group, we understand that what matters most to you is unique. As an independent insurance agency, we're not restricted to a single company. We compare coverage from multiple top-rated carriers to help you find the right protection at a competitive price, including customizable insurance plans tailored to your needs.",
      "Whether you're purchasing your first home, insuring multiple vehicles, protecting valuable possessions, or planning for your family's future, we'll assist you in selecting the right coverage that aligns with your priorities and not someone else's sales goals.",
    ],
    /**
     * 🔴 THE AGENCY'S OWN WORDS — restored verbatim from the live page's
     * "Why Choose Ballentine Insurance Group?" list. This copy was accidentally
     * dropped in the first build pass (website-scope.md §16a, W4). It is better
     * than any paraphrase, because it is theirs.
     */
    whyChoose: {
      heading: 'Why Choose Ballentine Insurance Group?',
      items: [
        'Independent agency representing multiple top-rated insurance companies',
        'Personalized coverage recommendations that can be customized',
        'Competitive pricing with strong coverage options for home and auto insurance',
        'Annual policy reviews to keep your protection current',
        'Local, responsive service when you need it most',
        'Claims support from someone who knows you, not a call center',
      ],
    },
  },
  {
    slug: 'business-insurance',
    title: 'Business Insurance',
    h1: 'Business Insurance That Works as Hard as You Do',
    metaTitle: 'Business Insurance in Kansas City & Missouri | BIG',
    metaDescription:
      "General liability, BOP, commercial property, workers' comp and more for Kansas City businesses. Independent agency. Request a review.",
    blurb:
      'Coverage built around how your business actually operates — not a one-size-fits-all package.',
    /** Verbatim from the live /business-insurance page. */
    intro: [
      "Running a business comes with enough challenges, and your business insurance shouldn't be one of them. At Ballentine Insurance Group, we assist business owners in protecting what they've built with comprehensive coverage tailored to their specific operations, rather than using a one-size-fits-all package.",
      "Whether you're a contractor, manufacturer, retailer, restaurant, professional office, nonprofit, or growing startup, we take the time to understand your unique business needs before recommending the right coverage.",
      'As an independent agency, Ballentine Insurance Group partners with a wide network of top-rated insurance companies to find the ideal combination of protection, pricing, and service. Instead of being limited to a single carrier, we compare options to help you make an informed decision regarding your business insurance.',
    ],
    /**
     * 🔴 THE AGENCY'S OWN WORDS — restored verbatim from the live page's
     * "Why Businesses Choose Ballentine Insurance Group" list (W4).
     */
    whyChoose: {
      heading: 'Why Businesses Choose Ballentine Insurance Group',
      items: [
        'Independent agency with access to multiple top-rated carriers',
        'Personalized coverage recommendations',
        'Competitive pricing without sacrificing protection',
        'Experienced guidance through claims and policy changes',
        'Local service with responsive support',
      ],
    },
  },
  {
    slug: 'life-insurance',
    title: 'Life & Health Insurance',
    h1: 'Life Insurance and Financial Protection',
    metaTitle: 'Life, Medicare & Estate Planning | Kansas City | BIG',
    metaDescription:
      'Life insurance, Medicare solutions and estate planning for Kansas City metro families. Call (816) 868-1787 for a review.',
    blurb:
      'Life, Medicare and estate planning — protecting the people who depend on you, not just the things you own.',
    form: 'personal',
    /** Verbatim from the live /life-insurance page. */
    intro: [
      "At Ballentine Insurance Group (BIG), we understand that life is full of uncertainties, but your loved ones' financial security shouldn't be one of them. That's why we're proud to offer a comprehensive array of life insurance options through our trusted partnership with Farmers Insurance.",
      "Whether you're a homeowner looking for mortgage protection, a business owner interested in key man life policies, or a parent seeking juvenile coverage, BIG has the perfect solution tailored to your unique needs. We also offer final expense plans to alleviate the burden on your loved ones during difficult times.",
      "With BIG's life insurance options, you can rest assured that your family's future is secure, regardless of what life may bring.",
    ],
    /**
     * The live life page has no "why choose" list, so this is derived from its
     * own copy rather than invented wholesale — every item maps to a claim the
     * live page actually makes (W4).
     */
    whyChoose: {
      heading: 'What our life and health clients rely on',
      items: [
        'Life insurance options through our partnership with Farmers Insurance',
        'Mortgage protection for homeowners',
        'Key man life policies for business owners',
        'Juvenile coverage for parents',
        'Final expense plans that ease the burden on your loved ones',
        'Medicare guidance and estate planning from the same local team',
      ],
    },
  },
];

/**
 * Hub-level FAQ and local context.
 *
 * WHY THIS IS PER-HUB AND NOT GENERIC
 * The recorded AI-visibility finding is that too little *specific, citable*
 * material exists about this agency. Generic insurance copy is worthless for that
 * — every agency has it. What no competitor and no partner site can replicate is
 * how cover actually works across the Missouri/Kansas state line, which is the
 * defining feature of this market: two states, two sets of rules, one metro.
 *
 * `faq` is rendered as visible content AND emitted as FAQPage JSON-LD. The two
 * must always be the same array — Google treats FAQ markup whose questions are not
 * visible on the page as spam.
 */
export const HUB_FAQ = {
  'personal-insurance': [
    {
      q: 'Do I need different cover if I live in Missouri but work in Kansas?',
      a: 'The policy follows where the vehicle is garaged and where you live, not where you commute. But the two states set different minimum liability requirements, and Kansas requires personal injury protection while Missouri does not. If you cross the state line daily, we check your limits against both so you are not under-insured on the Kansas side.',
    },
    {
      q: 'Why is hail such a big deal for home insurance around Kansas City?',
      a: 'The metro sits in one of the more hail-exposed parts of the country. That shows up in two ways: carriers increasingly apply a separate percentage wind/hail deductible rather than your standard flat deductible, and after a claim or two a carrier may restrict roof cover or refuse to renew. Knowing which deductible structure you have matters more here than almost anywhere.',
    },
    {
      q: 'Am I in a flood zone, and does it matter for insurance?',
      a: 'Flood is excluded from every standard homeowners policy, so it always needs its own cover. Flood zones set whether your lender requires it, not whether you are at risk — a large share of flood claims come from outside high-risk zones, usually from flash flooding after heavy rain.',
    },
    {
      q: 'Should I insure my home for what I paid or what it would cost to rebuild?',
      a: 'Rebuild cost, always. Market value includes the land, which does not burn down, and it moves with the housing market rather than with construction costs. Insuring to market value typically leaves you short at exactly the moment you need to rebuild.',
    },
    {
      q: 'Can I bundle home and auto, and is it actually cheaper?',
      a: 'Usually yes, and it is the fastest single saving available to most households. But it is not automatic — we quote the bundle against keeping the policies separate, because occasionally separate carriers win. The only way to know is to compare, which is what an independent agency is for.',
    },
  ],
  'business-insurance': [
    {
      q: 'What insurance does a Kansas City small business actually need?',
      a: 'Almost every business needs general liability, because landlords, general contractors and commercial clients require a certificate before they will let you start. If you have a premises and contents, a Business Owners Policy usually bundles that with liability at a better combined price. Workers compensation becomes required once you have employees, and commercial auto matters the moment anyone drives for the business.',
    },
    {
      q: 'Do subcontractors need to be covered under my workers compensation?',
      a: 'Only if they are on your payroll — but uninsured subcontractors can be reclassified as your employees at audit, which produces an unexpected premium bill. The practical answer is to collect a certificate of insurance from every subcontractor before they start, and we help clients set that process up.',
    },
    {
      q: 'My contracts require a certificate of insurance. How fast can you issue one?',
      a: 'Usually the same day for an existing policy, and often within the hour if you are already a client and the requirement is standard. Certificates naming a general contractor or landlord as additional insured are routine — send us the contract wording and we handle the rest.',
    },
    {
      q: 'Does my general liability policy cover a data breach?',
      a: 'No. Cyber liability is a separate policy, and general liability has no answer for a breach. Small businesses are common targets precisely because attackers assume they are unprepared, and notification and recovery costs arrive whether or not the breach was preventable.',
    },
    {
      q: 'We are a startup that just signed our first lease. What do we need first?',
      a: 'General liability, almost certainly — your lease and your first client contract will both require it. From there, a BOP adds property cover, and cyber and employment practices liability get layered on as you take on staff and data. Starting early means the programme grows with the business instead of being retrofitted after a claim.',
    },
  ],
  'life-insurance': [
    {
      q: 'How much life insurance do I actually need?',
      a: 'Enough to replace the income your household depends on, clear the debts that would otherwise fall to someone else, and cover the years your children are still dependent. We work from your real numbers rather than a multiple-of-salary rule of thumb, because the rule ignores both your mortgage and your childcare costs.',
    },
    {
      q: 'When should I start looking at Medicare?',
      a: 'Several months before you turn 65. Your initial enrolment window is time-limited, and the choices you make in it affect what is available to you later — particularly whether you can be medically underwritten for a Supplement. Starting early costs nothing and avoids a rushed decision.',
    },
    {
      q: 'Is Medicare Advantage or a Medicare Supplement better?',
      a: 'They trade off differently. Advantage plans usually have lower monthly premiums but network restrictions and variable out-of-pocket costs. Supplements cost more monthly and cover far more predictably. Which is better depends on your doctors, your prescriptions and how much tolerance you have for unpredictable costs.',
    },
    {
      q: 'Do I need a medical exam for life insurance?',
      a: 'Not always. Some products are available without one, particularly final expense cover. Where an exam is required, we prepare you for it — how you answer matters, and getting it right the first time avoids a declined application on your record.',
    },
    {
      q: 'Why does the beneficiary wording on my policy matter so much?',
      a: 'Because a life policy pays to whoever is named on the carriers beneficiary form, regardless of what your will says. A stale or blank designation is one of the most common and most expensive mistakes we find during a review — the money can end up somewhere you never intended.',
    },
  ],
};
/**
 * Every service page. `hub` must match a HUBS slug, or be 'specialty'.
 *
 * `key` is the stable identifier used by the JSON-LD `@id` and by internal links.
 */
export const SERVICES = [
  // ─────────────────────────── PERSONAL (9) ───────────────────────────
  {
    slug: 'home',
    hub: 'personal-insurance',
    name: 'Home Insurance',
    h1: 'Home Insurance in the Kansas City Metro',
    metaTitle: "Home Insurance | Lee's Summit & Kansas City | BIG",
    metaDescription:
      'Homeowners insurance for Kansas City metro families. Dwelling, contents, liability and loss of use, compared across multiple carriers.',
    blurb: 'Protection for the house you live in, its contents, and your liability as an owner.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'Dwelling and other structures',
      'Personal property and contents',
      'Personal liability',
      'Loss of use and additional living expenses',
      'Medical payments to others',
    ],
    searchIntent: 'homeowners insurance Kansas City',
    faq: [
      {
        q: "How much home insurance do I need in Lee's Summit or Kansas City?",
        a: "Enough to rebuild your home at today's construction costs, not what you paid for it. We review the dwelling limit against local rebuild costs, then set contents and liability around it. That is why an annual review matters — rebuild costs move every year.",
      },
      {
        q: 'Does home insurance cover flooding?',
        a: 'No. Flood is excluded from a standard homeowners policy and needs its own policy — usually through the NFIP. We write flood coverage separately, and we can quote it alongside your home policy.',
      },
      {
        q: 'Will filing a claim raise my premium?',
        a: 'It can, depending on the claim type and your carrier. That is why we walk through the claim with you before you file — sometimes a repair is cheaper than the long-term rate impact.',
      },
    ],
  },
  {
    slug: 'auto',
    hub: 'personal-insurance',
    name: 'Auto Insurance',
    h1: 'Auto Insurance in the Kansas City Metro',
    metaTitle: "Auto Insurance | Lee's Summit & Kansas City | BIG",
    metaDescription:
      'Car insurance for Missouri and Kansas drivers. Liability, collision, comprehensive and UM/UIM compared across multiple carriers.',
    blurb: 'Liability, collision and comprehensive cover for the vehicles you drive every day.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'Bodily injury and property damage liability',
      'Collision',
      'Comprehensive',
      'Uninsured and underinsured motorist',
      'Medical payments and personal injury protection',
      'Roadside assistance and rental reimbursement',
    ],
    searchIntent: 'auto insurance quotes Kansas City',
    faq: [
      {
        q: 'What are the minimum car insurance requirements in Missouri?',
        a: 'Missouri requires liability coverage, and Kansas requires both liability and personal injury protection. Because the two states differ — and Kansas City sits on the border — we check your policy against the rules of the state you actually drive in.',
      },
      {
        q: 'Can I bundle my home and auto insurance?',
        a: 'Yes, and it is usually the single fastest way to reduce what you pay. Most carriers discount the auto policy when the home policy sits with them, and we compare that bundle against keeping them separate.',
      },
      {
        q: 'Will a ticket or accident raise my rate?',
        a: 'It usually does, but not always by the amount people expect, and it falls off over time. If you have had a rate increase, bring it to us — we will re-shop the policy rather than let it renew quietly.',
      },
    ],
  },
  {
    slug: 'renters',
    hub: 'personal-insurance',
    name: 'Renters Insurance',
    h1: 'Renters Insurance',
    metaTitle: 'Renters Insurance | Kansas City & Missouri | BIG',
    metaDescription:
      'Renters insurance covering your belongings, liability and loss of use. Your landlord insures the building, not your things.',
    blurb: 'Your landlord insures the building. Renters insurance insures everything you own.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'Personal property, whether at home or in transit',
      'Personal liability',
      'Loss of use — somewhere to stay if the unit becomes unlivable',
      'Medical payments to others',
      'Off-premises theft, including from a vehicle',
    ],
    searchIntent: 'renters insurance Kansas City',
    faq: [
      {
        q: "Doesn't my landlord's policy cover my things?",
        a: 'No. Your landlord insures the building, not your belongings and not your personal liability. If a fire or a burst pipe destroys your furniture, or a guest is injured in your unit, the landlord\u2019s policy does not answer for it.',
      },
      {
        q: 'Is renters insurance expensive?',
        a: 'It is one of the cheapest policies you can buy, because the building itself is not your risk to insure. Most renters are surprised by the number.',
      },
      {
        q: 'Is my stuff covered if I take my laptop to a coffee shop?',
        a: 'Usually yes — most renters policies cover personal property away from the residence. We confirm the off-premises limit when we write it, because it varies by carrier.',
      },
    ],
  },
  {
    slug: 'condo',
    hub: 'personal-insurance',
    name: 'Condo Insurance',
    h1: 'Condo Insurance',
    metaTitle: 'Condo Insurance | Kansas City & Missouri | BIG',
    metaDescription:
      'Condo and townhome insurance built around your HOA master policy. Walls-in coverage, loss assessment and liability.',
    blurb: 'Walls-in coverage built around whatever your HOA master policy already handles.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'Building property — fixtures, cabinets and improvements inside your unit',
      'Personal property',
      'Loss assessment, when the HOA bills owners for a shared loss',
      'Personal liability',
      'Loss of use',
    ],
    searchIntent: 'condo insurance Kansas City',
    faq: [
      {
        q: 'How is condo insurance different from homeowners insurance?',
        a: 'The HOA master policy already insures the building shell and common areas. Your policy picks up from there — the interior finishes, your belongings, and your share of certain shared losses. Getting the split right is the whole job.',
      },
      {
        q: 'What is loss assessment coverage?',
        a: 'If the HOA suffers a large uninsured loss, it can bill every owner for a share. Loss assessment coverage pays that bill. We check the master policy to see how much you actually need.',
      },
      {
        q: 'Do I need to send you my HOA documents?',
        a: 'It helps a great deal. The master policy tells us where the HOA\u2019s responsibility ends and yours begins, so we can avoid both gaps and duplicated coverage.',
      },
    ],
  },
  {
    slug: 'landlord',
    hub: 'personal-insurance',
    name: 'Landlord & Rental Property Insurance',
    h1: 'Landlord & Rental Property Insurance',
    metaTitle: 'Landlord & Rental Property Insurance | Kansas City | BIG',
    metaDescription:
      'Insurance for rental properties and landlords. Dwelling, loss of rents, liability and premises cover across the Kansas City metro.',
    blurb: 'For property you rent out — including the rent you lose when it becomes unlivable.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'The dwelling itself',
      'Loss of rents while the unit is uninhabitable',
      'Landlord liability',
      'Fair rental value',
      'Premises liability for common areas',
    ],
    searchIntent: 'landlord insurance Kansas City',
    faq: [
      {
        q: 'Why not just use a homeowners policy on a rental?',
        a: 'Because a homeowners policy is written on the assumption that you live there. Once it is rented out, the occupancy is misrepresented and a claim can be declined. A landlord policy is the correct instrument.',
      },
      {
        q: 'Does it cover my tenant\u2019s belongings?',
        a: 'No — that is what renters insurance is for, and we ask every landlord client to require it in the lease. It protects your tenant and it protects you from being blamed for their loss.',
      },
      {
        q: 'What if the property sits vacant between tenants?',
        a: 'Tell us. A vacancy changes the risk materially, and most policies restrict coverage after a set number of days empty. We can arrange cover for the gap.',
      },
    ],
  },
  {
    slug: 'motorcycle-rv-boat',
    hub: 'personal-insurance',
    name: 'Motorcycle, RV & Boat Insurance',
    h1: 'Motorcycle, RV & Boat Insurance',
    metaTitle: 'Motorcycle, RV & Boat Insurance | Kansas City Metro | BIG',
    metaDescription:
      'Motorcycle, RV, motorhome and boat insurance for Kansas City metro owners. Agreed value, roadside and lay-up options available.',
    blurb:
      'One page for the toys — motorcycle, RV, motorhome and watercraft. Separate policies often share one set of discounts.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'Motorcycle and scooter — liability, collision, comprehensive and custom parts',
      'RV and motorhome — including full-timer and contents cover',
      'Boat and watercraft — hull, liability and trailer',
      'Lay-up periods for seasonal use',
      'Roadside assistance and towing',
    ],
    searchIntent: 'motorcycle insurance Kansas City',
    faq: [
      {
        q: 'Why are these three on one page?',
        a: 'Because they are the same conversation. Owners usually have more than one, the policies share discounts, and three near-identical pages saying the same thing would compete with each other in search. One thorough page serves you better.',
      },
      {
        q: 'Is my motorcycle covered in winter if I do not ride it?',
        a: 'Comprehensive cover still applies while it is stored — theft, fire and storm damage. Many carriers offer a lay-up option that reduces the premium during months you do not ride. Ask us before you store it.',
      },
      {
        q: 'Does my RV need its own policy or can it go on my auto policy?',
        a: 'Sometimes it can be added, but a motorhome is a different risk from a car and often does better on a dedicated policy. We compare both.',
      },
    ],
  },
  {
    slug: 'umbrella',
    hub: 'personal-insurance',
    name: 'Umbrella Liability Insurance',
    h1: 'Umbrella Liability Insurance',
    metaTitle: 'Personal Umbrella Liability Insurance | Kansas City | BIG',
    metaDescription:
      'Personal umbrella liability coverage above your home and auto limits, protecting your assets when a serious claim exceeds them.',
    blurb:
      'Extra liability above your home and auto limits, for the claim that outruns both.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'Liability above your home and auto limits',
      'Bodily injury and property damage claims',
      'Personal injury — libel, slander and defamation',
      'Claims arising away from home, including on vacation',
      'Legal defence costs',
    ],
    searchIntent: 'umbrella insurance Kansas City',
    faq: [
      {
        q: 'Do I really need an umbrella policy?',
        a: 'If you have savings, equity in a home, or a future income to protect, the honest answer is usually yes. A serious at-fault accident can exceed auto liability limits quickly, and the difference comes out of your assets rather than the insurer\u2019s.',
      },
      {
        q: 'How much does an umbrella policy usually cost?',
        a: 'Far less than people expect, because it only responds after your underlying policies are exhausted. It is one of the best value-per-dollar policies available.',
      },
      {
        q: 'Are there requirements to qualify?',
        a: 'Yes — carriers require minimum liability limits on your home and auto policies first. We check your underlying coverage and raise it if it falls short.',
      },
    ],
  },
  {
    slug: 'flood',
    hub: 'personal-insurance',
    name: 'Flood Insurance',
    h1: 'Flood Insurance in Missouri and Kansas',
    metaTitle: 'Flood Insurance in Missouri & Kansas | NFIP | BIG',
    metaDescription:
      'Flood insurance for Kansas City metro homes and businesses through NFIP and private carriers. Standard policies exclude flood.',
    blurb:
      'Separate from your home policy, and necessary across much of the Kansas City metro.',
    form: 'personal',
    source: 'site:personal-insurance + carrier assets (NFIP)',
    covers: [
      'Building coverage — structure and foundation',
      'Contents coverage — belongings inside',
      'Basement and below-grade areas, to policy limits',
      'Both NFIP and private flood markets compared',
    ],
    searchIntent: 'flood insurance Kansas City',
    faq: [
      {
        q: 'Is flood damage covered by my homeowners policy?',
        a: 'Almost never. Flood is a named exclusion on standard homeowners and renters policies. It needs a separate policy, and there is normally a waiting period before cover begins — so the time to buy it is before you need it.',
      },
      {
        q: 'I am not in a flood zone. Do I need it?',
        a: 'Flood zones set lending requirements, not risk. A significant share of flood claims come from outside high-risk zones, often from flash flooding that any heavy storm can produce.',
      },
      {
        q: 'Should I use NFIP or a private flood carrier?',
        a: 'It depends on the property, the elevation and the limits you need. We quote both where possible and tell you which one actually fits rather than defaulting to one.',
      },
    ],
  },
  {
    slug: 'valuable-articles',
    hub: 'personal-insurance',
    name: 'Valuable Articles Coverage',
    h1: 'Valuable Articles Coverage',
    metaTitle: 'Valuable Articles & Jewelry Insurance | Kansas City | BIG',
    metaDescription:
      'Scheduled coverage for jewelry, watches, art, collectibles and instruments. Agreed value, broader perils, no deductible.',
    blurb:
      'Jewellery, art, collectibles and instruments — scheduled, so they are not squeezed by your contents limit.',
    form: 'personal',
    source: 'site:personal-insurance',
    covers: [
      'Jewellery and watches',
      'Fine art and antiques',
      'Collectibles and memorabilia',
      'Musical instruments',
      'Cameras and specialist equipment',
      'Scheduled items at agreed value, typically with no deductible',
    ],
    searchIntent: 'jewelry insurance Kansas City',
    faq: [
      {
        q: 'Why not rely on my home contents coverage?',
        a: 'Because standard policies cap categories such as jewellery, silverware and cash at low sub-limits, and they exclude common causes like mysterious disappearance. A scheduled article is insured individually, at an agreed value, against broader perils.',
      },
      {
        q: 'What do you need from me?',
        a: 'Usually a receipt, an appraisal, or both, depending on the item and the value. For jewellery, a recent appraisal is normally required.',
      },
      {
        q: 'Is it covered when I travel or wear it?',
        a: 'Yes — scheduled coverage follows the item worldwide, which is one of its main advantages over the contents sub-limit.',
      },
    ],
  },

  // ─────────────────────────── BUSINESS (11) ───────────────────────────
  {
    slug: 'general-liability',
    hub: 'business-insurance',
    name: 'General Liability Insurance',
    h1: 'General Liability Insurance',
    metaTitle: 'General Liability Insurance | Kansas City | BIG',
    metaDescription:
      'General liability insurance for Kansas City businesses. Third-party injury, property damage, products and completed operations.',
    blurb:
      'The foundation policy: third-party injury, property damage, and the certificate most contracts require.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Third-party bodily injury',
      'Third-party property damage',
      'Products and completed operations',
      'Personal and advertising injury',
      'Legal defence costs',
    ],
    searchIntent: 'general liability insurance Kansas City',
    faq: [
      {
        q: 'Is general liability required by law?',
        a: 'Not generally — but it is required by almost everyone you work with. Landlords, general contractors and most commercial clients will not let you start without a certificate of insurance naming them.',
      },
      {
        q: 'Is general liability the same as a BOP?',
        a: 'No. A Business Owners Policy bundles general liability with commercial property, usually at a better combined price. If you have a premises and contents to insure, a BOP is often the smarter structure.',
      },
      {
        q: 'Does it cover my work once the job is finished?',
        a: 'Yes, that is what completed operations coverage is for. It responds to injury or damage caused by your completed work — which is exactly the exposure contractors carry for years after a job.',
      },
    ],
  },
  {
    slug: 'bop',
    hub: 'business-insurance',
    name: 'Business Owners Policy (BOP)',
    h1: 'Business Owners Policy (BOP)',
    metaTitle: 'Business Owners Policy (BOP) | Kansas City | BIG',
    metaDescription:
      'A Business Owners Policy bundles general liability with commercial property for small and mid-sized Kansas City businesses.',
    blurb:
      'General liability and commercial property in one package, priced for small and mid-sized businesses.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'General liability',
      'Commercial property — building and contents',
      'Business income and extra expense',
      'Equipment breakdown',
      'Signs, glass and outdoor property',
    ],
    searchIntent: 'business owners policy Kansas City',
    faq: [
      {
        q: 'Who is a BOP right for?',
        a: 'Most small and mid-sized businesses with a premises, contents and modest liability exposure — offices, retailers, restaurants, salons and many contractors. Larger or unusual risks often need a custom package instead.',
      },
      {
        q: 'Can I add coverage to a BOP later?',
        a: 'Yes. Cyber, employment practices liability, commercial auto and umbrella are commonly layered on top as the business grows.',
      },
      {
        q: 'Is a BOP always cheaper than separate policies?',
        a: 'Usually, but not automatically. We quote it both ways rather than assuming — that is the advantage of working with an independent agency.',
      },
    ],
  },
  {
    slug: 'commercial-property',
    hub: 'business-insurance',
    name: 'Commercial Property Insurance',
    h1: 'Commercial Property Insurance',
    metaTitle: 'Commercial Property Insurance | Kansas City | BIG',
    metaDescription:
      'Commercial property insurance for buildings, contents, inventory and business income across the Kansas City metro.',
    blurb: 'The building, the contents, the inventory — and the income you lose if they go.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Buildings you own or lease',
      'Contents, furniture, fixtures and equipment',
      'Inventory and stock',
      'Business income and extra expense',
      'Improvements and betterments',
    ],
    searchIntent: 'commercial property insurance Kansas City',
    faq: [
      {
        q: 'I lease my space. Do I still need property coverage?',
        a: 'Yes. Your landlord insures the building, not your contents, equipment or leasehold improvements — and most leases make you contractually responsible for them.',
      },
      {
        q: 'What is business income coverage?',
        a: 'It replaces the profit you would have earned, and pays continuing expenses, while your premises are unusable after a covered loss. Without it, a fire can end a business that survived the damage itself.',
      },
      {
        q: 'Should I insure at market value or replacement cost?',
        a: 'Replacement cost, in almost every case. Market value factors in land and depreciation, so it leaves you short at exactly the moment you need to rebuild.',
      },
    ],
  },
  {
    slug: 'commercial-auto',
    hub: 'business-insurance',
    name: 'Commercial Auto Insurance',
    h1: 'Commercial Auto Insurance',
    metaTitle: 'Commercial Auto Insurance | Kansas City | BIG',
    metaDescription:
      'Commercial auto insurance for owned, leased, hired and employee-owned vehicles used in business across the Kansas City metro.',
    blurb:
      'Any vehicle used for work — owned, leased, hired, or your employees\u2019 own cars.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Owned and leased vehicles',
      'Hired and non-owned auto',
      'Employee-owned vehicles used for work',
      'Liability, collision and comprehensive',
      'Cargo and towing',
    ],
    searchIntent: 'commercial auto insurance Kansas City',
    faq: [
      {
        q: 'Does a personal auto policy cover business use?',
        a: 'Usually not, or not adequately. Personal policies commonly exclude business use, and if an employee is driving their own car on your behalf, the exposure lands on the business. Hired and non-owned coverage is how you close that gap.',
      },
      {
        q: 'What is hired and non-owned auto coverage?',
        a: 'It covers the business when employees drive rental cars or their own vehicles for work. It is one of the most commonly missing coverages we find, and one of the cheapest to add.',
      },
      {
        q: 'Do I need commercial plates to get commercial auto insurance?',
        a: 'Not necessarily — the coverage follows the use, not the plate. We look at how the vehicles are actually used and title them appropriately.',
      },
    ],
  },
  {
    slug: 'workers-compensation',
    hub: 'business-insurance',
    name: "Workers' Compensation",
    h1: "Workers' Compensation Insurance",
    metaTitle: "Workers' Compensation Insurance | MO & KS | BIG",
    metaDescription:
      "Workers' compensation insurance for Kansas City metro employers. Medical costs, lost wages and employer liability cover.",
    blurb:
      'Required once you have employees, and the only policy that covers a workplace injury without a lawsuit.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Medical treatment for work-related injury or illness',
      'Replacement of lost wages',
      'Employer liability',
      'Return-to-work and rehabilitation support',
      'Coverage in line with Missouri and Kansas requirements',
    ],
    searchIntent: 'workers compensation insurance Missouri',
    faq: [
      {
        q: 'Is workers\u2019 compensation required in Missouri and Kansas?',
        a: 'Yes, once you have employees — though the thresholds and rules differ slightly between the two states. Because the metro spans both, we check your obligations against where your employees actually work.',
      },
      {
        q: 'Are subcontractors covered?',
        a: 'Generally only if they are on your payroll. Uninsured subcontractors can be treated as your employees at audit time, and that produces an unexpected bill. We help you collect certificates up front instead.',
      },
      {
        q: 'What happens if I misreport payroll?',
        a: 'The carrier audits at year end and adjusts the premium, sometimes significantly. Reporting accurately through the year avoids the surprise.',
      },
    ],
  },
  {
    slug: 'professional-liability-eo',
    hub: 'business-insurance',
    name: 'Professional Liability & E&O',
    h1: 'Professional Liability & Errors and Omissions',
    metaTitle: 'Professional Liability & E&O | Kansas City | BIG',
    metaDescription:
      'Professional liability and errors and omissions insurance for Kansas City professionals. Defence costs and claims from advice.',
    blurb:
      'For claims that you gave bad advice or missed something — not that anyone got hurt.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Negligent acts, errors and omissions',
      'Failure to deliver a service as promised',
      'Defence costs, which are often the larger number',
      'Claims arising from advice and professional judgement',
      'Prior-acts cover, where available',
    ],
    searchIntent: 'errors and omissions insurance Kansas City',
    faq: [
      {
        q: 'How is E&O different from general liability?',
        a: 'General liability responds to injury and physical damage. E&O responds to financial loss caused by your advice or a service you failed to perform. A consultant or designer can be sued without anyone being hurt, and general liability will not answer it.',
      },
      {
        q: 'Does it cover defence costs?',
        a: 'Yes, and this matters more than people realise — defending a professional claim frequently costs more than settling it. We check whether the policy pays defence inside or outside the limit, because the difference is substantial.',
      },
      {
        q: 'Are prior acts covered?',
        a: 'Sometimes, depending on the carrier and your history. It is one of the first things we establish, because a claim rarely arrives in the same year as the work that caused it.',
      },
    ],
  },
  {
    slug: 'cyber-epli-do',
    hub: 'business-insurance',
    name: 'Cyber Liability, EPLI & D&O',
    h1: 'Cyber Liability, Employment Practices & Directors and Officers',
    metaTitle: 'Cyber Liability, EPLI & D&O Insurance | Kansas City | BIG',
    metaDescription:
      'Cyber liability, employment practices liability and directors and officers cover for Kansas City businesses. Three key exposures.',
    blurb:
      'Three exposures with no general-liability answer: a data breach, an employment claim, and a claim against your decisions.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Cyber — data breach, ransomware, notification costs, business interruption, social engineering',
      'EPLI — discrimination, harassment, wrongful termination and retaliation claims',
      'D&O — claims against directors and officers for decisions made in that role',
      'Regulatory investigation costs',
    ],
    searchIntent: 'cyber liability insurance Kansas City',
    faq: [
      {
        q: 'Why are these three on one page?',
        a: 'They are the same conversation — management and operational exposures that a general liability policy excludes. Each has its own page-length of detail, but buyers almost always weigh them together. Splitting them into three thin pages would serve nobody.',
      },
      {
        q: 'We are small. Does cyber really apply to us?',
        a: 'Yes. Automated attacks do not target size, they target opportunity — and small businesses are common victims precisely because they are assumed to be unprepared. Notification and recovery costs arrive whether or not you could have prevented the breach.',
      },
      {
        q: 'Does EPLI cover a claim from a former employee?',
        a: 'That is exactly what it is for. Employment claims most often come from former employees, so the cover is written to respond after the relationship has ended.',
      },
    ],
  },
  {
    slug: 'commercial-umbrella',
    hub: 'business-insurance',
    name: 'Commercial Umbrella Insurance',
    h1: 'Commercial Umbrella Insurance',
    metaTitle: 'Commercial Umbrella Insurance | Kansas City | BIG',
    metaDescription:
      'Commercial umbrella liability above your general liability, auto and employer liability limits. Protect the business itself.',
    blurb: 'Liability limits above your underlying policies, for the claim that outruns them all.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Liability above general liability, auto and employer liability limits',
      'Bodily injury and property damage',
      'Personal and advertising injury',
      'Additional limits for contractual exposure',
    ],
    searchIntent: 'commercial umbrella insurance Kansas City',
    faq: [
      {
        q: 'When does a commercial umbrella make sense?',
        a: 'When a single serious claim could exceed your underlying limits and reach the business itself — which is most businesses with employees, vehicles, or a premises clients visit. The umbrella sits above, not instead of, your other liability policies.',
      },
      {
        q: 'What limits do I need underneath?',
        a: 'Carriers set minimum underlying limits, and the umbrella only responds once those are used. We review what you already carry before quoting, so the structure actually works at claim time.',
      },
      {
        q: 'Is it expensive?',
        a: 'It is usually one of the least expensive policies you can buy per dollar of protection, because it only responds after the underlying cover is exhausted.',
      },
    ],
  },
  {
    slug: 'inland-marine',
    hub: 'business-insurance',
    name: 'Inland Marine & Equipment Coverage',
    h1: 'Inland Marine & Equipment Coverage',
    metaTitle: 'Inland Marine & Equipment Insurance | Kansas City | BIG',
    metaDescription:
      'Inland marine coverage for tools, equipment and goods in transit — property that moves, which a property policy will not follow.',
    blurb:
      'Tools, equipment and goods in transit — property that moves, which a property policy will not follow.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Contractors\u2019 tools and equipment',
      'Property in transit, owned or on consignment',
      'Equipment you lease or rent out',
      'Installation and builder\u2019s risk floaters',
      'Mobile equipment and scheduled items',
    ],
    searchIntent: 'inland marine insurance Kansas City',
    faq: [
      {
        q: 'Why does my property policy not cover my tools?',
        a: 'Because commercial property policies insure property at a fixed location. The moment your tools are in a truck, on a job site or in transit, they are outside that. Inland marine exists to follow the property instead.',
      },
      {
        q: 'Does it cover equipment I rent to others?',
        a: 'It can, with the right endorsement or scheduled listing. We confirm what leaves your premises and how, because rented equipment is a distinct exposure.',
      },
      {
        q: 'Is a separate limit needed for high-value items?',
        a: 'Often yes. Items above a threshold are scheduled individually, which also removes the deductible on those items in most cases.',
      },
    ],
  },
  {
    slug: 'builders-risk',
    hub: 'business-insurance',
    name: 'Builders Risk Insurance',
    h1: 'Builders Risk Insurance',
    metaTitle: 'Builders Risk Insurance | Kansas City | BIG',
    metaDescription:
      'Builders risk insurance for construction and renovation projects, covering the structure while it is being built.',
    blurb: 'The structure while it is being built, for the period nothing else will insure it.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'The structure during construction',
      'Materials on site and in transit',
      'Materials stored off site',
      'Soft costs, where included',
      'Renovations to an existing building',
    ],
    searchIntent: 'builders risk insurance Kansas City',
    faq: [
      {
        q: 'Who buys builders risk — the owner or the contractor?',
        a: 'It depends on the contract, and getting it wrong leaves a gap. The construction agreement should state it explicitly; we review it with you so the responsibility is clear before work starts.',
      },
      {
        q: 'Does it cover a renovation, or only new builds?',
        a: 'Both. Renovations and additions typically need it too, because the existing property policy usually restricts cover while the building is under construction.',
      },
      {
        q: 'When does the cover end?',
        a: 'At completion, occupancy, or the policy expiry — whichever comes first. We diarise the completion date so the permanent property policy starts before this one stops.',
      },
    ],
  },
  {
    slug: 'specialized-industries',
    hub: 'business-insurance',
    name: 'Specialized Industry Programs',
    h1: 'Specialized Industry Programs',
    metaTitle: 'Specialized Industry Insurance Programs | Kansas City | BIG',
    metaDescription:
      'Insurance programs built for specific Kansas City industries: contractors, restaurants, manufacturers, retail, nonprofits and startups.',
    blurb:
      'Programs written for how your industry actually works — contractors, restaurants, manufacturers and more.',
    form: 'business',
    source: 'site:business-insurance',
    covers: [
      'Contractors and trades',
      'Restaurants and food service',
      'Manufacturing and light industrial',
      'Retail and e-commerce',
      'Professional offices',
      'Nonprofits and growing startups',
    ],
    searchIntent: 'contractor insurance Kansas City',
    faq: [
      {
        q: 'Why does industry matter so much to the price?',
        a: 'Because the exposure differs enormously. A restaurant carries kitchen fire and liquor exposure; a roofer carries height and completed-operations exposure. A program written for the class prices and covers the risks that actually apply.',
      },
      {
        q: 'Do you write contractors specifically?',
        a: 'Yes — general liability, tools and equipment, commercial auto and workers\u2019 compensation are the four policies contractors most often need together, and we can structure them as one programme.',
      },
      {
        q: 'We are a startup. Is it too early for insurance?',
        a: 'Almost never. Most startups need general liability before their first client or lease, and starting early means the coverage grows with the business rather than being retrofitted after a problem.',
      },
    ],
  },

  // ─────────────────────────── LIFE & HEALTH (3) ───────────────────────────
  {
    slug: 'life',
    hub: 'life-insurance',
    name: 'Life Insurance',
    h1: 'Life Insurance',
    metaTitle: 'Life Insurance in Kansas City & Missouri | BIG',
    metaDescription:
      'Term, whole and final expense life insurance through Farmers. Mortgage protection, key man and juvenile cover. Kansas City metro.',
    blurb: 'Term, whole and final expense cover, sized to what your family would actually need.',
    form: 'personal',
    source: 'site:life-insurance',
    covers: [
      'Term life',
      'Whole life and permanent cover',
      'Mortgage protection',
      'Key man life policies for business owners',
      'Juvenile coverage',
      'Final expense plans',
    ],
    searchIntent: 'life insurance Kansas City',
    faq: [
      {
        q: 'How much life insurance do I need?',
        a: 'Enough to replace the income your household depends on, clear the debts that would otherwise fall to someone else, and cover the years your children are still dependent. We work from your actual numbers rather than a rule of thumb.',
      },
      {
        q: 'Term or whole life?',
        a: 'Term covers a set period at the lowest cost per dollar of cover, which suits most young families. Whole life is permanent and builds cash value, which suits estate planning and lifelong obligations. The right answer depends on what the money is for.',
      },
      {
        q: 'Do I need a medical exam?',
        a: 'Not always. Some products are available without one, particularly for final expense cover. Where an exam is required, we prepare you for it so the underwriting reflects your health accurately.',
      },
    ],
  },
  {
    slug: 'medicare',
    hub: 'life-insurance',
    name: 'Medicare Solutions',
    h1: 'Medicare Solutions',
    metaTitle: 'Medicare Solutions & Supplement Plans | Kansas City | BIG',
    metaDescription:
      'Medicare guidance for Kansas City metro residents. Advantage, Supplement and Part D prescription coverage explained plainly.',
    blurb:
      'Advantage, Supplement and Part D — explained in plain English, before you enrol rather than after.',
    form: 'personal',
    source: 'site:bio + scope (value-added service)',
    covers: [
      'Medicare Advantage plans',
      'Medicare Supplement (Medigap) plans',
      'Part D prescription drug coverage',
      'Annual review of coverage against changing needs',
      'Guidance on enrolment windows',
    ],
    searchIntent: 'medicare insurance Kansas City',
    faq: [
      {
        q: 'When should I start looking at Medicare?',
        a: 'Several months before you turn 65, because your initial enrolment window is time-limited and the choices you make then affect your options later. Starting early costs nothing and avoids a rushed decision.',
      },
      {
        q: 'Advantage or Supplement?',
        a: 'Advantage plans often have lower monthly premiums but network restrictions and out-of-pocket costs. Supplements cost more monthly and cover more predictably. Which one is better depends on your doctors, prescriptions and tolerance for variable costs.',
      },
      {
        q: 'Does it cost me anything to review my options with you?',
        a: 'No. We review what is available in your area, explain the differences, and you decide. There is no pressure and no obligation.',
      },
    ],
  },
  {
    slug: 'estate-planning',
    hub: 'life-insurance',
    name: 'Estate Planning',
    h1: 'Estate Planning',
    metaTitle: 'Estate Planning & Legacy Protection | Kansas City | BIG',
    metaDescription:
      'Estate planning support for Kansas City metro families, making sure the protection you have reaches the people you intend.',
    blurb:
      'Making sure the protection you have in place actually reaches the people you meant it for.',
    form: 'personal',
    source: 'site:bio + scope (value-added service)',
    covers: [
      'Coordinating life insurance with your estate intentions',
      'Beneficiary review and alignment',
      'Legacy and final expense planning',
      'Business succession considerations',
      'Coordination with your attorney and tax adviser',
    ],
    searchIntent: 'estate planning insurance Kansas City',
    faq: [
      {
        q: 'Do you write wills and trusts?',
        a: 'No — that is legal work and belongs with your attorney. Our role is the insurance side: making sure the policies and beneficiary designations line up with the plan your attorney has drafted.',
      },
      {
        q: 'Why does beneficiary wording matter so much?',
        a: 'Because a policy pays to whoever is named on the form, regardless of what a will says. A stale or blank beneficiary designation is one of the most common and most expensive mistakes we find during a review.',
      },
      {
        q: 'When should an estate plan be reviewed?',
        a: 'After any major life event — marriage, divorce, a birth, a death, or a significant change in assets — and periodically even when nothing obvious has changed.',
      },
    ],
  },

  // ─────────────────────────── SPECIALTY (7) ───────────────────────────
  {
    slug: 'surety-bonds',
    hub: 'specialty',
    name: 'Surety Bonds',
    h1: 'Surety Bonds',
    metaTitle: 'Surety Bonds in Missouri & Kansas | Kansas City | BIG',
    metaDescription:
      'Surety bonds for Kansas City contractors and businesses. Licence, permit, performance, payment and court bonds.',
    blurb:
      'Licence, permit, performance and court bonds — required before you can bid or open, not after.',
    form: 'business',
    source: 'site:bio + carrier assets (CANA Surety, AON Edge)',
    covers: [
      'Licence and permit bonds',
      'Performance and payment bonds',
      'Bid bonds',
      'Court and probate bonds',
      'Notary and fidelity bonds',
    ],
    searchIntent: 'surety bonds Kansas City',
    faq: [
      {
        q: 'How is a surety bond different from insurance?',
        a: 'An insurance policy transfers risk; a surety bond is a guarantee that you will perform. You remain liable to repay the surety if a claim is paid, which is why underwriting focuses on your financial strength rather than the risk itself.',
      },
      {
        q: 'How long does it take to get a bond?',
        a: 'Simple licence and permit bonds can be issued the same day. Performance bonds for larger contracts need financial statements and take longer, especially the first time.',
      },
      {
        q: 'Will I need to pledge collateral?',
        a: 'Often not for smaller bonds, once the surety knows you. Larger performance bonds may require indemnity or collateral depending on your financial position.',
      },
    ],
  },
  {
    slug: 'travel',
    hub: 'specialty',
    name: 'Travel Insurance',
    h1: 'Travel Insurance',
    metaTitle: 'Travel Insurance | Kansas City Metro | BIG',
    metaDescription:
      'Travel insurance for Kansas City metro travellers. Trip cancellation, emergency medical and evacuation cover.',
    blurb:
      'Trip cancellation, medical and evacuation cover — for when something goes wrong far from home.',
    form: 'personal',
    source: 'site:homepage extras',
    covers: [
      'Trip cancellation and interruption',
      'Emergency medical and dental',
      'Emergency evacuation and repatriation',
      'Baggage and personal effects',
      'Travel delay',
    ],
    searchIntent: 'travel insurance Kansas City',
    faq: [
      {
        q: 'Is travel insurance worth it?',
        a: 'For any trip with meaningful prepaid cost, or any destination where your health plan will not follow you, yes. The medical and evacuation element is the part people most often need and least often expect.',
      },
      {
        q: 'Does my health insurance cover me abroad?',
        a: 'Rarely in the way people assume. Medicare does not cover care outside the United States, and many private plans limit or exclude it. That gap is what travel medical cover fills.',
      },
      {
        q: 'When should I buy it?',
        a: 'When you make your first trip payment. Some benefits, particularly cancellation for a pre-existing condition, depend on buying within a set window of that first deposit.',
      },
    ],
  },
  {
    slug: 'pet',
    hub: 'specialty',
    name: 'Pet Insurance',
    h1: 'Pet Insurance',
    metaTitle: 'Pet Insurance | Kansas City Metro | BIG',
    metaDescription:
      'Pet insurance for Kansas City metro owners. Accidents, illness, hereditary conditions and optional wellness cover.',
    blurb:
      'So that a vet bill is never the reason a treatable condition goes untreated.',
    form: 'personal',
    source: 'site:homepage extras',
    covers: [
      'Accidents and injuries',
      'Illnesses and hereditary conditions',
      'Diagnostics, surgery and hospitalisation',
      'Optional wellness and routine care',
      'Prescription medication',
    ],
    searchIntent: 'pet insurance Kansas City',
    faq: [
      {
        q: 'Is pet insurance worth the monthly cost?',
        a: 'It depends on your tolerance for an unexpected bill. A single emergency surgery commonly runs into four figures, and the value of the cover is that the decision at that moment becomes a medical one rather than a financial one.',
      },
      {
        q: 'Does it cover pre-existing conditions?',
        a: 'Generally no, which is why enrolling while your pet is young and healthy matters. Conditions that appear after enrolment are typically covered; ones that existed before are not.',
      },
      {
        q: 'Does it cover routine care?',
        a: 'Basic policies cover accidents and illness. Wellness and routine care is usually an optional add-on, and whether it is worth it depends on how much routine care your pet needs.',
      },
    ],
  },
  {
    slug: 'device-protection',
    hub: 'specialty',
    name: 'Device Protection',
    h1: 'Device Protection',
    metaTitle: 'Device Protection Insurance | Kansas City | BIG',
    metaDescription:
      'Device protection for phones, tablets and laptops. Accidental damage, breakdown and theft cover without a carrier plan.',
    blurb:
      'Phones, tablets and laptops — accidental damage and breakdown, without a carrier plan.',
    form: 'personal',
    source: 'site:homepage extras',
    covers: [
      'Accidental damage and drops',
      'Mechanical breakdown outside warranty',
      'Theft',
      'Liquid damage',
      'Repair or replacement',
    ],
    searchIntent: 'device protection insurance',
    faq: [
      {
        q: 'How is this different from my phone carrier\u2019s plan?',
        a: 'It is a separate policy, so it is not tied to staying with one network and it can cover several devices under one arrangement. Carrier plans also vary a lot in what they actually pay out.',
      },
      {
        q: 'Does it cover a lost phone?',
        a: 'Loss and theft are usually covered, sometimes as an optional extension. We confirm which before you buy, because the definitions differ between carriers.',
      },
      {
        q: 'Is there a deductible?',
        a: 'Usually yes, per claim. We tell you the figure up front so you can weigh it against the cost of the device.',
      },
    ],
  },
  {
    slug: 'sola-wind-hail',
    hub: 'specialty',
    name: 'Sola Wind & Hail Coverage',
    h1: 'Sola Wind & Hail Coverage',
    metaTitle: 'Wind & Hail Insurance Coverage | Kansas City | BIG',
    metaDescription:
      'Specialist wind and hail coverage through Sola for Kansas City metro properties that standard carriers restrict or surcharge.',
    blurb:
      'Specialist wind and hail cover for roofs and properties standard carriers restrict or surcharge.',
    form: 'personal',
    source: 'site:homepage extras',
    covers: [
      'Wind and hail damage to roofs',
      'Properties standard carriers decline or surcharge',
      'Cosmetic damage provisions explained clearly',
      'Higher and lower deductible options',
    ],
    searchIntent: 'wind and hail insurance coverage',
    faq: [
      {
        q: 'Why would I need specialist wind and hail cover?',
        a: 'Because the Kansas City metro sits in a hail-exposed region, and after a claim or two a standard carrier may raise the deductible, restrict roof cover, or decline to renew. A specialist market is built for exactly that situation.',
      },
      {
        q: 'What is a cosmetic damage exclusion?',
        a: 'It means the policy will not pay to replace a roof that still performs its function, even though it looks marked. This is one of the most important terms in a wind and hail policy, and we read it out to you rather than leaving it in the small print.',
      },
      {
        q: 'Can I keep my existing policy and add this?',
        a: 'Sometimes. The right structure depends on what your current carrier has already restricted. We review the existing policy first and tell you honestly whether a change is worth making.',
      },
    ],
  },
  {
    slug: 'premium-lock',
    hub: 'specialty',
    name: 'Premium Lock',
    h1: 'Premium Lock',
    metaTitle: 'Premium Lock for Home & Auto | Kansas City | BIG',
    metaDescription:
      'Premium Lock rate protection for Kansas City metro policyholders, now for home and auto, so a renewal increase does not arrive unannounced.',
    blurb:
      'Rate protection for home and auto, so a renewal increase does not arrive unannounced.',
    form: 'personal',
    source: 'site:homepage extras',
    covers: [
      'Protection against unexpected renewal increases',
      'Premium Lock for auto, new for 2026',
      'Terms and eligibility confirmed in writing before you commit',
      'Reviewed annually alongside your other policies',
    ],
    searchIntent: 'premium lock insurance rate protection',
    newsLink: '/news/premium-lock-for-auto',
    newsLabel: 'Read the announcement: Premium Lock for Auto is here',
    faq: [
      {
        q: 'What does Premium Lock actually do?',
        a: 'It is a rate-protection product designed to keep your premium predictable at renewal. The exact terms and eligibility depend on the carrier, and we confirm them in writing before you commit rather than describing them loosely.',
      },
      {
        q: 'Does Premium Lock cover auto?',
        a: 'Yes. Premium Lock for Auto launched in October 2026: available in all 50 states with any admitted lines carrier, on 6- or 12-month policies, creating 3 years of pricing predictability. The average American already pays more to insure their car than their home, so auto is where the guarantee matters most. Quotes come through the Premium Lock portal.',
      },
      {
        q: 'Does it mean my premium can never change?',
        a: 'No product can promise that indefinitely — taxes, fees and changes you make to the policy can still affect it. What it addresses is the carrier-initiated increase at renewal. We are precise about this because the difference matters.',
      },
      {
        q: 'Is it available on every policy?',
        a: 'No. Availability depends on the carrier and the line of business. We check eligibility against your actual policies before recommending it.',
      },
    ],
  },
  {
    slug: 'farmers-insurance',
    hub: 'specialty',
    name: 'Farmers Insurance',
    h1: 'Farmers Insurance',
    metaTitle: 'Farmers Insurance Agent | Kansas City Metro | BIG',
    metaDescription:
      'Ballentine Insurance Group is a Farmers Insurance agency serving the Kansas City metro, alongside a wider panel of carriers.',
    blurb:
      'We are a Farmers agency — and independent enough to compare Farmers against the wider market.',
    form: 'personal',
    source: 'site:life-insurance + Farmers agent listing',
    covers: [
      'Farmers home, auto and life products',
      'Farmers commercial lines',
      'Compared against our wider carrier panel',
      'Local service from a Farmers-appointed agency',
    ],
    searchIntent: 'Farmers Insurance agent Kansas City',
    faq: [
      {
        q: 'Are you a Farmers agency or an independent agency?',
        a: 'Both, and it works in your favour. We are a Farmers-appointed agency, and we also hold appointments with a wider panel of carriers. That means we can quote Farmers directly and still tell you honestly when another carrier fits better.',
      },
      {
        q: 'Should I buy Farmers because you are a Farmers agency?',
        a: 'Only if it is the right answer for you. Our job is to compare, not to steer. Where Farmers is competitive we will say so plainly, and where it is not we will show you what is.',
      },
      {
        q: 'Can I keep my existing Farmers policy and just move it to you?',
        a: 'In most cases yes, and you keep the continuity of cover. Bring your declarations page and we will review it before anything changes.',
      },
    ],
  },
];

/** Services belonging to a hub slug. */
export function servicesByHub(hubSlug) {
  return SERVICES.filter((s) => s.hub === hubSlug);
}

/**
 * Canonical path for a service page.
 * `specialty` is not a hub page of its own, so those sit at the root.
 */
export function servicePath(service) {
  return service.hub === 'specialty'
    ? `/specialty/${service.slug}`
    : `/${service.hub}/${service.slug}`;
}

/** The Jotform URL a service posts to. */
export const SPECIALTY_GROUP = {
  slug: 'specialty',
  title: 'Specialty & Additional Coverage',
  h1: 'Specialty & Additional Coverage',
  metaTitle: 'Specialty Insurance — Bonds, Travel, Pet & More | Kansas City | BIG',
  metaDescription:
    'Surety bonds, travel, pet, device protection, wind and hail, premium lock and Farmers products — specialty coverage from a Kansas City metro independent agency.',
  blurb:
    'Bonds, travel, pet and the products that do not sit neatly under personal or business.',
  intro: [
    'Not every policy fits neatly under personal or business insurance. These are the products our clients ask for alongside their main cover — some required before they can work, some protecting things a standard policy will not.',
  ],
};

/**
 * Home offer card copy, verbatim from the live insure-big.com home page
 * (OCR evidence, 2026-10-15). The home cards use these instead of the hub
 * blurbs, because this is the copy the live site leads with. Spec 0003.
 */
export const HOME_OFFER_COPY = {
  'personal-insurance':
    'At BIG, insurance is personal. We tailor coverage for home, auto, life, and more, partnering with carriers to deliver options, pricing, and peace of mind.',
  'business-insurance':
    'BIG delivers customized business insurance for your unique risks, partnering with top carriers to offer competitive rates, comprehensive coverage, and expert guidance.',
  'life-insurance':
    'BIG offers flexible life insurance through Farmers, plus Medicare guidance and estate planning from the same local team.',
};

/**
 * The live home FAQ questions (OCR evidence). The live accordion answers were
 * not captured, so these answers are drafted from the agency's documented
 * facts and flagged for review before they are final. Spec 0003.
 */
export const HOME_FAQ = [
  {
    q: 'What types of insurance do you offer?',
    a: 'Home, auto, renters, condo, landlord, umbrella, flood, business, life, Medicare, surety bonds, travel, pet, device protection and more. If you do not see it listed, call us: we write coverage well beyond this list.',
  },
  {
    q: 'How do I get an insurance quote?',
    a: 'Fill out the quote form on any page or call (816) 868-1787. One of our team follows up, usually the same business day.',
  },
  {
    q: 'Is getting a quote free?',
    a: 'Yes. Quotes are free and carry no obligation.',
  },
  {
    q: 'How long does it take to receive my quote?',
    a: 'Most quotes come back within one business day, once we have your details.',
  },
  {
    q: 'What information do I need to prepare?',
    a: 'Basic details about what you are insuring (property, vehicles, or business), your current coverage, and a way to reach you.',
  },
  {
    q: 'Can I customize my insurance coverage?',
    a: 'Yes. As an independent agency we compare across carriers and build the cover around your needs, not a shelf product.',
  },
  {
    q: 'Will my information be kept confidential?',
    a: 'Yes. Your information is used only to prepare your quotes and is handled per our privacy policy.',
  },
];
