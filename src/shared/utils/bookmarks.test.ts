import { describe, expect, it } from 'vitest';
import type { BookmarkNode } from '../types';
import { calculateBookmarkStats, getFolderDescendantBookmarks, removeBookmarkNodes, searchBookmarks } from './bookmarks';

const tree: BookmarkNode[] = [
  {
    id: '1',
    title: 'Root',
    children: [
      { id: '2', title: 'GitHub', url: 'https://github.com', parentId: '1' },
      { id: '3', title: 'GitHub Duplicate', url: 'https://github.com', parentId: '1' },
      { id: '4', title: 'Docs', parentId: '1', children: [{ id: '5', title: 'React', url: 'https://react.dev', parentId: '4' }] }
    ]
  }
];

describe('bookmark utilities', () => {
  it('calculates bookmark stats from a tree', () => {
    expect(calculateBookmarkStats(tree)).toEqual({
      totalBookmarks: 3,
      totalFolders: 2,
      duplicateBookmarks: 2,
      invalidLinks: 0
    });
  });

  it('searches title and url fields', () => {
    expect(searchBookmarks(tree, 'react')).toHaveLength(1);
    expect(searchBookmarks(tree, 'github')).toHaveLength(2);
  });

  it('removes bookmark nodes recursively', () => {
    const nextTree = removeBookmarkNodes(tree, new Set(['3', '5']));
    expect(searchBookmarks(nextTree, '')).toHaveLength(1);
    expect(searchBookmarks(nextTree, 'github')).toHaveLength(1);
  });

  it('returns bookmarks below a selected folder', () => {
    expect(getFolderDescendantBookmarks(tree, '4').map((bookmark) => bookmark.title)).toEqual(['React']);
    expect(getFolderDescendantBookmarks(tree, null)).toHaveLength(3);
  });
});
