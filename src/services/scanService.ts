import { DEFAULT_CACHE_HOURS, STORAGE_KEYS } from '../shared/constants/storage';
import type { BookmarkNode, Result, ScanCache, ScanResult, ScanWorkerRequest, ScanWorkerResponse } from '../shared/types';
import { storageService } from './storageService';

export const scanService = {
  createWorker(): Worker {
    return new Worker(new URL('../workers/scanner.worker.ts', import.meta.url), { type: 'module' });
  },

  start(worker: Worker, bookmarks: BookmarkNode[]): void {
    const request: ScanWorkerRequest = { type: 'scan', bookmarks };
    worker.postMessage(request);
  },

  run(bookmarks: BookmarkNode[], onProgress: (progress: number) => void): Promise<Result<ScanResult>> {
    return new Promise((resolve) => {
      const worker = this.createWorker();

      worker.onmessage = (event: MessageEvent<ScanWorkerResponse>) => {
        if (event.data.type === 'progress') {
          onProgress(event.data.progress);
          return;
        }

        worker.terminate();
        if (event.data.type === 'complete' && event.data.result) {
          resolve({ success: true, data: event.data.result });
          return;
        }

        resolve({ success: false, error: event.data.error ?? 'Scan failed.' });
      };

      worker.onerror = (event) => {
        worker.terminate();
        resolve({ success: false, error: event.message });
      };

      this.start(worker, bookmarks);
    });
  },

  async getCached(maxAgeHours = DEFAULT_CACHE_HOURS): Promise<Result<ScanResult | null>> {
    const cached = await storageService.get<ScanCache>(STORAGE_KEYS.scanCache);
    if (!cached.success) return { success: false, error: cached.error };
    if (!cached.data) return { success: true, data: null };

    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    if (Date.now() - cached.data.data.createdAt > maxAgeMs) {
      return { success: true, data: null };
    }

    return { success: true, data: cached.data.data.result };
  },

  async saveCache(result: ScanResult): Promise<Result<ScanCache>> {
    const cache: ScanCache = { result, createdAt: Date.now() };
    const saved = await storageService.set(STORAGE_KEYS.scanCache, cache);
    return saved.success ? { success: true, data: cache } : saved;
  }
};
