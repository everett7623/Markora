# Restore Strategy Decision

Date: 2026-07-08

## Decision

FavGrove will not add a destructive full bookmark-tree replacement restore mode before the `1.0.0` stable release.

The current restore behavior remains the release path:

- The selected backup snapshot is applied through the bookmark service boundary.
- A safety backup is created before restore starts.
- Existing browser-managed root folders are respected.
- Destructive operations stay explicit and scoped to the selected restore flow.

## Rationale

- Browser root bookmark folders are special and cannot be treated as ordinary user folders.
- A full replacement mode would need a separate dry run, root-folder mapping, export confirmation, and broader E2E coverage.
- The current beta already supports local backup creation, backup restore, imports, exports, and backup retention.
- Avoiding full replacement reduces the risk of surprising data loss before broader beta feedback.

## Release Impact

This decision closes the pre-`1.0.0` release question. Full destructive replacement restore is deferred to post-beta planning and is not a blocker for the current beta or the first stable release candidate unless product requirements change.

## Future Acceptance Criteria

A future full replacement mode must include:

- A dry-run preview showing folders and bookmarks that will be created, moved, or removed.
- A required fresh export or safety backup before applying changes.
- Explicit confirmation copy that names the destructive scope.
- Root-folder handling for browser-managed folders.
- Unit coverage for tree diffing and E2E coverage using disposable bookmark trees.
