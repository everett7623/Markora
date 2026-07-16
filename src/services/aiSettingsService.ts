import type { AiConnectionSettings, Result } from '../shared/types';
import { STORAGE_KEYS } from '../shared/constants/storage';
import { storageService } from './storageService';

export const defaultAiSettings: AiConnectionSettings = {
  enabled: false,
  endpoint: '',
  model: '',
  privacyMode: 'domain-only'
};

function normalize(value: Partial<AiConnectionSettings> | null | undefined): AiConnectionSettings {
  return {
    enabled: value?.enabled === true,
    endpoint: typeof value?.endpoint === 'string' ? value.endpoint.trim().slice(0, 2_000) : '',
    model: typeof value?.model === 'string' ? value.model.trim().slice(0, 200) : '',
    privacyMode: value?.privacyMode === 'metadata' ? 'metadata' : 'domain-only'
  };
}

export const aiSettingsService = {
  async load(): Promise<Result<AiConnectionSettings>> {
    const stored = await storageService.get<AiConnectionSettings>(STORAGE_KEYS.aiSettings);
    if (!stored.success) return stored;
    return { success: true, data: normalize(stored.data?.data) };
  },

  async save(settings: AiConnectionSettings): Promise<Result<AiConnectionSettings>> {
    const normalized = normalize(settings);
    const saved = await storageService.set(STORAGE_KEYS.aiSettings, normalized);
    return saved.success ? { success: true, data: normalized } : saved;
  }
};
