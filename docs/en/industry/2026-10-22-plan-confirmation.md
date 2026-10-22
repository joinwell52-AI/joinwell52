---
title: When does a plan confirmation expire, and what is checked at execution?
date: '2026-10-22'
column: industry-architecture
category: daily
article_type: comparative-study
edition: research-center
research_question: 计划确认的新鲜度与执行请求权限如何分别检查？（How should confirmation freshness and execution-request authority be checked separately?）
summary: Twelve helper inputs expose comment-supersession defaults and exceptions; document-revision confirmation and call authority still need separate verification.
sources: Paperclip pinned source; MuleSoft official policy documentation; 2026-10-22 internal helper probe
pageClass: "runtime-v6-article"
item_id: "SIG-20261022-001"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-10-22-sig-20261022-001-2026-10-22-plan-confirmation-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-10-22-sig-20261022-001-2026-10-22-plan-confirmation-cover.png"
  kicker="Research"
  title="When does a plan confirmation expire, and what is checked at execution?"
  summary="Twelve helper inputs expose comment-supersession defaults and exceptions; document-revision confirmation and call authority still need separate verification."
  version="2026-10-22"
  languageHref="/zh/industry/2026-10-22-plan-confirmation"
  languageLabel="中文"
/>

<ArticleTableScroll language="en" />

<style>.runtime-v6-article .vp-doc h1[id] { display: none; }</style>


# When does a plan confirmation expire, and what is checked at execution?

Does adding a comment to an issue thread automatically invalidate a pending plan confirmation? Our internal probe's answer depends on configuration and interaction type. For platform architects connecting human confirmation to agent execution, that distinction matters: establish which revision a confirmation concerns and when it expires, then separately examine whether the execution request is permitted. Only then is the remaining evidence gap visible.

## A comment is not a universal revocation instruction

Paperclip's guide distinguishes formal approvals from ordinary issue-thread confirmations. Hires, strategy and spend- or security-sensitive actions have formal approval paths; plan discussions can use ordinary confirmation interactions. The guide recommends binding plan confirmation to the latest revision, using a revision-based idempotency key, explicitly opting into comment supersession, and waiting for acceptance before creating implementation subtasks. [Handling approvals guide](https://github.com/paperclipai/paperclip/blob/ba9e6e4bc5b327e19b95bd2d6ea8f09609170cf1/docs/guides/agent-developer/handling-approvals.md)

The same-day Analysis stage extracted two original helpers for input normalization and comment supersession, stripped their TypeScript annotations, and executed 12 synthetic combinations. All matched their prespecified expectations. The key branches below are helper behavior, not a test of the complete event path:

| Interaction type | Omitted or explicitly disabled | Comment supersession explicitly enabled |
|---|---|---|
| Ordinary plan confirmation | Not triggered by this helper rule | Triggered by this helper rule |
| Tool-action-bound confirmation | Not triggered | Still not triggered |
| Connection intent | Not triggered | Still not triggered |

