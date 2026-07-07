import { DEFAULT_BACKUP_RETENTION, STORAGE_KEYS } from '../shared/constants/storage';
import type { AppSettings, BackupRecord, BookmarkNode, Result } from '../shared/types';
import { storageService } from './storageService';

function normalizeRetention(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(1, Math.min(value, 50))
    : DEFAULT_BACKUP_RETENTION;
}

async function getRetention(): Promise<Result<number>> {
  const stored = await storageService.get<AppSettings>(STORAGE_KEYS.settings);
  if (!stored.success) return stored;

  return {
    success: true,
    data: normalizeRetention(stored.data?.data.backupRetention)
  };
}

async function readBackups(): Promise<Result<BackupRecord[]>> {
  const existing = await storageService.get<BackupRecord[]>(STORAGE_KEYS.backups);
  return existing.success ? { success: true, data: existing.data?.data ?? [] } : existing;
}

async function saveBackups(backups: BackupRecord[]): Promise<Result<BackupRecord[]>> {
  const saved = await storageService.set(STORAGE_KEYS.backups, backups);
  return saved.success ? { success: true, data: backups } : saved;
}

export const backupService = {
  async list(): Promise<Result<BackupRecord[]>> {
    const [existing, retention] = await Promise.all([readBackups(), getRetention()]);
    if (!existing.success) return existing;
    if (!retention.success) return retention;

    const backups = existing.data.slice(0, retention.data);
    if (backups.length !== existing.data.length) return saveBackups(backups);
    return { success: true, data: backups };
  },

  async create(bookmarks: BookmarkNode[], reason: BackupRecord['reason']): Promise<Result<BackupRecord>> {
    const [existing, retention] = await Promise.all([readBackups(), getRetention()]);
    if (!existing.success) return existing;
    if (!retention.success) return retention;

    const backup: BackupRecord = {
      id: crypto.randomUUID(),
      reason,
      createdAt: Date.now(),
      bookmarks
    };
    const backups = [backup, ...existing.data].slice(0, retention.data);
    const saved = await storageService.set(STORAGE_KEYS.backups, backups);
    return saved.success ? { success: true, data: backup } : saved;
  },

  async trimToRetention(retention?: number): Promise<Result<BackupRecord[]>> {
    const existing = await readBackups();
    if (!existing.success) return existing;

    const normalized = normalizeRetention(retention);
    const backups = existing.data.slice(0, normalized);
    if (backups.length === existing.data.length) return { success: true, data: backups };
    return saveBackups(backups);
  },

  async remove(id: string): Promise<Result<string>> {
    const existing = await readBackups();
    if (!existing.success) return existing;

    const backups = existing.data.filter((backup) => backup.id !== id);
    const saved = await storageService.set(STORAGE_KEYS.backups, backups);
    return saved.success ? { success: true, data: id } : saved;
  }
};
