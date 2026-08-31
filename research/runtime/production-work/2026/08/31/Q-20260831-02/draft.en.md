---
schema: publication-candidate-article/v2
title: "A Reconstructed Role Is Not Proof of Authority"
date: '2026-08-31'
column: industry-architecture
category: daily
article_type: technical-analysis
edition: research-center
research_question: "上下文转换必须保留哪些权威事实，才能让下游智能体或权限审查器区分真实用户权威与被重建到高权限位置的低权限内容？"
summary: "A study of six coding-agent harnesses reports that low-privilege content reconstructed as user-level instruction can defeat automatic permission review that rejects conventional dangerous-instruction baselines. Safer architecture keeps original principal, origin channel, privilege class, and explicit privilege transitions independent of reconstructed message role."
cover: staging/publication-candidates/2026-08-31-a-reconstructed-role-is-not-proof-of-authority-cover.png
sources:
  - research/analysis/Q-20260831-02-reconstructed-role-not-authority-provenance.md
---

![A Reconstructed Role Is Not Proof of Authority cover](staging/publication-candidates/2026-08-31-a-reconstructed-role-is-not-proof-of-authority-cover.png)

# A Reconstructed Role Is Not Proof of Authority

An automatic permission reviewer recognizes that a command is dangerous and still approves it. The reviewer may not have misunderstood the risk. It may have trusted the apparent requester: low-privilege tool content was persisted, reconstructed, and placed into a stronger message position.

The text stayed the same while its authority meaning changed. For an agent harness, that is not merely prompt injection. It is loss of authority provenance during transformation. A reconstructed role says where content sits now; it does not prove who supplied it, what privilege it originally had, or whether a trusted transition elevated it.

A primary study evaluated six coding-agent harnesses against 13 attack objectives. Its architectural warning is direct: **reconstructed message role is not sufficient authority provenance. Original principal, origin channel, privilege class, and trusted privilege transition must remain independently inspectable across persistence, summarization, handoff, and reconstruction.**

## The Attack Changes Effective Privilege, Not Just Text

The study starts from low-privilege content controlled through tools or repositories. Harness mechanisms persist it in goals, scheduled tasks, skill-like structures, or history, then reintroduce it in a later context. Reconstruction can place tool-origin data into a user- or system-effective position.

In the reported full-access setting, all 13 attack objectives succeeded across all six harnesses. The objectives span confidentiality, integrity, availability, and remote-code-execution-like effects. The shared mechanism is not one unusually persuasive sentence. The harness changes the effective privilege attached to the content when assembling a new context.

Serialization, summarization, and prompt assembly are therefore not neutral formatting steps. When they change how downstream components interpret instruction authority, they are control-plane boundaries.

## Risk Review Cannot Repair a Corrupted Principal Premise

The study also examines three harnesses with automatic permission review: Claude Code, Codex, and Qwen Code. Under context privilege transformation, all 13 objectives reportedly succeed in each. A conventional prompt-injection or role-confusion comparison without that transformation scores 0/13.

That comparison matters. The reviewer is not simply approving every dangerous command. It can recognize the operation as risky and still act on the wrong principal premise: once attacker content is reconstructed as user intent, the reviewer may reason that an authorized user knowingly requested the risk.

Content-risk review asks whether an operation is dangerous. Authority validation asks whether a principal entitled to request it actually did so. The first cannot substitute for the second. A second language-model reviewer reading the same provenance-corrupted context is not automatically an independent authorization boundary.

## Provenance Must Be Independent of Message Role

A minimum authority record should answer four questions: who was the original principal, through which channel did the content enter, what was its privilege class, and did an explicit trusted transition elevate it?

Message roles remain useful. They help a model interpret conversational structure and present context. After lossy transformation, however, role expresses how content is presented now, not what authority it originally possessed.

A high-impact authorization gate should therefore consume side metadata independent of the final prompt. It should verify that any privilege elevation was explicit and trusted. Unknown or missing provenance remains an authority defect; prompt assembly cannot repair it by assigning a stronger role.

## Persistence and Handoff Are Privilege Boundaries

The evaluated paths include goals, scheduled tasks, and skill-like persistence. That extends the problem beyond an immediate conversation. Tool-controlled content written today may return in tomorrow’s scheduled task in a stronger position.

Summarization, compaction, persistence, scheduled rehydration, and cross-agent handoff all merge, remove, or reorder information. If provenance evidence does not survive with the content, the next reconstruction can grant authority that never existed.

Governed systems should treat each transformation as a provenance-preservation gate. It must either preserve original privilege or record an explicit elevation. Privilege change cannot be an accidental property of a serializer or prompt template.

## Explicit Adoption Is Possible

Provenance-aware design does not mean low-privilege content can never be adopted. A trusted user may quote a tool result, accept a recommendation, or deliberately elevate an instruction. That adoption should create new auditable transition evidence, not be inferred because the content later appears in a user message region.

Nor should merged content simply inherit the highest privilege or remain permanently tainted at the lowest level. Composition needs declared semantics: which principals contributed which claims, who is responsible for the synthesized result, and whether elevation covers all content or a bounded proposition.

## Evidence Boundary and Open Questions

The study covers six coding-agent harnesses and specific reconstruction mechanisms. It does not establish that every agent system shares the implementation, nor does it prove that signed envelopes, capability records, typed provenance graphs, or another representation is optimal. Experimental attack success does not determine production prevalence or organization-specific blast radius.

The architecture boundary is nevertheless clear: **reconstructed role describes presentation position; action authority must trace to original principal and governed privilege transitions. When provenance required for a high-impact decision is lost, the system should not infer stronger authority.**

Open questions include the minimum provenance tuple, composition across summarized inputs, which components may elevate privilege, and migration of legacy untyped context without silent authorization.

**Primary evidence:** [When Context Gets Root: Privilege Escalation in LLM Harnesses](https://arxiv.org/abs/2608.27299)
