# Q-20260906-03 — Durable Agent Transitions Need Stable Principal Identity Plus Destination Re-admission

- Runtime date: 2026-09-06 (Asia/Shanghai)
- Queue signal: SIG-20260906-004, strengthened by SIG-20260906-003
- Primary maintainer implementation: https://github.com/openai/openai-agents-python/commit/4a11d20d126ebc844e362ae3abfe13b775dbaee3
- Cross-implementation maintainer evidence: https://github.com/openai/codex/commit/f6976ab0369921a59e23416083587149807d8f93
- Evidence level: `merged_maintainer_change`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a long-running agent is serialized, resumed or forked into another workspace, what must remain stable so state reattaches to the intended execution principal, and what must be re-evaluated so identity continuity does not silently become authority continuity?

## Problem

Durable agents need continuity across process and workspace transitions. But two different failures appear if continuity is implemented too loosely.

First, persisted state can reattach to the wrong in-memory agent when names collide, object identities change or graph traversal order changes. Approvals, tool-use state or sandbox state may then belong to a different logical principal after restore.

Second, a system can solve identity continuity correctly and still make an authorization error by treating a fork or workspace transition as transparent. A destination checkout can have different trust, developer instructions, configuration, permission profile or runtime conditions. Copying history or identity into it must not automatically authorize execution there.

The two selected implementations expose complementary halves of the boundary: OpenAI Agents SDK builds stable agent-graph identities for durable state; Codex treats managed-worktree transitions as a re-admission point against destination facts.

## OpenAI Agents SDK: Stable Identity Is Derived from the Reachable Agent Graph

Commit `4a11d20d126ebc844e362ae3abfe13b775dbaee3` extracts a dedicated stable identity layer shared by RunState, tool tracking and sandbox resume.

The graph walk is breadth-first and cycle-safe. It follows ordinary handoffs and also includes agents used as tools so nested-agent approvals and owned state remain reachable after serialization. Runtime object `id()` is used only to avoid loops during the live traversal; it is not the durable identity written into the snapshot.

For duplicate names, the implementation derives a deterministic signature from stable agent configuration and allocates collision-safe keys such as `duplicate`, `duplicate#2`, and so on. Literal suffix names are reserved so a generated duplicate identity cannot collide with an agent actually named `sandbox#2`.

The signature includes such inputs as instructions, prompt/model settings, tool-use behavior, tools, handoffs, MCP configuration, guardrails, capabilities and related normalized configuration. Collections are normalized and sorted where order should not define identity. Tests explicitly reorder otherwise equivalent duplicate-name graphs and verify that the same logical agents retain the same identities.

## Runtime-Only Session Objects Are Not the Principal Identity

The implementation deliberately distinguishes principal-defining configuration from transient runtime resources. Capability identity includes configuration but excludes the currently bound sandbox session and synchronization objects. A test binds equivalent capabilities to different sandbox sessions and confirms that identical capability configuration produces the same identity while different capability configuration produces different identities.

This is an important boundary: a durable principal should not change merely because a process received a new lock object or a resumed sandbox session instance. At the same time, the sandbox subsystem persists its own session-resume state separately and uses the stable agent identity to decide which agent-owned session payload should be reattached.

The sandbox manager also verifies backend identity and processes resumed manifests through mount/provenance validation before resuming a session. Stable principal identity therefore helps locate state; it is not itself a blanket grant to trust every serialized resource.

## RunState and Tool Tracking Bind Owned State to the Stable Identity

RunState schema version history explicitly records support for duplicate-name agent identities across agent-owned state and sandbox resume. The tests demonstrate several concrete restore invariants:

- two distinct agents with the same name serialize the active one with an identity key and restore the same logical agent;
- reordering the reachable graph does not swap duplicate agents when their stable signatures differ;
- a missing saved duplicate identity raises `UserError` instead of silently binding the snapshot to the remaining same-name agent;
- `RunResult.to_state()` preserves the root graph, current duplicate agent, pending approval interruption and generated tool-call ownership;
- tool-use tracking serializes by stable agent identity when the starting graph is available and hydrates the corresponding logical agent on restore.

These tests show a fail-closed preference when an identity-aware snapshot names a principal that the restored graph no longer contains.

## Codex: A Worktree Fork Is a Re-admission Boundary

Codex commit `f6976ab0369921a59e23416083587149807d8f93` adds managed-worktree transitions for new and forked conversations. The implementation does not treat a checkout change as a transparent filesystem move.

Before creating a managed worktree, Codex requires the feature to be enabled, rejects an explicitly untrusted source, restricts the operation to local sessions, and requires an idle primary session without queued input. During the transition it rebuilds configuration for the destination directory and requires the destination to have an established trust level.

For a **fork**, developer instructions in the destination are compared with the current source instructions. If they differ, Codex refuses to fork history into the destination and instructs the user how to remove the unused checkout. Permission-profile and approval-policy compatibility are also checked rather than assumed.

The transition is further blocked by other active agents, MCP inventory loading, unsaved conversation history in the fork case, and active background terminals. These are lifecycle/readiness gates, not identity checks.

