export const en = {
  appName: 'Bookmark Management Master',
  tagline: 'Local-first bookmark workspace',
  navigation: {
    dashboard: 'Dashboard',
    scanner: 'Scanner',
    manager: 'Manager',
    importExport: 'Import / Export',
    settings: 'Settings'
  },
  actions: { menu: 'Open navigation' },
  footer: { localOnly: 'All bookmark data stays in your browser.' },
  foundation: { ready: 'Foundation route ready. Product behavior will be added in the next milestones.' },
  pages: {
    dashboard: { title: 'Dashboard', description: 'Statistics, search, shortcuts, and recent activity will live here.' },
    scanner: { title: 'Scanner', description: 'Worker-based duplicate, folder, and broken-link scans will live here.' },
    manager: { title: 'Bookmark Manager', description: 'The virtualized bookmark and folder management workspace will live here.' },
    importExport: { title: 'Import / Export', description: 'Validated import, export, conflict resolution, and backups will live here.' },
    settings: { title: 'Settings', description: 'Theme, language, scanner, cache, and backup preferences will live here.' }
  }
} as const;
