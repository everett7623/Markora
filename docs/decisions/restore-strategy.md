# Restore Strategy Decision

Date: 2026-07-08

## Decision

FavGrove will not add a destructive full bookmark-tree replacement restore mode before the `1.0.0` stable release.

The current restore behavior remains the release path:

- The selected snapshot is compared with the current browser bookmark tree.
- Existing bookmarks and folders are never deleted or overwritten.
- Only missing URL occurrences are restored within their original parent folder.
- The original parent ID is reused when available; otherwise the folder path is used.
- Missing non-root folders are recreated, while a missing browser-managed root stops the restore.
- A safety backup is created before the first write, and failed writes roll back items created by that attempt.

## Rationale

- Browser root bookmark folders are special and cannot be treated as ordinary user folders.
- A full replacement mode would need a separate dry run, root-folder mapping, export confirmation, and broader E2E coverage.
- The current beta supports local backup creation, non-destructive missing-bookmark recovery, imports, exports, and backup retention.
- Avoiding full replacement reduces the risk of surprising data loss before broader beta feedback.

## Release Impact

This decision closes the pre-`1.0.0` release question. The beta recovery flow is additive and idempotent; full destructive replacement restore is deferred to post-beta planning and is not a blocker for the current beta or the first stable release candidate unless product requirements change.

## Future Acceptance Criteria

A future full replacement mode must include:

- A dry-run preview showing folders and bookmarks that will be created, moved, or removed.
- A required fresh export or safety backup before applying changes.
- Explicit confirmation copy that names the destructive scope.
- Root-folder handling for browser-managed folders.
- Unit coverage for tree diffing and E2E coverage using disposable bookmark trees.
