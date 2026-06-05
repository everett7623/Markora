import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FeaturePlaceholder({ titleKey, descriptionKey, icon: Icon }: { titleKey: string; descriptionKey: string; icon: LucideIcon }) {
  const { t } = useTranslation();

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-950">
      <span className="inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
        <Icon size={22} />
      </span>
      <h1 className="mt-5 text-2xl font-semibold">{t(titleKey)}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{t(descriptionKey)}</p>
      <div className="mt-6 rounded-md border border-dashed p-4 text-sm text-slate-500">{t('foundation.ready')}</div>
    </section>
  );
}
