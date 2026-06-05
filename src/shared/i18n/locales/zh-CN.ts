export const zhCN = {
  appName: '书签管理大师',
  tagline: '本地优先的书签工作区',
  navigation: {
    dashboard: '仪表盘',
    scanner: '扫描检测',
    manager: '书签管理',
    importExport: '导入 / 导出',
    settings: '设置'
  },
  actions: { menu: '打开导航' },
  search: {
    placeholder: '按标题、网址或文件夹路径搜索书签',
    shortcut: 'Ctrl K'
  },
  footer: { localOnly: '所有书签数据仅保留在浏览器本地。' },
  foundation: { ready: '基础路由已就绪，产品功能将在后续里程碑中添加。' },
  dashboard: {
    cards: {
      bookmarks: '总书签',
      folders: '文件夹',
      duplicates: '重复书签',
      invalid: '失效链接'
    },
    searchHistory: '最近搜索',
    noSearchHistory: '在顶部搜索栏搜索后，会在本地保留最近 10 条记录。'
  },
  scanner: {
    run: '开始扫描',
    progress: '扫描进度',
    duplicateBookmarks: '重复书签',
    duplicateFolders: '重复文件夹',
    emptyFolders: '空文件夹'
  },
  manager: {
    allBookmarks: '全部书签',
    bookmarkList: '书签列表',
    visibleItems: '条可见',
    deleteSelected: '删除选中',
    columns: {
      title: '标题',
      url: '网址',
      folder: '文件夹'
    }
  },
  pages: {
    dashboard: { title: '仪表盘', description: '展示实时书签统计、全局搜索历史和扫描信号。' },
    scanner: { title: '扫描检测', description: '基于 Worker 执行重复书签、重复文件夹和空文件夹扫描。' },
    manager: { title: '书签管理', description: '虚拟化书签列表和文件夹管理工作区将在此提供。' },
    importExport: { title: '导入 / 导出', description: '安全导入、导出、冲突处理和备份将在此提供。' },
    settings: { title: '设置', description: '主题、语言、扫描、缓存和备份配置将在此提供。' }
  }
} as const;
