import { AlertTriangle, Download, FileJson, FileText, Import, Table } from 'lucide-react';
import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportService } from '../../services/exportService';
import { importService } from '../../services/importService';
import { Button } from '../../shared/components/ui/Button';
import type { ExportFormat, ImportConflictStrategy, ImportPreview } from '../../shared/types';
import { flattenBookmarks } from '../../shared/utils/bookmarks';
import { useBookmarkStore } from '../../stores/bookmarkStore';

const exportOptions: Array<{ format: ExportFormat; icon: typeof FileJson }> = [
  { format: 'json', icon: FileJson },
  { format: 'csv', icon: Table },
  { format: 'txt', icon: FileText },
  { format: 'opml', icon: FileText },
  { format: 'html', icon: Download }
];

function downloadFile(filename: string, mimeType: string, content: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ImportExportPage() {
  const { t } = useTranslation();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const mutating = useBookmarkStore((state) => state.mutating);
  const importBookmarks = useBookmarkStore((state) => state.importBookmarks);
  const [error, setError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const bookmarkCount = useMemo(() => flattenBookmarks(bookmarks).length, [bookmarks]);
  const importableCount = importPreview ? importPreview.items.length - importPreview.conflicts.length : 0;

  const exportFormat = (format: ExportFormat) => {
    const file = exportService.createFile(bookmarks, format);
    if (!file.success) {
      setError(file.error);
      return;
    }

    setError(null);
    downloadFile(file.data.filename, file.data.mimeType, file.data.content);
  };

  const previewImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    const html = await file.text();
    const preview = await importService.previewHtml(html, bookmarks);
    setImporting(false);

    if (!preview.success) {
      setError(preview.error);
      setImportPreview(null);
      return;
    }

    if (preview.data.items.length === 0) {
      setError(t('importExport.noImportItems'));
      setImportPreview(null);
      return;
    }

    setImportPreview(preview.data);
  };

  const runImport = async (strategy: ImportConflictStrategy) => {
    if (!importPreview) return;
    await importBookmarks(importPreview, strategy);
    setImportPreview(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('pages.importExport.title')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('pages.importExport.description')}</p>
      </div>

      <section className="rounded-lg border bg-white p-5 shadow-sm dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">{t('importExport.exportTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {bookmarkCount.toLocaleString()} {t('importExport.bookmarksReady')}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {exportOptions.map(({ format, icon: Icon }) => (
            <Button key={format} variant="outline" className="justify-start" onClick={() => exportFormat(format)} disabled={bookmarkCount === 0}>
              <Icon size={16} />
              {t(`importExport.formats.${format}`)}
            </Button>
          ))}
        </div>

        {error && <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      </section>

      <section className="rounded-lg border border-dashed bg-white p-5 shadow-sm dark:bg-slate-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
              <Import size={22} />
            </span>
            <h2 className="mt-4 font-semibold">{t('importExport.importTitle')}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{t('importExport.importDescription')}</p>
          </div>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900">
            <Import size={16} />
            {importing ? t('importExport.parsing') : t('importExport.chooseHtml')}
            <input type="file" accept=".html,.htm,text/html" className="sr-only" onChange={(event) => void previewImportFile(event)} disabled={importing || mutating} />
          </label>
        </div>

        {importPreview ? (
          <div className="mt-5 rounded-lg border bg-slate-50 p-4 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-medium">{t('importExport.previewTitle')}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {importPreview.items.length.toLocaleString()} {t('importExport.detected')} · {importPreview.conflicts.length.toLocaleString()}{' '}
                  {t('importExport.conflicts')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void runImport('skip')} disabled={importableCount === 0 || mutating}>
                  {t('importExport.importNewOnly')} ({importableCount})
                </Button>
                <Button variant="outline" onClick={() => void runImport('import-all')} disabled={mutating}>
                  {t('importExport.importAll')}
                </Button>
              </div>
            </div>

            {importPreview.conflicts.length > 0 ? (
              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                <div className="flex items-center gap-2 font-medium">
                  <AlertTriangle size={16} />
                  {t('importExport.conflictResolver')}
                </div>
                <p className="mt-1">{t('importExport.conflictDescription')}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
