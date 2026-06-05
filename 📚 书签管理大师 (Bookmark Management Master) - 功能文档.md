**书签管理大师** (Bookmark Management Master) 是一款功能强大、UI美观的Chrome/Edge浏览器书签管理扩展插件。

**核心理念：** 本扩展采用**全屏页面模式**，点击扩展图标后在新标签页中打开完整的管理界面，**不使用任何弹窗（popup）**。用户体验将类似于Chrome的设置页面或扩展管理页面，提供专业、现代、多语言、多功能的书签管理体验。

*   **扩展名称**: 书签管理大师 (Bookmark Management Master)
*   **扩展类型**: Chrome/Edge浏览器扩展
*   **显示模式**: 全屏模式（新标签页打开，无弹窗）
*   **布局方式**: 左右分栏布局
*   **语言支持**: 中英双语（默认中文）
*   **作者信息**: Jensfrank
*   **版本**: v1.0.0

---

#### 一、核心技术要求与访问方式

**1.1 技术栈要求**

*   **前端框架**: Vue 3 + Vite 或 React 18
*   **UI组件库**: Element Plus (Vue) 或 Ant Design (React)
*   **样式方案**: Tailwind CSS + 自定义主题
*   **图标库**: Lucide Icons 或 Heroicons
*   **国际化**: vue-i18n (Vue) 或 react-i18next (React)
*   **构建工具**: Vite
*   **类型检查**: TypeScript

**1.2 浏览器API使用**

*   `chrome.bookmarks` - 书签操作
*   `chrome.storage.local` - 本地存储用户设置和缓存数据
*   `chrome.runtime` - 插件信息、消息传递、打开选项页
*   `chrome.tabs` - 标签页操作（如创建新标签页打开管理界面）

**1.3 访问方式**

1.  **点击扩展图标**: 在新标签页打开管理界面。
2.  **右键扩展图标**: 选择"选项"打开管理界面。
3.  **快捷键**: 可配置快捷键直接打开（如 Alt+B）。
4.  **扩展管理页**: 通过Chrome扩展管理页的"选项"按钮进入。

---

## 🎯 核心功能

### 1. 仪表盘 (Dashboard)

- ✅ 全局搜索框 (防抖300ms, 支持拼音)
- ✅ 4张统计卡片 (总书签/文件夹/失效/重复)
- ✅ 快速操作按钮
- ✅ 智能推荐卡片

### 2. 扫描检测 (Scanner)

- ✅ 重复书签检测 (URL完全匹配)
- ✅ 空文件夹清理
- ✅ 失效链接检查 (Web Worker)
- ✅ 重复文件夹合并

### 3. 管理整理 (Manager)

- ✅ 树形文件夹结构
- ✅ 批量操作 (移动/删除/编辑)
- ✅ 标签系统
- ✅ 拖拽排序

### 4. 导入导出 (Import/Export)

- ✅ 导入: HTML格式
- ✅ 导出: HTML/JSON/CSV/TXT
- ✅ 冲突处理策略
- ✅ 自动备份

### 5. 设置中心 (Settings)

- ✅ 主题切换 (明暗/自动)
- ✅ 语言切换 (中英文)
- ✅ 扫描配置
- ✅ 备份设置

#### 二、UI设计要求

**2.1 整体布局 (全屏页面)**

```
┌─────────────────────────────────────────────────┐
│  📚 书签管理大师    总书签:1234 文件夹:56  ⚙️   │ <- 顶部栏（固定）
├────────────┬────────────────────────────────────┤
│            │                                    │
│   导航栏    │          内容展示区                │ <- 主体区域（100vh）
│            │                                    │
│ 📊 仪表盘   │                                    │
│ 🔍 扫描检测  │                                    │
│ 📁 管理整理  │                                    │
│ 📥 导入导出  │                                    │
│ ⚙️ 设置     │                                    │
│            │                                    │
├────────────┴────────────────────────────────────┤
│ v1.0.0            © 2025 Jensfrank             │ <- 底部栏（固定）
└─────────────────────────────────────────────────┘
```

**2.2 布局规格**

*   **页面宽度**: 100% 浏览器宽度
*   **页面高度**: 100vh（全屏高度）
*   **左侧导航栏**: 固定宽度 240px
*   **右侧内容区**: 自适应剩余宽度
*   **顶部栏高度**: 60px
*   **底部栏高度**: 40px
*   **最小支持分辨率**: 1280x720

**2.3 视觉设计要求**

*   **配色方案**:
    *   主色：`#4F46E5` (蓝紫色)
    *   辅助色：`#10B981` (绿色-成功)、`#EF4444` (红色-警告)、`#F59E0B` (橙色-警告)
    *   背景：`#F9FAFB` (浅色模式) / `#1F2937` (深色模式)
    *   边框：`#E5E7EB` (浅色) / `#374151` (深色)
*   **按钮样式**:
    *   主要按钮：填充背景色，白色文字
    *   次要按钮：边框样式，主色文字
    *   危险按钮：红色背景或边框
*   **圆角**: 4px(按钮), 8px(卡片), 12px(模态框)
*   **阴影**:
    *   小：`0 1px 2px 0 rgba(0, 0, 0, 0.05)`
    *   中：`0 4px 6px -1px rgba(0, 0, 0, 0.1)`
    *   大：`0 10px 15px -3px rgba(0, 0, 0, 0.1)`
*   **动画**: 平滑过渡动画（300ms）
*   **全屏适配**: 充分利用屏幕空间，大屏优化（1920x1080及以上），内容区域最大宽度不限制，响应式断点：1280px、1536px、1920px。

---

#### 三、功能模块详细说明

**3.1 仪表盘 (Dashboard)**

*   **搜索栏**: 实时搜索书签（标题和URL），支持拼音搜索，搜索历史记录，高亮显示匹配结果。
*   **书签管理概况（卡片展示）**: 显示总书签数、文件夹数、失效链接（可点击跳转）、重复书签（可点击跳转）。
*   **快速操作（按钮组）**: 快速扫描、导出书签、管理整理、设置选项。
*   **AI增强**: 可在此处展示AI生成的“待办事项”或“智能建议卡片”，例如“有X个重复书签待处理”。

**3.2 扫描检测 (Scan & Detect)**
这个扫描检测板块：上下布局

上布局：
*   **2.1 查找重复书签**: 基于URL完全匹配检测，分组展示重复项，智能推荐保留策略（保留最早、最近访问、特定文件夹），批量选择和删除，显示每组重复数量。
    *   **AI增强**: 未来可扩展至通过内容相似度进行模糊重复检测。
*    合并重复文件夹**: 检测同名文件夹，智能合并策略（保留父级、合并到指定位置、处理重复书签），合并预览，撤销操作支持。
    *   **AI增强**: AI可分析文件夹内容和命名习惯，智能推荐合并或优化文件夹结构。
