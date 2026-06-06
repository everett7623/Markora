# Markora - 书签星图

Professional Chrome Bookmark Management Extension

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Manifest](https://img.shields.io/badge/Manifest-V3-green)  
![React](https://img.shields.io/badge/React-18-blue)  
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## Overview

Markora is a modern Chrome / Edge extension designed for users with large bookmark collections.

Unlike traditional bookmark tools, this extension provides a full-screen management experience similar to a standalone web application.

Built for:

- Power users
    
- Developers
    
- Researchers
    
- Bookmark collectors
    

Supports:

- 10,000+ bookmarks
    
- Duplicate detection
    
- Broken link scanning
    
- Folder optimization
    
- Import & export
    
- Automatic backup
    
- Dark mode
    
- Multi-language support
    

---

## Features

### Dashboard

- Global search
    
- Statistics overview
    
- Quick actions
    
- Recent activity
    

### Scanner

- Duplicate bookmark detection
    
- Duplicate folder detection
    
- Empty folder cleanup
    
- Broken link scanner
    

### Manager

- Tree view
    
- Drag & drop
    
- Batch operations
    
- Tag system
    

### Import & Export

- Import: HTML

- Export: HTML, JSON, CSV, TXT, OPML
    

### Settings

- Theme switching
    
- Language switching
    
- Backup settings
    
- Scanner settings
    

---

## Screenshots

Coming Soon

---

## Tech Stack

- React 18
    
- TypeScript
    
- Vite
    
- CRXJS
    
- Manifest V3
    
- Zustand
    
- Tailwind CSS
    
- shadcn/ui
    
- Vitest
    

---

## Installation

### Development

Clone repository:

```bash
git clone https://github.com/everett7623/bookmark-manager.git

cd bookmark-manager
```

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Load extension:

```txt
Chrome
→ Extensions
→ Developer Mode
→ Load unpacked
→ dist/
```

---

## Build

```bash
npm run build
```

Output:

```txt
dist/
```

---

## Release Package

```bash
npm run build
npm run package:release
```

Output:

```txt
release/markora-v0.1.0.zip
```

Before publishing, complete [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

---

## Versioning

The current `0.1.0` build is a beta baseline. See [VERSIONING.md](VERSIONING.md) for the path to `1.0.0`.

---

## Project Structure

```txt
src/
├── background/
├── workers/
├── services/
├── stores/
├── shared/
├── features/
└── router/
```

---

## Development

Project documentation:

```txt
DEVELOPMENT_GUIDE.md
```

AI agent instructions:

```txt
AGENTS.md
```

Development roadmap:

```txt
TASKS.md
```

Code review rules:

```txt
code_review.md
```

---

## Browser Support

|Browser|Version|
|---|---|
|Chrome|120+|
|Edge|120+|

---

## Privacy

Markora:

- Does not upload bookmarks
    
- Does not track users
    
- Does not use analytics
    
- Does not collect personal data
    

All data remains inside the browser.

See [PRIVACY.md](PRIVACY.md) for the full privacy policy.

---

## Roadmap

### v1.0

- Dashboard
    
- Scanner
    
- Manager
    
- Import Export
    

### v1.1

- Advanced filtering
    
- Backup improvements
    

### v2.0

- AI bookmark organization
    
- Smart tagging
    
- Folder optimization
    

---

## Contributing

Please read:

```txt
AGENTS.md
DEVELOPMENT_GUIDE.md
```

before submitting changes.

---

## License

MIT License

---

## Author

Jensfrank

GitHub:  
[https://github.com/everett7623](https://github.com/everett7623)

Website:  
[https://seedloc.com](https://seedloc.com/)

---

⭐ If this project helps you, please consider starring the repository.
