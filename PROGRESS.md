# PROGRESS

Last updated: 2026-07-08

## Current Project Completion

- Overall completion: about 96% against the clarified core and release-ready scope.
- P0 Foundation: complete and verified.
- P1 Dashboard: about 94% complete.
- P2 Scanner: about 97% complete.
- P3 Manager: about 97% complete.
- P4 Import/Export: about 94% complete after adding JSON, CSV, TXT, and OPML import.
- P5 Settings: about 94% complete.
- P6 Optimization through P8 Release: mostly complete; visible browser checks and store portal submission remain open.

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
- Localization parity was improved for Scanner, Manager, Import/Export, and Settings locale keys, reducing fallback usage and hardcoded UI copy.
- Bookmark store activity logs and URL validation error messages now use i18n locale keys instead of hardcoded English strings.
- Service-layer fallback errors (storage, import, bookmark operations, scan flow, link request flow) now use i18n locale keys instead of hardcoded English strings.
- Import/Export page i18n fallback `defaultValue` usage was removed and Settings language option labels now use i18n locale keys.
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
- `AGENTS.md` and `DEVELOPMENT_GUIDE.md` now provide a Codex-friendly handoff and development guide with architecture rules, verification commands, current priorities, and release constraints.
- Shared `Dialog`, `ConfirmDialog`, `PromptDialog`, `Skeleton`, and `useContainerHeight` primitives are available for reuse.
- Manager virtualized list height now follows its actual container height instead of a fixed `620px` viewport.
- Dashboard and Manager initial loading states now use skeleton placeholders.
- Dashboard shows a last-scan indicator backed by scan-cache metadata and links to Scanner.
- Manager rename, folder rename, tag editing, bulk delete confirmation, and bulk move confirmation use custom dialogs instead of native browser prompts.
- Manager supports select-all for visible bookmarks, session-only sort options, keyboard shortcuts, shortcut tooltip, and tag counts in the tag filter.
- Link issue URL editing, single delete, and batch delete now use custom dialogs instead of native browser prompts/confirms.
- Settings backup restore now requires an in-app confirmation dialog.
- Scanner supports confirmed "Clean all duplicates" and "Delete all empty folders" batch actions through the existing backup-protected repair flow, with refreshed scan cache after repair.
- Legacy planning files were removed; Codex handoff now uses `AGENTS.md`, `DEVELOPMENT_GUIDE.md`, `SESSION.md`, `PROGRESS.md`, and `TASKS.md`.
- Automatic daily structure scan is implemented behind a Settings toggle using the Manifest V3 `alarms` permission.
- Background auto-scan saves duplicate bookmark, duplicate folder, and empty-folder results to the existing scan cache; broken-link checks remain manual.
- `PRIVACY.md` documents the `alarms` permission.
- Backup creation now uses the persisted retention setting, and lowering retention trims excess backups safely.
- Import/Export now imports JSON, CSV, TXT, OPML, and HTML through the shared Worker preview, conflict resolver, and backup-before-import flow.
- English and Chinese locale key parity is enforced by a unit test.
- Manager supports batch tag add/remove for selected bookmarks and expand/collapse controls in the folder tree.
- Dashboard includes quick actions, local scan-result recommendations, and full-pinyin/pinyin-initial search support.
- Chinese primary route smoke coverage passes through Playwright after switching language in Settings.
- Scanner supports deleting one detected empty folder with confirmation, backup creation, bookmark refresh, and scan-cache refresh.
- 10,000-bookmark structural scan and pinyin search performance benchmarks are covered by `npm run benchmark:performance`.
- Store listing copy, promotional SVG sources, and 1280x800 screenshots are available under `store/`.
- Chrome and Edge can load the production `dist/` extension through `npm run check:browsers`.
- Manifest required permissions are limited to `alarms`, `bookmarks`, and `storage`; the unused `tabs` permission was removed after confirming no `chrome.tabs` usage.
- `npm run audit:permissions` validates the manifest permission boundary and permission documentation in `PRIVACY.md`.
- Visible Chrome and Edge click-through steps are prepared in `docs/release/browser-clickthrough.md`.
- Full destructive replacement restore is deferred by `docs/decisions/restore-strategy.md`; the current backup-protected restore remains the release path.
- GitHub pre-release metadata is prepared in `docs/release/github-prerelease-v0.1.0.md`.
- Store portal submission fields are prepared in `store/submission-fields.md`.
- Post-beta AI and local recommendation guardrails are documented in `docs/roadmap/post-beta-ai.md`.

