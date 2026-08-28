# Skill 04 — Research Analysis V2.2

## Purpose

Transform verified Reading evidence into a **problem-first, mechanism-aware and governance-prioritized Research Object**.

The Research Object must remain meaningful after removing vendor names and release/version labels. Product, framework, protocol, paper and benchmark names are evidence/sample identities, not the core research subject.

## Highest-priority principle

Agent Governance receives first-priority analytical attention when supported by the evidence, especially:

- identity and authority;
- call-time authorization;
- delegation and task ownership;
- human approval;
- evidence and completion truth;
- audit and provenance;
- recovery authority;
- credential, memory and context isolation;
- policy enforcement;
- accountability and responsibility.

This does not prohibit other multi-agent or digital-employee research. It defines the first analytical lens.

## Required reasoning

1. State the bounded research question independently of a release/version headline.
2. Identify the research theme(s) and subject kind.
3. Separate public facts, source-reported claims, research results, reproducible engineering evidence, our observations and our interpretations.
4. Identify failures, counterexamples and negative evidence.
5. Identify the concrete mechanism(s) being compared or evaluated.
6. Compare relevant samples or prior Research Objects when the question is general.
7. Identify what the evidence supports, contradicts and leaves unknown.
8. Form a bounded research judgment.
9. State the general implication for governed digital employees / multi-agent systems.
10. Recommend the most suitable article type and only the content modules needed by the judgment.
11. Test first-party project relevance only after the external research conclusion exists.

## Research Object subject kinds

Use one or more of:

```text
governance-problem
failure-mode
research-finding
architecture-mechanism
protocol-mechanism
benchmark-result
industry-application-pattern
cross-sample-comparison
prior-art-or-negative-result
```

The following are not valid final Research Object kinds:

```text
release-update
changelog-summary
routine-commit
announcement-summary
```

If Reading reveals that the Queue-selected item is only update content, return it for revision instead of manufacturing a generalized conclusion.

## Failure / Finding / Mechanism / Implication

Every Research Object should explicitly distinguish these dimensions when present.

### Failure
What failed, is unsafe, is unreliable, or creates an organizational/runtime risk?

### Finding
What is supported by evidence, experiment, benchmark, incident or comparison?

### Mechanism
What architecture, policy, protocol, state transition, approval model, coordination design or recovery mechanism explains the behavior?

### Implication
What bounded design consequence follows for digital employees or multi-agent systems?

The implication is not automatically “CodeFlowMu should do X.” First establish the general conclusion.

## Comparative boundary

For general questions, prefer evidence across samples.

Examples:

- a Codex change may be evidence for delegation-budget research, but Codex is not the research subject;
- a LangGraph checkpoint may be evidence for recovery-state research, but checkpoint support does not itself prove recovery authority;
- an A2A task transition may be evidence for cross-agent completion trust, but the final question concerns remote task/effect evidence;
- a CrewAI manager pattern may be evidence for organizational delegation, but the analysis should test responsibility and validation independence.

If only one sample is available, the judgment must remain correspondingly narrow.

## Editorial boundary

`article_type` and `selected_modules` are research-side editorial recommendations. They are not a final table of contents and do not authorize direct drafting.

Production must independently qualify the Research Object through the current Editorial Architecture gates before formal writing.

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

Publication, citation, DOI, indexing, peer review, implementation or vendor adoption cannot automatically raise an evidence identity.

## General implications first

Evaluate implications for the actual affected class, such as:

- governed digital employees;
- multi-agent organizations;
- agent runtimes;
- delegation systems;
- A2A / interoperability;
- human-agent workflows;
- policy enforcement;
- recovery;
- observability;
- auditability;
- verification;
- industry agent applications.

## Project-relevance test

For non-Project Research, record one of:

- `none`;
- `case-evidence`;
- `substantive-relationship`.

If removing TMPA, FCoP and CodeFlowMu names collapses the core argument, either the object is genuine project research or the analysis is over-mapped and must be revised.

## Output

```yaml
analysis:
  research_question:
  research_themes:
  subject_kind:
  samples:
  research_value:
    failures:
    findings:
    mechanisms:
    implications:
  evidence_claims:
    - id:
      identity:
      claim:
      source:
      strength:
      independent: false
  observations:
  comparisons:
  contradictions:
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

## Hard rules

- Every judgment must be traceable to evidence or explicitly marked as interpretation, hypothesis or open question.
- Internal evidence is never labeled independent.
- Do not turn platform/version news into the Research Object.
- Do not reward a claim merely because a major vendor implemented it.
- Preserve failures and contradictions; do not optimize for positive product narratives.
- The final Research Object must teach something about a digital-employee or multi-agent problem that survives beyond the triggering release.
