# Versioning

Markora follows Semantic Versioning while the product is below `1.0.0`.

## Current Version

`0.1.0`

This is the correct version for the first usable local testing and beta build. The project should not move backward to `0.0.x`, which is reserved for prototypes without a usable product baseline.

## Release Stages

- `0.1.x`: current beta stabilization and bug fixes.
- `0.2.0`: remaining core workflows, including multi-format import and localization completion.
- `0.9.x`: release candidates after performance, manual browser, privacy, and store checks pass.
- `1.0.0`: first stable Chrome and Edge store release.

## Rules

- Increment PATCH for compatible bug fixes.
- Increment MINOR for new features or meaningful workflow changes.
- Keep `package.json`, `manifest.json`, the UI footer, and release package filename synchronized.
- Use Git tags in the form `v0.1.0`.
- Mark GitHub releases as pre-release until `1.0.0`.
- Do not publish `1.0.0` while required items in `RELEASE_CHECKLIST.md` remain incomplete.
