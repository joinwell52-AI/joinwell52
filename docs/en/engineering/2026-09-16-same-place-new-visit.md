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

You open workspace A while its file list is loading. You switch to B, then return to A.

Only now does the first request for A finish. The workspace name is right. It is still a file-list request. **But does the answer belong to this visit or the previous one?**

The name matches again, but the first request has not become a new request. We wanted to test whether the application can distinguish those visits.

## Give each visit a distinguishable marker

The idea comes from [Orca #20914](https://github.com/stablyai/orca/pull/20914), submitted by Jinwoo-H. Orca's mobile client requests file information from the computer running an AI assistant, then retains results for later queries.

This change gives one object responsibility for pending requests and temporarily stored results. Think of it as a record keeper for the current period of use: it needs to know which results still belong and which have become obsolete.

The implementation attaches a valid-at-the-time marker to a request. A switch or reset retires the old marker. Returning to A does not reactivate the first visit's marker. The code calls these distinct periods “generations.”

That interested us because persistent assistants encounter switching, reconnection, and recovery. Recognizing the workspace's name alone can miss changes it has gone through. Upstream explicitly tests A→B→A; we used that scenario to build a controlled timing experiment.

## Make the first result arrive late

We executed the complete module at a fixed version: start a request for A, hold its answer back, change the scope, and only then deliver the old result. We checked whether it could be stored and read again.

For comparison, we removed only the check that asks whether the request's marker still belongs to the current generation. This deliberately modified version helps explain the mechanism; **it is not a historical Orca release**.

| Constructed scenario | Original module | Generation check removed |
| --- | --- | --- |
| A→B→A; first A result arrives late | Refuses storage | Stores old result; later readable |
| Same name, explicit reset | Refuses storage | Stores old result; later readable |
| Tell the owner that the identity epoch changed | Refuses old request marker | Stores result, but new scope cannot read it |
| Identity changes without informing the owner | **Old result remains storable and readable** | Old result remains storable and readable |
| Pass a request marker to another owner | Refuses: marker belongs elsewhere | Still refuses |

The first two rows make the central point: rejecting a stale result requires more than the workspace name.

The fourth row shows that protection also needs an input. If the caller never reports an identity change, the owner cannot know that a new period has begun. We deliberately omitted that signal in a synthetic case; this does not establish a defect in the real login flow.

![Two visits to the same workspace](/assets/current-context-20260916/same-place-new-visit.figure.en.svg)

*Figure 1. The first request for A arrives after the returning visit has begun a new generation. Source: our controlled schedules; diagram by the authors, not a recording of the mobile UI.*

## Stored, read, and displayed are separate steps

Another result was less obvious. We changed the outside scope without yet informing the owner. Submitting the old result then returned “committed.”

On the next read with the new scope, the owner noticed the change and cleared the previously stored contents. That read did not return the old value.

These temporarily stored contents are the cache. The implementation checks both when accepting a result and when a later reader supplies a scope. Reading only the “committed” verdict misses the second part of the protection.

The screen is another step. A caller can still hold an old asynchronous result. If it displays that value directly, without another cache read, it needs its own ordering check. Orca's file-search code retains such a display check. Our experiment did not run the mobile UI, so it cannot guarantee what every screen shows.

**To understand whether stale content can appear, follow the result: who accepts it, who reads it, and who puts it on screen?**

## Which changes must the application report?

Workspace selection is an obvious change. Reauthentication or moving execution to another computer can also make earlier results unsuitable.

The next questions are therefore specific: which events make this data obsolete, where does the application obtain reliable signals of those events, and who supplies them to the request owner? Naming a field “version” does not establish its source.

Users can contribute concrete observations: after returning to a workspace, did the file list show new content and then briefly revert? Was there a reconnection or account switch? Those details help developers reproduce the right ordering.

Developers can also consider how many updates one request produces. If it first publishes “loading” and later “ready,” how should a request marker constrain both updates? That is a follow-up design question, not an extension tested in this experiment.

Returning to the same place does not reverse time. The application still needs to know which visit owns the result.

<details>
<summary>For technical readers: additional schedules, boundaries, and pinned version</summary>

Source author: Jinwoo-H. Candidate: `89711d6f55670781d23fc1a2d4e2aecf4d725758`; merged on 2026-09-16 UTC. The complete `generation-scoped-request-owner.ts` was executed. Eight schedules or boundary cases were run against the original and a mutation removing only the generation comparison: 16 observations.

The request marker described above is the lease; the caller supplies a scope. The implementation checks both lease ownership and generation. Removing the generation comparison preserves the ownership check. An identity epoch included in scope changes the key, so an accepted old value in the ablation does not necessarily become readable under the new scope.

Additional cases cover normal same-generation publication and stale-request cleanup. When an old request settled while a new one remained pending, cleanup preserved the new in-flight entry; another load shared its promise and started zero duplicate loads.

Upstream states that mobile lacks an available negotiated capability epoch; the experiment does not invent one. Its authentication-epoch boundary case does not establish a real authentication path. A separate query sequence protects display, and the cache commit verdict is not a freshness guarantee for a value already held by the caller. Upstream identifies loading/ready publication in a future status-loader migration as unfinished work.

No real RPC, mobile UI, host migration, or login flow was run. The private TypeScript lease brand is not claimed to isolate hostile JavaScript in the same process.

[Pinned source, all observations, and runnable probes](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-09-16-current-context). These observations do not establish a corresponding CodeFlowMu defect.

</details>

[Research repository](https://github.com/joinwell52-AI/joinwell52)
