import i18n from '../shared/i18n';
import type { AiAnalysisResult, AiProviderRequest, Result } from '../shared/types';
import { parseAiAnalysisResponse } from '../shared/utils/aiResponse';

const REQUEST_TIMEOUT_MS = 60_000;
const MAX_PROVIDER_RESPONSE_BYTES = 1_000_000;
const activeRequests = new Map<string, AbortController>();

function systemPrompt(language: string): string {
  return `You analyze bookmark-library metadata. Return only one JSON object using this exact contract:
{"schemaVersion":1,"summary":"string","topics":[{"label":"string","count":0,"confidence":0.0,"evidence":["string"]}],"suggestions":[{"type":"folder|tag|organization|review","title":"string","rationale":"string","confidence":0.0,"evidence":["string"]}],"warnings":["string"]}.
All confidence values must be between 0 and 1. Every evidence string must exactly equal one hostname, folder aggregate value, or item ref present in the request. Do not invent visited-page content. Do not suggest automatic destructive actions. Respond in ${language === 'zh_CN' ? 'Simplified Chinese' : 'English'}.`;
}

function providerMessage(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const error = record.error && typeof record.error === 'object' ? (record.error as Record<string, unknown>) : null;
  const message = error?.message ?? record.message;
  return typeof message === 'string' && message.trim() ? message.trim().slice(0, 300) : null;
}

function completionContent(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;
  const choices = (value as Record<string, unknown>).choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== 'object') return null;
  const message = (choices[0] as Record<string, unknown>).message;
  if (!message || typeof message !== 'object') return null;
  const content = (message as Record<string, unknown>).content;
  return typeof content === 'string' ? content : null;
}

async function readProviderBody(response: Response): Promise<unknown> {
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_PROVIDER_RESPONSE_BYTES) {
    await response.body?.cancel();
    return null;
  }
  if (!response.body) return null;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let byteLength = 0;
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    byteLength += value.byteLength;
    if (byteLength > MAX_PROVIDER_RESPONSE_BYTES) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function hasValidEvidence(result: AiAnalysisResult, request: AiProviderRequest): boolean {
  const allowed = new Set([
    ...request.payload.items.map((item) => item.ref),
    ...request.payload.aggregate.topDomains.map((item) => item.value),
    ...request.payload.aggregate.topFolders.map((item) => item.value)
  ]);
  const findings = [...result.topics, ...result.suggestions];
  return result.topics.every((topic) => topic.count <= request.payload.scope.bookmarkCount) && findings.every((finding) => finding.evidence.every((item) => allowed.has(item)));
}

export const aiProviderService = {
  async run(request: AiProviderRequest): Promise<Result<AiAnalysisResult>> {
    if (activeRequests.has(request.requestId)) return { success: false, error: i18n.t('ai.errors.providerFailed') };
    const controller = new AbortController();
    activeRequests.set(request.requestId, controller);
    const timeoutId = setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (request.apiKey) headers.Authorization = `Bearer ${request.apiKey}`;
      const response = await fetch(request.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: request.model,
          stream: false,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt(request.language) },
            { role: 'user', content: JSON.stringify(request.payload) }
          ]
        }),
        signal: controller.signal
      });
      const body = await readProviderBody(response);
      if (!response.ok) {
        const detail = providerMessage(body);
        return { success: false, error: detail ? `${detail} (HTTP ${response.status})` : `${i18n.t('ai.errors.providerFailed')} (HTTP ${response.status})` };
      }
      const content = completionContent(body);
      if (!content) return { success: false, error: i18n.t('ai.errors.invalidResponse') };
      const parsed = parseAiAnalysisResponse(content, i18n.t('ai.errors.invalidResponse'));
      return parsed.success && hasValidEvidence(parsed.data, request) ? parsed : { success: false, error: i18n.t('ai.errors.invalidResponse') };
    } catch (error) {
      if (controller.signal.aborted) {
        return { success: false, error: controller.signal.reason === 'timeout' ? i18n.t('ai.errors.timedOut') : i18n.t('ai.errors.cancelled') };
      }
      return { success: false, error: error instanceof Error ? error.message : i18n.t('ai.errors.providerFailed') };
    } finally {
      clearTimeout(timeoutId);
      activeRequests.delete(request.requestId);
    }
  },

  cancel(requestId: string): boolean {
    const controller = activeRequests.get(requestId);
    if (!controller) return false;
    controller.abort('cancelled');
    return true;
  }
};
