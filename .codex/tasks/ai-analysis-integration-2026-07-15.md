# AI Bookmark Analysis Integration

Date: 2026-07-15

## Status

- First read-only milestone implemented on 2026-07-16 after explicit user direction to continue before the earlier release-gate sequence was complete.
- Uses a user-provided OpenAI-compatible Chat Completions endpoint and model; no provider, SDK, shared key, or default network endpoint is bundled.
- Provider boundary decision: `docs/decisions/ai-provider-boundary.md`.
- Automated provider success, cancellation, failure, schema, privacy, and 10,000-bookmark paths are verified; a live-provider check requires user-owned credentials.

## Goal

Add an optional, read-only AI analysis flow that helps users understand and
organize large bookmark libraries without weakening FavGrove's local-first
privacy boundary or allowing model output to mutate bookmarks directly.

## First Milestone

Analyze a user-selected folder or bookmark scope and return structured,
explainable findings such as:

- topic and taxonomy summaries;
- folder and tag suggestions;
- possible organization and consolidation opportunities;
- low-confidence or ambiguous items that need manual review.

Existing deterministic scanners remain the source of truth for exact
duplicates, empty folders, and link status. AI analysis may explain those
results but must not replace deterministic checks.

## Non-Goals

- Automatic bookmark deletion, movement, merge, tagging, or import.
- Scheduled or background AI requests.
- Page-content scraping or sending browser history.
- Analytics, telemetry, account sync, or developer-controlled bookmark storage.
- Shipping a shared developer API key in the extension.
- Reusing broken-link permission consent as consent for AI data transfer.

## Required Decisions Before Implementation

- Execution model: user-provided local or remote Chat Completions-compatible endpoint.
- Provider and model: selected by the user; FavGrove has no default provider.
- Results: transient and not saved.
- Contract: versioned request and response schema `1`.
- Host permission: requested for the exact endpoint origin only after preview confirmation.

## Privacy And Security Requirements

- AI analysis is disabled by default and starts only from an explicit user action.
- Show the exact selected scope and fields before any remote request.
- Prefer local aggregates; minimize raw bookmark data sent to a provider.
- Strip URL query strings and fragments by default, and support domain-only analysis.
- Never send bookmark page content, backups, search history, recent activity, or ignored-link lists.
- Keep credentials local, never log them, and never include them in exports or diagnostics.
- Treat titles, URLs, paths, tags, and model output as untrusted data.
- Validate provider responses against the structured schema before rendering.
- Never translate model output directly into Chrome bookmark API mutations.
- Require the existing preview, backup, and confirmation flows for any later user-approved action.
- Document provider data handling in `PRIVACY.md`, store disclosures, and release notes before shipping.

## Architecture Boundaries

- Provider calls belong behind a service/background boundary, not in React components.
- Large-library preprocessing, deduplication, chunking, and token estimation belong in a Web Worker where practical.
- Zustand stores may orchestrate services but must not contain provider SDK code or secrets.
- UI code receives provider-neutral structured results.
- Requests must support cancellation, timeout, bounded retry, progress, and partial-failure reporting.
- Analysis must remain usable with at least 10,000 bookmarks through bounded batches.

## Development Phases

1. [x] Write the provider/data-boundary decision record and structured analysis contract.
2. [x] Implement deterministic local preprocessing with unit and performance coverage.
3. [x] Add a provider-neutral analysis service and background message contract.
4. [x] Add opt-in settings, transient credential handling, scope preview, token estimate, timeout, and cancellation.
5. [x] Add read-only analysis results with evidence and confidence.
6. [x] Update privacy/store documentation and add success, cancellation, failure, and disabled-state E2E coverage.

## Implemented Verification

- Full quality gates passed on 2026-07-16: ESLint, TypeScript strict checking, 26 Vitest files with 97 tests, the focused 10,000-bookmark benchmark, production extension validation and permission audit, Chrome/Edge headless load checks, and 11 Playwright E2E tests.
- AI remains disabled until the user opts in.
- Domain-only payloads exclude titles, paths, tags, URL queries, and fragments.
- Metadata payloads strip URL queries and fragments and cap samples at 200.
- 10,000 bookmarks are preprocessed locally through a bounded Worker path.
- Invalid schema, invalid confidence, invented evidence, permission denial, cancellation, and provider failure are covered.
- Model output remains read-only and cannot call bookmark mutation services.

## Acceptance Criteria

- With AI disabled, the extension makes no AI-provider request.
- A remote request cannot start without an explicit scope preview and confirmation.
- Provider credentials and raw requests do not appear in logs, analytics, exports, or error reports.
- Request payloads follow the approved minimization and URL-redaction rules.
- Invalid, partial, or malicious model output cannot trigger bookmark mutations.
- Analysis is cancellable and does not block the UI for large libraries.
- Results identify evidence and confidence and remain read-only in the first milestone.
- Unit tests cover preprocessing, redaction, schema validation, cancellation, and error mapping.
- E2E tests cover opt-in, preview, cancellation, success, provider failure, and disabled-state behavior.
- `PRIVACY.md`, store disclosures, and release notes match the implemented provider and data flow.
