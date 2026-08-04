# Research Intelligence Run Contract V1.0

## Canonical path

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

## Schema

```text
research-intelligence-run/v1
```

## Required top-level fields

```json
{
  "schema": "research-intelligence-run/v1",
  "version": "1.0",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "status": "Waiting | Running | Completed | Blocked | Failed | Skipped",
  "registryVersion": "1.0",
  "sourceTask": "Research Runtime Queue",
  "updatedAt": "ISO-8601 or empty while waiting",
  "githubCommit": "full SHA or pending",
  "reason": "English summary",
  "reason_zh": "中文摘要",
  "pipelines": [],
  "columns": [],
  "signals": []
}
```

## Pipeline result

Every run contains exactly three ordered pipeline entries:

1. `ai-platform`
2. `github-engineering`
3. `published-research`

Each entry records:

- sources due;
- sources checked;
- inaccessible sources and reasons;
- failed sources and reasons;
- signals, candidates, selected and rejected counts;
- coverage percentage;
- bilingual reason.

`Completed` means every due source is resolved as checked, inaccessible or failed with a recorded reason. It does not mean that a candidate was found.

## Column decision

Every run contains exactly three ordered column decisions:

1. `digital-employee`
2. `industry-architecture`
3. `open-source-engineering`

Decision values:

```text
Waiting
Selected
No Selection
```

`No Selection` is valid only with a bilingual reason and completed source coverage.

## Signal object

```json
{
  "id": "SIG-YYYYMMDD-NNN",
  "pipeline": "ai-platform | github-engineering | published-research",
  "title": "Canonical signal title",
  "title_zh": "中文标题",
  "sourceUrl": "https://...",
  "publishedAt": "YYYY-MM-DD or unknown",
  "evidenceLevel": "registry evidence level",
  "primaryColumn": "one of three columns",
  "secondaryColumns": [],
  "triageStatus": "signal | candidate | selected | rejected",
  "changeObject": "deduplication key",
  "summary": "Observed change",
  "summary_zh": "观察到的变化"
}
```

## Completion gate

A completed Queue plan on or after the Registry effective date requires a completed Intelligence run for the same date.

The selected item ID for each column must match between:

```text
Research Intelligence Run
and
Runtime three-column Daily Research Plan
```

This prevents the website from displaying a column selection that cannot be traced back to a recorded source scan.
