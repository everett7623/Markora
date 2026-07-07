import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_CACHE_HOURS, STORAGE_KEYS } from '../shared/constants/storage';
import type { AppSettings, BackupRecord, BookmarkNode } from '../shared/types';
import { storageService } from './storageService';
import { backupService } from './backupService';

const bookmarks: BookmarkNode[] = [
  {
    id: 'root',
    title: 'Root',
    children: [{ id: '1', title: 'Example', url: 'https://example.com', parentId: 'root' }]
  }
];

function settings(backupRetention: number): AppSettings {
  return {
    theme: 'system',
    language: 'en',
    scanner: { timeoutMs: 15000, concurrency: 8, retryCount: 1 },
    cacheHours: DEFAULT_CACHE_HOURS,
    backupRetention,
    autoScan: false
  };
}

function backup(id: string, createdAt: number): BackupRecord {
  return { id, reason: 'delete', createdAt, bookmarks };
}

describe('backupService', () => {
  beforeEach(async () => {
    await storageService.set(STORAGE_KEYS.settings, settings(2));
    await storageService.set(STORAGE_KEYS.backups, []);
  });

  it('uses the persisted backup retention when creating backups', async () => {
    await storageService.set(STORAGE_KEYS.backups, [backup('old-1', 1), backup('old-2', 2)]);

    const created = await backupService.create(bookmarks, 'import');
    const backups = await backupService.list();

    expect(created.success).toBe(true);
    expect(backups.success).toBe(true);
    if (backups.success) {
      expect(backups.data).toHaveLength(2);
      expect(backups.data[0].reason).toBe('import');
      expect(backups.data.map((item) => item.id)).not.toContain('old-2');
    }
  });

  it('trims existing backups when retention is lowered', async () => {
    await storageService.set(STORAGE_KEYS.backups, [backup('one', 1), backup('two', 2), backup('three', 3)]);

    const trimmed = await backupService.trimToRetention(1);

    expect(trimmed.success).toBe(true);
    if (trimmed.success) expect(trimmed.data.map((item) => item.id)).toEqual(['one']);
  });
});
