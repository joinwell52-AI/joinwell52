---
title: "State May Persist; Authority Must Be Re-established"
date: '2026-09-12'
column: industry-architecture
category: daily
article_type: comparative-study
edition: research-center
research_question: "当当前政策或运行时身份与长寿命智能体会话保留的状态冲突时，下一个外部效果应由哪一来源决定，优先级规则应在哪里执行，拒绝正向工作后又必须保留哪些安全控制？"
summary: "Long-lived sessions need retained state, but retention does not preserve sovereignty. Three recent implementations demonstrate revalidation, authoritative replacement, and control-state isolation while preserving stop and recovery operations after positive work is rejected."
sources:
  - research/analysis/Q-20260912-02-continuity-authority-precedence.md
item_id: "Q-20260912-02"
lifecycle: "Published"
cover: "/assets/covers/daily-2026-09-12-retained-state-current-authority-cover.png"
evidence_status: "Completed"
citation_status: "Completed"
editing_status: "Completed"
publication_authorized: true
---

<ArticleCover
  image="/assets/covers/daily-2026-09-12-retained-state-current-authority-cover.png"
  kicker="Industry Architecture · Daily Research"
  title="State May Persist; Authority Must Be Re-established"
  summary="Long-lived sessions need retained state, but retention does not preserve sovereignty. Three recent implementations demonstrate revalidation, authoritative replacement, and control-state isolation while preserving stop and recovery operations after positive work is rejected."
  version="Q-20260912-02"
  status="Daily Runtime V5 · 2026-09-12"
  languageHref="/zh/industry/2026-09-12-retained-state-current-authority"
  languageLabel="中文"
/>

# State May Persist; Authority Must Be Re-established

A session has been running for hours. Its model route, request headers, and project configuration remain valid. Meanwhile, an administrator changes the managed provider requirement, an identity provider acquires a new token, and the workspace moves from trusted to untrusted.

If the system treats “still present” as “still authoritative,” continuity quietly becomes permanent permission. A long-lived agent does not need to erase all state at every transition. It needs to name what may persist, which source owns current authority, which precedence operator resolves conflict, and where that decision must occur before an effect.

This article compares three recent merged engineering changes at session, transport, and sandbox layers. Together they support one bounded proposition: **continuity state may remain useful without remaining sovereign. Each effect-bearing operation needs an explicit current authority owner, a deterministic precedence operator, and preserved safe controls before mutation.**

## Continuity and Authority Are Orthogonal

Retained sessions avoid reconstructing context. Stored request configuration supports a connection before an identity transition. User-global commands preserve personal workflows. Those are continuity benefits.

Yet a value can remain readable, well-formed, and previously validated after it loses the right to govern the next action. Authority may have moved to managed policy, a current authentication provider, or protected host state. The runtime needs an explicit boundary between usable state and decision-making sovereignty.

The samples expose three operators:

- **revalidation** retains state but compares it with current authority before selected operations;
- **replacement** overwrites a lower-authority field once the current authoritative value exists;
- **isolation** prevents a lower-trust domain from reading or mutating control state.

They solve different conflicts and are not interchangeable.

## Codex: Revalidate Retained Sessions at Call Time

The Codex change addresses existing app-server threads. It loads current managed provider requirements independently, then compares the retained provider selection and definition before selected model-driving or state-changing operations.

The important move is not a universal configuration reload. Ordinary user, project, and system-default configuration does not rewrite the existing thread. Managed requirements are isolated as the authority source. A mismatch, loading failure, or parsing failure rejects the protected request before queue or goal state changes.

This fail-closed behavior is bounded. Interrupt, realtime stop, and goal pause or clear remain available; realtime routing is outside the check. Positive work that needs current authority stops, while negative controls that reduce activity remain usable.

The evidence covers enumerated, tested call paths. It does not prove that a future endpoint cannot bypass the check. Call-site completeness must remain an active verification target.

## MCP TypeScript SDK: Give Managed Fields One Owner

The Model Context Protocol TypeScript SDK problem lives in HTTP transport. A caller can supply Authorization, protocol version, or session identity, while the transport derives those values from current authentication and session state. Generic merging can preserve both. Case variants can even combine into a malformed multi-value credential.

The fix initializes standard Fetch Headers from caller input, then uses case-insensitive set operations for transport-managed Authorization, protocol version, and Streamable HTTP session ID. Once the provider has a token, runtime-derived Authorization replaces stale caller Authorization. Before that transition, a configured value can remain usable.

The operator is field-level replacement, not deletion of all caller configuration. The transport owns named fields and preserves unrelated headers. Authority follows ownership and state transition, not whichever value happens to be written last.

