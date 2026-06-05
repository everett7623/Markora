import type { BookmarkNode, Result } from '../shared/types';

export const exportService = {
  toJson(bookmarks: BookmarkNode[]): Result<string> {
    return { success: true, data: JSON.stringify(bookmarks, null, 2) };
  }
};
