import i18n from '../shared/i18n';
import type { BookmarkNode, BookmarkRestoreItem, Result } from '../shared/types';
import { collectFolderRestoreEntries, getMissingBookmarkRestoreItems } from '../shared/utils/backupRestore';
import { backupService } from './backupService';

function folderPathKey(path: string[]): string {
  return JSON.stringify(path);
}

function indexFolders(bookmarks: BookmarkNode[]): {
  ids: Set<string>;
  byPath: Map<string, string>;
} {
  const ids = new Set<string>();
  const byPath = new Map<string, string>();
  for (const folder of collectFolderRestoreEntries(bookmarks)) {
    ids.add(folder.id);
    const key = folderPathKey(folder.path);
    if (!byPath.has(key)) byPath.set(key, folder.id);
  }
  return { ids, byPath };
}

async function rollbackCreated(ids: string[]): Promise<void> {
  for (const id of [...ids].reverse()) {
    try {
      await chrome.bookmarks.remove(id);
    } catch {
      // Best-effort rollback continues so later-created parent folders can still be removed.
    }
  }
}

async function resolveParentId(
  item: BookmarkRestoreItem,
  folders: ReturnType<typeof indexFolders>,
  createdIds: string[]
): Promise<string | undefined> {
  if (item.parentId && folders.ids.has(item.parentId)) return item.parentId;
  if (item.path.length === 0) throw new Error(i18n.t('serviceErrors.restoreRootFolderMissing'));

  let parentId: string | undefined;
  const path: string[] = [];
  for (const [index, title] of item.path.entries()) {
    path.push(title);
    const key = folderPathKey(path);
    const existingId = folders.byPath.get(key);
    if (existingId) {
      parentId = existingId;
      continue;
    }
    if (index === 0) throw new Error(i18n.t('serviceErrors.restoreRootFolderMissing'));

    const folder = await chrome.bookmarks.create({ parentId, title });
    createdIds.push(folder.id);
    folders.ids.add(folder.id);
    folders.byPath.set(key, folder.id);
    parentId = folder.id;
  }
  return parentId;
}

async function createMissingBookmarks(items: BookmarkRestoreItem[], current: BookmarkNode[]): Promise<Result<number>> {
  if (!globalThis.chrome?.bookmarks) return { success: true, data: items.length };

  const folders = indexFolders(current);
  const createdIds: string[] = [];
  try {
    for (const item of items) {
      const parentId = await resolveParentId(item, folders, createdIds);
      const bookmark = await chrome.bookmarks.create({ parentId, title: item.title, url: item.url });
      createdIds.push(bookmark.id);
    }
    return { success: true, data: items.length };
  } catch (error) {
    await rollbackCreated(createdIds);
    return { success: false, error: error instanceof Error ? error.message : i18n.t('serviceErrors.restoreBookmarks') };
  }
}

export const backupRestoreService = {
  async restoreMissing(current: BookmarkNode[], snapshot: BookmarkNode[]): Promise<Result<number>> {
    const missing = getMissingBookmarkRestoreItems(current, snapshot);
    if (missing.length === 0) return { success: true, data: 0 };

    const backup = await backupService.create(current, 'restore');
    if (!backup.success) return backup;
    return createMissingBookmarks(missing, current);
  }
};
