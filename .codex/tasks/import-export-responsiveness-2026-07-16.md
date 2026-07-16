# Import / Export Responsiveness

Date: 2026-07-16

## Goal

Remove the visible pause from import/export interactions and correct the project
status so it distinguishes committed user-facing features from plans and
uncommitted work.

## Evidence

- A cold-browser route timing sample put Import / Export navigation at a 138 ms
  median, comparable to the other lazy routes.
- `exportService.createFile` currently serializes all five supported formats on
  every click, although only one result is downloaded.
- Serialization runs synchronously on the options-page main thread.
- Import parsing already runs in a Worker, but file-read failures can leave the
  parsing state stuck because the UI lacks `try/finally` cleanup.

## Plan

- [x] Fetch remote refs and inspect the working tree and handoff documents.
- [x] Reproduce route navigation timing and identify the export hot path.
- [x] Serialize only the requested export format in a Web Worker.
- [x] Add visible export busy state and reliable import state cleanup.
- [x] Add regression and 10,000-bookmark performance coverage.
- [x] Update `SESSION.md` and `PROGRESS.md` with an evidence-based status.
- [x] Run lint, typecheck, tests, production extension build, and browser checks.

## Verification

- ESLint: passed with 0 warnings.
- TypeScript strict check: passed.
- Vitest: 21 files, 83 tests passed.
- 10,000-bookmark performance suite: 3 tests passed.
- Production extension build, validation, and permission audit: passed.
- Chrome and Edge production `dist/` load checks: passed.
- Playwright: 9 tests passed, including a real CSV Worker download.
- Chrome 10,000-bookmark CSV export: 105 ms, busy state visible, no observed Long Task.
- Chrome 10,000-row CSV import preview: 167 ms, parsing state visible.

## Safety

- Preserve all existing uncommitted update-notification and restore changes.
- Do not add remote uploads, analytics, telemetry, permissions, or dependencies.
- Do not commit or push unless explicitly requested.
