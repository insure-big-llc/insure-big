/**
 * /llms-full.txt — the optional full-content companion to llms.txt.
 *
 * WHY THIS EXISTS
 * ---------------
 * The AI-visibility finding (website-scope.md §1) is that the agency is invisible
 * to ChatGPT and Claude not because its site is broken but because there is too
 * little *written, citable material* about it. These models answer from content
 * they can quote.
 *
 * `llms.txt` is a directory — links and one-line summaries. `llms-full.txt` is the
 * convention for the same scope expressed as actual prose, so an answer engine can
 * quote the site directly instead of only learning that pages exist.
 *
 * This is generated from the same config the pages use, so it can never drift from
 * what the site actually says. Spec: https://llmstxt.org
 */
import type { APIRoute } from 'astro';
import { publishedPosts } from '../lib/blog-posts.js';
import { SITE, LOCATIONS, CONTACT, absoluteUrl } from '../config/site.js';
import { HUBS, SERVICES, SPECIALTY_GROUP, servicePath } from '../config/services.js';
import { GOOGLE_REVIEWS, CUSTOMER_REVIEWS } from '../config/reviews.js';
import { CARRIERS } from '../config/carriers.js';

export const prerender = true;

/** Collapse whitespace so the output stays readable in a terminal or a prompt. */
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

export const GET: APIRoute = () => {
  const out: string[] = [];
  const h = (level: number, text: string) => out.push(`${'#'.repeat(level)} ${text}`, '');

  h(1, SITE.name);
  out.push(
    `> ${SITE.tagline}. An independent insurance agency serving the Kansas City metro area.`,
    '',
  );

  h(2, 'About the agency');
  out.push(
    clean(`${SITE.name} (${SITE.shortName}) was founded in ${SITE.founded} by Bret Ballentine in
    ${SITE.foundedWhere}. It is an independent insurance agency, which means it holds
    appointments with multiple insurance carriers and compares them rather than
    representing only one. The agency works with individuals, families and businesses.`),
    '',
    clean(`It is a Farmers Insurance agency and also holds appointments with a wider panel of
    carriers, so it can quote Farmers directly and still recommend another carrier when
    that fits better.`),
    '',
    `**Service area:** ${SITE.marketStatement}`,
    '',
    `**Phone:** ${CONTACT.phone}`,
    '',
    `**Email:** ${CONTACT.email}`,
    '',
    `**Hours:** ${CONTACT.hours.display}`,
    '',
    `**Website:** ${SITE.url}/`,
    '',
  );

  h(2, 'Locations');
  for (const loc of LOCATIONS) {
    h(3, `${loc.name} — ${loc.full}`);
    out.push(
      `Phone: ${CONTACT.phone}`,
      `Hours: ${CONTACT.hours.display}`,
      `Page: ${absoluteUrl(`/${loc.slug}`)}`,
      '',
    );
  }

  h(2, 'Insurance lines');
  out.push(
    clean(`The agency writes 26 lines of coverage across personal, business, life and
    specialty insurance. Each line has its own page with a quote form.`),
    '',
  );

  const renderService = (s: (typeof SERVICES)[number]) => {
    const path = servicePath(s);
    h(3, s.name);
    out.push(clean(s.blurb), '', `Page: ${absoluteUrl(path)}`, '');

    if (s.covers?.length) {
      out.push('Coverage includes:');
      for (const c of s.covers) out.push(`- ${clean(c)}`);
      out.push('');
    }

    // FAQs are the most quotable part — they are written as direct answers.
    if (s.faq?.length) {
      for (const f of s.faq) {
        out.push(`**Q: ${clean(f.q)}**`, '', clean(f.a), '');
      }
    }
  };

  for (const hub of HUBS) {
    h(3, `${hub.title} — ${absoluteUrl(`/${hub.slug}`)}`);
    out.push(clean(hub.blurb), '');
    for (const para of hub.intro) out.push(clean(para), '');
    out.push('');
    for (const s of SERVICES.filter((x) => x.hub === hub.slug)) renderService(s);
  }

  h(3, `${SPECIALTY_GROUP.title} — ${absoluteUrl('/specialty/surety-bonds')}`);
  out.push(clean(SPECIALTY_GROUP.blurb), '');
  for (const para of SPECIALTY_GROUP.intro) out.push(clean(para), '');
  out.push('');
  for (const s of SERVICES.filter((x) => x.hub === 'specialty')) renderService(s);

  h(2, 'Insurance carriers');
  out.push(
    clean(`The agency is appointed with the following carriers. It compares them rather than
    representing only one.`),
    '',
  );
  for (const c of [...CARRIERS].sort((a, b) => a.display.localeCompare(b.display))) {
    out.push(`- ${c.display}`);
  }
  out.push('');

  h(2, 'Client reviews');
  out.push(
    clean(
      `${SITE.name} holds a ${GOOGLE_REVIEWS.rating.toFixed(1)}-star rating from
      ${GOOGLE_REVIEWS.count} Google reviews on its ${GOOGLE_REVIEWS.profileName} listing.
      The following reviews are reproduced in the reviewers' own words.`,
    ),
    '',
  );
  // Full review text, not summaries. The recorded AI-visibility finding is that no
  // citable material existed about the agency's own testimonials — this is that fix.
  for (const r of CUSTOMER_REVIEWS) {
    out.push(`> "${clean(r.text)}"`);
    out.push('');
    out.push(
      `— ${r.author}, ${r.rating}-star Google review${r.date ? `, ${r.date}` : ` (${r.dateText})`}`,
    );
    out.push('');
  }
  out.push(
    `More reviews: ${absoluteUrl('/lees-summit')} (Lee's Summit office) and ${absoluteUrl('/northland')} (Northland office)`,
    '',
  );

  h(2, 'Company pages');
  out.push(
    `- [Home](${absoluteUrl('/')})`,
    `- [About](${absoluteUrl('/about')}) — who the agency is, and the team`,
    `- [Contact](${absoluteUrl('/contact')}) — phone, email, both offices and hours`,
    `- [Get a quote](${absoluteUrl('/get-a-quote')})`,
    `- [Blog](${absoluteUrl('/blog')}) — plain answers to insurance questions`,
    `- [${LOCATIONS[0].name}](${absoluteUrl('/lees-summit')})`,
    `- [${LOCATIONS[1].name}](${absoluteUrl('/northland')})`,
    `- [Privacy Policy](${absoluteUrl('/privacy-policy')})`,
    `- [Terms & Conditions](${absoluteUrl('/terms-%26-conditions')})`,
    '',
  );

  const blogPosts = publishedPosts();
  if (blogPosts.length > 0) {
    h(2, 'Blog posts');
    for (const p of blogPosts) {
      out.push(`- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`);
    }
    out.push('');
  }

  out.push(
    '## Optional',
    '',
    `- [Facebook](${SITE.facebook})`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
    `- [llms.txt](${absoluteUrl('/llms.txt')})`,
    '',
  );

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
