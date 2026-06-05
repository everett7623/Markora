import type { BookmarkNode, BookmarkStats, ScanResult } from '../types';

export function annotateBookmarkPaths(nodes: BookmarkNode[], parentPath: string[] = []): BookmarkNode[] {
  return nodes.map((node) => {
    const path = [...parentPath, node.title || 'Untitled'];
    return {
      ...node,
      path,
      children: node.children ? annotateBookmarkPaths(node.children as BookmarkNode[], path) : undefined
    };
  });
}

export function flattenBookmarks(nodes: BookmarkNode[]): BookmarkNode[] {
  const items: BookmarkNode[] = [];

  const visit = (currentNodes: BookmarkNode[]) => {
    for (const node of currentNodes) {
      if (node.url) items.push(node);
      if (node.children) visit(node.children as BookmarkNode[]);
    }
  };

  visit(nodes);
  return items;
}

export function flattenFolders(nodes: BookmarkNode[]): BookmarkNode[] {
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

export function calculateBookmarkStats(bookmarks: BookmarkNode[], scanResult?: ScanResult | null): BookmarkStats {
  const flatBookmarks = flattenBookmarks(bookmarks);
  const folders = flattenFolders(bookmarks);
  const urls = new Map<string, number>();

  for (const bookmark of flatBookmarks) {
    if (!bookmark.url) continue;
    urls.set(bookmark.url, (urls.get(bookmark.url) ?? 0) + 1);
  }

  return {
    totalBookmarks: flatBookmarks.length,
    totalFolders: folders.length,
    duplicateBookmarks: [...urls.values()].filter((count) => count > 1).reduce((sum, count) => sum + count, 0),
    invalidLinks: scanResult?.invalidLinks.length ?? 0
  };
}

export function searchBookmarks(bookmarks: BookmarkNode[], query: string): BookmarkNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return flattenBookmarks(bookmarks);

  return flattenBookmarks(bookmarks).filter((bookmark) => {
    const haystack = `${bookmark.title} ${bookmark.url ?? ''} ${bookmark.path?.join(' ') ?? ''}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
