/**
 * Real measurement: Lighthouse scores plus a screenshot sheet, against the built site.
 *
 *   node scripts/measure.mjs
 *
 * Requires `npm run preview` to be running (default http://localhost:4321).
 * Uses the system Chrome install (no browser download needed).
 *
 * Outputs, all under site/reports/ (gitignored):
 *   lighthouse-<page>.json      the full Lighthouse report per page
 *   summary.md                  one row per page: scores, lab metrics, status
 *   screenshots/<page>-<w>.png  twelve captures (4 pages x 360/768/1440)
 *   screenshots/index.html      a contact sheet linking the captures
 *
 * Failure taxonomy (kept distinct on purpose):
 *   "Preview not serving at <base>"   -> start `npm run preview`, note the port
 *   "Chrome could not launch"         -> run on a normal machine, or connect the Playwright MCP
 *   A score below 90                  -> a warning marker in summary.md, never an exit failure
 *
 * Exit codes: 2 when the run itself fails (no preview, no browser, a page
 * failed to score), 0 when every page scored, even if some scores miss 90.
 */
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MEASURE_PAGES, SCREENSHOT_WIDTHS, SCREENSHOT_HEIGHT, CATEGORY_THRESHOLD } from './pages.mjs';

const BASE = process.env.MEASURE_URL ?? 'http://localhost:4321';
const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const REPORTS = join(ROOT, 'reports');
const SHOTS = join(REPORTS, 'screenshots');
mkdirSync(SHOTS, { recursive: true });

const summaryRows = [];
let runFailed = false;

function failLoud(title, detail, fix) {
  console.log(`\n${title}\n  ${detail}\n  Fix: ${fix}`);
  writeFileSync(
    join(REPORTS, 'summary.md'),
    `# Measurement summary\n\n**${title}**\n\n${detail}\n\nFix: ${fix}\n`,
  );
  process.exit(2);
}

// AC-6: a dead preview server gets its own message, distinct from a blocked browser.
try {
  const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`status ${res.status}`);
} catch {
  failLoud(
    'Preview not serving',
    `Nothing answered at ${BASE}/.`,
    'start `npm run preview` and use the port it prints (or set MEASURE_URL).',
  );
}

// AC-5: a blocked browser names the fix, and the summary still writes.
let chrome;
try {
  chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    logLevel: 'silent',
  });
} catch {
  failLoud(
    'Chrome could not launch',
    'The browser process was blocked (a sandbox blocks it with spawn EPERM).',
    'run `npm run measure` on a normal machine, or connect the Playwright MCP for the screenshot pass (`npm run measure:mcp` prints the steps).',
  );
}
console.log(`Chrome launched on port ${chrome.port}`);

// Reuse the Chrome instance chrome-launcher already started: connect over the
// DevTools protocol instead of launching a second browser. If the connection
// fails, scoring still runs; the failure is recorded and reported, not hidden.
let pw = null;
let shotsError = null;
try {
  pw = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
} catch (e) {
  shotsError = e.message.split('\n')[0];
  console.log(`\nScreenshots unavailable, scoring continues. Reason: ${shotsError}`);
}

const shotsTaken = [];

