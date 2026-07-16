# Backup Restore Safety

Date: 2026-07-16

## Status

- Complete.

## Goal

Replace the destructive beta restore flow with a non-destructive recovery flow
that restores only bookmarks missing from the current browser tree.

## Existing Risk

- The previous Store flow deleted every URL bookmark before recreating the snapshot.
- Snapshot `parentId` values can point to folders that no longer exist.
- Parallel creation can leave a partially restored tree after a failure.
- The confirmation copy does not state that current bookmarks are deleted.

## Restore Contract

- Never delete or overwrite an existing bookmark or folder.
- Match bookmark occurrences by URL within the same parent folder.
- Prefer the original parent folder ID when that folder still exists.
- Fall back to the original folder path when the parent ID is stale.
- Recreate missing non-root folders along that path.
- Reject a missing browser-managed root instead of guessing a destination.
- Roll back every bookmark and folder created by a failed restore attempt.
- Create a safety backup before the first restore write.

## Parent Mapping

| Snapshot field | Current-tree source | Decision |
|---|---|---|
| `parentId` | Existing folder with the same required `id` | Reuse the existing folder |
| `path` | Existing folder path | Reuse the mapped folder when `parentId` is stale |
| `path` below a known root | Missing non-root folder segment | Create the segment under its mapped parent |
| First `path` segment | Missing browser-managed root | Stop and return an error |
| `url` occurrence | Same mapped parent | Consume one existing occurrence; restore only the remainder |

## Checklist

- [x] Add pure missing-bookmark planning with duplicate-count coverage.
- [x] Add service-boundary folder mapping and rollback.
- [x] Replace destructive Store orchestration.
- [x] Update confirmation copy and restore strategy documentation.
- [x] Run focused and full quality gates.

## Verification

- ESLint passed with 0 errors and 0 warnings.
- TypeScript strict checking passed.
- Vitest passed: 21 test files and 82 tests.
- Production extension build, output validation, and permission audit passed.
- Chrome and Edge accepted `dist/` in headless load checks.
- Playwright E2E passed: 8 tests.
