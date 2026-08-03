# Research Center Single Source Migration

> Migration date: 2026-08-01  
> Status: Active repository cutover completed; legacy library retained read-only for verification.

## Decision

The authoritative research source has moved to:

```text
https://github.com/joinwell52-AI/joinwell52
```

The previous ChatGPT Library folder `/TMPA` is deprecated and must not receive new research updates.

## Legacy inventory reviewed

The previous library contained these top-level areas:

```text
/TMPA
├── digital-employee
├── github
├── history
├── industry
├── papers
├── publication
├── weekly
└── README.md
```

The active subject areas already have corresponding repository locations:

| Legacy area | GitHub authoritative area |
|---|---|
| `weekly/` | `docs/en/research/weekly/` and `docs/zh/research/weekly/` |
| `papers/` | `docs/en/research/papers/` and `docs/zh/research/papers/` |
| `industry/` | `docs/en/industry/` and `docs/zh/industry/` |
| `github/` | `docs/en/engineering/` and `docs/zh/engineering/` |
| `digital-employee/` | `docs/en/digital-employee/` and `docs/zh/digital-employee/` |
| `publication/` | `docs/en/publications/` and `docs/zh/publications/` |
| `history/` | Git commit history, tags and releases |
| `README.md` | repository `README.md`, `README.zh-CN.md`, and governance documents |

## Important publication snapshots discovered

The migration review identified later local publication working drafts than some public Portal pages:

- TMPA Architecture Paper Draft A0.4;
- TMPA Core Specification Draft S0.3;
- TMPA–FCoP–CodeFlowMu Implementation Case Draft I0.3.

These files were retained in the deprecated read-only library during editorial reconciliation. They were not silently promoted as stable public releases. Reconciliation was completed before the Portal version number advanced.

This was an intentional governance safeguard: migration established one write authority immediately, while publication promotion remained an explicit editorial action. The deprecated library is no longer part of the active or archival publication system; Git history is the revision record.

## Cutover rules

From this migration onward:

1. all new research is written directly to GitHub;
2. daily and weekly automations update GitHub only;
3. the website is generated from repository content;
4. Git history replaces ordinary local revision folders;
5. the deprecated library is read-only and may be deleted after the identified publication snapshots are reconciled;
6. no document may be updated in both locations.

## Completion criteria

- [x] GitHub declared the only authoritative database;
- [x] bilingual repository paths established;
- [x] daily and weekly tasks target GitHub directly;
- [x] legacy folder inventory mapped to repository paths;
- [x] Git history adopted as the version system;
- [x] local library removed from the active workflow;
- [x] A0.4, S0.3 and I0.3 editorial reconciliation completed;
- [x] deprecated library removed after reconciliation.

The migration is complete. Current publication versions are maintained only in GitHub; superseded versions remain available only through Git history.
