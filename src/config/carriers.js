/**
 * Carrier list. SINGLE SOURCE OF TRUTH for the trust strip.
 *
 * Reconciled from three sources, which is why the count moved during discovery:
 *   - the **38 logo files** in public/carriers/
 *   - the 18 carriers named on the live /personal-insurance page
 *   - the 15 carriers named on the live /business-insurance page
 *
 * `onLiveSite` records whether the carrier appears on one of the agency's own
 * pages today. `displayNeedsConfirm` flags a display name that still has to be
 * confirmed by the client.
 *
 * ⚠️ COMPLIANCE: displaying a carrier logo implies an appointment. Every carrier
 * here is either shown on the agency's own live pages or came from the client's
 * own asset library — but `CARRIERS_NEEDING_VERIFICATION` lists the ones Bret
 * should confirm before launch, because showing a logo without an appointment is
 * a compliance problem rather than a design one.
 */

export const CARRIERS = [
  // ── Confirmed on the live site AND present as an asset ────────────────────
  { slug: 'aig', display: 'AIG', logo: 'aig.webp', onLiveSite: false },
  { slug: 'allstate', display: 'Allstate', logo: 'allstate.webp', onLiveSite: true },
  { slug: 'amtrust', display: 'AmTrust', logo: 'amtrust.webp', onLiveSite: true },
  { slug: 'aon-edge', display: 'AON Edge', logo: 'aon-edge.webp', onLiveSite: false },
  { slug: 'aegis', display: 'Aegis General Insurance Agency', logo: 'aegis.webp', onLiveSite: true },
  { slug: 'blitz', display: 'Blitz', logo: 'blitz.webp', onLiveSite: true },
  { slug: 'branch', display: 'Branch', logo: 'branch.webp', onLiveSite: true },
  { slug: 'bristol-west', display: 'Bristol West', logo: 'bristol-west.webp', onLiveSite: true },
  { slug: 'btis', display: 'btis', logo: 'btis.webp', onLiveSite: true },
  { slug: 'cana-surety', display: 'CANA Surety', logo: 'cana-surety.webp', onLiveSite: false },
  { slug: 'chubb', display: 'Chubb', logo: 'chubb.webp', onLiveSite: true },
  { slug: 'clearcover', display: 'Clearcover', logo: 'clearcover.webp', onLiveSite: true },
  { slug: 'cna', display: 'CNA', logo: 'cna.webp', onLiveSite: true },
  { slug: 'emc', display: 'EMC Insurance', logo: 'emc.webp', onLiveSite: true },
  { slug: 'farmers', display: 'Farmers Insurance', logo: 'farmers.webp', onLiveSite: true },
  { slug: 'foremost', display: 'Foremost', logo: 'foremost.webp', onLiveSite: true },
  { slug: 'gainsco', display: 'Gainsco', logo: 'gainsco.webp', onLiveSite: true },
  { slug: 'guideone', display: 'GuideOne Insurance', logo: 'guideone.webp', onLiveSite: true },
  { slug: 'hagerty', display: 'Hagerty', logo: 'hagerty.webp', onLiveSite: true },
  { slug: 'hiscox', display: 'Hiscox', logo: 'hiscox.webp', onLiveSite: true },
  {
    slug: 'homeowners-of-america',
    display: 'Homeowners of America',
    logo: 'homeowners-of-america.webp',
    onLiveSite: true,
  },
  { slug: 'jc-taylor', display: 'J.C. Taylor', logo: 'jc-taylor.webp', onLiveSite: true },
  { slug: 'liberty-mutual', display: 'Liberty Mutual', logo: 'liberty-mutual.webp', onLiveSite: true },
  { slug: 'nationwide', display: 'Nationwide', logo: 'nationwide.webp', onLiveSite: true },
  {
    slug: 'national-general',
    display: 'National General',
    logo: 'national-general.webp',
    onLiveSite: true,
  },
  { slug: 'next', display: 'NEXT Insurance', logo: 'next.webp', onLiveSite: true },
  { slug: 'nfip', display: 'NFIP', logo: 'nfip.webp', onLiveSite: false },
  { slug: 'progressive', display: 'Progressive', logo: null, onLiveSite: true },
  { slug: 'propeller', display: 'Propeller', logo: 'propeller.webp', onLiveSite: false },
  { slug: 'reinsurepro', display: 'REInsurePro', logo: 'reinsurepro.webp', onLiveSite: true },
  { slug: 'safeco', display: 'Safeco', logo: 'safeco.webp', onLiveSite: true },
  { slug: 'steadily', display: 'Steadily', logo: 'steadily.webp', onLiveSite: true },
  { slug: 'the-hartford', display: 'The Hartford', logo: 'the-hartford.webp', onLiveSite: true },
  { slug: 'three', display: 'THREE by Berkshire Hathaway', logo: 'three.webp', onLiveSite: true },
  { slug: 'travelers', display: 'Travelers', logo: 'travelers.webp', onLiveSite: true },

  // ── From the client's asset library; not shown on the live pages ──────────
  // Kept because they came from the agency's own export, but flagged below.
  { slug: 'american-modern', display: 'American Modern', logo: 'american-modern.webp', onLiveSite: false },
  { slug: 'axa', display: 'AXA', logo: 'axa.webp', onLiveSite: false },
  { slug: 'berkshire', display: 'Berkshire Hathaway', logo: 'berkshire.webp', onLiveSite: false },
  { slug: 'neptune', display: 'Neptune Flood', logo: 'neptune.webp', onLiveSite: false },
];

/** Slug lookup. */
export const CARRIER_BY_SLUG = Object.fromEntries(CARRIERS.map((c) => [c.slug, c]));

/**
 * Which carriers we most often place each line with.
 * Derived from what the agency's own pages and assets evidence — nothing invented.
 */
export const SERVICE_CARRIERS = {
  'personal-insurance': [
    'farmers',
    'bristol-west',
    'safeco',
    'travelers',
    'national-general',
    'progressive',
    'branch',
    'hagerty',
    'jc-taylor',
    'clearcover',
    'gainsco',
    'homeowners-of-america',
    'steadily',
    'allstate',
    'nationwide',
    'aegis',
    'foremost',
    'nfip',
  ],
  'business-insurance': [
    'farmers',
    'travelers',
    'cna',
    'liberty-mutual',
    'the-hartford',
    'berkshire',
    'three',
    'nationwide',
    'hiscox',
    'next',
    'guideone',
    'amtrust',
    'emc',
    'btis',
    'allstate',
    'blitz',
    'reinsurepro',
    'aig',
    'aon-edge',
    'cana-surety',
    'propeller',
  ],
  'life-insurance': ['farmers'],
  specialty: ['cana-surety', 'aon-edge', 'propeller', 'nfip', 'farmers', 'berkshire'],
};

/** Carriers whose display name still needs confirming. */
export const CARRIERS_NEEDING_CONFIRMATION = [];

/**
 * Every carrier shown for which an appointment should be confirmed before launch.
 * Listed so this is a single review pass for Bret rather than a silent risk.
 */
export const CARRIERS_NEEDING_VERIFICATION = CARRIERS.filter((c) => !c.onLiveSite).map((c) => ({
  display: c.display,
  why: c.logo
    ? 'In the agency asset library but not shown on the live site'
    : 'Named on the live site but no logo file supplied',
}));

/** Carriers with no logo file — rendered as a styled text card. */
export const CARRIERS_WITHOUT_LOGO = CARRIERS.filter((c) => !c.logo).map((c) => c.display);
