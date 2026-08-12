---
title: "The User Clicked ‘Always Allow.’ What Did the System Actually Save?"
date: "2026-08-12"
column: "industry-architecture"
category: "daily"
article_type: "technical-analysis"
edition: "research-center"
research_question: "How should an approval architecture unify decision vocabulary without conflating a user's requested consent scope with the policy state that was actually applied?"
summary: "A shared approval type can carry user intent without proving that policy took effect at the same scope. Governed approval records need both the requested decision and the effective outcome."
sources: "https://github.com/openai/codex/commit/67afc7967463282af932be1984df9e16cc55ed99; research/analysis/Q-20260812-02-decision-intent-effective-policy.md; research/reading/Q-20260812-02-reviewdecision-mcp-policy-amendment.md"
item_id: "Q-20260812-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-12-consent-effective-policy.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-12-consent-effective-policy.png"
  kicker="Industry Architecture · Daily Research"
  title="The User Clicked ‘Always Allow.’ What Did the System Actually Save?"
  summary="A shared approval type can carry user intent without proving that policy took effect at the same scope. Governed approval records need both the requested decision and the effective outcome."
  version="Q-20260812-02"
  status="Daily Runtime V5 · 2026-08-12"
  languageHref="/zh/industry/2026-08-12-consent-effective-policy"
  languageLabel="中文"
/>

# The User Clicked “Always Allow.” What Did the System Actually Save?

An approval UI offers three choices: allow once, allow for this session, and always allow. The user chooses the third option, the tool runs, and the audit trail retains one value: `ApprovedMcpPolicyAmendment`.

That value establishes cross-session intent. It does not yet tell an operator whether policy was written, what future calls it matches, or whether an unavailable persistence key turned the result into session-only memory.

The selected [OpenAI Codex change](https://github.com/openai/codex/commit/67afc7967463282af932be1984df9e16cc55ed99) moves MCP approvals onto shared `ReviewDecision`, preserves current-call, session and persistent-policy outcomes, and rejects the MCP-only decision fail-closed if it reaches unrelated Shell, Command or Network approval paths. It solves fragmented vocabulary while exposing a second boundary: **a shared decision value is control intent, not a receipt proving effective policy.**

## “Always allow” passes through three gates

The path from user choice to durable policy contains at least three different semantics:

| Stage | Question | What can change the answer |
|---|---|---|
| Requested decision | What scope did the user request? | UI choice, Guardian, or another decision source |
| Normalized decision | What does this domain and approval mode permit? | Domain legality, mode constraints, enterprise policy |
| Effective policy | What was actually stored or remembered? | Persistent key, session key, storage outcome and revision |

The source shows that approval-mode normalization may narrow session or persistent scope to ordinary `Approved`; a missing persistent key may also fall back to session memory. “The user selected always allow” and “the system stored cross-session policy” therefore require separate evidence.

## Shared types unify language, not authority

Private enums keep local meaning obvious but force UI, hooks, Guardian and audit layers to translate every tool family. Shared `ReviewDecision` provides a common control vocabulary while retaining rejection reasons, timeout, cancellation and approval scope.

A variant existing in the shared sum type does not authorize every consumer to interpret it. When an MCP policy decision reaches command execution, the safe result is not “it starts with Approved”; it is a semantic-domain mismatch and a decline.

The protocol needs two forms of stability at once: common transport vocabulary and a domain-specific legal-value set at every adapter. The first without the second turns interoperability into authority leakage.

## An audit record needs two answers

Where normalization, downgrade or asynchronous persistence can occur, a single `decision` field is insufficient:

```yaml
requested_decision: approved_mcp_policy_amendment
effective_scope: session
normalization_reason: persistent_key_unavailable
policy_revision: null
persistence_outcome: downgraded
```

The first two fields separate intent from realized capability; the reason explains the divergence; the revision or durable acknowledgement establishes what the policy store actually did.

This is not logging for its own sake. It prevents both a temporary approval being reported as persistent policy and a user believing policy was saved only to be prompted again in the next session.

## Fail-closed matters most at semantic mismatches

Conventional checks ask whether a decision is Allow or Deny. A shared control plane has another failure mode: an Allow that is meaningful in domain A arrives at domain B and is mistaken for B's own Allow.

Adapters should therefore validate actor, resource and effect—not string prefixes. Unknown variants, MCP-only variants in generic tool paths, and missing policy keys need explicit rejection or downgrade facts. Denial, timeout and cancellation should also remain separate audit outcomes; they imply different retry and responsibility semantics even when none authorizes execution.

## Dual records are not a tax on every approval

For one-shot synchronous approval with no possible scope conversion, requested and effective decisions may be identical. If every consumer knows the domain and persistence completes in the same transaction, one decision can be adequate.

Dual records become necessary when at least one divergence point exists: policy can narrow scope; persistence can be asynchronous, fail or downgrade; domains share one type; or audit must explain cross-session behavior. Omitting effective scope in those conditions is not simplification—it removes the fact that determines what was actually authorized.

## Acceptance must not stop at “the user consented”

A useful conformance suite should exercise four counterexamples: a persistent request normalized downward, a missing persistent key, an MCP-only decision delivered to a shell path, and policy storage failing after the decision is accepted. Every result should expose requested decision, normalized decision, effective scope and persistence outcome.

The source does not establish a complete matching, revocation, enterprise-override, concurrent-update or synchronization model, and it is not an independent security reproduction. The bounded architectural conclusion is narrower: **shared approval vocabulary expresses intent; domain adapters decide whether the meaning is legal; effective scope and persistence need their own evidence.**

### Evidence and sources

- **What the source shows:** the Codex protocol, implementation, and same-change tests distinguish approval outcomes and reject semantic-domain mismatches. This is checkable first-party evidence, not independent review.
- **What the source does not establish:** a complete policy matching, revocation, enterprise-override, concurrent-update, or synchronization model.
- **What this article proposes testing:** record requested scope, effective scope, and policy revision separately, then test whether the record improves auditability and failure explanation.

**References:**

- OpenAI Codex, [`67afc79` — Use `ReviewDecision` for MCP tool approvals](https://github.com/openai/codex/commit/67afc7967463282af932be1984df9e16cc55ed99), code commit with tests changed in the same commit boundary.
