# Q-20260913-01 — Aligned Recovery Stops at the Controlled State Boundary

- Runtime date: 2026-09-13 (Asia/Shanghai)
- Queue signal: SIG-20260913-005
- Primary research source: https://arxiv.org/abs/2608.14380
- Primary implementation source: https://github.com/Futuresis/replay-agent-recorder
- Benchmark source: https://github.com/Kelvin-Coffee/MettleBench
- Evidence level: `peer_reviewed_or_primary_research`
- Status: `ReadyForAnalysis`
- Publication authorized: `false`

## Research Question

When a long-horizon agent rewinds after failure, what state must be restored at the same causal boundary for the resumed trajectory to be internally consistent, and where does that recovery guarantee stop once effects have escaped the controlled environment?

## Why This Reading Is Distinct from the September 3 Reading

The September 3 Reading of the same primary paper established the general result that agent context and environment state must be checkpointed together. Today's Queue selected the source again under a narrower operational question: whether that aligned checkpoint is sufficient evidence for recovery when the agent has also interacted with state outside the workspace.

This Reading therefore treats the paper's **recovery boundary** as the primary object. It does not reopen the already-established conclusion that context-only or environment-only restoration is inconsistent; it asks what the demonstrated mechanism can and cannot undo.

## Primary Mechanism

*AgentRewind: Recoverable Execution for Long-Horizon LLM Agents* models each decision boundary as an aligned checkpoint `d_t = (c_t, s_t)`, where `c_t` is the agent context and `s_t` is controlled environment state. A rewind to historical checkpoint `d_k` restores both members of that pair, constructs a rewind memory from the failed suffix, injects that memory into the restored context, and starts a new suffix.

The retained prefix is reconstructed from the execution record rather than re-executed. This matters because tool calls and observations in that prefix are treated as already-happened history; the runtime does not replay those calls merely to recreate the model context.

The reference recorder implementation exposes the same basic model as an execution timeline with snapshots, revert operations and tree-like branching. MettleBench supplies the long-horizon evaluation environment: 82 engineering tasks with ordered executable acceptance criteria and shared state across criteria.

## Evaluation Evidence

MettleBench measures final task success and longest satisfied checklist prefix. The benchmark is deliberately stateful: later work can break an earlier criterion, so partial progress is not just an additive count of independent subtasks.

The Continue baselines reported for the six evaluated model routes show substantial long-horizon failure even when forward execution is allowed to continue: GPT-5.4 reports 62.2% task success and 81.4% checklist progress; GPT-5.4 mini 33.7% and 64.6%; Qwen3.7-Max 73.2% and 84.8%; Qwen3.5-27B 56.1% and 79.1%; Kimi K2.5 28.0% and 61.3%; DeepSeek-V4-Flash 37.8% and 63.6%; GLM-5.1 59.8% and 75.1%.

For the main GPT-5.4 comparison, AgentRewind reaches 87.8% task success and 94.3% checklist progress versus Continue at 62.2% and 81.4%. GPT-5.4 mini reaches 51.2% and 73.5% with AgentRewind versus Continue at 33.7% and 64.6%. The Terminal-Bench 2.0 generalization experiment reports 83.1% success / 90.2% criteria for AgentRewind, 78.7% / 88.7% for Continue and 70.8% / 79.2% for Restart with Experiences.

These results support recovery utility inside the evaluated harness. They do not by themselves establish recovery correctness for arbitrary business effects.

## The Controlled Recovery Boundary

The paper's environment rewind is explicitly bounded to the workspace directory tree. Within that boundary, the runtime can revert later file modifications, restore deleted files and remove files created after the chosen checkpoint.

Effects outside the workspace are different. Network requests, mutations in external services, remote databases, messages, payments, credentials already consumed, or other external runtime state are not automatically reversed by restoring `s_k`.

This creates a crucial distinction:

1. **trajectory restoration** — the model context returns to the selected historical point;
2. **controlled-environment restoration** — the workspace returns to the matching state;
3. **external-effect recovery** — already-materialized effects outside that controlled environment are compensated, reversed, deduplicated or otherwise governed.

AgentRewind directly demonstrates the first two. The third requires an additional contract.

## Failure Case — A Restored Agent Can Still Face an Unrestored World

The strongest operational counterexample is a rewind after an irreversible or separately persisted external action. Suppose the failed suffix has sent a message, changed a SaaS record or invoked a remote API. Restoring the local workspace and model context can make the agent believe it has returned to the pre-call checkpoint while the remote system still contains the post-call effect.

