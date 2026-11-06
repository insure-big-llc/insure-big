/**
 * Gate for the quote forms (src/config/forms.js, src/lib/lead-handler.js and the
 * built /get-a-quote page). Runs as part of `npm run verify`.
 *
 *   1. The field definitions are sane: unique names per form, every select has
 *      options, every step has a title.
 *   2. The validator accepts a good personal and business lead and rejects bad
 *      ones, field by field.
 *   3. The /api/lead handler, run against a fake fetch: rejects other origins and
 *      other methods, silently drops honeypot and too fast posts (and never
 *      forwards them), forwards a good lead exactly once with the secret and the
 *      consent record, retries once on a 5xx, and reports a 502 when n8n is down.
 *   4. The built page: both forms, every field name, the /api/lead action, the
 *      honeypot, and no trace of Jotform anywhere in dist.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { QUOTE_FORMS, allFields, validateSubmission, validateField, allowedOrigin, formatPhone, CONSENT } from '../src/config/forms.js';
import { handleLead } from '../src/lib/lead-handler.js';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const errors = [];
const fail = (m) => errors.push(m);
const notes = [];

// ── 1. Definitions ───────────────────────────────────────────────────────────
for (const [type, form] of Object.entries(QUOTE_FORMS)) {
  const seen = new Set();
  if (form.steps.length < 2) fail(`${type}: needs at least two steps`);
  for (const step of form.steps) {
    if (!step.title) fail(`${type}: a step has no title`);
    for (const f of step.fields) {
      if (seen.has(f.name)) fail(`${type}: duplicate field name "${f.name}"`);
      seen.add(f.name);
      if ((f.type === 'select' || f.type === 'radio' || f.type === 'checkbox-group') && !f.options?.length) {
        fail(`${type}.${f.name}: choice field without options`);
      }
      if (!f.label) fail(`${type}.${f.name}: no label`);
    }
  }
  for (const need of ['fullName', 'email', 'phone', 'lines']) {
    if (!seen.has(need)) fail(`${type}: required field "${need}" is missing`);
  }
}
if (formatPhone('8165550100') !== '(816) 555-0100') fail('formatPhone does not format a 10 digit number');

// ── 2. Validator ─────────────────────────────────────────────────────────────
const goodPersonal = {
  fullName: 'Sarah Chen', email: 'sarah@example.com', phone: '(816) 555-0100',
  lines: ['Home', 'Auto'], street: '16 SE 3rd St', city: "Lee's Summit", state: 'mo', zip: '64063',
};
const goodBusiness = {
  businessName: 'Chen Landscaping LLC', entityType: 'LLC', natureOfBusiness: 'Landscaping', ownerNames: 'Sarah Chen',
  fullName: 'Sarah Chen', email: 'sarah@chenlandscaping.com', phone: '8165550100',
  street: '200 NE 91 St', city: 'Kansas City', state: 'MO', zip: '64155', lines: ['General Liability'],
};
{
  const p = validateSubmission('personal', goodPersonal);
  if (!p.ok) fail(`a good personal lead was rejected: ${JSON.stringify(p.errors)}`);
  else if (p.clean.state !== 'MO' || p.clean.phone !== '(816) 555-0100') fail('personal lead was not normalised (state, phone)');
  const b = validateSubmission('business', goodBusiness);
  if (!b.ok) fail(`a good business lead was rejected: ${JSON.stringify(b.errors)}`);
  else if (b.clean.phone !== '(816) 555-0100') fail('business phone was not normalised');
}
const mustReject = [
  ['personal', { ...goodPersonal, email: 'not-an-email' }, 'email'],
  ['personal', { ...goodPersonal, phone: '12345' }, 'phone'],
  ['personal', { ...goodPersonal, lines: [] }, 'lines'],
  ['personal', { ...goodPersonal, lines: ['Yacht'] }, 'lines'],
  ['personal', { ...goodPersonal, zip: 'ABCDE' }, 'zip'],
  ['personal', { ...goodPersonal, state: 'Missouri' }, 'state'],
  ['personal', { ...goodPersonal, fullName: '' }, 'fullName'],
  ['personal', { ...goodPersonal, dob: '2024-01-01' }, 'dob'],
  ['personal', { ...goodPersonal, comments: 'x'.repeat(1600) }, 'comments'],
  ['business', { ...goodBusiness, entityType: 'Cult' }, 'entityType'],
  ['business', { ...goodBusiness, businessName: '' }, 'businessName'],
  ['business', { ...goodBusiness, fein: '123' }, 'fein'],
  ['business', { ...goodBusiness, businessStartYear: '1066' }, 'businessStartYear'],
];
for (const [type, data, field] of mustReject) {
  const r = validateSubmission(type, data);
  if (r.ok || !r.errors[field]) fail(`${type}: bad ${field} was accepted`);
}
if (validateSubmission('mystery', goodPersonal).ok) fail('an unknown form type was accepted');
if (!validateSubmission('personal', { ...goodPersonal, dob: '' }).ok) fail('an empty date of birth must be allowed');
if (!validateSubmission('business', { ...goodBusiness, fein: '' }).ok) fail('an empty FEIN must be allowed');
for (const o of ['https://insure-big.com', 'https://www.insure-big.com', 'https://insurebig.netlify.app', 'https://deploy-preview-3--insurebig.netlify.app']) {
  if (!allowedOrigin(o)) fail(`origin ${o} should be allowed`);
}
for (const o of ['https://evil.example', 'https://insure-big.com.evil.example', '', 'null']) {
  if (allowedOrigin(o)) fail(`origin "${o}" should be refused`);
}

// ── 3. Handler against a fake n8n ────────────────────────────────────────────
const SECRET = 'test-secret';
const URL_N8N = 'https://n8n.invalid/webhook/lead';
function makeFetch(plan) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    const next = plan[Math.min(calls.length - 1, plan.length - 1)];
    if (next === 'network') throw new Error('down');
    return new Response('{}', { status: next });
  };
  return { impl, calls };
}
const post = (body, { origin = 'https://insure-big.com', method = 'POST', type = 'application/json' } = {}) =>
  new Request('https://insure-big.com/api/lead', {
    method,
    headers: { 'Content-Type': type, ...(origin ? { Origin: origin } : {}) },
    body: method === 'GET' ? undefined : type.includes('json') ? JSON.stringify(body) : new URLSearchParams(body).toString(),
  });
const T0 = 1_800_000_000_000;
const run = async (req, plan = [200], extra = {}) => {
  const f = makeFetch(plan);
  const res = await handleLead(req, {
    webhookUrl: URL_N8N, webhookSecret: SECRET, ip: '203.0.113.9', fetchImpl: f.impl,
    now: () => T0, rand: () => 0.5, log: () => {}, ...extra,
  });
  return { res, calls: f.calls };
};
const lead = { formType: 'personal', renderedAt: T0 - 60_000, consent: true, pageFrom: '/personal-insurance/home', utm_source: 'google', ...goodPersonal };

{
  const ok = await run(post(lead));
  const body = await ok.res.json().catch(() => ({}));
  if (ok.res.status !== 200 || !body.ok || !/^BIG-/.test(body.ref ?? '')) fail(`good lead: expected 200 with a BIG- reference, got ${ok.res.status} ${JSON.stringify(body)}`);
  if (ok.calls.length !== 1) fail(`good lead: forwarded ${ok.calls.length} times, expected 1`);
  else {
    const c = ok.calls[0];
    if (c.url !== URL_N8N) fail('good lead: forwarded to the wrong URL');
    if (c.init.headers['X-Lead-Secret'] !== SECRET) fail('good lead: the shared secret header is missing');
    const sent = JSON.parse(c.init.body);
    if (sent.type !== 'personal' || sent.lead.email !== goodPersonal.email) fail('good lead: payload is missing the lead');
    if (sent.consent?.given !== true || sent.consent?.version !== CONSENT.version || !sent.consent?.text) fail('good lead: the consent record is missing');
    if (sent.meta?.pageFrom !== '/personal-insurance/home' || sent.meta?.utm?.source !== 'google') fail('good lead: attribution is missing');
    if (sent.ref !== body.ref) fail('good lead: the reference sent to n8n differs from the one returned');
  }

  const noConsent = await run(post({ ...lead, consent: false }));
  const nc = noConsent.calls[0] && JSON.parse(noConsent.calls[0].init.body);
  if (!nc || nc.consent.given !== false || nc.consent.text !== '') fail('unticked consent must be recorded as not given, with no text');

  const wrongOrigin = await run(post(lead, { origin: 'https://evil.example' }));
  if (wrongOrigin.res.status !== 403 || wrongOrigin.calls.length) fail('another origin must get 403 and never reach n8n');
  const noOrigin = await run(post(lead, { origin: '' }));
  if (noOrigin.res.status !== 403 || noOrigin.calls.length) fail('a request with no origin must get 403');
  const get = await run(post(null, { method: 'GET' }));
  if (get.res.status !== 405) fail('GET must get 405');

  const honey = await run(post({ ...lead, hp_website: 'http://spam.example' }));
  if (honey.res.status !== 200 || honey.calls.length) fail('honeypot posts must look successful and must not be forwarded');
  const fast = await run(post({ ...lead, renderedAt: T0 - 800 }));
  if (fast.res.status !== 200 || fast.calls.length) fail('too fast posts must look successful and must not be forwarded');

  const bad = await run(post({ ...lead, email: 'nope' }));
  const badBody = await bad.res.json().catch(() => ({}));
  if (bad.res.status !== 422 || !badBody.errors?.email || bad.calls.length) fail('an invalid lead must get 422 with the field error and not be forwarded');

  const retry = await run(post(lead), [503, 200]);
  if (retry.res.status !== 200 || retry.calls.length !== 2) fail(`a 5xx from n8n must be retried once (calls: ${retry.calls.length}, status ${retry.res.status})`);
  const down = await run(post(lead), [500, 500]);
  if (down.res.status !== 502 || down.calls.length !== 2) fail(`n8n down must give 502 after one retry (status ${down.res.status}, calls ${down.calls.length})`);
  const rejected = await run(post(lead), [401]);
  if (rejected.res.status !== 502 || rejected.calls.length !== 1) fail('a 4xx from n8n must give 502 without a retry');

  const noEnv = await run(post(lead), [200], { webhookUrl: '', webhookSecret: '' });
  if (noEnv.res.status !== 500) fail('a missing webhook configuration must give 500, not a false success');

  const formPost = await run(post({ ...lead, lines: 'Home', consent: 'true' }, { type: 'application/x-www-form-urlencoded' }));
  const loc = formPost.res.headers.get('location') ?? '';
  if (formPost.res.status !== 303 || !loc.startsWith('/quote-received?ref=BIG-')) fail(`a plain form post must redirect to /quote-received, got ${formPost.res.status} ${loc}`);

  const biz = await run(post({ formType: 'business', renderedAt: T0 - 60_000, ...goodBusiness }));
  if (biz.res.status !== 200 || JSON.parse(biz.calls[0]?.init.body ?? '{}').type !== 'business') fail('a good business lead must forward as type business');
}

// ── 4. The built page ────────────────────────────────────────────────────────
function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(html|js|css|txt|xml|json)$/.test(e) || e === '_headers') out.push(full);
  }
  return out;
}
const page = join(DIST, 'get-a-quote.html');
if (!existsSync(page)) fail('dist/get-a-quote.html is missing');
else {
  const html = readFileSync(page, 'utf8');
  for (const type of Object.keys(QUOTE_FORMS)) {
    if (!new RegExp(`<form[^>]*data-type="${type}"`).test(html)) fail(`/get-a-quote: the ${type} form is missing`);
    for (const f of allFields(type)) {
      if (!html.includes(`name="${f.name}"`)) fail(`/get-a-quote: field "${f.name}" is missing from the ${type} form`);
    }
  }
  if ((html.match(/action="\/api\/lead"/g) || []).length !== Object.keys(QUOTE_FORMS).length) fail('/get-a-quote: every form must post to /api/lead');
  if ((html.match(/name="hp_website"/g) || []).length !== Object.keys(QUOTE_FORMS).length) fail('/get-a-quote: every form needs the honeypot');
  if (!html.includes('method="post"')) fail('/get-a-quote: forms must use method="post"');
  if (/id="quote-bar"/.test(html)) fail('/get-a-quote: the sticky call bar must be hidden on the quote page');
}
for (const needed of ['quote-received.html']) {
  if (!existsSync(join(DIST, needed))) fail(`dist/${needed} is missing`);
}
const qr = join(DIST, 'quote-received.html');
if (existsSync(qr) && !/name="robots" content="noindex/.test(readFileSync(qr, 'utf8'))) fail('/quote-received must be noindex');

let jot = 0;
for (const file of walk(DIST)) {
  if (/jotform/i.test(readFileSync(file, 'utf8'))) {
    jot += 1;
    fail(`Jotform is still referenced in ${file.slice(DIST.length)}`);
  }
}
for (const slug of ['home', 'auto']) {
  const f = join(DIST, 'personal-insurance', `${slug}.html`);
  if (existsSync(f)) {
    const html = readFileSync(f, 'utf8');
    if (!/data-quote-cta/.test(html) || !/href="\/get-a-quote\?type=personal&(amp;|#38;)?line=/.test(html)) {
      fail(`/personal-insurance/${slug}: the quote card must link to /get-a-quote with the type and line`);
    }
  }
}

if (errors.length) {
  console.error(`\n✗  ${errors.length} error(s) in the quote forms:`);
  for (const e of errors) console.error(`   • ${e}`);
  process.exit(1);
}
console.log('\n✓  Quote forms are valid.');
notes.push('field definitions, validator, /api/lead handler (origin, bots, retry, consent record) and the built /get-a-quote page');
for (const n of notes) console.log(`   • ${n}`);
