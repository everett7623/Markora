export type LinkCheckRequest = { url: string; timeoutMs: number };
export type LinkCheckResponse = { url: string; ok: boolean; status?: number; error?: string };

self.onmessage = async (event: MessageEvent<LinkCheckRequest>) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), event.data.timeoutMs);
  try {
    const response = await fetch(event.data.url, { method: 'HEAD', signal: controller.signal });
    self.postMessage({ url: event.data.url, ok: response.ok, status: response.status } satisfies LinkCheckResponse);
  } catch (error) {
    self.postMessage({ url: event.data.url, ok: false, error: error instanceof Error ? error.message : 'Link check failed.' } satisfies LinkCheckResponse);
  } finally {
    clearTimeout(timeout);
  }
};
