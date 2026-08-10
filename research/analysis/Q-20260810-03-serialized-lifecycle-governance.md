---
schema: "research-analysis/v1"
id: "AN-20260810-03"
date: "2026-08-10"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260810-03"
column: "open-source-engineering"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260810-03-mcp-lifecycle-serialization.md"
output_contract: "Research Object"
research_object: "Serialized Lifecycle Governance for Tool Runtimes"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Serialized Lifecycle Governance for Tool Runtimes

## Governed scope

Skill 04 analysis using only the three completed 2026-08-10 Reading Results, with Q-20260810-03 as the primary Open-source Engineering object. No unread material, article drafting, or publication work is introduced.

## Analysis

```yaml
analysis:
  observations:
    - The MCP manager race was caused by independently callable lifecycle operations mutating shared manager/worker state concurrently; commands could be enqueued after cleanup while the worker had already exited.
    - The merged repair puts one manager-level lock above public connect, reconnect, and cleanup transitions, preserves one cleanup future across callers, shields cleanup ownership from caller cancellation, and waits for a stopping worker before replacement.
    - Connect and cleanup operations have finite 10-second defaults unless applications explicitly disable timeouts, while cleanup errors remain visible rather than being erased during worker replacement.
  cross_comparison:
    - Durable input admission serializes when new operator intent becomes part of a resumed run; MCP lifecycle locking serializes when connector/tool infrastructure changes generation. Both turn ambiguous concurrency into explicit transition ownership.
    - Trusted-state containment shows why state repair must reference an authoritative baseline. Preserved cleanup failure plays a similar role: the manager refuses to manufacture a false-safe clean state merely to continue reconnection.
  discussion:
    - Tool runtimes should treat connect/reconnect/cleanup as control-plane state transitions, not ordinary concurrent helper calls. Parallelism may exist inside a lifecycle phase, but phase ownership itself should be serialized.
    - Cancellation is not equivalent to cleanup completion. If a caller disappears, infrastructure cleanup may still need durable/task-owned execution so the next generation cannot begin against partially torn-down resources.
    - A lock without bounded protected operations can convert races into indefinite queueing. Serialization therefore needs time budgets, observable wait/cleanup state, and an explicit recovery policy after timeout or terminal cleanup failure.
    - Safety-first replacement is preferable for Digital Employee infrastructure: when cleanup outcome is unknown or failed, quarantine/restart/escalation is more governable than silently creating another connection generation.
  research_judgment:
    - Shared tool/connector runtimes should expose one serialized lifecycle authority per managed resource domain, with explicit generation boundaries and no concurrent teardown/reconnect mutation.
    - Cleanup ownership should outlive an individual caller cancellation when resource safety requires completion, but the operation must remain bounded and observable.
    - Terminal cleanup errors should be preserved as governance state and block unsafe replacement until an explicit recovery action is chosen.
  engineering_impact:
    digital_employee:
      - Treat browser, MCP, credential session, and external-tool runtimes as managed resources with lifecycle owner, generation id, timeout, cleanup status, and recovery policy.
      - Do not let two workflow branches independently reconnect or tear down the same managed tool resource.
    codeflowmu:
      - Add a per-resource lifecycle mutex/lease above adapter-specific workers and preserve cleanup/reconnect transitions in the operation log.
      - Use finite connect/cleanup deadlines by default and expose wait duration, timeout, retained cleanup failure, and generation replacement events.
      - Fence new worker/tool generations until the previous generation is confirmed stopped or explicitly force-recovered by policy.
    tmpa:
      - Treat this as engineering evidence for bounded ownership transitions; no TMPA protocol change follows from one library implementation.
  limitations:
    - The serialization boundary is process/manager-local and does not coordinate replicas across hosts.
    - Finite lifecycle guarantees disappear if applications explicitly configure timeouts as unbounded.
    - Controlled regression servers do not cover every real subprocess, transport, shutdown, or OS-level failure mode.
  future_questions:
    - Should lifecycle lock acquisition have its own deadline distinct from connect/cleanup deadlines?
    - What fencing token or generation id is required when multiple processes can address the same external resource?
    - Which terminal cleanup failures should require quarantine, process restart, operator approval, or force-replace?
```

## Research judgment

For tool infrastructure, **serialization is a governance boundary, not merely a concurrency fix**. One owner must order lifecycle transitions, cleanup must remain accountable across cancellation, waits must be bounded, and failed teardown must remain visible so a new generation cannot start from a fabricated clean state.

## Evidence boundary

- `research/reading/Q-20260810-01-durable-runstate-pending-input.md`
- `research/reading/Q-20260810-02-trusted-state-cascade-containment.md`
- `research/reading/Q-20260810-03-mcp-lifecycle-serialization.md`
