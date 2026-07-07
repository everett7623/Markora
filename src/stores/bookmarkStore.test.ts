import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../shared/constants/storage';
import i18n from '../shared/i18n';
import { BackupRecord, BookmarkNode, RecentActivity } from '../shared/types';
import { storageService } from '../services/storageService';
import { bookmarkService } from '../services/bookmarkService';
import { useBookmarkStore } from './bookmarkStore';

describe('bookmarkStore', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    useBookmarkStore.setState({
      bookmarks: [],
      searchQuery: '',
      searchResults: [],
      recentSearches: [],
      recentActivities: [],
      backups: [],
      tagsByBookmarkId: {},
      tagFilter: null,
      lastDeletedSnapshot: null,
      stats: { totalBookmarks: 0, totalFolders: 0, duplicateBookmarks: 0, invalidLinks: 0 },
      loading: false,
      mutating: false,
      error: null
    });
    await storageService.set(STORAGE_KEYS.searchHistory, []);
    await storageService.set(STORAGE_KEYS.recentActivities, []);
    await storageService.set(STORAGE_KEYS.bookmarkTags, {});
    await storageService.set(STORAGE_KEYS.backups, []);
  });

  it('persists recent search history', async () => {
    await useBookmarkStore.getState().load();

    await useBookmarkStore.getState().setSearchQuery('react');
    await useBookmarkStore.getState().setSearchQuery('github');
    await useBookmarkStore.getState().setSearchQuery('react');

    expect(useBookmarkStore.getState().recentSearches.slice(0, 2)).toEqual(['react', 'github']);

    const stored = await storageService.get<string[]>(STORAGE_KEYS.searchHistory);
    expect(stored.success).toBe(true);
    if (stored.success) {
      expect(stored.data?.data.slice(0, 2)).toEqual(['react', 'github']);
    }
  });

  it('records recent activity for bookmark actions', async () => {
    const message = i18n.t('activity.deletedBookmarks', { count: 2, suffix: 's' });
    await useBookmarkStore.getState().addActivity({ type: 'delete', message });

    expect(useBookmarkStore.getState().recentActivities[0].message).toBe(message);

    const stored = await storageService.get<RecentActivity[]>(STORAGE_KEYS.recentActivities);
    expect(stored.success).toBe(true);
    if (stored.success) {
      expect(stored.data?.data[0].message).toBe(message);
    }
  });

  it('renames bookmarks in local state through the service boundary', async () => {
    await useBookmarkStore.getState().load();

    await useBookmarkStore.getState().renameBookmark('101', 'GitHub Home');

    expect(useBookmarkStore.getState().searchResults.find((bookmark) => bookmark.id === '101')?.title).toBe('GitHub Home');
  });

  it('updates bookmark URLs through the service boundary', async () => {
    await useBookmarkStore.getState().load();

    await useBookmarkStore.getState().updateBookmarkUrl('101', 'https://github.com/new');

    expect(useBookmarkStore.getState().searchResults.find((bookmark) => bookmark.id === '101')?.url).toBe('https://github.com/new');
  });

  it('moves selected bookmarks and supports undo after delete', async () => {
    await useBookmarkStore.getState().load();

    await useBookmarkStore.getState().moveBookmarks(['101'], '2');
    expect(useBookmarkStore.getState().bookmarks[1].children?.map((node) => node.id)).toContain('101');

    await useBookmarkStore.getState().deleteBookmarks(['101']);
    expect(useBookmarkStore.getState().searchResults.some((bookmark) => bookmark.id === '101')).toBe(false);

    await useBookmarkStore.getState().undoLastDelete();
    expect(useBookmarkStore.getState().searchResults.some((bookmark) => bookmark.id === '101')).toBe(true);
  });

  it('renames folders, moves folders, and reorders bookmarks', async () => {
    await useBookmarkStore.getState().load();

    await useBookmarkStore.getState().renameFolder('10', 'Renamed Work');
    expect(useBookmarkStore.getState().bookmarks[0].children?.[0].title).toBe('Renamed Work');

    await useBookmarkStore.getState().moveFolders(['10'], '2');
    expect(useBookmarkStore.getState().bookmarks[1].children?.some((node) => node.id === '10')).toBe(true);

    await useBookmarkStore.getState().reorderBookmarkBefore('103', '101');
    const movedFolder = useBookmarkStore.getState().bookmarks[1].children?.find((node) => node.id === '10');
    expect(movedFolder?.children?.slice(0, 2).map((node) => node.id)).toEqual(['103', '101']);
  });

  it('merges duplicate folders after creating a backup', async () => {
    useBookmarkStore.setState({
      bookmarks: [
        {
          id: 'root',
          title: 'Root',
          children: [
            { id: 'target', title: 'Work', parentId: 'root', children: [{ id: 'a', title: 'A', url: 'https://a.test', parentId: 'target' }] },
            { id: 'source', title: 'Work', parentId: 'root', children: [{ id: 'b', title: 'B', url: 'https://b.test', parentId: 'source' }] }
          ]
        }
      ]
    });

    await useBookmarkStore.getState().mergeFolders(['source'], 'target');

    expect(useBookmarkStore.getState().searchResults.map((bookmark) => bookmark.id)).toEqual(['a', 'b']);
    expect(useBookmarkStore.getState().backups[0].reason).toBe('merge');
  });

  it('persists tags and filters bookmarks by tag', async () => {
    await useBookmarkStore.getState().load();

    await useBookmarkStore.getState().setBookmarkTags('101', ['work', 'docs', 'work']);
    useBookmarkStore.getState().setTagFilter('work');

    expect(useBookmarkStore.getState().searchResults.map((bookmark) => bookmark.id)).toEqual(['101']);

    const stored = await storageService.get<Record<string, string[]>>(STORAGE_KEYS.bookmarkTags);
    expect(stored.success).toBe(true);
    if (stored.success) {
      expect(stored.data?.data['101']).toEqual(['work', 'docs']);
    }
  });

  it('imports new bookmarks after creating a backup', async () => {
    await useBookmarkStore.getState().load();

    await useBookmarkStore.getState().importBookmarks(
      {
        items: [
          { title: 'Existing GitHub', url: 'https://github.com', path: [] },
          { title: 'New Import', url: 'https://import.test', path: ['Imported'] }
        ],
        conflicts: [
          {
            imported: { title: 'Existing GitHub', url: 'https://github.com', path: [] },
            existing: useBookmarkStore.getState().searchResults.find((bookmark) => bookmark.url === 'https://github.com')!
          }
        ]
      },
      'skip'
    );

    const imported = useBookmarkStore.getState().searchResults.find((bookmark) => bookmark.url === 'https://import.test');
    expect(imported?.path?.join(' / ')).toContain('Imported / New Import');
    expect(useBookmarkStore.getState().searchResults.filter((bookmark) => bookmark.url === 'https://github.com')).toHaveLength(2);

    const backups = await storageService.get<BackupRecord[]>(STORAGE_KEYS.backups);
    expect(backups.success).toBe(true);
    if (backups.success) {
      expect(backups.data?.data[0].reason).toBe('import');
    }
  });

  it('loads, restores, and deletes backups', async () => {
    // The backup contains only one bookmark (https://restore.test)
    const backupBookmarks: BookmarkNode[] = [
      {
        id: 'root',
        title: 'Backup Root',
        children: [{ id: 'backup-bookmark', title: 'Restored', url: 'https://restore.test', parentId: 'root' }]
      }
    ];
    const backup: BackupRecord = {
      id: 'backup-1',
      reason: 'delete',
      createdAt: Date.now(),
      bookmarks: backupBookmarks
    };
    await storageService.set(STORAGE_KEYS.backups, [backup]);

    // Load the store — this populates bookmarks with the mock tree (GitHub, MDN, etc.)
    await useBookmarkStore.getState().load();
    await useBookmarkStore.getState().loadBackups();

    expect(useBookmarkStore.getState().backups).toHaveLength(1);

    // Capture the IDs present before restore (the "current" bookmarks that should be removed)
    const currentBookmarks = useBookmarkStore.getState().bookmarks;
    const expectedRemovedIds = currentBookmarks
      .flatMap((root) => (root.children ?? []) as BookmarkNode[])
      .flatMap((node) => [node.id, ...((node.children ?? []) as BookmarkNode[]).map((child) => child.id)]);

    // Mock removeMany to succeed and capture what IDs it was called with
    const removeManyMock = vi.spyOn(bookmarkService, 'removeMany').mockResolvedValue({ success: true, data: expectedRemovedIds });

    // Mock getTree to return a fresh tree containing only the backup bookmarks
    const freshTree: BookmarkNode[] = [
      {
        id: 'root',
        title: 'Backup Root',
        children: [{ id: 'backup-bookmark', title: 'Restored', url: 'https://restore.test', parentId: 'root' }]
      }
    ];
    const getTreeMock = vi.spyOn(bookmarkService, 'getTree').mockResolvedValue({ success: true, data: freshTree });

    await useBookmarkStore.getState().restoreBackup('backup-1');

    // removeMany must have been called to clear prior bookmarks before restoring
    expect(removeManyMock).toHaveBeenCalledOnce();
    const removedIds: string[] = removeManyMock.mock.calls[0][0];
    expect(removedIds.length).toBeGreaterThan(0);
    // All removed IDs should come from the bookmarks that existed before restore
    for (const id of removedIds) {
      expect(expectedRemovedIds).toContain(id);
    }

    // getTree must have been called to reload from Chrome API after restore
    expect(getTreeMock).toHaveBeenCalledOnce();

    // The store should contain only the backup bookmark — no duplicates from prior state
    const resultUrls = useBookmarkStore.getState().searchResults.map((b) => b.url);
    expect(resultUrls).toEqual(['https://restore.test']);
    // Prior-state URLs must not appear
    expect(resultUrls).not.toContain('https://github.com');
    expect(resultUrls).not.toContain('https://developer.mozilla.org');
    expect(resultUrls).not.toContain('https://react.dev');

    // A safety backup with reason 'restore' should have been prepended
    expect(useBookmarkStore.getState().backups[0].reason).toBe('restore');

    await useBookmarkStore.getState().deleteBackup('backup-1');

    expect(useBookmarkStore.getState().backups.some((item) => item.id === 'backup-1')).toBe(false);
  });
});
