---
schema: "publication-candidate-article/v2"
title: "Only the Note Changed. Why Did the Evaluation Pass Rate Flip?"
date: "2026-09-09"
published_date: "2026-09-09"
column: "open-source-engineering"
category: "daily"
article_type: "comparative-engineering-analysis"
edition: "research-center"
research_question: "Only the Note Changed. Why Did the Evaluation Pass Rate Flip?"
summary: "A real aggregation function remained deterministic while a note decided which conflicting result survived. Stable output and justified judgment are separate requirements."
cover: "/assets/verification-evidence-20260909/01-deterministic-conflict.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments; not independent QA; dependency substitutions disclosed"
pageClass: "verification-evidence-article"
sources:
  - "https://github.com/yzhao062/awesome-auditable-ai/commit/3df29d2ae81d550dbe72a8d4a46dc3267c627413"
---

<ArticleCover image="/assets/verification-evidence-20260909/01-deterministic-conflict.png" kicker="Engineering · Experimental research" title="Only the Note Changed. Why Did the Evaluation Pass Rate Flip?" summary="A real aggregation function remained deterministic while a note decided which conflicting result survived. Stable output and justified judgment are separate requirements." version="2026-09-09" languageHref="/zh/engineering/2026-09-09-deterministic-conflict" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.verification-evidence-article .vp-doc h1[id] { display: none; }</style>

# Only the Note Changed. Why Did the Evaluation Pass Rate Flip?

Two evaluation records shared an ID. One said pass; the other said fail. We exchanged their notes, `a` and `b`, without changing either outcome. The summary's pass rate moved from 100% to 0%.

This was an isolated experiment against a real aggregation function, not a production scoring incident. Its eight existing tests still passed, including the test requiring identical output when input order changes.

The implementation was deterministic. What it lacked was a reason to treat its chosen record as the authoritative result.

## The test answered a narrower question

CodeFlowMu is a local multi-agent collaboration system we are developing. An evaluation helper introduced in an August change aggregates outcome records. Its change record explicitly describes resolving duplicate identities through a content comparison, avoiding dependence on arrival order.

That is a useful goal. Filesystem enumeration and asynchronous completion should not determine an evaluation. But a repeatable choice is not necessarily a justified one.

The conflict test submits the same records in both orders and checks equality. It does not require preservation of both claims or an explicit disputed result. Consistently discarding one side satisfies the assertions.

The missing contract concerns identity: does the same ID with different content represent a repeated observation, or a conflict?

## How a note acquired authority

We imported the actual `summarizeEvalOutcomes` function and supplied synthetic records:

```json
[
  {"id":"A","status":"pass","note":"a"},
  {"id":"A","status":"fail","note":"b"}
]
```

The function groups by identity, serializes each complete raw record with sorted keys, and chooses the lexicographically smaller representation. The note participates in that comparison before the status. Swapping the notes changes the selected result.

Nothing establishes that the selected record is newer, better supported, or an authorized correction. The final summary retains only ID, name, and status, concealing the competing claim.

## Controls matter

We ran eight cases in two separate Node processes, also reversing every input. These are function outputs, not estimates of model reliability.

| Synthetic condition | Retained | Duplicates | Output |
| --- | ---: | ---: | --- |
| Different IDs, one pass and one fail | 2 | 0 | 50% |
| Same ID, identical pass records | 1 | 1 | 100% |
| Same ID; pass note=a, fail note=b | 1 | 1 | 100% |
| Same outcomes; notes exchanged | 1 | 1 | 0% |
| Same ID, pass/fail without notes | 1 | 1 | 0% |
| Same case_id, different run_id, no record ID | 1 | 1 | 100% |
| Same runs with separate record IDs | 2 | 0 | 50% |
| ID present, outcome missing | 1 | 0 | unknown=1; rate field 0 |

![Figure: schematic of the saved observations discussed above. Arrows show the stated processing relationship, not a runtime screenshot. Source: accompanying experimental evidence.](/assets/verification-evidence-20260909/deterministic-conflict-figure.en.svg)

*Figure 1. schematic of the saved observations discussed above. Arrows show the stated processing relationship, not a runtime screenshot. Source: accompanying experimental evidence.*


Both rounds agreed. Identical replay is correctly deduplicated, so abandoning deduplication would miss the point. The issue is treating replay and contradictory claims as the same category.

The missing-outcome control is equally important: the function preserves `unknown`. Its rate includes that record in the denominator, producing zero; that does not establish a confirmed test failure.

## A test case is not a test run

The helper accepts `case_id` as an identity fallback and does not include `run_id`. Two observations of one case can therefore collapse when distinct record IDs are absent. With explicit record IDs, both observations survive.

This is an input-contract finding, not proof that production repeated runs were lost. Our source search found the helper and its tests, but no production consumer in the searched JavaScript and TypeScript roots.

Before asking how many repeated measurements establish stability, check that repetitions remain separate observations. An [awesome-auditable-ai curation commit](https://github.com/yzhao062/awesome-auditable-ai/commit/3df29d2ae81d550dbe72a8d4a46dc3267c627413) carefully narrowed claims about repeated-query research rather than endorsing a universal repeat count. We cite that editorial decision; we did not reproduce those statistical methods.

## What should enter development review

Three cases deserve distinct contracts: identical replay, conflicting content under one record identity, and separate runs of one test. Preserve conflicting sources and expose disagreement instead of selecting a business outcome by note order. “Failure wins” would still be an unsupported selection rule unless explicitly justified.

The local helper is now the subject of a development-review submission. Consumer reachability, compatibility, and whether to retain the helper come first; no production incident or completed fix is claimed.

The evidence covers one historical change record, the actual helper at `c008d9db91a21136fc61a4f60314e22db395d5d2`, and eight synthetic cases. See the accompanying [evidence guide](https://joinwell52-ai.github.io/joinwell52/en/research/evidence/2026-09-09-verification-evidence). Product-source disclosure remains separately reviewed.

Determinism tells us whether an answer repeats. Conflict preservation tells us whether a single answer is justified at all.