*   **2.2 删除空文件夹**: 递归扫描所有层级，显示空文件夹完整路径，预览列表，一键批量删除，支持排除特定文件夹。
*   **2.3 查找失效链接**: HTTP/HTTPS链接有效性检测，可配置检测参数（请求超时时间、请求间隔延迟、最大并发请求数），错误类型分类（404, 500, Timeout, Network Error, DNS Failed），批量处理（删除、编辑URL、标记忽略）。
    *   **AI增强**: AI可对失效链接进行优先级排序，或尝试智能修复（例如，通过归档服务查找替代链接）。
*   **2.4 全面扫描**: 同时执行以上三项检测，分步骤显示进度，汇总结果展示，生成详细扫描报告。

下布局：
4个功能的任务进度和结果展示区域。


**3.3 管理整理 (Manage & Organize)**

*   **3.1 重复书签管理**: 树形表格展示，复选框选择，操作按钮（智能选择、全选/反选、删除选中、合并到文件夹）。
*   **3.2 书签整理**:
    *   **排序功能**: 按名称（A-Z/Z-A）、按添加日期（新到旧/旧到新）、按访问频率、自定义排序。
    *   **文件夹操作**: 合并文件夹、拆分文件夹、重命名批量。
    *   **批量编辑**: 批量添加标签、批量移动、批量修改URL前缀。
*   **AI增强**: AI智能分类/标签建议（利用AI分析网页内容，自动生成推荐标签），AI推荐整理方案（根据书签属性和内容，建议更优的文件夹结构或移动操作）。

**3.4 导入导出 (Import & Export)**

*   **4.1 导入功能**: 支持格式：HTML书签文件。导入选项：合并到现有书签、替换所有书签、导入后立即整理。冲突处理：跳过重复、覆盖现有、创建副本。
*   **4.2 导出功能**:
    *   **导出格式**: HTML（浏览器标准格式）、JSON（结构化数据）、CSV（表格格式）、TXT（纯文本列表）。
    *   **导出选项**: 选择文件夹、包含子文件夹、导出日期范围、包含访问记录。
*   **AI增强**: AI可分析导入的书签数据，提供初步的整理建议或识别潜在的重复项。

**3.5 设置 (Settings)**

*   **5.1 通用设置 (General Settings)**
    *   **语言切换**: 中文/English（实时生效）。
    *   **主题模式**: 浅色/深色/跟随系统。
    *   **自动备份**: 启用/禁用、备份频率（每天/每周/每月）、保留份数。
    *   **快捷键设置**: 自定义快捷键。
*   **5.2 扫描设置 (Scan Settings)**
    *   **排除文件夹**: 下拉选择要排除的文件夹，已排除文件夹列表显示，支持多选排除，重置为默认按钮。
    *   **失效链接检查器**: 请求超时时间（默认15秒）、请求间隔延迟（默认0.1秒）、最大并发请求数（默认4个）。
    *   **重复检测设置**: 检测范围（全部书签/指定文件夹）、忽略参数（忽略URL参数/锚点）、相似度阈值（完全匹配/模糊匹配）。
*   **5.3 性能设置 (Performance)**
    *   **缓存设置**: 启用扫描结果缓存、缓存有效期（小时）、清除缓存按钮。
    *   **资源限制**: 最大内存使用、CPU使用限制。
*   **5.4 数据管理 (Data Management)**
    *   **导入导出设置**: 默认导出格式、自动添加时间戳、压缩导出文件。
    *   **备份恢复**: 查看备份列表、恢复到指定版本、删除旧备份。
*   **5.5 关于 (About)**
    *   **插件信息**: 版本号、更新日志、开源协议（MIT）。
    *   **作者信息**: 作者、GitHub（链接）、Email（联系邮箱）。
    *   **支持项目**: 说明文字、捐赠按钮（PayPal, Buy Me a Coffee, 支付宝/微信）。
    *   **帮助与反馈**: 使用教程、常见问题、报告问题、功能建议。

---

#### 四、国际化配置

*   **语言文件结构**: 使用 `_locales` 文件夹，包含 `en/messages.json` 和 `zh_CN/messages.json`。
*   **实现**: 结合 `chrome.i18n` API 和前端国际化库（`vue-i18n` 或 `react-i18next`）实现界面文本的动态切换。

#### 五、性能优化要求

1.  **虚拟滚动**: 对于书签列表、扫描结果等大量数据展示区域，采用虚拟滚动技术以减少DOM元素数量，提升渲染性能。
2.  **分页加载**: 扫描结果等可能庞大的数据，优先使用分页加载，避免一次性加载所有数据造成卡顿。
3.  **Web Worker**: 将耗时且计算密集型的操作（如失效链接检测、书签去重算法）放入Web Worker线程中执行，避免阻塞主线程，保持UI流畅。
4.  **缓存策略**: 
    *   扫描结果缓存24小时，减少重复扫描，可在设置中配置或清除。
    *   书签数据本身应实时更新，但可以通过浏览器内置的书签API事件监听来高效管理。
5.  **防抖节流**: 搜索输入框、窗口大小调整等频繁触发的事件，使用防抖 (debounce) 或节流 (throttle) 技术，优化响应性能。

---

#### 六、安全与隐私

1.  **数据处理**: 所有书签数据和用户偏好设置都在本地浏览器处理和存储，不上传至任何服务器。
2.  **权限申请**: 最小化权限要求，仅申请实现功能所需的必要权限。
3.  **数据导出**: 支持用户导出完整书签数据，便于备份和迁移。
4.  **隐私政策**: 提供清晰的隐私说明文档，阐明数据处理方式和用户权利。

---

#### 七、错误处理

1.  **友好提示**: 所有错误显示用户友好的提示信息，避免技术性错误代码暴露。
2.  **错误日志**: 记录详细错误信息（仅限于开发者模式或用户同意），用于调试和问题报告。
3.  **降级方案**: 在部分功能失败时，提供备用方案或告知用户影响范围。
4.  **重试机制**: 对于网络请求（如失效链接检测），实现自动重试机制，增加健壮性。

---

#### 八、测试要求

1.  **单元测试**: 核心功能模块（如书签API封装、扫描逻辑、数据处理）覆盖率 >80%。
2.  **E2E测试**: 覆盖主要用户流程（如打开管理页、添加/删除书签、执行扫描、导出书签）。
3.  **性能测试**: 在10000+书签的场景下，确保UI响应速度和扫描效率符合预期。
4.  **兼容性**: 确保在Chrome 90+和Edge 90+版本中正常运行和显示。

---

#### 九、发布准备

1.  **`manifest.json` 配置**: 确保符合Manifest V3规范，包含所有必要的元数据、权限和配置。
2.  **图标资源**: 提供16x16, 48x48, 128x128等不同尺寸的高质量图标。
3.  **商店截图**: 准备多张1280x800尺寸的精美UI截图，展示扩展的主要功能和亮点。
4.  **隐私政策文档**: 编写清晰的隐私政策，说明数据处理方式。
5.  **使用说明文档**: 提供详细的使用教程和常见问题解答。

