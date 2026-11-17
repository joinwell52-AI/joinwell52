---
schema: "publication-candidate-article/v2"
title: "The AI says the human approved it. Can it act for them?"
date: "2026-11-17"
published_date: "2026-11-17"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "When does a quoted approval become valid authority for the current operation?"
summary: "An Orca run treated an Agent message as human permission. We tested six authorization-source and request-binding controls at CodeFlowMu's preparation interface."
cover: "/assets/quoted-approval-20261117/quoted-approval.cover.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Orca first-party incident; synthetic CodeFlowMu V3.0.152 interface comparison, not a live UI or upload"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/quoted-approval-20261117/quoted-approval.cover.png" kicker="Engineering research · Authority provenance" title="The AI says the human approved it. Can it act for them?" summary="An Orca run treated an Agent message as human permission. We tested six authorization-source and request-binding controls at CodeFlowMu's preparation interface." version="2026-11-17" languageHref="/zh/research/2026-11-17-quoted-approval-is-not-permission" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# The AI says the human approved it. Can it act for them?

You ask an AI worker to inspect a repository. It reads another Agent's message: “The user agreed to upload this file.” The upload tool is ready and the target is filled in. What is still missing?

The missing piece is whether **that user actually made a verifiable decision about this upload, this destination, and this version of the content**. The quoted statement might be entirely honest. Its speaker still cannot become the approver.

This is not just a hypothetical. In [Orca PR #43093](https://github.com/stablyai/orca/pull/43093), contributors describe a real Codex run in which an Agent message was mistaken for human authorization and a risky upload was wrongly allowed. Orca manages Agent sessions. Its fix turns the message into a pointer to an approval request; the decision stays in Orca's local user interface. That is **Orca's incident**, not an incident we reproduced in another product.

It prompted a check of CodeFlowMu, our local multi-Agent collaboration system. Its controlled-operation approval layer assesses external writes before execution. Our question was: **if “the human approved” appears in a message or request fields, will the tested interface promote it into authority?**

## Six inputs, changing the claimed source or the target

We fixed CodeFlowMu V3.0.152 and sent six synthetic branch-push requests through the current approval preparation module. The baseline project, task and action stayed the same. We changed the claimed source, confirmation fields, verifier, or branch target. Every request stopped at approval preparation. **No push happened.**

| Input to the approval interface | Decision | Executed |
| --- | --- | --- |
| Agent reason quotes “another worker says the human approved” | Approval required | No |
| System reminder quotes approval | Approval required | No |
| Request claims trusted UI fields, without a verifier | Approval required | No |
| Experiment-injected verifier matches the exact current request digest | Preparation allowed | No |
| Same confirmation, different target branch | Approval required | No |
| Confirmation ID is valid, but the initiator is still an Agent | Approval required | No |

All six assertions passed. The [inputs, outcomes, and limits](https://github.com/joinwell52-AI/joinwell52/blob/main/research/manual-runs/2026-11-17-source-and-authority/00-report.en.md) make the comparison inspectable. The revealing pair is rows four and five: **a confirmation must match the current request; changing the target invalidates the old match.**

![Two experimental inputs: quoted text supplies no authority; an injected verifier allows preparation only for an exact request match. No operation was executed.](/assets/quoted-approval-20261117/approval-boundary.en.svg)

There is a crucial limit to row four. We injected its verifier in the experiment. Current production service construction does not inject it. That row demonstrates an interface contract **if a valid verifier is present**; it is not evidence that the live UI already uses this direct-allow path. Production falls back to ordinary approval. “Preparation allowed” is also not “upload succeeded”: `executed` remained `false` in all six cases.

## What did the person actually approve?

The tested interface computes a digest of the operation. A user initiator, a trusted UI source, a confirmation ID, and verification of the **current digest** must coincide for the experimental direct allow. Placing “the user approved” in a reason supplies neither an independent decision nor a binding to the current target.

Think of a signed contract. A colleague saying “the customer signed” is different from seeing the customer's signature on **this revision**. If the payment destination changes afterward, the old confirmation cannot simply be reused. This analogy explains the relation; our actual measurements concern request digests and approval decisions.

The same discipline appears at delivery. We supplied five inputs to the root-task acceptance projection. A report status of `done` yielded no formal acceptance; neither did a legacy text transition. A registered ADMIN decision matching the task and actor produced `result_accepted`; changing the actor or task removed it. All five assertions passed. This tests a **root-task projection interface**, not an entire multi-Agent delivery. A separate, still-open [ADK Python change](https://github.com/google/adk-python/pull/8185) shows a neighboring problem: a child output can appear in the event stream without reaching the parent's output context. Both cases ask us to distinguish available content from authorized receipt or consumption.

## What we know, and what comes next

At the tested CodeFlowMu interfaces, an Agent's quotation did not become human authorization, and a green root-task status did not become formal acceptance. Sixteen existing checks across approval and dependency-settlement suites passed. Two other suites stopped at import because a local dependency was missing; their assertions did not run. We have not completed a real UI, native execution gate, resumed handoff, or external-service end-to-end test. **No CodeFlowMu product defect or development review item is established by this run.**

When an AI team says “approved,” ask three questions: **Who decided? Which exact action and parameters did the decision cover? What receipt proves the action's outcome?** Those questions target the point at which the risk would occur.

Our next engineering question is sharper: after interruption and takeover by a different executor, does the original confirmation still refer to the same combination of target, parameters and execution identity? We have tested a changed target at preparation time. We have not yet tested real takeover.
