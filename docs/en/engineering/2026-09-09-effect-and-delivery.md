---
schema: "publication-candidate-article/v2"
title: "The Action Finished, but Delivery Was Interrupted. Which Step Should Recovery Repeat?"
date: "2026-09-09"
published_date: "2026-09-09"
column: "open-source-engineering"
category: "daily"
article_type: "comparative-engineering-analysis"
edition: "research-center"
research_question: "The Action Finished, but Delivery Was Interrupted. Which Step Should Recovery Repeat?"
summary: "A committed-wake experiment shows why recovery can acknowledge delivery without waking again—and why acknowledgment still does not prove every result was read."
cover: "/assets/verification-evidence-20260909/04-effect-and-delivery.png"
language: "en"
lifecycle: "Published"
publication_authorized: true
evidence_status: "Bounded experiments; not independent QA; dependency substitutions disclosed"
pageClass: "verification-evidence-article"
sources:
  - "https://github.com/paperclipai/paperclip/pull/13063"
---

<ArticleCover image="/assets/verification-evidence-20260909/04-effect-and-delivery.png" kicker="Engineering · Experimental research" title="The Action Finished, but Delivery Was Interrupted. Which Step Should Recovery Repeat?" summary="A committed-wake experiment shows why recovery can acknowledge delivery without waking again—and why acknowledgment still does not prove every result was read." version="2026-09-09" languageHref="/zh/engineering/2026-09-09-effect-and-delivery" languageLabel="中文" />

<ArticleTableScroll language="en" />

<style>.verification-evidence-article .vp-doc h1[id] { display: none; }</style>

# The Action Finished, but Delivery Was Interrupted. Which Step Should Recovery Repeat?

An action has a recorded outcome. A continuation has been scheduled. The caller then loses its return before acknowledging delivery.

On recovery, should it repeat the action, wake the agent again, or merely finish the acknowledgment?

“Retries must be idempotent” is not yet an answer. Action completion, continuation scheduling, and delivery acknowledgment have different commit points. Recovery must identify which fact is missing.

## Separate lifetimes, connected responsibility

Paperclip organizes agent work and governed tool access. Its merged [PR #13063](https://github.com/paperclipai/paperclip/pull/13063) connects task approvals, recorded outcomes, and continuation through durable delivery records. We studied the delivery service at `7a2314c7fc610e4ee28babcaddb5c87912166dd5`, not the entire approval product.

The valuable design is positive: an outcome can remain available after the originating run ends. Recovery can complete a missing delivery step without reenacting all earlier work.

The author's reported native approval journey used a local MCP fixture; live Notion remained unverified. We preserve that boundary rather than presenting fixture integration as universal provider acceptance.

## A lost return after commit

Our harness loaded the complete original `toolActionDeliveryService` and supplied database-query and wakeup fixtures. The wakeup fixture first saved a committed record, then threw an exception.

The first delivery call stopped without acknowledgment. The second observed the committed wake, skipped a new wakeup call, and requested acknowledgment. Across both delivery attempts, wakeup was called once.

This is branch behavior under controlled persistence responses, not a database crash-recovery proof. We did not execute SQL, locks, or a process restart. Its value is narrower and concrete: the original service consults a committed fact instead of relying only on whether the previous call returned normally.

## Six controls

| Condition | Wakeup calls | Acknowledgment observation |
| --- | ---: | --- |
| Fresh delivery | 1 | One acknowledged |
| Committed wake already exists | 0 | One acknowledgment completed |
| Wakeup returns, but no committed row is found | 1 | No acknowledgment |
| Originating run remains active | 0 | Waits |
| Ten recorded outcomes | 1 | Eight inline; cutoff covers ten |
| Wake commits, throws, then delivery is retried | 1 across both attempts | Second attempt acknowledges |

Two process runs agreed on all six cases. The source also scopes queries by task, company, and agent relationships, but our fixture does not evaluate SQL predicates. These results do not establish database isolation.

Our first two exploratory runs failed the normal-case assertion because the query fixture consumed a response while constructing an unexecuted subquery. Deferring consumption until the query was awaited fixed the harness. Upstream code did not change. Those failures are retained as experiment-development history, not Paperclip defects.

## Acknowledged does not mean read

The ten-outcome control reveals a second distinction. The service inlines at most eight shortened results and includes a reference for the full set plus a committed cutoff. Acknowledgment can cover all ten referenced outcomes.

This controls context size and provides a recovery boundary. It does not prove that a new agent fetched the other two results, understood all ten, or completed the business task.

Reference delivery, content retrieval, and completed processing remain separate facts. If a product requires evidence that every omitted outcome was handled, that evidence must come from the continuation or acceptance layer.

## Repeat the missing step

A bounded principle follows: when a trustworthy commit fact already exists, recovery should complete the missing step before repeating earlier work.

The premise matters. An unknown action outcome cannot become failure merely because a response is absent. A wakeup that returned cannot count as committed when no corresponding record is found.

This delivery service has no provider-execution callback; it consumes existing outcomes. Our experiment therefore does not prove exactly-once external effects. Those require the action side's own identity and reconciliation contract.

The [evidence guide](https://joinwell52-ai.github.io/joinwell52/en/research/evidence/2026-09-09-verification-evidence) includes observations and dependency substitutions. This is a reproducible design comparison, not authorization to build a new recovery platform in CodeFlowMu.

Long work continues not only because an agent remembers a conversation, but because the system can distinguish a step already supported by evidence from one still awaiting acknowledgment.

