# CMS setup and staff guide

The site's editor is Decap CMS at `/admin/`. Staff sign in with DecapBridge, so nobody needs a GitHub account. Changes save to the `main` branch of `insure-big-llc/insure-big`, Netlify rebuilds, and the live site updates in about a minute.

## What staff can edit

| In the CMS | What it changes |
|---|---|
| Blog posts | Articles under `/blog` |
| Site content, Office hours | Hours on the contact page, footer, both office pages and Google data |
| Site content, Team members | Names, titles, photos and bios on the home and About pages |
| Site content, Home page questions | The FAQ on the home page (and its Google FAQ data) |
| Site content, Reviews (two offices) | Google reviews and the rating numbers shown on the site |

Not editable on purpose: phone numbers, addresses, web addresses and page copy. They live in the code so every page and search engine data always agree. Ask the developer.

## Safety net

Every save runs `npm run build:verify` on Netlify. If an edit breaks a rule, the build fails, the live site stays on the last good version, and the Netlify deploy log names the problem in plain words. The content rules are in `scripts/verify-content.mjs`:

- A review needs a name, text and a date text. A calendar date is only allowed when it is the same date as the text says (for example `2026-04-07` with `4/7/2026`). This stops invented dates reaching Google.
- Team members named in a review must exist on the Team list, spelled the same.
- Hours need valid 24 hour times, and closing after opening.
- The Google review count can never be lower than the number of reviews listed.
- Team photos must exist in `public/team/`.

## One time setup (developer)

1. Push this repo to `insure-big-llc/insure-big` (branch `main`).
2. Create a GitHub fine grained token: only the `insure-big` repository, permissions Contents read and write, plus Pull requests read and write. Use an agency account, not a personal one.
3. Create an account at <https://decapbridge.com>. Add a site:
   - Git provider GitHub, repository `insure-big-llc/insure-big`, paste the token.
   - Decap login URL `https://insure-big.com/admin/index.html` (use the Netlify address until the domain is live).
   - Auth type PKCE, so staff get Login with Google or Microsoft. Password login also works.
4. DecapBridge shows a generated `backend:` block. Replace the `backend:` block in `public/admin/config.yml` with it, keeping `repo` and `branch`. Commit and push.
5. In Netlify, link the GitHub repo to the site so a push deploys it. Build command `npm run build:verify`, publish directory `dist`.
6. In DecapBridge, Manage collaborators, invite each staff member by email.
7. When handing over, use the site Settings tab, Transfer ownership, to give the client ownership. The Professional plan ($9 a month) adds the admin role and branded login screens.

Decap is pinned to an exact version in `public/admin/index.html`. Update it on purpose, test the editor, then bump the number. PKCE login needs 3.8.4 or newer.

## Staff guide

1. Open `https://insure-big.com/admin/` and sign in with the email you were invited with.
2. Pick what to edit on the left.
3. Make the change and press Publish, then Publish now.
4. Wait about a minute and refresh the live page.

Reviews: copy them word for word from Google. Never fix a customer's spelling or invent a review. For a normal "3 months ago" review leave Calendar date empty.
