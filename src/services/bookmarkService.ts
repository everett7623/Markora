import type { BookmarkNode, ImportBookmarkItem, Result } from '../shared/types';

function createImportedMockTree(items: ImportBookmarkItem[]): BookmarkNode[] {
  const roots = new Map<string, BookmarkNode>();
  const topLevelNodes: BookmarkNode[] = [];

  const getFolder = (title: string, parent?: BookmarkNode): BookmarkNode => {
    const path = [...(parent?.path ?? []), title];
    const key = path.join('\u0000');
    const existing = roots.get(key);
    if (existing) return existing;

    const folder: BookmarkNode = {
      id: `imported-folder-${key || 'root'}`,
      title,
      parentId: parent?.id,
      path,
      children: []
    };
    roots.set(key, folder);
    if (parent) parent.children = [...((parent.children as BookmarkNode[] | undefined) ?? []), folder];
    else topLevelNodes.push(folder);
    return folder;
  };

  items.forEach((item, index) => {
    let parent: BookmarkNode | undefined;
    for (const folderTitle of item.path) {
      parent = getFolder(folderTitle, parent);
    }
    const bookmark: BookmarkNode = {
      id: `imported-${Date.now()}-${index}`,
      title: item.title,
      url: item.url,
      parentId: parent?.id,
      dateAdded: item.dateAdded,
      path: [...item.path, item.title]
    };
    if (parent) parent.children = [...((parent.children as BookmarkNode[] | undefined) ?? []), bookmark];
    else topLevelNodes.push(bookmark);
  });

  return topLevelNodes;
}

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
  },

  async updateTitle(id: string, title: string): Promise<Result<BookmarkNode>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: { id, title } };
      }

      const updated = await chrome.bookmarks.update(id, { title });
      return { success: true, data: updated as BookmarkNode };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to rename bookmark.' };
    }
  },

  async updateUrl(id: string, url: string): Promise<Result<BookmarkNode>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: { id, title: '', url } };
      }

      const updated = await chrome.bookmarks.update(id, { url });
      return { success: true, data: updated as BookmarkNode };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to update bookmark URL.' };
    }
  },

  async moveMany(ids: string[], parentId: string): Promise<Result<string[]>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: ids };
      }

      await Promise.all(ids.map((id) => chrome.bookmarks.move(id, { parentId })));
      return { success: true, data: ids };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to move bookmarks.' };
    }
  },

  async moveOne(id: string, parentId: string | undefined, index: number): Promise<Result<string>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: id };
      }

      await chrome.bookmarks.move(id, { parentId, index });
      return { success: true, data: id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to reorder bookmark.' };
    }
  },

  async mergeFolders(sourceIds: string[], targetId: string): Promise<Result<string[]>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: sourceIds };
      }

      for (const sourceId of sourceIds) {
        if (sourceId === targetId) continue;
        const children = await chrome.bookmarks.getChildren(sourceId);
        for (const child of children) {
          await chrome.bookmarks.move(child.id, { parentId: targetId });
        }
        await chrome.bookmarks.remove(sourceId);
      }
      return { success: true, data: sourceIds };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to merge folders.' };
    }
  },

  async restoreMany(bookmarks: BookmarkNode[]): Promise<Result<number>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: bookmarks.length };
      }

      await Promise.all(
        bookmarks.map((bookmark) =>
          chrome.bookmarks.create({
            parentId: bookmark.parentId,
            title: bookmark.title,
            url: bookmark.url,
            index: bookmark.index
          })
        )
      );
      return { success: true, data: bookmarks.length };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to restore bookmarks.' };
    }
  },

  async createMany(items: ImportBookmarkItem[]): Promise<Result<BookmarkNode[]>> {
    try {
      if (!globalThis.chrome?.bookmarks) {
        return { success: true, data: createImportedMockTree(items) };
      }

      const folderByPath = new Map<string, chrome.bookmarks.BookmarkTreeNode>();
      const created: chrome.bookmarks.BookmarkTreeNode[] = [];
      for (const item of items) {
        let parentId: string | undefined;
        const path: string[] = [];
        for (const folderTitle of item.path) {
          path.push(folderTitle);
          const key = path.join('\u0000');
          let folder = folderByPath.get(key);
          if (!folder) {
            folder = await chrome.bookmarks.create({ parentId, title: folderTitle });
            folderByPath.set(key, folder);
            created.push(folder);
          }
          parentId = folder.id;
        }
        const bookmark = await chrome.bookmarks.create({ parentId, title: item.title, url: item.url });
        created.push(bookmark);
      }
      return { success: true, data: created as BookmarkNode[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to import bookmarks.' };
    }
  }
};
