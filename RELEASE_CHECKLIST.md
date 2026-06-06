# Release Checklist

## Quality Gates

- [x] `npm install`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run test:e2e`
- [x] `npm run build`
- [x] `npm run validate:extension`
- [x] `npm run package:release`

## Localization

- [ ] English and Chinese locale key sets match.
- [ ] No user-facing strings are unintentionally hardcoded.
- [ ] Recent Activity and error messages follow the selected language.
- [ ] Dashboard, Scanner, link review, Manager, Import / Export, and Settings are manually checked in both languages.

## Manifest Review

- [x] Manifest version is `3`.
- [x] `package.json` and `manifest.json` versions match.
- [x] No popup page is configured.
- [x] Options page opens in a full browser tab.
- [ ] Required permissions have a documented user-facing purpose.
- [ ] Reconfirm whether the required `tabs` permission remains necessary before store submission.
- [x] `<all_urls>` remains optional and is requested only for broken-link scanning.

## Privacy And Security

- [x] `PRIVACY.md` matches current behavior.
- [x] No analytics, telemetry, remote tracking, or cloud upload was introduced.
- [x] Imported files and URLs are validated.
- [x] Destructive operations create backups where currently implemented.
- [x] No bookmark data is sent to a developer-controlled server.

## Manual Extension Checks

- [ ] Load `dist/` as an unpacked extension without manifest warnings.
- [ ] Clicking the extension action opens the full-screen options page.
- [ ] Dashboard, Scanner, Manager, Import / Export, and Settings routes open.
- [ ] Broken-link permission is requested only after starting a scan.
- [ ] Rename, move, delete, undo, folder merge, import, export, backup, and restore flows work.
- [ ] Light, dark, English, and Chinese settings persist after restart.

## Store Submission

- [ ] Store description is current.
- [ ] Privacy policy URL is publicly accessible.
- [ ] 1280x800 or 640x400 screenshots are prepared.
- [ ] 440x280 promotional tile is prepared if required.
- [ ] 128x128 store icon is prepared.
- [ ] Support URL and contact information are current.
- [x] Release ZIP contains only production extension files.
- [x] Repository license file is present and matches the README.
- [ ] Release is marked as beta or pre-release while the version is below `1.0.0`.

## Release Artifacts

The packaging command creates:

```txt
release/markora-v<version>.zip
```

Upload the generated ZIP to the Chrome Web Store or Microsoft Edge Add-ons portal.
