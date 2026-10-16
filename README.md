# insure-big.com — Ballentine Insurance Group

Static Astro site for **Ballentine Insurance Group (BIG)**, Kansas City metro.

**Scope and every decision:** [`../website-scope.md`](../website-scope.md) (v2, approved).
That document is authoritative. This file only covers how to run and maintain the build.

---

## Quick start

```bash
cd site
npm install --ignore-scripts     # see "Installing" below
npm run build:verify             # build + run every SEO assertion
npm run dev                      # local dev server
```

`npm run build:verify` is the one that matters. It fails the build if anything
that protects the Google index regresses.

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Static build to `dist/`, then post-build path fixes |
| `npm run verify` | Runs **both** verifiers against `dist/` |
| `npm run verify:seo` | SEO assertions only |
| `npm run verify:assets` | Asset/accessibility/weight assertions only |
| `npm run build:verify` | Build + both verifiers. **Use this before any deploy.** |
| `npm run preview` | Serve the built output locally |
| `npm run icons` | Regenerate the favicon/icon set from `public/favicon.webp` |

`build` runs `prebuild` automatically, which regenerates the font wiring.

### Installing

Use `--ignore-scripts`. It skips dependency lifecycle scripts, which is both a
supply-chain hygiene win and required in a sandboxed environment.

Do **not** add `--omit=optional`. Astro 7 bundles with rolldown, whose Windows
native binary ships as an optional dependency — omitting optional packages breaks
the build with `Cannot find native binding`.

Astro telemetry writes to `%APPDATA%\astro\Config`, outside the workspace. Set
`ASTRO_TELEMETRY_DISABLED=1` if the build fails with `EPERM: mkdir`.

---

## The one thing not to break

**Seven URLs on this site are already indexed by Google.** They must keep the
exact same paths, byte for byte:

```
/                          /get-a-quote
/personal-insurance        /privacy-policy
/business-insurance        /terms-%26-conditions
/life-insurance
```

`npm run verify` asserts all seven survive every build. If it fails on
`INDEXED URL MISSING from build`, you have broken a ranked page — fix it before
doing anything else.

Three of those are **hub pages** and must stay real pages, not redirects. Every
new service page nests beneath one of them (`/personal-insurance/auto`).

### Canonical URL rules

1. Bare domain — never `www`
2. HTTPS only
3. **No trailing slashes** — this is the form the indexed URLs use
4. Every URL comes from `src/config/site.js`. Never hardcode one.

`public/_redirects` 301s any slash form to the no-slash form in one hop.

---

## Layout

```
src/
  config/
    site.js         🔴 SINGLE SOURCE OF TRUTH — NAP, market statement, indexed URLs
    services.js     The 26 service pages + 3 hubs, with copy, FAQs, covers
    carriers.js     The 25 carriers, with logo mapping
  lib/schema.js     JSON-LD node builders (Service, FAQ, Breadcrumb, Contact, About)
  components/
    Schema.astro      Emits the @graph. Always includes the InsuranceAgency node
    Header.astro      Nav — every service linked with a real <a href>
    Footer.astro      🔴 Carries the NAP block
    ServiceForm.astro Jotform, lazy-loaded on click
    FaqBlock.astro    <details>/<summary> — works with JS disabled
    CarrierStrip.astro Logos, falling back to a text card when a file is missing
    Breadcrumbs.astro Visible trail, mirrors the BreadcrumbList JSON-LD
  layouts/BaseLayout.astro  Canonical, meta, OG, robots, JSON-LD
  pages/
    index.astro                     /
    [hub]/index.astro               /personal-insurance  /business-insurance  /life-insurance
    [hub]/[service].astro           /personal-insurance/auto  …
    specialty/[service].astro       /specialty/surety-bonds  …
    [location].astro                /lees-summit  /northland
    get-a-quote.astro               /get-a-quote
    contact.astro  about.astro      net-new (both 404 on the live site)
    privacy-policy.astro            /privacy-policy
    terms-[amp]conditions.astro     /terms-%26-conditions   ← see below
    404.astro  llms.txt.ts  sitemap.xml.ts
```