---

#### 十、开发优先级

**Phase 1 (MVP) - 核心功能**

*   [x] 基础框架搭建 (Vue 3/React 18 + Vite + Tailwind CSS + Element Plus/Ant Design)
*   [x] 仪表盘页面 (搜索栏、概况卡片、快速操作)
*   [x] 查找重复书签 (基于URL完全匹配)
*   [x] 删除空文件夹
*   [x] 查找失效链接 (基础检测)
*   [x] 基础导出功能（HTML）

**Phase 2 - 扩展功能**

*   [x] 合并重复文件夹
*   [x] 批量管理功能 (批量移动、修改URL前缀)
*   [x] 多格式导入导出 (JSON, CSV, TXT 导出；HTML 导入选项及冲突处理)
*   [x] 中英文切换 (国际化框架集成)
*   [x] 排除文件夹设置 (扫描检测模块)

**Phase 3 - 高级功能**

*   [x] 主题切换 (浅色/深色/跟随系统)
*   [x] 数据统计图表 (仪表盘可视化)
*   [x] 自动备份功能
*   [x] AI智能整理建议 (初步的智能分类/标签建议)
*   [ ] 云同步（可选，可能需要后端支持）

---

#### 十一、实现建议与架构

	**11.1 浏览器扩展架构 (Manifest V3)**

*   **Service Worker (`background.ts`)**: 作为后台脚本，处理以下任务：
    *   监听扩展图标点击 (`chrome.action.onClicked`)，触发打开全屏管理页面。
    *   监听快捷键命令 (`chrome.commands.onCommand`)，触发打开全屏管理页面。
    *   作为消息总线，处理UI层（Options Page）发来的耗时请求（如调用 `chrome.bookmarks` API，或未来的AI处理请求），并通过消息返回结果。
    *   **AI集成接口**: 在Service Worker中封装对AI模型或API的调用，例如进行网页内容分析。
*   **Options Page (全屏UI - `options.html` / `src/options/`)**: 这是本扩展的核心，所有的用户交互和功能实现都在此全屏页面中。
    *   通过 `manifest.json` 中的 `options_ui` 字段配置，并设置 `"open_in_tab": true` 来实现新标签页全屏打开。
    *   提供沉浸式的用户体验，如同一个独立的Web应用。
*   **内容脚本 (Content Scripts)**: 当前版本核心功能不涉及，但未来若需在浏览页面上进行高亮、批注等操作时可引入。
*   **Permissions**: 
    *   `"bookmarks"`: 读写书签。
    *   `"storage"`: 存储本地用户设置和缓存。
    *   `"tabs"`: 创建和管理标签页。
    *   `"activeTab"`: 如果需要获取当前活动页面的URL进行快速保存。
    *   `"unlimitedStorage"`: 如果考虑实现网页快照或更复杂的本地数据存储。
    *   `"host_permissions": ["<all_urls>"]`: **重要**，用于失效链接检测（需要向外部URL发送请求）和AI分析网页内容。

**11.2 文件结构**

```
bookmark-manager-extension/
├── public/                                 # 扩展公共资源
│   ├── icons/                              # 扩展图标
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   ├── manifest.json                       # Manifest V3 扩展配置文件
│   └── _locales/                           # 国际化语言资源
│       ├── en/
│       │   └── messages.json               # 英文翻译
│       ├── zh_CN/
│       │   └── messages.json               # 简体中文翻译
│       └── ...
├── src/
│   ├── background/
│   │   ├── background.ts                   # Service Worker 主入口，事件监听，消息处理
│   │   └── aiIntegration.ts                # AI模型或API调用封装，由Service Worker调用
│   ├── options/                            # **全屏管理页面 (核心UI和逻辑)**
│   │   ├── index.html                      # Options Page 的入口 HTML
│   │   ├── main.ts                         # Vue/React 应用的入口文件 (挂载 App.vue/jsx)
│   │   ├── App.vue/jsx                     # 根组件，实现顶部栏、侧边导航和内容区布局
│   │   ├── router/                         # 路由配置 (Vue Router / React Router)
│   │   ├── store/                          # 状态管理 (Pinia / Zustand / Redux Toolkit)
│   │   ├── views/                          # 各功能模块的页面组件
│   │   │   ├── DashboardView.vue/jsx
│   │   │   ├── ScanDetectView.vue/jsx
│   │   │   ├── ManageOrganizeView.vue/jsx
│   │   │   ├── ImportExportView.vue/jsx
│   │   │   └── SettingsView.vue/jsx
│   │   ├── components/                     # 可复用UI组件 (封装 Element Plus/Ant Design 或自定义)
│   │   │   ├── GlobalHeader.vue/jsx
│   │   │   ├── GlobalFooter.vue/jsx
│   │   │   ├── SidebarNav.vue/jsx
│   │   │   ├── BookmarkCard.vue/jsx
│   │   │   ├── DuplicateGroupItem.vue/jsx
│   │   │   └── ...
│   │   ├── services/                       # 业务逻辑层，封装浏览器API和数据处理
│   │   │   ├── bookmarkService.ts          # 封装 chrome.bookmarks API
│   │   │   ├── storageService.ts           # 封装 chrome.storage.local
│   │   │   ├── scanService.ts              # 扫描逻辑 (可集成 Web Worker)
│   │   │   ├── exportService.ts
│   │   │   └── aiService.ts                # UI层调用 AI 功能的接口 (通过 Service Worker 桥接)
│   │   ├── utils/                          # 工具函数
│   │   │   ├── i18n.ts                     # 国际化配置
│   │   │   ├── common.ts                   # 通用工具函数
│   │   │   └── styles/                     # Tailwind CSS 配置和自定义主题
│   │   └── assets/                         # 全屏页面的静态资源 (图片, 自定义字体等)
│   ├── types/                              # TypeScript 类型定义
│   │   └── index.d.ts
├── package.json                            # 项目依赖和脚本
├── tsconfig.json                           # TypeScript 配置
├── vite.config.ts                          # Vite 构建工具配置
└── README.md
```

**11.3 AI工具代码植入便利性**

*   **模块化和职责分离**: AI功能封装在独立的 `background/aiIntegration.ts` 和 `options/services/aiService.ts` 中，易于AI工具理解和生成。
*   **统一通信机制**: UI通过 `chrome.runtime.sendMessage` 请求Service Worker执行AI任务，Service Worker响应结果。这种明确的接口使AI工具能够轻松插入调用代码。
*   **清晰的类型定义**: 使用TypeScript为AI功能的输入（如URL、书签对象）和输出（如推荐标签、摘要）定义接口，为AI生成代码提供严格的类型约束。
*   **组件级集成**: AI生成的结果可直接集成到前端组件中，例如在书签详情卡片上展示AI摘要，或在标签输入框中提供AI建议。

