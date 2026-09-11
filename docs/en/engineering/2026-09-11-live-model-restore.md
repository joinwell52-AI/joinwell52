---
schema: "publication-candidate-article/v2"
title: "Yesterday's Model Choice Is Not Today's Capability"
date: "2026-09-11"
published_date: "2026-09-11"
column: "open-source-engineering"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
research_question: "Yesterday's Model Choice Is Not Today's Capability"
summary: "Eight original-function comparisons distinguish an explicitly unsupported choice from an unavailable catalog during model restoration."
cover: "/assets/current-authority-20260911/live-model-restore.cover-v1.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded pinned-source experiments; no real cloud validation"
pageClass: "current-authority-article"
---

<ArticleCover image="/assets/current-authority-20260911/live-model-restore.cover-v1.png" kicker="Open-source Engineering · Experiments" title="Yesterday's Model Choice Is Not Today's Capability" summary="Eight original-function comparisons distinguish an explicitly unsupported choice from an unavailable catalog during model restoration." version="2026-09-11" languageHref="/zh/engineering/2026-09-11-live-model-restore" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.current-authority-article .vp-doc h1[id] { display: none; }</style>

# Yesterday's Model Choice Is Not Today's Capability

Remembering the last selected model is a natural product feature. What gets saved, however, is a preference. It cannot guarantee that the provider still offers the model today, or that the current account may use it.

The opposite case is harder: if today's model catalog cannot be read, should every saved choice be rejected? That apparently cautious rule could break working restoration on older clients.

An Orca candidate fix handles both cases at the same write boundary. We executed eight input conditions against its predecessor and candidate functions. The result was a deliberate distinction between negative evidence and missing evidence.

## Accepting a setting does not prove useful execution

Orca is a desktop application that connects several agent execution tools. [PR #19946](https://github.com/stablyai/orca/pull/19946) reports a Claude structured-session experiment: setting an unlisted model ID can return successfully, while subsequent turns fail with zero tokens. Restoring a saved choice can reach the same path without a user typing an invalid value.

Those real-CLI observations belong to the upstream author. We did not launch Claude or reproduce those token measurements. Our question was narrower: does the proposed guard prevent `setModel` when the catalog explicitly excludes a choice, while preserving normal and compatibility paths?

The PR remained open when checked for this study. This is a candidate implementation, not a guarantee about a released desktop product.

## Eight conditions, measured at the write call

We pinned baseline `027acb4efa2e6b226d40df266b86367423946d62` and candidate `a13c8452e70f214b50ea37149c6f6485bc149f6f`. Node 24.16.0 executed the original setting, restoration, and catalog-parsing function bodies after type stripping and explicit dependency injection. The connection was a test double returning controlled catalogs and recording calls.

This was not a complete desktop test. It measured whether the write method was called, whether the preference remained in state, and whether restoration recorded a skipped field. It did not observe real provider adoption or inference.

| Input and entry point | Baseline writes | Candidate writes | Candidate outcome |
| --- | ---: | ---: | --- |
| Unlisted model, interactive change | 1 | 0 | Rejected with the requested model name |
| Retired saved model, restore | 1 | 0 | Model skipped; stale preference removed |
| Listed model alias | 1 | 1 | Write allowed |
| Resolved ID carried by an alias row | 1 | 1 | Write allowed |
| Catalog query throws | 1 | 1 | Compatibility path retained |
| Empty catalog | 1 | 1 | Compatibility path retained |
| Only a synthetic default row | 1 | 1 | Compatibility path retained |
| Listed model, restore | 1 | 1 | Normal restoration |

Eight conditions across two versions produced sixteen observations. The first two rows establish the meaningful change: explicit absence prevented the write. The remaining paths still reached the write method, including valid restoration.

![Three outcomes for positive, negative, and unavailable catalog evidence](/assets/current-authority-20260911/live-model-restore.figure.en.png)

*Figure 1. Catalog evidence and the write decision. Source: this study's runs/orca.json. “Write allowed” means execution reached setModel; it does not establish account entitlement or successful inference.*

## Unknown is not another name for unsupported

A usable catalog that lists available choices but omits a saved ID provides a specific basis for refusal. An unavailable interface, failed query, or catalog with no identifiable models does not provide the same evidence.

The candidate retains compatibility in those latter cases. It does not certify the requested model as supported; it simply does not prohibit the write on this catalog check. Later behavior can still succeed or fail elsewhere.

Restoration makes the distinction consequential. An interactive refusal can be shown to the user. The restore function catches that refusal type, records the field as skipped, and removes the stale preference from `options`. Treating every unavailable catalog as negative evidence could silently discard otherwise usable choices on an older CLI.

This is not a general recommendation to permit actions whenever a security check fails. The boundary here is model-catalog compatibility, not secret access, spending authority, or permission for an external write. Each needs its own policy for unavailable evidence.

Aliases introduce another necessary distinction. A catalog row named `sonnet` may carry a complete `resolvedModel` ID. A saved complete ID should still match that listed option. Our alias control preserved that normal path.

## Discovery, eligibility, and adoption ask different questions

[MCP Server Cards proposal #2127](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127) makes a related design choice: static cards describe remote identity, connection details, and protocol versions, while omitting dynamic tool and capability claims. Its text was marked Final while its PR remained open; it is an optional extension-track proposal.

The implementations address different boundaries. MCP concerns pre-connection discovery; Orca concerns a particular model-setting operation. Both nevertheless expose the risk of letting a stored declaration answer a present-tense capability question.

A listed model still leaves account eligibility and actual provider adoption unresolved. The current credential may lack entitlement. A successful setter call may not establish useful execution. Catalog membership, setter return, and successful inference are different observations. This study tested the first check's effect on whether a write was attempted.

The comparison suggests a next experiment: find an inspectable observation of actual adoption. Would model-usage metadata from a successful turn suffice, or is a more direct provider confirmation needed? The upstream report notes that even an invalid model can appear in the init frame, so an echoed ID alone is insufficient. A live experiment could compare the requested model, initialization information, and model records from successful turns to test their agreement and whether fallback is observable. We have not run that experiment or established a silent-fallback defect.

## Preserve intent while allowing preferences to expire

For an agent client, begin with three acceptance categories: restore normally when current catalog evidence supports the choice; prevent the write and explain the skipped preference when it excludes the choice; follow an explicit compatibility policy when evidence is unavailable. Add controls for aliases versus resolved IDs and interactive changes versus startup restoration.

For CodeFlowMu/FCoP, this contract is now development-review input. Product review still needs to locate current Host catalog retrieval, account eligibility checks, adoption evidence, and explanations for skipped settings. We have not established a corresponding product defect or prescribed a new capability-snapshot table as the solution.

Useful restoration preserves user intent while recognizing that the environment can change. Yesterday's choice is a candidate. Today's applicable evidence determines what can still be used.

The [evidence package](../research/evidence/2026-09-11-current-authority) includes scripts, all sixteen observations, and limitations. Materials are maintained in the [research repository](https://github.com/joinwell52-AI/joinwell52).
