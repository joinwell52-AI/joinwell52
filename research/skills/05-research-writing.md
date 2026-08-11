# Skill 05 — Research Writing

## Purpose

Write a Research Note as a concise research report rather than a news summary or promotional article.

## Required metadata

```yaml
title:
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary:
sources:
```

## Required article structure

```text
Title / Article Cover
Lead
Central Judgment
Source
Observation
Comparison
Discussion
Engineering Impact
Boundaries / Uncertainty
Future Work
References
```

The Article Cover is a page-level publication element rendered before the article body. It is not a Markdown section. Do not generate fixed image-container sections named:

```text
## Cover
## Figure
## Visualization
## 题图
## 文中图
## 解释图
```

## Inline-figure placement

Inline Figures are part of the article body. Insert each figure at the point where the surrounding argument needs visual explanation. A figure must follow the relevant paragraph or subsection and must be followed by a caption that states what the figure explains and identifies its source basis.

```md
## Observation

Work arrival establishes demand, but only an explicit Worker Claim grants execution authority.

![Execution authority boundary](...)

*Figure 1. Received or Scheduled work becomes executable only after an explicit Worker Claim. Source: Research Center synthesis based on the cited primary sources.*

The runtime can then introduce concurrency through separate execution identities.
```

Do not collect Inline Figures beneath a generic image heading or place every figure mechanically after the title.

## Writing rules

- Lead with the research question or central judgment.
- Use short, explicit section headings.
- Keep facts, vendor claims and Research Center analysis separate.
- Explain mechanisms and boundaries, not only product features.
- Include at least one meaningful comparison when multiple systems are discussed; this may be prose, a table or a contextually placed figure.
- Avoid inflated language, generic conclusions and repeated summaries.
- State uncertainty and missing evidence directly.
- Preserve the distinction between specified, implemented, demonstrated and independently validated.

## Bilingual rule

Chinese and English are independently edited documents. They must preserve the same facts, metadata, structure, Inline Figure placement, figure numbering, tables, references and research judgment without mechanical sentence-by-sentence translation.