## 🎯 核心功能要求

### 1️⃣ 仪表盘 (Dashboard) - 核心页面

**布局要求** : 顶部全局搜索 + 4列统计卡片网格 + 底部快速操作区

#### 必需功能

- **🔍 全局搜索** （集成到顶部栏）:
    - 实时搜索，防抖300ms
    - 支持中文拼音搜索
    - 搜索历史记录（最多10条）
    - 结果高亮显示
    - 快捷键 `Ctrl/Cmd + K` 快速聚焦
- **📊 统计概览卡片** :


#### AI增强功能（可选）

- 智能推荐卡片: "发现 15 个可合并的文件夹"
- 使用习惯分析: "本周访问最多的 5 个书签"

### 2️⃣ 扫描检测 (Scanner)

**布局要求** : 上部功能选择选项卡 + 下部结果展示区

#### 扫描模块要求

1. **🔄 重复书签检测**
    
    - 基于URL完全匹配算法
    - 智能分组展示重复项
    - 支持批量选择删除
    - 提供保留策略推荐
2. **📁 空文件夹清理**
    
    - 递归扫描所有层级文件夹
    - 路径可视化展示
    - 批量清理预览功能
3. **❌ 失效链接检查**
    
    typescript
    
    ```typescript
    interfaceLinkCheckConfig{
      timeout:number// 请求超时 (15秒)
      delay:number// 请求间隔 (100ms)
      concurrent:number// 并发数 (4个)
      retryTimes:number// 重试次数 (2次)
    }
    ```
    
    - HTTP状态码分类统计
    - 详细错误类型展示
    - 提供修复建议
4. **🔄 重复文件夹合并**
    
    - 同名文件夹检测
    - 内容智能对比
    - 合并策略推荐

#### 性能优化要求

- 使用Web Worker执行检测任务
- 实现虚拟滚动处理大量结果
- 提供实时进度条显示
- 结果缓存机制（24小时有效）

### 3️⃣ 管理整理 (Manager)

**布局要求** : 左侧文件夹树形结构 + 右侧书签详情/操作区

#### 整理功能要求

- **📂 文件夹管理** :
    - 支持拖拽排序
    - 批量重命名功能
    - 层级结构调整
    - 自定义颜色标签
- **🏷️ 标签系统** :
    - 自定义标签创建
    - 批量标签应用
    - 按标签过滤显示
    - AI智能分类建议
- **⚡ 批量操作** :
    - 多选操作界面
    - 批量移动书签
    - 批量编辑属性
    - 操作撤销功能

#### AI智能功能（高级特性）

typescript

```typescript
interfaceAIAnalysis{
  category:string// 网站分类
  tags:string[]// 推荐标签  
  summary:string// 内容摘要
  priority:number// 重要度评分
}
```

### 4️⃣ 导入导出 (Import/Export)

**布局要求** : 左右分栏布局 (导入功能 | 导出功能)

#### 格式支持要求

- **导入格式** : HTML (Chrome/Firefox/Safari标准格式)
- **导出格式** : HTML, JSON, CSV, TXT, OPML

#### 高级选项

- **冲突处理策略** : 跳过/覆盖/重命名选项
- **选择性导出** : 支持指定文件夹/日期范围
- **压缩打包** : ZIP格式导出选项
- **自动备份** : 导入前自动创建备份点

### 5️⃣ 设置中心 (Settings)

**布局要求** : 左侧设置导航 + 右侧设置面板

#### 设置分类要求

typescript

```typescript
interfaceSettingsConfig{
  appearance:{
    theme:'light'|'dark'|'auto'// 主题模式
    language:'zh-CN'|'en-US'// 语言设置
    density:'compact'|'comfortable'|'spacious'// 显示密度
}
  search:{
    enableHistory:boolean// 启用搜索历史
    maxHistoryItems:number// 最大历史条数
    enablePinyin:boolean// 启用拼音搜索
}
  scanning:{
    excludeFolders:string[]// 排除文件夹
    linkChecker:LinkCheckConfig// 链接检查配置
    duplicateDetection:DuplicateConfig// 重复检测配置
}
  backup:{
    enabled:boolean// 启用自动备份
    frequency:'daily'|'weekly'|'monthly'// 备份频率
    keepCount:number// 保留备份数量
}
performance:{
    cacheEnabled:boolean// 启用缓存
    maxCacheSize:number// 最大缓存大小
    workerEnabled:boolean// 启用Web Worker
}
}
```

## 💻 关键实现要求

### TypeScript类型定义

typescript

```typescript
// 核心书签类型
interfaceBookmarkNode{
  id:string
  title:string
  url?:string
  parentId:string
  children?:BookmarkNode[]
  dateAdded:number
  dateGroupModified?:number
}

// 统计信息类型
interfaceBookmarkStats{
  total:number// 总书签数
  folders:number// 文件夹数
  invalid:number// 失效链接数
  duplicates:number// 重复书签数
  lastUpdate:number// 最后更新时间
}

// 扫描结果类型
interfaceScanResult{
  duplicates:DuplicateGroup[]
  invalidLinks:InvalidLink[]
  emptyFolders:BookmarkNode[]
}

// 重复书签组
interfaceDuplicateGroup{
  url:string
  bookmarks:BookmarkNode[]
  count:number
}

// 失效链接
interfaceInvalidLink{
  bookmark:BookmarkNode
  error:string
  statusCode?:number
  suggestions?:string[]
}
```

### Zustand状态管理结构

typescript

```typescript
// stores/bookmarkStore.ts
import{ create }from'zustand'
import{ devtools }from'zustand/middleware'

interfaceBookmarkState{
  bookmarks:BookmarkNode[]
  stats:BookmarkStats|null
  loading:boolean
  searchResults:BookmarkNode[]
  searchQuery:string
}

interfaceBookmarkActions{
fetchBookmarks:()=>Promise<void>
searchBookmarks:(query:string)=>Promise<void>
refreshStats:()=>Promise<void>
updateBookmark:(id:string, updates:Partial<BookmarkNode>)=>Promise<void>
deleteBookmarks:(ids:string[])=>Promise<void>
}

exportconst useBookmarkStore =create<BookmarkState&BookmarkActions>()(
devtools(
(set, get)=>({
// State
      bookmarks:[],
      stats:null,
      loading:false,
      searchResults:[],
      searchQuery:'',
      
// Actions
fetchBookmarks:async()=>{
set({ loading:true})
try{
const bookmarks =await bookmarkService.getAllBookmarks()
set({ bookmarks })
awaitget().refreshStats()
}finally{
set({ loading:false})
}
},
      
searchBookmarks:async(query:string)=>{
set({ searchQuery: query })
if(!query.trim()){
set({ searchResults:[]})
return
}
const results =await bookmarkService.searchBookmarks(query)
set({ searchResults: results })
},
      
refreshStats:async()=>{
const stats =await bookmarkService.getBookmarkStats()
set({ stats })
},
      
updateBookmark:async(id:string, updates:Partial<BookmarkNode>)=>{
await bookmarkService.updateBookmark(id, updates)
awaitget().fetchBookmarks()
},
      
deleteBookmarks:async(ids:string[])=>{
await bookmarkService.deleteBookmarks(ids)
awaitget().fetchBookmarks()
}
}),
{ name:'bookmark-store'}
)
)
```

