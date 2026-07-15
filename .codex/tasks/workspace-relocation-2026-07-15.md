# FavGrove Workspace Relocation

Date: 2026-07-15

## Goal

Move the complete local repository from the former lowercase project directory
to `D:\EvenFrank\Workspace\Plugins\Google\FavGrove` without losing Git metadata,
uncommitted changes, generated files, or dependencies.

## Verification

- [x] Source and target are direct children of the intended Google plugins directory.
- [x] The pre-existing target directory was empty.
- [x] Hidden repository data, including `.git`, moved to the new path.
- [x] Working-tree changes and untracked files were preserved.
- [x] Branch tracking and the `everett7623/FavGrove` remote were preserved.
- [x] `git fsck --no-dangling` passed after relocation.
- [x] Documentation now uses the FavGrove workspace path.

## Rollback

Move the repository contents back to the former sibling directory if a local
tool requires the previous path. No repository data conversion was performed.
