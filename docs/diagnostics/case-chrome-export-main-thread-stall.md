# Chrome Export Main-Thread Stall

Date: 2026-07-16

## Symptom

Import / Export interactions felt delayed, especially with a large bookmark
library.

## Data Collected

- Cold route navigation was sampled in installed Chrome through Playwright.
  Import / Export had a 138 ms median, comparable to the other lazy routes.
- Source inspection showed that one export click synchronously generated JSON,
  CSV, TXT, OPML, and HTML on the options-page main thread, then discarded four
  results.
- A 10,000-bookmark Chrome run after the fix produced a CSV download in 105 ms,
  displayed the export busy state, and recorded no Long Task entry.
- A 10,000-row CSV import preview completed in 167 ms through the existing
  import Worker. One 54 ms Long Task was observed around preview completion.

## Root Cause

`exportService.createFile` eagerly constructed every export format. Each format
flattened or serialized the bookmark tree synchronously, so a single click did
five main-thread jobs even though the user selected only one format.

## Fix

- Serialize only the requested format.
- Run export serialization in a dedicated Web Worker.
- Show a localized per-format busy label and disable duplicate export clicks.
- Show a localized busy label while the selected import strategy is writing.
- Clear import busy state through `try/finally`, including file-read failures.

## Regression Checks

- Unit coverage asserts that only the selected format is posted to the Worker.
- The 10,000-bookmark performance suite covers one requested export format.
- Playwright waits for a real CSV download produced through the Worker bundle.
