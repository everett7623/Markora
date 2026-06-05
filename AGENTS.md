
# Bookmark Management Master - Codex Instructions

This repository is a Chrome / Edge Extension project.

Codex must follow this file before making any code changes.

---

## 1. Project Summary

Project name:

Bookmark Management Master

Product type:

Chrome / Edge browser extension

Architecture:

Manifest V3 full-screen options page application

Core goal:

Build a professional bookmark management extension for large bookmark collections.

Primary features:

- Dashboard
    
- Bookmark search
    
- Duplicate bookmark detection
    
- Empty folder cleanup
    
- Broken link scanning
    
- Duplicate folder merge
    
- Bookmark manager
    
- Import and export
    
- Backup and restore
    
- Settings
    
- Future AI-assisted organization
    

---

## 2. Fixed Technical Stack

Do not change these choices.

Use:

- React 18
    
- TypeScript 5
    
- Vite 5
    
- @crxjs/vite-plugin
    
- Manifest V3
    
- Zustand
    
- React Router v6 with HashRouter
    
- Tailwind CSS
    
- shadcn/ui
    
- Lucide React
    
- react-i18next
    
- Vitest
    
- Testing Library
    
- Playwright
    

Do not introduce:

- Vue
    
- Angular
    
- Redux
    
- MobX
    
- jQuery
    
- Webpack
    
- popup.html
    
- new UI libraries without approval
    

---

## 3. Non-Negotiable Architecture Rules

### Rule 1

This extension must use full-screen Options Page mode.

Do not create popup pages.

### Rule 2

Chrome APIs must not be called directly inside React components.

Correct:

```ts
await bookmarkService.getTree()
```

Wrong:

```ts
chrome.bookmarks.getTree()
```

inside React components.

### Rule 3

Heavy work must run in Web Workers.

Examples:

- Broken link checking
    
- Duplicate detection on large datasets
    
- Import/export parsing
    
- Large bookmark tree transformation
    

### Rule 4

All shared types must live in:

```txt
src/shared/types/
```

Do not duplicate interfaces.

### Rule 5

Feature code must stay inside its feature folder.

Do not create cross-feature imports unless the code belongs in `src/shared`.

---

## 4. Required Folder Structure

Use this structure:

```txt
src/
├── background/
│   ├── background.ts
│   ├── messageRouter.ts
│   └── alarms.ts
│
├── workers/
│   ├── linkChecker.worker.ts
│   └── scanner.worker.ts
│
├── services/
│   ├── bookmarkService.ts
│   ├── storageService.ts
│   ├── scanService.ts
│   ├── exportService.ts
│   └── backupService.ts
│
├── stores/
│   ├── bookmarkStore.ts
│   ├── scanStore.ts
│   └── settingsStore.ts
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── features/
│   ├── dashboard/
│   ├── scanner/
│   ├── manager/
│   ├── import-export/
│   └── settings/
│
├── router/
├── styles/
├── App.tsx
└── main.tsx
```

Do not create:

```txt
src/helpers/
src/common2/
src/components_new/
src/utils_backup/
src/old/
src/temp/
```

---

## 5. Coding Rules

### TypeScript

Use strict TypeScript.

Do not use `any` unless unavoidable.

If `any` is used, add a short comment explaining why.

Prefer:

```ts
type Result<T> = {
  success: boolean
  data?: T
  error?: string
}
```

Avoid throwing raw errors across service boundaries.

---

### React

Use function components only.

Use hooks only.

Use:

- React.memo
    
- useMemo
    
- useCallback
    

when rendering large lists or expensive calculations.

Do not put business logic inside JSX.

---

### Zustand

Use Zustand for global state.

Stores must not contain:

- JSX
    
- React components
    
- direct Chrome API calls
    

Stores may call services.

---

### Styling

Use Tailwind CSS.

Use shadcn/ui components where suitable.

Use Lucide React for icons.

Do not add random CSS files per component unless necessary.

---

## 6. Chrome Extension Rules

Manifest must remain Manifest V3.

Required permissions:

```json
{
  "permissions": ["bookmarks", "storage", "tabs"]
}
```

Optional host permission:

```json
{
  "host_permissions": ["<all_urls>"]
}
```

Only use host permissions for broken link checking.

The extension must not upload bookmark data to any server.

---

## 7. Performance Rules

The app must support at least:

```txt
10,000 bookmarks
```

Mandatory:

- Virtualized bookmark lists
    
- 300ms debounced search
    
- Web Worker scanning
    
- 24-hour scan cache
    
- Route-level lazy loading
    
- Memory cleanup for event listeners
    

Do not render 10,000 bookmark DOM nodes directly.

---

## 8. Data and Storage Rules

All local data must include schema version.

Example:

```ts
export interface StoredSettings {
  schemaVersion: number
  data: AppSettings
  updatedAt: number
}
```

Storage must support migration.

Required migration functions:

```ts
migrateSettings()
migrateBackup()
migrateCache()
```

Backups must be created before:

- Batch delete
    
- Import
    
- Merge folder
    
- Restore backup
    

Default retention:

```txt
10 backups
```

---

## 9. Security and Privacy Rules

Never add:

- analytics
    
- telemetry
    
- remote tracking
    
- cloud sync
    
- server upload
    

unless explicitly requested.

Never use:

```tsx
dangerouslySetInnerHTML
```

unless the value is sanitized.

Validate:

- imported files
    
- URLs
    
- settings values
    
- user input
    

---

## 10. Test and Build Commands

Before completing a task, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If a command fails:

1. Fix the issue.
    
2. Run the command again.
    
3. Report what failed and what was fixed.
    

Do not claim completion if build or typecheck fails.

---

## 11. Codex Task Workflow

For every task:

1. Read this `AGENTS.md`.
    
2. Read related files before editing.
    
3. Identify the minimal change.
    
4. Avoid unrelated refactoring.
    
5. Modify only necessary files.
    
6. Add or update tests when behavior changes.
    
7. Run verification commands.
    
8. Summarize changed files and test results.
    

---

## 12. Review Checklist

Before final response, check:

- No architecture changes
    
- No new UI library
    
- No duplicate types
    
- No direct Chrome API in React components
    
- No untested business logic
    
- No large unvirtualized list
    
- No console errors
    
- No privacy regression
    
- Build passes
    

---

## 13. Preferred Response Format

When Codex finishes a task, respond with:

```txt
Summary:
- ...

Changed files:
- ...

Verification:
- npm run lint
- npm run typecheck
- npm run test
- npm run build

Notes:
- ...
```

END