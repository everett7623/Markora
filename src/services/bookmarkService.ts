import type { BookmarkNode, Result } from '../shared/types';

const mockBookmarks: BookmarkNode[] = [
  {
    id: '1',
    title: 'Bookmarks Bar',
    children: [
      {
        id: '10',
        title: 'Work',
        parentId: '1',
        children: [
          { id: '101', title: 'GitHub', url: 'https://github.com', parentId: '10' },
          { id: '102', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', parentId: '10' },
          { id: '103', title: 'GitHub Duplicate', url: 'https://github.com', parentId: '10' }
        ]
      },
      { id: '11', title: 'Empty Folder', parentId: '1', children: [] }
    ]
  },
  {
    id: '2',
    title: 'Other Bookmarks',
    children: [{ id: '201', title: 'React', url: 'https://react.dev', parentId: '2' }]
  }
];

export const bookmarkService = {
  async getTree(): Promise<Result<BookmarkNode[]>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: mockBookmarks };
      }

      const tree = await chrome.bookmarks.getTree();
      return { success: true, data: tree as BookmarkNode[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to read bookmarks.' };
    }
  },

  async removeMany(ids: string[]): Promise<Result<string[]>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: ids };
      }

      await Promise.all(ids.map((id) => chrome.bookmarks.remove(id)));
      return { success: true, data: ids };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to delete bookmarks.' };
    }
  }
};
