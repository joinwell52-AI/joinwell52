# Research Note Standard V1.0

Every Research Note must be produced from selected source material, not from a topic prompt alone.

## Required workflow

```text
Source Collection
→ Relevance Review
→ Selection
→ Deep Reading
→ Observation
→ Discussion
→ Research Note
```

Candidate material should primarily come from organizations, products, open-source projects, and research working in the same industry or technical direction as the Research Center.

## Required metadata

```yaml
title: Article title
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary: One-sentence list summary
sources:
  - Official source name
```

## Required article structure

1. **Summary** — the research judgment in brief.
2. **Source** — what was reviewed, why it was selected, and whether it is an official, academic, repository, or secondary source.
3. **Observation** — what the source actually shows. Keep observation separate from interpretation.
4. **Discussion** — the Research Center's analysis, comparison, and judgment.
5. **Engineering Impact** — implications for TMPA, Digital Employee, and CodeFlowMu. A note may state “no direct impact” where appropriate.
6. **Future Work** — unresolved questions and next research actions.
7. **References** — direct, readable references to the reviewed material.

## Source rules

- Prefer official product pages, documentation, release notes, research papers, and source repositories.
- Distinguish vendor claims from independently demonstrated evidence.
- Do not write a report merely because a source is recent; it must be relevant to the Research Center's direction.
- Every non-trivial factual claim must be traceable to a listed source.
- References must be sufficient for a reader to verify the observation independently.

## Publication rule

A Research Note is official only after its Markdown and metadata are committed to GitHub. Website counts, classification, sorting, and calendar views are generated from metadata and must never be manually edited.
