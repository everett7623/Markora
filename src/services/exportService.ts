import type { BookmarkNode, ExportFormat, Result } from '../shared/types';
import { flattenBookmarks } from '../shared/utils/bookmarks';

export interface ExportFile {
  filename: string;
  mimeType: string;
  content: string;
}

const formatConfig: Record<ExportFormat, { extension: string; mimeType: string }> = {
  json: { extension: 'json', mimeType: 'application/json;charset=utf-8' },
  csv: { extension: 'csv', mimeType: 'text/csv;charset=utf-8' },
  txt: { extension: 'txt', mimeType: 'text/plain;charset=utf-8' },
  opml: { extension: 'opml', mimeType: 'text/x-opml;charset=utf-8' },
  html: { extension: 'html', mimeType: 'text/html;charset=utf-8' }
};

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

function toCsvRows(bookmarks: BookmarkNode[]): string {
  const rows = flattenBookmarks(bookmarks).map((bookmark) =>
    [bookmark.id, bookmark.title, bookmark.url, bookmark.path?.join(' / ') ?? '', bookmark.dateAdded ?? ''].map(escapeCsv).join(',')
  );
  return ['id,title,url,path,dateAdded', ...rows].join('\n');
}

function toTxtRows(bookmarks: BookmarkNode[]): string {
  return flattenBookmarks(bookmarks)
    .map((bookmark) => `${bookmark.title || 'Untitled'}\n${bookmark.url ?? ''}\n${bookmark.path?.join(' / ') ?? ''}`)
    .join('\n\n');
}

function toOpml(bookmarks: BookmarkNode[]): string {
  const outlines = flattenBookmarks(bookmarks)
    .map((bookmark) => `    <outline text="${escapeXml(bookmark.title || 'Untitled')}" type="link" url="${escapeXml(bookmark.url)}" />`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head>\n    <title>Markora Bookmark Export</title>\n  </head>\n  <body>\n${outlines}\n  </body>\n</opml>\n`;
}

function toHtml(bookmarks: BookmarkNode[]): string {
  const links = flattenBookmarks(bookmarks)
    .map((bookmark) => `    <DT><A HREF="${escapeXml(bookmark.url)}">${escapeXml(bookmark.title || 'Untitled')}</A>`)
    .join('\n');
  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n${links}\n</DL><p>\n`;
}

export const exportService = {
  toJson(bookmarks: BookmarkNode[]): Result<string> {
    return { success: true, data: JSON.stringify(bookmarks, null, 2) };
  },

  toCsv(bookmarks: BookmarkNode[]): Result<string> {
    return { success: true, data: toCsvRows(bookmarks) };
  },

  toTxt(bookmarks: BookmarkNode[]): Result<string> {
    return { success: true, data: toTxtRows(bookmarks) };
  },

  toOpml(bookmarks: BookmarkNode[]): Result<string> {
    return { success: true, data: toOpml(bookmarks) };
  },

  toHtml(bookmarks: BookmarkNode[]): Result<string> {
    return { success: true, data: toHtml(bookmarks) };
  },

  createFile(bookmarks: BookmarkNode[], format: ExportFormat): Result<ExportFile> {
    const contentByFormat: Record<ExportFormat, Result<string>> = {
      json: this.toJson(bookmarks),
      csv: this.toCsv(bookmarks),
      txt: this.toTxt(bookmarks),
      opml: this.toOpml(bookmarks),
      html: this.toHtml(bookmarks)
    };
    const content = contentByFormat[format];
    if (!content.success) return content;

    return {
      success: true,
      data: {
        filename: `bookmarks-${new Date().toISOString().slice(0, 10)}.${formatConfig[format].extension}`,
        mimeType: formatConfig[format].mimeType,
        content: content.data
      }
    };
  }
};