### 🔴 Changing a phone number, address or hour

Edit `src/config/site.js` **only**. It feeds the footer, the contact page, both
location pages, the JSON-LD and `llms.txt` — all from that one object, so they
cannot drift apart. That consistency is the point: the live site has no address
or phone number on any page at all, and inconsistent NAP is one of the reasons
the agency is hard for AI assistants to describe.

### 🔴 `terms-[amp]conditions.astro` — do not rename

The filename looks wrong. It is deliberate.

`/terms-%26-conditions` is indexed, and the percent-encoded ampersand is real.
Astro URL-decodes route filenames before reading them, so
`terms-%26-conditions.astro` is decoded to `terms-&-conditions.astro` and the
build fails with ENOENT.

The bracketed dynamic segment resolves to the literal string `%26`, so the page
builds with the correct canonical. Astro then emits the file with the hyphen
dropped, and `scripts/postbuild.mjs` renames it to match the canonical exactly.

If you "tidy" this filename, you break an indexed URL.

---

## Adding a service page

1. Add an entry to `SERVICES` in `src/config/services.js` — `hub`, `slug`, `name`,
   `h1`, `metaTitle`, `metaDescription`, `blurb`, `covers[]`, `faq[]`, `form`
2. Assign it carriers in `SERVICE_CARRIERS` in `src/config/carriers.js` if relevant
3. Run `npm run build:verify`

The route, breadcrumb, JSON-LD, sitemap entry, `llms.txt` line and nav links are
all generated. Nothing else to wire up.

**Title rule:** every `metaTitle` must end in `| BIG` and stay within ~62
characters including that marker, or Google truncates it.

---

## SEO invariants this build enforces

`npm run verify` runs two checkers and exits non-zero on failure.

**`verify:seo`** — the ranking-protection gate:

| Check | Why |
|---|---|
| The 7 indexed URLs exist | Protects existing rankings |
| Canonicals absolute, HTTPS, bare-domain, **no trailing slash**, unique | Prevents duplicate content splitting equity |
| Exactly one `<h1>` per page | Crawl clarity |
| NAP + market statement on every page | The live site has NAP on none |
| JSON-LD parses, `InsuranceAgency` node present | The machine-readability priority |
| Titles and descriptions unique | Avoids cannibalisation |
| `sitemap.xml` matches what was built, no `changefreq`/`priority` | Google ignores both |
| `llms.txt` covers the whole site | Live version lists 2 of 7 pages |
| `llms-full.txt` carries real prose and all 26 service lines | This is the file an answer engine can actually *quote* |

**`verify:assets`** — the things that break silently:

| Check | Why |
|---|---|
| Every referenced asset and internal link resolves to a real file | Caught a linked-but-missing `apple-touch-icon.png`, which would have 404'd on every page load |
| Every `<img>` has `alt`, `<html>` has `lang`, no positive `tabindex` | Accessibility floor |
| Viewport meta is `width=device-width`, no fixed width over 360px | Mobile floor |
| Page weight, CSS size, render-blocking count | Performance budget |

Current numbers: **42 files, 41 indexable URLs, 22 KB CSS, ~33 KB mean HTML,
2 render-blocking stylesheets, 0 render-blocking scripts, 39 KB `llms-full.txt`.**

### The two llms files

