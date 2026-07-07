import type { BookmarkNode, ImportBookmarkItem, ImportFormat } from '../types';
import { parseNetscapeBookmarksHtml } from './importHtml';

type PlainBookmarkNode = Partial<BookmarkNode> & {
  children?: PlainBookmarkNode[];
};

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function normalizeTitle(value: unknown): string {
  const title = typeof value === 'string' ? value.trim() : '';
  return title || 'Untitled';
}

function normalizePath(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((part) => (typeof part === 'string' ? part.trim() : '')).filter(Boolean)
    : [];
}

function normalizeDateAdded(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function isSupportedUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function createItem(title: unknown, url: unknown, path: unknown, dateAdded?: unknown): ImportBookmarkItem | null {
  if (!isSupportedUrl(url)) return null;
  return {
    title: normalizeTitle(title),
    url: url.trim(),
    path: normalizePath(path),
    dateAdded: normalizeDateAdded(dateAdded)
  };
}

function parseJson(content: string): ImportBookmarkItem[] {
  const parsed = JSON.parse(content) as PlainBookmarkNode[] | { bookmarks?: PlainBookmarkNode[] };
  const roots = Array.isArray(parsed) ? parsed : Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [];
  const items: ImportBookmarkItem[] = [];

  const visit = (nodes: PlainBookmarkNode[], parentPath: string[]) => {
    for (const node of nodes) {
      const title = normalizeTitle(node.title);
      if (node.url) {
        const exportedPath = normalizePath(node.path);
        const path = exportedPath.length > 0 ? exportedPath.slice(0, -1) : parentPath;
        const item = createItem(title, node.url, path, node.dateAdded);
        if (item) items.push(item);
      }

      if (Array.isArray(node.children)) {
        const path = node.url ? parentPath : normalizePath(node.path).length > 0 ? normalizePath(node.path) : [...parentPath, title];
        visit(node.children, path);
      }
    }
  };

  visit(roots, []);
  return items;
}

function parseCsvRows(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  if (inQuotes) throw new Error('CSV import failed: unterminated quoted field.');
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function parseCsv(content: string): ImportBookmarkItem[] {
  const [headerRow, ...dataRows] = parseCsvRows(content);
  if (!headerRow) return [];

  const headers = headerRow.map((header) => header.trim().toLowerCase());
  const titleIndex = headers.indexOf('title');
  const urlIndex = headers.indexOf('url');
  const pathIndex = headers.findIndex((header) => header === 'path' || header === 'folder' || header === 'folder path' || header === 'folderpath');
  const dateIndex = headers.indexOf('dateadded');
  if (titleIndex < 0 || urlIndex < 0) throw new Error('CSV import requires title and URL columns.');

  return dataRows
    .map((row) =>
      createItem(
        row[titleIndex],
        row[urlIndex],
        pathIndex >= 0 ? row[pathIndex].split('/').map((part) => part.trim()) : [],
        dateIndex >= 0 ? Number(row[dateIndex]) : undefined
      )
    )
    .filter((item): item is ImportBookmarkItem => item !== null);
}

function parseTxt(content: string): ImportBookmarkItem[] {
  return content
    .split(/\n\s*\n/g)
    .map((block) => block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    .map((lines) => {
      const urlIndex = lines.findIndex((line) => /^https?:\/\//i.test(line));
      if (urlIndex < 0) return null;
      return createItem(lines[urlIndex - 1] ?? lines[urlIndex], lines[urlIndex], lines[urlIndex + 1]?.split('/').map((part) => part.trim()) ?? []);
    })
    .filter((item): item is ImportBookmarkItem => item !== null);
}

function getAttribute(attributes: string, name: string): string | null {
  const match = attributes.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? decodeXml(match[1] ?? match[2] ?? '') : null;
}

function parseOpml(content: string): ImportBookmarkItem[] {
  if (!/<opml\b/i.test(content) || !/<body\b/i.test(content)) {
    throw new Error('OPML import requires an <opml> document with a <body>.');
  }

  const items: ImportBookmarkItem[] = [];
  const path: string[] = [];
  const stack: boolean[] = [];
  const tokens = content.matchAll(/<outline\b([^>]*?)(\/?)>|<\/outline>/gi);

  for (const token of tokens) {
    const raw = token[0];
    if (/^<\/outline/i.test(raw)) {
      if (stack.pop()) path.pop();
      continue;
    }

    const attributes = token[1] ?? '';
    const selfClosing = token[2] === '/' || /\/\s*>$/.test(raw);
    const title = normalizeTitle(getAttribute(attributes, 'text') ?? getAttribute(attributes, 'title'));
    const url = getAttribute(attributes, 'url') ?? getAttribute(attributes, 'xmlUrl') ?? getAttribute(attributes, 'htmlUrl');

    if (url) {
      const item = createItem(title, url, path);
      if (item) items.push(item);
      if (!selfClosing) stack.push(false);
    } else {
      if (!selfClosing) path.push(title);
      if (!selfClosing) stack.push(true);
    }
  }

  return items;
}

export function parseImportContent(format: ImportFormat, content: string): ImportBookmarkItem[] {
  switch (format) {
    case 'html':
      return parseNetscapeBookmarksHtml(content);
    case 'json':
      return parseJson(content);
    case 'csv':
      return parseCsv(content);
    case 'txt':
      return parseTxt(content);
    case 'opml':
      return parseOpml(content);
  }
}
