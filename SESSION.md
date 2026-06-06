# Current Session

Date: 2026-06-07

## Working On

Release Readiness

## Current Goal

Close the clarified core, localization, and release gaps before store publication.

## Current Status

- P0 Foundation is complete and verified.
- Dashboard statistics are implemented.
- Search history is persisted locally and capped to the latest 10 terms.
- Recent Activity records bookmark loading, search, and delete actions.
- Scanner worker currently handles:
  - Duplicate bookmark detection by exact URL.
  - Duplicate folder detection by parent/title grouping.
  - Empty folder detection.
  - Progress updates for the existing scan phases.
  - 24-hour scan cache via `scanService`.
- Broken Link Checker is connected through `scanService` and `linkChecker.worker.ts`.
- Link-check scheduling remains in the Web Worker, while privileged HTTPS requests are bridged through the background service worker to avoid options-page CORS errors.
- Plain HTTP links are not fetched automatically and are classified for manual verification to avoid insecure-origin response-header errors.
- Chrome Web Store and Edge Add-ons links are skipped before fetch and classified for manual verification because browser-protected store pages reject automated extension requests.
- Broken link scanning uses:
  - Optional host permission request.
  - Timeout handling.
  - Retry handling.
  - HEAD request with GET fallback.
  - Concurrency control capped at 12.
  - Progress updates from the link-checking stage.
  - GET verification for every failed HEAD request.
  - Protected, rate-limited, and Cloudflare/WAF challenge responses are not counted as confirmed broken links.
- Scanner UI now displays invalid link results.
- Manager currently supports:
  - Folder filtering.
  - Virtualized bookmark rendering.
  - Batch delete with backup creation.
  - Bookmark rename.
  - Folder rename.
  - Bookmark move.
  - Folder move.
  - Drag/drop move to folder.
  - Drag/drop bookmark ordering before a target row.
  - Undo delete.
  - Local tags.
  - Tag filtering.
  - Duplicate folder merge from Scanner results.
  - Backup-before-merge.
- Scanner duplicate-bookmark results can keep the oldest item and remove the remaining copies through the existing backup and undo flow.
- Scanner repair actions rerun structural detection and update the persisted scan cache, so resolved duplicate folders and bookmarks do not return after refresh.
- Link scanning deduplicates exact URLs, preserves per-bookmark results, interleaves hostnames, and limits each hostname to two concurrent requests.
- Default global link-check concurrency is eight for new settings, while cached scan loading now honors the persisted cache duration.
- Link scan results now separate confirmed broken links from links that could not be verified because of timeout, server, network, proxy, DNS, TLS, or regional access conditions.
- `/scanner/links` provides filtering, 50-row pagination, manual open-and-check, and backup-protected batch deletion.
- Link issue rows provide separate open, edit URL, and confirmed delete actions.
- The product brand is now `Markora - Bookmark Atlas` / `书签星图 Markora`, using a minimal bookmark icon that remains legible at 16px.
- Import/Export currently supports:
  - JSON, CSV, TXT, OPML, and HTML export.
  - Worker-based Netscape HTML import parsing.
  - Import preview.
  - URL conflict detection.
  - Conflict resolver for skipping existing URLs or importing all.
  - Backup-before-import.
  - Nested folder recreation from Netscape bookmark paths.
- Settings persistence is implemented for:
  - Theme.
  - Language.
  - Scanner timeout, concurrency, and retry count.
  - Scan cache duration.
  - Backup retention.
