import type { ScanResult, ScanWorkerResponse } from '../shared/types';

self.onmessage = () => {
  const response: ScanWorkerResponse = {
    type: 'complete',
    progress: 100,
    result: {
      duplicateBookmarkGroups: [],
      duplicateFolderGroups: [],
      emptyFolders: [],
      invalidLinks: []
    } satisfies ScanResult
  };
  self.postMessage(response);
};
