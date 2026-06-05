import { create } from 'zustand';
import { bookmarkService } from '../services/bookmarkService';
import type { BookmarkNode, BookmarkStats } from '../shared/types';
import { annotateBookmarkPaths, calculateBookmarkStats, searchBookmarks } from '../shared/utils/bookmarks';

interface BookmarkStore {
  bookmarks: BookmarkNode[];
  searchQuery: string;
  searchResults: BookmarkNode[];
  recentSearches: string[];
  stats: BookmarkStats;
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  searchQuery: '',
  searchResults: [],
  recentSearches: [],
  stats: { totalBookmarks: 0, totalFolders: 0, duplicateBookmarks: 0, invalidLinks: 0 },
  loading: false,
  error: null,
  load: async () => {
    set({ loading: true, error: null });
    const result = await bookmarkService.getTree();
    if (!result.success) {
      set({ error: result.error, loading: false });
      return;
    }

    const bookmarks = annotateBookmarkPaths(result.data);
    set({
      bookmarks,
      searchResults: searchBookmarks(bookmarks, ''),
      stats: calculateBookmarkStats(bookmarks),
      loading: false
    });
  },
  setSearchQuery: (query) => {
    set((state) => {
      const trimmed = query.trim();
      const recentSearches = trimmed
        ? [trimmed, ...state.recentSearches.filter((item) => item !== trimmed)].slice(0, 10)
        : state.recentSearches;

      return {
        searchQuery: query,
        searchResults: searchBookmarks(state.bookmarks, query),
        recentSearches
      };
    });
  }
}));
