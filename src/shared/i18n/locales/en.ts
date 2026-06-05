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
  manager: {
    allBookmarks: 'All bookmarks',
    bookmarkList: 'Bookmark list',
    visibleItems: 'visible',
    deleteSelected: 'Delete selected',
    columns: {
      title: 'Title',
      url: 'URL',
      folder: 'Folder'
    }
  },
  importExport: {
    exportTitle: 'Export bookmarks',
    importTitle: 'Import bookmarks',
    importDescription: 'HTML import, conflict resolution, and pre-import backups are reserved for the next milestone.',
    bookmarksReady: 'bookmarks ready',
    formats: {
      json: 'JSON',
      csv: 'CSV',
      txt: 'TXT',
      opml: 'OPML',
      html: 'HTML'
    }
  },
  pages: {
    dashboard: { title: 'Dashboard', description: 'Live bookmark statistics, global search history, and scan signals.' },
    scanner: { title: 'Scanner', description: 'Worker-based duplicate bookmark, duplicate folder, and empty-folder scans.' },
    manager: { title: 'Bookmark Manager', description: 'Virtualized bookmark and folder management for large collections.' },
    importExport: { title: 'Import / Export', description: 'Export your local bookmark data in standard portable formats.' },
    settings: { title: 'Settings', description: 'Theme, language, scanner, cache, and backup preferences will live here.' }
  }
} as const;
