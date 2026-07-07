# GitHub Pre-Release Draft: v0.1.0

## Release Settings

- Tag: `v0.1.0`
- Target branch: `main`
- Release title: `Markora v0.1.0 Beta`
- Mark as pre-release: yes
- Attach asset: `release/markora-v0.1.0.zip`

## Summary

Markora v0.1.0 is a public beta for local testing of the Manifest V3 Chrome and Edge bookmark workspace. It focuses on local-first bookmark scanning, cleanup, import/export, backup, restore, and management workflows.

## Highlights

- Full-screen options-page workspace for Chrome and Edge.
- Dashboard statistics, quick actions, recent activity, and local cleanup recommendations.
- Duplicate bookmark, duplicate folder, empty-folder, and broken-link scanning.
- Link issue review with manual verification states and backup-protected deletion.
- Virtualized bookmark manager with rename, move, reorder, tags, batch tag editing, batch delete, and undo.
- HTML, JSON, CSV, TXT, and OPML import/export with preview and conflict handling.
- Local backups, restore, backup retention, theme, language, and automatic daily structure scan settings.

## Privacy

Markora stores bookmark metadata, settings, scan cache, search history, tags, and backups locally in browser extension storage. It does not include analytics, telemetry, account sync, cloud processing, or developer-operated bookmark uploads.

## Verification Before Publishing

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run benchmark:performance`
- `npm run build:extension`
- `npm run audit:permissions`
- `npm run check:browsers`
- `npm run test:e2e`
- `npm run package:release`

## Known Beta Gaps

- Final visible Chrome and Edge click-through results must be recorded before store submission.
- Store portal upload and review are not performed from this repository.
- Full destructive bookmark-tree replacement restore is deferred by decision.
- Post-beta AI/local recommendation features remain out of scope until release gates are closed.
