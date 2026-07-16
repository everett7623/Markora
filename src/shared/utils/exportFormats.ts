import type { BookmarkNode, ExportFormat } from '../types';
import { flattenBookmarks } from './bookmarks';

function escapeCsv(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toCsv(bookmarks: BookmarkNode[]): string {
  const rows = flattenBookmarks(bookmarks).map((bookmark) =>
    [bookmark.id, bookmark.title, bookmark.url, bookmark.path?.join(' / ') ?? '', bookmark.dateAdded ?? ''].map(escapeCsv).join(',')
  );
  return ['id,title,url,path,dateAdded', ...rows].join('\n');
}

function toTxt(bookmarks: BookmarkNode[]): string {
  return flattenBookmarks(bookmarks)
    .map((bookmark) => `${bookmark.title || 'Untitled'}\n${bookmark.url ?? ''}\n${bookmark.path?.join(' / ') ?? ''}`)
    .join('\n\n');
}

function toOpml(bookmarks: BookmarkNode[]): string {
  const outlines = flattenBookmarks(bookmarks)
    .map((bookmark) => `    <outline text="${escapeXml(bookmark.title || 'Untitled')}" type="link" url="${escapeXml(bookmark.url)}" />`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head>\n    <title>FavGrove Bookmark Export</title>\n  </head>\n  <body>\n${outlines}\n  </body>\n</opml>\n`;
}

function toHtml(bookmarks: BookmarkNode[]): string {
  const links = flattenBookmarks(bookmarks)
    .map((bookmark) => `    <DT><A HREF="${escapeXml(bookmark.url)}">${escapeXml(bookmark.title || 'Untitled')}</A>`)
    .join('\n');
  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n${links}\n</DL><p>\n`;
}

export function serializeExport(bookmarks: BookmarkNode[], format: ExportFormat): string {
  switch (format) {
    case 'json':
      return JSON.stringify(bookmarks, null, 2);
    case 'csv':
      return toCsv(bookmarks);
    case 'txt':
      return toTxt(bookmarks);
    case 'opml':
      return toOpml(bookmarks);
    case 'html':
      return toHtml(bookmarks);
  }
}
