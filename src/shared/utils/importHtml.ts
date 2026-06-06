import type { ImportBookmarkItem } from '../types';

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function stripTags(value: string): string {
  return decodeHtml(value.replace(/<[^>]*>/g, '')).trim();
}

function normalizeTitle(value: string | null | undefined): string {
  const title = value ? stripTags(value) : '';
  return title || 'Untitled';
}

function parseDateAdded(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  return Number.isFinite(seconds) ? seconds * 1000 : undefined;
}

function getAttribute(attributes: string, name: string): string | null {
  const match = attributes.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? '') : null;
}

export function parseNetscapeBookmarksHtml(html: string): ImportBookmarkItem[] {
  const items: ImportBookmarkItem[] = [];
  const path: string[] = [];
  const listDepth: boolean[] = [];
  let pendingFolder: string | null = null;
  const tokens = html.matchAll(/<H3\b[^>]*>([\s\S]*?)<\/H3>|<A\b([^>]*)>([\s\S]*?)<\/A>|<DL\b[^>]*>|<\/DL>/gi);

  for (const token of tokens) {
    const value = token[0].toLowerCase();
    if (value.startsWith('<h3')) {
      pendingFolder = normalizeTitle(token[1]);
      continue;
    }

    if (value.startsWith('<dl')) {
      const opensFolder = pendingFolder !== null;
      if (pendingFolder) path.push(pendingFolder);
      listDepth.push(opensFolder);
      pendingFolder = null;
      continue;
    }

    if (value.startsWith('</dl')) {
      if (listDepth.pop()) path.pop();
      continue;
    }

    const url = getAttribute(token[2] ?? '', 'href');
    if (!url) continue;
    items.push({
      title: normalizeTitle(token[3]),
      url,
      path: [...path],
      dateAdded: parseDateAdded(getAttribute(token[2] ?? '', 'add_date'))
    });
  }

  return items.filter((item) => /^https?:\/\//i.test(item.url));
}
