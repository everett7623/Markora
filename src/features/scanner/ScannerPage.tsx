import { Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { scanService } from '../../services/scanService';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useScanStore } from '../../stores/scanStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../../shared/components/ui/Button';
import type { BookmarkNode } from '../../shared/types';
import { flattenBookmarks, planDuplicateBookmarkCleanup } from '../../shared/utils/bookmarks';
import { normalizeLinkIssue } from '../../shared/utils/linkCheck';

export default function ScannerPage() {
  const { t } = useTranslation();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const mutating = useBookmarkStore((state) => state.mutating);
  const mergeFolders = useBookmarkStore((state) => state.mergeFolders);
  const deleteBookmarks = useBookmarkStore((state) => state.deleteBookmarks);
  const result = useScanStore((state) => state.result);
  const progress = useScanStore((state) => state.progress);
  const running = useScanStore((state) => state.running);
  const error = useScanStore((state) => state.error);
  const setProgress = useScanStore((state) => state.setProgress);
  const setResult = useScanStore((state) => state.setResult);
  const setRunning = useScanStore((state) => state.setRunning);
  const setError = useScanStore((state) => state.setError);
  const scannerSettings = useSettingsStore((state) => state.settings.scanner);
  const cacheHours = useSettingsStore((state) => state.settings.cacheHours);
  const linkIssues = (result?.invalidLinks ?? []).map(normalizeLinkIssue);
  const brokenLinkCount = linkIssues.filter((issue) => issue.kind === 'broken').length;
  const unreachableLinkCount = linkIssues.length - brokenLinkCount;
  const [linkProgress, setLinkProgress] = useState({ checked: 0, total: 0, uniqueUrls: 0 });

  useEffect(() => {
    void scanService.getCached(cacheHours).then((cached) => {
      if (cached.success && cached.data) {
        setResult(cached.data);
        setProgress(100);
      }
    });
  }, [cacheHours, setProgress, setResult]);

  const runScan = async () => {
    setRunning(true);
    setError(null);
    setProgress(0);
    setLinkProgress({ checked: 0, total: 0, uniqueUrls: 0 });
    const scan = await scanService.run(bookmarks, scannerSettings, setProgress, (checked, total, uniqueUrls) => {
      setLinkProgress({ checked, total, uniqueUrls });
    });
    setRunning(false);

    if (!scan.success) {
      setError(scan.error);
      return;
    }

    setResult(scan.data);
    setProgress(100);
    await scanService.saveCache(scan.data);
  };

  const refreshStructureResults = async () => {
    const currentBookmarks = useBookmarkStore.getState().bookmarks;
    const structure = await scanService.runStructureScan(currentBookmarks, setProgress);
    if (!structure.success) {
      setError(structure.error);
      return;
    }

    const bookmarkIds = new Set(flattenBookmarks(currentBookmarks).map((bookmark) => bookmark.id));
    const previousInvalidLinks = useScanStore.getState().result?.invalidLinks ?? [];
    const nextResult = {
      ...structure.data,
      invalidLinks: previousInvalidLinks.filter((invalid) => bookmarkIds.has(invalid.node.id))
    };
    setResult(nextResult);
    setProgress(100);
    await scanService.saveCache(nextResult);
  };

  const runRepair = async (repair: () => Promise<void>) => {
    setRunning(true);
    setError(null);
    await repair();

    const mutationError = useBookmarkStore.getState().error;
    if (mutationError) {
      setError(mutationError);
      setRunning(false);
      return;
    }

    await refreshStructureResults();
    setRunning(false);
  };

  const cleanDuplicateBookmarkGroup = async (group: BookmarkNode[]) => {
    const { duplicateIds } = planDuplicateBookmarkCleanup(group);
    if (duplicateIds.length === 0) return;
    await runRepair(() => deleteBookmarks(duplicateIds));
  };

  const mergeFolderGroup = async (group: BookmarkNode[]) => {
    const [target, ...sources] = group;
    if (!target || sources.length === 0) return;
    await runRepair(() => mergeFolders(sources.map((folder) => folder.id), target.id));
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
        {linkProgress.total > 0 ? (
          <div className="mt-2 text-xs text-slate-500">
            {t('scanner.linkProgress', {
              checked: linkProgress.checked,
              total: linkProgress.total,
              unique: linkProgress.uniqueUrls
            })}
          </div>
        ) : null}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <ResultPanel title={t('scanner.duplicateBookmarks')} value={result?.duplicateBookmarkGroups.length ?? 0}>
          {(result?.duplicateBookmarkGroups ?? []).slice(0, 8).map((group) => {
            const cleanup = planDuplicateBookmarkCleanup(group);
            return (
              <div key={group.map((item) => item.id).join('-')} className="rounded-md border p-3 text-sm">
                <div className="break-all font-medium">{group[0]?.url}</div>
                <div className="mt-1 text-xs text-slate-500">{group.length} items</div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  {t('scanner.keep')}: {cleanup.keeper?.path?.join(' / ') ?? cleanup.keeper?.title}
                </div>
                <Button
                  className="mt-3 h-8 px-3 text-xs"
                  variant="outline"
                  disabled={mutating || running}
                  onClick={() => void cleanDuplicateBookmarkGroup(group)}
                >
                  {t('scanner.keepOldest', { count: cleanup.duplicateIds.length })}
                </Button>
              </div>
            );
          })}
        </ResultPanel>
        <ResultPanel title={t('scanner.duplicateFolders')} value={result?.duplicateFolderGroups.length ?? 0}>
          {(result?.duplicateFolderGroups ?? []).slice(0, 8).map((group) => (
            <div key={group.map((item) => item.id).join('-')} className="rounded-md border p-3 text-sm">
              <div className="font-medium">{group[0]?.title}</div>
              <div className="mt-1 text-xs text-slate-500">{group.length} folders</div>
              <div className="mt-1 text-xs text-slate-500">Keep: {group[0]?.path?.join(' / ') ?? group[0]?.title}</div>
              <Button className="mt-3 h-8 px-3 text-xs" variant="outline" disabled={mutating || running} onClick={() => void mergeFolderGroup(group)}>
                {t('scanner.mergeFolders')}
              </Button>
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
        <ResultPanel title={t('scanner.invalidLinks')} value={result?.invalidLinks.length ?? 0}>
          {linkIssues.slice(0, 3).map((invalid) => (
            <div key={invalid.node.id} className="rounded-md border p-3 text-sm">
              <div className="truncate font-medium">{invalid.node.title || invalid.node.url}</div>
              <div className={`mt-1 truncate text-xs ${invalid.kind === 'broken' ? 'text-red-600' : 'text-amber-600'}`}>
                {invalid.kind === 'broken' ? t('linkIssues.broken') : t('linkIssues.unreachable')} · {t(`linkIssues.reasons.${invalid.reason}`)}
              </div>
            </div>
          ))}
          {linkIssues.length > 0 ? (
            <div className="space-y-3 pt-2">
              <div className="text-xs text-slate-500">
                {t('scanner.linkIssueSummary', { broken: brokenLinkCount, unreachable: unreachableLinkCount })}
              </div>
              <Link to="/scanner/links" className="inline-flex h-9 w-full items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700">
                {t('scanner.viewAllLinkIssues', { count: linkIssues.length })}
              </Link>
            </div>
          ) : null}
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
