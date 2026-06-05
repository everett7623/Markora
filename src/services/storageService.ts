import { CURRENT_SCHEMA_VERSION } from '../shared/constants/storage';
import type { Result, StoredValue } from '../shared/types';

export async function migrateSettings<T>(value: StoredValue<T>): Promise<StoredValue<T>> {
  return value;
}

export async function migrateBackup<T>(value: StoredValue<T>): Promise<StoredValue<T>> {
  return value;
}

export async function migrateCache<T>(value: StoredValue<T>): Promise<StoredValue<T>> {
  return value;
}

export const storageService = {
  async get<T>(key: string): Promise<Result<StoredValue<T> | null>> {
    try {
      const values = await chrome.storage.local.get(key);
      return { success: true, data: (values[key] as StoredValue<T> | undefined) ?? null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to read local storage.' };
    }
  },

  async set<T>(key: string, data: T): Promise<Result<StoredValue<T>>> {
    const value: StoredValue<T> = { schemaVersion: CURRENT_SCHEMA_VERSION, data, updatedAt: Date.now() };
    try {
      await chrome.storage.local.set({ [key]: value });
      return { success: true, data: value };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to write local storage.' };
    }
  }
};
