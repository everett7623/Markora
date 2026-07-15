# Store Submission Fields

Use this worksheet when copying FavGrove metadata into the Chrome Web Store and Microsoft Edge Add-ons portals.

## Listing

- Product name: `FavGrove - Bookmark Manager`
- Short description: `A local-first bookmark workspace for scanning, cleaning, importing, exporting, and backing up large Chrome and Edge bookmark collections.`
- Category: `Productivity`
- Support URL: `https://github.com/everett7623/FavGrove/issues`
- Privacy policy URL: `https://github.com/everett7623/FavGrove/blob/main/PRIVACY.md`
- Repository URL: `https://github.com/everett7623/FavGrove`

## Single Purpose

FavGrove helps users organize, scan, clean, import, export, and back up their browser bookmark collections locally inside Chrome or Edge.

## Permission Justifications

- `alarms`: Runs the optional daily local structure scan when automatic scanning is enabled.
- `bookmarks`: Reads and updates bookmarks for scan, cleanup, import, export, restore, and management workflows.
- `storage`: Stores local settings, tags, scan caches, search history, recent activity, and backups.
- Optional `<all_urls>` host access: Requested only when the user starts broken-link scanning so URLs can be checked directly from the extension.

The extension does not request the `tabs` permission.

## Data Usage

- No analytics.
- No telemetry.
- No advertising.
- No account sync.
- No sale or sharing of user data.
- No bookmark uploads to a developer-controlled server.
- Bookmark data stays in browser APIs and extension storage unless the user exports a file.

## Assets

- Store listing draft: `store/listing.md`
- Screenshots: `store/screenshots/`
- Promotional assets: `store/assets/`
- Extension package: `release/favgrove-v0.2.0.zip`

## Beta Notes

Use `v0.2.0` as a beta or pre-release label. Do not present this build as stable `1.0.0` until the visible browser checks, portal review, and final publication gates are complete.
