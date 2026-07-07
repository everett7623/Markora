# Post-Beta Local Recommendation Roadmap

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

## Validation

Future recommendation work should include unit coverage for ranking behavior, E2E coverage for accepted and dismissed suggestions, and clear privacy documentation before release.
