import { describe, expect, it } from 'vitest';
import type { BookmarkNode } from '../types';
import { createAiAnalysisPayload } from './aiPreprocess';

const tree: BookmarkNode[] = [
  {
    id: 'root',
    title: 'Root',
    children: [
      {
        id: 'work',
        title: 'Private Work',
        path: ['Root', 'Private Work'],
        children: [
          { id: 'one', title: 'Secret title', url: 'https://example.com/docs?token=secret#section', path: ['Root', 'Private Work', 'Secret title'], tags: ['private'] },
          { id: 'two', title: 'Second', url: 'https://example.com/guide', path: ['Root', 'Private Work', 'Second'] }
        ] as BookmarkNode[]
      },
      { id: 'other', title: 'Other', children: [{ id: 'three', title: 'Other link', url: 'https://other.test/path?hidden=yes' }] as BookmarkNode[] }
    ] as BookmarkNode[]
  }
];

describe('AI bookmark preprocessing', () => {
  it('keeps domain-only requests aggregate-only', () => {
    const prepared = createAiAnalysisPayload(tree, null, 'domain-only');
    const serialized = JSON.stringify(prepared.payload);

    expect(prepared.payload.scope.bookmarkCount).toBe(3);
    expect(prepared.payload.items).toEqual([]);
    expect(prepared.payload.aggregate.topDomains[0]).toEqual({ value: 'example.com', count: 2 });
    expect(prepared.payload.aggregate.topFolders).toEqual([]);
    expect(serialized).not.toContain('Secret title');
    expect(serialized).not.toContain('token=secret');
    expect(serialized).not.toContain('Private Work');
  });

  it('redacts query strings and limits metadata samples', () => {
    const many = Array.from({ length: 250 }, (_, index): BookmarkNode => ({
      id: String(index),
      title: `Bookmark ${index}`,
      url: `https://example.com/page/${index}?secret=${index}#hash`,
      path: ['Root', 'Folder', `Bookmark ${index}`]
    }));
    const prepared = createAiAnalysisPayload([{ id: 'folder', title: 'Folder', children: many }], null, 'metadata');
    const serialized = JSON.stringify(prepared.payload);

    expect(prepared.payload.items).toHaveLength(200);
    expect(prepared.payload.truncated).toBe(true);
    expect(prepared.payload.items[0].urlPath).toBe('/page/0');
    expect(serialized).not.toContain('?secret=');
    expect(serialized).not.toContain('#hash');
  });

  it('limits analysis to the selected folder', () => {
    const prepared = createAiAnalysisPayload(tree, 'work', 'metadata');
    expect(prepared.payload.scope).toEqual({ kind: 'folder', bookmarkCount: 2 });
    expect(prepared.payload.aggregate.topDomains).toEqual([{ value: 'example.com', count: 2 }]);
  });
});
