# PROGRESS

Last updated: 2026-06-07

## Current Project Completion

- Overall completion: about 82% against the clarified core and release-ready scope.
- P0 Foundation: complete and verified.
- P1 Dashboard: about 70% complete.
- P2 Scanner: about 90% complete.
- P3 Manager: about 85% complete.
- P4 Import/Export: about 75% complete after adding JSON, CSV, TXT, and OPML import requirements.
- P5 Settings: about 80% complete.
- P6 Optimization through P8 Release: partially complete; localization and store release gates remain open.

## Completed

- React 18, TypeScript strict mode, Vite, CRXJS, Manifest V3, Tailwind CSS, Zustand, React Router HashRouter, Lucide React, react-i18next, Vitest, Testing Library, and Playwright are configured.
- Required source architecture exists under `src/`: `background`, `workers`, `services`, `stores`, `shared`, `features`, `router`, `styles`, `App.tsx`, and `main.tsx`.
- Manifest V3 full-screen options page is configured with no popup page.
- Shared types live under `src/shared/types/`.
- Chrome bookmark and storage APIs are wrapped in services instead of React components.
- Dashboard shows total bookmarks, total folders, duplicate count, invalid count, persisted last 10 search terms, and recent activity.
- Search history persists locally.
- Recent Activity records bookmark loading, search, and delete actions.
- Scanner uses workers for duplicate bookmark groups, duplicate folder groups, empty folder scans, and broken-link checks.
- Broken-link checks support optional host permission, timeout handling, retry handling, HEAD/GET fallback, concurrency control, and progress updates.
- Cross-origin HTTPS checks are routed through the Manifest V3 background service worker instead of the options-page Worker.
- Chrome Web Store and Edge Add-ons URLs are detected before network access and marked for manual verification because browser-protected stores can reject extension requests even with host permission.
- Plain HTTP links are marked for manual verification without an automatic request, avoiding `Clear-Site-Data` security errors from insecure origins.
- Broken-link checks verify failed HEAD requests with GET and avoid treating authentication, rate limiting, or Cloudflare/WAF challenges as confirmed broken links.
- Link results distinguish confirmed HTTP failures from timeout, server, network, proxy, DNS, TLS, and regional access failures that could not be verified.
- A dedicated link-issue page supports filtering, 50-row pagination, manual open-and-check, and backup-protected batch deletion.
- Each link issue now supports three explicit actions: open for manual verification, edit and validate the bookmark URL, or delete it after confirmation and backup creation.
- Product branding is now `Markora - Bookmark Atlas` / `书签星图 Markora`, with a minimal high-contrast bookmark icon for 16, 48, and 128 pixel extension assets.
- Scanner result cache support exists through `scanService`.
- Link scanning checks each exact URL once, maps the result back to duplicate bookmarks, interleaves hostnames, and caps each hostname at two concurrent requests.
- New installations default to eight global link-check workers while retaining the per-host safety cap.
- Scanner cache loading now uses the persisted cache-duration setting.
- Manager has folder filtering, virtualized bookmark list rendering, batch delete with backup creation, bookmark rename, folder rename, bookmark move, folder move, drag/drop move to folder, drag/drop bookmark ordering, undo delete, local tags, and tag filtering.
- Scanner duplicate-folder results support merging into the first folder in each group.
- Folder merge moves all source children, preserves duplicate bookmarks, removes source folders, and creates a backup first.
- Duplicate bookmark results support keeping the oldest entry and deleting the remaining copies with backup and undo support.
- Duplicate cleanup and folder merge now rerun the structural scan and replace stale cached results immediately.
- Import/Export supports JSON, CSV, TXT, OPML, and HTML export generation.
- HTML import parses Netscape bookmark files in a Web Worker.
- HTML import parsing is Worker-safe and does not depend on `DOMParser`.
- Import preview detects URL conflicts before writing.
- Conflict resolver supports skipping matching URLs or importing all as duplicates.
- Backup-before-import is implemented.
- HTML import recreates imported folder hierarchy from Netscape bookmark paths.
- Settings persistence is implemented for theme, language, scanner config, cache config, and backup config.
- Settings includes backup management with backup list, restore, and delete actions.
- Restore creates a safety backup before applying the selected backup snapshot.
- App applies persisted theme and language.
- Baseline unit/component tests exist and pass.
- Playwright E2E covers route navigation, scanner execution, HTML import preview and conflict handling, and manager mutation flows.
- A local-first privacy policy documents permissions, data handling, and the absence of analytics or remote bookmark uploads.
- A release checklist covers quality gates, manifest review, privacy review, manual checks, store preparation, and artifact validation.
- `npm run package:release` creates a versioned ZIP from the verified `dist/` extension build.
- Development and E2E extension output is isolated under `.crx-dev`; it no longer overwrites the production `dist/` directory.
- Production build validation rejects localhost references, CRXJS/Vite development clients, missing service workers, and manifests that expose every extension resource.
- Development environment has been restored and verified on Windows 11.
- Versioning policy is documented. The current `0.1.0` version is the beta baseline and should not be reset to `0.0.x`.

