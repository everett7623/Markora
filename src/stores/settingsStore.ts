import { create } from 'zustand';
import { DEFAULT_BACKUP_RETENTION, DEFAULT_CACHE_HOURS } from '../shared/constants/storage';
import type { AppSettings } from '../shared/types';

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'en',
  scanner: { timeoutMs: 15000, concurrency: 4, retryCount: 1 },
  cacheHours: DEFAULT_CACHE_HOURS,
  backupRetention: DEFAULT_BACKUP_RETENTION
};

interface SettingsStore {
  settings: AppSettings;
  update: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  update: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } }))
}));
