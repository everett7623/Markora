# Visible Browser Click-Through

Date: 2026-07-16

## Status

- Pending a clean visible Chrome and Edge browser session; automated UI control stopped before extension installation or manual verification.
- Current branch matches `origin/main`; local `main` is six commits behind.

## Goal

Complete and record the final visible Chrome and Edge click-through checks for
the FavGrove `0.2.0` beta candidate using the production `dist/` build.

## Scope

- Rebuild and validate the production extension.
- Verify visible Chrome and Edge loading without manifest warnings.
- Check the full-screen options-page routes and the manual workflows listed in
  `docs/release/browser-clickthrough.md` with disposable bookmark data.
- Record browser versions, results, and any discovered defects.

## Constraints

- Load only `dist/`; never load `.crx-dev`.
- Do not submit store forms, create a release, upload artifacts, or push code.
- Do not start `TASK-705` while the release gates remain open.
- Preserve existing user bookmarks by using disposable test data and backups.

## Checklist

- [ ] `npm run build:extension`
- [ ] `npm run check:browsers`
- [ ] Visible Chrome check
- [ ] Visible Edge check
- [ ] Update `docs/release/browser-clickthrough.md`
- [ ] Update `RELEASE_CHECKLIST.md`, `SESSION.md`, and `PROGRESS.md`
- [ ] Run the required documentation/change verification

## Notes

- Remote fetch completed successfully on 2026-07-16.
- `codex/ai-analysis-plan` is at `3b3876b0`, identical to `origin/main`.