### 自定义Hook要求

typescript

```typescript
// hooks/useSearch.ts
import{ useState, useEffect, useMemo }from'react'
import{ debounce }from'lodash-es'

exportfunctionuseSearch(){
const[query, setQuery]=useState('')
const[results, setResults]=useState<BookmarkNode[]>([])
const[loading, setLoading]=useState(false)
  
// 防抖搜索
const debouncedSearch =useMemo(
()=>debounce(async(searchQuery:string)=>{
if(!searchQuery.trim()){
setResults([])
return
}
setLoading(true)
try{
const searchResults =await bookmarkService.searchBookmarks(searchQuery)
setResults(searchResults)
}finally{
setLoading(false)
}
},300),
[]
)
  
useEffect(()=>{
debouncedSearch(query)
return()=> debouncedSearch.cancel()
},[query, debouncedSearch])
  
return{ query, setQuery, results, loading }
}

// hooks/useVirtualList.ts - 虚拟滚动优化
interfaceVirtualListOptions{
  itemHeight:number
  containerHeight:number
}

exportfunctionuseVirtualList<T>(
  items:T[],
  options:VirtualListOptions
){
const[scrollTop, setScrollTop]=useState(0)
  
const visibleItems =useMemo(()=>{
const start =Math.floor(scrollTop / options.itemHeight)
const end = start +Math.ceil(options.containerHeight/ options.itemHeight)
    
return items.slice(start, end).map((item, index)=>({
      item,
      index: start + index,
      top:(start + index)* options.itemHeight
}))
},[items, scrollTop, options])
  
return{ visibleItems, scrollTop, setScrollTop }
}

// hooks/useKeyboardShortcut.ts - 快捷键支持
exportfunctionuseKeyboardShortcut(
  keys:string[],
callback:()=>void,
  deps:React.DependencyList=[]
){
useEffect(()=>{
consthandleKeyDown=(event:KeyboardEvent)=>{
const pressed = keys.every(key =>{
switch(key){
case'ctrl':return event.ctrlKey
case'cmd':return event.metaKey
case'shift':return event.shiftKey
case'alt':return event.altKey
default:return event.key.toLowerCase()=== key.toLowerCase()
}
})
      
if(pressed){
        event.preventDefault()
callback()
}
}
    
document.addEventListener('keydown', handleKeyDown)
return()=>document.removeEventListener('keydown', handleKeyDown)
}, deps)
}
```

### 顶部栏组件实现要求

请实现一个功能完整的顶部栏组件，包含：

1. **Logo区域** : 扩展名称和图标
2. **搜索区域** : 居中的全局搜索框，支持快捷键
3. **统计区域** : 显示书签总数、文件夹数等关键数据
4. **控制区域** : 主题切换、语言选择、设置按钮

具体布局要求：

tsx

```tsx
// components/Layout/AppHeader.tsx 结构示例
importReact,{ useRef, useEffect }from'react'
import{Input,Button,Space,Dropdown}from'antd'
import{ 
SearchOutlined, 
SettingOutlined, 
BookOutlined,
SunOutlined,
MoonOutlined,
GlobalOutlined
}from'@ant-design/icons'
import{ useBookmarkStore }from'../../stores/bookmarkStore'
import{ useTheme }from'../../hooks/useTheme'
import{ useKeyboardShortcut }from'../../hooks/useKeyboardShortcut'

interfaceAppHeaderProps{
onNavigate:(path:string)=>void
}

exportconstAppHeader:React.FC<AppHeaderProps>=({ onNavigate })=>{
const searchInputRef =useRef<any>(null)
const{ stats, searchBookmarks }=useBookmarkStore()
const{ theme, toggleTheme }=useTheme()
  
// 快捷键支持 Ctrl/Cmd + K
useKeyboardShortcut(['ctrl','k'],()=>{
    searchInputRef.current?.focus()
})
  
useKeyboardShortcut(['cmd','k'],()=>{
    searchInputRef.current?.focus()
})
  
consthandleSearch=(value:string)=>{
searchBookmarks(value)
}
  
return(
<headerclassName="app-header bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
<divclassName="flex items-center justify-between h-16 px-6">
{/* Logo 区域 */}
<divclassName="flex items-center space-x-3 w-72">
<BookOutlinedclassName="text-2xl text-blue-600"/>
<spanclassName="text-lg font-semibold text-gray-900 dark:text-white">
            书签管理大师
</span>
</div>
        
{/* 搜索区域 */}
<divclassName="flex-1 max-w-2xl mx-8">
<Input
ref={searchInputRef}
placeholder="搜索书签标题或网址... (Ctrl+K)"
prefix={<SearchOutlined/>}
size="large"
className="w-full"
onChange={(e)=>handleSearch(e.target.value)}
allowClear
/>
</div>
        
{/* 功能区域 */}
<divclassName="flex items-center space-x-6">
{/* 统计信息 */}
<divclassName="hidden lg:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
<divclassName="flex items-center space-x-1">
<spanclassName="font-medium text-blue-600">{stats?.total ||0}</span>
<span>书签</span>
</div>
<divclassName="flex items-center space-x-1">
<spanclassName="font-medium text-green-600">{stats?.folders ||0}</span>
<span>文件夹</span>
</div>
{(stats?.invalid ||0)>0&&(
<divclassName="flex items-center space-x-1">
<spanclassName="font-medium text-red-600">{stats?.invalid}</span>
<span>失效</span>
</div>
)}
</div>
          
{/* 控制按钮 */}
<Spacesize="small">
{/* 主题切换 */}
<Button
type="text"
icon={theme ==='dark'?<SunOutlined/>:<MoonOutlined/>}
onClick={toggleTheme}
title="切换主题"
/>
            
{/* 语言选择 */}
<Dropdown
menu={{
                items:[
{ key:'zh-CN', label:'简体中文'},
{ key:'en-US', label:'English'}
]
}}
>
<Button
type="text"
icon={<GlobalOutlined/>}
title="语言设置"
/>
</Dropdown>
            
{/* 设置按钮 */}
<Button
type="text"
icon={<SettingOutlined/>}
onClick={()=>onNavigate('/settings')}
title="设置"
/>
</Space>
</div>
</div>
</header>
)
}
```

## 🚀 性能优化要求

### 必需的性能优化

1. **虚拟滚动** : 处理10,000+书签时必须使用虚拟滚动
2. **防抖搜索** : 搜索输入防抖300ms
3. **Web Worker** : 链接检查和大数据处理必须在Worker中执行
4. **智能缓存** : 扫描结果缓存24小时
5. **懒加载** : 路由级别代码分割
6. **内存管理** : 及时清理事件监听器，避免内存泄漏

