import { describe, expect, it } from 'vitest';
import type { BookmarkNode } from '../types';
import { searchBookmarks } from './bookmarks';
import { createStructureScanResult } from './structureScan';

function createLargeBookmarkTree(count: number): BookmarkNode[] {
  const folders = Array.from({ length: 100 }, (_, folderIndex): BookmarkNode => ({
    id: `folder-${folderIndex}`,
    title: `Folder ${folderIndex % 20}`,
    parentId: 'root',
    children: []
  }));

  for (let index = 0; index < count; index += 1) {
    const folder = folders[index % folders.length];
    const title = index % 2 === 0 ? `书签整理 ${index}` : `Bookmark ${index}`;
    folder.children = [
      ...((folder.children as BookmarkNode[] | undefined) ?? []),
      {
        id: `bookmark-${index}`,
        title,
        parentId: folder.id,
        url: `https://host-${index % 200}.test/page-${index % 5_000}`
      }
    ];
  }

  return [{ id: 'root', title: 'Root', children: folders }];
}

describe('large collection performance', () => {
  const tree = createLargeBookmarkTree(10_000);

  it('keeps structural scanning responsive for 10,000 bookmarks', () => {
    const startedAt = performance.now();
    const result = createStructureScanResult(tree);
    const durationMs = performance.now() - startedAt;

    expect(result.duplicateBookmarkGroups.length).toBeGreaterThan(0);
    expect(result.duplicateFolderGroups.length).toBeGreaterThan(0);
    expect(durationMs).toBeLessThan(1_500);
  });

  it('keeps pinyin search responsive for 10,000 bookmarks', () => {
    const startedAt = performance.now();
    const results = searchBookmarks(tree, 'sqzl');
    const durationMs = performance.now() - startedAt;

    expect(results).toHaveLength(5_000);
    expect(durationMs).toBeLessThan(2_500);
  });
});
