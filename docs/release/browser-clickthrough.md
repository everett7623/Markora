# Browser Click-Through Checklist

Use this checklist for the final visible Chrome and Edge pass. Automated headless loading is still covered by `npm run check:browsers`; this document captures the human-visible workflow that must be recorded before store submission.

## Build Under Test

```bash
npm run build:extension
npm run check:browsers
```

Load only:

```text
D:\EvenFrank\Workspace\Github\markora\dist
```

Do not load the project root or `.crx-dev`.

## Result Log

| Date | Browser | Version | Tester | Result | Notes |
|---|---|---|---|---|---|
| Pending | Chrome | Pending | Pending | Pending |  |
| Pending | Edge | Pending | Pending | Pending |  |

## Required Checks

- Load `dist/` as an unpacked extension with no manifest warnings.
- Confirm the extension action opens the full-screen FavGrove options page.
- Open Dashboard, Scanner, Manager, Import / Export, and Settings from the built extension.
- Confirm broken-link scanning requests optional `<all_urls>` host access only after the user starts a link scan.
- Exercise rename, move, delete, undo, duplicate-folder merge, import preview, export, backup, and restore flows on disposable bookmark data.
- Confirm light mode, dark mode, English, and Chinese settings persist after browser restart.
- Confirm no popup page appears and all primary workflows remain in the options tab.

## Notes

- Use disposable bookmark folders and exported backup files during this pass.
- Record browser versions from `chrome://version` and `edge://version`.
- If a browser shows a Manifest V3 warning, stop the release pass and fix the manifest before continuing.
