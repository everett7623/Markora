# AI Bookmark Analysis Integration

Date: 2026-07-15

## Status

- Planned; implementation has not started.
- Blocked until the release gates in `RELEASE_CHECKLIST.md` are closed.
- No provider, model, SDK, API key, network endpoint, or new permission is configured by this task.

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

- Choose the execution model: on-device/local endpoint, user-provided API key,
  or a separately approved developer-operated service.
- Select the provider and model only after reviewing privacy, retention,
  training, regional availability, quota, cost, and license terms.
- Define whether results are transient or may be saved locally.
- Define an explicit versioned request and response schema.
- Decide the provider-specific optional host-permission strategy.

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

1. Write the provider/data-boundary decision record and structured analysis contract.
2. Implement deterministic local preprocessing with unit and performance coverage.
3. Add a provider-neutral analysis service and background message contract.
4. Add opt-in settings, credential handling, scope preview, cost/token estimate, and cancellation.
5. Add read-only analysis results with evidence, confidence, and dismissed-result handling.
6. Update privacy/store documentation and add E2E coverage before release.

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
