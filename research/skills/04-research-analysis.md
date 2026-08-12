# Skill 04 — Research Analysis V2

## Purpose

Transform verified reading evidence into a question-driven Research Object without presupposing an article outline or a first-party project conclusion.

## Required reasoning

1. State the research question.
2. Separate public facts, source-reported claims, our observations, and our interpretations.
3. Identify what the evidence supports, contradicts, and leaves unknown.
4. Form a bounded research judgment.
5. Identify the most suitable article type and only the content modules the judgment needs.
6. Evaluate general implications for the affected systems and practices.
7. Test first-party project relevance after the judgment exists.

## Evidence identities

Use the identities in `research/editorial/EDITORIAL-ARCHITECTURE.json`:

- `public-fact`;
- `source-reported-claim`;
- `our-observation`;
- `our-interpretation`;
- `internal-experimental-evidence`;
- `independent-evidence`;
- `hypothesis`;
- `open-question`.

Publication, citation, DOI, indexing, peer review, or implementation status cannot be used to raise an evidence identity automatically.

## General implications first

Evaluate implications for the actual affected class, such as agent systems, AI coding systems, multi-agent systems, runtimes, orchestration, governance, reliability, observability, recovery, verification, operations, research method, or developer practice.

`Implications for Current Work` is optional. It is allowed only when the completed judgment creates a concrete relationship to a declared first-party project.

## Project-relevance test

For non-Project Research, record one of:

- `none`;
- `case-evidence`;
- `substantive-relationship`.

If removing TMPA, FCoP, and CodeFlowMu names collapses the core argument, either the object is genuine `project-research` or the analysis is over-mapped and must be revised.

## Output

```yaml
analysis:
  research_question:
  evidence_claims:
    - id:
      identity:
      claim:
      source:
      strength:
      independent: false
  observations:
  comparisons:
  counterarguments:
  research_judgment:
  general_implications:
  limitations:
  open_questions:
  article_type:
  selected_modules:
  project_relevance:
    status: none | research-object | case-evidence | substantive-relationship
    projects: []
    rationale:
```

No field is a required Markdown heading. Empty analytical fields are omitted rather than filled with generic prose.

## Rule

Every judgment must be traceable to observations or explicitly marked as interpretation, hypothesis, or open question. Internal evidence is never labeled independent.
