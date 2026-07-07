import type { BookmarkNode, ImportBookmarkItem, ImportConflict, ImportHtmlWorkerResponse, ImportPreview, Result } from '../shared/types';
import i18n from '../shared/i18n';
import { flattenBookmarks } from '../shared/utils/bookmarks';
import { parseNetscapeBookmarksHtml } from '../shared/utils/importHtml';

function findConflicts(items: ImportBookmarkItem[], bookmarks: BookmarkNode[]): ImportConflict[] {
  const existingByUrl = new Map(flattenBookmarks(bookmarks).map((bookmark) => [bookmark.url, bookmark]));
  return items
    .map((item) => {
      const existing = existingByUrl.get(item.url);
      return existing ? { imported: item, existing } : null;
    })
    .filter((item): item is ImportConflict => item !== null);
}

async function parseWithWorker(html: string): Promise<Result<ImportBookmarkItem[]>> {
  if (typeof Worker === 'undefined') {
    return { success: true, data: parseNetscapeBookmarksHtml(html) };
  }

  return new Promise((resolve) => {
    const worker = new Worker(new URL('../workers/importHtml.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<ImportHtmlWorkerResponse>) => {
      worker.terminate();
      if (event.data.type === 'complete') {
        resolve({ success: true, data: event.data.items ?? [] });
      } else {
        resolve({ success: false, error: event.data.error ?? i18n.t('serviceErrors.parseBookmarkHtml') });
      }
    };
    worker.onerror = () => {
      worker.terminate();
      resolve({ success: false, error: i18n.t('serviceErrors.parseBookmarkHtml') });
    };
    worker.postMessage({ type: 'parse-html', html });
  });
}

export const importService = {
  async previewHtml(html: string, bookmarks: BookmarkNode[]): Promise<Result<ImportPreview>> {
    const parsed = await parseWithWorker(html);
    if (!parsed.success) return parsed;

    return {
      success: true,
      data: {
        items: parsed.data,
        conflicts: findConflicts(parsed.data, bookmarks)
      }
    };
  }
};
