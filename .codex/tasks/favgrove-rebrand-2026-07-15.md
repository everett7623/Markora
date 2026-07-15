# FavGrove Rebrand

Date: 2026-07-15

## Goal

Rename the current Markora public beta to FavGrove before Chrome Web Store and
Edge Add-ons submission, while preserving the published `v0.1.0` history and
all local browser data compatibility.

## Decisions

- New product brand: `FavGrove`.
- English product name: `FavGrove - Bookmark Manager`.
- Chinese product name: `FavGrove 书签管理器`.
- New development release: `0.2.0` beta.
- GitHub repository renamed to `everett7623/FavGrove` on 2026-07-15.
- Do not rewrite the historical `v0.1.0` release or delete old release assets.
- Preserve storage keys and other persisted data contracts.

## Compatibility Map

| Existing surface | FavGrove target | Compatibility rule |
|---|---|---|
| Display brand | FavGrove | Replace user-facing text |
| Manifest/package version | 0.2.0 | Keep `v0.1.0` history intact |
| Browser storage keys | Existing unbranded keys | Do not change |
| Auto-scan alarm ID | `markora-auto-scan` | Keep as a stable internal ID |
| Import formats | Existing schemas | Do not change schemas |
| GitHub repository URL | `/FavGrove` | Remote and local `origin` updated |
| Release archive | `favgrove-v<version>.zip` | New archives only; keep old files |

## TODO

- [x] Inventory every active brand and version reference.
- [x] Update application metadata, i18n, UI version, exports, tests, and scripts.
- [x] Update development, release, privacy, and store documentation.
- [x] Update promotional assets and regenerate screenshots if needed.
- [x] Verify no unintended active Markora/Bookmark Atlas references remain.
- [x] Run lint, typecheck, tests, extension build, and E2E checks.
- [x] Update `SESSION.md` and `PROGRESS.md` with the completed phase.

## Status

Completed on 2026-07-15. Active product surfaces now use FavGrove. Historical
`v0.1.0` material and the persisted `markora-auto-scan` alarm ID remain
intentionally unchanged for history and compatibility. The GitHub repository
was subsequently renamed to `everett7623/FavGrove`.

Verification passed: ESLint with 0 warnings, TypeScript strict checking, 66
Vitest tests, the 10,000-bookmark performance benchmark, production extension
build/validation and permission audit, Chrome/Edge browser checks, regenerated
store screenshots, 8 Playwright E2E tests, and release packaging/inspection for
`favgrove-v0.2.0.zip`.
