import type { AiPreprocessWorkerRequest, AiPreprocessWorkerResponse } from '../shared/types';
import { createAiAnalysisPayload } from '../shared/utils/aiPreprocess';

self.onmessage = (event: MessageEvent<AiPreprocessWorkerRequest>) => {
  if (event.data.type !== 'prepare-ai-analysis') return;
  try {
    const prepared = createAiAnalysisPayload(event.data.bookmarks, event.data.scopeId, event.data.privacyMode);
    self.postMessage({ type: 'complete', ...prepared } satisfies AiPreprocessWorkerResponse);
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : undefined
    } satisfies AiPreprocessWorkerResponse);
  }
};
