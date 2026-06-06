import type { ImportHtmlWorkerRequest, ImportHtmlWorkerResponse } from '../shared/types';
import { parseNetscapeBookmarksHtml } from '../shared/utils/importHtml';

self.onmessage = (event: MessageEvent<ImportHtmlWorkerRequest>) => {
  if (event.data.type !== 'parse-html') return;

  try {
    const items = parseNetscapeBookmarksHtml(event.data.html);
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