## Not Completed

- Pinyin search for Chinese bookmark titles is not implemented.
- Dashboard quick actions and local smart recommendation cards are not implemented.
- Empty folders can be detected but cannot yet be deleted from Scanner.
- Manager supports batch move and delete, but not batch tag editing.
- Folder hierarchy is displayed with indentation, but expand/collapse controls are not implemented.
- Backup retention is persisted in Settings, but `backupService` still applies the fixed default retention.
- Full destructive replacement restore is not implemented; current restore re-applies the backup snapshot through the service boundary and keeps a safety backup.
- JSON, CSV, TXT, and OPML import are not implemented.
- English and Chinese localization is not complete: the Chinese locale is missing 15 keys and several user-facing strings, activities, and errors remain hardcoded in English.
- A measured 10,000-bookmark performance benchmark and worker-pool optimization are not complete.
- Store screenshots, promotional graphics, final listing copy, and AI features are not complete.
- The repository includes an MIT `LICENSE` file matching the README.
- GitHub-facing README, changelog, privacy link, installation guidance, and beta release documentation are updated for the `everett7623/Markora` repository.

## Verification

Environment verified on Windows 11:

- Git available.
- Node.js v24.16.0.
- npm v11.13.0.
- `npm install` passed.
- `npm run build` passed.
- `npm run lint` passed.
- `npm run test` passed.
- Broken Link Checker phase verified after implementation.
- Settings persistence phase verified after implementation.
- Search history and Recent Activity phase verified after implementation.
- Manager rename, move, drag/drop move, undo delete, tags, and tag filtering phase verified after implementation.
- HTML import, conflict resolver, and backup-before-import phase verified after implementation.
- Backup restore UI and backup management phase verified after implementation.
- Nested-folder recreation for HTML import phase verified after implementation.
- Manager folder rename, folder move, and drag/drop ordering phase verified after implementation.
- E2E smoke verification passed after stabilizing the local Playwright server runner.
- Folder merge implementation and backup behavior verified.
- Quality gates currently passing.

Additional verification in this Codex session on 2026-06-06:

- `git status --short`: passed; current working tree shows documentation changes.
- `git log --oneline -5`: passed.
- ESLint gate passed with 0 errors and 0 warnings when executed through the installed Node runtime.
- TypeScript strict check passed when executed through the installed Node runtime.
- Vitest passed, 11 test files and 42 tests.
- Vite build passed when executed through the installed Node runtime.
- Playwright E2E passed, 7 tests, including duplicate cleanup persistence and link-issue classification/detail coverage.
- Release packaging passed and created `release/markora-v0.1.0.zip`.
- The release archive was inspected and contains only the built extension files.
- Extension build validation passed with a production service worker and no development URLs.
- Playwright E2E passed without changing any file hash under `dist/`.
- Release audit rerun passed: ESLint, TypeScript strict mode, 42 Vitest tests, 7 Playwright tests, production build, extension validation, and release packaging.
- Link-check transport regression verification passed: 12 Vitest files with 46 tests, 7 Playwright tests, production build, and extension validation.
- Protected browser-store regression verification passed: 12 Vitest files with 48 tests, 7 Playwright tests, production build, extension validation, and release packaging.

## Release Decision

- GitHub source push: suitable as a `0.1.0` beta after reviewing and committing the current large working tree.
- Chrome Web Store / Edge Add-ons stable publication: not ready.
- Current release blockers include localization completion, multi-format import, remaining destructive-operation gaps, backup retention behavior, repository license, store assets, and final manual browser checks.
- Do not label the current build `1.0.0`.

Required standards:

- TypeScript strict mode remains enabled.
- ESLint has 0 errors and 0 warnings in the verified run.
- Tests pass.
- Build passes.
- Existing working behavior must not be broken.

## Next Stage Development Plan

1. Implement empty-folder cleanup with backup, batch action, and refreshed scan cache.
2. Complete English and Chinese localization, including activity and error messages.
3. Implement JSON, CSV, TXT, and OPML import through the existing preview and backup flow.
4. Apply persisted backup retention to the backup service.
5. Add Dashboard quick actions, local recommendations, pinyin search, batch tag editing, and collapsible folders.
6. Complete performance benchmarks, license, store assets, and manual Chrome/Edge release checks.

## Design Notes / Pending Decisions

- Backup restore currently re-applies a selected snapshot and creates a safety backup first.
- Full destructive replacement restore is intentionally not implemented yet.
- HTML import now recreates nested folders; folder conflict behavior currently creates/imports new folders for the import batch.
- Folder merge keeps the first duplicate folder as the target and moves all source children without silently deleting URL conflicts.
- Advanced drag/drop ordering now supports bookmark ordering before a target row; folder ordering polish can be added after E2E coverage.
- Use `npm run test:e2e` for Playwright; it starts Vite through `scripts/run-e2e.mjs` so the server exits cleanly on Windows.
- Do not load `.crx-dev` as an unpacked extension for manual testing; Chrome and Edge must load `dist/`.