### React.memo和useMemo优化

tsx

```tsx
// 使用React.memo优化组件渲染
exportconstBookmarkItem=React.memo<BookmarkItemProps>(({ 
  bookmark, 
  onUpdate, 
  onDelete 
})=>{
// 组件实现...
},(prevProps, nextProps)=>{
// 自定义比较逻辑
return prevProps.bookmark.id=== nextProps.bookmark.id&&
         prevProps.bookmark.title=== nextProps.bookmark.title
})

// 使用useMemo优化计算
const filteredBookmarks =useMemo(()=>{
return bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
)
},[bookmarks, searchQuery])

// 使用useCallback优化函数引用
const handleBookmarkUpdate =useCallback((id:string, updates:Partial<BookmarkNode>)=>{
updateBookmark(id, updates)
},[updateBookmark])
```

### Web Worker实现要求

typescript

```typescript
// workers/link-checker.worker.ts
self.addEventListener('message',async(event)=>{
const{ urls, config }= event.data
  
const results =awaitPromise.allSettled(
    urls.map(url =>checkLink(url, config))
)
  
  self.postMessage({ results })
})

asyncfunctioncheckLink(url:string, config:LinkCheckConfig){
try{
const controller =newAbortController()
const timeoutId =setTimeout(()=> controller.abort(), config.timeout)
    
const response =awaitfetch(url,{ 
      method:'HEAD',
      signal: controller.signal 
})
    
clearTimeout(timeoutId)
return{ url, status: response.ok?'valid':'invalid', code: response.status}
}catch(error){
return{ url, status:'error', error: error.message}
}
}
```

## 🔐 安全与权限要求

### Manifest V3配置

json

```json
{
"manifest_version":3,
"name":"书签管理大师",
"version":"1.0.0",
"description":"专业级书签管理工具，提供智能扫描、批量整理、数据分析等功能",
  
"permissions":[
"bookmarks",
"storage", 
"tabs",
"activeTab"
],
  
"host_permissions":[
"*://*/"
],
  
"optional_permissions":[
"unlimitedStorage"
],
  
"action":{
"default_title":"书签管理大师"
},
  
"options_page":"options.html",
  
"background":{
"service_worker":"background.js"
},
  
"content_security_policy":{
"extension_pages":"script-src 'self'; object-src 'self'"
}
}
```

### 安全要求

- 所有数据仅本地处理，不上传服务器
- 敏感设置使用加密存储
- 输入验证和XSS防护
- 权限最小化原则

## 🧪 测试要求

### 必需测试覆盖

1. **单元测试** : 工具函数测试覆盖率>80%
2. **组件测试** : 核心组件功能测试
3. **集成测试** : 书签API服务测试
4. **性能测试** : 大数据集(10,000+书签)场景测试
5. **E2E测试** : 核心用户流程测试

### 测试示例要求

typescript

```typescript
// 单元测试示例
import{ render, screen, fireEvent, waitFor }from'@testing-library/react'
import{BookmarkItem}from'../components/BookmarkItem'

describe('BookmarkItem',()=>{
test('should render bookmark correctly',()=>{
const bookmark ={
      id:'1',
      title:'Example',
      url:'https://example.com',
      parentId:'0',
      dateAdded:Date.now()
}
    
render(<BookmarkItem bookmark={bookmark}/>)
    
expect(screen.getByText('https://example.com')).toBeInTheDocument()
})
 
test('should handle bookmark deletion',async()=>{
const handleDelete = jest.fn()
const bookmark ={
     id:'1',
     title:'Example',
     url:'https://example.com',
     parentId:'0',
     dateAdded:Date.now()
}
   
render(<BookmarkItem bookmark={bookmark} onDelete={handleDelete}/>)
   
   fireEvent.click(screen.getByRole('button',{ name:/delete/i}))
   
awaitwaitFor(()=>{
expect(handleDelete).toHaveBeenCalledWith('1')
})
})
})

// Hook测试示例
import{ renderHook, act }from'@testing-library/react'
import{ useSearch }from'../hooks/useSearch'

describe('useSearch',()=>{
test('should debounce search queries',async()=>{
const{ result }=renderHook(()=>useSearch())
   
act(()=>{
     result.current.setQuery('test')
})
   
expect(result.current.loading).toBe(false)
   
// 等待防抖完成
awaitwaitFor(()=>{
expect(result.current.loading).toBe(true)
})
})
})

// E2E测试示例
describe('Bookmark Management Flow',()=>{
test('user can scan and clean duplicates',async()=>{
await page.goto('chrome-extension://xxx/options.html')
   
// 导航到扫描页面
await page.click('[data-testid="scanner-nav"]')
   
// 执行重复扫描
await page.click('[data-testid="scan-duplicates-btn"]')
await page.waitForSelector('[data-testid="scan-results"]')
   
// 验证结果
const resultsCount =await page.textContent('[data-testid="duplicates-count"]')
expect(Number(resultsCount)).toBeGreaterThan(0)
   
// 批量删除重复项
await page.click('[data-testid="select-all-duplicates"]')
await page.click('[data-testid="delete-selected-btn"]')
await page.click('[data-testid="confirm-delete"]')
   
// 验证删除成功
await page.waitForSelector('[data-testid="success-message"]')
})
})
```


```

## 🎨 UI/UX细节要求

### 动画和交互

css

```css
/* 全局过渡动画 */
.transition-all{
transition: all 300mscubic-bezier(0.4,0,0.2,1);
}

.transition-colors{
transition: color 300mscubic-bezier(0.4,0,0.2,1),
              background-color 300mscubic-bezier(0.4,0,0.2,1),
              border-color 300mscubic-bezier(0.4,0,0.2,1);
}

/* 加载动画 */
@keyframes spin{
from{transform:rotate(0deg);}
to{transform:rotate(360deg);}
}

.animate-spin{
animation: spin 1s linear infinite;
}

/* 淡入动画 */
@keyframes fadeIn{
from{opacity:0;transform:translateY(10px);}
to{opacity:1;transform:translateY(0);}
}

.animate-fade-in{
animation: fadeIn 300ms ease-out;
}

/* 悬停效果 */
.hover-lift:hover{
transform:translateY(-2px);
box-shadow:08px25pxrgba(0,0,0,0.1);
}
```

### 响应式设计

tsx

```tsx
// hooks/useResponsive.ts - 响应式断点Hook
import{ useState, useEffect }from'react'

interfaceBreakpointConfig{
  sm:number// 640px
  md:number// 768px
  lg:number// 1024px
  xl:number// 1280px
'2xl':number// 1536px
}

const breakpoints:BreakpointConfig={
  sm:640,
  md:768,
  lg:1024,
  xl:1280,
'2xl':1536
}

