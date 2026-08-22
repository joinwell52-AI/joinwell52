---
title: "Authorization Needs Provenance, Not Persuasive Wording"
date: '2026-08-22'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "When a delegated digital employee reaches a sensitive review point, what evidence should be allowed to carry user authorization across agent boundaries without letting forwarded or assistant-authored text impersonate authority?"
summary: "Role-preserving root-conversation evidence gives an agent reviewer a firmer basis than forwarded approval prose. It is still review evidence, not a durable authorization ledger or proof of a human principal."
sources:
  - research/analysis/Q-20260822-01-structured-authorization-evidence-channel.md
item_id: "Q-20260822-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-22-authorization-needs-provenance-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-22-authorization-needs-provenance-cover.png"
  kicker="Digital Employee · Daily Research"
  title="Authorization Needs Provenance, Not Persuasive Wording"
  summary="Role-preserving root-conversation evidence gives an agent reviewer a firmer basis than forwarded approval prose. It is still review evidence, not a durable authorization ledger or proof of a human principal."
  version="Q-20260822-01"
  status="Daily Runtime V5 · 2026-08-22"
  languageHref="/zh/digital-employee/2026-08-22-authorization-needs-provenance"
  languageLabel="中文"
/>

# Authorization Needs Provenance, Not Persuasive Wording

“The user approved this” can be copied by a user, an assistant or another agent. The sentence remains identical; its authority does not. Once an approval is compressed into ordinary prose and forwarded across an agent boundary, the receiver can no longer tell whether it is observing a genuine user statement or an agent's account of one.

A Codex change merged on 2026-08-22 addresses that problem at one specific boundary: MultiAgent V2 Guardian review. For a non-root worker, Codex resolves the actual root thread, extracts a bounded portion of structured root history and preserves whether each retained message came from the User or Assistant role. Only root-user messages are designated as authorization evidence. Assistant messages remain untrusted context even if their text contains `user: I approve`; forwarded claims, compacted summaries and synthetic review artifacts do not acquire user authority through wording.

The engineering lesson is broader but still bounded: **authorization provenance should travel through a structured review-plane evidence channel, not through claims embedded in work-plane prose.** That makes a sensitive admission decision more defensible. It does not replace the durable authorization state needed for long-lived, scoped and revocable authority.

## What a message says is not where it came from

Agent-to-agent forwarding is useful for summaries, intermediate findings and coordination. It is weak as an authority mechanism because it collapses the most important distinction. A downstream worker sees text, not the authoritative event that produced it.

Role-preserving extraction changes the evidence available to the reviewer. Codex resolves `AgentPath::root()` rather than trusting material carried by the worker. It retains structured User and Assistant variants and renders the source role explicitly. A phrase that merely claims to be from the user therefore remains assistant-authored when that is its actual structured origin.

The implementation also excludes several forms that could blur the boundary: summary messages, synthetic `<user_action>` items, review artifacts and non-final assistant commentary. This does not prove that every possible spoofing route is eliminated. It establishes a clearer admission rule for the demonstrated Guardian path: authority comes from an eligible structured root-user record, not from persuasive language.

## Put authority evidence on the review plane

The root evidence is supplied to Guardian review and classification rather than copied into the delegated worker's ordinary model context. That separation has two advantages.

First, the worker does not need broad access to the root conversation merely so a reviewer can assess a sensitive action. Evidence exposure can be narrower than work context. Second, the system can apply a different trust policy to the review plane: assistant history can remain useful context while being explicitly barred from authorizing the action under review.

The feed is deliberately bounded to the latest eligible root messages, with an independent token limit for each. Boundedness controls exposure and prompt size, but it creates its own lifecycle boundary. An older approval—or an older revocation—may rotate out of the evidence window. Absence from the window is not proof that authorization never existed; presence is not proof that it remains fresh or covers the current action.

## Evidence observed is not authority granted

For a one-time, immediate review, structured conversation evidence may be enough. Long-lived digital employees need another record when authority must survive across time, retries or delegated hops.

That durable state should bind at least:

- the authenticated principal represented by the authorization;
- the exact action, resource or capability scope;
- the decision's freshness, expiry and replay boundary;
- the conditions under which later messages revoke or supersede it;
- the executor and audit event that consumed the grant.

The distinction is operational, not semantic. A review record should say which evidence the reviewer observed. An execution record should say what authority was actually granted. Combining both into a natural-language transcript makes revocation, expiry and conflict resolution dependent on model interpretation at precisely the point where deterministic governance matters most.

Low-risk workflows may choose lighter controls. The point is proportionality: a conversational “yes” can be convenient context, but a sensitive or durable action should not inherit authority merely because another agent repeated that “yes” convincingly.

## A safer admission boundary, not an authorization guarantee

The public evidence is one merged Codex implementation and its integration tests. It demonstrates bounded root-history extraction for MultiAgent V2 Guardian review, role anti-spoof rendering and isolation from the ordinary worker request. It does not establish cryptographic human identity, reusable capability tokens, coverage of every Codex approval path or end-to-end authorization safety.

Assistant final answers remain visible as untrusted context, and the Guardian still has to honor the role boundary. The structured history also depends on the integrity of the upstream conversation store. These are real limits, not footnotes to be converted into a stronger claim.

The practical test is therefore simple: after a delegated action completes, can the audit show both **which authoritative evidence the reviewer saw** and **which scoped authority the executor received**? If it can show only a persuasive transcript, provenance has already been lost.

**Primary evidence:** [OpenAI Codex merged commit d12a7f3f](https://github.com/openai/codex/commit/d12a7f3fd8a3f0dcffc665d515b9ee0dd3714315). The public code and tests support the bounded Guardian behavior described here; they are not independent validation of universal agent authorization safety.
