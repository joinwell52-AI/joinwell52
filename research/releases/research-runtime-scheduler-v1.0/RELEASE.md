# Research Runtime Scheduler V1.0 — Release Record

- **Project:** joinwell52 Research Center
- **Center version:** 3.0
- **Capability:** Research Runtime Scheduler
- **Version:** V1.0
- **Release date:** 2026-08-02
- **Status:** Runtime architecture implemented; publication verification recorded through Runtime Record
- **System of record:** `joinwell52-AI/joinwell52`

## Release scope

This release establishes Research Runtime Center as the operational control plane of the Research Operating System.

It delivers:

- a Runtime Charter;
- one machine-readable scheduler manifest;
- seven formally named Runtime tasks and `Asia/Shanghai` schedules;
- a strict six-status model;
- a daily Runtime Record schema;
- a GitHub Actions scheduler that opens governed execution slots;
- a Runtime publication gate;
- generated Runtime Dashboard, Today’s Tasks, Timeline, History and Log;
- bilingual Runtime Center and formal publication pages;
- Research Center 3.0 repository, navigation and homepage integration.

## Authoritative artifacts

1. `research/runtime/README.md`
2. `research/runtime/SCHEDULER.json`
3. `research/runtime/RUNTIME-RECORD-SCHEMA.md`
4. `scripts/runtime-center.mjs`
5. `.github/workflows/research-runtime-scheduler.yml`
6. `docs/.vitepress/theme/components/RuntimeCenter.vue`
7. `docs/en/runtime/index.md`
8. `docs/zh/runtime/index.md`
9. `docs/en/publications/research-runtime-scheduler-v1.0.md`
10. `docs/zh/publications/research-runtime-scheduler-v1.0.md`

## Compatibility decision

Research OS remains the work-system and lifecycle definition. Research Runtime replaces historical automation naming and becomes the only formal scheduler and observability layer. Research Report Production Engine V1.0 remains the Digital Research Employee execution capability and operates as a Runtime worker.

## Formal constraint

Any official Publication without a Runtime Record is outside the formal Research Center 3.0 runtime lifecycle and is not an official runtime output.
