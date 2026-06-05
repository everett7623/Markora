import type { BookmarkNode, Result } from '../shared/types';

export const bookmarkService = {
  async getTree(): Promise<Result<BookmarkNode[]>> {
    try {
      const tree = await chrome.bookmarks.getTree();
      return { success: true, data: tree as BookmarkNode[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to read bookmarks.' };
    }
  }
};
