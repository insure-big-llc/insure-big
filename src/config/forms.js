/**
 * The quote forms: one definition, used three ways.
 *
 *   1. src/components/QuoteForm.astro renders the fields from it.
 *   2. The browser script validates each step with `validateFields`.
 *   3. netlify/functions/lead.mjs validates the whole submission again on the
 *      server with the SAME function, so a bot that skips the page gets no
 *      further than a visitor who typed rubbish.
 *
 * Fields mirror the agency's two Google Forms, with three deliberate changes:
 *   - Date of birth and FEIN are optional. Both are sensitive, a lean form
 *     converts better, and the team can collect them on the call.
 *   - Text message consent is an optional checkbox. Consent to marketing texts
 *     cannot be a condition of getting a quote. Flip `CONSENT.required` to make
 *     it mandatory once compliance has decided.
 *   - "Best time for call" is a simple choice, not a time picker.
 *
 * Pure module: no imports, no JSON, no DOM. Keep it that way, the function
 * bundle and the verify script both import it directly.
 */

export const CONSENT = {
  /** Bump when the wording changes. Stored with every lead as the record. */
  version: '2026-11-06',
  required: false,
  label: 'Yes, you may text me about my quote',
  text:
    'By checking this box, I expressly consent by electronic signature to receive communications via text message from Ballentine Insurance Group or its agents at the telephone number above (even if my number is listed on any state, federal, local or corporate Do Not Call list), including my wireless number, for the purpose of receiving information on insurance products and services. Carrier message and data rates may apply. Up to 10 messages per month. Reply HELP for help or STOP to opt out. My consent is not required as a condition of purchasing any goods or services, and I may revoke it at any time. For help or more information contact bret@insure-big.com.',
};

const US_STATE_RE = /^[A-Za-z]{2}$/;

const CARRIERS = [
  'State Farm', 'Shelter', 'Progressive', 'American Family', 'Farm Bureau', 'Auto-Owners',
  'Chubb', 'GEICO', 'AAA', 'Allstate', 'Travelers', 'Nationwide', 'USAA', 'Safeco',
  'Other', 'Not currently insured',
];

const BEST_TIME = ['Morning', 'Midday', 'Afternoon', 'Anytime'];

const address = [
  { name: 'street', label: 'Street address', type: 'text', required: true, autocomplete: 'street-address', maxLength: 120, width: 'full' },
  { name: 'city', label: 'City', type: 'text', required: true, autocomplete: 'address-level2', maxLength: 80, width: 'half' },
  { name: 'state', label: 'State', type: 'text', required: true, autocomplete: 'address-level1', maxLength: 2, width: 'quarter', placeholder: 'MO', pattern: 'state' },
  { name: 'zip', label: 'ZIP code', type: 'text', required: true, autocomplete: 'postal-code', inputmode: 'numeric', maxLength: 10, width: 'quarter', placeholder: '64063', pattern: 'zip' },
];

