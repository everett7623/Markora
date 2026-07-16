export const CURRENT_SCHEMA_VERSION = 1;
export const STORAGE_KEYS = {
  settings: 'settings',
  backups: 'backups',
  scanCache: 'scan-cache',
  searchHistory: 'search-history',
  recentActivities: 'recent-activities',
  bookmarkTags: 'bookmark-tags',
  ignoredLinkUrls: 'ignored-link-urls',
  aiSettings: 'ai-settings',
  availableExtensionUpdate: 'available-extension-update'
} as const;

export const DEFAULT_BACKUP_RETENTION = 10;
export const DEFAULT_CACHE_HOURS = 24;
