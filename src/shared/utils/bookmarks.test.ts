import { describe, expect, it } from 'vitest';
import type { BookmarkNode } from '../types';
import { calculateBookmarkStats, searchBookmarks } from './bookmarks';

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
});
