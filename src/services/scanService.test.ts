import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BookmarkNode, ScanResult } from '../shared/types';
import { scanService } from './scanService';

const bookmarks: BookmarkNode[] = [
  {
    id: 'root',
    title: 'Root',
    children: [
      { id: '1', title: 'Valid', url: 'https://example.com', parentId: 'root' },
      { id: '2', title: 'Broken', url: 'https://missing.example.com', parentId: 'root' }
    ]
  }
];

const structureResult: ScanResult = {
  duplicateBookmarkGroups: [],
  duplicateFolderGroups: [],
  emptyFolders: [],
  invalidLinks: []
};

describe('scanService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('combines structural scan results with broken link results', async () => {
    vi.spyOn(scanService, 'runStructureScan').mockResolvedValue({ success: true, data: structureResult });
    vi.spyOn(scanService, 'ensureLinkCheckPermission').mockResolvedValue({ success: true, data: true });
    vi.spyOn(scanService, 'runLinkCheck').mockResolvedValue({
      success: true,
      data: [{ node: bookmarks[0].children?.[1] as BookmarkNode, status: 404, error: 'Not Found', kind: 'broken', reason: 'not-found' }]
    });

    const progress: number[] = [];
    const result = await scanService.run(bookmarks, { timeoutMs: 5000, concurrency: 2, retryCount: 1 }, (value) => progress.push(value));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.invalidLinks).toHaveLength(1);
      expect(result.data.invalidLinks[0].status).toBe(404);
    }
  });

  it('preserves structural scan results when optional link permission is denied', async () => {
    vi.spyOn(scanService, 'runStructureScan').mockResolvedValue({ success: true, data: structureResult });
    vi.spyOn(scanService, 'ensureLinkCheckPermission').mockResolvedValue({ success: true, data: false });
    const linkCheck = vi.spyOn(scanService, 'runLinkCheck');

    const result = await scanService.run(bookmarks, { timeoutMs: 5000, concurrency: 2, retryCount: 1 }, vi.fn());

    expect(result).toEqual({ success: true, data: structureResult });
    expect(linkCheck).not.toHaveBeenCalled();
  });

  it('uses the local request fallback outside an extension runtime', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

    const result = await scanService.requestLinkCheck({
      type: 'check-link',
      url: 'https://example.com',
      settings: { timeoutMs: 5000, concurrency: 2, retryCount: 0 }
    });

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
