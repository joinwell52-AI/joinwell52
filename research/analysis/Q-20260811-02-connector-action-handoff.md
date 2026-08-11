---
schema: "research-analysis/v1"
id: "AN-20260811-02"
date: "2026-08-11"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260811-02"
column: "industry-architecture"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260811-02-restaurant-reservation-action-handoff.md"
output_contract: "Research Object"
research_object: "Connector Action Handoff and External Transaction Authority"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Connector Action Handoff and External Transaction Authority

## Governed scope

Skill 04 analysis using only the completed 2026-08-11 Reading Results, with Q-20260811-02 as the primary Industry Architecture object. No new external research, article drafting, visualization, or publication work is introduced.

## Analysis

```yaml
analysis:
  observations:
    - ChatGPT can surface live restaurant reservation availability from supported third-party providers, but a Reserve action appears only when a restaurant can be matched to a supported provider listing.
    - Selecting Reserve opens a booking flow where the user can review or alter booking details before the reservation is placed.
    - ChatGPT does not retain the completed reservation as the authoritative record; confirmation, later modification, cancellation, and provider-account issues remain with the reservation provider.
    - Availability is time-sensitive and can change between display and booking; recommendation eligibility and transaction eligibility are therefore separate states.
    - Product-surface policy is explicit: restaurant reservation search is available on selected ChatGPT surfaces and excluded from ChatGPT Work.
  cross_comparison:
    - The ordered-work reading separates work arrival from execution authority; the reservation flow makes the same separation at the action layer by distinguishing recommendation from action eligibility and user-confirmed transaction handoff.
    - The analytics reading shows why a handoff needs durable identity and terminal evidence: without an occurrence id and explicit terminal receipt, consumers can confuse a displayed opportunity, an initiated flow, and a completed external transaction.
  discussion:
    - Connector-mediated actions create a multi-authority system. The assistant may own intent interpretation and orchestration, while the provider owns live availability and the final transaction record.
    - A live availability result is an observation with freshness risk, not a durable promise. The action layer therefore needs a revalidation or provider-confirmation boundary before treating a slot as committed.
    - Action eligibility should be explicit and machine-readable. A useful object can be recommendable while remaining non-actionable because provider matching, region, product surface, authentication, or policy does not permit execution.
    - Post-handoff custody matters as much as pre-handoff permission. Once the provider becomes system of record, the assistant should not imply authority to modify or cancel unless a new governed connector action explicitly grants it.
  research_judgment:
    - Agent platforms should model connector actions as a governed handoff with distinct states for observed availability, action eligibility, user/role authorization, provider submission, and provider-confirmed terminal outcome.
    - The authoritative system of record must be explicit for each stage. Assistant-visible state can guide action, but transaction truth should remain with the external provider unless the platform has a documented persistence and lifecycle contract.
    - Product surface, region, identity, consent, and provider matching are execution-policy inputs rather than incidental UI details.
  engineering_impact:
    digital_employee:
      - Give each side-effecting skill an authority descriptor: read/observe, propose, submit, and lifecycle-manage are separate capabilities.
      - Require confirmation or role policy at the handoff boundary when the Digital Employee is not authorized for autonomous transaction submission.
      - Persist a handoff receipt containing provider identity, request occurrence id, submitted parameters, provider response/confirmation reference, and custody owner.
    codeflowmu:
      - Represent external connector actions as governed TASK/tool transitions rather than ordinary tool-return text.
      - Distinguish candidate/available/actionable/submitted/confirmed states in operation timelines so a UI cannot present availability as a completed action.
      - Keep provider-owned transaction identifiers separate from internal task ids and use them for later reconciliation or modification flows.
    tmpa:
      - Use this as research input for authority transfer, custody, and evidence semantics across organizational/system boundaries; the product documentation does not establish a generic connector protocol suitable for direct standardization.
  limitations:
    - Official product documentation describes user-visible behavior, not the connector protocol, authentication model, freshness SLA, transaction API, or consistency guarantees.
    - The evidence does not specify duplicate-submit protection, payment/deposit handling, provider-login behavior, or cancellation-fee governance.
    - Product-surface exclusion is documented but its underlying policy rationale is not.
  future_questions:
    - What minimum receipt proves that an external action was submitted once and accepted by the provider?
    - How should an agent revalidate stale availability immediately before transaction submission?
    - When multiple providers can represent one business, what rule selects the authoritative provider for one action attempt?
    - Which Digital Employee roles may propose, submit, modify, or cancel external transactions without human confirmation?
```

## Research judgment

Connector-mediated action is best modeled as a **governed authority handoff**, not as a single tool call. The assistant can observe and orchestrate, but live state, action eligibility, transaction submission, and post-booking custody may belong to different authorities. A production agent runtime should preserve those boundaries explicitly so it never confuses “I can show this action” with “I own this transaction.”

## Evidence boundary

- `research/reading/Q-20260811-01-ordered-local-work-queue.md`
- `research/reading/Q-20260811-02-restaurant-reservation-action-handoff.md`
- `research/reading/Q-20260811-03-durable-event-identity-terminal-evidence.md`
