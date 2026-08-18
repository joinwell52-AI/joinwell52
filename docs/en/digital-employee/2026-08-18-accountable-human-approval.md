---
title: "A User-Role Reply Is Not Yet a Human Approval"
date: '2026-08-18'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "What must an agent runtime know before it may treat a syntactically valid user-role response as an accountable human approval?"
summary: "Agent runtimes should not equate user-role syntax with approval authority. A same-day Google ADK change shows how receiver-owned origin provenance can fail-close a remote A2A approval class before confirmation matching, while leaving positive human authentication and authorization as separate requirements."
sources:
  - research/analysis/Q-20260818-01-accountable-origin-human-approval.md
item_id: "Q-20260818-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-18-accountable-human-approval-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-18-accountable-human-approval-cover.png"
  kicker="Digital Employee · Daily Research"
  title="A User-Role Reply Is Not Yet a Human Approval"
  summary="Agent runtimes should not equate user-role syntax with approval authority. A same-day Google ADK change shows how receiver-owned origin provenance can fail-close a remote A2A approval class before confirmation matching, while leaving positive human authentication and authorization as separate requirements."
  version="Q-20260818-01"
  status="Daily Runtime V5 · 2026-08-18"
  languageHref="/zh/digital-employee/2026-08-18-accountable-human-approval"
  languageLabel="中文"
/>

# A User-Role Reply Is Not Yet a Human Approval

A dangerous tool call can be waiting for a human confirmation while a remote agent sends a perfectly valid `user`-role response. If the runtime asks only “does this look like a confirmation?”, the remote peer can enter a trust decision through the same syntactic door as the human.

A merged Google ADK change on 2026-08-18 addresses one concrete version of that problem. A2A-originated invocations are now marked by the receiving side with `a2a_metadata` even when the peer supplies no metadata, and the changed confirmation processor returns before matching confirmation events whenever that marker is present. Regression tests cover both metadata-present and no-metadata A2A requests.

The evidence supports a narrow architectural conclusion: **message role is content semantics; accountable approval is an authorization event with provenance.** Those two facts should not share one field.

## `role=user` answers the wrong question

The `user` role can tell a model or runtime how to interpret a message. It does not, by itself, identify the principal that produced the message or prove that the principal is authorized to approve this operation.

That distinction matters most when different transports can produce syntactically similar content. A browser session, an internal service, a remote A2A peer and a later authenticated human step may all be able to create data that reaches the runtime as user-originated content. Treating the role as authority collapses message semantics and actor provenance.

The ADK change demonstrates the negative side of the separation. The receiver writes the A2A origin marker; its existence does not depend on a field the remote peer may omit. A remote peer therefore cannot make the tested approval path look local simply by sending an empty metadata object.

## Provenance qualification should happen before approval matching

The placement of the guard is as important as the marker. The confirmation processor checks A2A origin before normal confirmation-event resolution. In the demonstrated path, a remote `FunctionResponse` reporting `confirmed=True` is not allowed to reach the matching logic for the pending human confirmation.

This ordering suggests a general control pattern:

1. qualify the response origin using provenance established by the receiving system;
2. reject origin classes that are not eligible to satisfy this approval gate;
3. only then evaluate the semantic content against the pending approval occurrence;
4. for an allowed positive path, authenticate the principal and verify its authorization scope.

The first two steps are not proof of the last two. A runtime can correctly reject remote-agent approvals and still have a weak human channel. The evidence therefore supports a fail-closed origin boundary, not a claim of complete HITL security.

## An approval record needs more than a message

For consequential actions, a durable approval record is stronger when it preserves several identities separately:

- **content role** — how the message should be interpreted;
- **transport origin** — which trust domain delivered it;
- **principal identity** — who or what actually approved;
- **authorization scope** — which operation that principal was allowed to approve;
- **approval occurrence identity** — the exact pending action, version and time window to which the decision applied.

The selected implementation directly demonstrates only the origin-class rejection. The five-part model is the Research Center's bounded engineering interpretation of what a fuller accountable approval chain needs.

Keeping these identities separate also makes legitimate machine delegation clearer. A machine may be authorized to approve a narrow class of low-risk operations, but that is a delegated machine principal—not a “human” because it can emit user-role content. The audit surface should preserve that difference.

## The negative gate does not authenticate the positive channel

The merged code and tests do not establish who the eventual human approver is, whether the approval is fresh, whether it can be replayed, which device or session produced it, or whether every alternate transport and HITL processor carries equally strong provenance. The marker is not cryptographic provenance and the repository tests are not an independent security evaluation.

That boundary prevents a common reasoning error: “remote A2A confirmation is rejected, therefore accepted confirmation must be a real authorized human.” The conclusion does not follow. Negative origin qualification and positive principal authorization are separate evidence requirements.

The remaining design questions are therefore concrete rather than rhetorical. What durable identity binds the human decision to one dangerous-tool occurrence? How are expiry and replay handled? Which other transports can construct confirmation responses? How should intentionally delegated non-human approvers be modeled? A safe approval path begins by asking where the response came from—but it becomes accountable only when the runtime can also say who approved what, under which authority, and for exactly which occurrence.

**Primary evidence:** [Google ADK merged commit 9e9eaa69](https://github.com/google/adk-python/commit/9e9eaa69bdcc16f004af9c63f40f1dae6404c29b). The code and repository tests are public primary-source evidence; they are not independent validation of complete HITL security.
