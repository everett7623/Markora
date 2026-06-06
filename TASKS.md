
# Markora - Bookmark Atlas

Roadmap

---

# P0 Foundation

TASK-001

Initialize Vite project

Acceptance:

- React works
    
- Build passes
    

---

TASK-002

Configure CRXJS

Acceptance:

- Extension loads
    

---

TASK-003

Create Manifest V3

Acceptance:

- No warnings
    

---

TASK-004

Setup Tailwind

Acceptance:

- Tailwind classes available
    

---

TASK-005

Setup Zustand

Acceptance:

- Store working
    

---

TASK-006

Setup Router

Acceptance:

- HashRouter working
    

---

TASK-007

Create Application Layout

Acceptance:

- Header
    
- Sidebar
    
- Footer
    
- Content Area
    

---

# P1 Dashboard

TASK-101

Statistics Cards

Acceptance:

- Total bookmarks
    
- Total folders
    
- Duplicate count
    
- Invalid count
    

---

TASK-102

Global Search

Acceptance:

- 300ms debounce
    

---

TASK-103

Search History

Acceptance:

- Last 10 searches
    

---

TASK-104

Keyboard Shortcut

Acceptance:

Ctrl+K

---

TASK-105

Recent Activity

Acceptance:

- Latest operations

---

TASK-106

Pinyin Search

Status:

- Not implemented

Acceptance:

- Chinese bookmark titles can be matched by full pinyin
- Chinese bookmark titles can be matched by pinyin initials
- Existing title, URL, and folder path search remains available
- Search remains debounced at 300ms

---

TASK-107

Dashboard Quick Actions

Status:

- Not implemented

Acceptance:

- Start scan from Dashboard
- Open import flow from Dashboard
- Open bookmark cleanup or manager flow from Dashboard
- Actions use existing routes and services

---

TASK-108

Dashboard Smart Recommendations

Status:

- Not implemented

Acceptance:

- Show local recommendations derived from scan results
- Recommend duplicate cleanup, empty-folder cleanup, or broken-link review
- Do not upload bookmark data
- Recommendations link to the relevant repair workflow
    

---

# P2 Scanner

TASK-201

Duplicate Bookmark Scanner

Acceptance:

- URL exact match
    

---

TASK-202

Duplicate Folder Scanner

Acceptance:

- Same folder name
    

---

TASK-203

Empty Folder Scanner

Acceptance:

- Recursive scan
    

---

TASK-204

Broken Link Worker

Acceptance:

- Worker based
    

---

TASK-205

Progress UI

Acceptance:

- Real-time updates
    

---

TASK-206

Result Cache

Acceptance:

- 24h cache

---

TASK-207

Empty Folder Cleanup

Status:

- Detection implemented
- Cleanup not implemented

Acceptance:

- Delete one detected empty folder
- Support batch cleanup
- Create a backup before deletion
- Refresh bookmark state and scan cache after cleanup
- Do not delete protected browser root folders

---

TASK-208

Link Issue Review Workflow

Status:

- Implemented

Acceptance:

- Scanner summary links to a dedicated detail page
- Separate confirmed broken links from links that could not be verified
- Explain timeout, network, proxy, DNS, TLS, region, and HTTP failures
- Paginate large result sets
- Open links for manual verification
- Batch delete selected bookmarks with backup creation
    

---

# P3 Manager

TASK-301

Folder Tree

TASK-302

Drag Drop

TASK-303

Rename Folder

TASK-304

Move Bookmarks

TASK-305

Batch Delete

TASK-306

Undo Operation

TASK-307

Tag System

TASK-308

Filter By Tag

---

TASK-309

Batch Edit

Status:

- Batch move and batch delete implemented
- Batch edit not implemented

Acceptance:

- Apply tags to multiple selected bookmarks
- Remove tags from multiple selected bookmarks
- Validate changes before writing
- Keep existing batch move and delete behavior

---

TASK-310

Collapsible Folder Tree

Status:

- Hierarchical indentation and folder filtering implemented
- Expand and collapse controls not implemented

Acceptance:

- Preserve real parent-child hierarchy
- Expand and collapse nested folders
- Keep selection and drag/drop behavior
- Remain responsive with large folder collections

---

# P4 Import Export

TASK-401

HTML Import

TASK-402

JSON Export

TASK-403

CSV Export

TASK-404

TXT Export

TASK-405

OPML Export

TASK-406

Conflict Resolver

TASK-407

Backup Before Import

---

TASK-408

JSON Import

Status:

- Not implemented

Acceptance:

- Parse Markora JSON exports in a Web Worker
- Validate schema, URLs, titles, and folder paths
- Show the existing import preview and conflict resolver
- Create a backup before writing bookmarks
- Recreate the exported folder hierarchy

---

TASK-409

CSV Import

Status:

- Not implemented

Acceptance:

