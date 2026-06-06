import { create } from 'zustand';
import { backupService } from '../services/backupService';
import { bookmarkService } from '../services/bookmarkService';
import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../shared/constants/storage';
import type { BackupRecord, BookmarkNode, BookmarkStats, ImportConflictStrategy, ImportPreview, RecentActivity } from '../shared/types';
import {
  annotateBookmarkPaths,
  calculateBookmarkStats,
  collectBookmarkNodesByIds,
  findNodeParent,
  isDescendantNode,
  mergeFolderNodes,
  moveBookmarkNodes,
  reorderNodeBefore,
  removeBookmarkNodes,
  searchBookmarks,
  updateBookmarkNodeTitle,
  updateBookmarkNodeUrl
} from '../shared/utils/bookmarks';

type DeletedSnapshot = {
  bookmarksBeforeDelete: BookmarkNode[];
  deletedBookmarks: BookmarkNode[];
};

interface BookmarkStore {
  bookmarks: BookmarkNode[];
  searchQuery: string;
  searchResults: BookmarkNode[];
  recentSearches: string[];
  recentActivities: RecentActivity[];
  backups: BackupRecord[];
  tagsByBookmarkId: Record<string, string[]>;
  tagFilter: string | null;
  lastDeletedSnapshot: DeletedSnapshot | null;
  stats: BookmarkStats;
  loading: boolean;
  mutating: boolean;
  error: string | null;
  load: () => Promise<void>;
  loadBackups: () => Promise<void>;
  setSearchQuery: (query: string) => Promise<void>;
  deleteBookmarks: (ids: string[]) => Promise<void>;
  renameBookmark: (id: string, title: string) => Promise<void>;
  updateBookmarkUrl: (id: string, url: string) => Promise<void>;
  renameFolder: (id: string, title: string) => Promise<void>;
  moveBookmarks: (ids: string[], parentId: string) => Promise<void>;
  moveFolders: (ids: string[], parentId: string) => Promise<void>;
  mergeFolders: (sourceIds: string[], targetId: string) => Promise<void>;
  reorderBookmarkBefore: (id: string, beforeId: string) => Promise<void>;
  undoLastDelete: () => Promise<void>;
  setBookmarkTags: (id: string, tags: string[]) => Promise<void>;
  setTagFilter: (tag: string | null) => void;
  importBookmarks: (preview: ImportPreview, strategy: ImportConflictStrategy) => Promise<void>;
  restoreBackup: (id: string) => Promise<void>;
  deleteBackup: (id: string) => Promise<void>;
  addActivity: (activity: Omit<RecentActivity, 'id' | 'createdAt'>) => Promise<void>;
}

function createActivity(activity: Omit<RecentActivity, 'id' | 'createdAt'>): RecentActivity {
  return {
    ...activity,
    id: crypto.randomUUID(),
    createdAt: Date.now()
  };
}

async function saveSearchHistory(recentSearches: string[]) {
  await storageService.set(STORAGE_KEYS.searchHistory, recentSearches);
}

async function saveActivities(recentActivities: RecentActivity[]) {
  await storageService.set(STORAGE_KEYS.recentActivities, recentActivities);
}

async function saveTags(tagsByBookmarkId: Record<string, string[]>) {
  await storageService.set(STORAGE_KEYS.bookmarkTags, tagsByBookmarkId);
}

function withLocalTags(bookmarks: BookmarkNode[], tagsByBookmarkId: Record<string, string[]>): BookmarkNode[] {
  return bookmarks.map((bookmark) => ({
    ...bookmark,
    tags: bookmark.url ? tagsByBookmarkId[bookmark.id] ?? [] : bookmark.tags,
    children: bookmark.children ? withLocalTags(bookmark.children as BookmarkNode[], tagsByBookmarkId) : undefined
  }));
}

