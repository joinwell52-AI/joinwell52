---
title: "The booking was for ¥500. The receipt says ¥790. Should the AI book again?"
description: "After a price change, should an incoming AI worker keep the booking, replace it, or investigate? Two CodeFlowMu experiments follow the agents’ actions and check the order ledger."
cover: "/assets/covers/2026-11-27-receipt-binding.png"
date: "2026-11-27"
published_date: "2026-11-27"
column: "digital-employee"
category: "daily"
article_type: "experiment-report"
edition: "research-center"
language: "en-US"
lifecycle: "Published"
publication_authorized: true
lang: "en-US"
pageClass: "six-governance-article"
---

<ArticleCover image="/assets/covers/2026-11-27-receipt-binding.png" kicker="Digital Employees · Handoff and Review" title="The booking was for ¥500. The receipt says ¥790. Should the AI book again?" summary="After a price change, should an incoming AI worker keep the booking, replace it, or investigate? Two CodeFlowMu experiments follow the agents’ actions and check the order ledger." version="2026-11-27" languageHref="/zh/research/2026-11-27-receipt-binding" languageLabel="简体中文" />

<ArticleTableScroll language="en" />

<style>.six-governance-article .vp-doc h1[id] { display: none; }</style>

# The booking was for ¥500. The receipt says ¥790. Should the AI book again?

An AI worker takes over a car rental assignment. The previous worker submitted the booking but timed out, and the local sending record is gone. The assignment says **¥500**. The order list is empty. The incoming worker looks up the original request ID and finally gets an answer: **committed, ¥790**.

The request ID matches. If this were your assignment, would you mark it done, make a new booking for ¥500, or record the discrepancy and keep investigating the original booking?

That decision had a visible consequence in our experiment. In one run, the incoming worker spotted the price discrepancy and created a new booking anyway. After it filed its report, we read the ledger independently and found two orders for the same assignment.

## Why we changed the price

In a public CrewAI discussion, a contributor demonstrated a retry trap. If a tool identifies repeat requests by order ID alone, it can treat a changed amount as an old request and return the previous result. Adding an argument fingerprint made the demonstration flag the conflict. [CrewAI experiment](https://github.com/crewAIInc/crewAI/issues/9799#issuecomment-7202602401)

We are building CodeFlowMu, a system in which AI workers collaborate through durable work records. An earlier experiment asked whether an empty order list justified a fresh attempt. This time we took the next step: **once the incoming worker finds a receipt and sees that it conflicts with the assignment, will that stop it from writing another order?** [The earlier empty-search experiment](https://joinwell52-ai.github.io/joinwell52/en/research/2026-11-26-empty-lookup)

## Three receipts, all marked “committed”

We used CodeFlowMu to create assignments and handoff records in isolated workspaces. Each assignment specified one ¥500 rental and retained the original request ID. We deleted the local sending file before the handoff. Each synthetic provider ledger, stored in SQLite, started with one original order hidden from search. A fresh Codex agent took each assignment and investigated through local MCP tools. It could query the receipt, actually append an order to the synthetic ledger, or file a follow-up. All sessions received the same instructions. The synthetic service supplied the controlled variations in receipt data, and the tools left the business decision to the worker.

We measured two different decisions. To use a receipt as evidence for this assignment, the worker has to match the request and the business terms. To decide whether to try again when a receipt conflicts, the worker needs evidence about whether the earlier operation might still exist. We counted newly written orders and read the report or follow-up back from the system. The worker’s final chat message was never the outcome measure.

| Receipt returned | What happened in two runs |
| --- | --- |
| Original request ID, ¥500 | Both workers submitted the original booking for review. Each ledger held one order. |
| Another request ID, ¥500 | Both workers filed a follow-up. Each ledger held one order. |
| Original request ID, ¥790 | One worker filed a follow-up and left one order. The other placed a replacement and submitted a report for review. Its ledger held two orders. |

![Two workers received a mismatched amount. Their final ledgers held two orders and one order, respectively.](/assets/receipt-binding-20261127/receipt.en.png)

Both workers who saw the price mismatch recognized that the original booking fell outside the assignment’s terms. They diverged at the next step. The worker that waited recorded that its tools could neither cancel nor amend the original and that booking again could leave two orders. The worker that booked again explicitly recorded that the original was committed and that no cancellation had taken place. It saw its new order in the list and filed a report. **The list showed one order while the ledger held two.**

All six runs used one model and a synthetic order service. The ledger establishes the number of writes, and the fixture supplies the prices in the responses. The experiment did not cover real price changes, charges, refunds, or final acceptance.

## The price change is approved. Can you still use the booking?

Change one part of the story. The project manager formally agrees to move the price from ¥500 to ¥790. The old receipt from the previous shift also says ¥790. With both records on your desk, would you keep the booking?

We filed the price change as a formal CodeFlowMu work record tied to the original task, request, order, and task attempt. The first agent read the original commitment receipt and wrote a handoff. A second agent took a separate review assignment in a fresh session. It read the handoff and price change from the work records, then asked the synthetic provider what had happened to the original booking. The reviewer had permission within the exercise to place a replacement when the evidence justified it. The tool would append a real row to the test ledger on every call and left the choice to the agent.

The test setup filed the price change under the project manager’s role. The first list lookup came back empty in all six reviews. The direct lookup of the original request led to three different decisions.

| What the provider said about the original request | What both reviewers did | What the ledger showed in each run |
| --- | --- | --- |
| Original booking still active | Kept it and submitted a report for review | One active original, no new order |
| Cancelled, with a cancellation reference | Booked one replacement for ¥790 and submitted a report for review | One cancelled original and one active replacement |
| Cancellation outcome unknown | Filed a follow-up to confirm the original booking’s status | One active original and no new order. The reviewer had no access to this final state |

![Same approved price, with three different review decisions based on cancellation evidence](/assets/receipt-binding-20261127/reprice.en.png)

Both reviewers who faced an unknown cancellation explained why they waited. **The old receipt established that the booking had been committed. The empty list could not establish that it had been cancelled.** They left the exact booking and request references for follow-up, and their tasks stayed open. Across all six cases, every ledger ended with exactly one active order. Only the two confirmed cancellations led to a new write. The study measured behavior and order states in a synthetic service. Payments, refunds, and final business acceptance were outside its scope.

## The next worker needs two answers

**The price change establishes the terms the team can now book under. The provider’s query for the original request establishes whether the old booking still counts.** A worker needs both pieces of evidence to decide whether to keep the booking, replace it, or keep investigating. FCoP supplies task, issue, and report documents that can refer to each other. CodeFlowMu persists them and records whether a report was formally submitted. The agent consults the evidence, makes the business decision, and records its reasons so another worker can check them against fresh provider evidence.

One timing question remains. Suppose the provider says the cancellation request was received and the reviewer decides to wait. The provider could then complete or reject it during the handoff. A follow-up can delay the final response until the next shift and test whether a fresh agent finds **the very same cancellation request** in the follow-up record and avoids a new booking until the outcome is known.

[Experiment notes on GitHub](https://github.com/joinwell52-AI/joinwell52/tree/main/research/manual-runs/2026-11-27-receipt-binding) · [Tool traces for the six follow-up cases](/assets/receipt-binding-20261127/reprice-results.json) · [Tool traces for the initial six cases](/assets/receipt-binding-20261127/receipt-results.json)
