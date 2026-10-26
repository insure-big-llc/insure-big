/**
 * Partner programmes — the cover lines we place through a third party.
 *
 * WHY THIS FILE EXISTS
 * The eight specialist products below are written through partner platforms, and
 * on the live site the ONLY destination for them is the partner's own domain. That
 * means the indexed destination for "surety bonds Kansas City" is a partner site
 * carrying no Ballentine identity — the agency builds the search intent and the
 * partner captures the brand.
 *
 * The fix is a separation of jobs, not a removal of links:
 *   - insure-big.com is the page that RANKS and QUALIFIES
 *   - the partner application is the TRANSACTIONAL destination, reached from it
 *   - the on-site Jotform stays the PRIMARY call to action, so a lead is captured
 *     with consent and attribution before anyone leaves the site
 *
 * ⚠️ `agentOfRecord` and `returnPath` are NULL where not yet confirmed. Templates
 * must render a neutral default and must NOT assert ownership. Confirming later is
 * a one-line edit here, with no page changes.
 *
 * ⚠️ Consent note: the on-site Jotform carries the agency's TCPA consent block. A
 * prospect sent straight to a partner gives the agency NO documented consent — yet
 * if the partner emails that lead back, the agency owes a follow-up with no consent
 * record. That is a second, independent reason the on-site form leads.
 */

export const PARTNERS = {
  'device-protection': {
    product: 'Device Protection',
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
    /**
     * Because the destination carries no agency identity, the on-site form is the
     * ONLY guaranteed path by which the agency keeps the customer and the consent
     * record. Templates must present the form first and prominently.
     */
    formMustLead: true,
  },

  travel: {
    product: 'Travel Insurance',
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
    formMustLead: true,
  },

  medicare: {
    product: 'Medicare',
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
    formMustLead: true,
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
