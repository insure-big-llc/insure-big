/**
 * One-off metadata normaliser. NOT part of the build.
 *
 * Rewrites `metaTitle` and `metaDescription` in src/config/services.js so that:
 *   - every title ends in the short brand marker "| BIG" and is <= 62 chars
 *   - every description is <= 158 chars
 *
 * Run once: node scripts/normalise-meta.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('../src/config/services.js', import.meta.url);
let src = readFileSync(FILE, 'utf8');

/** slug -> [title, description] */
const META = {
  // Hubs
  'personal-insurance': [
    "Personal Insurance | Lee's Summit & Kansas City | BIG",
    "Home, auto, renters, condo, umbrella and flood insurance for Kansas City metro families, compared across multiple carriers. Get a quote.",
  ],
  'business-insurance': [
    'Business Insurance in Kansas City & Missouri | BIG',
    "General liability, BOP, commercial property, workers' comp and more for Kansas City businesses. Independent agency. Request a review.",
  ],
  'life-insurance': [
    'Life, Medicare & Estate Planning | Kansas City | BIG',
    'Life insurance, Medicare solutions and estate planning for Kansas City metro families. Mortgage protection, key man and final expense cover.',
  ],

  // Personal
  home: [
    "Home Insurance | Lee's Summit & Kansas City | BIG",
    'Homeowners insurance for Kansas City metro families. Dwelling, contents, liability and loss of use, compared across multiple carriers.',
  ],
  auto: [
    "Auto Insurance | Lee's Summit & Kansas City | BIG",
    'Car insurance for Missouri and Kansas drivers. Liability, collision, comprehensive and UM/UIM compared across multiple carriers.',
  ],
  renters: [
    'Renters Insurance | Kansas City & Missouri | BIG',
    'Renters insurance covering your belongings, liability and loss of use. Your landlord insures the building, not your things.',
  ],
  condo: [
    'Condo Insurance | Kansas City & Missouri | BIG',
    'Condo and townhome insurance built around your HOA master policy. Walls-in coverage, loss assessment and liability.',
  ],
  landlord: [
    'Landlord & Rental Property Insurance | KC | BIG',
    'Insurance for rental properties and landlords. Dwelling, loss of rents, liability and premises cover across the Kansas City metro.',
  ],
  'motorcycle-rv-boat': [
    'Motorcycle, RV & Boat Insurance | KC Metro | BIG',
    'Motorcycle, RV, motorhome and boat insurance for Kansas City metro owners. Agreed value, roadside and lay-up options available.',
  ],
  umbrella: [
    'Personal Umbrella Liability Insurance | KC | BIG',
    'Personal umbrella liability coverage above your home and auto limits, protecting your assets when a serious claim exceeds them.',
  ],
  flood: [
    'Flood Insurance in Missouri & Kansas | NFIP | BIG',
    'Flood insurance for Kansas City metro homes and businesses through NFIP and private carriers. Standard policies exclude flood.',
  ],
  'valuable-articles': [
    'Valuable Articles & Jewelry Insurance | KC | BIG',
    'Scheduled coverage for jewelry, watches, art, collectibles and instruments. Agreed value, broader perils, no deductible.',
  ],

  // Business
  'general-liability': [
    'General Liability Insurance | Kansas City | BIG',
    'General liability insurance for Kansas City businesses. Third-party injury, property damage, products and completed operations.',
  ],
  bop: [
    'Business Owners Policy (BOP) | Kansas City | BIG',
    'A Business Owners Policy bundles general liability with commercial property for small and mid-sized Kansas City businesses.',
  ],
  'commercial-property': [
    'Commercial Property Insurance | Kansas City | BIG',
    'Commercial property insurance for buildings, contents, inventory and business income across the Kansas City metro.',
  ],
  'commercial-auto': [
    'Commercial Auto Insurance | Kansas City | BIG',
    'Commercial auto insurance for owned, leased, hired and employee-owned vehicles used in business across the Kansas City metro.',
  ],
  'workers-compensation': [
    "Workers' Compensation Insurance | MO & KS | BIG",
    "Workers' compensation insurance for Kansas City metro employers. Medical costs, lost wages and employer liability cover.",
  ],
  'professional-liability-eo': [
    'Professional Liability & E&O Insurance | KC | BIG',
    'Professional liability and errors and omissions insurance for Kansas City professionals. Defence costs and claims from advice.',
  ],
  'cyber-epli-do': [
    'Cyber Liability, EPLI & D&O Insurance | KC | BIG',
    'Cyber liability, employment practices liability and directors and officers cover for Kansas City businesses. Three key exposures.',
  ],
  'commercial-umbrella': [
    'Commercial Umbrella Insurance | Kansas City | BIG',
    'Commercial umbrella liability above your general liability, auto and employer liability limits. Protect the business itself.',
  ],
  'inland-marine': [
    'Inland Marine & Equipment Insurance | KC | BIG',
    'Inland marine coverage for tools, equipment and goods in transit — property that moves, which a property policy will not follow.',
  ],
  'builders-risk': [
    'Builders Risk Insurance | Kansas City | BIG',
    'Builders risk insurance for construction and renovation projects, covering the structure while it is being built.',
  ],
  'specialized-industries': [
    'Specialized Industry Insurance Programs | KC | BIG',
    'Insurance programs built for specific Kansas City industries: contractors, restaurants, manufacturers, retail, nonprofits and startups.',
  ],

  // Life & Health
  life: [
    'Life Insurance in Kansas City & Missouri | BIG',
    'Term, whole and final expense life insurance through Farmers. Mortgage protection, key man and juvenile cover. Kansas City metro.',
  ],
  medicare: [
    'Medicare Solutions & Supplement Plans | KC | BIG',
    'Medicare guidance for Kansas City metro residents. Advantage, Supplement and Part D prescription coverage explained plainly.',
  ],
  'estate-planning': [
    'Estate Planning & Legacy Protection | KC | BIG',
    'Estate planning support for Kansas City metro families, making sure the protection you have reaches the people you intend.',
  ],

  // Specialty
  'surety-bonds': [
    'Surety Bonds in Missouri & Kansas | KC | BIG',
    'Surety bonds for Kansas City contractors and businesses. Licence, permit, performance, payment and court bonds.',
  ],
  travel: [
    'Travel Insurance | Kansas City Metro | BIG',
    'Travel insurance for Kansas City metro travellers. Trip cancellation, emergency medical and evacuation cover.',
  ],
  pet: [
    'Pet Insurance | Kansas City Metro | BIG',
    'Pet insurance for Kansas City metro owners. Accidents, illness, hereditary conditions and optional wellness cover.',
  ],
  'device-protection': [
    'Device Protection Insurance | Kansas City | BIG',
    'Device protection for phones, tablets and laptops. Accidental damage, breakdown and theft cover without a carrier plan.',
  ],
  'sola-wind-hail': [
    'Wind & Hail Insurance Coverage | Kansas City | BIG',
    'Specialist wind and hail coverage through Sola for Kansas City metro properties that standard carriers restrict or surcharge.',
  ],
  'premium-lock': [
    'Premium Lock — Rate Protection | Kansas City | BIG',
    'Premium Lock rate protection for Kansas City metro policyholders, so a renewal increase does not arrive unannounced.',
  ],
  'farmers-insurance': [
    "Farmers Insurance Agent | Kansas City & Lee's Summit | BIG",
    'Ballentine Insurance Group is a Farmers Insurance agency serving the Kansas City metro, alongside a wider panel of carriers.',
  ],
};

