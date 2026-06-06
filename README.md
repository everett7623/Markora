<div align="center">
  <img src="public/icons/icon128.png" width="96" height="96" alt="Markora icon">

  # Markora - 书签星图

  **A local-first bookmark workspace for Chrome and Edge.**

  面向大型书签库的本地优先管理、扫描、整理与备份工具。

  [![Release](https://img.shields.io/github/v/release/everett7623/Markora?include_prereleases&label=beta)](https://github.com/everett7623/Markora/releases)
  [![Manifest](https://img.shields.io/badge/Manifest-V3-4285F4)](manifest.json)
  [![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)](tsconfig.json)
  [![Tests](https://img.shields.io/badge/tests-48%20unit%20%2B%207%20E2E-success)](#quality)
  [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
</div>

> [!IMPORTANT]
> `v0.1.0` is a public beta for local testing. It is not yet a Chrome Web Store or Edge Add-ons stable release.

## Why Markora

Browser bookmark managers become difficult to use once a collection grows into the thousands. Markora opens as a full-screen extension workspace and keeps bookmark processing on the user's device.

- Handles large bookmark collections with a virtualized manager list.
- Detects exact duplicate URLs, duplicate folders, empty folders, and link issues.
- Separates confirmed broken links from links blocked by networks, proxies, Cloudflare, or browser-protected stores.
- Creates local backups before destructive operations.
- Does not include analytics, telemetry, cloud sync, or bookmark uploads.

## Current Features

| Area | Available in `v0.1.0 Beta` |
|---|---|
| Dashboard | Bookmark and folder statistics, search history, recent activity |
| Search | Title, URL, and folder-path search with 300 ms debounce and `Ctrl/Cmd+K` |
| Scanner | Duplicate bookmarks, duplicate folders, empty-folder detection, broken-link review |
| Link review | HTTP error classification, network/proxy distinction, pagination, edit/open/delete actions |
| Manager | Folder filtering, virtualized list, rename, move, reorder, tags, batch delete, undo |
| Import | Netscape bookmark HTML with preview, conflict handling, and backup |
| Export | HTML, JSON, CSV, TXT, and OPML |
| Settings | Theme, language, scanner, cache, backup management |
| Privacy | Local storage and direct URL checks only; no developer-controlled server |

The remaining roadmap is tracked in [TASKS.md](TASKS.md) and [PROGRESS.md](PROGRESS.md). Known gaps include full localization coverage, multi-format import, empty-folder cleanup, and final store assets.

## Link Scanner

Markora uses a Web Worker for scheduling, URL deduplication, concurrency, and progress calculation. HTTPS requests are sent through the Manifest V3 background service worker using optional host permission.

- Failed `HEAD` checks are verified with `GET`.
- Authentication, rate limiting, Cloudflare challenges, and network failures are not automatically treated as broken links.
- Plain HTTP and browser-store links are marked for manual verification to avoid browser security and CORS errors.
- The scanner uses the browser or system proxy configuration; Markora does not operate a remote scanning proxy.

## Installation

### Beta Release

1. Download `markora-v0.1.0.zip` from [GitHub Releases](https://github.com/everett7623/Markora/releases).
2. Extract the ZIP to a permanent local folder.
3. Open `chrome://extensions` or `edge://extensions`.
4. Enable **Developer mode**.
5. Select **Load unpacked** and choose the extracted folder.

### Build From Source

```bash
git clone https://github.com/everett7623/Markora.git
cd Markora
npm install
npm run build
```

Load the generated `dist/` directory as an unpacked extension. Do not load `.crx-dev/`; it is development-server output.

## Development

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run validate:extension
npm run package:release
```

The release package is generated at:

```text
release/markora-v0.1.0.zip
```

## Quality

The `v0.1.0` beta baseline currently passes:

- ESLint with zero errors and zero warnings.
- TypeScript strict type checking.
- 48 Vitest unit and component tests.
- 7 Playwright end-to-end flows.
- Production extension validation.
- Release ZIP packaging.

## Architecture

```text
src/
├── background/       Manifest V3 service worker and message routing
├── workers/          Scanner, link scheduling, and import parsing
├── services/         Chrome API, storage, scan, import/export, and backup boundaries
├── stores/           Zustand application state
├── shared/           Shared components, hooks, types, utilities, and i18n
├── features/         Dashboard, scanner, manager, import/export, and settings
└── router/           HashRouter route definitions
```

Core stack: React 18, TypeScript 5, Vite 5, CRXJS, Manifest V3, Zustand, React Router, Tailwind CSS, react-i18next, Vitest, and Playwright.

## Browser Support

| Browser | Status |
|---|---|
| Google Chrome 120+ | Supported |
| Microsoft Edge 120+ | Supported |
| Firefox | Not currently supported |

## Privacy

Markora does not collect personal data or upload bookmarks. Settings, tags, history, scan caches, and backups remain in browser extension storage. See [PRIVACY.md](PRIVACY.md) for permission and network details.

## Documentation

- [Development guide](DEVELOPMENT_GUIDE.md)
- [Roadmap and tasks](TASKS.md)
- [Current progress](PROGRESS.md)
- [Release checklist](RELEASE_CHECKLIST.md)
- [Version policy](VERSIONING.md)
- [Changelog](CHANGELOG.md)
- [Code review rules](code_review.md)

## License

[MIT](LICENSE) © 2026 Jensfrank.

## Links

- Repository: [github.com/everett7623/Markora](https://github.com/everett7623/Markora)
- Author: [github.com/everett7623](https://github.com/everett7623)
- Website: [seedloc.com](https://seedloc.com)
