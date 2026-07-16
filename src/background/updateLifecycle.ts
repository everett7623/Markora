import { storageService } from '../services/storageService';
import { STORAGE_KEYS } from '../shared/constants/storage';
import type { ExtensionUpdateInfo } from '../shared/types';

let updateListenerRegistered = false;

export async function persistAvailableExtensionUpdate(
  version: string,
  detectedAt = Date.now()
): Promise<void> {
  const update: ExtensionUpdateInfo = { version, detectedAt };
  await storageService.set(STORAGE_KEYS.availableExtensionUpdate, update);
}

export async function clearAvailableExtensionUpdate(): Promise<void> {
  await storageService.set<ExtensionUpdateInfo | null>(STORAGE_KEYS.availableExtensionUpdate, null);
}

export function registerExtensionUpdateLifecycle(): void {
  if (updateListenerRegistered || !chrome.runtime.onUpdateAvailable) return;

  chrome.runtime.onUpdateAvailable.addListener(({ version }) => {
    void persistAvailableExtensionUpdate(version);
  });
  updateListenerRegistered = true;
}
