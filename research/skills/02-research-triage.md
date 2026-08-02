# Skill 02 — Research Triage

## Purpose

Decide which discovered materials deserve deep research and publication.

## Scoring dimensions

Score each dimension from 0 to 5:

| Dimension | Question |
|---|---|
| Column relevance | Is it directly related to Digital Employee, Industry Architecture or Open-source Engineering? |
| Direction relevance | Is it from the same industry, product category, research direction or engineering problem? |
| TMPA relevance | Does it affect AI work data, governance, protocol or evidence? |
| Digital Employee relevance | Does it affect Position, responsibility, workflow, runtime, control plane or evaluation? |
| CodeFlowMu relevance | Does it affect runtime, recovery, skill, tool, workflow, observability or product direction? |
| Engineering value | Does it reveal an implementable mechanism? |
| Novel information | Does it add something not already covered? |
| Source quality | Is it supported by a primary or authoritative source? |

## Decision

- `selected`: high relevance, credible evidence and a clear research question;
- `candidate`: useful but requires more evidence or a better comparison;
- `rejected`: promotional, repetitive, weakly related or unverifiable.

## Output

```yaml
triage:
  candidate:
  scores:
  total:
  decision:
  selection_reason:
  rejected_reason:
  proposed_column:
  proposed_category:
```

## Rule

A daily publishing target must never force a weak candidate into publication.