`llms.txt` is a **directory** — links plus one-line summaries, per the
[llmstxt.org](https://llmstxt.org) convention.

`llms-full.txt` is the **content** — the whole site as prose: every service line,
its coverage list, and every FAQ answer verbatim, plus the carrier list and the
verified client reviews. This is what an answer engine can quote directly.

That distinction matters here. The AI-visibility finding is that the agency is
invisible to ChatGPT and Claude **not because its site is broken but because too
little citable material exists about it**. A directory of links does not fix that;
prose does. Both are generated from `src/config/`, so neither can drift from what
the pages actually say.

---

## Repository

Git is initialised at the **workspace root** (`FarmersInsure/`), not in `site/`, so
the client documentation and the site are versioned together.

**Netlify settings when the time comes:**

| Setting | Value |
|---|---|
| Base directory | `site` |
| Build command | `npm run build` |
| Publish directory | `dist` (relative to base) |

⚠️ **Two directories are deliberately NOT in git:**

- `video_sop/` — 4.5 GB of raw Loom recordings
- `evidence/` — client PII: DNS zone records, mailbox listings, tenant IDs, admin
  screenshots

Anything the site actually serves was copied into `site/public/` and **is** committed.

🔴 **`Staff-Sign In Credentials.txt` is gitignored on purpose.** It was picked up by
the first `git add` and had to be removed from the index. Keep it that way — live
staff credentials do not belong in a repo. If they need storing, use the agency's
password manager.

---

## Icons and fonts

**Icons** are generated, not hand-made: `npm run icons` reads `public/favicon.webp`
and writes `favicon.ico`, the PNG set, `apple-touch-icon.png` and the manifest
icons via `sharp`. A WebP-only favicon is not enough — Safari and several crawlers
do not support it, and `/favicon.ico` is requested by convention.

**Fonts** are self-hosted, never from Google's CDN — a third-party font request
blocks first paint and leaks visitor IPs. The fonts ship from the installed
`@fontsource/poppins` and `@fontsource/cantarell` packages: `scripts/build-fonts.mjs`
runs before every build, copies the latin-subset `.woff2` into `public/fonts/`,
declares `@font-face` **only for files that exist**, and the layout preloads just
the two above-the-fold faces (Poppins 400, Cantarell 700).

- 5 faces ship: `poppins-400/600/700`, `cantarell-400/700` (≈45 KB total)
- `verify:seo` fails the build if `@font-face` declarations or woff2 files vanish
- A manually dropped file in `public/fonts/` always wins over the npm copy

### Typography policy (enforced)

Grounded in the [GOV.UK design system](https://design-system.service.gov.uk/styles/paragraphs/)
(19px body standard, 16px "use sparingly") and the USWDS 16px baseline:

- `.prose-page p` — **18px**, line-height 1.7
- **no content paragraph below 16px** — a CSS escalation lifts the legacy
  `text-sm`/`text-xs` paragraphs inside `<main>` to 16px/14px; small print outside
  `<main>` (footer) stays small
- `verify:seo` asserts both rules survive the build

## Measuring for real

The build verifies STRUCTURE. Scores need a browser:

```bash
npm run build
npm run preview          # note the port it prints (4321, or 4322 if busy)
npm run measure          # Lighthouse ×4 pages against the preview
```

`scripts/measure.mjs` uses the system Chrome (no browser download) and writes,
all under `site/reports/` (gitignored):

- `lighthouse-<page>.json` per page, the full report
- `summary.md` with one row per page: the four scores, LCP, CLS, TBT, and a
  status. A score below the Lighthouse threshold of 90 is marked as a warning,
  never as a run failure. The summary writes even when pages fail.
- `screenshots/<page>-<width>.png`, twelve captures (4 pages x 360, 768, 1440
  pixels wide), plus `screenshots/index.html`, a contact sheet for judging the
  design.

The page list and widths live once in `scripts/pages.mjs`, shared by both
drivers, so they cannot drift.

If the preview server is not serving, the run says "Preview not serving" and
names the fix. If Chrome cannot launch, it says "Chrome could not launch" and
names the fix. The two are different problems with different messages.

Set `MEASURE_URL` to measure against any other origin, for example a Netlify
preview URL.

### The Playwright MCP screenshot pass

`npm run measure:mcp` prints the runbook for the Playwright MCP path: an agent
with the MCP connected drives a real browser and saves the captures through the
helpers in `scripts/mcp-measure.mjs` into the same `reports/screenshots/`
folder. The MCP exposes browser tools, not Lighthouse, so scoring always runs
via `npm run measure` on a normal machine. Verification of this path stays
pending until the server is connected.

⚠️ **This does not run inside the DSH sandbox** — Playwright/Lighthouse browser
launch fails there with `spawn EPERM` (a documented boundary of that environment,
not a site problem). Run the two commands on a normal machine.

Still needing a deployed URL (cannot be done locally at all): Google URL
Inspection / Live Test, Rich Results Test, Schema Markup Validator, and any
observation of AI visibility.

---

## Structured data

`src/components/Schema.astro` emits one `@graph` containing an `InsuranceAgency`
node, a `WebSite` node, and whatever page-level nodes the page passes in.

**One deliberate decision:** `telephone` sits on the `InsuranceAgency` node and is
**not** repeated on each `LocalBusiness` node. Both offices share one number, and
two nodes each claiming the same telephone reads as conflicting data to
validators. If the offices ever get separate numbers, add `telephone` to each
location in `LOCATIONS` and remove it from the organization node.

`FAQPage` markup is only emitted where the questions are genuinely visible on the
page — Google treats invisible FAQ markup as spam.

---

## Forms and lead attribution

`ServiceForm.astro` appends `source`, `page_url` and `utm_*` to the Jotform URL so
every submission carries its own origin. This is what makes "which policy line
produces the best leads" answerable; today it is not.

The embed is **lazy-loaded on click** — it is the single largest performance risk
on the site and would otherwise pull third-party JS before first paint. The
static HTML always carries the real form URL as an `<a href>`, so it is
discoverable with JS disabled.

⚠️ **Separate, non-website issue:** Jotform is integrated to AgencyZoom by **email
parsing, not a webhook**. Moving it to a webhook is an AgencyZoom-side config
change and is tracked in scope §11.

---

## Accessibility and performance targets

- Lighthouse ≥95 across Performance / SEO / Accessibility / Best Practices
- LCP <2.0s, CLS <0.05, INP <200ms on throttled 4G
- WCAG 2.1 AA. **Note:** brand gold `#bd9b01` is ~2.6:1 on white and **fails AA for
  body text** — use it only for large text, borders, icons and fills
- Minimum 48×48px tap targets
- No horizontal scroll at 360px

---

## Still outstanding

Tracked in [`../website-scope.md`](../website-scope.md) §14. The build does not
block on any of them:

- 5 carrier logos to copy from the live site (Farmers, Safeco, National General,
  Hagerty, J.C. Taylor) — the strip renders labelled text cards until then
- Confirm the `Propellert` brand name
- Poppins and Cantarell: drop the `.woff2` files into `public/fonts/` (see above)
- Legal pages need Bret's review, specifically the RingCentral question
- GitHub + Netlify accounts, then the first deploy
- Decap CMS — phase 9, deliberately after launch

## Deploying for the first time

1. `npm run build:verify` must be green. Do not deploy otherwise. On Netlify,
   this is automatic: `netlify.toml` at the repo root sets base `site`,
   publish `dist`, Node 22, and runs `npm run build:verify` as the build
   command, so a regression fails the deploy itself.
2. `public/_headers` ships the baseline security headers and the cache rules
   for the hashed assets, fonts, and artwork. HSTS is deliberately omitted
   (it would apply to preview domains too); add it per context in the Netlify
   UI if you ever want it.
3. Create the Netlify site from this repo. The settings come from
   `netlify.toml`, so there is nothing to type in the UI beyond linking.
4. Deploy to the Netlify subdomain first and run Google's **URL Inspection →
   Test Live URL** against five pages: `/`, one service page, one hub,
   `/contact`, and `/privacy-policy`.
5. Confirm each reports "URL is available to Google" with no blocked resources.
6. Only then change DNS.

⚠️ **At DNS cutover, change ONLY the A record.** `insure-big.com` has no GoDaddy
email — MX points at Microsoft 365 and is a separate record. The DKIM CNAMEs and
the Twilio verification TXT must survive. Do not let anyone "clean up" the zone.
