/**
 * The /api/lead handler, kept free of Netlify specifics so the build gate can
 * run it against a fake fetch (scripts/verify-forms.mjs). The Netlify function
 * in netlify/functions/lead.mts is a thin wrapper around `handleLead`.
 *
 * What it does, in order:
 *   1. POST only, small bodies only.
 *   2. The request must come from one of our own origins.
 *   3. Bots: a filled honeypot or a submission under 2.5 seconds after the page
 *      rendered gets a convincing success and goes nowhere. No feedback to learn from.
 *   4. The same validator the page uses (src/config/forms.js).
 *   5. Forward to the n8n webhook with a shared secret, 8 second timeout, one retry.
 *   6. Success only when n8n has said so. Otherwise a 502 and the visitor is told
 *      to call. Logs carry the reference and the status, never personal details.
 */
import { validateSubmission, allowedOrigin, makeRef, CONSENT } from '../config/forms.js';

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 2_500;
const FORWARD_TIMEOUT_MS = 8_000;

const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

const redirect = (location) =>
  new Response(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } });

const cleanPath = (v) => (typeof v === 'string' && /^\/[A-Za-z0-9/_\-%.?=&]{0,200}$/.test(v) ? v : '');
const short = (v, n = 120) => (typeof v === 'string' ? v.slice(0, n) : '');

async function readBody(req) {
  const type = req.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    const data = await req.json();
    return { data: data && typeof data === 'object' ? data : {}, wantsJson: true };
  }
  const form = await req.formData();
  const data = {};
  for (const key of new Set(form.keys())) {
    const all = form.getAll(key).filter((v) => typeof v === 'string');
    data[key] = all.length > 1 ? all : (all[0] ?? '');
  }
  return { data, wantsJson: false };
}

async function forward(fetchImpl, url, secret, payload) {
  let last = 'no attempt';
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FORWARD_TIMEOUT_MS);
    try {
      const res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Lead-Secret': secret },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      if (res.ok) return { ok: true, status: res.status };
      last = `http ${res.status}`;
      if (res.status < 500) return { ok: false, status: res.status, reason: last };
    } catch (err) {
      last = err?.name === 'AbortError' ? 'timeout' : 'network';
    } finally {
      clearTimeout(timer);
    }
  }
  return { ok: false, status: 0, reason: last };
}

/**
 * @param {Request} req
 * @param {{ webhookUrl?: string, webhookSecret?: string, ip?: string, fetchImpl?: typeof fetch,
 *           now?: () => number, rand?: () => number, log?: (o: object) => void }} opts
 */
export async function handleLead(req, opts = {}) {
  const {
    webhookUrl, webhookSecret, ip = '', fetchImpl = fetch,
    now = () => Date.now(), rand = Math.random,
    log = (o) => console.log(JSON.stringify(o)),
  } = opts;

  if (req.method !== 'POST') return json(405, { ok: false, message: 'POST only.' }, { Allow: 'POST' });

  const length = Number(req.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) return json(413, { ok: false, message: 'That was too large.' });

  let origin = req.headers.get('origin') || '';
  if (!origin && req.headers.get('referer')) {
    try {
      origin = new URL(req.headers.get('referer')).origin;
    } catch {
      origin = '';
    }
  }
  if (!allowedOrigin(origin)) {
    log({ evt: 'lead', status: 'blocked-origin' });
    return json(403, { ok: false, message: 'Not allowed.' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return json(400, { ok: false, message: 'We could not read that.' });
  }
  const { data, wantsJson } = body;
  const type = data.formType === 'business' ? 'business' : data.formType === 'personal' ? 'personal' : '';
  const ref = makeRef(now(), rand);

  const success = () =>
    wantsJson ? json(200, { ok: true, ref }) : redirect(`/quote-received?ref=${encodeURIComponent(ref)}`);

  // Bots get a convincing success and nothing else.
  const renderedAt = Number(data.renderedAt);
  const tooFast = Number.isFinite(renderedAt) && renderedAt > 0 && now() - renderedAt < MIN_FILL_MS;
  if (short(String(data.hp_website ?? ''), 5) !== '' || tooFast) {
    log({ evt: 'lead', status: 'dropped', why: tooFast ? 'fast' : 'honeypot' });
    return success();
  }

  const result = validateSubmission(type, data);
  if (!type || !result.ok) {
    if (wantsJson) return json(422, { ok: false, errors: result.errors });
    return redirect(`/get-a-quote?type=${type || 'personal'}&retry=1`);
  }

  if (!webhookUrl || !webhookSecret) {
    log({ evt: 'lead', ref, status: 'misconfigured' });
    return json(500, { ok: false, message: 'Please call us and we will take it from here.' });
  }

  const payload = {
    ref,
    type,
    receivedAt: new Date(now()).toISOString(),
    lead: result.clean,
    consent: {
      given: result.consentGiven,
      version: CONSENT.version,
      text: result.consentGiven ? CONSENT.text : '',
    },
    meta: {
      ip: short(ip, 64),
      userAgent: short(req.headers.get('user-agent') ?? '', 300),
      pageFrom: cleanPath(data.pageFrom),
      landingUrl: short(String(data.landingUrl ?? ''), 300),
      utm: {
        source: short(String(data.utm_source ?? '')),
        medium: short(String(data.utm_medium ?? '')),
        campaign: short(String(data.utm_campaign ?? '')),
        term: short(String(data.utm_term ?? '')),
        content: short(String(data.utm_content ?? '')),
      },
    },
  };

  const sent = await forward(fetchImpl, webhookUrl, webhookSecret, payload);
  log({ evt: 'lead', ref, type, status: sent.ok ? 'forwarded' : 'failed', reason: sent.reason ?? '' });
  if (!sent.ok) {
    if (wantsJson) {
      return json(502, { ok: false, message: 'We could not send that just now. Please call us and we will take it from here.' });
    }
    return redirect(`/get-a-quote?type=${type}&retry=1`);
  }
  return success();
}
