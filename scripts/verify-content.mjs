#!/usr/bin/env node
/**
 * Content data gate (CMS phase).
 *
 * Staff edit src/content/data/*.json through the CMS. These checks run in
 * `npm run verify`, so a bad edit fails the Netlify build and the live site
 * stays on the last good version. They protect the same things the older SEO
 * gate protects: no invented review data, no empty copy, no broken photos.
 *
 * Run: node scripts/verify-content.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DATA = join(ROOT, 'src', 'content', 'data');

const errors = [];
const notes = [];
const fail = (m) => errors.push(m);

function load(name) {
  const file = join(DATA, `${name}.json`);
  if (!existsSync(file)) {
    fail(`${name}.json is missing`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  } catch (e) {
    fail(`${name}.json is not valid JSON: ${e.message}`);
    return null;
  }
}

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;
const HHMM = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const ISO = /^(20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const OFFICES = ['northland', 'lees-summit'];

// ── Hours ────────────────────────────────────────────────────────────────────
const hours = load('hours');
if (hours) {
  if (!nonEmpty(hours.display)) fail('hours: the visitor facing text is empty');
  if (!Array.isArray(hours.days) || hours.days.length === 0) fail('hours: pick at least one open day');
  else if (hours.days.some((d) => !DAYS.includes(d))) fail('hours: a day name is not valid');
  if (!HHMM.test(hours.opens ?? '')) fail('hours: "opens" must be 24 hour time like 09:00');
  if (!HHMM.test(hours.closes ?? '')) fail('hours: "closes" must be 24 hour time like 17:00');
  if (HHMM.test(hours.opens ?? '') && HHMM.test(hours.closes ?? '') && hours.opens >= hours.closes) {
    fail('hours: closing time must be after opening time');
  }
  notes.push(`hours: ${hours.display}`);
}

// ── Team ─────────────────────────────────────────────────────────────────────
const team = load('team');
const teamNames = new Set();
if (team) {
  if (!Array.isArray(team.members) || team.members.length === 0) fail('team: at least one member is required');
  for (const [i, m] of (team.members ?? []).entries()) {
    const who = m?.name || `member ${i + 1}`;
    for (const key of ['name', 'title', 'photo', 'bio']) {
      if (!nonEmpty(m?.[key])) fail(`team: ${who} has no ${key}`);
    }
    if (nonEmpty(m?.photo) && !existsSync(join(ROOT, 'public', m.photo.replace(/^\//, '')))) {
      fail(`team: ${who} photo ${m.photo} is not in public/`);
    }
    if (nonEmpty(m?.name)) teamNames.add(m.name.trim());
  }
  notes.push(`team: ${team.members?.length ?? 0} members`);
}

// ── Home FAQ ─────────────────────────────────────────────────────────────────
const faq = load('home-faq');
if (faq) {
  if (!Array.isArray(faq.items) || faq.items.length === 0) fail('home-faq: at least one question is required');
  for (const [i, f] of (faq.items ?? []).entries()) {
    for (const key of ['q', 's', 'a']) {
      if (!nonEmpty(f?.[key])) fail(`home-faq: question ${i + 1} has an empty ${key === 'q' ? 'question' : key === 's' ? 'short answer' : 'full answer'}`);
    }
  }
  notes.push(`home-faq: ${faq.items?.length ?? 0} questions`);
}

// ── Reviews ──────────────────────────────────────────────────────────────────
/** "2026-04-07" -> "4/7/2026", the form Google shows. */
const toGoogleDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${m}/${d}/${y}`;
};

function checkProfile(name, p) {
  if (!p) return;
  if (!nonEmpty(p.profileName)) fail(`${name}: Google profile name is empty`);
  if (typeof p.rating !== 'number' || p.rating < 1 || p.rating > 5) fail(`${name}: star rating must be between 1 and 5`);
  if (!Number.isInteger(p.count) || p.count < 1) fail(`${name}: review count must be a whole number`);
  if (!ISO.test(p.observedOn ?? '')) fail(`${name}: "date checked" must look like 2026-10-25`);
  const list = p.reviews ?? [];
  if (Number.isInteger(p.count) && list.length > p.count) {
    fail(`${name}: ${list.length} reviews are listed but the Google count is only ${p.count}`);
  }
  const seen = new Set();
  for (const [i, r] of list.entries()) {
    const who = r?.author || `review ${i + 1}`;
    if (!nonEmpty(r?.author)) fail(`${name}: review ${i + 1} has no reviewer name`);
    if (!nonEmpty(r?.text)) fail(`${name}: ${who} has no review text`);
    if (!nonEmpty(r?.dateText)) fail(`${name}: ${who} has no date text`);
    if (r?.rating !== undefined && (!Number.isInteger(r.rating) || r.rating < 1 || r.rating > 5)) {
      fail(`${name}: ${who} stars must be 1 to 5`);
    }
    // A real date is only allowed when Google shows that same date. This is the
    // rule that stops invented review dates reaching the structured data.
    if (r?.date !== undefined && r.date !== '' && r.date !== null) {
      if (typeof r.date !== 'string' || !ISO.test(r.date)) fail(`${name}: ${who} calendar date must look like 2026-04-07`);
      else if (String(r.dateText ?? '').trim() !== toGoogleDate(r.date)) {
        fail(`${name}: ${who} has the date ${r.date} but the date text says "${r.dateText}". Use ${toGoogleDate(r.date)} or clear the date.`);
      } else if (new Date(r.date) > new Date()) {
        fail(`${name}: ${who} has a date in the future`);
      }
    }
    if (Array.isArray(r?.locations) && r.locations.some((l) => !OFFICES.includes(l))) {
      fail(`${name}: ${who} has an unknown office`);
    }
    for (const s of r?.staffMentioned ?? []) {
      if (!teamNames.has(String(s).trim())) {
        fail(`${name}: ${who} names "${s}", who is not on the Team list. Use the exact name from Team members.`);
      }
    }
    const key = `${(r?.author ?? '').trim().toLowerCase()}|${(r?.text ?? '').trim().slice(0, 60).toLowerCase()}`;
    if (seen.has(key)) fail(`${name}: ${who} appears twice`);
    seen.add(key);
  }
  notes.push(`${name}: ${list.length} reviews, Google ${p.rating} from ${p.count}`);
}

checkProfile('reviews-lees-summit', load('reviews-lees-summit'));
checkProfile('reviews-northland', load('reviews-northland'));

// ── Report ───────────────────────────────────────────────────────────────────
console.log('\nContent data verification\n');
for (const n of notes) console.log(`ℹ  ${n}`);
if (errors.length) {
  console.log(`\n✗  ${errors.length} problem(s) in the editable content:`);
  for (const e of errors) console.log(`   • ${e}`);
  process.exit(1);
}
console.log('\n✓  Editable content is valid.');