If the resumed agent issues the call again, the system can create a duplicate side effect. If it assumes the call never happened, it can make a false decision from locally consistent but globally stale state. If it assumes the call did happen without rereading the remote target, it can also be wrong.

Therefore **local causal consistency is not global effect consistency**.

## Case Evidence — Why Aligned Restoration Still Matters

The Astropy FITS case in the paper illustrates why alignment of context and workspace is necessary even before external effects are considered. Continue follows a bad catalog-generation direction and mutates fixtures, ending at 9/10 criteria. Restart restores original state but discards useful repaired work and eventually reaches only 8/10 after many attempts. AgentRewind chooses an earlier checkpoint, retains valid library repairs, restores the fixture state, removes the bad suffix from active context, carries forward failure memory, changes the problematic setting and reaches all 34 tests / 10 criteria.

The mechanism works because cognition and controlled state refer to the same historical world after rewind. That evidence should not be enlarged into a claim that the whole external world has also returned to that checkpoint.

## Effect Identity and Recovery Evidence

A governed runtime that extends this mechanism beyond a filesystem needs an explicit effect layer. At minimum, recovery evidence may need to bind:

- stable work / attempt identity;
- occurrence identity for each external mutation;
- target identity and precondition state;
- whether an operation is replay-safe, idempotent, compensatable or irreversible;
- the durable result or acknowledgement of the original effect;
- whether compensation was attempted and verified;
- the checkpoint generation to which the effect belongs.

This is an architectural inference from the paper's stated boundary, not a feature demonstrated by AgentRewind.

## Comparison of Recovery Strategies

### Continue

Preserves all progress but also preserves the failed reasoning and mutated state. It cannot remove a harmful suffix.

### Restart with Experiences

Can reset the workspace but discards valid partial progress and detailed trajectory context. It may avoid one contamination mode at the price of repeating work and losing causal continuity.

### Safety Review

Attempts to reduce bad actions before they occur. The paper does not show it consistently outperforming recovery, and preventive review is not equivalent to restoring already-corrupted state.

### AgentRewind

Restores a selected aligned checkpoint and keeps failure-derived memory. Its strongest demonstrated guarantee is therefore **bounded recoverable execution**, not universal rollback.

## Evidence Classes

### Fact

The primary paper stores aligned context/environment checkpoints, restores the selected context and controlled workspace together, and does not automatically undo effects outside the workspace boundary.

### Research Result

Within the evaluated long-horizon engineering harnesses, AgentRewind improves final success and checklist progress over forward-only or restart baselines for the reported comparisons, and the ablations show environment rewind, context rewind and rewind memory are complementary.

### Inference

A production digital-employee runtime should pair checkpoint recovery with a separate durable external-effect ledger or equivalent authoritative effect evidence so that a restored local state cannot silently erase knowledge of an already-materialized remote action.

### Unknown

The study does not establish exactly-once semantics for external APIs, atomic rollback across multiple services, compensation correctness, cross-host checkpoint durability, or who should have organizational authority to select a rewind point.

## Limits and Negative Evidence

- The controlled environment is principally a workspace filesystem, not an enterprise-wide transactional substrate.
- A retained prefix is not re-executed, but this only prevents replay by the AgentRewind harness; it does not reverse an external effect caused before rewind.
- Rewind memory is model-generated and is not independently guaranteed to be complete or truthful.
- The benchmark's ordered criteria are valuable for long-horizon state interaction but remain engineering-task acceptance criteria, not business transaction proofs.
- Better benchmark success does not imply that a resumed action is currently authorized.
- The paper does not solve concurrent recovery where multiple workers may have observed or changed the same external target.

## Unresolved Questions

1. What durable occurrence identity should link an external side effect to the exact checkpoint generation that caused it?
2. Before a resumed worker retries an external action, which authoritative target state must be reread?
3. How should recovery distinguish replay-safe, idempotent, compensatable and irreversible operations?
4. Who may choose or approve a rewind when doing so changes which evidence remains in the worker's active context?
5. How should cross-host recovery prove that the restored workspace, model context and external-effect ledger belong to the same causal generation?
6. Can compensation itself be retried safely after response loss or partial failure?

## Reading Conclusion

The source-complete evidence supports a bounded conclusion: **long-horizon recovery needs agent context and controlled environment state aligned at the same checkpoint, but that alignment stops where the controlled state boundary stops**. Restoring the local trajectory can make a worker internally consistent while leaving remote business effects unchanged. A governed runtime therefore needs to preserve external-effect identity and recovery evidence separately from checkpoint state before it can claim end-to-end recovery.

This Reading Note performs evidence extraction only. It does not execute Research Analysis, article writing, visualization, Production or Publication.
