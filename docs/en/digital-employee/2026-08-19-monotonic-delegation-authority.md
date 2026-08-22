---
title: "A Delegated Role Should Narrow Authority, Not Create It"
date: '2026-08-19'
column: digital-employee
category: daily
article_type: engineering-insight
edition: research-center
research_question: "How can a delegated child-agent role enable useful specialization without becoming a parallel authority plane, including after resume or reconstruction?"
summary: "A role file should not become a second permission system. A same-day Codex change demonstrates a bounded pattern: project role configuration through typed overrides, preserve parent-owned permission, routing and infrastructure settings, and allow selected capability changes only in the reducing direction."
sources:
  - research/analysis/Q-20260819-01-monotonic-delegation-authority.md
item_id: "Q-20260819-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-19-monotonic-delegation-authority-cover-v2.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-19-monotonic-delegation-authority-cover-v2.png"
  kicker="Digital Employee · Daily Research"
  title="A Delegated Role Should Narrow Authority, Not Create It"
  summary="A role file should not become a second permission system. A same-day Codex change demonstrates a bounded pattern: project role configuration through typed overrides, preserve parent-owned permission, routing and infrastructure settings, and allow selected capability changes only in the reducing direction."
  version="Q-20260819-01"
  status="Daily Runtime V5 · 2026-08-19"
  languageHref="/zh/digital-employee/2026-08-19-monotonic-delegation-authority"
  languageLabel="中文"
/>

# A Delegated Role Should Narrow Authority, Not Create It

A child agent may reasonably need a different model, instructions and skill set. But if its role file can also rewrite permissions, providers, approval rules, MCP servers or base URLs, “role specialization” has quietly become authority creation.

A Codex change merged on 2026-08-19 offers one concrete, bounded response. Role files are no longer treated as arbitrary high-precedence configuration; they are projected into typed `AgentRoleOverrides`. Regression tests show that hostile role settings do not replace parent permissions, provider configuration, the approval reviewer, MCP servers, the base URL or notifications. Selected role-controlled capabilities can be disabled but do not become a channel for enabling additional privileged facilities. Managed requirements remain effective, symlinked user role files are rejected, and a cold-resumed worker uses the same constrained role path.

The evidence supports a more precise rule than “configuration is inherited”: **a delegated role should be a monotonic delta beneath inherited authority, not another configuration authority.**

## Role configuration and authority configuration answer different questions

Behavioral specialization answers how a worker should perform its job. Authority configuration answers what it may invoke, which routes it may use, who reviews consequential actions and which infrastructure it may reach. The first can vary by role; the second defines the trust and effect boundary.

If both share an unrestricted override layer, a high-precedence role file can appear to change only instructions while also replacing a provider, weakening approval or adding a tool path. The parent's “maximum authority” is then a convention rather than a testable invariant.

Typed projection changes that boundary. Unsupported keys in the source role file do not become authoritative merely because they appear in a high-precedence file. Code declares the mutable subset; configuration outside that projection remains owned by the parent.

## A monotonic delta turns delegation into an ordering rule

“Children must not exceed their parent” is often stated as a principle but not encoded. An implementable version separates three kinds of change:

- **behavioral specialization** — declared model, role or work-style fields may vary;
- **capability reduction** — the child may disable part of what the parent offers;
- **capability expansion** — new tools, permissions, routes or infrastructure access require a separate authority event.

This creates an ordering relation: on authority-bearing dimensions, the child is equal to or narrower than the parent. The Codex change directly demonstrates one configuration-layer implementation, not a universal theorem. Yet the model can become a mechanical test. Whenever the configuration schema gains a field, the system can require a decision: parent-owned authority, allowed behavioral delta, or explicit delegated expansion.

The same separation improves auditability. An operator can inspect the parent authority envelope, the child's behavioral delta and the child's capability reductions as different facts instead of receiving an opaque merged configuration.

## Resume and reconstruction are authority transitions too

Many runtimes check authority when a child is spawned, then replay stored configuration during resume, migration or reconstruction. If that lifecycle path uses different merging rules, previously constrained settings may regain authority.

Cold-resume coverage in the same-day change therefore matters. Resumed workers reuse the bounded role path, with regression coverage for provider inheritance. This supports a lifecycle rule: **re-establish the maximum authority envelope from the current parent source of truth before applying the role delta.**

That is not proof that every recovery path is safe. The evidence does not cover every migration, fork or runtime authorization mechanism. It does show why resume should be treated as an authority-sensitive reconstruction rather than simple data loading.

## Bounded configuration is not complete delegation security

The implementation and tests come from one public repository; they are not an independent security evaluation. The demonstrated property is limited to fields covered by the current projection and regression suite.

A narrower child model may still request unsafe actions through tools it legitimately inherited. The role-file boundary does not authenticate provenance. Most importantly, monotonic configuration does not automatically authorize every runtime tool call or contain every external effect.

The correct boundary is narrower: a monotonic role delta can prevent role configuration from becoming a parallel authority plane. Runtime effects still require separate qualification, approval and audit.

The next questions should be made mechanically answerable. When the configuration schema adds a field, how does the system detect that it bears authority? How should a child request, receive and record a genuine expansion? Do all resume, fork and migration paths re-derive effective authority from the same parent source of truth? Delegation becomes trustworthy only when those questions are enforceable failure conditions rather than documentation promises.

**Primary evidence:** [OpenAI Codex merged commit 1a6e07a4](https://github.com/openai/codex/commit/1a6e07a4febcc0ecfa04464f5e95cb47144cd746). The code and repository tests are public primary-source evidence; they are not independent validation of complete delegation security.
