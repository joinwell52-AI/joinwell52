# Skill 08 — Publication Editing V2

## Purpose

Apply the final editorial, evidence, independence, bilingual, visual, and edition gates before a research article is released.

## Gate A — Research Value

- A specific research question is recorded.
- The article adds original information, analysis, synthesis, or judgment rather than only restating sources.
- The article remains useful to a reader who does not know the author or first-party projects.
- A publishing quota, trend, SEO phrase, or word count is not the reason for publication.

## Gate B — Independence

For non-`project-research`, remove TMPA, FCoP, and CodeFlowMu names mentally and confirm that the core argument still stands.

- `projectRelevance.status=none` requires no first-party project insertion.
- Any project that appears is declared as research object, case evidence, or a substantive relationship produced by the findings.
- Internal links and promotion are not valid relevance rationales.

## Gate C — Evidence

- Material facts are sourced.
- Source claims, observations, interpretations, internal evidence, independent evidence, hypotheses, and open questions are distinguishable.
- Internal evidence is not presented as independent.
- Publication, DOI, Zenodo, indexing, citation, and peer review are not presented as proof or automatic validation.
- Implementation success is not generalized beyond its evidence scope.

## Gate D — Structure

- The selected article type fits the research purpose.
- Every body module advances the answer; empty template sections are absent.
- Module order follows the argument rather than the previous article.
- `Engineering Impact`, `Implications for Current Work`, and `Conclusion` are not forced.
- Ending with Limitations, What Remains Unclear, or Open Questions is allowed.

## Gate E — Language

- Title and lead are accurate rather than inflated.
- Claim strength matches evidence identity.
- Terms are necessary and consistent.
- Chinese avoids unnecessary English mixing; necessary professional names remain consistent.

## Bilingual Consistency Gate

- Chinese and English preserve the same research question, evidence identities, claim strengths, uncertainty, and conclusion boundary.
- Dynamic modules correspond semantically, while headings and prose are naturally edited in each language.
- Neither language upgrades `suggests` to `proves`, internal evidence to independent evidence, or publication status to validation.

## Article Layout Gate

The rendered candidate reads as a finished publication: page-level editorial cover, title and lead, dynamically structured body, contextual Inline Figures where useful, and a complete citation surface.

`## Cover`, `## Figure`, `## Visualization`, `## 题图`, `## 文中图`, or `## 解释图` used merely as image containers is **NEEDS REVISION**.

## Visual gates

- A dedicated editorial Article Cover exists and remains meaningful near `320px` width.
- Inline Figures are optional (`0..N`), separate from the cover, contextually placed, captioned, source-labeled, terminology-consistent, and readable.
- No invented quantitative data is used.
- Desktop, compact desktop/tablet, and mobile rendering pass visual QA.

## Community Edition Gate

When generated, Community Edition has a named target community, different title, selected discussion angle, different structure, bounded evidence subset, concrete engineering or architectural significance, and an open discussion question. It is not identical to the Research Center article, a generic summary, or an advertisement.

## Publishing

- V2 editorial metadata and all six gates are machine-valid.
- Article paths and edition paths are correct.
- Website build, static layout validation, and editorial-contract validation succeed.
- Changes enter Git history without manual count or chronological-list edits.
- Historical and formally archived publications are not rewritten by this workflow.

## Release decision

```text
PASS
  all required gates satisfied

NEEDS REVISION
  useful content, but one or more gates fail; return to Production or the relevant earlier stage

REJECT
  weak value, insufficient evidence, fabricated material, unsupported conclusion, or promotional/template output
```

No Git commit means no official delivery. A commit proves the release state and provenance, not the correctness of every claim.
