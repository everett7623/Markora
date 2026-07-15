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

  it('persists, restores, and clears ignored link URLs', async () => {
    await scanService.clearIgnoredLinkUrls();

    const ignored = await scanService.ignoreLinkUrl('https://working.example.com');
    expect(ignored.success && ignored.data.has('https://working.example.com')).toBe(true);

    const restored = await scanService.restoreIgnoredLinkUrl('https://working.example.com');
    expect(restored.success && restored.data.size).toBe(0);

    await scanService.ignoreLinkUrl('https://one.example.com');
    await scanService.ignoreLinkUrl('https://two.example.com');
    const cleared = await scanService.clearIgnoredLinkUrls();
    expect(cleared.success && cleared.data.size).toBe(0);
  });

  it('rechecks one link and removes successful responses from the issue result', async () => {
    vi.spyOn(scanService, 'requestLinkCheck').mockResolvedValue({ success: true, data: { status: 200, statusText: 'OK' } });

    const result = await scanService.recheckLink(
      bookmarks[0].children?.[1] as BookmarkNode,
      { timeoutMs: 5000, concurrency: 2, retryCount: 0 }
    );

    expect(result).toEqual({ success: true, data: null });
  });

  it('rechecks one link and returns a conservative HTTP issue', async () => {
    vi.spyOn(scanService, 'requestLinkCheck').mockResolvedValue({ success: true, data: { status: 404, statusText: 'Not Found' } });

    const result = await scanService.recheckLink(
      bookmarks[0].children?.[1] as BookmarkNode,
      { timeoutMs: 5000, concurrency: 2, retryCount: 0 }
    );

    expect(result.success && result.data).toMatchObject({ status: 404, kind: 'unreachable', reason: 'http-error' });
  });
});
