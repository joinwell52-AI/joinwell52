# Skill 08 — Publication Editing V2.2

## Purpose

Apply the final editorial, evidence, independence, narrative, bilingual, visual, and edition gates before a research article is released.

## Gate 0 — Editorial Value

- An approved `article-brief/v1` exists for new V2.1 Production.
- The target audience is specific enough to guide editorial choices.
- A real reader problem and `whyNow` are stated.
- The article has one evidence-bounded core proposition.
- `originalValue` identifies analysis, synthesis, comparison, model, engineering judgment or case inference beyond source restatement.
- `editorialDecision=PASS` before formal drafting.
- Daily publication volume is never a reason for PASS.

## Gate A — Research Value

- A specific research question is recorded.
- The article adds original information, analysis, synthesis, or judgment rather than only restating sources.
- The article remains useful to a reader who does not know the author or first-party projects.
- A publishing quota, trend, SEO phrase, or word count is not the reason for publication.

## Gate B — Independence

For non-`project-research`, remove TMPA, FCoP, CodeFlowMu and other first-party names mentally and confirm both:

1. the core argument still stands;
2. the article remains worth reading for its named target audience.

Internal links and promotion are not valid relevance rationales.

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
- `selected_modules` from Analysis are recommendations, not a mandatory final outline.
- `Engineering Impact`, `Implications for Current Work`, and `Conclusion` are not forced.

## Gate E — Narrative

For V2.1 Production, an `argument-architecture/v1` must exist and the article must preserve its semantic reasoning progression.

Check:

### Core proposition

The article is organized around the single approved proposition rather than several unrelated themes.

### Progression

Each major passage adds at least one of: fact, evidence, inference, comparison, boundary, counterpoint, consequence, or reader progress.

### Opening

The opening establishes an evidence-bearing Hook → Problem → Core Proposition rather than generic trend language or a table-of-contents announcement.

### Redundancy

Remove repeated summaries, empty transitions, forced three-part structures and paragraphs that only paraphrase earlier material.

### Ending

The ending performs logical work: bounded judgment, limitation, implication, unresolved disagreement or open question. A generic future-looking conclusion is not required.

### External readability

A qualified reader can understand the argument without prior knowledge of Research Center internals or first-party projects.

## Gate F — Language

- Title and lead are accurate rather than inflated.
- Claim strength matches evidence identity.
- Terms are necessary and consistent.
- Chinese titles, summaries, headings and body prose are Chinese-first and must read naturally as Chinese technical writing.
- A necessary English product name, protocol name, acronym, API/class identifier or professional term must, at its first prose occurrence in the Chinese edition, be immediately followed by a full-width Chinese explanation: `English Term（中文解释）`.
- English terminology from a source is not exempt merely because the source used that wording. Translate the concept into Chinese unless preserving the official English identity is necessary.
- Repeated English abstraction chains in Chinese prose are a language failure. Defining terms once does not permit an English-heavy paragraph.
- Code blocks may preserve literal syntax; surrounding Chinese prose must explain what the identifier means before using it conceptually.
- AI-like completeness is not a virtue: semantic repetition and empty prose are revised even when grammatically fluent.

From 2026-08-27 onward, the repository's Chinese technical-prose validator is part of the mandatory Editorial gate. A candidate that fails it is `NEEDS REVISION`; the worker may not self-declare `language=PASS` over a validator failure.

## Bilingual Consistency Gate

Chinese and English preserve the same research question, core proposition, argument progression, evidence identities, claim strengths, uncertainty, figure order and conclusion boundary. Headings and prose are independently edited for their language. Bilingual consistency means semantic parity, not English terminology copied into Chinese sentences.

## Visual Argument Gate

For V2.1 Production, an `article-figure-plan/v1` must exist.

- Each Inline Figure binds to an existing argument node.
- Each figure materially improves understanding of that node.
- Zero Inline Figures remains valid where prose or tables already explain the argument sufficiently.
- Deterministic diagrams are preferred for exact relationships; generated imagery is not a substitute for technical precision.
- No invented quantitative data is used.
- Cover and Inline Figure roles remain separate.

## Article Layout Gate

The rendered candidate reads as a finished publication: page-level editorial cover, title and lead, dynamically structured body, contextual Inline Figures where useful, and a complete citation surface.

Fixed image-container headings such as `## Cover`, `## Figure`, `## Visualization`, `## 题图`, `## 文中图`, or `## 解释图` are NEEDS REVISION.

## Community Edition Gate

When generated, Community Edition has a named target community, different title, selected discussion angle, different structure, bounded evidence subset, concrete engineering or architectural significance, and an open discussion question. It is not an identical copy, generic summary, or advertisement.

## Publishing

- Candidate metadata and all applicable gates are machine-valid.
- Article paths and edition paths are correct.
- Website build, static layout validation, and editorial-contract validation succeed.
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

No Git commit means no official delivery. A commit proves release state and provenance, not the correctness of every claim.
