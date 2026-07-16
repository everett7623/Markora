import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerExtensionUpdateLifecycle } from './updateLifecycle';

describe('registerExtensionUpdateLifecycle', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('persists the version reported by the browser update event', async () => {
    let updateListener: ((details: { version: string }) => void) | undefined;
    const set = vi.fn(async () => undefined);
    vi.stubGlobal('chrome', {
      runtime: {
        onUpdateAvailable: {
          addListener: vi.fn((listener: (details: { version: string }) => void) => {
            updateListener = listener;
          })
        }
      },
      storage: { local: { set } }
    });

    registerExtensionUpdateLifecycle();
    expect(updateListener).toBeTypeOf('function');
    updateListener?.({ version: '0.3.0' });

    await vi.waitFor(() => {
      expect(set).toHaveBeenCalledWith({
        'available-extension-update': expect.objectContaining({
          schemaVersion: 1,
          data: expect.objectContaining({ version: '0.3.0' })
        })
      });
    });
  });
});
