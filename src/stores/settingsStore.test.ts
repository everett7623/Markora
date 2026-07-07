import { describe, expect, it } from 'vitest';
import { CURRENT_SCHEMA_VERSION, STORAGE_KEYS } from '../shared/constants/storage';
import { storageService } from '../services/storageService';
import { defaultSettings, useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  it('persists and normalizes app settings', async () => {
    await useSettingsStore.getState().update({
      theme: 'dark',
      language: 'zh_CN',
      cacheHours: 999,
      backupRetention: 0,
      autoScan: true
    });

    const state = useSettingsStore.getState().settings;
    expect(state.theme).toBe('dark');
    expect(state.language).toBe('zh_CN');
    expect(state.cacheHours).toBe(168);
    expect(state.backupRetention).toBe(1);
    expect(state.autoScan).toBe(true);

    const stored = await storageService.get(STORAGE_KEYS.settings);
    expect(stored.success).toBe(true);
    if (stored.success) {
      expect(stored.data?.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    }
  });

  it('persists scanner settings with safe bounds', async () => {
    await useSettingsStore.getState().update({ ...defaultSettings });
    await useSettingsStore.getState().updateScanner({ timeoutMs: 250, concurrency: 99, retryCount: 9 });

    expect(useSettingsStore.getState().settings.scanner).toEqual({
      timeoutMs: 1000,
      concurrency: 12,
      retryCount: 5
    });
  });
});
