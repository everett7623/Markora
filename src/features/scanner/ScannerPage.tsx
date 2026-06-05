import { Play, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { scanService } from '../../services/scanService';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useScanStore } from '../../stores/scanStore';
import { Button } from '../../shared/components/ui/Button';

export default function ScannerPage() {
  const { t } = useTranslation();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const result = useScanStore((state) => state.result);
  const progress = useScanStore((state) => state.progress);
  const running = useScanStore((state) => state.running);
  const error = useScanStore((state) => state.error);
  const setProgress = useScanStore((state) => state.setProgress);
  const setResult = useScanStore((state) => state.setResult);
  const setRunning = useScanStore((state) => state.setRunning);
  const setError = useScanStore((state) => state.setError);

  useEffect(() => {
    void scanService.getCached().then((cached) => {
      if (cached.success && cached.data) {
        setResult(cached.data);
        setProgress(100);
      }
    });
  }, [setProgress, setResult]);

  const runScan = async () => {
    setRunning(true);
    setError(null);
    setProgress(0);
    const scan = await scanService.run(bookmarks, setProgress);
    setRunning(false);

    if (!scan.success) {
      setError(scan.error);
      return;
    }

    setResult(scan.data);
    setProgress(100);
    await scanService.saveCache(scan.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('pages.scanner.title')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('pages.scanner.description')}</p>
        </div>
        <Button onClick={() => void runScan()} disabled={running || bookmarks.length === 0}>
          {running ? <RotateCcw className="mr-2 animate-spin" size={16} /> : <Play className="mr-2" size={16} />}
          {t('scanner.run')}
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-5 shadow-sm dark:bg-slate-950">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{t('scanner.progress')}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ResultPanel title={t('scanner.duplicateBookmarks')} value={result?.duplicateBookmarkGroups.length ?? 0}>
          {(result?.duplicateBookmarkGroups ?? []).slice(0, 8).map((group) => (
            <div key={group.map((item) => item.id).join('-')} className="rounded-md border p-3 text-sm">
              <div className="font-medium">{group[0]?.url}</div>
              <div className="mt-1 text-xs text-slate-500">{group.length} items</div>
            </div>
          ))}
        </ResultPanel>
        <ResultPanel title={t('scanner.duplicateFolders')} value={result?.duplicateFolderGroups.length ?? 0}>
          {(result?.duplicateFolderGroups ?? []).slice(0, 8).map((group) => (
            <div key={group.map((item) => item.id).join('-')} className="rounded-md border p-3 text-sm">
              <div className="font-medium">{group[0]?.title}</div>
              <div className="mt-1 text-xs text-slate-500">{group.length} folders</div>
            </div>
          ))}
        </ResultPanel>
        <ResultPanel title={t('scanner.emptyFolders')} value={result?.emptyFolders.length ?? 0}>
          {(result?.emptyFolders ?? []).slice(0, 8).map((folder) => (
            <div key={folder.id} className="truncate rounded-md border p-3 text-sm">
              {folder.path?.join(' / ') ?? folder.title}
            </div>
          ))}
        </ResultPanel>
      </div>
    </div>
  );
}

function ResultPanel({ title, value, children }: { title: string; value: number; children: React.ReactNode }) {
  return (
    <section className="min-h-72 rounded-lg border bg-white p-5 shadow-sm dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-semibold dark:bg-slate-900">{value}</span>
      </div>
      <div className="space-y-2">{value > 0 ? children : <span className="text-sm text-slate-500">No results</span>}</div>
    </section>
  );
}
