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
  footer: { localOnly: '所有书签数据仅保留在浏览器中。' },
  foundation: { ready: '基础路由已就绪，产品功能将在后续里程碑中添加。' },
  pages: {
    dashboard: { title: '仪表盘', description: '统计、搜索、快捷键和最近活动将在此提供。' },
    scanner: { title: '扫描检测', description: '基于 Worker 的重复项、文件夹和失效链接扫描将在此提供。' },
    manager: { title: '书签管理', description: '虚拟化书签列表和文件夹管理工作区将在此提供。' },
    importExport: { title: '导入 / 导出', description: '安全导入、导出、冲突处理和备份将在此提供。' },
    settings: { title: '设置', description: '主题、语言、扫描、缓存和备份配置将在此提供。' }
  }
} as const;
