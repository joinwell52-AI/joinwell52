---
schema: "publication-candidate-article/v2"
title: "Consent Is Not Policy: Why Approval Systems Need an Effective-Scope Acknowledgement"
date: "2026-08-12"
column: "industry-architecture"
category: "daily"
article_type: "technical-analysis"
edition: "research-center"
research_question: "How should an approval architecture unify decision vocabulary without conflating a user's requested consent scope with the policy state that was actually applied?"
summary: "A shared approval vocabulary can carry intent across components, but durable policy change is trustworthy only when effective scope and persistence outcome are separately observable."
sources: "research/analysis/Q-20260812-02-decision-intent-effective-policy.md; research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
cover: "./2026-08-12-consent-effective-policy-cover.svg"
---

![A bright consent seal passing through an aperture and emerging as a narrower effective-policy field](./2026-08-12-consent-effective-policy-cover.svg)

# Consent Is Not Policy: Why Approval Systems Need an Effective-Scope Acknowledgement

Approval protocols often improve as they converge on one shared decision vocabulary. A common type can simplify UI, audit logs, orchestration and adapter code. But the selected implementation change exposes a harder boundary: **the decision a user requests is not necessarily the policy state that the system can or does apply.** [Source basis: `research/analysis/Q-20260812-02-decision-intent-effective-policy.md`]

## What should a shared approval decision mean?

The evidence shows a shared `ReviewDecision` vocabulary that preserves distinct outcomes for the current request, session scope and an MCP policy-amendment path. That is useful normalization, but it is not universal permission to interpret every decision variant in every domain.

The implementation retains domain-specific guards. An MCP-only persistent decision is rejected fail-closed when it reaches unrelated command or generic approval paths. Approval-mode normalization can also reduce a requested broader scope to ordinary approval, and the absence of a persistent key can cause a persistence request to fall back to session memory.

Those behaviors establish a crucial separation: the shared decision value expresses **intent in a common control vocabulary**, while the actually effective authorization scope depends on the active policy mode, domain rules and available persistence mechanism.

## Shared vocabulary without shared semantics is dangerous

Tool-specific enums are easy to reason about locally because each value lives inside a narrow domain. Their weakness is fragmentation: UIs, audit pipelines and orchestration layers need translation logic for every tool family.

A single global enum solves the vocabulary problem but can create a worse semantic problem if every consumer assumes every value is valid everywhere. A persistent-policy decision that is meaningful for one MCP approval path may be nonsensical or unsafe in a generic command approval path.

The stronger architectural pattern is therefore not “one enum everywhere.” It is **one shared vocabulary plus fail-closed domain adapters**. The vocabulary improves interoperability; the adapters preserve local policy meaning.

## Requested consent and effective policy are different records

The selected evidence also shows why a decision value cannot, by itself, prove that durable policy was amended. A user may request a persistent scope, while normalization or missing persistence capability results in session-only behavior. The original user choice and the resulting system state are then different facts.

For auditability, an approval system should make that difference visible. A useful design hypothesis is to return both the requested decision and an **effective decision or effective scope** after normalization. When durable persistence was requested, the system could additionally return a policy revision, durable acknowledgement, or explicit downgrade/failure outcome.

That would let an audit record answer two separate questions:

- What did the user authorize or request?
- What authorization state did the system actually apply?

This recommendation is an architectural inference from the observed distinction; it is not a feature established by the source.

## Fail-closed adapters preserve domain meaning

The implementation's rejection behavior is important because shared types expand the space of values that can reach a boundary. Without domain validation, a consumer can accidentally give semantics to a decision that should never have been legal there.

Fail-closed adapters turn that ambiguity into an explicit error instead of an implicit permission. The same principle applies to non-approval terminal outcomes. Denial, timeout and cancellation should remain distinguishable in audit evidence rather than collapsing into a generic `false`, because they describe different governance events and often require different recovery behavior.

This yields four general implications for agent approval architecture:

1. current-call consent, session consent and persistent policy amendment should be modeled as distinct scopes;
2. user intent and effective policy state should be recorded separately when they can diverge;
3. persistence should expose success, downgrade or failure independently of the original choice;
4. shared control-plane types should be validated at every domain adapter boundary.

## What the evidence does not establish

The available Reading Result does not define a complete persisted-policy model for matching, revocation, synchronization or conflicts. It contains no independent security review or reproduction. It also does not establish that every requested persistent amendment is durably written.

For simple one-shot approvals, returning requested and effective fields may add unnecessary protocol complexity. A single decision value can be sufficient when the transport and consumer both know the domain and synchronously know the persistence outcome. The dual-record model matters most when consent scope can be normalized, downgraded, persisted asynchronously or interpreted across component boundaries.

## Questions that remain open

A production-grade policy architecture still needs explicit answers for policy-store acknowledgement, revision identity, enterprise overrides, concurrent amendments and revocation. It also needs a user-visible representation for the case where persistent consent was requested but only session scope became effective.

The bounded conclusion is therefore architectural rather than universal: **shared approval vocabularies are most trustworthy when they represent decision intent, while effective policy scope is acknowledged separately and semantically invalid decisions are rejected fail-closed.**
