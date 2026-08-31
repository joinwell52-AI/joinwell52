---
title: "A Trusted Path Proves Provenance, Not Approval"
date: '2026-08-27'
column: open-source-engineering
category: daily
article_type: engineering-insight
edition: research-center
research_question: "什么时候，被调用的技能才能成为授权证据，又不让仓库文本或伪造路径冒充用户意图？"
summary: "A merged OpenAI Codex Guardian v2 change records an actual invocation in the host and then verifies provenance through canonical trusted roots. The mechanism establishes bounded invocation origin, not safe content, immutable bytes or contemporaneous approval."
sources:
  - research/analysis/Q-20260827-03-host-verified-skill-invocation-provenance.md
item_id: "Q-20260827-03"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-27-trusted-path-proves-provenance-not-approval-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-27-trusted-path-proves-provenance-not-approval-cover-v2.png"
  kicker="Open-source Engineering · Daily Research"
  title="A Trusted Path Proves Provenance, Not Approval"
  summary="A merged OpenAI Codex Guardian v2 change records an actual invocation in the host and then verifies provenance through canonical trusted roots. The mechanism establishes bounded invocation origin, not safe content, immutable bytes or contemporaneous approval."
  version="Q-20260827-03"
  status="Daily Runtime V5 · 2026-08-27"
  languageHref="/zh/engineering/2026-08-27-trusted-path-proves-provenance-not-approval"
  languageLabel="中文"
/>

# A Trusted Path Proves Provenance, Not Approval

A skill can encode a user's preconfigured way of working and may provide useful context for an authorization decision. But a skill name, displayed path or repository-embedded tag cannot automatically become user authority. The repository under review can forge those strings, and a symlink can make a trusted-looking path resolve outside the expected root.

A merged OpenAI Codex Guardian v2 change demonstrates a stricter boundary. A skill becomes candidate evidence only after the host observes its invocation. The host then resolves the resource, canonicalizes both candidate and trusted roots, and requires the real file to remain under a user-owned root managed by the host. Repository skills and symlink escapes do not gain equivalent status through this path.

The core conclusion is: **an invoked skill should influence authorization only after the host records the actual invocation and verifies resource provenance against an authority-owned trusted root. Canonical location proves a bounded origin under that trust model, not content identity, semantic safety, immutability or contemporaneous user approval.**

## Prove the invocation occurred before interpreting it

A skill existing on disk does not mean it participated in the current action. A skill body claiming “the user approved this” does not mean the host observed an invocation. Authorization evidence should begin with an occurrence: which execution, at what time, through which host, loaded which resource.

The selected implementation covers explicit and implicit skill invocation, but both pass through a host-controlled contributor. What becomes evidence is the observed invocation, not the name or body. That ordering blocks a circular path in which the object under review manufactures trusted-looking skill markup and thereby supplies its own authorization evidence.

Occurrence still does not equal approval. An invocation may result from old configuration, a broad policy or automatic selection. It establishes that the skill entered the current process. Why the skill is trusted, which content ran and whether it authorizes this action remain separate questions.

## Canonical trusted roots answer an origin question

Textual path checks are easy to fool. A string beginning with a directory name does not prove that its resolved file remains there. Symlinks can cross directory boundaries, while relative paths and platform normalization can create ambiguity.

The public implementation canonicalizes both skill resources and roots, checks that the real file remains under a canonical trusted root, requires a file and applies path-length bounds. The question changes from “what does this path look like?” to “where did the host actually resolve it?” Maintainer tests cover user-owned skills, a forged repository skill, symlink escape, deduplication and evidence limits.

Who controls the root is equally important. Directory containment has authorization meaning only when the root belongs to an authority-owned trust boundary. If a repository can declare a new trusted root for itself, provenance qualification collapses back into self-attestation.

## Path-only evidence reduces risk and loses content identity

Guardian receives a bounded, deduplicated list of canonical paths rather than privileged copies of full skill bodies. That reduces two surfaces: prompt injection through large or adversarial content, and unbounded consumption of the review budget.

The tradeoff is that a path cannot answer which bytes ran. If a skill changes after invocation, a later audit sees the same location without proof of historical content. When replay or exact attribution matters, the invocation record should include a content digest, immutable version identity or signed snapshot. Path provenance must not substitute for content identity.

Evidence bounds must also be visible. Count, byte or token budgets may omit later trusted invocations. The limit is a legitimate safety measure, but it means the record is a bounded provenance set rather than complete history. An approver should know whether truncation occurred instead of interpreting absence as non-occurrence.

## Five evidence dimensions must not substitute for one another

A durable authorization receipt should distinguish at least five questions:

1. Occurrence: did the host observe this skill invocation?
2. Provenance: did the resolved resource fall under an authority-owned trusted root?
3. Content identity: which exact bytes or version were invoked?
4. Semantic safety: do those instructions permit the current capability and target?
5. Current approval: did a human or governing policy authorize this specific action?

The Guardian change strengthens the first two and narrows privileged content exposure by passing paths. It does not automatically establish the other three. User ownership of a skill file does not mean the user reviewed today's version. Trusted location does not mean the instructions are current, conflict-free or within scope.

Engineering review should therefore avoid asking the overly broad question “is this skill trusted?” Ask which fact is being established, who produced the evidence, and which execution, resource version and time it binds. If the answer is only “the path is under a trusted directory,” the conclusion must stop at provenance.

## Design the record for audit and revocation

Long-term audit needs an execution identity, canonical path, trusted-root decision, content digest, evidence-truncation flag and timestamp. When a skill changes, is removed or its root loses trust, the system should state whether historical evidence remains valid, future use requires reapproval, or downstream eligibility is revoked immediately.

The selected evidence is a merged implementation and maintainer tests, not independent validation of Guardian decision correctness. Trusted roots also depend on local filesystem and configuration correctness; they are not cryptographic provenance. The mechanism is a strong but bounded starting point: prevent repository text from impersonating user origin, then make other evidence layers carry responsibility for content and approval.

**Primary evidence:** [OpenAI Codex merged commit b68acc4d](https://github.com/openai/codex/commit/b68acc4d4b56fdfa1d5b6a2c36102c66876e0c46). The implementation and tests support observed invocation, canonical trusted-root provenance and bounded path evidence. They do not prove content safety, immutability or universal authorization.
