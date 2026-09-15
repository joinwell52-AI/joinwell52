# Execution facts — 15 September 2026

This user-directed study classified seven radar groups containing eleven primary changes, ran four bounded experiments, and produced three bilingual articles. PR status and exact revisions are snapshots in [sources/index.json](sources/index.json).

| Experiment | Actual execution | Finding | Limit |
| --- | --- | --- | --- |
| SDK #5029 | Real Realtime entry point, recording model and local list effect; candidate vs one predecessor method | Four invalid top-level settings change from one invocation to UserError/zero calls; callback None still invokes | 10 inputs × 2 modes; original 31 approval tests only, not all Realtime tests |
| CrewAI #7458 | Four unchanged methods with dependency doubles; actual temporary SQLite commits | Sync/async: one attempt 2→1 writes; three attempts 6→3; controls stay 1 | 16 observations; no full framework or remote service |
| Orca #20723 | Complete pinned modules with real imports; synthetic history and outbox inputs | Empty history remains unknown; recovered rejection retains unconfirmed state and does not request a fresh ID | 20 observations; no actual send, mobile or orchestration test. Unmarked rejection/not_delivered still requests a new ID; this is a synthetic input, not proven producer behavior |
| Paperclip #13443 | Unchanged budget function and selected recovery branches; scripted DB rows, escalation recorder | Pause scenarios skip; active budget blocks still request escalation; cause survives a later resume | 14 observations; no PostgreSQL, persisted task mutation or full recovery sweep |

The remaining sources concern semantic fan-out permission, optional Windows registered identity, credentials in a sandbox branch, and incomplete canonical-run consumer migration. They were classified for observation rather than converted into mock “reproductions.”

## Evidence and reproduction

- [Chinese report and commands](README.md)
- [Detailed methods and limitations](02-experiments.md)
- Probes: [SDK](probe-sdk.py), [CrewAI](probe-crew.py), [Orca](probe-orca.mjs), [Paperclip](probe-paperclip.mjs)
- Saved output: [SDK](runs/sdk.json), [CrewAI](runs/crew.json), [Orca](runs/orca.json), [Paperclip](runs/paperclip.json)
- Run `node verify.mjs` to verify saved observations and file hashes. This is not a rerun. `node fetch-sources.mjs` retrieves pinned source; `node verify.mjs --sources` checks the source hashes.

No corresponding CodeFlowMu defect or new product requirement was established in this study. There are zero formal development-review items, and no product implementation was started. Discussion drafts, sent comment bodies and engagement receipts are local-only.
