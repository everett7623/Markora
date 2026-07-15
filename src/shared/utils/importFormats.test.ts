import { describe, expect, it } from 'vitest';
import { parseImportContent } from './importFormats';

describe('parseImportContent', () => {
  it('parses FavGrove JSON bookmark exports recursively', () => {
    const items = parseImportContent(
      'json',
      JSON.stringify([
        {
          id: 'root',
          title: 'Root',
          children: [
            {
              id: 'folder',
              title: 'Docs',
              children: [{ id: 'bookmark', title: 'React', url: 'https://react.dev', dateAdded: 123 }]
            }
          ]
        }
      ])
    );

    expect(items).toEqual([{ title: 'React', url: 'https://react.dev', path: ['Root', 'Docs'], dateAdded: 123 }]);
  });

  it('parses quoted CSV rows with title, URL, and folder path columns', () => {
    const items = parseImportContent('csv', 'title,url,path\n"Example, Inc","https://example.com","Imported / CSV"');

    expect(items).toEqual([{ title: 'Example, Inc', url: 'https://example.com', path: ['Imported', 'CSV'], dateAdded: undefined }]);
  });

  it('parses FavGrove TXT export blocks', () => {
    const items = parseImportContent('txt', 'Example\nhttps://example.com\nImported / TXT\n\nBad\njavascript:alert(1)');

    expect(items).toEqual([{ title: 'Example', url: 'https://example.com', path: ['Imported', 'TXT'], dateAdded: undefined }]);
  });

  it('parses nested OPML outlines without rendering HTML', () => {
    const items = parseImportContent(
      'opml',
      `<?xml version="1.0"?>
<opml version="2.0">
  <body>
    <outline text="News">
      <outline text="Example" type="link" url="https://example.com" />
    </outline>
  </body>
</opml>`
    );

    expect(items).toEqual([{ title: 'Example', url: 'https://example.com', path: ['News'], dateAdded: undefined }]);
  });
});
