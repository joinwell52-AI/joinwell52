# Research Note Standard V1.1

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

## Research Note categories

The three categories describe different research functions. They are not interchangeable labels.

### Daily Research (`category: daily`)

Daily Research records one selected signal or a tightly bounded group of related signals.

Its purpose is to:

- identify what changed or what deserves attention;
- preserve source material while it is current;
- separate observed facts from first-stage interpretation;
- state an initial impact on TMPA, Digital Employee, or CodeFlowMu;
- create inputs for later weekly synthesis.

A Daily note should be focused and timely. It is not required to settle the architecture question.

### Weekly Synthesis (`category: weekly`)

Weekly Synthesis is a deeper research report built from the week’s Daily notes plus additional source review where needed.

It must not copy or concatenate Daily notes. It should:

- compare multiple signals, products, repositories, or mechanisms;
- identify common patterns and meaningful differences;
- test whether earlier observations still hold;
- produce a new architecture or engineering judgment;
- explain the accumulated impact on TMPA, Digital Employee, and CodeFlowMu;
- define the next research questions.

A Weekly report is therefore a synthesis and interpretation layer above Daily Research.

### Academic Observation (`category: academic`)

Academic Observation reviews research produced by others, including papers, technical reports, benchmarks, standards, institutional studies, and formal research publications.

It should:

- explain the research question, method, evidence, and conclusion of the source;
- distinguish the authors’ claims from the Research Center’s judgment;
- assess limitations, reproducibility, and relevance;
- compare the work with related studies where useful;
- identify impact on the Research Center’s own architecture and engineering work.

Academic Observation is not defined by publication frequency. Its defining property is that the primary object of study is another organization’s or researcher’s formal research output.

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

Weekly Synthesis may use `Weekly Highlights`, `Cross Analysis`, `New Architecture Judgment`, and `Next Week Research` as more specific section names while preserving the same logical structure.

## Visual and evidence requirements

A substantial Research Note should include:

- one article cover;
- at least one meaningful architecture diagram, process diagram, comparison table, evidence table, or data visualization;
- a source label for each visual, such as an official source or “joinwell52 Research Center synthesis”;
- numeric charts only when reliable quantitative data is available.

Visual decoration must not replace evidence. Invented scores, fabricated metrics, and decorative quantitative charts are prohibited.

## Source rules

- Prefer official product pages, documentation, release notes, research papers, and source repositories.
- Distinguish vendor claims from independently demonstrated evidence.
- Do not write a report merely because a source is recent; it must be relevant to the Research Center's direction.
- Every non-trivial factual claim must be traceable to a listed source.
- References must be sufficient for a reader to verify the observation independently.

## Publication rule

A Research Note is official only after its Markdown and metadata are committed to GitHub. Website counts, classification, sorting, and calendar views are generated from metadata and must never be manually edited.
