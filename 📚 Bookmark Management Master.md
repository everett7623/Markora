
Author: Jensfrank

Version: 1.0

Extension Type: Chrome / Edge Extension

Architecture: Full Screen Management Platform

Standard: Manifest V3

License: MIT

---

# 1. Product Vision

Bookmark Management Master is a professional browser bookmark management extension designed for users with large bookmark collections.

The product focuses on:

- Bookmark Organization
    
- Duplicate Detection
    
- Broken Link Detection
    
- Folder Optimization
    
- Import & Export
    
- Automatic Backup
    
- AI Assisted Bookmark Management
    

The extension must operate as a full-screen application instead of a popup.

Users should feel like they are using a standalone web application.

---

# 2. Non-Negotiable Architecture Decisions

These rules cannot be changed by developers or AI agents.

## ADR-001

Framework must be:

React 18 + TypeScript

Vue is not allowed.

---

## ADR-002

Build System:

Vite + CRXJS

Webpack is not allowed.

---

## ADR-003

State Management:

Zustand

Redux is not allowed.

---

## ADR-004

UI Architecture:

Options Page Full Screen Application

Popup mode is forbidden.

---

## ADR-005

Chrome APIs must be wrapped inside Services.

Never call Chrome APIs directly inside React components.

---

## ADR-006

Heavy computation must run inside Web Workers.

Examples:

- Link checking
    
- Duplicate scanning
    
- Large dataset analysis
    

---

## ADR-007

TypeScript Strict Mode must always remain enabled.

---

# 3. Technology Stack

## Core

React 18

TypeScript 5.x

Vite 5.x

@crxjs/vite-plugin

Manifest V3

---

## State

Zustand

---

## Routing

React Router v6

Hash Router

---

## Styling

Tailwind CSS

clsx

tailwind-merge

---

## UI Components

Preferred:

shadcn/ui

Optional:

Ant Design

Rule:

Use shadcn/ui for new components.

Avoid introducing additional UI libraries.

---

## Icons

Lucide React

---

## Internationalization

react-i18next

Chrome i18n

---

## Testing

Vitest

Testing Library

Playwright

---

## Code Quality

ESLint

Prettier

Husky

lint-staged

---

# 4. Project Structure

```text
src/

├── background/
│
├── workers/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── types/
│
├── features/
│
│   ├── dashboard/
│   │
│   ├── scanner/
│   │
│   ├── manager/
│   │
│   ├── import-export/
│   │
│   └── settings/
│
├── services/
│
├── stores/
│
├── router/
│
├── styles/
│
├── App.tsx
│
└── main.tsx
```

Rule:

Feature modules must be independent.

No cross-feature imports.

Use shared layer for reusable code.

---

# 5. Manifest Permissions

Required:

```json
{
  "permissions": [
    "bookmarks",
    "storage",
    "tabs"
  ]
}
```

Optional:

```json
{
  "host_permissions": [
    "<all_urls>"
  ]
}
```

Only enable host_permissions when Broken Link Scanner is active.

---

# 6. Core Features

## Dashboard

### Requirements

Global Search

Statistics Overview

Quick Actions

Recent Activity

AI Suggestions

### Search

Debounce:

300ms

History:

10 records

Shortcut:

Ctrl/Cmd + K

---

## Scanner

### Duplicate Bookmarks

Algorithm:

URL equality

### Empty Folder Detection

Recursive scan

### Broken Link Detection

Worker based

Concurrent requests

Retry mechanism

Progress tracking

### Duplicate Folder Detection

Folder name matching

Merge recommendation

---

## Manager

### Folder Tree

Drag & Drop

Rename

Move

Merge

Delete

### Bookmark List

Virtualized Rendering

Batch Actions

Tag Support

Undo Support

---

## Import Export

Import:

HTML

Export:

HTML

JSON

CSV

TXT

OPML

---

## Settings

General

Scanning

Performance

Backup

About

---

# 7. Service Layer

Every browser interaction must go through Services.

## bookmarkService

Responsibilities:

Read bookmarks

Update bookmarks

