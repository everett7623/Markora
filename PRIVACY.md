# Privacy Policy

Last updated: July 16, 2026

FavGrove is a local-first Chrome and Edge extension for organizing browser bookmarks.

## Data Collection

The extension does not collect, sell, transmit, or share personal information.

It does not include:

- Analytics
- Telemetry
- Advertising
- Remote tracking
- Cloud synchronization
- Bookmark uploads

## Local Data

The extension processes bookmark data locally in the browser. Settings, scan caches, search history, tags, recent activity, backups, and pending extension-update version metadata are stored with the browser extension storage API.

This data remains on the user's device unless the user explicitly exports a file.

## Permissions

- `alarms`: Schedules the optional daily local bookmark structure scan when the user enables automatic scanning in Settings.
- `bookmarks`: Reads and updates the user's bookmark tree when the user uses management features.
- `storage`: Stores settings, local tags, scan caches, search history, recent activity, and backups.
- Optional `<all_urls>` host access: Requested only when the user starts broken-link checking. It is used to send direct link-validation requests and is not used to collect page content.

## Network Requests

Network requests are made only for URLs selected by the broken-link scanner. Bookmark data is not sent to a developer-controlled server.

## Extension Updates

Chrome and Edge manage store update checks and downloads. FavGrove listens for the browser's update-ready event, stores only the available version and detection time locally, and shows a reload notice. FavGrove does not poll Google, Microsoft, or GitHub for version information.

## Imports And Exports

Imported bookmark files are parsed locally. Exported files are generated locally and downloaded only at the user's request.

## Data Deletion

Users can delete extension-managed backups and browser bookmarks from within the extension. Removing the extension also removes extension-local storage according to browser behavior.

## Changes

Material privacy changes will be documented in this file and reflected in the extension release notes.

## Contact

Project repository:

https://github.com/everett7623/FavGrove
