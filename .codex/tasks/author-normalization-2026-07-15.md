# Author Attribution Normalization

Date: 2026-07-15

## Goal

Use `everettlabs` consistently for current FavGrove project attribution without
breaking repository URLs or silently rewriting published Git history.

## Attribution Map

| Surface | Value | Rule |
|---|---|---|
| License copyright | `everettlabs` | Replace the former display name |
| README author | `everettlabs` | Keep the real GitHub account URL |
| npm package author | `everettlabs` | Add explicit metadata |
| Extension manifest author | Omitted | CRXJS accepts an email object, not a display name |
| Repository-local Git author | `everettlabs` | Apply to future commits |
| GitHub owner path | `everett7623` | Keep because this is an account identifier |
| Published Git history | Existing values | Rewrite only with explicit force-push approval |

## Checklist

- [x] Inventory current author and copyright fields.
- [x] Replace the former active attribution with `everettlabs`.
- [x] Add explicit npm package author metadata.
- [x] Keep the extension manifest type-safe without inventing an author email.
- [x] Verify the repository-local Git author name.
- [ ] Decide whether to rewrite historical commit authors and force-push.

## Status

Current project attribution is normalized. Historical commits retain their
original authors until destructive history rewriting is explicitly approved.
