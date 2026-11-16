/**
 * llms.txt — generated at build time from the same config the pages use.
 *
 * The live file lists 2 of 7 pages and no service descriptions, which is a real
 * part of why the agency is invisible to ChatGPT and Claude (website-scope.md §1).
 * Generating it means it can never drift from the site again.
 *
 * Spec: https://llmstxt.org
 *
 * This is a TypeScript endpoint, not an Astro component — `.ts` under src/pages
 * must export a GET handler returning a Response.
 */
import type { APIRoute } from 'astro';
import { SITE, LOCATIONS, CONTACT, absoluteUrl } from '../config/site.js';
import { HUBS, SERVICES, SPECIALTY_GROUP } from '../config/services.js';
import { LOCATION_PROFILES } from '../config/reviews.js';

export const prerender = true;

export const GET: APIRoute = () => {
  const specialties = SERVICES.filter((s) => s.hub === 'specialty');
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push('');
  lines.push(`> ${SITE.tagline}. A Farmers-appointed independent insurance agency with offices in Downtown Lee's Summit and the Kansas City Northland, comparing ${SITE.carriersClaim} carriers.`);
  lines.push('');
  lines.push(`**Business:** ${SITE.name} (${SITE.shortName})`);
  lines.push(`**Website:** ${SITE.url}/`);
  lines.push(`**Main phone:** ${CONTACT.phone}`);
  lines.push(`**Email:** ${CONTACT.email}`);
  lines.push(`**Hours:** ${CONTACT.hours.display}`);
  lines.push(`**Service area:** ${SITE.marketStatement}`);
  lines.push(`**Founded:** ${SITE.founded}, ${SITE.foundedWhere}`);
  lines.push('');

  lines.push('## Locations');
  lines.push('');
  for (const loc of LOCATIONS) {
    lines.push(`### ${loc.name}`);
    lines.push(`Address: ${loc.full}`);
    lines.push(`Listed as: ${loc.listingName}`);
    lines.push(`Phone: ${loc.phone}`);
    lines.push(`Hours: ${CONTACT.hours.display}`);
    lines.push(`Page: ${absoluteUrl(`/${loc.slug}`)}`);
    lines.push('');
  }

  lines.push('## Insurance lines');
  lines.push('');
  for (const hub of HUBS) {
    lines.push(`### ${hub.title}`);
    lines.push('');
    lines.push(hub.blurb);
    lines.push(`Index page: ${absoluteUrl(`/${hub.slug}`)}`);
    lines.push('');
    for (const s of SERVICES.filter((x) => x.hub === hub.slug)) {
      lines.push(`- [${s.name}](${absoluteUrl(`/${hub.slug}/${s.slug}`)}): ${s.blurb}`);
    }
    lines.push('');
  }

  lines.push(`### ${SPECIALTY_GROUP.title}`);
  lines.push('');
  lines.push(SPECIALTY_GROUP.blurb);
  lines.push('');
  for (const s of specialties) {
    lines.push(`- [${s.name}](${absoluteUrl(`/specialty/${s.slug}`)}): ${s.blurb}`);
  }
  lines.push('');

  lines.push('## Company pages');
  lines.push('');
  lines.push(`- [Home](${absoluteUrl('/')}): ${SITE.marketStatement}`);
  lines.push(`- [About](${absoluteUrl('/about')}): Who we are, and the team you will work with.`);
  lines.push(
    `- [Contact](${absoluteUrl('/contact')}): Phone, email, both office addresses and opening hours.`,
  );
  lines.push(
    `- [Get a quote](${absoluteUrl('/get-a-quote')}): Start a personal or business insurance quote.`,
  );
  lines.push(
    `- [Client reviews](${absoluteUrl('/lees-summit')} and ${absoluteUrl('/northland')}): ${LOCATION_PROFILES['lees-summit'].rating.toFixed(1)} from ${LOCATION_PROFILES['lees-summit'].count} Google reviews at the Lee's Summit office, ${LOCATION_PROFILES.northland.rating.toFixed(1)} from ${LOCATION_PROFILES.northland.count} at the Northland office, reproduced in full on each office page.`,
  );
  lines.push(
    `- [Coverage partners](${absoluteUrl('/coverage-partners')}): How we place specialty cover with partner programmes.`,
  );
  lines.push(
    `- [Blog](${absoluteUrl('/blog')}): Plain answers to the insurance questions Kansas City families ask, one short read per question.`,
  );
  lines.push(`- [${LOCATIONS[0].name}](${absoluteUrl('/lees-summit')}): ${LOCATIONS[0].full}`);
  lines.push(`- [${LOCATIONS[1].name}](${absoluteUrl('/northland')}): ${LOCATIONS[1].full}`);
  lines.push('');

  lines.push('## Legal');
  lines.push('');
  lines.push(`- [Privacy Policy](${absoluteUrl('/privacy-policy')})`);
  lines.push(`- [Terms & Conditions](${absoluteUrl('/terms-%26-conditions')})`);
  lines.push('');

  lines.push('## Optional');
  lines.push('');
  lines.push(
    `- [Full content](${absoluteUrl('/llms-full.txt')}): The whole site as prose, for answer engines that quote rather than link.`,
  );
  lines.push(`- [Facebook](${SITE.facebook})`);
  for (const url of SITE.profiles.agency) lines.push(`- [Agency profile](${url})`);
  for (const loc of LOCATIONS) {
    lines.push(`- [Official Farmers agent page, ${loc.name}](${loc.farmersUrl})`);
    for (const url of SITE.profiles.office[loc.id] ?? []) lines.push(`- [Reviews and listing, ${loc.name}](${url})`);
  }
  lines.push(`- [Bret Ballentine on LinkedIn](${SITE.profiles.bret[0]})`);
  lines.push(`- [Sitemap](${absoluteUrl('/sitemap.xml')})`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
