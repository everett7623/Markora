export const en = {
  appName: 'Bookmark Management Master',
  tagline: 'Local-first bookmark workspace',
  navigation: {
    dashboard: 'Dashboard',
    scanner: 'Scanner',
    manager: 'Bookmark Manager',
    importExport: 'Import / Export',
    settings: 'Settings'
  },
  actions: { menu: 'Open navigation' },
  search: {
    placeholder: 'Search bookmarks by title, URL, or folder path',
    shortcut: 'Ctrl K'
  },
  footer: { localOnly: 'All bookmark data stays in your browser.' },
  foundation: { ready: 'Foundation route ready. Product behavior will be added in the next milestones.' },
  dashboard: {
    cards: {
      bookmarks: 'Total bookmarks',
      folders: 'Folders',
      duplicates: 'Duplicate bookmarks',
      invalid: 'Invalid links'
    },
    searchHistory: 'Recent searches',
    noSearchHistory: 'Search from the top bar to build a local history.'
  },
  scanner: {
    run: 'Run scan',
    progress: 'Scan progress',
    duplicateBookmarks: 'Duplicate bookmarks',
    duplicateFolders: 'Duplicate folders',
    emptyFolders: 'Empty folders'
  },
  pages: {
    dashboard: { title: 'Dashboard', description: 'Live bookmark statistics, global search history, and scan signals.' },
    scanner: { title: 'Scanner', description: 'Worker-based duplicate bookmark, duplicate folder, and empty-folder scans.' },
    manager: { title: 'Bookmark Manager', description: 'The virtualized bookmark and folder management workspace will live here.' },
    importExport: { title: 'Import / Export', description: 'Validated import, export, conflict resolution, and backups will live here.' },
    settings: { title: 'Settings', description: 'Theme, language, scanner, cache, and backup preferences will live here.' }
  }
} as const;
