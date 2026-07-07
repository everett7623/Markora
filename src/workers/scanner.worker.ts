import type { ScanWorkerRequest, ScanWorkerResponse } from '../shared/types';
import { createStructureScanResult } from '../shared/utils/structureScan';

self.onmessage = (event: MessageEvent<ScanWorkerRequest>) => {
  if (event.data.type !== 'scan') return;

  self.postMessage({ type: 'progress', progress: 15 } satisfies ScanWorkerResponse);
  self.postMessage({ type: 'progress', progress: 45 } satisfies ScanWorkerResponse);
  self.postMessage({ type: 'progress', progress: 75 } satisfies ScanWorkerResponse);
  const response: ScanWorkerResponse = {
    type: 'complete',
    progress: 100,
    result: createStructureScanResult(event.data.bookmarks)
  };
  self.postMessage(response);
};