## Not Completed

- Visible Chrome and Edge click-through checks from `dist/` remain open.
- Store portal submission fields and GitHub pre-release metadata are prepared locally but not finalized in the portals.
- Post-beta AI features are not complete.
- Full destructive replacement restore remains a deferred post-beta feature and is not part of the current release path.

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

Additional verification in this Codex session on 2026-06-30:

- ESLint passed with 0 errors and 0 warnings after locale key and UI text alignment.
- TypeScript strict check passed after localization updates.
- Vitest passed: 12 test files, 48 tests.
- Production build passed.

Additional verification in this Codex session on 2026-07-08:

- ESLint passed with 0 errors and 0 warnings after Codex docs, dialog, skeleton, Manager, Scanner, Link Issues, and Settings updates.
- TypeScript strict check passed.
- Vitest passed: 12 test files and 48 tests.
- Production extension build and validation passed through `npm run build:extension`.
- Playwright E2E passed: 7 tests, including updated custom-dialog flows for link URL editing and Manager rename/tag actions.
- A later 2026-07-08 verification passed after Manager select-all, sort options, keyboard shortcuts, tag counts, and Dashboard last-scan updates: ESLint 0 warnings, TypeScript strict check, 49 Vitest tests, production extension build validation, and 7 Playwright E2E tests.
- A later 2026-07-08 verification passed after automatic daily scan and legacy planning cleanup: ESLint 0 warnings, TypeScript strict check, 49 Vitest tests, production extension build validation, and 7 Playwright E2E tests.
- A later 2026-07-08 verification passed after backup retention, locale parity, multi-format import, Manager batch tags/collapsible folders, and Dashboard quick actions/recommendations/pinyin search: ESLint 0 warnings, TypeScript strict check, 60 Vitest tests, production extension build validation, and 7 Playwright E2E tests.
- A later 2026-07-08 verification passed after Chinese route smoke, individual empty-folder deletion, 10,000-bookmark benchmarks, store assets/screenshots, and Chrome/Edge headless load checks: ESLint 0 warnings, TypeScript strict check, 62 Vitest tests, focused performance benchmark, production extension build validation, browser load checks, and 8 Playwright E2E tests.
- A later 2026-07-08 verification passed after release permission tightening, browser click-through preparation, restore strategy decision, pre-release/store metadata, and post-beta AI guardrails: ESLint 0 warnings, TypeScript strict check, 62 Vitest tests, focused performance benchmark, production extension build validation with permission audit, Chrome/Edge headless browser load checks, 8 Playwright E2E tests, and release ZIP packaging.

## Release Decision

- GitHub source push: suitable as a `0.1.0` beta after reviewing and committing the current large working tree.
- Chrome Web Store / Edge Add-ons stable publication: not ready.
- Current release blockers include visible browser click-through checks, public privacy/support URL confirmation, GitHub pre-release creation, and final store portal submission.
- Do not label the current build `1.0.0`.

Required standards:

- TypeScript strict mode remains enabled.
- ESLint has 0 errors and 0 warnings in the verified run.
- Tests pass.
- Build passes.
- Existing working behavior must not be broken.

## Next Stage Development Plan

1. Run and record final visible Chrome and Edge click-through checks from `dist/`.
2. Confirm public privacy policy and support URLs in the store portals.
3. Create the GitHub beta pre-release from `docs/release/github-prerelease-v0.1.0.md`.
4. Upload the verified release ZIP only after the visible browser pass is recorded.
5. Continue post-beta AI/local recommendation features only after release gates are closed.

## Design Notes / Pending Decisions

- Backup restore currently re-applies a selected snapshot and creates a safety backup first.
- Full destructive replacement restore is intentionally deferred to post-beta work.
- HTML import now recreates nested folders; folder conflict behavior currently creates/imports new folders for the import batch.
- Folder merge keeps the first duplicate folder as the target and moves all source children without silently deleting URL conflicts.
- Advanced drag/drop ordering now supports bookmark ordering before a target row; folder ordering polish can be added after E2E coverage.
- Use `npm run test:e2e` for Playwright; it starts Vite through `scripts/run-e2e.mjs` so the server exits cleanly on Windows.
- Do not load `.crx-dev` as an unpacked extension for manual testing; Chrome and Edge must load `dist/`.
