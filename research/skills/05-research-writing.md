# Skill 05 — Research Writing V2.1

## Purpose

Write an independently valuable research publication whose prose follows an approved editorial plan and argument architecture rather than directly expanding a Research Object.

## Required Production inputs

For new Production governed by Editorial Architecture 2.1, Writing consumes all four inputs:

1. completed same-date Research Object;
2. approved `article-brief/v1`;
3. `argument-architecture/v1`;
4. `article-figure-plan/v1`.

The Research Object controls what may be claimed. The Article Brief controls audience, reader problem, editorial value and the single core proposition. Argument Architecture controls reasoning progression. Figure Plan controls which reasoning nodes require visual explanation.

Do not draft a formal article directly from a Research Object when the V2.1 planning artifacts are required.

## Required metadata

```yaml
schema: publication-candidate-article/v2
title:
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
article_type:
edition: research-center
research_question:
summary:
sources:
```

## Argument-driven structure

There is no universal body outline. `selected_modules` from Research Analysis are research-side editorial recommendations, not a final table of contents.

Use the approved `argumentNodes[]` to move the reader toward the core proposition. A node may become a section, part of a section, or a transition between sections. Final headings should be natural and article-specific; do not expose internal IDs such as `A1` or registry module labels merely because they exist.

Every major passage must add at least one of: new fact, evidence, inference, comparison, boundary, counterpoint, consequence, or measurable reader progress. Remove or rewrite passages that only restate earlier prose.

## Opening

The opening portion should establish `Hook → Problem → Core Proposition` using an evidence-bounded event, anomaly, contradiction, failure, question or judgment appropriate to the Article Brief.

Do not default to empty trend language such as "In today's rapidly evolving AI landscape", "随着人工智能的快速发展", or a generic "This article will discuss" opening. These phrases are not banned as strings; they fail when they substitute for an actual reader problem or evidence-bearing opening move.

## Ending

The ending must perform logical work. It may finish with a bounded judgment, limitation, implication, unresolved disagreement or open question. A generic future-looking conclusion is not required.

## Dynamic modules

Natural, article-specific headings are preferred over registry labels. `Engineering Impact`, `Implications for Current Work`, and `Conclusion` remain optional. A Research Note may end with an unresolved question; a Technical Analysis may end with limitations; a Comparative Study may end with remaining disagreement.

The Article Cover remains a page-level publication element before the body. It is not a Markdown section. Do not generate fixed image-container sections named `Cover`, `Figure`, `Visualization`, `题图`, `文中图`, `解释图` or `可视化`.

## Inline-figure placement

Inline Figures are optional and must originate from the approved Figure Plan. Insert each one where its bound `argumentNodeId` is being explained. Each figure has an adjacent bilingual caption and evidence source. Do not manufacture figures or collect them under a generic heading.

## Research independence

- Write the external research argument so it stands without prior knowledge of the Research Center or its projects.
- Do not add TMPA, FCoP, CodeFlowMu, or another project for internal linking, promotion, or a habitual final paragraph.
- If current work is substantively related, use a separate optional module and state the exact relationship and evidence role.
- A Community Edition never promotes a first-party project into the main subject unless that project is the community-relevant evidence or case.
- Run the reader-value deletion test: after removing first-party project names, the article must remain worth reading for its intended professional audience, not merely remain grammatically coherent.

## Evidence-calibrated language

- Attribute source-reported claims to the source.
- Mark Research Center observations and interpretations as such.
- Describe first-party experiments as internal evidence.
- Use `independent` only for a genuinely independent actor, reproduction, experiment, critique, or adoption.
- Do not infer validation from publication, DOI, Zenodo, indexing, citation, peer review, or successful implementation.
- Prefer `suggests`, `provides evidence for`, `is consistent with`, `was observed in this implementation`, and `remains to be independently validated` when those are the accurate strengths.

## Anti-template editing

Reject machine-like completeness for its own sake. Remove repeated summaries, empty transitions, forced three-part lists, mirrored section shapes, unsupported trend claims and conclusions that merely repeat the introduction.

The test is semantic: does the sentence or paragraph add information, reasoning, a boundary or reader progress? If not, revise or remove it.

## Writing rules

- Lead with the approved opening move, material change, or supportable judgment appropriate to the type.
- Preserve the single approved core proposition.
- Add original analysis or substantial synthesis beyond restating sources.
- Use accurate, non-exaggerated titles.
- Explain mechanisms, disputes, and boundaries rather than listing features.
- State uncertainty and missing evidence directly.
- Apply engineering implications to the relevant system class by default.
- Do not write to an SEO word count or publication quota.
- When evidence is insufficient, produce no article or downgrade explicitly to `research-note` through the Article Brief gate.

## Bilingual rule

Chinese and English are independently edited documents with shared core proposition, argument progression, claim identity, strength, uncertainty, figure order and conclusion boundaries. They preserve the same semantic reasoning sequence and evidence set, but headings and prose may be naturally written for each language. Mechanical sentence-by-sentence translation and unnecessary English-heavy Chinese prose are both discouraged.

## Community Edition rule

Generate a Community Edition only after the complete Research Center Edition exists and only when a named community has a useful discussion angle. Record a different title, angle, section structure, evidence subset, engineering significance, and discussion question. Do not copy the complete article or produce an advertisement.
