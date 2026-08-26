---
title: "An Agent Has Tool Permission—Why Recheck Every Execution? From GitHub MCP to a Task Evidence Chain"
date: '2026-08-26'
column: digital-employee
category: daily
article_type: comparative-study
edition: research-center
research_question: "What are the minimum facts that must connect a static tool capability to one high-risk side effect?"
summary: "A comparison of GitHub MCP's per-call scope checks with a bounded first-party Git-push record, proposing the minimum shape of an execution authorization receipt."
sources: "Public primary sources and the bounded scope of access-controlled first-party evidence are listed in the article."
project_relevance: case-evidence
item_id: "EBR-20260826-01"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-08-26-agent-call-time-authorization-receipt-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-08-26-agent-call-time-authorization-receipt-cover.png"
  kicker="Digital Employee · Engineering Research"
  title="An Agent Has Tool Permission—Why Recheck Every Execution? From GitHub MCP to a Task Evidence Chain"
  summary="Static capability is not permission for the present action; a high-risk side effect needs a traceable task, target, revision, approval and outcome link."
  version="EBR-20260826-01"
  status="Engineering Research · 2026-08-26"
  languageHref="/zh/digital-employee/2026-08-26-agent-call-time-authorization-receipt"
  languageLabel="中文"
/>

# An Agent Has Tool Permission—Why Recheck Every Execution? From GitHub MCP to a Task Evidence Chain

A real Git-push record sits in front of the auditor: its target is `origin/main`; it retains before/after version identifiers, administrative approval, a 900-second validity window, and an execution result. It can show that an external write was approved. It cannot yet answer the more important question: which task did that push serve?

That is the blind spot of static role authorization. Giving a coding agent Git access does not answer whether it may push to this repository, on this branch, at this moment. “The DEV role can use Git” describes a capability, not a decision for the current side effect. Using this first-party record and a merged public implementation, this article identifies five facts a high-risk action should retain: who acted, what it did, where it acted, why it was allowed, and what happened. The reader can use them to audit a real `git push`, deployment, or ticket-creation boundary.

[GitHub MCP Server PR #3128](https://github.com/github/github-mcp-server/pull/3128), merged in August 2026, is a useful public comparison. It separates whether a token can see a tool from a call-specific OAuth scope challenge. A tool may be visible while the current arguments still require a different scope: a workflow-file write, for example, needs more than an ordinary repository write. The PR also declares an exhaustive maximum scope set for dynamic checks and avoids argument materialization when that upper bound is already satisfied. This is a merged choice in one concrete service implementation—not proof that every agent runtime should use OAuth in the same way.

The lower layer is exploring a related direction at a different evidence strength. The MCP TypeScript SDK’s [PR #1624](https://github.com/modelcontextprotocol/typescript-sdk/pull/1624) remains open and discusses an interface for requesting a scope challenge at request time. It shows an SDK-level direction, not a capability already merged into GitHub MCP or a mature feature of the current SDK.

## A capability answers only the broad question

Treating a role allowlist as complete authorization is like issuing a master key. It may say who is eligible to enter, but it cannot explain why that person opened this room today or whether the room is still the one they were approved to enter.

An execution receipt should answer five checkable questions:

| Question | Minimum record | Not a substitute |
| --- | --- | --- |
| Who acted? | role, worker, run, attempt, lease | a generic `DEV` label |
| What happened? | tool, effect class, parameter digest | the tool name alone |
| Where did it act? | canonical root, realpath, target digest | a UI project label |
| Why was it allowed? | task scope, current revision, least-privilege rule | an old blanket approval |
| What was the result? | success or typed failure, evidence references | “the page says submitted” |

“Digest” here does not mean logging raw commands, prompts, or credentials. The goal is a recomputable association without copying secrets into a second place. Nor does this imply dropping OAuth into every local runtime. OAuth is one authorization protocol; a call-time receipt is a broader engineering requirement: preserve the decision and result at the moment a side effect occurs.

## What one internal record can—and cannot—show

In CodeFlowMu’s access-controlled private archive, we examined a first-party Git-push approval record, `APPROVAL-20260729-0b1a6337e40d`. It retains actor/role, `origin/main`, before/after SHAs, an external-write class, ADMIN approval, a 900-second validity period, start/finish events, and executor evidence. It is a checkable example of an action-time receipt. It is not public security certification and does not show equivalent coverage for every tool or push.

![Task linkage in five reviewed approval records](/assets/covers/2026-08-26-approval-linkage-sample.svg)

*Figure 1. None of the five first-party approval records reviewed has a direct task or thread link. This is not a repository-wide rate. Source: access-controlled CodeFlowMu first-party approval-record sample, accessed 2026-08-26.*

The same material exposes the next engineering gap. In the early private records examined here, approval facts and action evidence remain loosely associated: an auditor cannot directly trace a push back to the task that motivated it. That is an architectural discontinuity, not a dispute about field names. A useful call-time receipt has to connect approval, task scope, target, and outcome into one responsibility chain. This observation is limited to the five records reviewed; it does not describe every record in the repository.

## Start with one hard, small audit

Choose one external-write boundary—`git push`, deployment, or ticket creation—and require a minimal receipt for every invocation:

1. bind caller, task scope, canonical target, and revision before execution;
2. bind approval to one request with a nonce and expiry;
3. record success, typed failure, and evidence references separately;
4. check the receipt before retrying: deduplicate the same request, re-evaluate a changed target or revision;
5. audit from Action Evidence back to approval, not from conversational memory.

That creates researchable operational data: how often did a generally permitted capability fail call-time checks because target or revision had drifted? How many retries were recognised as the same action? Without these fields, a runtime can truthfully say only that a role has a capability—not why this action was allowed.

## Our view: do not copy OAuth; complete the task evidence chain

GitHub MCP’s important contribution is not a demand that every local agent runtime copy OAuth. It is the explicit separation between a tool being visible and this call satisfying its conditions. Our view is that local engineering should preserve that separation while binding the receipt to task scope, canonical target, revision, and outcome. The examined Git-push record shows that approval, target summary, expiry, and execution evidence can be retained; the linkage gap across five reviewed records shows that a `TASK` link cannot remain only in conversational context. It must become queryable evidence. This is an engineering direction proposed by the article, not a claim that every current call is covered.

A useful question for the GitHub MCP team follows from #3128: could tools expose both a machine-readable maximum-scope envelope and the minimum scope for a particular call, so an agent runtime can preflight authorization before tool selection and retain the decision as an audit receipt? This is an engineering question raised by the PR, not an interface this article claims already exists.

## Boundary

GitHub MCP’s merged design and one first-party Git-push record point to a minimum viable direction: move high-risk authorization beyond static roles, decide it again at call time, and retain a receipt that can be reviewed later. That is neither absolute security nor a claim of universal tool coverage. It is an engineering change that can begin at the next external-write boundary.

### Sources

- [GitHub MCP Server PR #3128: per-call OAuth scope checks](https://github.com/github/github-mcp-server/pull/3128), accessed 2026-08-26.
- [MCP TypeScript SDK PR #1624: request-time OAuth scope challenges](https://github.com/modelcontextprotocol/typescript-sdk/pull/1624), open PR used only as an interface-direction reference, accessed 2026-08-26.
- CodeFlowMu private, access-controlled first-party evidence: `APPROVAL-20260729-0b1a6337e40d` and current Action Evidence types. Not independent evidence.
