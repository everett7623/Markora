import type { BookmarkNode, ScanResult, ScanWorkerRequest, ScanWorkerResponse } from '../shared/types';

function flattenBookmarks(nodes: BookmarkNode[]): BookmarkNode[] {
  const bookmarks: BookmarkNode[] = [];

  const visit = (currentNodes: BookmarkNode[]) => {
    for (const node of currentNodes) {
      if (node.url) bookmarks.push(node);
      if (node.children) visit(node.children as BookmarkNode[]);
    }
  };

  visit(nodes);
  return bookmarks;
}

function flattenFolders(nodes: BookmarkNode[]): BookmarkNode[] {
  const folders: BookmarkNode[] = [];

  const visit = (currentNodes: BookmarkNode[]) => {
    for (const node of currentNodes) {
      if (node.children) {
        folders.push(node);
        visit(node.children as BookmarkNode[]);
      }
    }
  };

  visit(nodes);
  return folders;
}

function findDuplicateBookmarkGroups(bookmarks: BookmarkNode[]): BookmarkNode[][] {
  const byUrl = new Map<string, BookmarkNode[]>();

  for (const bookmark of bookmarks) {
    if (!bookmark.url) continue;
    byUrl.set(bookmark.url, [...(byUrl.get(bookmark.url) ?? []), bookmark]);
  }

  return [...byUrl.values()].filter((group) => group.length > 1);
}

function findDuplicateFolderGroups(folders: BookmarkNode[]): BookmarkNode[][] {
  const byParentAndTitle = new Map<string, BookmarkNode[]>();

  for (const folder of folders) {
    const key = `${folder.parentId ?? 'root'}::${folder.title.trim().toLowerCase()}`;
    byParentAndTitle.set(key, [...(byParentAndTitle.get(key) ?? []), folder]);
  }

  return [...byParentAndTitle.values()].filter((group) => group.length > 1);
}

function findEmptyFolders(folders: BookmarkNode[]): BookmarkNode[] {
  return folders.filter((folder) => (folder.children ?? []).length === 0);
}

self.onmessage = (event: MessageEvent<ScanWorkerRequest>) => {
  if (event.data.type !== 'scan') return;

  self.postMessage({ type: 'progress', progress: 15 } satisfies ScanWorkerResponse);
  const bookmarks = flattenBookmarks(event.data.bookmarks);

  self.postMessage({ type: 'progress', progress: 45 } satisfies ScanWorkerResponse);
  const folders = flattenFolders(event.data.bookmarks);

  self.postMessage({ type: 'progress', progress: 75 } satisfies ScanWorkerResponse);
  const response: ScanWorkerResponse = {
    type: 'complete',
    progress: 100,
    result: {
      duplicateBookmarkGroups: findDuplicateBookmarkGroups(bookmarks),
      duplicateFolderGroups: findDuplicateFolderGroups(folders),
      emptyFolders: findEmptyFolders(folders),
      invalidLinks: []
    } satisfies ScanResult
  };
  self.postMessage(response);
};
