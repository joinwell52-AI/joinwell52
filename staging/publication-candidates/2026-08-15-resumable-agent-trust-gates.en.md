---
schema: publication-candidate-article/v2
title: "Resumable Agents Need Separate Trust Gates for History, Protocol State, and Approval"
date: '2026-08-15'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What trust boundaries must a resumable digital employee enforce when it imports prior history and later accepts a human confirmation for a tool action?"
summary: "Resumability is safer when imported history, runtime-owned protocol state, action-occurrence binding, and human authorization are treated as different trust decisions. A recent ADK implementation demonstrates selective history admission and strong occurrence matching, but it does not establish confirmer authorization or trusted provenance for ordinary imported history."
cover: staging/publication-candidates/2026-08-15-resumable-agent-trust-gates-cover.png
sources:
  - research/analysis/Q-20260815-01-protocol-state-admission-human-authorization.md
  - research/reading/Q-20260815-01-trusted-session-initialization-hitl-confirmation-boundary.md
---

![Resumable Agents Need Separate Trust Gates for History, Protocol State, and Approval cover](staging/publication-candidates/2026-08-15-resumable-agent-trust-gates-cover.png)


# Resumable Agents Need Separate Trust Gates for History, Protocol State, and Approval

A resumable agent has to do something that a short-lived assistant can often avoid: accept state from the past and decide what that state is allowed to mean now. Conversation history may be imported after a restart. Tool calls may be reconstructed. A later human confirmation may refer to an action that originated before the current session existed.

The dangerous shortcut is to treat all of those facts as one trust decision. If history was accepted, the runtime may be tempted to treat it as authoritative protocol state. If a confirmation is structurally valid, the runtime may be tempted to treat it as authorized approval. Those implications do not follow.

The 2026-08-15 research object examined a merged Google ADK change that validates client-supplied initialization events before session creation and later resolves human-in-the-loop confirmations against an existing historical tool occurrence. The evidence is bounded implementation evidence from maintainer code and tests, not an independent security evaluation. Within that boundary, it exposes a useful architecture: **history admission, protocol-state admission, occurrence binding, and approver authorization are separate controls.**

## Imported history is data before it is authority

A resumable system needs prior history to remain useful. Rejecting every imported event would make recovery simple, but it would also destroy legitimate continuity. The selected implementation takes a narrower approach: ordinary text and ordinary tool history can still be admitted, while framework-owned runtime markers, non-default runtime actions, and reserved HITL protocol function calls are rejected during initialization.

That distinction matters because a stored event can describe what a client claims happened without automatically becoming something the runtime itself is allowed to assert. Framework-owned protocol state has stronger consequences than ordinary conversational history: it can influence pause, resume, approval, and execution flow. Its mutation surface should therefore be smaller.

The general engineering implication is to attach an explicit provenance or evidence class to imported history. An imported event may be useful context while still remaining weaker than runtime-generated state. A system that preserves that distinction can recover useful context without letting arbitrary historical input manufacture execution authority.

## Validate before durable state is created

The selected change performs validation before creating the session from the supplied initialization events. That ordering is important. If untrusted protocol state is first persisted and only repaired afterward, the runtime has already admitted a potentially authoritative fact into durable state.

Validation-before-persistence narrows the failure surface. The same principle applies beyond one framework: whenever imported or reconstructed data can influence control flow, the runtime should decide what class of state it is allowed to become before making that state durable.

This does not require every historical field to be cryptographically verified. Risk can be tiered. Low-impact conversational history may be accepted with weaker provenance, while runtime-owned markers, approval state, and execution-control events can require much stricter admission rules.

## Occurrence binding solves reference integrity, not authorization

The confirmation side of the mechanism enforces a different boundary. A confirmation must use the framework-owned confirmation function and must resolve to a real historical original tool call. The occurrence identity, owning agent, registered tool, confirmation requirement, tool name, and arguments are checked against that original occurrence.

This is stronger than accepting a payload merely because it has the right shape or contains a familiar request identifier. Two tool calls can look similar while representing different actions. Binding a confirmation to the exact historical occurrence prevents one class of substitution in which approval semantics are borrowed by the wrong action.

But reference integrity is not authorization. The mechanism can answer, “Does this confirmation refer to the correct historical tool action?” It does not, by itself, answer, “Was the person who confirmed it entitled to authorize that action?”

Those questions belong to different control planes. Action identity is about what is being approved. Approver identity and role evidence are about who may approve it. A reliable digital-employee runtime needs both.

## A four-stage trust contract

A stronger recovery contract can be expressed as four explicit gates:

**history admission → protocol-state admission → action-occurrence binding → approver authorization**.

The first gate decides which historical records may enter the reconstructed context and at what provenance level. The second decides which records may become framework-owned control state. The third binds a later approval to the exact action occurrence it is intended to govern. The fourth determines whether the confirmer possesses the required identity, role, policy authority, or delegated approval right.

Keeping these facts separate improves auditability as well. An audit trail should be able to distinguish “historical event accepted,” “runtime protocol state admitted,” “confirmation matched to occurrence,” and “authorized approval accepted.” If they collapse into one generic “resume succeeded” event, later recovery cannot explain which trust decision actually justified execution.

## The missing layer is not a defect in the local mechanism

The selected ADK implementation does not authenticate the confirmer, establish an authorization level, cryptographically prove event provenance, or provide replay-proof or exactly-once resumption. It also deliberately continues to admit ordinary imported tool history.

Those limits should not be read as evidence that the local mechanism is wrong. They define its scope. A single-user application on a trusted network may intentionally delegate identity and authorization to a surrounding application. Strong provenance for every ordinary historical tool event may also be too expensive for low-impact workloads.

The architecture question is therefore not whether every runtime must implement the entire security stack internally. It is whether the trust boundary is explicit. If identity is external, the runtime should know which external authority supplies it. If ordinary history has weaker provenance, policy should not silently upgrade it into authoritative execution state.

## Engineering implications

For long-lived agents and digital employees, several design rules follow from the evidence and its limits.

Imported history should carry a provenance class instead of automatically inheriting runtime authority. Runtime-owned control markers, pause/resume protocol calls, and approval state should have a narrower write path than ordinary dialogue. Approval records should bind action identity and approver authority separately. Recovery should validate control-relevant imported state before it creates or mutates durable execution state. Observability should record each trust decision as its own fact.

These rules are useful even when the underlying mechanism is simpler than ADK. The exact data structures can vary; the semantic separation should not.

## Limits of the evidence

The evidence covers one merged ADK implementation and its regression tests. It is public primary-source implementation evidence, not independent validation of a general security architecture for resumable digital employees. The selected change does not validate every possible initial-state field and intentionally admits ordinary tool history.

No evidence here establishes user authentication, role authorization, cryptographic provenance, replay resistance, distributed recovery, or exactly-once external effects. Those remain separate requirements.

## Open questions

What provenance level should imported ordinary tool history carry so later policy can distinguish client-replayed data from runtime-generated evidence? What identity and role evidence should accompany a human confirmation before a high-risk action is re-admitted? And how should an approval occurrence identity survive durable restart without allowing the confirmation itself to be replayed?

Resumability is not one permission. It is a sequence of trust decisions. Making those decisions explicit is what lets a system recover state without accidentally recovering authority it never earned.
