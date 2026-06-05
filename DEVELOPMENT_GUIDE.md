
# Bookmark Management Master

Enterprise Architecture Specification

Version: 3.0

---

# Product Goal

Build a professional Chrome bookmark management platform.

The extension must support:

- 10000+ bookmarks
    
- duplicate detection
    
- broken link scanning
    
- folder optimization
    
- backup & restore
    
- import/export
    
- multilingual UI
    
- future AI enhancements
    

---

# Architecture Overview

Manifest V3

React 18

TypeScript

Vite

CRXJS

Zustand

Tailwind CSS

shadcn/ui

---

# Core Principles

Full-screen application.

No popup.

Service layer required.

Chrome APIs never called directly inside React components.

Heavy tasks run inside workers.

Strict TypeScript.

Feature-first architecture.

---

# Feature Modules

Dashboard

Scanner

Manager

ImportExport

Settings

---

# Directory Structure

src/

background/

workers/

services/

stores/

shared/

features/

router/

styles/

---

# Service Layer

bookmarkService

scanService

storageService

backupService

exportService

---

# State Management

Zustand only.

Global state:

bookmarkStore

scanStore

settingsStore

---

# Performance Requirements

10000+ bookmarks supported.

Required:

Virtualization

Debounce

Web Workers

Cache

Lazy Loading

---

# Security Rules

Local only.

No cloud upload.

No analytics.

No telemetry.

---

# Internationalization

Languages:

zh_CN

en

Framework:

react-i18next

---

# Backup Rules

Backup before:

Delete

Import

Merge

Restore

Keep:

10 backups

---

# Testing Requirements

Unit Test

Component Test

E2E Test

Commands:

npm run lint

npm run typecheck

npm run test

npm run build

---

# Definition Of Done

Build passes

Tests pass

No console errors

No duplicate types

No architecture violations

Manifest V3 compliant

END