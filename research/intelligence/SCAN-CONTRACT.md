# Research Intelligence Run Contract V1.2

## Purpose

Define the durable daily Intelligence record used by Research Runtime while enforcing a **problem-first Digital Employee research boundary**.

The Runtime JSON schema and pipeline identifiers remain V1-compatible. The semantic meaning is strengthened:

- signals are evidence or research leads;
- Release/update events do not automatically become research candidates;
- Queue owns Research Object admission;
- Agent Governance is the highest-priority research direction;
- Discovery must actively scan long-term samples and rolling research windows, not only same-day changes.

## Canonical path

```text
research/intelligence/runs/YYYY/MM/YYYY-MM-DD-intelligence.json
```

## Schema

```text
research-intelligence-run/v1
```

The schema name remains unchanged for compatibility with existing Runtime records and validators.

## Required top-level fields

The existing V1 fields remain required. For runs on or after `2026-08-30`, `researchCoverage` is also required.

```json
{
  "schema": "research-intelligence-run/v1",
  "version": "1.0",
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Shanghai",
  "status": "Waiting | Running | Completed | Blocked | Failed | Skipped",
  "registryVersion": "1.0",
  "sourceTask": "Research Runtime Discovery",
  "updatedAt": "ISO-8601 or empty while waiting",
  "githubCommit": "full SHA or pending",
  "reason": "English summary",
  "reason_zh": "中文摘要",
  "pipelines": [],
  "columns": [],
  "signals": [],
  "researchCoverage": {}
}
```

## Pipeline results

Every run retains exactly three ordered entries for compatibility:

1. `ai-platform` — product / competitor sample evidence;
2. `github-engineering` — multi-agent engineering / mechanism evidence;
3. `published-research` — research / benchmark / industry-application evidence.

Each entry records:

- sources due;
- sources checked;
- inaccessible sources and reasons;
- failed sources and reasons;
- signals, candidates, selected and rejected counts;
- coverage percentage;
- bilingual reason.

`Completed` means every due Registry source is resolved as checked, inaccessible or failed with a recorded reason. It does not mean that a Research Object was found.

## Active research coverage

Formal Registry coverage is necessary but no longer sufficient for Discovery completion.

For runs on or after `2026-08-30`, Discovery must also persist:

```yaml
researchCoverage:
  policy: theme-sample-v1
  rollingResearchWindowDays: 30
  sampleFamilies:
    product-governance:
      checked: []
      qualifiedSignals: 0
    multi-agent-mechanism:
      checked: []
      qualifiedSignals: 0
    research-benchmark-industry:
      checked: []
      qualifiedSignals: 0
```

Requirements:

- each `checked` list contains at least two distinct approved samples or research/application families actually inspected during the run;
- sample choices should rotate against recent run history rather than repeatedly selecting only the fastest-moving repositories;
- `rollingResearchWindowDays` must be at least `30`;
- a family with no qualified signal still records the checked samples and `qualifiedSignals: 0`;
- the `published-research` pipeline may legitimately produce zero retained signals, but only after the rolling research pass has been completed and recorded.

A statement such as “no paper was published on the run date” is never sufficient to close the research pipeline.

## Column decisions

Every run retains the three ordered publication columns:

1. `digital-employee`
2. `industry-architecture`
3. `open-source-engineering`

Decision values remain:

```text
Waiting
Selected
No Selection
```

Columns are publication/navigation surfaces. They do not define the research ontology and do not give a signal admission priority.

## Signal object

The existing required signal fields remain valid:

```json
{
  "id": "SIG-YYYYMMDD-NNN",
  "pipeline": "ai-platform | github-engineering | published-research",
  "title": "Canonical evidence title",
  "title_zh": "中文标题",
  "sourceUrl": "https://...",
  "publishedAt": "YYYY-MM-DD or unknown",
  "evidenceLevel": "registry evidence level",
  "primaryColumn": "one of three columns",
  "secondaryColumns": [],
  "triageStatus": "signal | candidate | selected | rejected",
  "changeObject": "deduplication key",
  "summary": "Observed evidence",
  "summary_zh": "观察到的证据"
}
```

For runs on or after `2026-08-30`, every retained signal must also contain:

```yaml
signalRole: sample-change-trigger | failure-evidence | research-finding | mechanism-evidence | benchmark-evidence | industry-application-evidence | incident-or-regression-evidence | comparative-evidence
researchThemes: []
sampleIds: []
researchValue:
  failure:
  finding:
  mechanism:
  implication:
```

`researchThemes` and `sampleIds` must be non-empty.

For any role other than `sample-change-trigger`, at least one `researchValue` field must contain a substantive value.

## Trigger-density guard

A Release, commit, changelog, tag, roadmap item or announcement may still be retained as a `sample-change-trigger` when it is useful evidence.

But from the policy effective date onward:

> **Pure `sample-change-trigger` signals may not exceed 50% of the retained Signal Pool.**

If qualified non-trigger evidence is scarce, Discovery must retain fewer total signals rather than filling the Signal Pool with Releases and commits.

This rule prevents fast-moving coding-platform repositories from crowding out competitor architecture, failures, papers, benchmarks and industry applications.

## Release / update boundary

The following evidence may be recorded during Discovery:

- release;
- changelog;
- tag;
- merged Pull Request;
- commit;
- roadmap item;
- announcement;
- model or product launch.

But novelty alone is not research value.

An ordinary platform/repository update should normally be recorded as:

```yaml
signalRole: sample-change-trigger
triageStatus: signal
```

It cannot become a selected Research Object unless Skill 02 identifies a bounded research problem, valid research theme, substantive Failure/Finding/Mechanism/Implication and sufficient evidence.

## Problem-level deduplication

Do not deduplicate only by product change. Merge evidence that addresses the same underlying research problem.

Example:

```text
Codex implementation
+ CrewAI delegation behavior
+ A2A task model
+ benchmark / paper
→ one delegation-authority candidate
```

This is preferred over four vendor-centered candidates.

## Source concentration boundary

The Intelligence record may contain many signals from one fast-moving repository. This does not grant that repository multiple Daily selections.

Queue applies the portfolio rule:

- default maximum one selected Research Object per primary sample/vendor/repository per day;
- a second requires exceptional explicit justification;
- three selections driven by one primary vendor/repository are prohibited.

## Research freshness

Different evidence classes use different windows:

- platform/repository change triggers are incremental;
- current product/competitor architecture may be studied without same-day change;
- papers, benchmarks and standards use a rolling 7–30 day window;
- older prior art and failures remain usable when directly relevant to an active research question.

The Research Center must not structurally favor sources that publish software changes every day over sources that publish research or benchmarks less frequently.

## Completion gate

A completed Queue plan on or after the Registry effective date requires a completed Intelligence run for the same date.

For runs on or after `2026-08-30`, a Completed Discovery result additionally requires valid `researchCoverage`, enriched signal metadata, and compliance with the trigger-density guard.

The selected item ID for each column must match between:

```text
Research Intelligence Run
and
Runtime three-column Daily Research Plan
```

This traceability proves where the evidence came from. It does **not** mean the triggering source is the Research Object.

## Hard rule

**Research the problem, not the release. Releases and commits are evidence triggers only.**