Delete bookmarks

Move bookmarks

Search bookmarks

---

## scanService

Responsibilities:

Duplicate detection

Broken link detection

Folder analysis

---

## exportService

Responsibilities:

Export generation

Format conversion

File creation

---

## storageService

Responsibilities:

Settings

Cache

Backup

Migration

---

# 8. Type Definitions

All interfaces must be centralized.

Never duplicate interfaces.

## BookmarkNode

```ts
export interface BookmarkNode
extends chrome.bookmarks.BookmarkTreeNode {

  path?: string[]

  tags?: string[]

  status?:
    | "valid"
    | "invalid"
    | "timeout"
    | "unknown"
}
```

---

## ScanResult

```ts
export interface ScanResult {

  duplicates: DuplicateGroup[]

  invalidLinks: InvalidLink[]

  emptyFolders: BookmarkNode[]
}
```

---

## AppSettings

```ts
export interface AppSettings {

  theme:
    | "light"
    | "dark"
    | "system"

  language:
    | "zh_CN"
    | "en"

  scanOptions: {

    timeout:number

    concurrency:number

    ignoreParams:boolean
  }
}
```

---

# 9. State Management Rules

Use Zustand only.

Each domain gets one store.

Example:

```text
stores/

bookmarkStore.ts

scanStore.ts

settingsStore.ts
```

Store must never contain:

- UI Components
    
- JSX
    
- Chrome API Calls
    

---

# 10. Performance Standards

## Mandatory

Virtual List

Required:

10,000+ bookmarks

Recommended:

react-window

---

## Search

300ms debounce

---

## Worker

Required:

- Broken Link Scanner
    
- Duplicate Detection
    

---

## Cache

24 hours

---

## Lazy Loading

All pages must use:

React.lazy()

---

## Memoization

Required:

React.memo

useMemo

useCallback

---

# 11. Backup System

Automatic backup before:

- Delete
    
- Import
    
- Merge
    
- Restore
    

Retention:

10 backups

Storage:

chrome.storage.local

---

# 12. Data Versioning

Every saved object must contain:

```ts
{
  schemaVersion: 1
}
```

Future migrations:

```ts
migrateSettings()

migrateBackup()

migrateCache()
```

must be supported.

---

# 13. Security Standards

## Privacy

No analytics

No tracking

No telemetry

No cloud upload

---

## Input Validation

Validate:

URLs

Files

Settings

Search Input

---

## XSS Protection

Forbidden:

dangerouslySetInnerHTML

unless sanitized.

---

# 14. Testing Standards

## Required Commands

```bash
npm run lint

npm run typecheck

npm run test

npm run build
```

All must pass.

---

## Coverage

Unit Test:

80%+

---

## E2E

Required flows:

Search

Scan

Delete

Export

Restore

---

# 15. AI Agent Rules

This project is AI-first.

Cursor

Claude Code

Codex

Copilot

must follow these rules.

## Rule 1

Never rewrite architecture.

---

## Rule 2

Never change folder structure without approval.

---

## Rule 3

Always read:

types

services

stores

before implementing features.

---

## Rule 4

New code must include TypeScript types.

---

## Rule 5

No duplicate utilities.

Search existing code first.

---

## Rule 6

Before finishing:

Run:

lint

typecheck

build

---

## Rule 7

Prefer extending existing components instead of creating new ones.

---

# 16. Development Roadmap

P0

Infrastructure

Manifest

Routing

Stores

Services

---

P1

Dashboard

Scanner

Manager

---

P2

Import Export

Backup

i18n

---

P3

Performance Optimization

Workers

Caching

Virtualization

---

P4

AI Features

Tag Recommendation

Folder Optimization

Bookmark Categorization

---

# 17. Definition Of Done

Feature is completed only when:

✓ TypeScript passes

✓ Build passes

✓ Tests pass

✓ Responsive

✓ Dark Mode supported

✓ i18n supported

✓ No console errors

✓ No ESLint warnings

✓ No duplicate code

✓ Performance benchmark passed

---

END OF DOCUMENT

