import { Download, FileJson, FileText, Import, Table } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportService } from '../../services/exportService';
import { Button } from '../../shared/components/ui/Button';
import type { ExportFormat } from '../../shared/types';
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
  const [error, setError] = useState<string | null>(null);
  const bookmarkCount = useMemo(() => flattenBookmarks(bookmarks).length, [bookmarks]);

  const exportFormat = (format: ExportFormat) => {
    const file = exportService.createFile(bookmarks, format);
    if (!file.success) {
      setError(file.error);
      return;
    }

    setError(null);
    downloadFile(file.data.filename, file.data.mimeType, file.data.content);
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
        <span className="inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
          <Import size={22} />
        </span>
        <h2 className="mt-4 font-semibold">{t('importExport.importTitle')}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{t('importExport.importDescription')}</p>
      </section>
    </div>
  );
}
