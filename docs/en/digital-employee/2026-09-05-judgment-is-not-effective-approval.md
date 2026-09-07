---
title: "A Positive Judgment Is Not Yet an Effective Approval"
date: '2026-09-05'
column: digital-employee
category: daily
article_type: comparative-study
edition: research-center
research_question: "在人工智能生成的批准判断成为组织内有效签署之前，必须具备哪些证据；哪些变化应当使这份权限失效或收窄？"
summary: "GitHub's code-review controls and OpenAI Codex's authorization-evidence lifecycle expose the same boundary: judgment, approval capability, gate effect, scope, and freshness are different facts. A material change to the target, policy, or authorization evidence requires re-evaluation."
sources:
  - research/analysis/Q-20260905-01-approval-authority-freshness.md
item_id: "Q-20260905-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-05-judgment-is-not-effective-approval-editorial-v2.webp"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-05-judgment-is-not-effective-approval-editorial-v2.webp"
  kicker="Digital Employee · Daily Research"
  title="A Positive Judgment Is Not Yet an Effective Approval"
  summary="GitHub's code-review controls and OpenAI Codex's authorization-evidence lifecycle expose the same boundary: judgment, approval capability, gate effect, scope, and freshness are different facts. A material change to the target, policy, or authorization evidence requires re-evaluation."
  version="Q-20260905-01"
  status="Daily Runtime V5 · 2026-09-05"
  languageHref="/zh/digital-employee/2026-09-05-judgment-is-not-effective-approval"
  languageLabel="中文"
/>

# A Positive Judgment Is Not Yet an Effective Approval

An AI review says a change is acceptable. Minutes later, the target commit, covered files, or authorization policy changes, but the system continues to treat the old judgment as an effective approval. The dangerous mistake is not necessarily in the review. It is in turning “the model thinks this is acceptable” into “this decision is authorized to satisfy the gate now.”

The core proposition is: **an AI approval judgment becomes an effective sign-off only when separately authorized for a named gate, scope, and freshness identity. A material change to the reviewed object, governing evidence, or authority-sensitive context must invalidate or re-evaluate that authority.** This gives system designers a practical replacement for one overloaded approved flag.

## One Word Hides Five Governance Questions

“Approval” may refer to at least five different facts:

1. **Judgment:** did the model assess the object as acceptable?
2. **Approval capability:** does current policy allow this actor or agent to submit an approval?
3. **Effective authority:** may that approval satisfy the particular organizational or runtime gate?
4. **Scope:** which repository, files, action, principal relationship, or parameter set does it cover?
5. **Freshness identity:** which target version, policy version, and authorization-evidence version were evaluated?

These dimensions can all be true at once, but they can also change independently. A reasonable judgment does not create approval capability. The ability to submit an approval does not necessarily make it qualify for a merge gate. Authority that was valid for yesterday's commit does not automatically cover today's one.

A three-second example makes the difference concrete. The unsafe design stores only `approved=true`. The governed design stores: positive judgment; policy permits submission; the approval satisfies a named merge gate; the scope is a specified path set; and both target and authorization-evidence versions remain current. A change to any protected identity then produces an explicit re-evaluation instead of relying on the same green label.

## The Organizational Sample Separates Assessment, Submission, and Gate Effect

GitHub's public Copilot code-review materials distinguish several layers. Copilot code review can provide an approval assessment without that assessment counting toward pull-request merge requirements. The ability to submit approving reviews is disabled by default and requires administrator enablement. Whether such approval may satisfy merge requirements is configured separately. Repository policy can further limit qualifying approval by changed-file paths.

GitHub also documents that new commits dismiss an earlier approval. That rule makes reviewed-object freshness explicit. Approval does not attach indefinitely to the natural-language idea that “this pull request looks fine”; its effect depends on the version that was reviewed. When the target changes, the merge-governance system requires a fresh effective decision.

These are public primary-source product facts from GitHub's own announcement and documentation, not independent third-party validation. They establish what the exposed controls separate. They do not reveal every internal authorization mechanism or prove a human principal's legal identity.

## The Agent-Runtime Sample Makes Context an Authority Boundary

