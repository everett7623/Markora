# Changelog

All notable changes to FavGrove, formerly Markora, are documented in this file.

## [0.2.0] - Unreleased

### Added

- Added a localized in-app notice when Chrome or Edge has downloaded a newer store version, with an explicit action to reload FavGrove and apply it.

### Changed

- Renamed the product from `Markora - Bookmark Atlas` to `FavGrove - Bookmark Manager`.
- Updated English and Chinese product copy, release metadata, promotional assets, and package naming for the FavGrove brand.
- Preserved browser storage contracts, import schemas, and the existing automatic-scan alarm identifier for upgrade compatibility.

## [0.1.0] - 2026-06-07

First public beta, released under the Markora name.

### Added

- Full-screen Manifest V3 options application for Chrome and Edge.
- Dashboard statistics, bookmark search history, and recent activity.
- Worker-based duplicate bookmark, duplicate folder, empty-folder, and link scanning.
- Dedicated link-issue workflow with classification, pagination, manual verification, URL editing, and backup-protected deletion.
- Virtualized bookmark manager with rename, move, reorder, tags, batch delete, and undo.
- Duplicate bookmark cleanup and duplicate-folder merge with backup and refreshed scan cache.
- Netscape HTML import with preview, conflict handling, hierarchy recreation, and backup.
- HTML, JSON, CSV, TXT, and OPML export.
- Theme, language, scanner, cache, and backup settings.
- Local backup listing, restore, and deletion.
- English and Chinese interface resources.
- Privacy policy, release validation, E2E automation, and versioned ZIP packaging.

### Security And Reliability

- No analytics, telemetry, cloud sync, or bookmark upload.
- Optional host permission is requested only for link checking.
- HTTPS checks run through the background service worker.
- Plain HTTP and browser-store URLs are reserved for manual verification.
- Cloudflare challenges, authentication failures, rate limiting, proxy failures, and timeouts are not treated as confirmed broken links.

### Known Limitations

- This release is a beta and is not a browser-store stable release.
- Chinese and English localization coverage is not yet complete.
- Import currently supports HTML only.
- Empty-folder cleanup, persisted backup retention behavior, pinyin search, and several dashboard/manager refinements remain on the roadmap.
