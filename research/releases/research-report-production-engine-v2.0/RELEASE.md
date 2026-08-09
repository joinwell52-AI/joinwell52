# Research Report Production Engine V2.0 — Release

**Release date:** 2026-08-09  
**Status:** Current Capability Release  
**Runtime:** Research Runtime Center V5.0  
**Scheduler:** Research Runtime Scheduler V3.0  
**Process manager:** Completion-driven catch-up + heartbeat safety net  
**Public delivery gate:** Publication Visibility Gate V1.0

## Release definition

V2.0 upgrades the Research Report Production Engine from a time-triggered research production line to a dependency-driven, recoverable, self-validating and publicly verifiable Digital Research Employee Runtime.

## Permanent capabilities

- GitHub schedule is a wake-up signal; Runtime records remain operational truth.
- Offset heartbeat schedule reduces top-of-hour concentration and remains a safety net.
- Same-day overdue tasks remain eligible for catch-up.
- Daily dependency chain is Discovery → Queue → Reading → Analysis → Production → Publication.
- Sunday Weekly depends on completed Publication.
- Dependency-caused Blocked work may be reopened after its prerequisite completes.
- Completed, Failed, Skipped and unrelated Blocked work are not automatically reopened.
- Runtime V5 validation accepts legitimate historical flat and structured shift-result forms.
- Human-readable Runtime projection handles structured narratives and evidence without `[object Object]` leakage.
- Runtime and Markdown validation are mandatory control-plane checks.
- Scheduled, manual, fallback and recovery requests share one ordered reconciliation rule; manual dispatch cannot bypass the earliest runnable due task.
- A downstream task found `Running` or `Completed` before its prerequisite is `Completed` is invalidated back into governed recovery with durable audit evidence.
- Runtime pages expose ordered recovery progress from the same live Runtime Record used by task cards.
- Pages verification refuses to publish an order-inconsistent Runtime surface.
- Running is a bounded lease; stale execution slots expire back into governed recovery rather than remaining “Running” indefinitely.
- Workers complete through `Research Runtime Shift Completion V2.0`, which validates a durable Result, renders the ledger, commits and verifies it.
- A successful completion immediately emits `workflow_run` to Scheduler. If the next dependency-ready stage is already overdue, it starts immediately; cron is not required for that handoff.
- Future stages retain their formal time gate. Immediate catch-up never starts a not-yet-due task.
- Scheduler and generic Completion workflow events explicitly trigger Pages Build, Verify and Publish, including GITHUB_TOKEN-authored Runtime commits.
- Publication `Completed` is not treated as final public delivery. The latest Release Manifest must pass `scripts/publication-visibility.mjs` before `gh-pages` can be updated.
- Publication Visibility Gate verifies bilingual sources, clean-URL HTML routes, Research-index discoverability, matching column-index discoverability and required cover assets.
- Observation Notes exposes a dedicated same-day `TodayPublished` surface so formal daily releases are immediately visible instead of being buried in history.

## Production recovery evidence — 2026-08-09

The Sunday runtime exposed a real recovery case: Reading was missed, Analysis opened before Reading completion and became Blocked, historical structured results prevented Scheduler state persistence, and Markdown projection rendered structured Queue output incorrectly. A later fallback also opened Production while Reading was still Running and Analysis was Blocked, proving that automatic and manual/fallback entry paths had to share the same ordering gate.

The permanent repair restored Reading, marked Analysis with `blockedBy: reading`, installed dependency-aware scheduling and governed Blocked retry, centralized reconciliation in `scripts/runtime-reconcile.mjs`, denied out-of-order manual dispatch, added automatic correction for impossible downstream state, repaired projection, added a frontend recovery-progress surface, added a Pages order-consistency gate, and installed Running Lease Watchdog.

The final process-management defect was that an overdue successor still waited for a later cron after its prerequisite completed. V2.0 now uses a durable Completion Request and `workflow_run` handoff:

```text
Worker result + artifacts
→ runtime-shift-completion-request/v1
→ Research Runtime Shift Completion V2.0
→ validate + render + durable commit + verify
→ workflow_run
→ Scheduler reconcile immediately
→ start the next overdue dependency-ready stage
```

Production verification on 2026-08-09 demonstrated the rule:

- Analysis completion unlocked Production without waiting for its next formal clock point;
- Production produced three bilingual candidate pairs and three semantic SVGs;
- the first push-request run of the generic Completion workflow passed every step;
- Scheduler was awakened within seconds by `workflow_run`;
- Publication remained Waiting because its formal 20:00 time had not arrived.

Publication then released 3 items as 6 bilingual public articles. A separate delivery defect was exposed: a release could technically exist while the user-facing discovery path was too weak. V2.0 therefore introduced Publication Visibility Gate V1.0 and `TodayPublished`.

The first visibility-gate execution intentionally failed before publishing because the checker assumed the wrong VitePress clean-URL artifact path. After correcting the gate to the actual `cleanUrls: true` output (`slug.html`), Pages Run #235 passed:

```text
Build VitePress site: success
Verify generated site: success
Publication Visibility Gate: PASS
Publish gh-pages branch: success
```

The gate verified all three same-day released items as routable and discoverable in both languages. The deployed Chinese Research index now presents `今日发布 · 3` with direct links to all three articles.

## Recovery and delivery invariants

> Restore durable facts first; recover the earliest dependency-ready gap; validate and persist it; then advance immediately when the successor is already overdue.

> An article that cannot be found through an official public entry point is not a completed public delivery.

Every entry path obeys the same process invariant:

```text
schedule / completion event / manual / fallback / recovery
                         ↓
                   reconcile facts
                         ↓
      oldest due + incomplete + dependency-ready task
                         ↓
                  open one stage only
                         ↓
 worker result + Runtime/Markdown validate + durable Git verify
                         ↓
       immediate completion event advances overdue successor
                         ↓
        heartbeat remains available as the recovery safety net
```

Publication adds a delivery invariant:

```text
Publication Completed
→ Release Manifest Released
→ bilingual routes + indexes + covers verified
→ Publication Visibility Gate PASS
→ Pages Publish
→ public delivery accepted
```

## Process specifications

- `research/runtime/PROCESS-MANAGER-V2.zh-CN.md`
- `research/runtime/PROCESS-MANAGER-V2.md`
- `research/runtime/PUBLICATION-VISIBILITY-GATE.zh-CN.md`
- `research/runtime/PUBLICATION-VISIBILITY-GATE.md`

## Public documents

- `docs/zh/publications/research-report-production-engine-v2.0.md`
- `docs/en/publications/research-report-production-engine-v2.0.md`
- `docs/zh/publications/research-report-production-engine-v2.0-quickstart.md`
- `docs/en/publications/research-report-production-engine-v2.0-quickstart.md`

V1.3 remains immutable as the previous historical capability release.
