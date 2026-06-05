import { DEFAULT_BACKUP_RETENTION, STORAGE_KEYS } from '../shared/constants/storage';
import type { BackupRecord, BookmarkNode, Result } from '../shared/types';
import { storageService } from './storageService';

export const backupService = {
  async create(bookmarks: BookmarkNode[], reason: BackupRecord['reason']): Promise<Result<BackupRecord>> {
    const existing = await storageService.get<BackupRecord[]>(STORAGE_KEYS.backups);
    if (!existing.success) return existing;

    const backup: BackupRecord = {
      id: crypto.randomUUID(),
      reason,
      createdAt: Date.now(),
      bookmarks
    };
    const backups = [backup, ...(existing.data?.data ?? [])].slice(0, DEFAULT_BACKUP_RETENTION);
    const saved = await storageService.set(STORAGE_KEYS.backups, backups);
    return saved.success ? { success: true, data: backup } : saved;
  }
};
