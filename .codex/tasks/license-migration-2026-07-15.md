# GPL-3.0-or-later License Migration

Date: 2026-07-15

## Goal

License the FavGrove `0.2.0` development line and future releases under
`GPL-3.0-or-later` while preserving historical license grants and third-party
dependency licenses.

## Scope

- Replace the repository `LICENSE` with the unmodified GNU GPL version 3 text.
- Declare `GPL-3.0-or-later` in project package metadata.
- Update README badges and license copy.
- Include the matching license text in production builds and release archives.
- Update release-readiness and handoff records.
- Keep dependency license metadata unchanged.
- Do not rewrite Git history or retroactively alter historical release assets.

## Checklist

- [x] Replace the MIT license text with the official GNU GPL version 3 text.
- [x] Add the `GPL-3.0-or-later` SPDX expression to root package metadata.
- [x] Align README, release notes, and project tracking documents.
- [x] Include the matching license in production build and release packaging.
- [x] Confirm current project license claims no longer state MIT.
- [x] Confirm third-party dependency licenses are unchanged.
- [x] Run focused validation and the project quality gates.

## Verification

- The repository `LICENSE` matches the GNU-hosted GPLv3 text exactly.
- `package.json` and the package-lock root both declare `GPL-3.0-or-later`.
- `dist/LICENSE` and `release/favgrove-v0.2.0.zip!/LICENSE` match the repository file byte-for-byte.
- ESLint, TypeScript strict checking, 66 Vitest tests, extension build validation, the permission audit, Chrome/Edge headless load checks, and release packaging passed.

## Compatibility Note

This migration applies to the current development line and future releases.
Copies previously received under MIT retain the rights already granted to them.