- Parse UTF-8 CSV files with quoted fields in a Web Worker
- Support title, URL, and folder path columns
- Reject malformed or unsupported rows with a useful summary
- Use the existing import preview, conflict resolver, and backup flow

---

TASK-410

TXT Import

Status:

- Not implemented

Acceptance:

- Parse Markora TXT exports in a Web Worker
- Validate HTTP and HTTPS URLs
- Preserve titles and folder paths when present
- Use the existing import preview, conflict resolver, and backup flow

---

TASK-411

OPML Import

Status:

- Not implemented

Acceptance:

- Parse OPML link outlines in a Web Worker
- Validate XML structure without unsafe HTML rendering
- Preserve nested outline paths
- Use the existing import preview, conflict resolver, and backup flow

---

# P5 Settings

TASK-501

Theme

TASK-502

Language

TASK-503

Scanner Config

TASK-504

Cache Config

TASK-505

Backup Config

---

TASK-506

Apply Backup Retention Setting

Status:

- Setting UI and persistence implemented
- Backup service still uses the fixed default retention

Acceptance:

- Backup creation uses the persisted retention setting
- Changing retention trims excess backups safely
- Default remains 10 backups
- Retention supports the configured 1-50 range

---

TASK-507

Apply Cache Duration Setting

Status:

- Implemented

Acceptance:

- Scanner cache reads use the persisted cache duration
- Expired cache is ignored
- Manual scans always refresh and replace cached results

---

TASK-606

Accuracy-Preserving Link Scan Acceleration

Status:

- Implemented

Acceptance:

- Check each exact URL only once per scan
- Map one URL result back to every matching bookmark
- Calculate progress from the real bookmark count
- Interleave different hostnames
- Limit a single hostname to two concurrent requests
- Support at least 10,000 bookmarks in grouping tests

---

# P6 Optimization

TASK-601

Virtual List

TASK-602

Worker Pool

TASK-603

Lazy Loading

TASK-604

Memo Optimization

TASK-605

Performance Monitoring

---

# P7 AI

TASK-701

Tag Recommendation

TASK-702

Folder Merge Recommendation

TASK-703

Bookmark Classification

TASK-704

Smart Search

---

# P8 Release

TASK-801

Privacy Policy

TASK-802

Store Assets

TASK-803

Chrome Store Package

TASK-804

Release Build

---

TASK-805

Complete English And Chinese Localization

Status:

- Translation resources exist for both languages
- Key parity and UI coverage are incomplete

Acceptance:

- English and Chinese locale files have identical key sets
- No user-facing English strings remain hardcoded in React components
- Recent Activity messages render in the selected language
- Service and Worker errors are mapped to localized user-facing messages
- English and Chinese manual route checks pass

---

TASK-806

Release Versioning

Status:

- Version policy documented in `VERSIONING.md`
- Current development version is `0.1.0`

Acceptance:

- `package.json`, `manifest.json`, UI footer, and release filename use the same version
- Git tags use `v<version>`
- Pre-release status is marked in GitHub or store metadata
- Stable `1.0.0` is not published until all release gates pass

---

TASK-807

Repository License

Status:

- README declares MIT
- LICENSE file is missing

Acceptance:

- Add an MIT `LICENSE` file
- Confirm copyright holder and year
- README license claim matches the repository file

---

# Core Feature Audit

Reviewed against the current implementation on 2026-06-06.

## Dashboard

- Implemented: 300ms debounced title, URL, and folder path search.
- Missing: pinyin search.
- Implemented: four statistics cards.
- Missing: quick action buttons.
- Missing: smart recommendation cards.

## Scanner

- Implemented: duplicate bookmark detection and cleanup.
- Implemented: duplicate folder detection and merge.
- Implemented: broken-link checks in a Web Worker.
- Implemented: recursive empty-folder detection.
- Missing: empty-folder deletion and batch cleanup.

## Manager

- Implemented: hierarchical folder display and folder filtering.
- Partial: folder tree has indentation but no expand/collapse controls.
- Implemented: batch move and batch delete.
- Missing: batch edit.
- Implemented: tags and tag filtering.
- Implemented: drag/drop move and bookmark ordering.

## Import / Export

- Implemented: HTML import.
- Implemented: HTML, JSON, CSV, TXT, and OPML export.
- Missing: JSON, CSV, TXT, and OPML import.
- Implemented: URL conflict handling.
- Implemented: backup before import.

## Settings

- Implemented: persisted theme and language.
- Implemented: scanner configuration.
- Partial: backup retention is persisted but not applied by `backupService`.
- Implemented: cache duration is applied when Scanner loads cached results.

## Localization

- English and Chinese resources are configured.
- Missing: 15 Chinese translation keys currently present in the English locale.
- Missing: localization for Scanner labels, Manager prompts and accessibility labels, Recent Activity messages, backup metadata, loading text, and service/Worker errors.
- Current localization is not release-complete.

END