export const QUOTE_FORMS = {
  personal: {
    id: 'personal',
    label: 'Personal & life',
    blurb: 'Home, auto, renters, umbrella, life and more.',
    steps: [
      {
        id: 'you',
        title: 'About you',
        intro: 'So we know who to come back to.',
        fields: [
          { name: 'fullName', label: 'Full name', type: 'text', required: true, autocomplete: 'name', maxLength: 100, width: 'full' },
          { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', inputmode: 'email', maxLength: 120, placeholder: 'you@example.com', width: 'half' },
          { name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', maxLength: 20, placeholder: '(816) 555-0100', pattern: 'phone', width: 'half' },
          { name: 'preferredContact', label: 'Best way to reach you', type: 'radio', options: ['Email', 'Phone', 'Text'], width: 'full' },
          { name: 'dob', label: 'Date of birth', type: 'date', hint: 'Optional. It lets us start your quote faster, or we can ask on the call.', pattern: 'dob', sensitive: true, width: 'half' },
        ],
      },
      {
        id: 'needs',
        title: 'What you need',
        intro: 'Pick everything you would like quoted.',
        fields: [
          {
            name: 'lines', label: 'Coverage', type: 'checkbox-group', required: true, requiredMessage: 'Pick at least one kind of cover.',
            options: ['Auto', 'Home', 'Life', 'Renters', 'Umbrella', 'Motorcycle', 'Boat', 'RV', 'Other'], width: 'full',
          },
          ...address,
          { name: 'currentCarrier', label: 'Current insurance company', type: 'select', options: CARRIERS, placeholder: 'Select one', width: 'full' },
          { name: 'comments', label: 'Anything else we should know?', type: 'textarea', maxLength: 1500, width: 'full', placeholder: 'Renewal date, a recent claim, how many vehicles…' },
        ],
      },
    ],
  },

  business: {
    id: 'business',
    label: 'Business',
    blurb: 'Liability, property, workers\u2019 comp, auto and more.',
    steps: [
      {
        id: 'business',
        title: 'Your business',
        intro: 'The basics, so we can price it properly.',
        fields: [
          { name: 'businessName', label: 'Business name', type: 'text', required: true, autocomplete: 'organization', maxLength: 120, width: 'full' },
          { name: 'entityType', label: 'Entity type', type: 'select', required: true, options: ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other'], placeholder: 'Select one', width: 'half' },
          { name: 'businessStartYear', label: 'Year started', type: 'text', inputmode: 'numeric', maxLength: 4, placeholder: '2018', pattern: 'year', hint: 'Optional. A new venture can leave it blank.', width: 'half' },
          { name: 'natureOfBusiness', label: 'What does the business do?', type: 'text', required: true, maxLength: 160, placeholder: 'Restaurant, retail, auto repair, landscaping…', width: 'full' },
          { name: 'operations', label: 'Tell us a little more about the operations', type: 'textarea', maxLength: 1500, width: 'full' },
          { name: 'ownerNames', label: 'Owner name(s)', type: 'text', required: true, maxLength: 140, width: 'half' },
          { name: 'fein', label: 'FEIN', type: 'text', inputmode: 'numeric', maxLength: 10, placeholder: '12-3456789', pattern: 'fein', hint: 'Optional. We can collect it on the call.', sensitive: true, width: 'half' },
        ],
      },
      {
        id: 'contact',
        title: 'Contact and location',
        intro: 'Where the business is and how to reach you.',
        fields: [
          { name: 'fullName', label: 'Your name', type: 'text', required: true, autocomplete: 'name', maxLength: 100, width: 'full' },
          { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', inputmode: 'email', maxLength: 120, placeholder: 'you@yourbusiness.com', width: 'half' },
          { name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', maxLength: 20, placeholder: '(816) 555-0100', pattern: 'phone', width: 'half' },
          ...address,
          { name: 'bestTime', label: 'Best time for a call', type: 'radio', options: BEST_TIME, width: 'full' },
        ],
      },
      {
        id: 'coverage',
        title: 'Coverage',
        intro: 'Roughly is fine. We will confirm the detail.',
        fields: [
          {
            name: 'lines', label: 'Which lines would you like quoted?', type: 'checkbox-group', required: true, requiredMessage: 'Pick at least one line.',
            options: ['General Liability', 'Property', 'Workers\u2019 Compensation', 'Professional Liability', 'Commercial Auto', 'Cyber Liability', 'Business Owners Policy (BOP)', 'Other'], width: 'full',
          },
          { name: 'annualRevenue', label: 'Annual revenue', type: 'text', maxLength: 40, placeholder: '$500,000', hint: 'A new venture can give an estimate.', width: 'half' },
          { name: 'employees', label: 'Employees', type: 'text', maxLength: 40, placeholder: '4 full time, 2 part time', width: 'half' },
          { name: 'currentCarrier', label: 'Current insurance company', type: 'text', maxLength: 100, hint: 'Leave blank if this is new business.', width: 'full' },
          { name: 'comments', label: 'Anything else we should know?', type: 'textarea', maxLength: 1500, width: 'full' },
        ],
      },
    ],
  },
};

/** Flat field list for a form, with the step index attached. */
export function allFields(type) {
  const form = QUOTE_FORMS[type];
  if (!form) return [];
  return form.steps.flatMap((step, stepIndex) => step.fields.map((f) => ({ ...f, stepIndex })));
}

/**
 * Service slug (from the page the visitor came from) to the form type and the
 * coverage option to tick. Anything not listed falls back to "Other".
 */
export const LINE_MAP = {
  home: ['personal', 'Home'],
  auto: ['personal', 'Auto'],
  renters: ['personal', 'Renters'],
  condo: ['personal', 'Home'],
  landlord: ['personal', 'Home'],
  'motorcycle-rv-boat': ['personal', 'Motorcycle'],
  umbrella: ['personal', 'Umbrella'],
  flood: ['personal', 'Home'],
  'valuable-articles': ['personal', 'Other'],
  life: ['personal', 'Life'],
  'general-liability': ['business', 'General Liability'],
  bop: ['business', 'Business Owners Policy (BOP)'],
  'commercial-property': ['business', 'Property'],
  'commercial-auto': ['business', 'Commercial Auto'],
  'workers-compensation': ['business', 'Workers\u2019 Compensation'],
  'professional-liability-eo': ['business', 'Professional Liability'],
  'cyber-epli-do': ['business', 'Cyber Liability'],
  'commercial-umbrella': ['business', 'Other'],
  'inland-marine': ['business', 'Other'],
  'builders-risk': ['business', 'Other'],
  'specialized-industries': ['business', 'Other'],
};

// ── Normalising and validating ───────────────────────────────────────────────

/** Digits only, dropping a leading country code. */
export function phoneDigits(value) {
  const d = String(value ?? '').replace(/\D/g, '');
  return d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
}

/** (816) 555-0100, as far as the digits allow. */
export function formatPhone(value) {
  const d = phoneDigits(value).slice(0, 10);
  if (d.length <= 3) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Check one field. Returns an error message, or '' when fine.
 * `value` is a string, or an array of strings for a checkbox group.
 */
export function validateField(field, value) {
  const isArray = Array.isArray(value);
  const text = isArray ? '' : String(value ?? '').trim();
  const empty = isArray ? value.length === 0 : text === '';

  if (empty) {
    if (field.required) {
      if (field.requiredMessage) return field.requiredMessage;
      return field.type === 'select' || field.type === 'radio' ? 'Please choose one.' : 'This is needed so we can help.';
    }
    return '';
  }

  if (field.type === 'checkbox-group') {
    if (!isArray) return 'Please choose from the list.';
    if (!value.every((v) => field.options.includes(v))) return 'Please choose from the list.';
    return '';
  }
  if (isArray) return 'Please enter a single value.';

  if (field.maxLength && text.length > field.maxLength && field.type !== 'text') return 'That is a little long.';
  if (field.maxLength && text.length > field.maxLength) return 'That is a little long.';

  if (field.type === 'email' && !EMAIL_RE.test(text)) return 'Enter an email like name@example.com.';
  if (field.type === 'select' || field.type === 'radio') {
    return field.options.includes(text) ? '' : 'Please choose from the list.';
  }

  switch (field.pattern) {
    case 'phone':
      return phoneDigits(text).length === 10 ? '' : 'Enter a 10 digit phone number.';
    case 'state':
      return US_STATE_RE.test(text) ? '' : 'Use the two letter state, like MO.';
    case 'zip':
      return /^\d{5}(-\d{4})?$/.test(text) ? '' : 'Enter a 5 digit ZIP code.';
    case 'year': {
      const y = Number(text);
      return /^\d{4}$/.test(text) && y >= 1900 && y <= new Date().getFullYear() ? '' : 'Enter a four digit year.';
    }
    case 'fein':
      return /^\d{2}-?\d{7}$/.test(text) ? '' : 'Use the format 12-3456789.';
    case 'dob': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return 'Enter a valid date.';
      const d = new Date(`${text}T00:00:00Z`);
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
      return Number.isNaN(d.getTime()) || age < 16 || age > 110 ? 'Enter a valid date of birth.' : '';
    }
    default:
      return '';
  }
}

/** Validate a list of fields against a flat values object. Returns { name: message }. */
export function validateFields(fields, values) {
  const errors = {};
  for (const f of fields) {
    const msg = validateField(f, values[f.name]);
    if (msg) errors[f.name] = msg;
  }
  return errors;
}

/**
 * Whole submission check, used by the server. Takes the raw values, returns
 * `{ ok, errors, clean }` where `clean` holds only known fields, trimmed.
 */
export function validateSubmission(type, raw) {
  if (!QUOTE_FORMS[type]) return { ok: false, errors: { _form: 'Unknown form.' }, clean: {} };
  const fields = allFields(type);
  const values = {};
  for (const f of fields) {
    const v = raw?.[f.name];
    if (f.type === 'checkbox-group') values[f.name] = Array.isArray(v) ? v.map(String) : v ? [String(v)] : [];
    else values[f.name] = typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim();
  }
  const errors = validateFields(fields, values);

  const consentGiven = raw?.consent === true || raw?.consent === 'true' || raw?.consent === 'on' || raw?.consent === '1';
  if (CONSENT.required && !consentGiven) errors.consent = 'Please tick the box to continue.';

  const clean = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.pattern === 'phone' && v) clean[f.name] = formatPhone(v);
    else if (f.pattern === 'state' && v) clean[f.name] = v.toUpperCase();
    else clean[f.name] = v;
  }
  return { ok: Object.keys(errors).length === 0, errors, clean, consentGiven };
}

/** Hosts a submission may come from. Previews and local development included. */
export function allowedOrigin(origin) {
  if (!origin) return false;
  let host;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  return (
    host === 'insure-big.com' ||
    host === 'www.insure-big.com' ||
    host === 'insurebig.netlify.app' ||
    host.endsWith('--insurebig.netlify.app') ||
    host === 'localhost' ||
    host === '127.0.0.1'
  );
}

/** A short reference the visitor can quote on the phone. */
export function makeRef(now = Date.now(), rand = Math.random) {
  const a = now.toString(36).toUpperCase().slice(-6);
  const b = Math.floor(rand() * 36 ** 4).toString(36).toUpperCase().padStart(4, '0');
  return `BIG-${a}-${b}`;
}
