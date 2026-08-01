# Research Notes Metadata Contract

Research Notes is the only research entry point of the joinwell52 Research Center.

Every research note MUST declare:

```yaml
title: Article title
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
summary: Short list summary
```

## Column values

- `digital-employee`
- `industry-architecture`
- `open-source-engineering`

## Category values

- `daily`
- `weekly`
- `academic`

The VitePress metadata loader generates counts, classification, newest-first lists and calendar filtering directly from GitHub Markdown. Manual counts and manual chronological article indexes are prohibited.
