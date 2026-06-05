export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'zh_CN' | 'en';

export interface BookmarkNode extends chrome.bookmarks.BookmarkTreeNode {
  path?: string[];
  tags?: string[];
  status?: 'valid' | 'invalid' | 'timeout' | 'unknown';
}

export interface ScannerConfig {
  timeoutMs: number;
  concurrency: number;
  retryCount: number;
}

export interface AppSettings {
  theme: Theme;
  language: Language;
  scanner: ScannerConfig;
  cacheHours: number;
  backupRetention: number;
}

export interface BookmarkStats {
  totalBookmarks: number;
  totalFolders: number;
  duplicateBookmarks: number;
  invalidLinks: number;
}

export interface StoredValue<T> {
  schemaVersion: number;
  data: T;
  updatedAt: number;
}

export interface BackupRecord {
  id: string;
  reason: 'delete' | 'import' | 'merge' | 'restore';
  createdAt: number;
  bookmarks: BookmarkNode[];
}

export interface ScanResult {
  duplicateBookmarkGroups: BookmarkNode[][];
  duplicateFolderGroups: BookmarkNode[][];
  emptyFolders: BookmarkNode[];
  invalidLinks: BookmarkNode[];
}

export interface ScanCache {
  result: ScanResult;
  createdAt: number;
}

export interface ScanWorkerRequest {
  type: 'scan';
  bookmarks: BookmarkNode[];
}

export interface ScanWorkerResponse {
  type: 'progress' | 'complete' | 'error';
  progress: number;
  result?: ScanResult;
  error?: string;
}
