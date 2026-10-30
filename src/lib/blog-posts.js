/**
 * The blog: plain markdown in src/content/blog, one file per post. Spec 0004.
 *
 * This replaces Astro content collections on purpose: the content layer's
 * sync step hit a Vite 8 interop bug with its CJS dependencies in this
 * environment. The folder layout and the Decap CMS config are unchanged, so
 * editors never notice; only the reading mechanism differs.
 *
 * The frontmatter parser is deliberately small and dependency free: the
 * fields are all scalars, so a full YAML parser would be heavier than the
 * content. The build gate (scripts/verify-seo.mjs) re-checks the same rules
 * so a malformed post can never publish.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';

/**
 * The build runs from the site root, and this module is bundled into the
 * prerender chunks, so a URL-relative path would resolve inside dist/.
 * Anchoring on the working directory keeps it stable.
 */
const DIR = join(process.cwd(), 'src', 'content', 'blog');

/** Parse the simple scalar frontmatter block between --- markers. */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }
  return { fields, body: match[2].trim() };
}

const SLUG_RE = /^[a-z0-9-]+$/;

/**
 * Every post, newest first, with validation errors collected instead of
 * thrown, so the gate can report them all at once.
 */
export function getBlogPosts() {
  const posts = [];
  const errors = [];
  const seen = new Map();
  if (!existsSync(DIR)) {
    return { posts, errors: ['blog: src/content/blog folder missing'] };
  }
  for (const name of readdirSync(DIR)) {
    if (!name.endsWith('.md')) continue;
    const raw = readFileSync(join(DIR, name), 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      errors.push(`blog ${name}: missing or malformed frontmatter`);
      continue;
    }
    const f = parsed.fields;
    if (!f.title) errors.push(`blog ${name}: title is required`);
    if (!f.slug) {
      errors.push(`blog ${name}: slug is required`);
    } else if (!SLUG_RE.test(f.slug)) {
      errors.push(`blog ${name}: slug must be lowercase letters, digits and hyphens`);
    }
    if (!f.description) errors.push(`blog ${name}: description is required`);
    if (f.description && f.description.length > 160) errors.push(`blog ${name}: description longer than 160 chars`);
    if (!f.pubDate) errors.push(`blog ${name}: pubDate is required`);
    if (seen.has(f.slug)) errors.push(`blog: duplicate slug "${f.slug}" (${seen.get(f.slug)} and ${name})`);
    seen.set(f.slug, name);
    posts.push({
      slug: f.slug,
      title: f.title ?? '',
      description: f.description ?? '',
      pubDate: new Date(f.pubDate ?? 0),
      author: f.author ?? 'Ballentine Insurance Group',
      service: f.service || null,
      cover: f.cover || null,
      draft: f.draft === 'true',
      bodyHtml: marked.parse(parsed.body),
    });
  }
  posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return { posts, errors };
}

/** Published posts only, newest first. */
export function publishedPosts() {
  return getBlogPosts().posts.filter((p) => !p.draft);
}
