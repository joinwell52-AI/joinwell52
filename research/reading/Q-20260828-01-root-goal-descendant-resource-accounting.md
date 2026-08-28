# Q-20260828-01 — Root-Goal Descendant Resource Accounting

- Runtime date: 2026-08-28 (Asia/Shanghai)
- Queue signal: SIG-20260828-019
- Primary source: https://github.com/openai/codex/commit/4761851ff35c4ebdd35eb8801e1180a0a50fef60
- Evidence level: `merged_maintainer_change`
- Scope: OpenAI Codex goal accounting for delegated subagents, nested descendants, active/idle token accounting, root-goal budget limits and accounting checkpoints

## Problem

A root agent can delegate work to child and nested subagents while the root goal remains the unit that owns the user-visible objective and its token budget. If descendant token use is accounted only inside each child runtime, delegation becomes an accounting escape hatch: the root goal can appear to stay under budget while work performed on its behalf consumes additional tokens. The same escape can occur while the root is idle or when an intermediate parent runtime is no longer loaded.

## Facts

The merged Codex change introduces a root accounting reference into each goal runtime. When a non-root thread starts, the extension resolves a parent runtime from the declared parent thread ID or root session thread ID. It then carries forward the parent's own root accounting state when one already exists; otherwise it uses the parent's accounting state as the root. This makes nested descendants point at the same root accounting accumulator rather than opening independent accounting islands.

On every descendant token-usage event, Codex records the descendant's latest usage increment into the root accounting state. The root keeps this usage in an atomic cumulative counter. Active progress snapshots compute the newly observed descendant delta since the last accounted baseline and add it to the root turn's own token delta. Idle progress snapshots also calculate a descendant delta and can produce accountable progress even when no new wall-clock second has elapsed, so descendant work is not hidden merely because the root agent is idle.

The accounting baseline is reset when the active goal changes. This prevents descendant usage accumulated before a replacement goal from being charged to the replacement. Checkpoint application stores the descendant counter value captured by that snapshot rather than blindly advancing to the latest value. As a result, descendant usage recorded concurrently after a snapshot remains pending for the next accounting pass rather than being lost.

The integration coverage demonstrates a root goal with a 62-token budget receiving root, child and grandchild usage. The combined accounting reaches exactly 62 and transitions the goal to `BudgetLimited`. Another test stops/unloads an intermediate child runtime and then records grandchild usage; the grandchild still rolls 23 tokens into the root goal. A replacement-goal test shows pre-existing descendant usage is excluded from the new goal and only post-replacement usage is charged. Resume/idle coverage shows descendant usage is also added during idle accounting.

The change preserves the existing behavior that a budget-limited goal can continue accruing already-occurring progress until the relevant turn/accounting boundary closes. The selected change therefore proves budget attribution and budget-state transition; it does not prove that hitting the token budget synchronously kills every running descendant.

## Vendor Claims

The maintainer states that the change rolls token usage from spawned descendants, including nested subagents, into the root goal, applies it during active and idle accounting, resets descendant baselines when the active goal changes, and preserves concurrently recorded usage across checkpoints. The changed implementation and regression tests directly support those bounded claims.

## Mechanisms

1. **Shared root accounting identity:** child and nested subagent runtimes resolve to a common `root_accounting_state`.
2. **Incremental descendant usage:** descendant token events contribute only their latest usage increment to a root cumulative counter.
3. **Active accounting merge:** root turn progress adds the unaccounted descendant delta to local root usage.
4. **Idle accounting merge:** descendant deltas can trigger root-goal accounting even while the root has no active token-progress event.
5. **Goal-change rebasing:** changing the active goal moves the descendant baseline to the current cumulative counter, preventing historical descendant usage from leaking into the replacement goal.
6. **Checkpoint-safe baselines:** an accounting checkpoint advances the baseline to the snapshot value, so usage arriving after the snapshot survives for the next pass.
7. **Nested-runtime resilience:** a grandchild retains the root accounting reference even after an intermediate parent runtime unloads.
8. **Root budget enforcement:** combined root and descendant usage participates in the existing token-budget transition to `BudgetLimited`.

## Evidence

Primary evidence is merged OpenAI Codex maintainer commit `4761851ff35c4ebdd35eb8801e1180a0a50fef60`. The key changed files are `codex-rs/ext/goal/src/accounting.rs`, `api.rs`, `extension.rs`, `runtime.rs`, and the goal accounting/integration tests.

`extension.rs` resolves a root accounting state for non-root sessions and routes descendant token usage to that root state. `accounting.rs` adds the cumulative descendant counter, active/idle deltas and baseline semantics. `runtime.rs` passes idle descendant token deltas into persisted goal accounting. The integration tests cover child/grandchild roll-up, root budget exhaustion, unloaded parent runtimes, goal replacement, idle accounting and concurrent checkpoint preservation.

## Limitations

The demonstrated resource is token usage. This change does not establish a general inherited budget for wall-clock time, network requests, tool invocations, monetary cost, memory, process count or other resources.

The root accounting pointer is runtime state, not a cryptographic delegation receipt. The selected evidence proves the shown Codex runtime path, not a distributed accounting protocol across independent hosts.

`BudgetLimited` is an accounting state transition. The tests show usage can continue to accrue through later tool/turn accounting boundaries; the selected change does not demonstrate immediate cancellation of every active descendant when the root budget is exhausted.

The commit does not expose a complete descendant cancellation/revocation protocol. Whether already-running nested work is synchronously interrupted, allowed to finish, or separately cancelled after the root reaches its limit is not established here and remains Unknown.

Atomic cumulative counting prevents the demonstrated concurrent-checkpoint loss, but it does not by itself provide transactional exactly-once accounting across process crashes or external persistence boundaries.

## Comparisons

Per-agent accounting alone answers “how much did this worker consume?” but permits delegation to move cost outside the root objective's budget. The changed model adds an ownership view: descendant usage still originates at the child runtime, but the root goal receives an inherited accounting charge. This is closer to hierarchical resource ownership than independent worker quotas.

A simple recursive sum performed only when a root turn ends would miss long-running/idle descendants and would be fragile when intermediate runtimes unload. Codex instead pushes descendant increments into a shared root accumulator and consumes deltas at active and idle progress checkpoints.

## Unresolved Questions

- Does root budget exhaustion initiate explicit cancellation or admission denial for already-running descendants, and at what lifecycle boundary?
- Are future non-token budgets intended to use the same root accounting identity?
- How is descendant usage recovered if a process crashes after model usage is observed but before the root accumulator is durably reflected in goal state?
- Can a descendant be re-parented, and if so how is its accounting root changed without double charging or losing pending usage?
- Is there an externally inspectable breakdown of root versus child versus grandchild usage for audit, beyond the aggregate root-goal total?

## Reading Conclusion

The selected Codex change closes a concrete delegation accounting gap: token usage from child and nested subagents is rebound to the root goal that owns the work, participates in both active and idle accounting, survives an unloaded intermediate parent, respects goal replacement boundaries and contributes to root token-budget exhaustion. The evidence supports hierarchical token attribution and root budget enforcement. It does not establish immediate descendant cancellation, generalized multi-resource budgets or distributed exactly-once accounting.
