import { RefreshCw, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateService } from '../../services/updateService';
import type { ExtensionUpdateInfo, Result } from '../types';
import { Button } from './ui/Button';

export function UpdateBanner() {
  const { t } = useTranslation();
  const [update, setUpdate] = useState<ExtensionUpdateInfo | null>(null);
  const [applying, setApplying] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const handleUpdate = (result: Result<ExtensionUpdateInfo | null>) => {
      if (cancelled) return;
      if (!result.success) {
        setError(result.error);
        return;
      }
      setError('');
      setUpdate(result.data);
    };

    const unsubscribe = updateService.subscribeToAvailableUpdate(handleUpdate);
    void updateService.getAvailableUpdate().then(handleUpdate);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const applyUpdate = async () => {
    setApplying(true);
    setError('');
    const result = await updateService.applyAvailableUpdate();
    if (!result.success) {
      setError(result.error);
      setApplying(false);
    }
  };

  if (dismissed) return null;

  if (!update) {
    if (!error) return null;
    return (
      <section className="flex items-center gap-3 border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" role="alert">
        <TriangleAlert size={18} aria-hidden="true" />
        <span className="min-w-0 flex-1">{error}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDismissed(true)} aria-label={t('update.dismiss')}>
          <X size={16} />
        </Button>
      </section>
    );
  }

  return (
    <section className="flex flex-wrap items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100" role="status">
      <RefreshCw size={18} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="font-medium">{t('update.available', { version: update.version })}</div>
        <div className="text-xs text-amber-800 dark:text-amber-200">{t('update.description')}</div>
        {error && <div className="mt-1 text-xs text-red-700 dark:text-red-300">{error}</div>}
      </div>
      <Button className="h-8 px-3" disabled={applying} onClick={() => void applyUpdate()}>
        {applying ? t('update.applying') : t('update.apply')}
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDismissed(true)} aria-label={t('update.dismiss')}>
        <X size={16} />
      </Button>
    </section>
  );
}
