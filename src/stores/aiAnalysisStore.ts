import { create } from 'zustand';
import { aiAnalysisService } from '../services/aiAnalysisService';
import type { AiAnalysisPreview, AiAnalysisResult, AiConnectionSettings, AiPrivacyMode, AiTaskStatus, BookmarkNode } from '../shared/types';

interface AiAnalysisStore {
  status: AiTaskStatus;
  preview: AiAnalysisPreview | null;
  result: AiAnalysisResult | null;
  error: string | null;
  prepare: (bookmarks: BookmarkNode[], scopeId: string | null, scopeLabel: string, privacyMode: AiPrivacyMode) => Promise<void>;
  run: (settings: AiConnectionSettings, apiKey: string, language: string) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

let activeController: AbortController | null = null;

export const useAiAnalysisStore = create<AiAnalysisStore>((set, get) => ({
  status: 'idle',
  preview: null,
  result: null,
  error: null,

  prepare: async (bookmarks, scopeId, scopeLabel, privacyMode) => {
    if (get().status === 'running') return;
    set({ status: 'preparing', preview: null, result: null, error: null });
    const prepared = await aiAnalysisService.prepare(bookmarks, scopeId, scopeLabel, privacyMode);
    set(prepared.success ? { status: 'ready', preview: prepared.data } : { status: 'failed', error: prepared.error });
  },

  run: async (settings, apiKey, language) => {
    const preview = get().preview;
    if (!preview || get().status === 'running') return;
    activeController = new AbortController();
    const controller = activeController;
    set({ status: 'running', result: null, error: null });
    const analysis = await aiAnalysisService.run(settings, apiKey, language, preview, controller.signal);
    if (activeController !== controller) return;
    if (controller.signal.aborted) {
      set({ status: 'cancelled', error: null });
    } else if (analysis.success) {
      set({ status: 'success', result: analysis.data, error: null });
    } else {
      set({ status: 'failed', error: analysis.error });
    }
    activeController = null;
  },

  cancel: () => {
    activeController?.abort();
    activeController = null;
    if (get().status === 'running') set({ status: 'cancelled', error: null });
  },

  reset: () => {
    activeController?.abort();
    activeController = null;
    set({ status: 'idle', preview: null, result: null, error: null });
  }
}));
