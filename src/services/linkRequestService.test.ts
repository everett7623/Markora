import { afterEach, describe, expect, it, vi } from 'vitest';
import i18n from '../shared/i18n';
import { linkRequestService } from './linkRequestService';

describe('linkRequestService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('verifies a failed HEAD response with GET and returns serializable metadata', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 405 }))
      .mockResolvedValueOnce(new Response(null, { status: 404, statusText: 'Not Found' }));

    const result = await linkRequestService.check('https://example.com/missing', {
      timeoutMs: 5000,
      concurrency: 2,
      retryCount: 0
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'HEAD', credentials: 'omit' });
    expect(fetchMock.mock.calls[1][1]).toMatchObject({ method: 'GET', credentials: 'omit' });
    expect(result).toEqual({
      success: true,
      data: { status: 404, statusText: 'Not Found', cloudflare: false }
    });
  });

  it('returns network failures without throwing across the background boundary', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await linkRequestService.check('https://restricted.example', {
      timeoutMs: 5000,
      concurrency: 2,
      retryCount: 0
    });

    expect(result).toEqual({
      success: true,
      data: { error: 'Failed to fetch', failure: 'network' }
    });
  });

  it('does not request protected browser store links', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    const result = await linkRequestService.check(
      'https://chrome.google.com/webstore/detail/example/id',
      { timeoutMs: 5000, concurrency: 2, retryCount: 0 }
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      data: {
        error: i18n.t('serviceErrors.browserStoreManualVerification'),
        failure: 'protected'
      }
    });
  });
});
