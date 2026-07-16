import manifest from '../../manifest.json';
import i18n from '../shared/i18n';
import { STORAGE_KEYS } from '../shared/constants/storage';
import type { ExtensionUpdateInfo, Result } from '../shared/types';
import { storageService } from './storageService';

function parseVersion(version: string): number[] | null {
  const segments = version.split('.');
  if (segments.length === 0 || segments.some((segment) => !/^\d+$/.test(segment))) return null;
  return segments.map(Number);
}

export function isNewerVersion(currentVersion: string, candidateVersion: string): boolean {
  const current = parseVersion(currentVersion);
  const candidate = parseVersion(candidateVersion);
  if (!current || !candidate) return false;

  const segmentCount = Math.max(current.length, candidate.length);
  for (let index = 0; index < segmentCount; index += 1) {
    const currentSegment = current[index] ?? 0;
    const candidateSegment = candidate[index] ?? 0;
    if (candidateSegment !== currentSegment) return candidateSegment > currentSegment;
  }
  return false;
}

export const CURRENT_EXTENSION_VERSION = manifest.version;

export const updateService = {
  async getAvailableUpdate(): Promise<Result<ExtensionUpdateInfo | null>> {
    if (!globalThis.chrome?.runtime?.id) return { success: true, data: null };

    const stored = await storageService.get<ExtensionUpdateInfo | null>(STORAGE_KEYS.availableExtensionUpdate);
    if (!stored.success) return stored;

    const update = stored.data?.data ?? null;
    if (!update || !isNewerVersion(CURRENT_EXTENSION_VERSION, update.version)) {
      return { success: true, data: null };
    }
    return { success: true, data: update };
  },

  async applyAvailableUpdate(): Promise<Result<boolean>> {
    if (!globalThis.chrome?.runtime?.id) return { success: true, data: false };

    try {
      const response = await chrome.runtime.sendMessage({ type: 'apply-extension-update' }) as Result<boolean> | undefined;
      return response ?? { success: false, error: i18n.t('serviceErrors.applyExtensionUpdate') };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : i18n.t('serviceErrors.applyExtensionUpdate')
      };
    }
  }
};
