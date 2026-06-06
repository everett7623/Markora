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

export function planDuplicateBookmarkCleanup(group: BookmarkNode[]): { keeper: BookmarkNode | null; duplicateIds: string[] } {
  const ordered = group
    .map((bookmark, index) => ({ bookmark, index }))
    .sort((left, right) => {
      const leftDate = left.bookmark.dateAdded ?? Number.MAX_SAFE_INTEGER;
      const rightDate = right.bookmark.dateAdded ?? Number.MAX_SAFE_INTEGER;
      return leftDate - rightDate || left.index - right.index;
    })
    .map(({ bookmark }) => bookmark);

  return {
    keeper: ordered[0] ?? null,
    duplicateIds: ordered.slice(1).map((bookmark) => bookmark.id)
  };
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

export function removeBookmarkNodes(nodes: BookmarkNode[], ids: Set<string>): BookmarkNode[] {
  return nodes
    .filter((node) => !ids.has(node.id))
    .map((node) => ({
      ...node,
      children: node.children ? removeBookmarkNodes(node.children as BookmarkNode[], ids) : undefined
    }));
}

export function collectBookmarkNodesByIds(nodes: BookmarkNode[], ids: Set<string>): BookmarkNode[] {
  const found: BookmarkNode[] = [];

  const visit = (currentNodes: BookmarkNode[]) => {
    for (const node of currentNodes) {
      if (node.url && ids.has(node.id)) found.push(node);
      if (node.children) visit(node.children as BookmarkNode[]);
    }
  };

  visit(nodes);
  return found;
}

export function collectNodesByIds(nodes: BookmarkNode[], ids: Set<string>): BookmarkNode[] {
  const found: BookmarkNode[] = [];

  const visit = (currentNodes: BookmarkNode[]) => {
    for (const node of currentNodes) {
      if (ids.has(node.id)) found.push(node);
      if (node.children) visit(node.children as BookmarkNode[]);
    }
  };

  visit(nodes);
  return found;
}

export function isDescendantNode(nodes: BookmarkNode[], ancestorId: string, targetId: string): boolean {
  const findAncestor = (currentNodes: BookmarkNode[]): BookmarkNode | null => {
    for (const node of currentNodes) {
      if (node.id === ancestorId) return node;
      if (node.children) {
        const found = findAncestor(node.children as BookmarkNode[]);
        if (found) return found;
      }
    }
    return null;
  };

  const ancestor = findAncestor(nodes);
  if (!ancestor?.children) return false;
  return collectNodesByIds(ancestor.children as BookmarkNode[], new Set([targetId])).length > 0;
}

export function updateBookmarkNodeTitle(nodes: BookmarkNode[], id: string, title: string): BookmarkNode[] {
  return nodes.map((node) => ({
    ...node,
    title: node.id === id ? title : node.title,
    children: node.children ? updateBookmarkNodeTitle(node.children as BookmarkNode[], id, title) : undefined
  }));
}

export function updateBookmarkNodeUrl(nodes: BookmarkNode[], id: string, url: string): BookmarkNode[] {
  return nodes.map((node) => ({
    ...node,
    url: node.id === id ? url : node.url,
    children: node.children ? updateBookmarkNodeUrl(node.children as BookmarkNode[], id, url) : undefined
  }));
}

export function moveBookmarkNodes(nodes: BookmarkNode[], ids: Set<string>, targetFolderId: string): BookmarkNode[] {
  const moving = collectNodesByIds(nodes, ids)
    .filter((node) => node.id !== targetFolderId && !isDescendantNode(nodes, node.id, targetFolderId))
    .map((node) => ({ ...node, parentId: targetFolderId }));
  if (moving.length === 0) return nodes;

  const movingIds = new Set(moving.map((node) => node.id));
  const withoutMoving = removeBookmarkNodes(nodes, movingIds);

  const appendToFolder = (currentNodes: BookmarkNode[]): BookmarkNode[] =>
    currentNodes.map((node) => {
      if (node.id === targetFolderId && node.children) {
        return {
          ...node,
          children: [...(node.children as BookmarkNode[]), ...moving]
        };
      }

      return {
        ...node,
        children: node.children ? appendToFolder(node.children as BookmarkNode[]) : undefined
      };
    });

  return appendToFolder(withoutMoving);
}

export function reorderNodeBefore(nodes: BookmarkNode[], nodeId: string, beforeId: string): BookmarkNode[] {
  const reorderSiblings = (siblings: BookmarkNode[]): BookmarkNode[] => {
    const fromIndex = siblings.findIndex((node) => node.id === nodeId);
    const toIndex = siblings.findIndex((node) => node.id === beforeId);
    if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
      const next = [...siblings];
      const [moving] = next.splice(fromIndex, 1);
      const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      next.splice(adjustedToIndex, 0, moving);
      return next.map((node, index) => ({ ...node, index }));
    }

    return siblings.map((node) => ({
      ...node,
      children: node.children ? reorderSiblings(node.children as BookmarkNode[]) : undefined
    }));
  };

  return reorderSiblings(nodes);
}

export function mergeFolderNodes(nodes: BookmarkNode[], sourceIds: Set<string>, targetId: string): BookmarkNode[] {
  const sources = collectNodesByIds(nodes, sourceIds).filter((node) => node.children && node.id !== targetId);
  const childrenToMove = sources.flatMap((folder) =>
    ((folder.children as BookmarkNode[] | undefined) ?? []).map((child) => ({ ...child, parentId: targetId }))
  );
  if (childrenToMove.length === 0 && sources.length === 0) return nodes;

  const withoutSources = removeBookmarkNodes(nodes, new Set(sources.map((folder) => folder.id)));
  const appendChildren = (currentNodes: BookmarkNode[]): BookmarkNode[] =>
    currentNodes.map((node) => ({
      ...node,
      children:
        node.id === targetId && node.children
          ? [...(node.children as BookmarkNode[]), ...childrenToMove]
          : node.children
            ? appendChildren(node.children as BookmarkNode[])
            : undefined
    }));

  return appendChildren(withoutSources);
}

export function findNodeParent(nodes: BookmarkNode[], id: string): { parentId?: string; index: number } | null {
  const visit = (currentNodes: BookmarkNode[], parentId?: string): { parentId?: string; index: number } | null => {
    for (let index = 0; index < currentNodes.length; index += 1) {
      const node = currentNodes[index];
      if (node.id === id) return { parentId, index };
      if (node.children) {
        const found = visit(node.children as BookmarkNode[], node.id);
        if (found) return found;
      }
    }
    return null;
  };

  return visit(nodes);
}

export function getFolderDescendantBookmarks(nodes: BookmarkNode[], folderId: string | null): BookmarkNode[] {
  if (!folderId) return flattenBookmarks(nodes);

  const findFolder = (currentNodes: BookmarkNode[]): BookmarkNode | null => {
    for (const node of currentNodes) {
      if (node.id === folderId) return node;
      if (node.children) {
        const found = findFolder(node.children as BookmarkNode[]);
        if (found) return found;
      }
    }
    return null;
  };

  const folder = findFolder(nodes);
  return folder?.children ? flattenBookmarks(folder.children as BookmarkNode[]) : [];
}
