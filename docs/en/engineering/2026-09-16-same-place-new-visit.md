---
schema: "publication-candidate-article/v2"
title: "Back in the same workspace, but which visit owns the result?"
date: "2026-09-16"
published_date: "2026-09-16"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Back in the same workspace, but which visit owns the result?"
summary: "You leave workspace A, visit B, and return to A. A request from the first visit finally arrives. A controlled timing experiment asks whether it still belongs on screen."
cover: "/assets/current-context-20260916/same-place-new-visit.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments on pinned source; scope in article"
pageClass: "current-context-article"
---

<ArticleCover image="/assets/current-context-20260916/same-place-new-visit.cover-v1.png" kicker="Open-source engineering · Experiments" title="Back in the same workspace, but which visit owns the result?" summary="You leave workspace A, visit B, and return to A. A request from the first visit finally arrives. A controlled timing experiment asks whether it still belongs on screen." version="2026-09-16" languageHref="/zh/engineering/2026-09-16-same-place-new-visit" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.current-context-article .vp-doc h1[id] { display: none; }</style>

# Back in the same workspace, but which visit owns the result?

You open workspace A while its file list is still loading. You switch to B, then return to A.

Only now does the first request for A finish. The workspace name is right. The query is right. **But does the answer belong to this visit or the previous one?**

Comparing only the name A can admit an obsolete result. The name has returned; time has not.

## Why test a round trip?

[Orca #20914](https://github.com/stablyai/orca/pull/20914), submitted by Jinwoo-H, moves the mobile file inventory's request, in-flight, and cache lifecycle into one owner.

The interesting part is a testable rule. Each request receives a lease belonging to its generation. A reset or scope transition retires that generation, so a late request cannot publish through its old lease.

The upstream work explicitly covers A→B→A. We wanted to see what this mechanism observes and which changes callers must supply.

## Make the old request finish late

We loaded the pinned complete owner module and controlled when its promises resolved. For a counterfactual, we removed only the generation comparison while keeping the rest of the implementation.

This is an experimental mutation, **not an old released Orca version**. Its failures do not establish a historical product incident.

| Constructed scenario | Original module | Generation comparison removed |
| --- | --- | --- |
| A→B→A; first A result arrives late | Commit refused | Old value committed and readable |
| Same name, explicit reset | Commit refused | Old value committed and readable |
| Changed identity epoch included in scope | Old lease refused | Committed, but new scope cannot read old key |
| Identity changes but caller omits that signal | **Old value accepted** | Old value accepted |
| Lease passed to a different owner | Foreign owner refused | Still refused |

The final row separates ownership from generation. Removing one comparison does not remove the other.

![Two visits to the same workspace](/assets/current-context-20260916/same-place-new-visit.figure.en.svg)

*Figure 1. A simplified controlled schedule, not a recording of the mobile UI. The returning visit to A has a new generation. Source: our pinned-source experiments and saved results; diagram by the authors.*

## Committed does not always mean readable

In another schedule, the outside scope had changed but the owner had not yet observed it. The old result's commit returned “committed.”

The first read with the new scope then retired the cache, making that value unavailable. Protection happens at both commit and read. Looking only at the commit verdict misses part of the design.

Conversely, when a caller never supplies the changed identity epoch, the owner has no evidence that the scope changed. Our synthetic omission case committed and returned the old value. That tests the interface boundary; it does not prove that a real authentication path omits a required field.

Upstream also notes that mobile has no negotiated capability epoch available to use. Inventing a field would not create the missing evidence.

## The display has a responsibility too

We observed cache behavior, not a phone screen. A caller still holds the returned value. If it displays that value directly, cache rejection cannot protect the display for it.

The file-search pilot retains a separate query-sequence check for display. We did not exercise the full mobile flow or establish protection for every screen.

We also completed an old request while a new one was still running. The old cleanup did not remove the new request's slot: a subsequent load shared the new promise and started no duplicate work. Even cleanup must identify the request it owns, not merely a matching key.

For developers, the next question is concrete: which events make this data obsolete—workspace selection, host migration, reauthentication—and which are actually represented in scope? Users can offer equally concrete reports: does the file list briefly revert after returning to a workspace?

**Returning to the same place is not returning to the same moment.** A result needs to belong to a particular visit.

<details>
<summary>Version and scope</summary>

Pinned candidate: `89711d6f55670781d23fc1a2d4e2aecf4d725758`. The PR merged on 2026-09-16 UTC; the supplied OPEN status was outdated. Eight schedules or boundary cases were run against the original and a mutation removing only the generation comparison: 16 observations.

The complete `generation-scoped-request-owner.ts` was transpiled and executed. No real RPC, mobile UI, host migration, or authentication flow was run. The private TypeScript lease brand is not claimed to isolate hostile JavaScript in the same process.

[Pinned source and runnable probes](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-16-current-context). These observations do not establish a corresponding CodeFlowMu defect.

</details>


[Research repository](https://github.com/joinwell52-AI/joinwell52)
