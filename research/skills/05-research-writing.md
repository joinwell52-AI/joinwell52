# Skill 05 — Research Writing V2

## Purpose

Write an independently valuable research publication whose structure follows its research question, evidence, findings, and article type.

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

## Dynamic structure

There is no universal body outline. Select and order only useful modules from the editorial registry. Natural, article-specific headings are preferred over registry labels.

Do not generate a section merely because earlier articles contained it. `Engineering Impact`, `Implications for Current Work`, and `Conclusion` are optional. A Research Note may end with an unresolved question; a Technical Analysis may end with limitations; a Comparative Study may end with the remaining disagreement.

The Article Cover remains a page-level publication element before the body. It is not a Markdown section. Do not generate fixed image-container sections named:

```text
## Cover
## Figure
## Visualization
## 题图
## 文中图
## 解释图
```

## Inline-figure placement

Inline Figures are optional and belong at the point where the argument needs visual explanation. Each one has an adjacent bilingual caption and evidence source. Do not manufacture figures or collect them under a generic heading.

## Research independence

- Write the external research argument so it stands without prior knowledge of the Research Center or its projects.
- Do not add TMPA, FCoP, CodeFlowMu, or another project for internal linking, promotion, or a habitual final paragraph.
- If current work is substantively related, use a separate optional module and state the exact relationship and evidence role.
- A Community Edition never promotes a first-party project into the main subject unless that project is the community-relevant evidence or case.

## Evidence-calibrated language

- Attribute source-reported claims to the source.
- Mark Research Center observations and interpretations as such.
- Describe first-party experiments as internal evidence.
- Use `independent` only for a genuinely independent actor, reproduction, experiment, critique, or adoption.
- Do not infer validation from publication, DOI, Zenodo, indexing, citation, peer review, or successful implementation.
- Prefer `suggests`, `provides evidence for`, `is consistent with`, `was observed in this implementation`, and `remains to be independently validated` when those are the accurate strengths.

## Writing rules

- Lead with the question, material change, or supportable judgment appropriate to the type.
- Add original analysis or substantial synthesis beyond restating sources.
- Use accurate, non-exaggerated titles.
- Explain mechanisms, disputes, and boundaries rather than listing features.
- State uncertainty and missing evidence directly.
- Apply engineering implications to the relevant system class by default.
- Do not write to an SEO word count or publication quota.
- When evidence is insufficient, produce no article or downgrade explicitly to `research-note`.

## Bilingual rule

Chinese and English are independently edited documents with shared claim identity, strength, uncertainty, and conclusion boundaries. They preserve the same dynamic module sequence and evidence set, but headings and prose may be naturally written for each language. Mechanical sentence-by-sentence translation and English-heavy Chinese prose are both discouraged.

## Community Edition rule

Generate a Community Edition only after the complete Research Center Edition exists and only when a named community has a useful discussion angle. Record a different title, angle, section structure, evidence subset, engineering significance, and discussion question. Do not copy the complete article or produce an advertisement.
