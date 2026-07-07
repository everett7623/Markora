import { describe, expect, it } from 'vitest';
import type { BookmarkNode } from '../shared/types';
import { importService } from './importService';

const currentBookmarks: BookmarkNode[] = [
  {
    id: 'root',
    title: 'Root',
    children: [{ id: '1', title: 'Existing', url: 'https://existing.test', parentId: 'root' }]
  }
];

const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<DL><p>
  <DT><A HREF="https://existing.test">Existing Copy</A>
  <DT><A HREF="https://new.test">New</A>
</DL><p>`;

describe('importService', () => {
  it('creates an HTML import preview with URL conflicts', async () => {
    const result = await importService.previewHtml(html, currentBookmarks);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toHaveLength(2);
      expect(result.data.conflicts).toHaveLength(1);
      expect(result.data.conflicts[0].existing.id).toBe('1');
    }
  });

  it('creates a multi-format import preview through the shared flow', async () => {
    const result = await importService.preview('json', JSON.stringify([{ title: 'New', url: 'https://new.test' }]), currentBookmarks);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.items).toHaveLength(1);
      expect(result.data.conflicts).toHaveLength(0);
    }
  });
});
