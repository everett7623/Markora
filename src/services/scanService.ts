import { DEFAULT_CACHE_HOURS, STORAGE_KEYS } from '../shared/constants/storage';
import i18n from '../shared/i18n';
import type {
  BookmarkNode,
  LinkCheckWorkerRequest,
  LinkCheckWorkerResponse,
  LinkFetchRequest,
  LinkFetchResponse,
  Result,
  ScanCache,
  ScannerConfig,
  ScanResult,
  ScanWorkerRequest,
  ScanWorkerResponse
} from '../shared/types';
import { flattenBookmarks } from '../shared/utils/bookmarks';
import { normalizeLinkIssue } from '../shared/utils/linkCheck';
import { linkRequestService } from './linkRequestService';
import { storageService } from './storageService';

export const scanService = {
  createWorker(): Worker {
    return new Worker(new URL('../workers/scanner.worker.ts', import.meta.url), { type: 'module' });
  },

  createLinkCheckerWorker(): Worker {
    return new Worker(new URL('../workers/linkChecker.worker.ts', import.meta.url), { type: 'module' });
  },

  async requestLinkCheck(request: LinkFetchRequest): Promise<Result<LinkFetchResponse>> {
    if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
      try {
        return await chrome.runtime.sendMessage(request) as Result<LinkFetchResponse>;
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : i18n.t('serviceErrors.contactBackgroundLinkChecker') };
      }
    }

    return linkRequestService.check(request.url, request.settings);
  },

  start(worker: Worker, bookmarks: BookmarkNode[]): void {
    const request: ScanWorkerRequest = { type: 'scan', bookmarks };
    worker.postMessage(request);
  },

  async ensureLinkCheckPermission(): Promise<Result<boolean>> {
    try {
      if (!globalThis.chrome?.permissions) return { success: true, data: true };

      const permissions = { origins: ['<all_urls>'] };
      const alreadyGranted = await chrome.permissions.contains(permissions);
      if (alreadyGranted) return { success: true, data: true };

      const granted = await chrome.permissions.request(permissions);
      return { success: true, data: granted };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : i18n.t('serviceErrors.requestLinkCheckPermissions') };
    }
  },

  runStructureScan(bookmarks: BookmarkNode[], onProgress: (progress: number) => void): Promise<Result<ScanResult>> {
    return new Promise((resolve) => {
      const worker = this.createWorker();

      worker.onmessage = (event: MessageEvent<ScanWorkerResponse>) => {
        if (event.data.type === 'progress') {
          onProgress(Math.round(event.data.progress * 0.4));
          return;
        }

        worker.terminate();
        if (event.data.type === 'complete' && event.data.result) {
          resolve({ success: true, data: event.data.result });
          return;
        }

        resolve({ success: false, error: event.data.error ?? i18n.t('serviceErrors.scanFailed') });
      };

      worker.onerror = (event) => {
        worker.terminate();
        resolve({ success: false, error: event.message });
      };

      this.start(worker, bookmarks);
    });
  },

  runLinkCheck(
    bookmarks: BookmarkNode[],
    settings: ScannerConfig,
    onProgress: (progress: number) => void,
    onLinkProgress?: (checkedBookmarks: number, totalBookmarks: number, uniqueUrls: number) => void
  ): Promise<Result<ScanResult['invalidLinks']>> {
    return new Promise((resolve) => {
      const worker = this.createLinkCheckerWorker();
      const request: LinkCheckWorkerRequest = { type: 'check-links', bookmarks: flattenBookmarks(bookmarks), settings };

      worker.onmessage = (event: MessageEvent<LinkCheckWorkerResponse>) => {
        if (event.data.type === 'request-link' && event.data.request && event.data.requestId !== undefined) {
          const { request, requestId } = event.data;
          void this.requestLinkCheck(request).then((result) => {
            worker.postMessage({ type: 'link-result', requestId, result } satisfies LinkCheckWorkerRequest);
          });
          return;
        }

        if (event.data.type === 'progress') {
          onProgress(40 + Math.round(event.data.progress * 0.6));
          onLinkProgress?.(event.data.checkedBookmarks ?? 0, event.data.totalBookmarks ?? 0, event.data.uniqueUrls ?? 0);
          return;
        }

        worker.terminate();
        if (event.data.type === 'complete' && event.data.invalidLinks) {
          resolve({ success: true, data: event.data.invalidLinks });
          return;
        }

        resolve({ success: false, error: event.data.error ?? i18n.t('serviceErrors.brokenLinkScanFailed') });
      };

      worker.onerror = (event) => {
        worker.terminate();
        resolve({ success: false, error: event.message });
      };

      worker.postMessage(request);
    });
  },

  async run(
    bookmarks: BookmarkNode[],
    settings: ScannerConfig,
    onProgress: (progress: number) => void,
    onLinkProgress?: (checkedBookmarks: number, totalBookmarks: number, uniqueUrls: number) => void
  ): Promise<Result<ScanResult>> {
    const structure = await this.runStructureScan(bookmarks, onProgress);
    if (!structure.success) return structure;

    const permission = await this.ensureLinkCheckPermission();
    if (!permission.success) return permission;
    if (!permission.data) {
      onProgress(100);
      return { success: true, data: structure.data };
    }

    const invalidLinks = await this.runLinkCheck(bookmarks, settings, onProgress, onLinkProgress);
    if (!invalidLinks.success) return invalidLinks;

    return {
      success: true,
      data: {
        ...structure.data,
        invalidLinks: invalidLinks.data
      }
    };
  },

  async getCache(maxAgeHours = DEFAULT_CACHE_HOURS): Promise<Result<ScanCache | null>> {
    const cached = await storageService.get<ScanCache>(STORAGE_KEYS.scanCache);
    if (!cached.success) return { success: false, error: cached.error };
    if (!cached.data) return { success: true, data: null };

    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    if (Date.now() - cached.data.data.createdAt > maxAgeMs) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        ...cached.data.data,
        result: {
          ...cached.data.data.result,
          invalidLinks: cached.data.data.result.invalidLinks.map(normalizeLinkIssue)
        }
      }
    };
  },

  async getCached(maxAgeHours = DEFAULT_CACHE_HOURS): Promise<Result<ScanResult | null>> {
    const cached = await this.getCache(maxAgeHours);
    if (!cached.success) return cached;
    if (!cached.data) return { success: true, data: null };

    return {
      success: true,
      data: cached.data.result
    };
  },

  async saveCache(result: ScanResult): Promise<Result<ScanCache>> {
    const cache: ScanCache = { result, createdAt: Date.now() };
    const saved = await storageService.set(STORAGE_KEYS.scanCache, cache);
    return saved.success ? { success: true, data: cache } : saved;
  }
};
