---
schema: "research-analysis/v1"
id: "AN-20260806-01"
date: "2026-08-06"
timezone: "Asia/Shanghai"
repository: "joinwell52-AI/joinwell52"
queue_item: "Q-20260806-01"
column: "digital-employee"
transition: "Reading -> Analysis"
skill: "Skill 04 — Research Analysis"
input_contract: "Reading Result"
input_reading: "research/reading/Q-20260806-01-revisable-dag-computer-use.md"
output_contract: "Research Object"
research_object: "Governed Revisable Work Graph"
status: "ReadyForProduction"
production_input_authorized: true
publication_authorized: false
---

# Research Object — Governed Revisable Work Graph for Computer-use Digital Employees

## Governed scope

This object consumes only the completed Reading Result for `Q-20260806-01`. It performs Skill 04 Research Analysis and produces a Production-ready Research Object. It does not introduce unread material, draft publication copy, prescribe a complete implementation, or authorize release.

## Analysis

```yaml
analysis:
  observations:
    - The Reading Result shows a manager maintaining an open-ended DAG, dispatching the ready frontier and revising pending nodes after worker results reveal new dependencies.
    - The implementation persists the dependency graph, snapshots, replanning log, summaries, final results and per-subtask execution metadata, so the plan is treated as mutable runtime state rather than a one-time prompt.
    - Parallelism improves some reported success and wall-clock results, but the effect is not uniform: one benchmark is reported slower than the single-agent configuration.
    - Worker findings and produced files are transferred through manager state, downstream instructions and an archive pool because later workers may not be able to re-observe the original interface state.
    - The source does not provide durable capability authorization, transactional side-effect control, independent completion verification or an enterprise audit protocol.
  cross_comparison:
    - A revisable work graph governs decomposition and dependency adaptation; the same-day enterprise-control-plane Reading Result governs policy and enforcement, while the rollout-migration Reading Result governs semantic persistence and recovery.
    - A graph snapshot explains what the manager believed the plan to be, but it is not equivalent to a custody, approval or evidence ledger.
    - Parallel ready-frontier execution resembles workflow scheduling, but computer-use workers can create external side effects, making concurrency control materially different from parallel read-only research.
    - Compared with a linear agent trace, the DAG improves explicit dependency structure and parallel opportunity while adding a central manager bottleneck, coordination cost and more failure surfaces.
  discussion:
    - The structurally important change is not “more agents”; it is making the work plan revisable, inspectable and replayable while execution is underway.
    - The causal mechanism supported by the Reading Result is that newly discovered dependencies can be inserted into the graph, independent ready nodes can run concurrently, and findings can be carried forward when the interface no longer exposes them.
    - For a governed Digital Employee, the DAG should be an operational planning projection, not the sole authority for task state. Node acceptance, permissions and external effects require separate records and decision rights.
    - Useful concurrency requires proving that nodes are independent not only in data dependency but also in application ownership, file access and side-effect scope.
    - The reusable SME pattern is a small revisable graph with explicit node inputs, outputs, dependencies, evidence requirements and approval points; the benchmark implementation and manager-model cost are not automatically transferable.
  research_judgment:
    - A computer-use Digital Employee should represent long work as a versioned, revisable work graph whose mutations are durable and attributable, rather than as a hidden linear plan.
    - A node may enter the ready frontier only when both dependency and authority conditions are satisfied; graph readiness alone is insufficient for consequential side effects.
    - Manager completion must remain a claim. Node and job acceptance require evidence contracts and an independent authority capable of rejecting the manager's interpretation.
    - CodeFlowMu should adopt the separation between mutable orchestration state and governed protocol state before considering broad parallel computer-use execution.
  uncertainty:
    - Confidence is high that mutable dependency state is structurally useful for partially observable long-horizon work.
    - Confidence is medium that the reported benchmark gains transfer to heterogeneous enterprise workers with different permissions, skills and costs.
    - Confidence is low that the source establishes safe concurrent side effects, crash-exact recovery or accountable completion in production Digital Employee environments.
  counter_evidence:
    - Reported wall-clock improvement is not universal and one benchmark is slower under the multi-agent configuration.
    - Several evaluations use LLM or rubric judges rather than deterministic environment checks.
    - The manager remains a central planning and interpretation authority and may become a bottleneck or single point of error.
    - The evidence does not demonstrate compensation, idempotency, capability authorization or independent completion verification.
  engineering_impact:
    tmpa:
      - No TMPA Core change is justified by this single Reading Result.
      - Portable semantics may later be represented as a profile containing work-graph version, node identity, dependency edges, mutation events and evidence references, but only after runtime validation.
    digital_employee:
      - WorkOrder execution should project a revisable graph with node responsibility, dependencies, required skills, authority boundary, expected artifacts and completion evidence.
      - Graph mutation should be an explicit event with actor, reason, before/after version and affected pending nodes.
      - Concurrent nodes should require resource and side-effect isolation checks in addition to dependency readiness.
      - Findings and files passed between workers need provenance and retention rules so partial observability does not become untraceable context copying.
    codeflowmu:
      - Keep FCoP TASK/REPORT/REVIEW state authoritative while exposing a separate mutable project/work graph for orchestration.
      - Add graph-version and mutation projections before adding unrestricted parallel execution.
      - Require per-node evidence receipts and independent QA/EVAL or ADMIN acceptance for consequential completion.
      - Recovery should rebuild graph state from durable events and preserved artifacts without re-running already committed external effects.
  limitations:
    - The primary research object is a June 2026 preprint with one explicitly recorded PDF-access limitation.
    - The analysis does not validate the official implementation independently or reproduce its benchmark results.
    - No enterprise permission model, transaction boundary, race-control mechanism or recovery experiment is available in the Reading Result.
    - Cost, latency and operator-comprehension effects for SMEs remain unmeasured.
  future_questions:
    - What minimum graph-mutation contract preserves auditability without turning the runtime into a complex workflow engine?
    - How should readiness combine data dependencies, capability permissions, application locks and human approvals?
    - Which evidence proves that a completed node remains valid after downstream graph rewiring?
    - How can recovery distinguish safe replay from an external side effect that already occurred?
```

## Research judgment

The Production-relevant object is:

> Treat the revisable DAG as a versioned orchestration projection, and require separate authority, evidence and side-effect controls before its nodes or manager conclusions become accepted Digital Employee state.

This is an inference from the completed Reading Result and remains bounded by the preprint, benchmark and governance limitations recorded above.

## Production input

Production may consume this Research Object to explain governed revisable orchestration. It must preserve the non-uniform performance result, the central-manager risk, the benchmark scope and the distinction between graph readiness and authorized execution.

## Evidence boundary

- `research/reading/Q-20260806-01-revisable-dag-computer-use.md`

No other source was consumed by this Analysis object.
