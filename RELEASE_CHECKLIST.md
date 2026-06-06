# Release Checklist

## Quality Gates

- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run test:e2e`
- [ ] `npm run build`
- [ ] `npm run validate:extension`
- [ ] `npm run package:release`

## Localization

- [ ] English and Chinese locale key sets match.
- [ ] No user-facing strings are unintentionally hardcoded.
- [ ] Recent Activity and error messages follow the selected language.
- [ ] Dashboard, Scanner, link review, Manager, Import / Export, and Settings are manually checked in both languages.

## Manifest Review

- [ ] Manifest version is `3`.
- [ ] `package.json` and `manifest.json` versions match.
- [ ] No popup page is configured.
- [ ] Options page opens in a full browser tab.
- [ ] Required permissions have a documented user-facing purpose.
- [ ] Reconfirm whether the required `tabs` permission remains necessary before store submission.
- [ ] `<all_urls>` remains optional and is requested only for broken-link scanning.

## Privacy And Security

- [ ] `PRIVACY.md` matches current behavior.
- [ ] No analytics, telemetry, remote tracking, or cloud upload was introduced.
- [ ] Imported files and URLs are validated.
- [ ] Destructive operations create backups where required.
- [ ] No bookmark data is sent to a developer-controlled server.

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
- [ ] Release ZIP contains only production extension files.
- [ ] Repository license file is present and matches the README.
- [ ] Release is marked as beta or pre-release while the version is below `1.0.0`.

## Release Artifacts

The packaging command creates:

```txt
release/markora-v<version>.zip
```

Upload the generated ZIP to the Chrome Web Store or Microsoft Edge Add-ons portal.
