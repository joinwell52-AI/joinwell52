# Research Publication Metadata Contract V2

Research publications remain the only research entry point of the joinwell52 Research Center. V1 metadata remains valid for historical articles. V2 applies to new automated Production candidates from 2026-08-12.

Every V2 Research Center article declares:

```yaml
schema: publication-candidate-article/v2
title: Article title
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
article_type: research-brief | technical-analysis | engineering-insight | comparative-study | experiment-report | case-study | research-note | project-research | perspective | registered-extension
edition: research-center
research_question: The question investigated by this article
summary: Short list summary
sources:
  - Official or research source
```

## Independent dimensions

- `column` controls the Research Center subject surface.
- `category` controls Runtime and publication cadence.
- `article_type` controls editorial intent, not a fixed outline.
- `edition` distinguishes the complete Research Center article from an optional community adaptation.

`article_type` is extensible. New types are registered in `research/editorial/EDITORIAL-ARCHITECTURE.json` or declared by a candidate with a purpose and project-role definition.

## Candidate-batch editorial metadata

The V2 candidate batch is the machine-authoritative location for:

- selected dynamic modules and bilingual headings;
- evidence identities and claim strengths;
- first-party project relevance;
- Research Center / Community Edition decision;
- Research Value, Independence, Evidence, Structure, Language, and Bilingual Consistency gates.

The VitePress metadata loader continues to generate counts, classification, newest-first lists, and calendar filtering from GitHub Markdown. Manual counts and chronological article indexes remain prohibited.
