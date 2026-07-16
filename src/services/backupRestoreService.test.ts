import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BackupRecord, BookmarkNode } from '../shared/types';
import { backupRestoreService } from './backupRestoreService';
import { backupService } from './backupService';

const current: BookmarkNode[] = [{
  id: '0',
  title: '',
  children: [{
    id: '1',
    title: 'Bookmarks Bar',
    parentId: '0',
    children: [{
      id: '10',
      title: 'Work',
      parentId: '1',
      children: [{ id: '101', title: 'GitHub', url: 'https://github.com', parentId: '10' }]
    }]
  }]
}];

const safetyBackup: BackupRecord = {
  id: 'safety',
  reason: 'restore',
  createdAt: 123,
  bookmarks: current
};

describe('backupRestoreService', () => {
  const create = vi.fn();
  const remove = vi.fn();

  beforeEach(() => {
    create.mockReset();
    remove.mockReset();
    remove.mockResolvedValue(undefined);
    vi.spyOn(backupService, 'create').mockResolvedValue({ success: true, data: safetyBackup });
    vi.stubGlobal('chrome', { bookmarks: { create, remove } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('reuses a live parent ID and recreates a missing folder path', async () => {
    let nextId = 1;
    create.mockImplementation(async (details: Parameters<typeof chrome.bookmarks.create>[0]) => ({
      id: `created-${nextId++}`,
      title: details.title ?? '',
      url: details.url,
      parentId: details.parentId
    }));
    const snapshot: BookmarkNode[] = [{
      id: '0',
      title: '',
      children: [{
        id: '1',
        title: 'Bookmarks Bar',
        parentId: '0',
        children: [
          {
            id: '10',
            title: 'Work',
            parentId: '1',
            children: [{ id: '201', title: 'MDN', url: 'https://developer.mozilla.org', parentId: '10' }]
          },
          {
            id: '20',
            title: 'Archive',
            parentId: '1',
            children: [{ id: '202', title: 'Example', url: 'https://example.com', parentId: '20' }]
          }
        ]
      }]
    }];

    await expect(backupRestoreService.restoreMissing(current, snapshot)).resolves.toEqual({ success: true, data: 2 });
    expect(backupService.create).toHaveBeenCalledWith(current, 'restore');
    expect(create).toHaveBeenNthCalledWith(1, { parentId: '10', title: 'MDN', url: 'https://developer.mozilla.org' });
    expect(create).toHaveBeenNthCalledWith(2, { parentId: '1', title: 'Archive' });
    expect(create).toHaveBeenNthCalledWith(3, { parentId: 'created-2', title: 'Example', url: 'https://example.com' });
    expect(remove).not.toHaveBeenCalled();
  });

  it('does not create another safety backup when the snapshot has no missing bookmarks', async () => {
    await expect(backupRestoreService.restoreMissing(current, current)).resolves.toEqual({ success: true, data: 0 });
    expect(backupService.create).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('rolls back every item created before a restore failure', async () => {
    create
      .mockResolvedValueOnce({ id: 'created-1', title: 'First', url: 'https://first.test', parentId: '1' })
      .mockRejectedValueOnce(new Error('create failed'));
    const snapshot: BookmarkNode[] = [{
      id: '0',
      title: '',
      children: [{
        id: '1',
        title: 'Bookmarks Bar',
        parentId: '0',
        children: [
          { id: '201', title: 'First', url: 'https://first.test', parentId: '1' },
          { id: '202', title: 'Second', url: 'https://second.test', parentId: '1' }
        ]
      }]
    }];

    await expect(backupRestoreService.restoreMissing(current, snapshot)).resolves.toEqual({ success: false, error: 'create failed' });
    expect(remove).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith('created-1');
  });
});
