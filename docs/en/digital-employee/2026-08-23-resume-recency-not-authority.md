---
title: "Resume Recency Is Not Resume Authority"
date: '2026-08-23'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When a digital employee resumes after a human interruption, how should reconstructed operator evidence be ordered relative to regenerated or synthetic context?"
summary: "A merged Google ADK change shows why resumed agents need occurrence-scoped evidence precedence before model interpretation. Preserving the operator response prevents one shadowing failure, but it does not authenticate the operator or guarantee exactly-once effects."
sources:
  - research/analysis/Q-20260823-01-resume-evidence-authority.md
item_id: "Q-20260823-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-23-resume-recency-not-authority-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-23-resume-recency-not-authority-cover-v2.png"
  kicker="Digital Employee · Daily Research"
  title="Resume Recency Is Not Resume Authority"
  summary="A merged Google ADK change shows why resumed agents need occurrence-scoped evidence precedence before model interpretation. Preserving the operator response prevents one shadowing failure, but it does not authenticate the operator or guarantee exactly-once effects."
  version="Q-20260823-01"
  status="Daily Runtime V5 · 2026-08-23"
  languageHref="/zh/digital-employee/2026-08-23-resume-recency-not-authority"
  languageLabel="中文"
/>

# Resume Recency Is Not Resume Authority

A human resolves an interruption. The workflow resumes. Then the runtime appends a synthetic copy of the original input after the real response. To a model reading an ordered conversation, the newest user-role event can look like the operative instruction—even though it is the least authoritative event in the sequence.

That was the failure boundary addressed by a Google ADK change merged on 2026-08-23. ADK reconstructs user `FunctionResponse` events tied to known interruption identifiers and carries them into child context as `resume_inputs`. For workflow-wrapped single-turn agents, the input-preparation path now returns early when those inputs are present, instead of appending another synthetic user event.

The narrow mechanism supports a broader engineering proposition: **resume should preserve a monotonic, occurrence-scoped evidence order before model interpretation.** Once an operator response has been admitted for a specific interruption, regenerated context must not silently outrank it because it was written later. This is evidence continuity—not proof of operator identity, approval freshness or exactly-once execution.

## A later event can be less authoritative

The defect was not merely duplicate text. Duplication became dangerous because the events carried different meanings. The persisted `FunctionResponse` was the response to an identified interruption. The later synthetic event was a wrapper-generated copy of earlier node input. Treating both as interchangeable user prose let append order substitute for an authority rule.

ADK's resume path already had richer structure. It scans persisted session events, recognizes responses associated with known interrupt IDs, optionally validates their response schema and reconstructs them as resolved inputs. Explicitly supplied resume inputs can also participate. The resulting mapping therefore represents a continuation lineage that a generic regenerated message does not share.

The maintainer described repeated human confirmation as the visible failure: synthetic input could shadow the real response and send the agent back through confirmation. The merged regression verifies the decisive condition with a representative non-empty `resume_inputs` mapping. It does not run a complete persisted tool-confirmation loop, so the evidence supports the input-admission mechanism rather than every end-to-end HITL guarantee.

## Enforce precedence before model interpretation

Once conflicting events have entered model context, a system has already delegated precedence to probabilistic interpretation. It may add explanatory prose, sort messages or ask the model to infer that one response is authoritative, but each option leaves the conflict present.

Suppressing the lower-authority reconstruction earlier is cleaner. The runtime can use interruption identity and resume state—facts it knows deterministically—to decide which events are eligible for context assembly. This turns precedence from a conversational convention into an admission invariant.

The rule should remain occurrence-scoped. “Older evidence always wins” would be wrong: an operator may intentionally issue a new instruction that supersedes an earlier response. A robust interface should represent that supersession explicitly and bind it to the affected interruption. Otherwise a legitimate override and an accidental synthetic append are indistinguishable in the audit trail.

For resumable digital employees, this suggests typed resume inputs that carry an occurrence identifier, evidence class and relation to any superseded response. Regression tests should examine ordering and lineage, not only whether the response value survived serialization.

## Evidence continuity is not authorization

Preserving the response's position answers one question: which evidence should the resumed model consume for this interruption? It does not answer several others.

The system still needs an authenticated principal if the identity of the approver matters. It needs freshness and revocation rules if approval can expire. It needs scope if the response authorizes only one tool call or resource. And it needs effect-level idempotency or reconciliation if a retry could repeat an external action.

Keeping these controls separate prevents a common guarantee inflation. A workflow that no longer repeats its confirmation prompt has fixed an important continuity bug. It has not thereby established exactly-once approval or exactly-once effects. The public evidence is one merged implementation and its tests, not an independent cross-framework evaluation.

Low-risk systems may reasonably choose a lighter fresh-turn design. The relevant question is proportionality: if an action is sensitive enough to require human interruption, the runtime should be able to show which occurrence was answered, which evidence was admitted, who was authorized to answer, and what effect consumed that authorization.

## The guard is narrow, and the boundary matters

The new condition checks whether any resume input exists. Its simplicity prevents the demonstrated synthetic append, but several interruption channels could share one context. An unrelated resume input might then suppress regeneration for a node whose input should still be produced. The selected evidence does not settle that case.

The next useful test is therefore not a larger claim. It is a complete persisted HITL loop that records an interruption, accepts a real `FunctionResponse`, resumes, proves that confirmation terminates, and separately records operator identity and downstream effect handling. Passing that test would extend the evidence surface; it would still need explicit scope before supporting a general guarantee.

**Primary evidence:** [Google ADK merged commit e753651b](https://github.com/google/adk-python/commit/e753651b7df26febe00bde2cb043225e644cd207). The code and regression support the bounded resume-input behavior described here; they are not independent validation of universal HITL safety.
