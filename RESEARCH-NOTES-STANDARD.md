# Research Publication Standard V2.0

Effective for new automated production from 2026-08-12. V1.x articles and formal archives remain historical evidence and are not rewritten by this standard.

Every research publication must be produced from selected source material, not from a topic prompt alone.

## Required workflow

```text
Research topic or event
→ Research question
→ Source and evidence collection
→ Fact / claim / observation / inference separation
→ Findings
→ Article-type identification
→ Dynamic module selection
→ Complete Research Center Edition
→ Research Independence Gate
→ Evidence Gate
→ Bilingual consistency check
→ Research Center release
→ Optional Community Edition decision
```

Article structure serves the research question. Automation must not turn this workflow into high-volume template filling.

## Research publication categories

`category` describes the Runtime and publication cadence. It does not prescribe a table of contents.

### Daily Research (`category: daily`)

Daily Research investigates one selected signal or a tightly bounded group of related signals. It identifies what changed, separates evidence from interpretation, and forms a bounded judgment. It may contain no reference to TMPA, FCoP, CodeFlowMu, or any other first-party project.

### Weekly Research (`category: weekly`)

Weekly Research is an independently readable AI Research Brief based on the previous seven days of validated Daily Research plus additional source review when needed. It must not copy or concatenate Daily articles.

It prioritizes material changes, connections among changes, evidence and disputes, supportable judgments, and unresolved questions. `Implications for Current Work` is optional and appears only when the findings create a substantive relationship.

### Academic Observation (`category: academic`)

Academic Observation studies papers, technical reports, benchmarks, standards, institutional research, or formal research publications. It distinguishes source claims from Research Center interpretation and evaluates method, evidence, limitations, reproducibility, and relevance.

Publication, DOI assignment, indexing, citation, or peer review status is recorded as status evidence. None of those facts automatically validates the research claim.

## Extensible article types

Before writing, Production chooses an article type from the registry in [`research/editorial/EDITORIAL-ARCHITECTURE.json`](./research/editorial/EDITORIAL-ARCHITECTURE.json), or declares a new type with its purpose and project role.

The initial registry includes Research Brief, Technical Analysis, Engineering Insight, Comparative Study, Experiment Report, Case Study, Research Note, Project Research, and Perspective. This list is extensible. Article type and publication category are independent dimensions.

## Required metadata

New V2 candidates record publication metadata and editorial metadata:

```yaml
schema: publication-candidate-article/v2
title: Article title
date: 'YYYY-MM-DD'
column: digital-employee | industry-architecture | open-source-engineering
category: daily | weekly | academic
article_type: research-brief | technical-analysis | engineering-insight | ...
edition: research-center
research_question: The question this article investigates
summary: One-sentence list summary
sources:
  - Official or research source
```

The candidate batch additionally records dynamic sections, evidence claims, project relevance, edition decision, and all pre-publication gates.

## Dynamic content modules

There is no required universal body outline. Production selects only modules that contribute to the answer, for example:

- Research Question;
- Context;
- What Changed;
- Evidence;
- Key Findings;
- Technical Analysis;
- Architecture, Engineering, Operational, Governance, or Research Implications;
- Comparison;
- Experiment;
- Limitations;
- Counterarguments;
- What Remains Unclear;
- Open Questions;
- Implications for Current Work;
- Conclusion.

Module order is determined by the argument. Headings may be naturally rewritten. Empty sections are prohibited. An article may end with Limitations, What Remains Unclear, or Open Questions rather than a traditional conclusion.

Source traceability remains mandatory, but it may be implemented through a References section, footnotes, or another complete and readable citation surface; it is not a reason to force the rest of the outline.

## Research independence

External research must reach its conclusion from the research object and public evidence. First-party projects are not mandatory destinations or promotional links.

For a non-Project Research article, ask:

> If TMPA, FCoP, and CodeFlowMu names are removed, does the core argument still stand?

If not, reclassify a genuine Project Research article or rewrite the self-mapping. When a project appears, declare whether it is the research object, bounded case/evidence, or a substantive relationship produced by the findings.

## Engineering implications

Engineering implications apply by default to the relevant class of agent systems, AI coding systems, multi-agent systems, runtimes, orchestration, governance, reliability, observability, recovery, verification, operations, or developer practice.

They do not default to CodeFlowMu. `Implications for Current Work` is a separate optional module.

## Evidence identity and claim strength

Material claims use one of these identities:

- public fact;
- source-reported claim;
- our observation;
- our interpretation;
- internal experimental evidence;
- independent evidence;
- hypothesis;
- open question.

Claim strength must match the evidence. Internal implementation success may support bounded feasibility; it is not independent validation or general validity. See [`research/editorial/EDITORIAL-AND-EVIDENCE-POLICY.md`](./research/editorial/EDITORIAL-AND-EVIDENCE-POLICY.md).

## Visual requirements

A formal article retains one editorial Article Cover. Inline Figures are optional (`0..N`) and are created only when they materially improve explanation.

- Each visual identifies its evidence basis.
- Numeric charts require reliable quantitative data.
- Decorative metrics and fabricated scores are prohibited.
- A visual requirement must never force a content module or a fixed image-container heading.

## Research Center and Community Editions

The Research Center Edition preserves the complete research, sources, evidence, analysis, limitations, and uncertainty.

Community Edition is optional. It selects one question relevant to a named professional community and receives a distinct title, angle, structure, and discussion question. It is not a copied article, generic summary, or advertisement. First-party projects appear as cases or evidence only when relevant.

## Pre-publication gates

Every new V2 candidate must pass Research Value, Independence, Evidence, Structure, Language, and Bilingual Consistency.

Insufficient evidence may produce no publication or a bounded Research Note. No daily quota, SEO target, or minimum word count overrides these gates.

## Publication rule

A research article is official only after its Markdown, metadata, Runtime evidence, and release record are committed to GitHub. GitHub history proves the publication state and provenance of that version; it does not validate the article's research claims.