exportfunctionuseResponsive(){
const[screenSize, setScreenSize]=useState({
    width:window.innerWidth,
    height:window.innerHeight
})
  
useEffect(()=>{
consthandleResize=()=>{
setScreenSize({
        width:window.innerWidth,
        height:window.innerHeight
})
}
    
window.addEventListener('resize', handleResize)
return()=>window.removeEventListener('resize', handleResize)
},[])
  
const isMobile = screenSize.width< breakpoints.md
const isTablet = screenSize.width>= breakpoints.md&& screenSize.width< breakpoints.lg
const isDesktop = screenSize.width>= breakpoints.lg
const isLargeScreen = screenSize.width>= breakpoints.xl
  
return{
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    breakpoints
}
}

// 响应式布局组件示例
exportconstResponsiveGrid:React.FC<{ children:React.ReactNode}>=({ children })=>{
const{ isMobile, isTablet }=useResponsive()
  
constgetGridColumns=()=>{
if(isMobile)return'grid-cols-1'
if(isTablet)return'grid-cols-2'
return'grid-cols-4'
}
  
return(
<divclassName={`grid gap-6 ${getGridColumns()}`}>
{children}
</div>
)
}
```

### 国际化支持

typescript

```typescript
// utils/i18n.ts - 国际化配置
import{ create }from'zustand'

interfaceTranslation{
[key:string]:string|Translation
}

interfaceI18nState{
  locale:'zh-CN'|'en-US'
  messages:Record<string,Translation>
  setLocale:(locale:'zh-CN'|'en-US')=>void
t:(key:string, params?:Record<string,string>)=>string
}

const messages ={
'zh-CN':{
    dashboard:'仪表盘',
    scanner:'扫描检测',
    manager:'管理整理',
    importExport:'导入导出',
    settings:'设置中心',
    stats:{
      total:'总书签',
      folders:'文件夹',
      invalid:'失效链接',
      duplicates:'重复书签'
},
    search:{
      placeholder:'搜索书签标题或网址...',
      shortcut:'Ctrl+K',
      noResults:'未找到相关书签',
      history:'搜索历史'
},
    actions:{
      scan:'开始扫描',
      clean:'清理',
export:'导出',
import:'导入',
delete:'删除',
      edit:'编辑',
      save:'保存',
      cancel:'取消'
}
},
'en-US':{
    dashboard:'Dashboard',
    scanner:'Scanner',
    manager:'Manager',
    importExport:'Import/Export',
    settings:'Settings',
    stats:{
      total:'Total Bookmarks',
      folders:'Folders',
      invalid:'Invalid Links',
      duplicates:'Duplicates'
},
    search:{
      placeholder:'Search bookmark title or URL...',
      shortcut:'Ctrl+K',
      noResults:'No bookmarks found',
      history:'Search History'
},
    actions:{
      scan:'Start Scan',
      clean:'Clean',
export:'Export',
import:'Import',
delete:'Delete',
      edit:'Edit',
      save:'Save',
      cancel:'Cancel'
}
}
}

exportconst useI18n =create<I18nState>((set, get)=>({
  locale:'zh-CN',
  messages,
setLocale:(locale)=>{
set({ locale })
// 保存到本地存储
    chrome.storage.local.set({ locale })
},
t:(key:string, params?:Record<string,string>)=>{
const{ locale, messages }=get()
const keys = key.split('.')
let value:any= messages[locale]
    
for(const k of keys){
      value = value?.[k]
}
    
if(typeof value !=='string'){
return key // 返回key作为fallback
}
    
// 参数替换
if(params){
return value.replace(/\{\{(\w+)\}\}/g,(match, param)=>{
return params[param]|| match
})
}
    
return value
}
}))

// 使用示例
constComponent:React.FC=()=>{
const{ t }=useI18n()
  
return(
<div>
<h1>{t('dashboard')}</h1>
<p>{t('stats.total')}:1234</p>
<input placeholder={t('search.placeholder')}/>
</div>
)
}
```

## 📊 虚拟滚动实现

tsx

```tsx
// components/VirtualList.tsx - 高性能虚拟滚动组件
importReact,{ useState, useEffect, useRef, useMemo }from'react'

interfaceVirtualListProps<T>{
  items:T[]
  itemHeight:number
  containerHeight:number
renderItem:(item:T, index:number)=>React.ReactNode
  className?:string
  overscan?:number// 预渲染项目数量
}

exportfunctionVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className ='',
  overscan =5
}:VirtualListProps<T>){
const[scrollTop, setScrollTop]=useState(0)
const containerRef =useRef<HTMLDivElement>(null)
  
// 计算可见范围
const visibleRange =useMemo(()=>{
const startIndex =Math.max(0,Math.floor(scrollTop / itemHeight)- overscan)
const endIndex =Math.min(
      items.length-1,
Math.ceil((scrollTop + containerHeight)/ itemHeight)+ overscan
)
    
return{ startIndex, endIndex }
},[scrollTop, itemHeight, containerHeight, items.length, overscan])
  
// 可见项目
const visibleItems =useMemo(()=>{
const{ startIndex, endIndex }= visibleRange
const visible =[]
    
for(let i = startIndex; i <= endIndex; i++){
      visible.push({
        index: i,
        item: items[i],
        top: i * itemHeight
})
}
    
return visible
},[items, visibleRange, itemHeight])
  
const totalHeight = items.length* itemHeight
  
consthandleScroll=(e:React.UIEvent<HTMLDivElement>)=>{
setScrollTop(e.currentTarget.scrollTop)
}
  
return(
<div
ref={containerRef}
className={`overflow-auto ${className}`}
style={{ height: containerHeight }}
onScroll={handleScroll}
>
<divstyle={{ height: totalHeight, position:'relative'}}>
{visibleItems.map(({ index, item, top })=>(
<div
key={index}
style={{
              position:'absolute',
              top,
              left:0,
              right:0,
              height: itemHeight
}}
>
{renderItem(item, index)}
</div>
))}
</div>
</div>
)
}

// 使用示例
constBookmarkList:React.FC=()=>{
const{ bookmarks }=useBookmarkStore()
  
return(
<VirtualList
items={bookmarks}
itemHeight={64}
containerHeight={600}
renderItem={(bookmark, index)=>(
<BookmarkItem
key={bookmark.id}
bookmark={bookmark}
index={index}
/>
)}
className="border rounded-lg"
/>
)
}
```

## 🎯 主要页面组件实现

### Dashboard页面

tsx

```tsx
// pages/Dashboard.tsx
importReact,{ useEffect }from'react'
import{Row,Col,Card,Statistic,Button,Space}from'antd'
import{ 
BookOutlined, 
FolderOutlined, 
ExclamationCircleOutlined,
CopyOutlined,
ScanOutlined,
ToolOutlined,
ExportOutlined,
SettingOutlined
}from'@ant-design/icons'
import{ useBookmarkStore }from'../stores/bookmarkStore'
import{ useI18n }from'../utils/i18n'
import{ResponsiveGrid}from'../components/ResponsiveGrid'

