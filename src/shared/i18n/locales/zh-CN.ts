export const zhCN = {
  appName: '书签星图 Markora',
  tagline: '本地优先的书签图谱',
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
    noSearchHistory: '在顶部搜索栏搜索后，会在本地保留最近 10 条记录。',
    recentActivity: '最近活动',
    noRecentActivity: '使用管理功能后，操作记录会显示在这里。'
  },
  scanner: {
    run: '开始扫描',
    progress: '扫描进度',
    duplicateBookmarks: '重复书签',
    duplicateFolders: '重复文件夹',
    emptyFolders: '空文件夹',
    invalidLinks: '失效链接',
    keep: '保留',
    keepOldest: '保留最早项，删除其余 {{count}} 项',
    mergeFolders: '合并文件夹',
    linkIssueSummary: '确认失效 {{broken}} 条，无法验证 {{unreachable}} 条',
    viewAllLinkIssues: '查看并处理全部 {{count}} 条',
    linkProgress: '已处理 {{checked}} / {{total}} 个书签 · 本次实际检测 {{unique}} 个唯一网址'
  },
  linkIssues: {
    title: '链接问题处理',
    description: '将确认失效与暂时无法验证的链接分开检查和处理。',
    back: '返回扫描摘要',
    all: '全部问题',
    broken: '确认失效',
    unreachable: '无法验证',
    deleteSelected: '删除选中（{{count}}）',
    selectPage: '选择当前页',
    clearSelection: '清空选择',
    open: '打开验证',
    editUrl: '修改网址',
    deleteOne: '删除',
    editPrompt: '输入修正后的书签网址（必须以 http:// 或 https:// 开头）',
    deleteConfirm: '确定删除“{{title}}”吗？删除前会自动创建备份。',
    select: '选择 {{title}}',
    noResults: '此分类下没有链接问题。',
    previous: '上一页',
    next: '下一页',
    range: '显示第 {{from}}-{{to}} 条，共 {{total}} 条',
    proxyNotice: 'HTTPS 检测通过扩展后台服务执行，并沿用浏览器或系统的网络与代理配置。为避免不安全响应触发浏览器安全错误，HTTP 链接不会被自动请求。删除前请先人工打开无法验证的链接。',
    reasons: {
      'not-found': '页面返回不存在或已删除',
      'http-error': '服务器返回 HTTP 错误',
      'server-error': '服务器暂时不可用',
      timeout: '请求超时',
      network: '网络、代理、DNS、TLS 或地区访问失败',
      insecure: '不安全的 HTTP 链接需要人工打开验证',
      protected: '浏览器商店会阻止自动检测，需要人工打开验证'
    }
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
  importExport: {
    exportTitle: '导出书签',
    importTitle: '导入书签',
    importDescription: 'HTML 导入、冲突处理和导入前备份将在下一阶段实现。',
    bookmarksReady: '个书签可导出',
    formats: {
      json: 'JSON',
      csv: 'CSV',
      txt: 'TXT',
      opml: 'OPML',
      html: 'HTML'
    }
  },
  settings: {
    appearance: '外观',
    scanner: '扫描',
    cache: '缓存',
    backup: '备份',
    theme: '主题',
    language: '语言',
    timeoutMs: '请求超时（毫秒）',
    concurrency: '并发链接检查数',
    retryCount: '重试次数',
    cacheHours: '扫描缓存时长（小时）',
    backupRetention: '保留备份数量',
    autoSave: '设置会自动保存，并仅存储在本地。',
    themeOptions: {
      system: '跟随系统',
      light: '浅色',
      dark: '深色'
    }
  },
  pages: {
    dashboard: { title: '仪表盘', description: '展示实时书签统计、全局搜索历史和扫描信号。' },
    scanner: { title: '扫描检测', description: '基于 Worker 执行重复书签、重复文件夹、空文件夹和失效链接扫描。' },
    manager: { title: '书签管理', description: '面向大量书签的虚拟化列表和文件夹管理工作区。' },
    importExport: { title: '导入 / 导出', description: '用标准格式导出本地书签数据。' },
    settings: { title: '设置', description: '配置主题、语言、扫描、缓存和备份偏好。' }
  }
} as const;