An OpenAI Codex maintainer change versions root-authorization evidence used by its Guardian review path. If a pending `Allow` has not yet been consumed and the root-authorization version changes, the stale allow is cancelled. Required evidence that is absent leaves the review incomplete. The covered implementation also handles two context transitions: it restores required root authorization across compaction and strips parent-only approvals when a worker is forked.

This is not the same protocol or gate as GitHub pull-request policy. Codex is deciding whether a running agent may proceed under current root instructions and verified answers. The comparable higher-order invariant is narrower: a positive result must refer to authorization evidence that is still valid. Preserved text or conversational continuity cannot by itself imply preserved privilege.

The evidence is a merged maintainer implementation plus targeted tests for the covered paths. It supports claims about that revision. It is not independent safety validation of all agents, tools, or organizational governance.

## Invalidation Should Follow Enumerated Change, Not Intuition

A usable authority lifecycle can be expressed as responsibilities rather than one state label:

| Stage | Owner | Input | Output | Stop condition |
|---|---|---|---|---|
| Form judgment | Review model | Target version and evidence | Reasoned positive or negative assessment | Target or evidence is insufficient |
| Grant approval capability | Policy control plane | Principal, policy, capability settings | Permission to submit approval | Policy disabled or actor ineligible |
| Create gate effect | Organizational gate | Approval, scope, gate rules | Named gate satisfied | Scope mismatch or approval does not qualify |
| Check freshness | Version and authorization verifier | Target, policy, evidence, context identities | Preserve or revoke effect | A protected identity changes materially |
| Perform downstream action | Merger or runtime executor | Current effective gate result | Bounded effect | Authority expired, consumed, or effect state unknown |

“Material change” cannot remain an intuition. Candidate triggers include a reviewed commit change, a change to the qualified path set, a policy update, a new authorization-evidence version, a principal-relationship change, or transfer of context ownership from parent to child. A system may preserve approval across a harmless change if it can define and audit a narrower rule showing that the approved proposition is unaffected.

## Simple Interfaces Need Not Erase Durable Facts

Two counterarguments deserve attention. Re-reviewing every change can be expensive. Product interfaces may also combine states intentionally so users are not forced to read a control-plane model.

Both points are compatible with the proposition. A system can preserve approval for comment-only changes, files outside the approved scope, or other mutations mechanically shown not to affect the reviewed proposition. The predicate must be explicit. A user interface can show one “approved” label while the durable record retains who had capability, which gate was satisfied, what scope applied, and whether target and authorization versions still match.

The hazard is not visual simplification. It is reducing durable state to a Boolean. When challenged, such a system cannot answer whether the record was a recommendation, a policy authorization, or effective gate satisfaction; which object it covered; which authority version it used; or why it remains valid.

## Evidence Boundary and Open Questions

The two samples support separation of judgment from effective authority and the need for an explicit freshness identity. They do not establish a universal cross-platform approval protocol, human-principal identity, non-repudiation, legal accountability, or exactly-once downstream effects.

Open questions include which fields belong in a portable approval-authority identity; which target or policy changes may safely preserve approval; how in-flight work should be cancelled, reconciled, or compensated when authority becomes stale; whether an approval is single-use; how expiration, network replay, and renewed approval are distinguished; and which process, container, or operating-system controls must backstop an application-level gate.

An engineering team can begin with a small rule: prohibit an unexplained single approved flag in the next design review. Require separate answers for judgment, capability, gate effect, scope, and freshness—and enumerate what invalidates each answer. That is how a positive judgment stops surviving as authority after the facts that justified it have changed.

**Evidence and sources:**

- [GitHub: Copilot code review can now approve pull requests (product announcement, September 1, 2026)](https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests/)
- [GitHub Docs: Configuring Copilot code review](https://docs.github.com/en/copilot/customizing-copilot/configuring-copilot-code-review/configuring-copilot-code-review)
- [OpenAI Codex maintainer commit: version Guardian root-authorization evidence](https://github.com/openai/codex/commit/87628df77ab1a2622d1193ad835df02ced565bf2)

