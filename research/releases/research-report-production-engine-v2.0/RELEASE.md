# Research Report Production Engine V2.0 — Release

**Release date:** 2026-08-09  
**Status:** Current Capability Release  
**Runtime:** Research Runtime Center V5.0  
**Scheduler:** Research Runtime Scheduler V3.0

## Release definition

V2.0 upgrades the Research Report Production Engine from a time-triggered research production line to a dependency-driven, recoverable and self-validating Digital Research Employee Runtime.

## Permanent capabilities

- GitHub schedule is a wake-up signal; Runtime records remain operational truth.
- Offset heartbeat schedule reduces top-of-hour concentration.
- Same-day overdue Waiting tasks remain eligible for catch-up.
- Only the oldest runnable overdue task is opened per heartbeat.
- Daily dependency chain is Discovery → Queue → Reading → Analysis → Production → Publication.
- Sunday Weekly depends on completed Publication.
- Dependency-caused Blocked work may be reopened after its prerequisite completes.
- Completed, Failed, Skipped and unrelated Blocked work are not automatically reopened.
- Runtime V5 validation accepts legitimate historical flat and structured shift-result forms.
- Human-readable Runtime projection handles structured narratives and evidence without `[object Object]` leakage.
- Runtime and Markdown validation are mandatory control-plane checks.

## Production recovery evidence — 2026-08-09

The Sunday runtime exposed a real recovery case: Reading was missed, Analysis opened before Reading completion and became Blocked, historical structured results prevented Scheduler state persistence, and Markdown projection rendered structured Queue output incorrectly. The permanent repair restored Reading, marked Analysis with `blockedBy: reading`, installed dependency-aware scheduling and governed Blocked retry, repaired projection, validated Runtime V5, and removed temporary hotfix machinery.

## Recovery invariant

> Restore durable facts first; recover the earliest dependency-ready gap; validate and persist it; only then advance downstream work.

## Public documents

- `docs/zh/publications/research-report-production-engine-v2.0.md`
- `docs/en/publications/research-report-production-engine-v2.0.md`
- `docs/zh/publications/research-report-production-engine-v2.0-quickstart.md`
- `docs/en/publications/research-report-production-engine-v2.0-quickstart.md`

V1.3 remains immutable as the previous historical capability release.
