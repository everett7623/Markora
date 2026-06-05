import { create } from 'zustand';
import { bookmarkService } from '../services/bookmarkService';
import type { BookmarkNode } from '../shared/types';

interface BookmarkStore {
  bookmarks: BookmarkNode[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  loading: false,
  error: null,
  load: async () => {
    set({ loading: true, error: null });
    const result = await bookmarkService.getTree();
    set(result.success ? { bookmarks: result.data, loading: false } : { error: result.error, loading: false });
  }
}));
