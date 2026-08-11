---
title: "Connector Actions Need a Governed Authority Handoff"
date: "2026-08-11"
column: "industry-architecture"
category: "daily"
summary: "Connector-mediated actions should distinguish observed availability, action eligibility, user or role authorization, provider submission, provider-confirmed outcome and post-handoff custody instead of collapsing them into one tool-call status."
sources:
  - "research/analysis/Q-20260811-02-connector-action-handoff.md"
  - "research/reading/Q-20260811-02-restaurant-reservation-action-handoff.md"
item_id: "Q-20260811-02"
lifecycle: "Published"
source_research_object: "research/analysis/Q-20260811-02-connector-action-handoff.md"
source_reading_result: "research/reading/Q-20260811-02-restaurant-reservation-action-handoff.md"
cover: "/assets/covers/daily-2026-08-11-governed-connector-action-handoff.svg"
visualization: "/assets/covers/daily-2026-08-11-governed-connector-action-handoff-figure.svg"
visualization_decision: "Required — editorial handoff metaphor plus a separate authority-stage figure"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
outline: deep
---

# Connector Actions Need a Governed Authority Handoff

An agent can observe a live opportunity without owning the transaction that follows. Restaurant reservation support in ChatGPT makes this boundary unusually visible: recommendation, live availability, action eligibility, booking submission and the authoritative reservation record belong to different stages and, in some cases, different systems.

## Cover

![Governed connector handoff editorial cover](/assets/covers/daily-2026-08-11-governed-connector-action-handoff.svg)

## Figure

![Connector action authority-handoff figure](/assets/covers/daily-2026-08-11-governed-connector-action-handoff-figure.svg)

## Summary

Official OpenAI documentation states that ChatGPT can surface restaurant reservation availability from supported providers and can expose a Reserve action when a restaurant is matched to a supported reservation listing. The booking flow still allows the user to review or change details before the reservation is placed, and after booking the third-party provider remains the authoritative system for confirmation, modification and cancellation.

The Research Center judgment is that connector actions should be modeled as an **authority handoff**, not as a single `tool_call -> success` event. A useful action lifecycle distinguishes at least: `Observed Availability → Action Eligibility → Authorization → Provider Submission → Provider-confirmed Outcome → External Custody`.

## Source

Primary evidence comes from official OpenAI documentation:

- ChatGPT release notes: https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- ChatGPT Search help: https://help.openai.com/en/articles/9237897-chatgpt-search

The Reading Result records the August 10, 2026 reservation rollout and the documented Reserve-button, user-review, provider-confirmation and post-booking ownership boundaries. Production does not infer undocumented connector protocols or API guarantees.

## Observation

The documented flow separates recommendation from action. A restaurant can be recommendable even when ChatGPT cannot match it to a supported reservation provider, in which case the Reserve action is not exposed. Availability is also explicitly time-sensitive, so a displayed slot is an observation rather than a durable commitment.

When Reserve is available, the user enters a booking flow and can adjust details before placement. After the reservation is placed, ChatGPT does not keep the booking as the authoritative record. Confirmation, modification, cancellation and provider-account issues remain with the external reservation service.

The product surface is itself a policy input. The release applies to supported ChatGPT surfaces and explicitly excludes ChatGPT Work, demonstrating that execution eligibility depends on more than model capability alone.

## Comparison

| Stage | Authoritative question | Typical authority | Evidence class |
|---|---|---|---|
| Availability observation | “Is a slot visible now?” | Reservation provider data surfaced through ChatGPT | Official product documentation |
| Action eligibility | “Can this result expose Reserve?” | Product/provider match + surface policy | Official documentation |
| Authorization | “May this booking be submitted?” | User review or explicit role policy | Official documented user flow + Research Center generalization |
| Provider submission | “Was the request sent to the provider?” | Connector / provider boundary | Research Center architecture model; protocol undisclosed |
| Provider-confirmed outcome | “Did the provider accept the transaction?” | Reservation provider | Official support/confirmation boundary |
| Post-booking custody | “Who can modify or cancel later?” | Reservation provider | Official documentation |

## Discussion

A connector platform becomes unsafe when it treats every successful tool response as a business outcome. A tool can return current availability without reserving anything. It can open an action surface without the user having authorized submission. It can submit a request without yet receiving provider-confirmed acceptance. And once a provider owns the record, the assistant should not imply it can later modify or cancel that transaction unless a separate governed capability exists.

This suggests two complementary controls. First, each side-effecting skill should publish a machine-readable **authority descriptor**: observe, propose, submit and lifecycle-manage are different permissions. Second, every cross-system action should produce a handoff receipt that records the external provider, the internal occurrence identity, submitted parameters, provider confirmation or error reference and the current custody owner.

The system-of-record boundary should be explicit in the UI as well. “Available,” “actionable,” “submitted” and “confirmed” must not collapse into the same status badge.

## Engineering Impact

For Digital Employees, side-effecting connector skills should declare whether they are read-only, proposal-only, submit-capable or authorized for later lifecycle management. Human confirmation or role policy should sit directly at the transition to provider submission.

For CodeFlowMu, external connector actions should be represented as governed TASK/tool transitions with separate internal task IDs and provider transaction IDs. Runtime timelines should preserve candidate, actionable, submitted and confirmed states so a visible opportunity cannot be mistaken for a completed business action.

For TMPA, this is useful research evidence for authority transfer, custody and cross-system evidence semantics. The current product documentation, however, does not define a generic connector protocol suitable for direct standardization.

## Boundaries and uncertainty

The official sources do not disclose the connector API, authentication model, caching strategy, freshness SLA, duplicate-submit protection, payment or deposit handling, provider-login flow or consistency guarantees. The product documentation therefore establishes user-visible authority boundaries, not a complete transactional protocol.

## Future Work

A general agent runtime should define the minimum handoff receipt for an external action and specify how stale availability is revalidated immediately before submission. It should also define provider selection when one business can be represented by multiple providers, and which Digital Employee roles may propose, submit, modify or cancel transactions without a human confirmation step.

## Visualization note

The cover uses two authority domains and one crossing transaction token as an editorial metaphor. The body figure separately shows the full six-stage handoff lifecycle with bilingual terminology. Both assets are Research Center originals and contain no invented quantitative data.

## References

1. OpenAI, ChatGPT release notes, August 10, 2026 reservation availability update: https://help.openai.com/en/articles/6825453-chatgpt-release-notes
2. OpenAI, ChatGPT Search help, Reserve action and reservation-flow documentation: https://help.openai.com/en/articles/9237897-chatgpt-search
3. Research Center Research Object: `research/analysis/Q-20260811-02-connector-action-handoff.md`
4. Research Center Reading Result: `research/reading/Q-20260811-02-restaurant-reservation-action-handoff.md`

> Publication status: Released after the Publication gate; article content is unchanged from the completed Production Candidate.