## History Continuity Is Conditional, Not Universal

The managed-worktree implementation distinguishes `New` from `Fork`:

- a new worktree starts a fresh thread;
- a fork preserves history only when a resumable rollout exists and the compatibility gates pass.

The destination configuration is actually loaded and applied. The resulting replacement session is checked against the requested destination working directory, workspace roots, approval policy, approvals reviewer and active permission profile. If the resulting session does not match those requested facts, the transition is rejected.

Only after a valid replacement thread exists does the worktree manager bind checkout ownership to that replacement thread ID. Tests verify destination configuration, worktree ownership, forked versus fresh history and refusal on developer-instruction mismatch.

This produces a clear separation: conversation history can be continuous while execution authority is re-evaluated against the destination.

## Four Different State Dimensions

The combined evidence supports separating at least four concepts:

1. **Stable principal identity** — which logical agent in a durable graph owns the state.
2. **State continuity** — which RunState, tool-use, approval interruption and sandbox-resume facts are restored for that principal.
3. **Destination compatibility** — whether the target workspace/configuration can safely receive the transition.
4. **Execution authority** — whether trust, permission profile, approval policy, lifecycle state and other admission conditions authorize work in that destination now.

A stable identity is necessary for correct restoration, but it does not answer the other three questions by itself.

## Failure Modes Exposed by the Implementations

### Same-name principal collision

Persisted state is keyed only by display name, so a restore can bind approvals or tool state to the wrong duplicate agent.

### Traversal-order identity

Identity is assigned from incidental graph traversal order, so rearranging handoffs changes which logical agent receives a persisted suffix key.

### Session-object identity

A transient sandbox/session object becomes part of principal identity, causing the same logical principal to appear different after process restart.

### Identity-authority collapse

A system correctly recognizes the same principal after a fork and therefore assumes the principal may execute in the destination without rechecking destination trust and policy.

### History-authority inheritance

Conversation history is copied into a new workspace despite incompatible developer instructions or permission settings, effectively transporting execution assumptions into a different policy context.

### Rebind-without-verification

A newly created thread is accepted without verifying that it actually has the requested cwd, workspace roots, approval policy and permission profile.

## Evidence Strength

Both sources are merged maintainer changes with inspectable implementation and targeted tests. The Agents SDK source is strong evidence for deterministic identity construction, collision handling and durable RunState/tool/sandbox binding in that SDK. The Codex source is strong evidence that managed-worktree transitions are explicitly gated by trust, destination configuration, idle/session conditions and permission compatibility.

They are separate repositories and runtime implementations, but they are from the same vendor. The comparison is therefore cross-implementation rather than independent multi-vendor confirmation. It supports a reusable problem decomposition, not a universal standard for agent identity or workspace authority.

## Limits and Unknowns

- The Agents SDK identity is deterministic within its modeled graph/configuration inputs; it is not a cryptographic principal identity or proof of a named human/organization.
- Some stable-signature tie breaking ultimately needs an original index when otherwise indistinguishable agents remain structurally identical. The implementation does not prove a globally unique identity across independently constructed heterogeneous runtimes.
- Excluding bound runtime sessions from principal identity is intentional; it does not mean sandbox state is irrelevant to authorization. Sandbox resume has its own backend, manifest and provenance checks.
- The inspected Agents SDK tests establish restoration behavior for covered agent, tool and sandbox cases; they do not prove every future capability or custom extension has a complete stable signature.
- Codex managed worktrees cover a local Git/worktree transition. The evidence does not prove equivalent re-admission behavior for every remote workspace, container, VM or cloud-agent migration.
- A trusted destination and compatible configuration do not prove that every downstream external tool call is authorized; call-time target authorization remains a separate layer.
- Same-vendor evidence cannot establish interoperability or shared identity semantics across unrelated agent frameworks.
- Neither implementation proves exactly-once side effects across resume/fork. Persisted principal identity and admission do not replace effect receipts or idempotency.

## Unresolved Questions

1. What minimum identity signature should be standardized across multi-agent runtimes without accidentally embedding ephemeral process state?
2. Which state classes may follow a principal automatically, and which require independent re-admission on every workspace/session transition?
3. Should authorization receipts bind both the stable principal identity and a destination workspace/configuration identity?
4. How should a runtime handle two genuinely indistinguishable same-name agents that have identical configuration but represent different organizational responsibilities?
5. Which destination changes—trust, developer instructions, model, tool set, permission profile, workspace root, external credentials—must invalidate resumable authority?

## Reading Conclusion

The selected evidence supports a bounded rule: **durable state needs stable principal identity, while workspace and session transitions need destination re-admission.** OpenAI Agents SDK shows how durable identity can be derived from the reachable agent graph and reused to restore RunState, tool tracking and sandbox ownership without depending on transient object identity. Codex independently shows that carrying a conversation into a managed worktree is conditional on destination trust, configuration, lifecycle readiness and permission compatibility, with fork history refused when developer instructions differ. Analysis may therefore distinguish principal identity, state continuity, destination compatibility and execution authority. The sources do not justify treating identity continuity as permission continuity, nor do they establish a universal cross-vendor identity scheme.