exportconstDashboard:React.FC=()=>{
const{ stats, fetchBookmarks, loading }=useBookmarkStore()
const{ t }=useI18n()
  
useEffect(()=>{
fetchBookmarks()
},[fetchBookmarks])
  
const quickActions =[
{
      title:t('actions.scan'),
      icon:<ScanOutlined/>,
      description:'扫描重复和失效书签',
      path:'/scanner',
      color:'#1890ff'
},
{
      title:'批量整理',
      icon:<ToolOutlined/>,
      description:'管理和整理书签文件夹',
      path:'/manager',
      color:'#52c41a'
},
{
      title:t('actions.export'),
      icon:<ExportOutlined/>,
      description:'导出备份书签数据',
      path:'/import-export',
      color:'#fa8c16'
},
{
      title:t('settings'),
      icon:<SettingOutlined/>,
      description:'配置扩展设置',
      path:'/settings',
      color:'#722ed1'
}
]
  
return(
<divclassName="p-6 space-y-6">
{/* 页面标题 */}
<divclassName="flex items-center justify-between">
<div>
<h1className="text-2xl font-bold text-gray-900 dark:text-white">
{t('dashboard')}
</h1>
<pclassName="text-gray-600 dark:text-gray-400 mt-1">
            管理和优化您的浏览器书签
</p>
</div>
</div>
      
{/* 统计卡片 */}
<ResponsiveGrid>
<CardclassName="hover-lift">
<Statistic
title={t('stats.total')}
value={stats?.total ||0}
prefix={<BookOutlinedclassName="text-blue-500"/>}
loading={loading}
/>
</Card>
        
<CardclassName="hover-lift">
<Statistic
title={t('stats.folders')}
value={stats?.folders ||0}
prefix={<FolderOutlinedclassName="text-green-500"/>}
loading={loading}
/>
</Card>
        
<CardclassName="hover-lift">
<Statistic
title={t('stats.invalid')}
value={stats?.invalid ||0}
prefix={<ExclamationCircleOutlinedclassName="text-red-500"/>}
loading={loading}
valueStyle={{ color: stats?.invalid ?'#ef4444':undefined}}
/>
</Card>
        
<CardclassName="hover-lift">
<Statistic
title={t('stats.duplicates')}
value={stats?.duplicates ||0}
prefix={<CopyOutlinedclassName="text-orange-500"/>}
loading={loading}
valueStyle={{ color: stats?.duplicates ?'#f59e0b':undefined}}
/>
</Card>
</ResponsiveGrid>
      
{/* 快速操作 */}
<Cardtitle="快速操作"className="mt-6">
<ResponsiveGrid>
{quickActions.map((action)=>(
<Card
key={action.path}
hoverable
className="text-center hover-lift"
onClick={()=>{
// 路由跳转逻辑
window.location.hash= action.path
}}
>
<div 
className="text-4xl mb-3"
style={{ color: action.color}}
>
{action.icon}
</div>
<Card.Meta
title={action.title}
description={action.description}
/>
</Card>
))}
</ResponsiveGrid>
</Card>
      
{/* 智能推荐 */}
{(stats?.invalid ||0)>0||(stats?.duplicates ||0)>0?(
<Cardtitle="智能建议"className="mt-6">
<Spacedirection="vertical"size="middle"className="w-full">
{(stats?.duplicates ||0)>0&&(
<divclassName="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
<divclassName="flex items-center space-x-3">
<CopyOutlinedclassName="text-orange-500"/>
<div>
<h4className="font-medium">发现 {stats?.duplicates} 个重复书签</h4>
<pclassName="text-sm text-gray-600 dark:text-gray-400">
                      清理重复项可以让您的书签更整洁
</p>
</div>
</div>
<Button 
type="primary" 
onClick={()=>window.location.hash='/scanner'}
>
                  立即清理
</Button>
</div>
)}
            
{(stats?.invalid ||0)>0&&(
<divclassName="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
<divclassName="flex items-center space-x-3">
<ExclamationCircleOutlinedclassName="text-red-500"/>
<div>
<h4className="font-medium">发现 {stats?.invalid} 个失效链接</h4>
<pclassName="text-sm text-gray-600 dark:text-gray-400">
                      删除无效链接可以提升浏览体验
</p>
</div>
</div>
<Button 
type="primary" 
danger
onClick={()=>window.location.hash='/scanner'}
>
                  检查链接
</Button>
</div>
)}
</Space>
</Card>
):null}
</div>
)
}
```

## 📋 开发检查清单

请确保实现时包含以下功能：

### 核心功能

- [ ]  完整的书签获取和统计API
- [ ]  实时搜索功能（支持中文拼音）
- [ ]  重复书签检测算法
- [ ]  失效链接检查（Web Worker）
- [ ]  空文件夹清理功能
- [ ]  批量操作（删除、移动、编辑）
- [ ]  数据导入导出（多格式支持）
- [ ]  主题切换（明暗模式）
- [ ]  多语言支持（中英文）
- [ ]  设置持久化存储

### React特定要求

- [ ]  使用React 18+ 特性（Concurrent Features）
- [ ]  函数组件 + Hooks架构
- [ ]  TypeScript严格模式
- [ ]  Zustand状态管理
- [ ]  React.memo性能优化
- [ ]  自定义Hook复用逻辑
- [ ]  错误边界处理
- [ ]  Suspense懒加载

### 性能优化

- [ ]  虚拟滚动实现
- [ ]  搜索防抖优化
- [ ]  Web Worker多线程处理
- [ ]  结果缓存机制
- [ ]  React.memo防止不必要渲染
- [ ]  useMemo/useCallback优化
- [ ]  路由懒加载
- [ ]  内存泄漏防护

### 用户体验

- [ ]  响应式布局适配
- [ ]  流畅的动画过渡
- [ ]  友好的错误提示
- [ ]  操作撤销功能
- [ ]  快捷键支持（useKeyboardShortcut）
- [ ]  无障碍访问支持
- [ ]  Loading状态处理
- [ ]  错误边界捕获

### 技术规范

- [ ]  TypeScript类型安全
- [ ]  React 18组合式Hook
- [ ]  Zustand状态管理
- [ ]  Tailwind CSS样式系统
- [ ]  Ant Design组件库
- [ ]  组件单元测试
- [ ]  ESLint代码规范

---

**最终目标** : 创建一个功能完整、性能优异、用户体验出色的专业级React书签管理扩展，能够处理大量书签数据，提供智能扫描和整理功能，支持现代化的全屏交互体验。

请按照以上规范和要求，为我生成完整的React扩展代码实现。重点关注React最佳实践、性能优化和现代化的组件架构。

Retry

Claude does not have the ability to run the code it generates yet.

[Claude can make mistakes. **Please double-check responses.**](https://support.anthropic.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on)
