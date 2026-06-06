import { describe, expect, it } from 'vitest';
import { parseNetscapeBookmarksHtml } from './importHtml';

const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
  <DT><H3 ADD_DATE="1">Work</H3>
  <DL><p>
    <DT><A HREF="https://example.com" ADD_DATE="1700000000">Example</A>
    <DT><A HREF="javascript:alert(1)">Bad</A>
  </DL><p>
</DL><p>`;

describe('parseNetscapeBookmarksHtml', () => {
  it('parses Netscape bookmark HTML and filters unsupported URLs', () => {
    const items = parseNetscapeBookmarksHtml(html);

    expect(items).toEqual([
      {
        title: 'Example',
        url: 'https://example.com',
        path: ['Work'],
        dateAdded: 1700000000000
      }
    ]);
  });
});
