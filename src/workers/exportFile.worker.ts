import type { ExportWorkerRequest, ExportWorkerResponse } from '../shared/types';
import { serializeExport } from '../shared/utils/exportFormats';

self.onmessage = (event: MessageEvent<ExportWorkerRequest>) => {
  if (event.data.type !== 'create-export') return;

  try {
    const content = serializeExport(event.data.bookmarks, event.data.format);
    const response: ExportWorkerResponse = { type: 'complete', content };
    self.postMessage(response);
  } catch (error) {
    const response: ExportWorkerResponse = {
      type: 'error',
      error: error instanceof Error ? error.message : undefined
    };
    self.postMessage(response);
  }
};
