# Skill 02 — Three-Column Research Triage

## Purpose

Convert the unified signal pool into three explicit daily research decisions:

- Digital Employee
- Industry Architecture
- Open-source Engineering

## Input gate

Triage may begin only after the daily Research Intelligence run records the coverage of:

1. AI Platform Change Intelligence;
2. GitHub Engineering Intelligence;
3. Published Research Intelligence.

If a due pipeline was not checked, the Queue result is incomplete unless it records a blocker.

## Scoring dimensions

Score each dimension from 0 to 5:

| Dimension | Question |
|---|---|
| Column relevance | Is it directly related to the proposed primary column? |
| Direction relevance | Is it from the same product category, research direction or engineering problem? |
| TMPA relevance | Does it affect AI work data, governance, protocol, evidence or reconstructability? |
| Digital Employee relevance | Does it affect Position, responsibility, workflow, runtime, authority, recovery or evaluation? |
| CodeFlowMu relevance | Does it affect runtime, recovery, skill, tool, workflow, observability or product direction? |
| Engineering value | Does it reveal an implementable or testable mechanism? |
| Novel information | Does it add something not already covered? |
| Source quality | Is it supported by primary, authoritative or reproducible evidence? |
| Cross-source support | Is the signal corroborated across platform, GitHub or research evidence? |
| Bounded question | Can it be turned into a specific research question rather than a broad topic? |

## Deduplication

Signals describing the same underlying change are merged into one object:

```yaml
change_object:
  platform_evidence:
  github_evidence:
  research_evidence:
```

A Release, PR, forum thread and paper about the same mechanism are not four separate candidates.

## Decision

- `selected`: high relevance, credible evidence and a bounded research question;
- `candidate`: useful but requires more evidence or comparison;
- `rejected`: promotional, repetitive, weakly related or unverifiable;
- `no_selection`: the column was scanned but no object met the threshold.

## Column rule

Every selected object has exactly one `primary_column`.

```yaml
primary_column: digital-employee
secondary_columns:
  - industry-architecture
  - open-source-engineering
```

Secondary impact must be preserved for Weekly Synthesis, but a Daily Research Note is published under only one primary column.

## Daily output

```yaml
triage:
  candidate:
  pipeline_origin:
  evidence_levels:
  scores:
  total:
  decision:
  selection_reason:
  rejected_reason:
  primary_column:
  secondary_columns:
  proposed_category:
  next_skill:
```

The Queue must submit exactly three column decisions. A column with no selection must include:

- sources due;
- sources checked;
- signal count;
- candidate count;
- exact no-selection reason.

## Rule

A daily publishing target must never force a weak candidate into selection.