for (const page of MEASURE_PAGES) {
  // measurePath exists for the terms page: astro preview decodes %26 once, so
  // the indexed form 404s locally and the double-encoded form reaches the file.
  const url = `${BASE}${page.measurePath ?? page.path}`;
  const row = {
    page: page.name,
    url: `${BASE}${page.path}`,
    performance: null,
    accessibility: null,
    'best-practices': null,
    seo: null,
    lcpMs: null,
    cls: null,
    tbtMs: null,
    status: 'failed',
    error: null,
  };

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 360, height: 800, deviceScaleFactor: 1, disabled: false },
    });
    if (!result) throw new Error('lighthouse returned nothing');

    const { categories, audits } = result.lhr;
    const score = (id) => Math.round((categories[id]?.score ?? 0) * 100);
    const metric = (id) => {
      const a = audits[id];
      return a?.numericValue != null ? Math.round(a.numericValue) : null;
    };

    row.performance = score('performance');
    row.accessibility = score('accessibility');
    row['best-practices'] = score('best-practices');
    row.seo = score('seo');
    row.lcpMs = metric('largest-contentful-paint');
    row.cls = audits['cumulative-layout-shift']?.displayValue ?? null;
    row.tbtMs = metric('total-blocking-time');
    row.status = [row.performance, row.accessibility, row['best-practices'], row.seo].every(
      (s) => s >= CATEGORY_THRESHOLD,
    )
      ? 'pass'
      : 'warn';

    writeFileSync(join(REPORTS, `lighthouse-${page.name}.json`), result.report);
  } catch (e) {
    runFailed = true;
    row.error = e.message.split('\n')[0];
    console.log(`  ${page.name.padEnd(24)}  FAILED: ${row.error}`);
  }
  summaryRows.push(row);

  // Screenshots per page, across the shared widths. A screenshot failure never
  // marks the page failed; it is recorded and reported as a screenshot issue.
  if (pw) {
    try {
      const ctx = await pw.newContext({
        viewport: { width: SCREENSHOT_WIDTHS[0], height: SCREENSHOT_HEIGHT },
        deviceScaleFactor: 1,
      });
      for (const width of SCREENSHOT_WIDTHS) {
        const pg = await ctx.newPage();
        await pg.setViewportSize({ width, height: SCREENSHOT_HEIGHT });
        await pg.goto(url, { waitUntil: 'load' });
        const file = `${page.name}-${width}.png`;
        await pg.screenshot({ path: join(SHOTS, file), fullPage: true });
        shotsTaken.push(file);
        await pg.close();
      }
      await ctx.close();
    } catch (e) {
      shotsError = shotsError ?? e.message.split('\n')[0];
    }
  }

  if (row.status === 'failed') {
    console.log(`  ${page.name.padEnd(24)}  ${row.error ?? 'failed'}`);
  } else {
    const flag = row.status === 'warn' ? '  (below 90)' : '';
    console.log(
      `  ${page.name.padEnd(24)}  perf ${String(row.performance).padStart(3)}  a11y ${String(
        row.accessibility,
      ).padStart(3)}  bp ${String(row['best-practices']).padStart(3)}  seo ${String(row.seo).padStart(3)}  LCP ${
        row.lcpMs ?? 'n/a'
      }ms  CLS ${row.cls ?? 'n/a'}  TBT ${row.tbtMs ?? 'n/a'}ms${flag}`,
    );
  }
}

await pw?.close();
await chrome.kill();

// AC-3: the summary writes unconditionally, including failed rows and the
// screenshot status, so nothing that happened is hidden.
writeSummary(summaryRows, shotsTaken, shotsError);

if (shotsError) {
  console.log(`\nScreenshots incomplete: ${shotsError}. The scoring results are saved.`);
}
if (runFailed || shotsError) {
  console.log(`\nOne or more parts failed. See site/reports/summary.md for the failures.`);
  process.exit(2);
}
console.log('\nDone. Reports in site/reports/ (JSON, summary.md, screenshots).');

function writeSummary(rows, shots, shotsFailure) {
  const lines = [
    '# Measurement summary',
    '',
    `Run: ${new Date().toISOString()} against ${BASE}`,
    `Threshold: every category at ${CATEGORY_THRESHOLD} or above. Below it is a warning, not a failure.`,
    '',
    '| Page | URL | Perf | A11y | Best | SEO | LCP (ms) | CLS | TBT (ms) | Status |',
    '|---|---|---|---|---|---|---|---|---|---|',
  ];
  for (const r of rows) {
    const status = r.status === 'pass' ? 'pass' : r.status === 'warn' ? 'warn' : `failed: ${r.error ?? 'unknown'}`;
    lines.push(
      `| ${r.page} | ${r.url} | ${r.performance ?? 'n/a'} | ${r.accessibility ?? 'n/a'} | ${
        r['best-practices'] ?? 'n/a'
      } | ${r.seo ?? 'n/a'} | ${r.lcpMs ?? 'n/a'} | ${r.cls ?? 'n/a'} | ${r.tbtMs ?? 'n/a'} | ${status} |`,
    );
  }
  lines.push('');
  if (shotsFailure) {
    lines.push(`Screenshots: failed. Reason: ${shotsFailure}. Scoring results above are complete.`);
  } else {
    lines.push(`Screenshots: ${shots.length} captures in screenshots/ (contact sheet: screenshots/index.html)`);
  }
  writeFileSync(join(REPORTS, 'summary.md'), lines.join('\n'));

  if (shots.length > 0) {
    // Contact sheet linking every capture.
    const imgs = shots
      .map((f) => `<a href="${f}"><img src="${f}" loading="lazy" style="max-width:320px;vertical-align:top;margin:8px" alt="${f}"></a>`)
      .join('\n');
    writeFileSync(
      join(SHOTS, 'index.html'),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>insure-big.com screenshot sheet</title></head><body><h1>insure-big.com screenshot sheet</h1>${imgs}</body></html>`,
    );
  }
}
