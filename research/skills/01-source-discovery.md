# Skill 01 — Source Discovery

## Purpose

Find credible material from the same industry, research direction, product category or engineering problem before any article is written.

## Search scope

- Academic papers and conference material;
- official product documentation and architecture pages;
- official blogs, release notes and technical reports;
- GitHub repositories, changelogs, issues and implementation documents;
- standards, regulatory documents and evaluation reports.

## Priority

1. Primary official source;
2. peer-reviewed or preprint paper;
3. official repository or documentation;
4. reputable independent analysis;
5. community discussion as supplementary context only.

## Output

Produce a candidate pool containing:

```yaml
candidate:
  title:
  organization_or_project:
  source_type:
  source_url:
  published_or_updated:
  observed_change:
  possible_relevance:
  confidence:
```

## Rules

- Do not write the Research Note during discovery.
- Do not select a source only because it is new or popular.
- Prefer comparable products, similar research and directly related engineering systems.
- Record the original URL and publication date.
- Separate primary evidence from commentary.
