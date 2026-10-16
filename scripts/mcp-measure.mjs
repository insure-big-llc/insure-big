/**
 * Playwright MCP screenshot pass: the runbook plus the save helpers.
 *
 * The Playwright MCP lets an agent drive a real browser from inside a sandboxed
 * workflow. It exposes browser tools (open, goto, screenshot), NOT Lighthouse,
 * so this pass owns screenshots only. Scoring stays with `npm run measure`.
 *
 * Two ways this file is used:
 *   1. `npm run measure:mcp` prints the runbook below and rebuilds the contact
 *      sheet from whatever captures already exist in reports/screenshots/.
 *   2. An agent with the Playwright MCP connected imports `saveMcpScreenshot`
 *      and feeds it the image bytes each MCP screenshot tool call returns, so
 *      the captures land in the same folder and naming as the local pass.
 *
 * Verification of the MCP path stays pending until you connect the server.
 */
import { mkdirSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { MEASURE_PAGES, SCREENSHOT_WIDTHS, SCREENSHOT_HEIGHT } from './pages.mjs';

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
export const SHOTS = join(ROOT, 'reports', 'screenshots');

export function ensureShotsDir() {
  mkdirSync(SHOTS, { recursive: true });
}

/** Save one capture returned as a tool response. Name and width come from the shared list. */
export function saveMcpScreenshot(name, width, buffer) {
  ensureShotsDir();
  const file = `${name}-${width}.png`;
  writeFileSync(join(SHOTS, file), buffer);
  return file;
}

/** Rebuild the contact sheet from whatever captures exist, so a partial pass still presents cleanly. */
export function rebuildContactSheet() {
  ensureShotsDir();
  const files = readdirSync(SHOTS).filter((f) => f.endsWith('.png')).sort();
  const imgs = files
    .map(
      (f) =>
        `<a href="${f}"><img src="${f}" loading="lazy" style="max-width:320px;vertical-align:top;margin:8px" alt="${f}"></a>`,
    )
    .join('\n');
  writeFileSync(
    join(SHOTS, 'index.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>insure-big.com screenshot sheet</title></head><body><h1>insure-big.com screenshot sheet</h1>${imgs || '<p>No captures yet.</p>'}</body></html>`,
  );
  return files;
}

const isMain = process.argv[1] && new URL(`file://${process.argv[1].replace(/\\/g, '/')}`).pathname === new URL(import.meta.url).pathname;
if (isMain) {
  console.log(`Playwright MCP screenshot pass: runbook

Pages (shared with the scoring pass, from scripts/pages.mjs):
${MEASURE_PAGES.map((p) => `  ${p.name.padEnd(24)} ${p.path}`).join('\n')}

Widths: ${SCREENSHOT_WIDTHS.join(', ')}px wide, ${SCREENSHOT_HEIGHT}px tall, full page captures.

Steps for the agent once the Playwright MCP is connected:
  1. Ask the user to run \`npm run preview\` on their normal machine and tell
     you the URL it prints (usually http://localhost:4321, but it must be a URL
     the MCP browser can reach from its host).
  2. For each page above and each width:
       open the page URL in the MCP browser, set the viewport to the width,
       take a full page screenshot, and save the returned image with
       saveMcpScreenshot('${MEASURE_PAGES[0].name}', 360, bytes) so it lands in
       reports/screenshots/ with the shared naming.
  3. Run this script again (npm run measure:mcp) to rebuild the contact sheet.

The scoring pass is separate: \`npm run measure\` on a normal machine.
Verification of this MCP path stays pending until the server is connected.`);

  const files = rebuildContactSheet();
  console.log(`\nContact sheet rebuilt from ${files.length} capture(s) in reports/screenshots/.`);
}