/** Serialize a JS string safely for the config file. */
function js(str) {
  // Use double quotes when the string contains an apostrophe, single otherwise.
  if (str.includes("'")) return JSON.stringify(str);
  return `'${str}'`;
}

let replacedTitles = 0;
let replacedDescs = 0;

for (const [slug, [title, desc]] of Object.entries(META)) {
  // Match the block for this slug and replace the two properties inside it.
  const blockRe = new RegExp(
    `(slug:\\s*'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?metaTitle:\\s*)(?:'[^']*'|"[^"]*")(,[\\s\\S]*?metaDescription:\\s*)(?:'[^']*'|"[^"]*")`,
    'm',
  );
  if (!blockRe.test(src)) {
    console.error(`  ! could not match slug: ${slug}`);
    continue;
  }
  src = src.replace(blockRe, (_m, p1, p2) => {
    replacedTitles++;
    replacedDescs++;
    return `${p1}${js(title)}${p2}${js(desc)}`;
  });
}

writeFileSync(FILE, src, 'utf8');
console.log(`Rewrote ${replacedTitles} titles and ${replacedDescs} descriptions.`);

// Report any that are still too long.
for (const [slug, [title, desc]] of Object.entries(META)) {
  if (title.length > 62) console.error(`  ! title too long (${title.length}): ${slug}`);
  if (desc.length > 158) console.error(`  ! description too long (${desc.length}): ${slug}`);
}
