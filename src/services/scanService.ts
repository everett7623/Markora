import type { BookmarkNode, ScanWorkerRequest } from '../shared/types';

export const scanService = {
  createWorker(): Worker {
    return new Worker(new URL('../workers/scanner.worker.ts', import.meta.url), { type: 'module' });
  },

  start(worker: Worker, bookmarks: BookmarkNode[]): void {
    const request: ScanWorkerRequest = { type: 'scan', bookmarks };
    worker.postMessage(request);
  }
};
