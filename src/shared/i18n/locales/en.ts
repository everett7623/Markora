export const en = {
  appName: 'Markora',
  tagline: 'Your local bookmark atlas',
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
    noSearchHistory: 'Search from the top bar to build a local history.',
    recentActivity: 'Recent activity',
    noRecentActivity: 'Actions will appear here as you use the manager.'
  },
  scanner: {
    run: 'Run scan',
    progress: 'Scan progress',
    duplicateBookmarks: 'Duplicate bookmarks',
    duplicateFolders: 'Duplicate folders',
    emptyFolders: 'Empty folders',
    invalidLinks: 'Invalid links',
    keep: 'Keep',
    keepOldest: 'Keep oldest, remove {{count}}',
    mergeFolders: 'Merge folders',
    linkIssueSummary: '{{broken}} confirmed broken, {{unreachable}} could not be verified',
    viewAllLinkIssues: 'Review all {{count}} link issues',
    linkProgress: '{{checked}} / {{total}} bookmarks processed · {{unique}} unique URLs checked'
  },
  linkIssues: {
    title: 'Link issue review',
    description: 'Review confirmed broken links separately from links that could not be verified.',
    back: 'Back to scan summary',
    all: 'All issues',
    broken: 'Confirmed broken',
    unreachable: 'Could not verify',
    deleteSelected: 'Delete selected ({{count}})',
    selectPage: 'Select this page',
    clearSelection: 'Clear selection',
    open: 'Open',
    editUrl: 'Edit URL',
    deleteOne: 'Delete',
    editPrompt: 'Enter the corrected bookmark URL (http:// or https://)',
    deleteConfirm: 'Delete "{{title}}"? A backup will be created first.',
    select: 'Select {{title}}',
    noResults: 'No link issues in this category.',
    previous: 'Previous page',
    next: 'Next page',
    range: 'Showing {{from}}-{{to}} of {{total}}',
    proxyNotice: 'HTTPS checks run through the extension background service and use the browser/system network and proxy configuration. Plain HTTP links are not requested automatically because insecure responses can trigger browser security errors. Open unverified links manually before deleting them.',
    reasons: {
      'not-found': 'The page returned Not Found or Gone',
      'http-error': 'The server returned an HTTP error',
      'server-error': 'The server is temporarily unavailable',
      timeout: 'The request timed out',
      network: 'Network, proxy, DNS, TLS, or regional access failure',
      insecure: 'Insecure HTTP links require manual verification',
      protected: 'Browser store links block automated checks and require manual verification'
    }
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
    importDescription: 'Import Netscape bookmark HTML locally. A backup is created before writing new bookmarks.',
    bookmarksReady: 'bookmarks ready',
    chooseHtml: 'Choose HTML file',
    parsing: 'Parsing...',
    previewTitle: 'Import preview',
    detected: 'detected',
    conflicts: 'conflicts',
    conflictResolver: 'Conflict resolver',
    conflictDescription: 'Matching URLs can be skipped or imported as duplicates.',
    importNewOnly: 'Import new only',
    importAll: 'Import all',
    noImportItems: 'No valid HTTP or HTTPS bookmarks were found in this file.',
    formats: {
      json: 'JSON',
      csv: 'CSV',
      txt: 'TXT',
      opml: 'OPML',
      html: 'HTML'
    }
  },
  settings: {
    appearance: 'Appearance',
    scanner: 'Scanner',
    cache: 'Cache',
    backup: 'Backup',
    theme: 'Theme',
    language: 'Language',
    timeoutMs: 'Request timeout (ms)',
    concurrency: 'Concurrent link checks',
    retryCount: 'Retry count',
    cacheHours: 'Scan cache duration (hours)',
    backupRetention: 'Backups to keep',
    backupManagement: 'Backup management',
    noBackups: 'Backups will appear after delete, import, or restore operations.',
    backupCount: 'Backups available.',
    restoreBackup: 'Restore',
    deleteBackup: 'Delete',
    autoSave: 'Settings are saved automatically and stored locally.',
    themeOptions: {
      system: 'System',
      light: 'Light',
      dark: 'Dark'
    }
  },
  pages: {
    dashboard: { title: 'Dashboard', description: 'Live bookmark statistics, global search history, and scan signals.' },
    scanner: { title: 'Scanner', description: 'Worker-based duplicate bookmark, duplicate folder, and empty-folder scans.' },
    manager: { title: 'Bookmark Manager', description: 'Virtualized bookmark and folder management for large collections.' },
    importExport: { title: 'Import / Export', description: 'Export your local bookmark data in standard portable formats.' },
    settings: { title: 'Settings', description: 'Configure theme, language, scanner, cache, and backup preferences.' }
  }
} as const;
