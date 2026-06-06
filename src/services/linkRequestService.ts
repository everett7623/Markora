import type { LinkFetchResponse, Result, ScannerConfig } from '../shared/types';
import { isProtectedBrowserStoreUrl, shouldVerifyWithGet } from '../shared/utils/linkCheck';

async function fetchWithTimeout(url: string, timeoutMs: number, method: 'HEAD' | 'GET'): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      method,
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'follow',
      credentials: 'omit'
    });
  } finally {
    clearTimeout(timeout);
  }
}

export const linkRequestService = {
  async check(url: string, settings: ScannerConfig): Promise<Result<LinkFetchResponse>> {
    if (isProtectedBrowserStoreUrl(url)) {
      return {
        success: true,
        data: {
          error: 'Browser store links require manual verification.',
          failure: 'protected'
        }
      };
    }

    for (let attempt = 0; attempt <= settings.retryCount; attempt += 1) {
      try {
        let response = await fetchWithTimeout(url, settings.timeoutMs, 'HEAD');
        if (shouldVerifyWithGet(response.status)) {
          response = await fetchWithTimeout(url, settings.timeoutMs, 'GET');
        }

        return {
          success: true,
          data: {
            status: response.status,
            statusText: response.statusText,
            cloudflare: response.headers.has('cf-ray') || Boolean(response.headers.get('server')?.toLowerCase().includes('cloudflare'))
          }
        };
      } catch (error) {
        if (attempt < settings.retryCount) continue;
        const isAbort = error instanceof DOMException && error.name === 'AbortError';
        return {
          success: true,
          data: {
            error: isAbort ? 'Timeout' : error instanceof Error ? error.message : 'Network error',
            failure: isAbort ? 'timeout' : 'network'
          }
        };
      }
    }

    return { success: false, error: 'Link check did not complete.' };
  }
};