- Settings backup management supports listing backups, restoring a backup, and deleting backups.
- Restore creates a safety backup before applying a selected backup snapshot.
- App now applies persisted theme and language on startup.
- Playwright E2E smoke tests pass for route navigation, import/settings visibility, and manager controls.
- Expanded E2E covers scanner execution, HTML import preview/conflict handling, and manager rename/tag/move/delete/undo flows.
- HTML import parsing is Worker-safe and no longer depends on `DOMParser`.
- `npm run test:e2e` uses `scripts/run-e2e.mjs` to start and stop Vite cleanly on Windows.
- `PRIVACY.md` documents local data handling, permissions, and the absence of analytics, telemetry, and remote bookmark uploads.
- `RELEASE_CHECKLIST.md` records the quality, manifest, privacy, manual, store, and artifact release gates.
- `npm run package:release` validates the built manifest and creates a versioned extension ZIP.
- Release packaging produced `release/markora-v0.1.0.zip`, and its contents were inspected successfully.
- Fixed an extension reload failure caused by the E2E Vite server writing CRXJS development output into `dist/`.
- Vite serve output now uses `.crx-dev`, while production builds exclusively use `dist/`.
- `npm run validate:extension` rejects development URLs, broad resource exposure, and missing background service workers.
- Multi-format import requirements are now recorded for JSON, CSV, TXT, and OPML.
- Localization audit found 15 English locale keys missing from Chinese and additional hardcoded user-facing English strings.
- `VERSIONING.md` defines `0.1.0` as the current beta baseline and reserves `1.0.0` for the first stable store release.

## Next Step

Complete localization key parity and remove hardcoded user-facing English before calling the build release-ready.

## After E2E

1. Apply backup retention settings to the real service.
2. Implement JSON, CSV, TXT, and OPML import.
3. Add Dashboard quick actions and local recommendations.
4. Add pinyin search, Manager batch tag editing, and expand/collapse behavior.
5. Resume 10,000-bookmark performance checks, license work, and store preparation.

## Verification Required Before Commit

- `git status`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

Quality gates must pass before marking the next phase complete.

Latest verification:

- ESLint: passed, 0 errors and 0 warnings.
- TypeScript strict check: passed.
- Vitest: passed, 11 test files and 42 tests.
- Vite build: passed.
- Playwright E2E: passed, 7 tests, including duplicate cleanup persistence and link-issue classification/detail coverage.
- Release packaging: passed.
- Release archive inspection: passed.
- Production extension validation: passed.
- E2E isolation check: passed; `dist/` hashes remained unchanged.
- Release audit rerun passed: ESLint, TypeScript, 42 Vitest tests, 7 Playwright tests, production build, extension validation, and release packaging.
- Current release classification: `0.1.0` beta. GitHub push is acceptable after an intentional commit review; stable store publication is not yet approved.
- Link-check transport regression verification passed with 46 Vitest tests and 7 Playwright tests after moving HTTPS requests to the background service worker.
- Browser-store URL protection verification passed with 48 Vitest tests and 7 Playwright tests; protected store links are skipped before `fetch`.
- GitHub README was rebuilt for the public beta, with honest feature status, installation instructions, privacy boundaries, browser support, quality gates, and the new repository URL.
- Added `CHANGELOG.md` and the missing MIT `LICENSE`.

## Notes

- Do not reuse stale environment assumptions. The Windows 11 environment has been verified with Git, Node.js v24.16.0, npm v11.13.0, build, lint, and test passing.
- Do not automatically push.
- Update both `SESSION.md` and `PROGRESS.md` after completing each development phase.
- Current restore flow re-applies the selected backup snapshot and creates a safety backup first; destructive full replacement should be designed separately if required.
- Use `npm run test:e2e` for Playwright; direct `playwright test` can leave the local web server hanging on this Windows setup.

## Design Notes / Pending Decisions

- Backup restore currently re-applies a selected snapshot and creates a safety backup first.
- Full destructive replacement restore is intentionally not implemented yet.
- HTML import now recreates nested folders; folder conflict behavior currently creates/imports new folders for the import batch.
- Folder merge keeps the first duplicate folder as the target, moves all source children, preserves URL conflicts, and creates a backup first.
- Advanced drag/drop ordering now supports bookmark ordering before a target row; folder ordering polish can be added after E2E coverage.
- Core feature audit added to `TASKS.md`: a saved setting is not considered complete until its service behavior uses it.
- Manual unpacked-extension testing must load `dist/`; `.crx-dev/manifest.json` is development-only and may reference the local Vite server.
- The current release artifact is a local build output and is intentionally ignored by Git.
