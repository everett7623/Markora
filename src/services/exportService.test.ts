import { describe, expect, it } from 'vitest';
import type { BookmarkNode } from '../shared/types';
import { exportService } from './exportService';

const bookmarks: BookmarkNode[] = [
  {
    id: 'root',
    title: 'Root',
    children: [
      { id: '1', title: 'Example', url: 'https://example.com', path: ['Root', 'Example'] },
      { id: '2', title: 'Quote "Site"', url: 'https://example.com?q=1&x=2', path: ['Root', 'Quote "Site"'] }
    ] as BookmarkNode[]
  }
];

describe('exportService', () => {
  it('serializes bookmark data as JSON', () => {
    const result = exportService.toJson(bookmarks);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toContain('https://example.com');
  });

  it('exports CSV with escaped cells', () => {
    const result = exportService.toCsv(bookmarks);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toContain('id,title,url,path,dateAdded');
      expect(result.data).toContain('"Quote ""Site"""');
    }
  });

  it('exports TXT, OPML, and Netscape HTML formats', () => {
    const txt = exportService.toTxt(bookmarks);
    const opml = exportService.toOpml(bookmarks);
    const html = exportService.toHtml(bookmarks);

    expect(txt.success && txt.data).toContain('Example');
    expect(opml.success && opml.data).toContain('&amp;');
    expect(html.success && html.data).toContain('NETSCAPE-Bookmark-file-1');
  });

  it('creates a downloadable file descriptor', () => {
    const file = exportService.createFile(bookmarks, 'csv');
    expect(file.success).toBe(true);
    if (file.success) {
      expect(file.data.filename).toMatch(/bookmarks-\d{4}-\d{2}-\d{2}\.csv/);
      expect(file.data.mimeType).toContain('text/csv');
    }
  });
});
