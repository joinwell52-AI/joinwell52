---
title: "A Digital Employee Is Not Done Until Completion Is Independently Accepted"
date: '2026-08-05'
column: digital-employee
category: daily
summary: "Computer-use agents need a completion contract that separates process evidence, business outcome and failure classification. The worker may claim completion, but it must not accept its own claim."
item_id: Q-20260805-12
source_research_object: "research/analysis/Q-20260805-12-verifiable-completion.md"
source_reading_result: "research/reading/Q-20260805-12-verifiable-completion.md"
lifecycle: Published
evidence_status: Completed
citation_status: Completed
editing_status: Completed
publication_authorized: true
outline: deep
cover: "/assets/covers/verifiable-completion-cover-v2.jpg"
---

<ArticleCover
  image="/assets/covers/verifiable-completion-cover-v2.jpg"
  kicker="Digital Employee · Daily Research"
  title="A Digital Employee Is Not Done Until Completion Is Independently Accepted"
  summary="Computer-use agents need a completion contract that separates process evidence, business outcome and failure classification. The worker may claim completion, but it must not accept its own claim."
  version="Q-20260805-12"
  status="Daily Runtime V5 · 2026-08-05"
  languageHref="/zh/digital-employee/2026-08-05-verifiable-completion"
  languageLabel="中文"
/>

# A Digital Employee Is Not Done Until Completion Is Independently Accepted

Computer-use agents need a completion contract that separates process evidence, business outcome and failure classification. The worker may claim completion, but it must not accept its own claim.

## Core judgment

Completion is a governed claim, not the last action, a final screenshot or a model-generated sentence.

## Why this is not a point feature

A final screenshot can show an outcome artifact without proving required steps, side-effect limits or business authority. A process score can show execution quality without proving the requested business state. A failure label can assign responsibility without providing retry safety. These are separate claims and need separate evidence.

## Minimum deployable architecture

Use a versioned Completion Claim containing the expected outcome, process evidence, deterministic state readback, optional learned-verifier advice, failure and side-effect classification, and an independent acceptance decision. Preserve disagreement instead of forcing a binary answer.

## Boundaries and counter-evidence

The supporting research is web-task specific, uses a 246-trajectory benchmark and still reports an 8% external false-positive rate. It does not demonstrate rollback, compensation, transactionality or enterprise incident reduction.

## Engineering conclusion

Adopt the separation pattern first: claimant, evidence contract, verifier and acceptor. Treat learned verification as advice alongside deterministic business checks and required human authority.

## Visualization note

The diagram represents control boundaries and state relationships. It does not present experimental results or invent quantitative comparisons absent from the Research Object.

## Evidence and citations

1. [Research Object](https://github.com/joinwell52-AI/joinwell52/blob/main/research/analysis/Q-20260805-12-verifiable-completion.md): the sole analytical input, including judgments, uncertainty, counter-evidence and engineering implications.
2. [Reading Result](https://github.com/joinwell52-AI/joinwell52/blob/main/research/reading/Q-20260805-12-verifiable-completion.md): the evidence boundary and source-trace record behind the Research Object.
