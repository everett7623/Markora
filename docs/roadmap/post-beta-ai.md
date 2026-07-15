# Post-Beta AI Analysis And Local Recommendation Roadmap

Post-beta AI and recommendation work starts only after the release gates in `RELEASE_CHECKLIST.md` are closed.

## Release Gates Before Starting

- Visible Chrome and Edge click-through checks are recorded.
- Store submission metadata is copied into the target portals.
- Public privacy policy and support URLs are confirmed.
- GitHub beta pre-release metadata is published or ready for publication.
- The release package under `release/` is generated from a passing production build.

## Guardrails

- Prefer local deterministic recommendations before AI-assisted behavior.
- Do not upload bookmark data to developer-controlled servers.
- Do not introduce analytics, telemetry, or account sync as part of recommendations.
- Keep recommendation output explainable and reversible.
- Keep destructive cleanup actions behind previews, backups, and confirmations.

## Candidate Work

- Better local folder recommendations from bookmark title, URL, tags, and existing folder paths.
- Local duplicate-cluster explanations with suggested cleanup priority.
- Tag suggestions derived from local bookmark metadata.
- Search ranking improvements based on local usage and recency.
- Optional future model integration only if privacy, consent, and data-boundary requirements are explicitly approved.

## First AI Milestone

The first model-backed feature is `TASK-705 AI Bookmark Library Analysis`.
Its implementation specification is recorded in
`.codex/tasks/ai-analysis-integration-2026-07-15.md`.

The milestone is intentionally read-only. It analyzes a user-selected scope,
returns provider-neutral structured findings, and does not directly delete,
move, merge, or tag bookmarks.

## Required Sequence

1. Close the beta release gates.
2. Approve the provider, model, execution mode, data boundary, and credential strategy.
3. Define a versioned request/response schema and local preprocessing contract.
4. Implement opt-in scope preview, URL redaction, token/cost estimation, and cancellation.
5. Add the provider-neutral service/background boundary and structured result UI.
6. Complete privacy, store disclosure, unit, performance, and E2E validation before release.

No provider SDK or endpoint should be added before steps 1 through 3 are complete.

## Validation

Future recommendation work should include unit coverage for ranking behavior, E2E coverage for accepted and dismissed suggestions, and clear privacy documentation before release.