This resolves identity ambiguity during request construction. It does not prove that a server authorizes the token correctly or that transport identity grants business-operation permission.

## Gemini CLI: Isolate Control State From Lower-Trust Execution

The Gemini CLI change handles a different boundary. Sandbox and untrusted project content should not read or rewrite credential, account, trust, policy-integrity, or environment-secret state. Sandbox profiles and host-path checks reduce that visibility and mutation surface while sanitizing hooks and API-key settings.

Command loading also distinguishes sources. User-global commands remain available in an untrusted folder, while project and extension commands are excluded. The runtime does not disable every feature after trust falls; it prevents a lower-trust source from promoting itself into a control source.

This problem cannot be solved by comparison alone. If project code can mutate the policy or credential store consulted by the next check, revalidation merely reads a compromised “current” value. Isolation protects the authority substrate itself.

The guarantee still depends on host enforcement and correct path resolution. Configuration evidence alone cannot establish complete sandbox security.

## Three Operators, Three Conflict Classes

| Scenario | Retained state | Current authority | Operator | Primary failure |
|---|---|---|---|---|
| Long-lived session meets new managed policy | thread provider state | managed requirement | revalidate and reject | startup authorization decay |
| Caller header meets current authenticated identity | static Authorization | provider token | field replacement | dual identity and case merge |
| Project execution approaches credential and trust state | workspace code/config | protected host store | isolation | workspace-to-control escalation |

“Reload everything” destroys valid continuity. “Newest wins” allows a newly written low-trust value to outrank protected state. “Keep the old value until failure” lets expired authority cross the effect boundary. The correct operator depends on field ownership, operation class, and threat model.

## Stop Capability Must Survive Rejection

Fail-closed is often implemented as a master switch: validation fails, so every operation stops. That can lock out recovery. Inability to continue model work should not disable interrupt. Refusal to send stale authentication should not remove unrelated headers. Excluding untrusted project commands does not require removing user-global commands.

A negative-control policy should enumerate interrupt, stop, pause, clear, rollback, and read-only diagnosis separately, then verify that none can initiate positive work indirectly. Safety is not “nothing moves.” It is “effects requiring current authority do not proceed, while risk can still be reduced.”

## A Minimum Authority-Precedence Contract

Every effect class should declare:

| Contract field | Question |
|---|---|
| Retained-state identity | What persists for continuity? |
| Current authority source and version | Who decides now? |
| Refresh point | When is authority obtained or confirmed? |
| Precedence operator | Compare and reject, replace, or isolate? |
| Authority-unavailable behavior | Fail closed, bounded cache, or recovery? |
| Mutation boundary | What is the last point before effect? |
| Negative controls | Which risk-reducing actions remain available? |
| Evidence receipt | How can the applied source and rule be proved? |

The contract is operation-specific. A provider requirement may govern model-driving work but not interrupt. An identity provider may own Authorization but not every header. A sandbox may read business files while remaining unable to reach trust and secret stores.

## Test Transitions, Not Only Steady State

Authority defects cluster at transitions. A useful test matrix covers:

- the same thread before and after a policy update;
- requests before and after token acquisition;
- case variants and every supported HeadersInit form;
- trusted and untrusted workspaces;
- available, unavailable, and malformed authority sources;
- interrupt and rollback while positive work is rejected;
- proof that queue, goal, and external state remain unchanged after rejection.

These tests are not only regressions. They are executable documentation of the precedence contract.

## Boundaries and Open Questions

All three samples are first-party merged code and tests, not independent production outcomes or complete adversarial evaluations. Provider routing, HTTP authentication, and filesystem sandboxing occupy different layers. A shared abstraction must not erase their distinct threat models.

Fail-closed refresh can reduce availability during policy-service outages. Signed caches may help, but cache validity, applicable operations, and expiry become part of the authority contract. Negative controls must also be monotonic: an operation labeled “pause” must not indirectly launch new work.

Open questions include how to prove coverage of every effect path, which updates invalidate in-flight work, how authority composes across session, transport, tool server, and external target, how users migrate old sessions without losing unrelated valid work, and how to measure stale-authority prevention without exposing secrets.

**Evidence and citations:**

- [Codex managed-provider revalidation for existing threads](https://github.com/openai/codex/commit/39d193d72d7959d798642bd3e1496bb8865033b1)
- [MCP TypeScript SDK transport-header precedence](https://github.com/modelcontextprotocol/typescript-sdk/commit/b65426158ed9f29aea8ef3dc09ca22d7d9d6f970)
- [Gemini CLI sandbox and runtime-state isolation](https://github.com/google-gemini/gemini-cli/commit/9c1b0a610534d6f8120964cf2672c07807d8fc90)
