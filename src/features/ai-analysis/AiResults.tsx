import { Lightbulb, Tags } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AiAnalysisResult } from '../../shared/types';

export function AiResults({ result }: { result: AiAnalysisResult }) {
  const { t } = useTranslation();
  return (
    <section className="space-y-5 rounded-lg border bg-white p-5 shadow-sm dark:bg-slate-950">
      <h2 className="font-semibold">{t('ai.resultTitle')}</h2>
      <div><h3 className="text-sm font-medium">{t('ai.summary')}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{result.summary}</p></div>

      <div>
        <div className="flex items-center gap-2"><Tags size={17} className="text-indigo-600" /><h3 className="text-sm font-medium">{t('ai.topics')}</h3></div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {result.topics.length ? result.topics.map((topic) => (
            <article key={`${topic.label}-${topic.count}`} className="rounded-md border p-3 text-sm">
              <div className="flex justify-between gap-3"><span className="font-medium">{topic.label} ({topic.count})</span><span className="text-xs text-slate-500">{t('ai.confidence', { count: Math.round(topic.confidence * 100) })}</span></div>
              {topic.evidence.length ? <p className="mt-2 text-xs text-slate-500">{t('ai.evidence', { value: topic.evidence.join(', ') })}</p> : null}
            </article>
          )) : <p className="text-sm text-slate-500">{t('ai.emptyTopics')}</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2"><Lightbulb size={17} className="text-indigo-600" /><h3 className="text-sm font-medium">{t('ai.suggestions')}</h3></div>
        <div className="mt-3 space-y-3">
          {result.suggestions.length ? result.suggestions.map((suggestion) => (
            <article key={`${suggestion.type}-${suggestion.title}`} className="rounded-md border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium">{suggestion.title}</span><span className="text-xs text-slate-500">{t(`ai.suggestionTypes.${suggestion.type}`)} · {t('ai.confidence', { count: Math.round(suggestion.confidence * 100) })}</span></div>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{suggestion.rationale}</p>
              {suggestion.evidence.length ? <p className="mt-2 text-xs text-slate-500">{t('ai.evidence', { value: suggestion.evidence.join(', ') })}</p> : null}
            </article>
          )) : <p className="text-sm text-slate-500">{t('ai.emptySuggestions')}</p>}
        </div>
      </div>

      {result.warnings.length ? <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"><div className="font-medium">{t('ai.warnings')}</div><ul className="mt-2 list-disc space-y-1 pl-5">{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div> : null}
      <p className="rounded-md bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">{t('ai.readOnly')}</p>
    </section>
  );
}
