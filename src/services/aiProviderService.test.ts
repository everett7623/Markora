import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AiProviderRequest } from '../shared/types';
import { aiProviderService } from './aiProviderService';

function request(requestId: string): AiProviderRequest {
  return {
    type: 'run-ai-analysis',
    requestId,
    endpoint: 'https://provider.test/v1/chat/completions',
    model: 'test-model',
    apiKey: 'session-key',
    language: 'en',
    payload: {
      schemaVersion: 1,
      scope: { kind: 'library', bookmarkCount: 2 },
      aggregate: { topDomains: [{ value: 'example.com', count: 2 }], topFolders: [] },
      items: [],
      truncated: false
    }
  };
}

const analysis = {
  schemaVersion: 1,
  summary: 'Documentation links.',
  topics: [{ label: 'Docs', count: 2, confidence: 0.9, evidence: ['example.com'] }],
  suggestions: [{ type: 'organization', title: 'Group docs', rationale: 'Keep documentation together.', confidence: 0.8, evidence: ['example.com'] }],
  warnings: []
};

afterEach(() => vi.unstubAllGlobals());

describe('AI provider service', () => {
  it('sends the compatible contract and validates evidence', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(analysis) } }] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await aiProviderService.run(request('success'));
    expect(result).toEqual({ success: true, data: analysis });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({ Authorization: 'Bearer session-key' });
    expect(JSON.parse(String(init.body))).toMatchObject({ model: 'test-model', stream: false });
  });

  it('rejects evidence that was not present in the request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ ...analysis, topics: [{ ...analysis.topics[0], evidence: ['invented.test'] }] }) } }] }), { status: 200 })));
    const result = await aiProviderService.run(request('invalid-evidence'));
    expect(result.success).toBe(false);
  });

  it('rejects oversized provider responses before parsing them', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 200, headers: { 'Content-Length': '1000001' } }))
    );
    const result = await aiProviderService.run(request('oversized'));
    expect(result.success).toBe(false);
  });

  it('cancels an active provider request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init: RequestInit) => new Promise((_resolve, reject) => init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))))
    );
    const pending = aiProviderService.run(request('cancel'));
    await Promise.resolve();
    expect(aiProviderService.cancel('cancel')).toBe(true);
    await expect(pending).resolves.toMatchObject({ success: false });
  });
});
