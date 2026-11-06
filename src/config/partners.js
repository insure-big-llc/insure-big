/**
 * Partner programmes: the cover lines we place through a third party.
 *
 * THE RULE (decided 6 November 2026)
 * A partner product page has NO on-site form. Its one quote button goes straight
 * to the partner's referral link (`url` below), because the application, the
 * pricing and the underwriting all happen on the partner's platform and an extra
 * form in front of it only adds a step. The button is labelled with what it does
 * (`ctaLabel`), opens in a new tab and carries rel="sponsored noopener noreferrer"
 * because it is a paid referral link. The page still ranks and qualifies: the
 * original explainer, the disclosure and the FAQ stay on insure-big.com.
 *
 * Every other page (service, hub, office, contact) sends the visitor to the
 * on-site quote form at /get-a-quote instead.
 *
 * `agentOfRecord` and `returnPath` are NULL where not yet confirmed. Templates
 * must render a neutral default and must NOT assert ownership.
 *
 * Consent note: a prospect sent straight to a partner gives the agency no
 * documented consent of its own. The page therefore says plainly that the
 * application finishes on the partner's site, and offers the phone as an
 * alternative so a client can still deal with the agency directly.
 */

export const PARTNERS = {
  'device-protection': {
    product: 'Device Protection',
    /** The one quote button on this partner's page. */
    ctaLabel: "Get a Device Protection Quote",
    partner: 'Likewize',
    programName: "Farmers' Device Protection",
    url: 'https://protect.likewize.com/farmers/electronic-device-insurance?refid=ball00q&utm_medium=agent',
    /** 'agency' = the partner platform carries OUR brand/appointment. */
    attribution: 'agency',
    evidence: 'The destination is Farmers-branded ("Farmers\' Device Protection, Powered by Likewize").',
    agentOfRecord: true,
    returnPath: 'partner-notifies-agent',
    disclosure: 'Device protection is administered by Likewize on behalf of Farmers.',
    /** Bret's highlight for the device protection page (2026-10-25). */
    highlight: '1 device for $18/month, or all home appliances and 4 phones for $35/month.',
    shipsLink: true,
  },

  'surety-bonds': {
    product: 'Surety Bonds',
    /** The one quote button on this partner's page. */
    ctaLabel: "Request a Bond Quote",
    partner: 'Propeller',
    programName: 'Farmers Surety Bonds, powered by Propeller',
    url: 'https://14089f.propeller.insure/axelerator-public/',
    attribution: 'agency',
    evidence:
      'Farmers-branded portal; the subdomain carries agent code 14089F, which is Bret\'s Farmers code.',
    agentOfRecord: true,
    returnPath: 'partner-notifies-agent',
    disclosure: 'Surety bonds are placed through Propeller under the Farmers appointment.',
    highlight: 'Access to multiple established and highly rated surety companies, including CNA Surety.',
    shipsLink: true,
  },

  'sola-wind-hail': {
    product: 'Sola Wind & Hail',
    /** The one quote button on this partner's page. */
    ctaLabel: "Get a Wind & Hail Quote",
    partner: 'Sola Insurance',
    programName: 'Sola Wind & Hail',
    url: 'https://solainsurance.com/quote-application/get-quote?email=bballentine%40farmersagent.com',
    attribution: 'agency',
    evidence:
      'The quote page header reads "Wind/Hail Quote | Bret Ballentine" with the BIG logo and (816) 868-1787 — the best attribution of any partner.',
    agentOfRecord: true,
    returnPath: 'partner-notifies-agent',
    disclosure: 'Wind and hail coverage is placed through Sola Insurance.',
    highlight: 'Wind and hail coverage with a dedicated quote path, attributed to our agency.',
    /**
     * The URL carries Bret's personal Farmers email, percent-encoded. The client
     * has chosen to keep it. scripts/verify-seo.mjs lists this as a KNOWN
     * EXCEPTION so the check stays honest rather than silently passing.
     * Replacing it is a one-line change here.
     */
    knownEmailParam: true,
    shipsLink: true,
  },

  'premium-lock': {
    product: 'Premium Lock',
    /** The one quote button on this partner's page. */
    ctaLabel: "Get a Premium Lock Quote",
    partner: 'Eventual Climate',
    programName: 'Premium Lock — 3-year price guarantee for home and auto',
    url: 'https://eventualclimate.com/request-quote/4ddde0ee-b28b-4015-918c-6d4b853d00d6',
    attribution: 'co-branded',
    evidence:
      'Carries "Ballentine Insurance Group" and "Request a quote from Bret Ballentine" alongside the 3-year price guarantee.',
    agentOfRecord: true,
    returnPath: 'partner-notifies-agent',
    disclosure:
      'Premium Lock is administered by Eventual Climate. Ballentine Insurance Group remains your agency.',
    highlight: 'A 3-year price guarantee on home insurance — and now auto too.',
    shipsLink: true,
  },

  'estate-planning': {
    product: 'Estate Planning',
    /** The one quote button on this partner's page. */
    ctaLabel: "Start Your Estate Plan",
    partner: 'FastWill',
    programName: 'FastWill attorney-designed estate plans',
    url: 'https://fastwill.com/advisors/invite/aa4afaab2b',
    attribution: 'co-branded',
    evidence:
      'Shows "Recommended by your advisor — Bret Ballentine, Ballentine Insurance Group" and "Bret partnered with FastWill".',
    agentOfRecord: true,
    returnPath: 'partner-notifies-agent',
    disclosure:
      'Estate planning is provided by FastWill. Document preparation is not legal advice from Ballentine Insurance Group.',
    highlight: 'Create your Will, Trust, Power of Attorney, and Advance Healthcare Directive online.',
    shipsLink: true,
    /**
     * ⚠️ LIVE MIS-ROUTE TO FIX ON THE CURRENT SITE: the Surety Bonds "LEARN MORE"
     * button on /business-insurance points at this FastWill URL. Recorded here so
     * it is not lost.
     */
    knownMisrouteNote: 'The live business page surety-bonds button links here in error.',
  },

  pet: {
    product: 'Pet Insurance',
    /** The one quote button on this partner's page. */
    ctaLabel: "Get a Pet Insurance Quote",
    partner: 'Pets Best',
    programName: 'Pets Best pet health insurance',
    url: 'https://www.petsbest.com/enroll/step1?qv1=8849P4&qv2=AGENTLINK&ci=FIGAGTLNK',
    attribution: 'none',
    evidence:
      'The destination carries NO Ballentine or Farmers identity — it is a generic Pets Best enrollment page ("Trusted by more than 1,000,000 pets").',
    /** Not confirmed. Templates must not claim either way. */
    agentOfRecord: null,
    returnPath: null,
    disclosure:
      'Pet insurance is underwritten and administered by Pets Best. Completing their application does not make Ballentine Insurance Group your agent of record.',
    highlight: 'Pets Best can cover up to 90% of eligible vet bills.',
    shipsLink: true,
  },

  travel: {
    product: 'Travel Insurance',
    /** The one quote button on this partner's page. */
    ctaLabel: "Compare Travel Plans",
    partner: 'TravelInsurance.com',
    programName: 'TravelInsurance.com',
    url: 'https://www.travelinsurance.com/?utm_source=pap&a_aid=65f07b225c0a4',
    attribution: 'none',
    evidence:
      'The destination carries NO Ballentine identity — a generic comparison site ("Over 120,000 5-star reviews", US Travel Insurance Association member).',
    agentOfRecord: null,
    returnPath: null,
    disclosure:
      'Travel insurance is compared and sold through TravelInsurance.com. Completing their application does not make Ballentine Insurance Group your agent of record.',
    highlight: 'Compare travel insurance plans from multiple providers and buy online.',
    shipsLink: true,
  },

  medicare: {
    product: 'Medicare',
    /** The one quote button on this partner's page. */
    ctaLabel: "Explore Medicare Options",
    partner: 'Chris Bell Insurance',
    programName: 'Medicare solutions',
    /**
     * The live site links Medicare to chrisbellinsurance.com, and the client
     * confirmed the link (2026-10-15). It ships now, with the informational
     * label and the disclosure, per spec 0003.
     */
    url: 'https://chrisbellinsurance.com/',
    attribution: 'partner-site',
    evidence:
      'The live insure-big.com Medicare card links to chrisbellinsurance.com; the client supplied and confirmed the link.',
    agentOfRecord: null,
    returnPath: null,
    disclosure:
      'Medicare plans are offered through Chris Bell Insurance, a licensed Medicare specialist. Call us and we will guide you through your options.',
    highlight: 'Medicare information, enrollment, and alternative plan options.',
    shipsLink: true,
    pendingConfirmation: false,
  },
};

/** Partners whose link is safe to render today. */
export const SHIPPABLE_PARTNERS = Object.entries(PARTNERS)
  .filter(([, p]) => p.shipsLink && p.url)
  .map(([slug, p]) => ({ slug, ...p }));

/** Partners still awaiting confirmation before a link can be emitted. */
export const PENDING_PARTNERS = Object.entries(PARTNERS)
  .filter(([, p]) => p.pendingConfirmation || !p.shipsLink)
  .map(([slug, p]) => ({ slug, ...p }));

/** Lookup by specialist page slug. */
export function partnerFor(slug) {
  return PARTNERS[slug] ?? null;
}
