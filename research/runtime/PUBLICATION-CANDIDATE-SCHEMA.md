# Publication Candidate Contract V1

## Purpose

**Research Runtime Production** runs every day at 15:00. It does not publish. It converts eligible analyzed research objects into complete, bilingual **Publication Candidates** by executing:

```text
Skill 05 — Research Writing
→ Skill 06 — Visualization
→ Skill 07 — Evidence & Citation
→ Skill 08 — Publication Editing
→ Publication Candidate
```

A Publication Candidate is a complete report waiting for the 20:00 release shift. It is not an unfinished draft.

## Canonical path

```text
research/runtime/candidates/YYYY/MM/YYYY-MM-DD-candidates.json
```

## Batch contract

```json
{
  "schema": "runtime-publication-candidate/v1",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "status": "Waiting | Running | Completed | Blocked | Failed | Skipped",
  "sourceTask": "Research Runtime Production",
  "sourceRecord": "research/runtime/YYYY/MM/YYYY-MM-DD-runtime.md",
  "updatedAt": "ISO-8601 timestamp or empty",
  "githubCommit": "full SHA or pending",
  "reason": "Required for zero-output Completed or Skipped",
  "reason_zh": "Completed 且输出为 0，或 Skipped 时必须填写",
  "candidates": []
}
```

## Candidate entry

```json
{
  "column": "digital-employee",
  "itemId": "Q-...",
  "title": "English title",
  "title_zh": "中文标题",
  "zhPath": "staging/publication-candidates/...zh.md",
  "enPath": "staging/publication-candidates/...en.md",
  "coverPath": "staging/publication-candidates/...-cover.webp",
  "figurePath": "staging/publication-candidates/...-figure.svg",
  "coverGate": "PASS",
  "figureGate": "PASS",
  "lifecycle": "Publication Candidate",
  "evidenceStatus": "Completed",
  "editingStatus": "Completed"
}
```

`column` must be one of:

- `digital-employee`;
- `industry-architecture`;
- `open-source-engineering`.

## Cover / Figure role gate

`coverPath` is the dedicated editorial Article Cover and must pass Skill 06 Cover Gate, including thumbnail-scale recognition. `figurePath` is the separate explanatory Article Figure used for technical structure, workflow, lifecycle or evidence explanation. The same asset MUST NOT satisfy both roles. A workflow, lifecycle, architecture stack, state machine or other explanatory schematic cannot be promoted into `coverPath` merely because it already exists.

## Production completion gate

A candidate may be marked complete only when:

- the research object has passed Reading and Analysis;
- the full Chinese and English Markdown files exist;
- metadata and target column are valid;
- a dedicated editorial Article Cover exists and passes the Skill 06 Cover Gate;
- a separate explanatory Article Figure exists when the research benefits from technical visual explanation;
- `coverPath` and `figurePath` do not point to the same asset;
- every material claim has source evidence;
- citations have been checked;
- Publication Editing is complete;
- the candidate is not yet placed in the public article directory.

`Completed` means the Production shift executed successfully. It may contain one or more candidates, or zero candidates with an exact bilingual `No Eligible Research Object` outcome. `Skipped` is reserved for a shift that is explicitly not applicable and therefore not executed.

## 20:00 publication boundary

Research Runtime Publication consumes only this candidate batch. It may:

- move or write complete candidate files into the public bilingual article paths;
- update metadata, indexes and website references;
- commit to GitHub;
- verify the commit and published paths;
- mark the object Released.

It must not perform new research, substantive writing or evidence repair. A candidate that fails the release gate returns to Production or an earlier research stage.
