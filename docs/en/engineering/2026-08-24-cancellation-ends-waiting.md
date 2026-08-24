---
title: "Cancellation Ends Waiting, Not Ownership"
date: '2026-08-24'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How should an asynchronous resource owner react when cancellation arrives during teardown so it neither leaks remaining owned resources nor swallows the caller's cancellation signal?"
summary: "A merged OpenAI Agents Python fix treats cancellation during owned dependency cleanup as deferred control flow: finish bounded local teardown, clear ownership state, then re-raise. This preserves two contracts locally but does not prove remote cleanup success."
sources:
  - research/analysis/Q-20260824-03-cancellation-defers-owner-teardown.md
item_id: "Q-20260824-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-24-cancellation-ends-waiting-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-24-cancellation-ends-waiting-cover.png"
  kicker="Open-source Engineering · Daily Research"
  title="Cancellation Ends Waiting, Not Ownership"
  summary="A merged OpenAI Agents Python fix treats cancellation during owned dependency cleanup as deferred control flow: finish bounded local teardown, clear ownership state, then re-raise. This preserves two contracts locally but does not prove remote cleanup success."
  version="Q-20260824-03"
  status="Daily Runtime V5 · 2026-08-24"
  languageHref="/zh/engineering/2026-08-24-cancellation-ends-waiting"
  languageLabel="中文"
/>

# Cancellation Ends Waiting, Not Ownership

An asynchronous container owns several sandbox dependencies. While closing one, it receives `CancelledError`. Immediate propagation respects the caller's wish to stop waiting, but it can abandon every resource later in the teardown order. Swallowing cancellation finishes cleanup but breaks the caller contract.

An OpenAI Agents Python change merged on 2026-08-24 preserves both obligations locally. The container captures the first cancellation raised during an owned close, continues attempting the remaining closes, clears its internal lifecycle collections and then re-raises cancellation. A regression verifies both owned values receive one close call and a second `aclose()` reuses the same cancelled close task without increasing either counter.

The engineering proposition is: **cancellation ends waiting, not ownership.** For a lifecycle owner, cancellation during teardown should become a deferred terminal signal while bounded local obligations finish. That pattern does not prove remote cleanup succeeded or that ordinary close failures are visible.

## Ownership survives the caller's control-flow decision

Cancellation and ownership answer different questions. Cancellation says the caller no longer wants to continue the current wait or computation. Ownership says the component accepted responsibility for resources already created on the caller's behalf.

In the selected `Dependencies` implementation, only factory results marked `owns_result=True` enter the container-managed owned list. The close path first cancels and awaits active factory tasks, then walks owned results in reverse order. That scope gives the owner a finite set of obligations before it releases local state.

If cancellation instantly exits the loop, later owned resources never receive their close attempt and internal caches may remain populated. Treating cancellation as permission to abandon them would silently rewrite the ownership contract at the most failure-prone moment.

Not every resource must have the same policy. For an ephemeral object, immediate abandonment may be acceptable. For a credentialed sandbox, leased worker or billable remote resource, cleanup may be mandatory. The owner should define that class-specific boundary before cancellation arrives.

## Defer propagation without swallowing cancellation

The selected mechanism records the first `CancelledError`, continues through the remaining owned results and clears `_pending`, active tasks, cache and ownership collections. Only then does it re-raise the saved cancellation.

This ordering preserves caller semantics: cancellation still reaches the caller. It also preserves bounded owner semantics: every admitted resource receives its local close attempt. Deferral is not a general license to keep working indefinitely after cancellation; it is a way to finish a predefined teardown scope before returning control.

The pattern resembles a small critical section, but the guarantee comes from explicit lifecycle state rather than shielding all work from cancellation. Systems should keep the post-cancellation scope short, deterministic and observable enough to diagnose stalls.

## One close task creates local teardown identity

The first `aclose()` creates one `_close_task`; later callers reuse and shield that task rather than starting independent teardown passes. Reverse traversal also deduplicates repeated object references using `id(value)`. Together, those choices provide local idempotence for the demonstrated container lifecycle.

The scope matters. Two wrapper objects can refer to the same remote resource while having different Python identities. A resource's `close()` can partially succeed before raising. Another process can issue its own close. Reusing one local task proves only that this owner does not launch a second local pass for the tested references.

Critical remote resources may need a logical resource identifier, idempotency key or lease record shared beyond the process. Local object identity is a useful optimization and regression boundary, not evidence of external uniqueness.

## Best effort still needs an evidence channel

Ordinary exceptions from dependency close methods are intentionally suppressed by `_close_best_effort()`. That lets teardown continue, which may be the right availability choice. It also means the absence of a terminal cleanup error cannot establish that every resource closed successfully.

For low-impact objects, silent best effort may be sufficient. Security-, cost- or compliance-sensitive resources need structured failure records and reconciliation. Cancellation should remain the caller-visible control signal, while close failures can be aggregated or written to a separate teardown evidence channel without disappearing.

The final operational question is remote: after local cancellation or a suppressed close error, what receipt, listing or reconciliation proves the external resource is gone? Until that evidence exists, the defensible result is bounded: the demonstrated owner attempts all local closes and preserves cancellation, but remote success and distributed exactly-once cleanup remain unproved.

**Primary evidence:** [OpenAI Agents Python merged commit 72b2c670](https://github.com/openai/openai-agents-python/commit/72b2c670546942bdaaf66cc8d6b3a67d1a2fe5bc). The implementation and regression support the scoped local teardown behavior described here; they are not independent proof of remote cleanup success or exactly-once effects.