Source: internal isolated probe, 2026-10-22, against the pinned [ba9e6e4 interaction service](https://github.com/paperclipai/paperclip/blob/ba9e6e4bc5b327e19b95bd2d6ea8f09609170cf1/server/src/services/issue-thread-interactions.ts). A question interaction supplied a separate eligible-kind control. The synthetic tool-action object exercised an object-presence branch; it was not a real action validated through the complete schema.

There is no guide/code contradiction: the guide requests explicit opt-in while the code defaults to disabled. Defaults can be product choices, and tool actions or connection intents may have separate lifecycles. Their exclusion by this helper does not establish an absence of other protections or a reproduced vulnerability. This concerns superseding pending confirmations, not universal revocation of already accepted approvals.

## A revised document follows another check

The inspected service also compares current document revision identity and an optional revision number, with issue, company and document identity. A stale-target path expires pending interactions bound to that target and retains the old target information. A document-row locking option and corresponding test definitions provide static evidence for this implementation path. [Target checks](https://github.com/paperclipai/paperclip/blob/ba9e6e4bc5b327e19b95bd2d6ea8f09609170cf1/server/src/services/issue-thread-interactions.ts); [service test definitions](https://github.com/paperclipai/paperclip/blob/ba9e6e4bc5b327e19b95bd2d6ea8f09609170cf1/server/src/__tests__/issue-thread-interactions-service.test.ts)

Comment supersession is a configured rule with defaults and exceptions. Target checking asks whether confirmation still refers to the current document. The presence of test definitions does not mean database tests ran in this study. No comment dispatch, database mutation, concurrent acceptance or document-revision transaction was executed here, so concurrency coverage cannot be claimed.

Consider an audit example: a confirmation request targets revision one, while the document has advanced to revision two. First inspect how a pending interaction handles its old target, then ask whether execution arguments still correspond to revision one. The inspected sources support the first implementation question; the end-to-end execution binding remains unverified. This is an audit method, not an added claim about product behavior.

## Request authority answers a different question

MuleSoft's official policy documentation concerns authenticated principals and concrete protocol requests. Its MCP attribute-based access-control policy uses Cedar rules involving principals, tools, resources and prompts. Another authentication policy must run first, and the attributes available to the principal depend on that authentication mechanism. [Attribute-based access-control policy](https://docs.mulesoft.com/gateway/latest/policies-included-mcp-attribute-access-control)

The two organizations supply material about different control points; neither substitutes for the other:

| Audit question | Plan-confirmation material | Gateway-policy material |
|---|---|---|
| What did a human confirm? | Document target and revision | Does not interpret that plan's human intent |
| When is another check needed? | Revision changes and configured invalidation rules | Current authenticated principal, attributes and request rules |
| What is supported here? | Inspected helpers and static revision path | Documented request-authorization contract |
| What is not established here? | Complete concurrent acceptance and execution binding | Security effectiveness of a deployed gateway |

Source: the cited public guide, pinned source and official policy documentation. The responsibility comparison is our interpretation, not a measured integration of the products. Authentication addresses who is requesting; authorization still asks whether that principal may perform this action on this target. A plan-confirmation marker cannot replace that decision.

## What would connect the two checks?

We recommend recording confirmation object, revision, invalidation options and exceptions, then tracing current principal, actual action arguments, resource scope and policy decision along execution. A claim that one human acceptance constrains a concrete tool call needs evidence linking the two. A button, authentication result or log alone should leave the unexamined connection unknown.

This does not prescribe combining the products or treating them as interchangeable. The gateway documentation also excludes Local Mode and states support for MCP 2025-06-18 and earlier. The architecture guide's older gateway naming differs from the current linked documentation. We retain that source drift without turning it into a verified release event. [Policy limits](https://docs.mulesoft.com/gateway/latest/policies-included-mcp-attribute-access-control); [enterprise architecture guide](https://architect.salesforce.com/docs/architect/fundamentals/guide/mulesoft-architecting-agentic-enterprise)

## Keep the evidence boundary on the inspected path

Public primary-source facts here are rules stated by the guide and policy documentation. Observations concern static inspection of pinned source and test definitions. Internal experimental evidence covers only 12 inputs to two original helpers, not third-party security validation. The architecture guide's security, compliance and auditability language remains vendor-authored claims and is not used to establish effectiveness. Having two source organizations does not mean one independently validated the other's mechanism.

Paperclip material is pinned to [source revision ba9e6e4](https://github.com/paperclipai/paperclip/tree/ba9e6e4bc5b327e19b95bd2d6ea8f09609170cf1). MuleSoft material consists of same-day saved official architecture and policy pages, without a new fetch during writing. Source and test definitions provide implementation evidence; documentation provides contract evidence. No gateway ran here, and no complete binding from human confirmation to call authorization was established. Publication, citation and review status cannot fill those gaps.

Further research would need to examine concurrent revision updates and acceptance, plus the treatment of old confirmations after identity, authority or argument changes. The supported judgment remains narrower: confirmation freshness and execution authority need separate evidence, and their connection needs evidence too.
