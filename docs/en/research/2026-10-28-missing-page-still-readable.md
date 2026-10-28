---
schema: "publication-candidate-article/v2"
title: "A page is missing from the AI work log. Can it still resume?"
date: "2026-10-28"
published_date: "2026-10-28"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "A page is missing from the AI work log. Can it still resume?"
summary: "Delete an event in the middle and the survivors can still be read, while their original sequence retains a gap. Resumable is not the same as complete."
cover: "/assets/execution-boundaries-20261028/missing-page-still-readable.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Pinned source; local before-and-after replay of upstream missing-event regression tests"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/execution-boundaries-20261028/missing-page-still-readable.cover-v1.png" kicker="Open-source engineering · Controlled comparison" title="A page is missing from the AI work log. Can it still resume?" summary="Delete an event in the middle and the survivors can still be read, while their original sequence retains a gap. Resumable is not the same as complete." version="2026-10-28" languageHref="/zh/research/2026-10-28-missing-page-still-readable" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# A page is missing from the AI work log. Can it still resume?

Suppose a work journal has four pages and the second page disappears. You would want to read pages three and four to learn what was completed. You would also want to know a page is missing.

A long-running AI assistant faces the same problem when it restores context from an event log. If the reader stops at the first missing file, later valid records disappear too. If it silently renumbers the survivors into a neat sequence, someone may conclude that the history was complete.

## Why we investigated this change

In the [October 28 engineering digest](https://joinwell52-ai.github.io/joinwell52/en/runtime/daily-intelligence/2026-10-28), [OpenHands SDK PR #6197](https://github.com/OpenHands/software-agent-sdk/pull/6197) addresses loading after an event file is lost. We wanted to check two properties together: **can the remaining events be read, and can the missing event still be recognized?**

The case is easy to control: write four events, delete a file in the middle, and reload. We used the upstream repository's `InMemoryFileStore` tests. They simulate missing files; we did not modify real conversations.

## Where do the later pages go?

We pinned the pre-fix source at [`acd96e6f`](https://github.com/OpenHands/software-agent-sdk/tree/acd96e6fa424c02432304395b9208f99be24b54d) and the merge commit at [`ded5fa5e`](https://github.com/OpenHands/software-agent-sdk/tree/ded5fa5e76ff9b7b4ff622a8df2ed20335e10652). Five parameterized cases cover a lost middle or first file, sequence reuse, a missing parent event, and repeated warnings.

| Source | Five cases | Observed difference |
| --- | --- | --- |
| Before the fix | **5/5 failed** | After a missing middle file, later surviving events were not indexed; a parent-chain lookup also failed. |
| Merge commit | **5/5 passed** | Survivors remained readable, the original gap was preserved and reported, and new events did not reuse old sequence numbers. |

The four-event example makes this concrete. Original on-disk sequence numbers are `0, 1, 2, 3`. Remove `1`, and the three readable records can be displayed at dense positions `0, 1, 2`; their original sequence remains `0, 2, 3`. The next event receives `4`, rather than filling the old `1` slot. A convenient display position no longer pretends to be original history.

![After one event is lost, survivors remain readable while the original sequence retains a gap](/assets/execution-boundaries-20261028/missing-page-still-readable.figure.en.svg)

*Figure: sequence behavior in the controlled test. The missing content was not recovered.*

In another case, a surviving event points to a missing parent. The fixed reader can bridge the visible path back to an earlier surviving event and warn about the gap; it does not repeat the same warning on every traversal. **The path is repaired for use; the missing fact is not restored.**

## Resumability and completeness are different claims

Our observation is deliberately narrow. Under these simulated missing-file conditions, the fixed version retains both readability and evidence of the gap. It does not prove recovery of damaged content, behavior under real disk failure or concurrent writers, or inclusion in every packaged release. The PR is merged; we did not verify a specific release.

This raises a harder question for long-running agents: when history has a hole, does the layer that verifies the work receive a clear “evidence incomplete” signal? If it sees only a usable reconstructed chain, it may mistake recovery for completeness. Our tests did **not** evaluate that higher-level propagation; it is the next experiment suggested by the result.

Users can weigh in too: when a log is damaged, would you prefer an assistant to stop immediately, or show what can be recovered while clearly marking the missing position? The appropriate response depends on the task, but the missing fact should remain visible.

The [public experiment report](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-10-28-execution-boundaries/00-report.md) records pinned versions, commands, and limits. This is a **local before-and-after replay of upstream missing-event regression tests**, not a production data-loss incident. [Research repository](https://github.com/joinwell52-AI/joinwell52)
