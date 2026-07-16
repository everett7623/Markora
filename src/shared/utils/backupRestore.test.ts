import { describe, expect, it } from 'vitest';
import type { BookmarkNode } from '../types';
import { collectFolderRestoreEntries, getMissingBookmarkRestoreItems } from './backupRestore';

const current: BookmarkNode[] = [{
  id: '0',
  title: '',
  children: [{
    id: '1',
    title: 'Bookmarks Bar',
    parentId: '0',
    children: [
      {
        id: '10',
        title: 'Work',
        parentId: '1',
        children: [{ id: '101', title: 'GitHub', url: 'https://github.com', parentId: '10' }]
      },
      {
        id: '30',
        title: 'Archive',
        parentId: '1',
        children: [{ id: '301', title: 'Saved', url: 'https://archive.test', parentId: '30' }]
      }
    ]
  }]
}];

const snapshot: BookmarkNode[] = [{
  id: '0',
  title: '',
  children: [{
    id: '1',
    title: 'Bookmarks Bar',
    parentId: '0',
    children: [
      {
        id: '10',
        title: 'Work',
        parentId: '1',
        children: [
          { id: '201', title: 'GitHub', url: 'https://github.com', parentId: '10' },
          { id: '202', title: 'GitHub copy', url: 'https://github.com', parentId: '10' },
          { id: '203', title: 'MDN', url: 'https://developer.mozilla.org', parentId: '10' }
        ]
      },
      {
        id: '20',
        title: 'Archive',
        parentId: '1',
        children: [{ id: '204', title: 'Saved before', url: 'https://archive.test', parentId: '20' }]
      }
    ]
  }]
}];

describe('backup restore planning', () => {
  it('skips the synthetic root and retains real folder paths', () => {
    expect(collectFolderRestoreEntries(current)).toEqual([
      { id: '1', path: ['Bookmarks Bar'] },
      { id: '10', path: ['Bookmarks Bar', 'Work'] },
      { id: '30', path: ['Bookmarks Bar', 'Archive'] }
    ]);
  });

  it('restores only unmatched URL occurrences and falls back from stale parent IDs to paths', () => {
    expect(getMissingBookmarkRestoreItems(current, snapshot)).toEqual([
      { title: 'GitHub copy', url: 'https://github.com', path: ['Bookmarks Bar', 'Work'], parentId: '10' },
      { title: 'MDN', url: 'https://developer.mozilla.org', path: ['Bookmarks Bar', 'Work'], parentId: '10' }
    ]);
  });
});