function applyBookmarks(bookmarks: BookmarkNode[], query: string, tagsByBookmarkId: Record<string, string[]>, tagFilter: string | null) {
  const taggedBookmarks = annotateBookmarkPaths(withLocalTags(bookmarks, tagsByBookmarkId));
  const searchResults = searchBookmarks(taggedBookmarks, query).filter((bookmark) => !tagFilter || bookmark.tags?.includes(tagFilter));

  return {
    bookmarks: taggedBookmarks,
    searchResults,
    stats: calculateBookmarkStats(taggedBookmarks)
  };
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
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
  error: null,
  load: async () => {
    set({ loading: true, error: null });
    const [storedSearches, storedActivities, storedTags] = await Promise.all([
      storageService.get<string[]>(STORAGE_KEYS.searchHistory),
      storageService.get<RecentActivity[]>(STORAGE_KEYS.recentActivities),
      storageService.get<Record<string, string[]>>(STORAGE_KEYS.bookmarkTags)
    ]);
    const storedBackups = await backupService.list();
    const result = await bookmarkService.getTree();
    if (!result.success) {
      set({ error: result.error, loading: false });
      return;
    }

    const tagsByBookmarkId = storedTags.success ? (storedTags.data?.data ?? {}) : {};
    const bookmarks = applyBookmarks(result.data, '', tagsByBookmarkId, get().tagFilter).bookmarks;
    const recentSearches = storedSearches.success ? (storedSearches.data?.data ?? []).slice(0, 10) : [];
    const recentActivities = storedActivities.success ? (storedActivities.data?.data ?? []).slice(0, 10) : [];
    set({
      bookmarks,
      searchResults: searchBookmarks(bookmarks, ''),
      stats: calculateBookmarkStats(bookmarks),
      recentSearches,
      recentActivities,
      backups: storedBackups.success ? storedBackups.data : [],
      tagsByBookmarkId,
      loading: false
    });
    await get().addActivity({ type: 'load', message: `Loaded ${calculateBookmarkStats(bookmarks).totalBookmarks} bookmarks` });
  },
  loadBackups: async () => {
    const backups = await backupService.list();
    if (!backups.success) {
      set({ error: backups.error });
      return;
    }
    set({ backups: backups.data });
  },
  setSearchQuery: async (query) => {
    let nextSearches: string[] = [];
    set((state) => {
      const trimmed = query.trim();
      const recentSearches = trimmed
        ? [trimmed, ...state.recentSearches.filter((item) => item !== trimmed)].slice(0, 10)
        : state.recentSearches;
      nextSearches = recentSearches;

      return {
        searchQuery: query,
        searchResults: searchBookmarks(state.bookmarks, query).filter((bookmark) => !state.tagFilter || bookmark.tags?.includes(state.tagFilter)),
        recentSearches
      };
    });
    const trimmed = query.trim();
    if (trimmed) {
      await saveSearchHistory(nextSearches);
      await get().addActivity({ type: 'search', message: `Searched "${trimmed}"` });
    }
  },
  deleteBookmarks: async (ids) => {
    if (ids.length === 0) return;

    set({ mutating: true, error: null });
    const currentBookmarks = useBookmarkStore.getState().bookmarks;
    const idsSet = new Set(ids);
    const deletedBookmarks = collectBookmarkNodesByIds(currentBookmarks, idsSet);
    const backup = await backupService.create(currentBookmarks, 'delete');
    if (!backup.success) {
      set({ error: backup.error, mutating: false });
      return;
    }
    set((state) => ({ backups: [backup.data, ...state.backups].slice(0, 10) }));

    const deleted = await bookmarkService.removeMany(ids);
    if (!deleted.success) {
      set({ error: deleted.error, mutating: false });
      return;
    }

    set((state) => {
      const next = applyBookmarks(removeBookmarkNodes(state.bookmarks, idsSet), state.searchQuery, state.tagsByBookmarkId, state.tagFilter);
      return {
        ...next,
        lastDeletedSnapshot: { bookmarksBeforeDelete: currentBookmarks, deletedBookmarks },
        mutating: false
      };
    });
    await get().addActivity({ type: 'delete', message: `Deleted ${ids.length} bookmark${ids.length === 1 ? '' : 's'}` });
  },
  renameBookmark: async (id, title) => {
    const normalized = title.trim();
    if (!normalized) return;

    set({ mutating: true, error: null });
    const renamed = await bookmarkService.updateTitle(id, normalized);
    if (!renamed.success) {
      set({ error: renamed.error, mutating: false });
      return;
    }

    set((state) => ({ ...applyBookmarks(updateBookmarkNodeTitle(state.bookmarks, id, normalized), state.searchQuery, state.tagsByBookmarkId, state.tagFilter), mutating: false }));
    await get().addActivity({ type: 'rename', message: `Renamed bookmark to "${normalized}"` });
  },
  updateBookmarkUrl: async (id, url) => {
    const normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      set({ error: 'Bookmark URL must start with http:// or https://.' });
      return;
    }

    set({ mutating: true, error: null });
    const updated = await bookmarkService.updateUrl(id, normalized);
    if (!updated.success) {
      set({ error: updated.error, mutating: false });
      return;
    }

    set((state) => ({
      ...applyBookmarks(updateBookmarkNodeUrl(state.bookmarks, id, normalized), state.searchQuery, state.tagsByBookmarkId, state.tagFilter),
      mutating: false
    }));
    await get().addActivity({ type: 'rename', message: `Updated bookmark URL to "${normalized}"` });
  },
  moveBookmarks: async (ids, parentId) => {
    const movableIds = ids.filter((id) => id !== parentId && !isDescendantNode(get().bookmarks, id, parentId));
    if (movableIds.length === 0) return;

    set({ mutating: true, error: null });
    const moved = await bookmarkService.moveMany(movableIds, parentId);
    if (!moved.success) {
      set({ error: moved.error, mutating: false });
      return;
    }

    set((state) => ({ ...applyBookmarks(moveBookmarkNodes(state.bookmarks, new Set(movableIds), parentId), state.searchQuery, state.tagsByBookmarkId, state.tagFilter), mutating: false }));
    await get().addActivity({ type: 'move', message: `Moved ${movableIds.length} item${movableIds.length === 1 ? '' : 's'}` });
  },
  renameFolder: async (id, title) => {
    await get().renameBookmark(id, title);
  },
  moveFolders: async (ids, parentId) => {
    await get().moveBookmarks(ids, parentId);
  },
  mergeFolders: async (sourceIds, targetId) => {
    const validSourceIds = sourceIds.filter((id) => id !== targetId);
    if (validSourceIds.length === 0) return;

    set({ mutating: true, error: null });
    const currentBookmarks = get().bookmarks;
    const backup = await backupService.create(currentBookmarks, 'merge');
    if (!backup.success) {
      set({ error: backup.error, mutating: false });
      return;
    }
    set((state) => ({ backups: [backup.data, ...state.backups].slice(0, 10) }));

    const merged = await bookmarkService.mergeFolders(validSourceIds, targetId);
    if (!merged.success) {
      set({ error: merged.error, mutating: false });
      return;
    }

    set((state) => ({
      ...applyBookmarks(mergeFolderNodes(state.bookmarks, new Set(validSourceIds), targetId), state.searchQuery, state.tagsByBookmarkId, state.tagFilter),
      mutating: false
    }));
    await get().addActivity({ type: 'merge', message: `Merged ${validSourceIds.length} folder${validSourceIds.length === 1 ? '' : 's'}` });
  },
  reorderBookmarkBefore: async (id, beforeId) => {
    if (id === beforeId) return;
    const target = findNodeParent(get().bookmarks, beforeId);
    if (!target) return;

    set({ mutating: true, error: null });
    const moved = await bookmarkService.moveOne(id, target.parentId, target.index);
    if (!moved.success) {
      set({ error: moved.error, mutating: false });
      return;
    }

    set((state) => {
      const source = findNodeParent(state.bookmarks, id);
      const movedTree = source?.parentId === target.parentId || !target.parentId ? state.bookmarks : moveBookmarkNodes(state.bookmarks, new Set([id]), target.parentId);
      return { ...applyBookmarks(reorderNodeBefore(movedTree, id, beforeId), state.searchQuery, state.tagsByBookmarkId, state.tagFilter), mutating: false };
    });
    await get().addActivity({ type: 'move', message: 'Reordered bookmark' });
  },
  undoLastDelete: async () => {
    const snapshot = get().lastDeletedSnapshot;
    if (!snapshot) return;

    set({ mutating: true, error: null });
    const restored = await bookmarkService.restoreMany(snapshot.deletedBookmarks);
    if (!restored.success) {
      set({ error: restored.error, mutating: false });
      return;
    }

    set((state) => ({
      ...applyBookmarks(snapshot.bookmarksBeforeDelete, state.searchQuery, state.tagsByBookmarkId, state.tagFilter),
      lastDeletedSnapshot: null,
      mutating: false
    }));
    await get().addActivity({ type: 'undo', message: `Restored ${snapshot.deletedBookmarks.length} bookmark${snapshot.deletedBookmarks.length === 1 ? '' : 's'}` });
  },
  setBookmarkTags: async (id, tags) => {
    const normalizedTags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 8);
    const tagsByBookmarkId = { ...get().tagsByBookmarkId, [id]: normalizedTags };
    set((state) => ({
      tagsByBookmarkId,
      ...applyBookmarks(state.bookmarks, state.searchQuery, tagsByBookmarkId, state.tagFilter)
    }));
    await saveTags(tagsByBookmarkId);
    await get().addActivity({ type: 'tag', message: `Updated tags for bookmark` });
  },
  setTagFilter: (tag) => {
    set((state) => ({
      tagFilter: tag,
      searchResults: searchBookmarks(state.bookmarks, state.searchQuery).filter((bookmark) => !tag || bookmark.tags?.includes(tag))
    }));
  },
  importBookmarks: async (preview, strategy) => {
    const conflictUrls = new Set(preview.conflicts.map((conflict) => conflict.imported.url));
    const items = strategy === 'skip' ? preview.items.filter((item) => !conflictUrls.has(item.url)) : preview.items;
    if (items.length === 0) return;

    set({ mutating: true, error: null });
    const currentBookmarks = get().bookmarks;
    const backup = await backupService.create(currentBookmarks, 'import');
    if (!backup.success) {
      set({ error: backup.error, mutating: false });
      return;
    }
    set((state) => ({ backups: [backup.data, ...state.backups].slice(0, 10) }));

    const created = await bookmarkService.createMany(items);
    if (!created.success) {
      set({ error: created.error, mutating: false });
      return;
    }

    set((state) => {
      const [firstRoot, ...restRoots] = state.bookmarks;
      const nextRoots = firstRoot
        ? [{ ...firstRoot, children: [...((firstRoot.children as BookmarkNode[] | undefined) ?? []), ...created.data] }, ...restRoots]
        : created.data;
      return {
        ...applyBookmarks(nextRoots, state.searchQuery, state.tagsByBookmarkId, state.tagFilter),
        mutating: false
      };
    });
    await get().addActivity({ type: 'import', message: `Imported ${items.length} bookmark${items.length === 1 ? '' : 's'}` });
  },
  restoreBackup: async (id) => {
    const target = get().backups.find((backup) => backup.id === id);
    if (!target) return;

    set({ mutating: true, error: null });
    const safetyBackup = await backupService.create(get().bookmarks, 'restore');
    if (!safetyBackup.success) {
      set({ error: safetyBackup.error, mutating: false });
      return;
    }

    const restored = await bookmarkService.restoreMany(searchBookmarks(target.bookmarks, ''));
    if (!restored.success) {
      set({ error: restored.error, mutating: false });
      return;
    }

    set((state) => ({
      ...applyBookmarks(target.bookmarks, state.searchQuery, state.tagsByBookmarkId, state.tagFilter),
      backups: [safetyBackup.data, ...state.backups].slice(0, 10),
      mutating: false
    }));
    await get().addActivity({ type: 'restore', message: `Restored backup from ${new Date(target.createdAt).toLocaleDateString()}` });
  },
  deleteBackup: async (id) => {
    const removed = await backupService.remove(id);
    if (!removed.success) {
      set({ error: removed.error });
      return;
    }
    set((state) => ({ backups: state.backups.filter((backup) => backup.id !== id) }));
  },
  addActivity: async (activity) => {
    const recentActivities = [createActivity(activity), ...get().recentActivities].slice(0, 10);
    set({ recentActivities });
    await saveActivities(recentActivities);
  }
}));
