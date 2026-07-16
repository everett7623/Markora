# Extension Update Notification

Date: 2026-07-16

## Status

- Complete and verified.

## Goal

Notify users when Chrome or Edge has downloaded a newer store version of
FavGrove and let the user reload the extension to apply it immediately.

## Decisions

- Use `chrome.runtime.onUpdateAvailable`, which follows the browser store's
  native update lifecycle.
- Do not poll Google, Microsoft, or GitHub when FavGrove opens.
- Do not add host permissions or transmit bookmark data.
- Persist only the available version and detection timestamp in local extension
  storage so the next options-page visit can show the notice.

## Checklist

- [x] Register and persist the browser update event.
- [x] Add a background message for user-triggered extension reload.
- [x] Show a localized global update banner.
- [x] Add unit and UI tests.
- [x] Run project quality gates.
- [x] Update `TASKS.md`, `SESSION.md`, and `PROGRESS.md`.

## Verification

- ESLint: passed with 0 warnings.
- TypeScript strict check: passed.
- Vitest: passed, 19 files and 74 tests.
- Production extension build, validation, and permission audit: passed.
- Chrome and Edge headless extension load checks: passed.
- Playwright E2E: passed, 8 tests.
