# Release Polish

Date: 2026-07-16

## Status

- Complete.

## Goal

Close the small release-polish gaps found after the browser-managed update
notification landed on `main`.

## Scope

- Localize the route-loading fallback and beta status badge.
- Refresh the update banner when its local storage record changes while the
  options page is already open.
- Clear stale update records that do not represent a newer version.
- Correct the stale branch notes in the visible browser click-through task.
- Update release handoff documents after verification.

## Constraints

- Keep Chrome and Edge responsible for store update checks and downloads.
- Do not add network polling, host permissions, analytics, or telemetry.
- Keep Chrome API access in the update service rather than React components.
- Preserve the current `0.2.0` release scope and fixed stack.

## Checklist

- [x] Implement localized loading and beta labels.
- [x] Implement live update-state subscription and stale-record cleanup.
- [x] Add focused unit and component coverage.
- [x] Run lint, typecheck, tests, extension build, browser checks, and E2E.
- [x] Update `SESSION.md`, `PROGRESS.md`, `TASKS.md`, and `CHANGELOG.md`.

## Verification

- ESLint passed with 0 errors and 0 warnings.
- TypeScript strict checking passed.
- Vitest passed: 19 test files and 77 tests.
- Production extension build, output validation, and permission audit passed.
- Chrome and Edge accepted `dist/` in headless load checks.
- Playwright E2E passed: 8 tests.
