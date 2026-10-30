import type { APIRoute } from 'astro';
import { publishedPosts } from '../../lib/blog-posts.js';
import { SITE } from '../../config/site.js';

/**
 * /blog/rss.xml — the feed of published posts. Spec 0004, AC-7.
 * Drafts never appear.
 */
export const prerender = true;

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const posts = publishedPosts();

  const items = posts
    .map(
      (p) => `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${SITE.url}/blog/${p.slug}</link>
    <guid>${SITE.url}/blog/${p.slug}</guid>
    <pubDate>${p.pubDate.toUTCString()}</pubDate>
    <description>${escapeXml(p.description)}</description>
  </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE.name)} — Insurance answers</title>
    <link>${SITE.url}/blog</link>
    <description>Plain answers to the insurance questions Kansas City families ask, plus agency news and practical ways to save on your coverage.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
