import type { AiAnalysisField, AiAnalysisPayload, AiPrivacyMode, BookmarkNode } from '../types';
import { flattenBookmarks } from './bookmarks';

const MAX_ITEM_SAMPLE = 200;
const MAX_AGGREGATES = 30;

function findNode(nodes: BookmarkNode[], id: string): BookmarkNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children as BookmarkNode[], id);
      if (found) return found;
    }
  }
  return null;
}

function topCounts(counts: Map<string, number>): Array<{ value: string; count: number }> {
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, MAX_AGGREGATES)
    .map(([value, count]) => ({ value, count }));
}

function clip(value: string, length: number): string {
  return value.trim().slice(0, length);
}

export function createAiAnalysisPayload(
  bookmarks: BookmarkNode[],
  scopeId: string | null,
  privacyMode: AiPrivacyMode
): { payload: AiAnalysisPayload; fields: AiAnalysisField[] } {
  const scopeNode = scopeId ? findNode(bookmarks, scopeId) : null;
  const scopedBookmarks = flattenBookmarks(scopeNode ? [scopeNode] : bookmarks);
  const domainCounts = new Map<string, number>();
  const folderCounts = new Map<string, number>();
  const metadataItems: AiAnalysisPayload['items'] = [];
  let validCount = 0;

  for (const bookmark of scopedBookmarks) {
    try {
      const url = new URL(bookmark.url ?? '');
      if (url.protocol !== 'http:' && url.protocol !== 'https:') continue;
      const hostname = url.hostname.toLowerCase();
      const folderPath = clip(bookmark.path?.slice(0, -1).join(' / ') ?? '', 300);
      validCount += 1;
      domainCounts.set(hostname, (domainCounts.get(hostname) ?? 0) + 1);
      if (folderPath) folderCounts.set(folderPath, (folderCounts.get(folderPath) ?? 0) + 1);

      if (privacyMode === 'metadata' && metadataItems.length < MAX_ITEM_SAMPLE) {
        metadataItems.push({
          ref: `bookmark-${validCount}`,
          title: clip(bookmark.title || 'Untitled', 200),
          hostname,
          urlPath: clip(url.pathname, 200),
          folderPath,
          tags: (bookmark.tags ?? []).map((tag) => clip(tag, 50)).filter(Boolean).slice(0, 8)
        });
      }
    } catch {
      continue;
    }
  }

  const items = privacyMode === 'metadata' ? metadataItems : [];
  return {
    payload: {
      schemaVersion: 1,
      scope: { kind: scopeId ? 'folder' : 'library', bookmarkCount: validCount },
      aggregate: {
        topDomains: topCounts(domainCounts),
        topFolders: privacyMode === 'metadata' ? topCounts(folderCounts) : []
      },
      items,
      truncated: privacyMode === 'metadata' && validCount > items.length
    },
    fields:
      privacyMode === 'metadata'
        ? ['title', 'hostname', 'urlPath', 'folderPath', 'tags', 'count']
        : ['hostname', 'count']
  };
}
