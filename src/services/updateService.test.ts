import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { persistAvailableExtensionUpdate } from '../background/updateLifecycle';
import { CURRENT_EXTENSION_VERSION, isNewerVersion, updateService } from './updateService';

describe('isNewerVersion', () => {
  it('compares Chrome manifest version segments numerically', () => {
    expect(isNewerVersion('0.2.0', '0.2.1')).toBe(true);
    expect(isNewerVersion('0.9.0', '0.10.0')).toBe(true);
    expect(isNewerVersion('1.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('1.1.0', '1.0.9')).toBe(false);
    expect(isNewerVersion('1.0.0', 'v1.1.0')).toBe(false);
  });
});

describe('updateService', () => {
  const values = new Map<string, unknown>();
  const sendMessage = vi.fn();

  beforeEach(() => {
    values.clear();
    sendMessage.mockReset();
    vi.stubGlobal('chrome', {
      runtime: { id: 'test-extension', sendMessage },
      storage: {
        local: {
          get: vi.fn(async (key: string) => ({ [key]: values.get(key) })),
          set: vi.fn(async (entries: Record<string, unknown>) => {
            Object.entries(entries).forEach(([key, value]) => values.set(key, value));
          })
        }
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a newer update persisted by the background lifecycle', async () => {
    await persistAvailableExtensionUpdate('0.3.0', 123);

    await expect(updateService.getAvailableUpdate()).resolves.toEqual({
      success: true,
      data: { version: '0.3.0', detectedAt: 123 }
    });
  });

  it('hides stale or current-version update records', async () => {
    await persistAvailableExtensionUpdate(CURRENT_EXTENSION_VERSION, 123);
    await expect(updateService.getAvailableUpdate()).resolves.toEqual({ success: true, data: null });
  });

  it('asks the background service worker to apply the update', async () => {
    sendMessage.mockResolvedValue({ success: true, data: true });
    await expect(updateService.applyAvailableUpdate()).resolves.toEqual({ success: true, data: true });
    expect(sendMessage).toHaveBeenCalledWith({ type: 'apply-extension-update' });
  });
});
