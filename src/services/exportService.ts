import i18n from '../shared/i18n';
import type { BookmarkNode, ExportFormat, ExportWorkerResponse, Result } from '../shared/types';
import { serializeExport } from '../shared/utils/exportFormats';

export interface ExportFile {
  filename: string;
  mimeType: string;
  content: string;
}

const formatConfig: Record<ExportFormat, { extension: string; mimeType: string }> = {
  json: { extension: 'json', mimeType: 'application/json;charset=utf-8' },
  csv: { extension: 'csv', mimeType: 'text/csv;charset=utf-8' },
  txt: { extension: 'txt', mimeType: 'text/plain;charset=utf-8' },
  opml: { extension: 'opml', mimeType: 'text/x-opml;charset=utf-8' },
  html: { extension: 'html', mimeType: 'text/html;charset=utf-8' }
};

function serializeWithWorker(bookmarks: BookmarkNode[], format: ExportFormat): Promise<Result<string>> {
  if (typeof Worker === 'undefined') {
    try {
      return Promise.resolve({ success: true, data: serializeExport(bookmarks, format) });
    } catch (error) {
      return Promise.resolve({ success: false, error: error instanceof Error ? error.message : i18n.t('serviceErrors.exportBookmarks') });
    }
  }

  let worker: Worker;
  try {
    worker = new Worker(new URL('../workers/exportFile.worker.ts', import.meta.url), { type: 'module' });
  } catch (error) {
    return Promise.resolve({ success: false, error: error instanceof Error ? error.message : i18n.t('serviceErrors.exportBookmarks') });
  }

  return new Promise((resolve) => {
    const finish = (result: Result<string>) => {
      worker.terminate();
      resolve(result);
    };

    worker.onmessage = (event: MessageEvent<ExportWorkerResponse>) => {
      if (event.data.type === 'complete' && event.data.content !== undefined) {
        finish({ success: true, data: event.data.content });
      } else {
        finish({ success: false, error: event.data.error ?? i18n.t('serviceErrors.exportBookmarks') });
      }
    };
    worker.onerror = () => finish({ success: false, error: i18n.t('serviceErrors.exportBookmarks') });
    try {
      worker.postMessage({ type: 'create-export', bookmarks, format });
    } catch (error) {
      finish({ success: false, error: error instanceof Error ? error.message : i18n.t('serviceErrors.exportBookmarks') });
    }
  });
}

function serialize(bookmarks: BookmarkNode[], format: ExportFormat): Result<string> {
  try {
    return { success: true, data: serializeExport(bookmarks, format) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : i18n.t('serviceErrors.exportBookmarks') };
  }
}

export const exportService = {
  toJson: (bookmarks: BookmarkNode[]) => serialize(bookmarks, 'json'),
  toCsv: (bookmarks: BookmarkNode[]) => serialize(bookmarks, 'csv'),
  toTxt: (bookmarks: BookmarkNode[]) => serialize(bookmarks, 'txt'),
  toOpml: (bookmarks: BookmarkNode[]) => serialize(bookmarks, 'opml'),
  toHtml: (bookmarks: BookmarkNode[]) => serialize(bookmarks, 'html'),

  async createFile(bookmarks: BookmarkNode[], format: ExportFormat): Promise<Result<ExportFile>> {
    const content = await serializeWithWorker(bookmarks, format);
    if (!content.success) return content;

    return {
      success: true,
      data: {
        filename: `bookmarks-${new Date().toISOString().slice(0, 10)}.${formatConfig[format].extension}`,
        mimeType: formatConfig[format].mimeType,
        content: content.data
      }
    };
  }
};
