# Store Assets

Source assets for browser-store submission.

## Included

- `promo-440x280.svg`: small promotional tile source.
- `marquee-1400x560.svg`: large promotional image source.
- `../../public/icons/icon128.png`: store icon source.

## Screenshot Sources

Generated screenshots are stored in `../screenshots/` and can be refreshed with:

```bash
npm run capture:store-screenshots
```

Current screenshot set at 1280x800:

1. Dashboard with quick actions and local recommendations.
2. Scanner after a completed scan.
3. Manager with folder tree and bookmark list.
4. Import / Export preview.
5. Settings backup and scanner configuration.

Do not capture `.crx-dev`; manual screenshots must use the validated `dist/` extension.
