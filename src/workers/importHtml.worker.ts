import type { ImportHtmlWorkerRequest, ImportHtmlWorkerResponse } from '../shared/types';
import { parseImportContent } from '../shared/utils/importFormats';

self.onmessage = (event: MessageEvent<ImportHtmlWorkerRequest>) => {
  if (event.data.type !== 'parse-import') return;

  try {
    const items = parseImportContent(event.data.format, event.data.content);
    const response: ImportHtmlWorkerResponse = { type: 'complete', items };
    self.postMessage(response);
  } catch (error) {
    const response: ImportHtmlWorkerResponse = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unable to parse bookmark HTML.'
    };
    self.postMessage(response);
  }
};
