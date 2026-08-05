---
schema: "publication-candidate-article/v1"
date: "2026-08-05"
column: "industry-architecture"
item_id: "Q-20260805-13"
lifecycle: "Publication Candidate"
source_research_object: "research/analysis/Q-20260805-13-governed-model-routing.md"
source_reading_result: "research/reading/Q-20260805-13-governed-model-routing.md"
visualization: "staging/publication-candidates/2026-08-05-governed-model-routing.svg"
visualization_decision: "Required — architecture diagram included"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: false
---

# Model Routing Must Optimize Inside Policy, Not Replace It

Automatic model selection becomes enterprise architecture only when eligibility, authority, fallback and audit are explicit and durable.

## Core judgment

Routing is an optimization service subordinate to a versioned policy decision; it is not a source of authority.

## Why this is not a point feature

A router may classify task type and complexity and optimize for intelligence, balance or cost. Enterprise policy answers a different question: which providers, models, data classes, budgets, regions and capabilities are eligible. If these planes are merged, an opaque optimizer can silently redefine governance.

## Minimum deployable architecture

Persist a Route Decision Envelope for every invocation: policy version, task class, eligible and excluded candidates, selected model and version, objective, cost or latency estimate, fallback or exception reason and disclosure mode. Define precedence, empty-pool behavior, outage fallback and retirement migration outside the classifier.

## Boundaries and counter-evidence

Public material does not disclose classifier confidence, thresholds, candidate construction, route-error rates or a reproducible savings evaluation. Routing also does not remove migration obligations when models retire.

## Engineering conclusion

Separate Policy, Routing, Execution and Audit planes. Fail closed or escalate when the eligible pool is empty; never silently widen policy to satisfy an optimizer.

## Visualization note

The diagram represents control boundaries and state relationships. It does not present experimental results or invent quantitative comparisons absent from the Research Object.

## Evidence and citations

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260805-13-governed-model-routing.md): the sole analytical input, including judgments, uncertainty, counter-evidence and engineering implications.
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260805-13-governed-model-routing.md): the evidence boundary and source-trace record behind the Research Object.

> Editing status: bilingual structure, evidence checks, qualification preservation, title and column consistency are complete; this candidate is not published.
